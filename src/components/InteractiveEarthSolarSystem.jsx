import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Trưng Bày Trung Tâm Showroom: Quả Địa Cầu Tương Tác 3D & Hệ Mặt Trời DATECO
 * (Indoor Showroom Centerpiece: Interactive Earth & Holographic Solar System)
 * - Tọa lạc trang trọng tại trung tâm Showroom trên bục triển lãm công nghệ cao
 * - Hỗ trợ kéo chuột tương tác xoay quả địa cầu tự do 360 độ bằng cử chỉ chuột/cảm ứng
 * - Mô phỏng Hệ Mặt Trời: Mặt Trời, Mặt Trăng, Sao Thổ có vành đai, Sao Hỏa & Vệ tinh IoT bay quanh quỹ đạo
 */
export function InteractiveEarthSolarSystem({ position = [1.2, 0, -1.5], onSelect }) {
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
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.22)'
    ctx.lineWidth = 1.2
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'
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
    ctx.arc(1460, 440, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px "JetBrains Mono", monospace'
    ctx.fillText('★ HÀ NỘI (DATECO)', 1485, 447)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 2. Texture Vành Đai Sao Thổ (Saturn Ring Texture)
  const saturnRingTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 64
    const ctx = cvs.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, 512, 0)
    grad.addColorStop(0, 'rgba(217, 119, 6, 0.1)')
    grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.85)')
    grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.95)')
    grad.addColorStop(1, 'rgba(180, 83, 9, 0.15)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 64)
    return new THREE.CanvasTexture(cvs)
  }, [])

  // 3. Chu kỳ chuyển động quỹ đạo thiên thể & xoay địa cầu
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Tự xoay quả địa cầu khi người dùng không kéo chuột
    if (!isDraggingRef.current && earthMeshRef.current) {
      earthMeshRef.current.rotation.y += spinVelocityY.current
      earthMeshRef.current.rotation.x += spinVelocityX.current
      // Giảm dần vận tốc kéo quán tính về tốc độ tự xoay êm dịu
      spinVelocityX.current *= 0.95
      spinVelocityY.current = THREE.MathUtils.lerp(spinVelocityY.current, 0.003, 0.05)
    }

    // Quỹ đạo Mặt Trời (Orbit Radius R = 2.35m)
    if (sunRef.current) {
      const sunSpeed = t * 0.45
      sunRef.current.position.x = Math.cos(sunSpeed) * 2.35
      sunRef.current.position.z = Math.sin(sunSpeed) * 2.35
      sunRef.current.position.y = 2.25 + Math.sin(sunSpeed * 2) * 0.2
    }

    // Quỹ đạo Mặt Trăng quanh Trái Đất (R = 1.35m)
    if (moonRef.current) {
      const moonSpeed = -t * 0.75
      moonRef.current.position.x = Math.cos(moonSpeed) * 1.35
      moonRef.current.position.z = Math.sin(moonSpeed) * 1.35
      moonRef.current.position.y = 2.25 + Math.sin(moonSpeed * 3) * 0.15
    }

    // Quỹ đạo Sao Thổ có vành đai (R = 2.85m)
    if (saturnRef.current) {
      const saturnSpeed = t * 0.25 + 2.0
      saturnRef.current.position.x = Math.cos(saturnSpeed) * 2.85
      saturnRef.current.position.z = Math.sin(saturnSpeed) * 2.85
      saturnRef.current.position.y = 2.25 + Math.cos(saturnSpeed) * 0.35
      saturnRef.current.rotation.y += 0.015
    }

    // Quỹ đạo Sao Hỏa (R = 1.95m)
    if (marsRef.current) {
      const marsSpeed = t * 0.55 + 4.2
      marsRef.current.position.x = Math.cos(marsSpeed) * 1.95
      marsRef.current.position.z = Math.sin(marsSpeed) * 1.95
      marsRef.current.position.y = 2.25 + Math.sin(marsSpeed * 1.5) * 0.25
    }

    // Quỹ đạo Vệ Tinh Viễn Thông Dateco IoT (R = 1.55m)
    if (satelliteRef.current) {
      const satSpeed = t * 1.1
      satelliteRef.current.position.x = Math.sin(satSpeed) * 1.55
      satelliteRef.current.position.z = Math.cos(satSpeed) * 1.55
      satelliteRef.current.position.y = 2.25 + Math.sin(satSpeed * 2) * 0.4
      satelliteRef.current.rotation.y = satSpeed
    }
  })

  // Thao tác kéo chuột tương tác xoay quả địa cầu
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

    const sensitivity = 0.007
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
      position={position}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* ================= 1. BỤC TRIỂN LÃM TRUNG TÂM CÔNG NGHỆ CAO (CIRCULAR EXHIBIT PEDESTAL) ================= */}
      {/* Khối đế tròn giật cấp bằng đá granite đen ánh kim */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.65, 0.5, 48]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Tầng bục thứ hai với nẹp viền titan */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.45, 0.2, 48]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Vòng LED phát sáng Cyan công nghệ viền quanh bục */}
      <mesh position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.32, 48]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Vòng vàng kim bảo hộ biểu trưng Dateco */}
      <mesh position={[0, 0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 0.98, 48]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#eab308"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* Cột trụ trung tâm phát từ trường nâng đỡ quả địa cầu */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.6, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Nguồn sáng hắt từ dưới chân bục lên Địa Cầu */}
      <pointLight position={[0, 1.3, 0]} color="#00f3ff" intensity={2.0} distance={5} />

      {/* Trụ kính / Màn hình tương tác thông tin cho khách tham quan */}
      {[-1.3, 1.3].map((px, pi) => (
        <group key={`kiosk-${pi}`} position={[px, 0, 1.0]} rotation={[0, pi === 0 ? 0.35 : -0.35, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.9, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.92, 0]} rotation={[-0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.35, 0.24, 0.02]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#00f3ff"
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* ================= 2. QUẢ ĐỊA CẦU KHỔNG LỒ TƯƠNG TÁC (INTERACTIVE EARTH CENTERPIECE) ================= */}
      <group
        ref={earthMeshRef}
        position={[0, 2.25, 0]}
        onPointerDown={handlePointerDown}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'interactive-earth',
            title: 'Quả Địa Cầu Triển Lãm & Trạm Vệ Tinh Dateco Global IoT',
            category: 'Global Telemetry & Space Systems',
            price: 'Triển lãm công nghệ trung tâm Showroom',
            specs: [
              'Quả Địa Cầu tương tác 3D: Dùng chuột bấm giữ và kéo để xoay tự do 360° theo ý muốn',
              'Hiển thị định vị trạm tự động hóa Dateco tại Hà Nội và mạng lưới phân phối toàn cầu',
              'Mô phỏng Hệ Mặt Trời: Mặt Trời, Mặt Trăng, Sao Thổ có vành đai và Sao Hỏa quay quanh quỹ đạo',
              'Kết nối vệ tinh viễn thông LEO truyền dữ liệu SCADA đám mây cho các trạm biến áp Dateco'
            ],
            desc: 'Mô hình Quả Địa Cầu không gian biểu trưng cho tầm nhìn vươn tầm thế giới của Dateco và Dũng Automation, mang công nghệ Việt Nam kết nối chuỗi cung ứng công nghiệp toàn cầu.'
          })
        }}
        cursor="grab"
      >
        {/* Khối cầu Trái Đất chính (Bán kính triển lãm showroom R = 0.95m) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.95, 48, 48]} />
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
          <sphereGeometry args={[1.0, 36, 36]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.22}
            roughness={0.1}
            transmission={0.6}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Trục nghiêng Trái Đất mạ vàng sang trọng (Nghiêng 23.5 độ) */}
        <mesh rotation={[0, 0, 0.41]}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* ================= 3. MẶT TRỜI QUAY QUANH (THE ORBITING SUN) ================= */}
      <group ref={sunRef}>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        {/* Vầng hào quang mặt trời Corona */}
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.35} />
        </mesh>
        {/* Nguồn sáng tỏa từ Mặt Trời chiếu rọi Địa Cầu */}
        <pointLight color="#fed7aa" intensity={2.8} distance={8} decay={2} />
      </group>

      {/* ================= 4. MẶT TRĂNG QUAY QUANH (THE MOON) ================= */}
      <group ref={moonRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
      </group>

      {/* ================= 5. SAO THỔ VÀ VÀNH ĐAI NHẪN (SATURN & RINGS) ================= */}
      <group ref={saturnRef}>
        {/* Thân hành tinh Sao Thổ */}
        <mesh castShadow>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#eab308" roughness={0.6} />
        </mesh>
        {/* Vành đai nhẫn nghiêng */}
        <mesh rotation={[0.5, 0.3, 0]}>
          <ringGeometry args={[0.34, 0.58, 32]} />
          <meshStandardMaterial
            map={saturnRingTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.88}
          />
        </mesh>
      </group>

      {/* ================= 6. SAO HỎA (MARS) ================= */}
      <group ref={marsRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
      </group>

      {/* ================= 7. VỆ TINH VIỄN THÔNG DATECO GLOBAL IOT ================= */}
      <group ref={satelliteRef}>
        {/* Thân vệ tinh kim loại bạc */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.08, 0.12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Tấm pin mặt trời màu xanh bên hông */}
        <mesh position={[0.14, 0, 0]}>
          <boxGeometry args={[0.18, 0.01, 0.08]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        <mesh position={[-0.14, 0, 0]}>
          <boxGeometry args={[0.18, 0.01, 0.08]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {/* Đèn chớp đỏ Telemetry */}
        <pointLight position={[0, 0.08, 0]} color="#ef4444" intensity={1.2} distance={1.5} />
      </group>

      {/* ================= 8. CÁC ĐƯỜNG QUỸ ĐẠO THIÊN THỂ PHÁT SÁNG ================= */}
      {/* Quỹ đạo Mặt Trời (R = 2.35m) */}
      <mesh position={[0, 2.25, 0]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[2.35, 0.008, 8, 64]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

      {/* Quỹ đạo Sao Thổ (R = 2.85m) */}
      <mesh position={[0, 2.25, 0]} rotation={[-0.25, 0, 0.1]}>
        <torusGeometry args={[2.85, 0.008, 8, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
      </mesh>

      {/* Quỹ đạo Sao Hỏa (R = 1.95m) */}
      <mesh position={[0, 2.25, 0]} rotation={[0.15, 0, -0.2]}>
        <torusGeometry args={[1.95, 0.007, 8, 64]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

export default InteractiveEarthSolarSystem
