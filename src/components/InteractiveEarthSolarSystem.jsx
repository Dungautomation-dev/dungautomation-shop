import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Quả Địa Cầu Toàn Cầu Khổng Lồ & Hệ Mặt Trời Quay Quanh (Interactive Earth & Solar System)
 * Hỗ trợ kéo chuột tương tác xoay quả địa cầu tự do 360 độ,
 * có Mặt Trời, Mặt Trăng, Sao Thổ có vành đai, Sao Hỏa và các vệ tinh nhân tạo quay quanh quỹ đạo.
 */
export function InteractiveEarthSolarSystem({ onSelect }) {
  const earthGroupRef = useRef()
  const earthMeshRef = useRef()
  const sunRef = useRef()
  const moonRef = useRef()
  const saturnRef = useRef()
  const marsRef = useRef()
  const satelliteRef = useRef()

  // Trạng thái kéo chuột tương tác xoay địa cầu
  const isDraggingRef = useRef(false)
  const prevPointerX = useRef(0)
  const prevPointerY = useRef(0)
  const spinVelocityX = useRef(0)
  const spinVelocityY = useRef(0.003) // Tốc độ tự xoay mặc định

  // 1. Tạo texture bề mặt Trái Đất độ phân giải cao 2048x1024 bằng HTML5 Canvas
  const earthTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 2048
    cvs.height = 1024
    const ctx = cvs.getContext('2d')

    // Đại dương xanh thẳm
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024)
    oceanGrad.addColorStop(0, '#04172e')
    oceanGrad.addColorStop(0.5, '#0a3663')
    oceanGrad.addColorStop(1, '#04172e')
    ctx.fillStyle = oceanGrad
    ctx.fillRect(0, 0, 2048, 1024)

    // Lưới kinh tuyến & vĩ tuyến toàn cầu (Coordinate Grid)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.18)'
    ctx.lineWidth = 1
    for (let x = 0; x < 2048; x += 128) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
    }
    for (let y = 0; y < 1024; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke()
    }

    // Vẽ cách điệu các mảng lục địa Châu Á, Âu, Phi, Mỹ, Đại Dương
    const drawLandmass = (cx, cy, rx, ry, col) => {
      ctx.fillStyle = col
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0.2, 0, Math.PI * 2)
      ctx.fill()
      // Bờ biển phát quang nhẹ
      ctx.strokeStyle = '#00f3ff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Châu Á & Việt Nam
    drawLandmass(1400, 380, 260, 160, '#10b981')
    drawLandmass(1480, 480, 70, 90, '#059669') // Đông Nam Á & Biển Đông
    // Châu Âu
    drawLandmass(1050, 280, 140, 100, '#059669')
    // Châu Phi
    drawLandmass(1080, 520, 160, 200, '#d97706')
    // Bắc Mỹ
    drawLandmass(480, 320, 240, 140, '#10b981')
    // Nam Mỹ
    drawLandmass(620, 650, 140, 220, '#059669')
    // Châu Úc
    drawLandmass(1650, 720, 130, 110, '#d97706')
    // Bắc Cực & Nam Cực băng tuyết
    drawLandmass(1024, 60, 600, 50, '#f8fafc')
    drawLandmass(1024, 980, 700, 40, '#f8fafc')

    // Các dải mây trắng khí quyển xoáy
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    for (let c = 0; c < 12; c++) {
      ctx.beginPath()
      ctx.ellipse(200 + c * 160, 350 + Math.sin(c) * 120, 110, 25, 0.1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Điểm mốc Tọa độ Hà Nội - Showroom DungAutomation phát sáng vàng rực
    ctx.fillStyle = '#facc15'
    ctx.shadowColor = '#facc15'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.arc(1460, 440, 9, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px "JetBrains Mono", monospace'
    ctx.fillText('★ HÀ NỘI (DATECO)', 1480, 446)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 2. Texture vành đai Sao Thổ (Saturn Ring Texture)
  const saturnRingTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 64
    const ctx = cvs.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 512, 0)
    grad.addColorStop(0, 'rgba(217, 119, 6, 0)')
    grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.8)')
    grad.addColorStop(0.6, 'rgba(254, 240, 138, 0.9)')
    grad.addColorStop(0.8, 'rgba(217, 119, 6, 0.6)')
    grad.addColorStop(1, 'rgba(217, 119, 6, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 64)
    return new THREE.CanvasTexture(cvs)
  }, [])

  // Chu trình hoạt ảnh thiên thể & quán tính xoay tương tác của Địa Cầu
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    // Quán tính xoay của Quả Địa Cầu khi không tương tác
    if (earthMeshRef.current) {
      if (!isDraggingRef.current) {
        earthMeshRef.current.rotation.y += spinVelocityY.current
        earthMeshRef.current.rotation.x += spinVelocityX.current
        // Giảm dần vận tốc kéo về tốc độ tự xoay bình thường
        spinVelocityX.current *= 0.95
        spinVelocityY.current = THREE.MathUtils.lerp(spinVelocityY.current, 0.003, 0.05)
      }
    }

    // Quỹ đạo Mặt Trời (The Sun) quay quanh Địa Cầu
    if (sunRef.current) {
      const sunAngle = t * 0.4
      const sunDist = 11.5
      sunRef.current.position.set(
        Math.cos(sunAngle) * sunDist,
        Math.sin(sunAngle * 0.5) * 3.5,
        Math.sin(sunAngle) * sunDist
      )
    }

    // Quỹ đạo Mặt Trăng (The Moon)
    if (moonRef.current) {
      const moonAngle = t * 0.85
      const moonDist = 6.8
      moonRef.current.position.set(
        Math.cos(moonAngle) * moonDist,
        Math.sin(moonAngle) * 2.2,
        Math.sin(moonAngle) * moonDist
      )
    }

    // Quỹ đạo Sao Thổ (Saturn)
    if (saturnRef.current) {
      const saturnAngle = t * 0.22 + 2.0
      const saturnDist = 16.5
      saturnRef.current.position.set(
        Math.cos(saturnAngle) * saturnDist,
        Math.sin(saturnAngle) * 4.5,
        Math.sin(saturnAngle) * saturnDist
      )
    }

    // Quỹ đạo Sao Hỏa (Mars)
    if (marsRef.current) {
      const marsAngle = t * 0.32 + 4.0
      const marsDist = 13.8
      marsRef.current.position.set(
        Math.cos(marsAngle) * marsDist,
        -Math.sin(marsAngle) * 3.0,
        Math.sin(marsAngle) * marsDist
      )
    }

    // Vệ tinh viễn thông Dateco Orbit Satellite
    if (satelliteRef.current) {
      const satAngle = t * 1.5
      const satDist = 5.2
      satelliteRef.current.position.set(
        Math.cos(satAngle) * satDist,
        Math.sin(satAngle) * 4.2,
        Math.sin(satAngle) * satDist
      )
      satelliteRef.current.rotation.y = satAngle + Math.PI / 2
    }
  })

  // Xử lý sự kiện kéo chuột xoay Trái Đất (Pointer Events)
  const handlePointerDown = (e) => {
    e.stopPropagation()
    isDraggingRef.current = true
    prevPointerX.current = e.clientX
    prevPointerY.current = e.clientY
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !earthMeshRef.current) return
    e.stopPropagation()
    const deltaX = e.clientX - prevPointerX.current
    const deltaY = e.clientY - prevPointerY.current
    prevPointerX.current = e.clientX
    prevPointerY.current = e.clientY

    // Cập nhật góc quay theo cử chỉ chuột
    const sensitivity = 0.006
    earthMeshRef.current.rotation.y += deltaX * sensitivity
    earthMeshRef.current.rotation.x += deltaY * sensitivity

    spinVelocityY.current = deltaX * sensitivity
    spinVelocityX.current = deltaY * sensitivity
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  return (
    <group
      ref={earthGroupRef}
      position={[0, 24, -28]} // Đặt hoành tráng trên nền trời diorama
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* ================= 1. QUẢ ĐỊA CẦU KHỔNG LỒ TƯƠNG TÁC (INTERACTIVE EARTH) ================= */}
      <group
        ref={earthMeshRef}
        onPointerDown={handlePointerDown}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'interactive-earth',
            title: 'Quả Địa Cầu Số Hóa & Trạm Vệ Tinh Dateco Global IoT',
            category: 'Global Telemetry & Space Systems',
            price: 'Công nghệ: Giám sát toàn cầu thời gian thực',
            specs: [
              'Quả Địa Cầu tương tác 3D: Dùng chuột bấm giữ và kéo để xoay tự do 360° theo ý muốn',
              'Hiển thị định vị trạm tự động hóa Dateco tại Hà Nội và mạng lưới phân phối toàn cầu',
              'Mô phỏng Hệ Mặt Trời: Mặt Trời, Mặt Trăng, Sao Thổ có vành đai và Sao Hỏa quay quanh',
              'Kết nối vệ tinh viễn thông LEO truyền dữ liệu SCADA đám mây cho các trạm biến áp Dateco'
            ],
            desc: 'Mô hình Quả Địa Cầu không gian biểu trưng cho tầm nhìn vươn tầm thế giới của Dateco và Dũng Automation, mang công nghệ Việt Nam kết nối chuỗi cung ứng công nghiệp toàn cầu.'
          })
        }}
        cursor="grab"
      >
        {/* Khối cầu Trái Đất chính (Bán kính lớn R = 4.2m) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[4.2, 48, 48]} />
          <meshStandardMaterial
            map={earthTexture}
            roughness={0.4}
            metalness={0.15}
            emissiveMap={earthTexture}
            emissive="#00f3ff"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Lớp vỏ khí quyển phát sáng xanh lơ thanh thoát (Atmosphere Glow Shell) */}
        <mesh>
          <sphereGeometry args={[4.32, 36, 36]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.18}
            roughness={0.1}
            transmission={0.6}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Trục nghiêng Trái Đất mạ vàng sang trọng */}
        <mesh rotation={[0, 0, 0.41]}>
          <cylinderGeometry args={[0.08, 0.08, 10.5, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= 2. MẶT TRỜI QUAY QUANH (THE ORBITING SUN) ================= */}
      <group ref={sunRef}>
        <mesh>
          <sphereGeometry args={[1.3, 24, 24]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Vầng hào quang mặt trời Corona */}
        <mesh>
          <sphereGeometry args={[1.55, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.35} />
        </mesh>
        {/* Nguồn sáng tỏa từ Mặt Trời chiếu rọi Địa Cầu */}
        <pointLight color="#fed7aa" intensity={3.5} distance={30} decay={2} />
      </group>

      {/* ================= 3. MẶT TRĂNG QUAY QUANH (THE MOON) ================= */}
      <group ref={moonRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
      </group>

      {/* ================= 4. SAO THỔ VÀ VÀNH ĐAI NHẪN (SATURN & RINGS) ================= */}
      <group ref={saturnRef}>
        {/* Thân hành tinh Sao Thổ */}
        <mesh castShadow>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
        {/* Vành đai nhẫn nghiêng */}
        <mesh rotation={[0.5, 0.3, 0]}>
          <ringGeometry args={[1.15, 2.1, 32]} />
          <meshStandardMaterial
            map={saturnRingTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* ================= 5. SAO HỎA (MARS) ================= */}
      <group ref={marsRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
      </group>

      {/* ================= 6. VỆ TINH VIỄN THÔNG DATECO GLOBAL IOT ================= */}
      <group ref={satelliteRef}>
        {/* Thân vệ tinh kim loại bạc */}
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.2, 0.3]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tấm pin mặt trời màu xanh bên hông */}
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.45, 0.02, 0.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.45, 0.02, 0.2]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* Đèn chớp đỏ Telemetry */}
        <pointLight position={[0, 0.15, 0]} color="#ef4444" intensity={1.2} distance={2} />
      </group>

      {/* ================= 7. CÁC ĐƯỜNG QUỸ ĐẠO THIÊN THỂ PHÁT SÁNG ================= */}
      {/* Quỹ đạo Mặt Trời */}
      <mesh rotation={[0.2, 0, 0]}>
        <torusGeometry args={[11.5, 0.025, 8, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.35} />
      </mesh>

      {/* Quỹ đạo Sao Thổ */}
      <mesh rotation={[-0.25, 0, 0.1]}>
        <torusGeometry args={[16.5, 0.025, 8, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </mesh>

      {/* Quỹ đạo Sao Hỏa */}
      <mesh rotation={[0.15, 0, -0.2]}>
        <torusGeometry args={[13.8, 0.02, 8, 64]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export default InteractiveEarthSolarSystem
