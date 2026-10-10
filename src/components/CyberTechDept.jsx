import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CyberTechDept({ onSelect }) {
  const droneRef = useRef()
  const holoScreenRef = useRef()

  // 1. Tạo texture trong suốt Cyberpunk cho TV / Màn hình trong suốt
  const transparentTvTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 300
    const ctx = cvs.getContext('2d')

    // Nền trong suốt
    ctx.clearRect(0, 0, 512, 300)

    // Khung viền HUD Cyberpunk 2077
    ctx.strokeStyle = '#00f3ff'
    ctx.lineWidth = 3
    ctx.strokeRect(15, 15, 482, 270)

    // Góc vát HUD
    ctx.fillStyle = '#00f3ff'
    ctx.fillRect(15, 15, 30, 8)
    ctx.fillRect(15, 15, 8, 30)
    ctx.fillRect(467, 15, 30, 8)
    ctx.fillRect(489, 15, 8, 30)

    // Chữ thương hiệu & thông số AI
    ctx.fillStyle = '#f43f5e'
    ctx.font = 'bold 20px "JetBrains Mono", monospace'
    ctx.fillText('CYBERPUNK NEURAL OS v4.2', 30, 50)

    ctx.fillStyle = '#00f3ff'
    ctx.font = 'bold 14px "JetBrains Mono", monospace'
    ctx.fillText('CORE: QUANTUM SYNAPSE [ONLINE]', 30, 80)
    ctx.fillText('AI AGENT: DUNGAUTOMATION CORE', 30, 105)

    // Đồ thị sóng âm / dữ liệu holographic
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 30; x < 480; x += 10) {
      const y = 160 + Math.sin(x * 0.05) * 25 + Math.cos(x * 0.1) * 10
      if (x === 30) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Bảng dữ liệu hệ thống
    ctx.fillStyle = '#facc15'
    ctx.font = '13px monospace'
    ctx.fillText('TRANSPARENCY: 92% | RESOLUTION: 8K HOLO', 30, 220)
    ctx.fillText('POWER: WIRELESS INDUCTION 240W', 30, 250)

    const tex = new THREE.CanvasTexture(cvs)
    return tex
  }, [])

  // 2. Texture màn hình Laptop Cyberpunk 2077
  const cyberLaptopTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 320
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#090d16'
    ctx.fillRect(0, 0, 512, 320)

    // Terminal hacker / IDE code
    ctx.fillStyle = '#10b981'
    ctx.font = '13px "JetBrains Mono", monospace'
    ctx.fillText('> init_system --mode=cyberpunk_2077', 20, 30)
    ctx.fillText('> connected to DungAutomation Network', 20, 55)
    ctx.fillText('> overclocking GPU: 3450 MHz [STABLE]', 20, 80)
    ctx.fillText('> bypass firewall: 100% SUCCESS', 20, 105)

    // Khung biểu đồ hiệu năng
    ctx.strokeStyle = '#f43f5e'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 130, 472, 140)

    ctx.fillStyle = '#f43f5e'
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText('NEURAL CHIP TEMPERATURE: 42°C', 40, 160)
    ctx.fillStyle = '#00f3ff'
    ctx.fillText('DUAL-SCREEN MATRIX: ACTIVE', 40, 190)
    ctx.fillText('MEMORY: 128GB LPDDR6X QUANTUM', 40, 220)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 3. Texture điện thoại gập 3 màn hình Tri-Fold
  const triFoldTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 384
    cvs.height = 256
    const ctx = cvs.getContext('2d')

    // Nền gradient Cyberpunk
    const grad = ctx.createLinearGradient(0, 0, 384, 256)
    grad.addColorStop(0, '#1e1b4b')
    grad.addColorStop(1, '#0f172a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 384, 256)

    // 2 đường kẻ chia 3 màn hình gập
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(128, 0); ctx.lineTo(128, 256); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 256); ctx.stroke()

    // Nội dung widget màn hình
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText('09:41', 40, 50)
    ctx.fillStyle = '#00f3ff'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('TRI-FOLD 10.2"', 25, 80)

    // Màn giữa: Bản đồ phố
    ctx.fillStyle = '#f43f5e'
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText('HÀ NỘI 36 PHỐ', 145, 50)
    ctx.fillStyle = '#22c55e'
    ctx.fillText('GPS: DUNGAUTOMATION', 135, 80)

    // Màn phải: Ví Crypto & Điều khiển Smart Home
    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText('SMART IOT HUB', 270, 50)
    ctx.fillStyle = '#a855f7'
    ctx.fillText('PLC S7: CONNECTED', 265, 80)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // Animation lơ lửng của Drone và màn hình Holo
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (droneRef.current) {
      droneRef.current.position.y = 2.4 + Math.sin(t * 3) * 0.08
      droneRef.current.rotation.y = Math.sin(t * 1.5) * 0.2
    }
    if (holoScreenRef.current) {
      holoScreenRef.current.material.opacity = 0.85 + Math.sin(t * 4) * 0.1
    }
  })

  return (
    <group position={[2.8, 0, 1.2]}>
      {/* ================= BÀN TRƯNG BÀY CÔNG NGHỆ TƯƠNG LAI (CYBERPEDESTAL) ================= */}
      {/* Bàn đá đen ánh kim vát cạnh chữ nhật */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.3, 1.6]} />
        <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Mặt bàn kính đen bóng phủ Nano */}
      <mesh position={[0, 1.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.3, 0.05, 1.7]} />
        <meshStandardMaterial color="#030712" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Dải LED Neon tím Magenta chạy ngầm viền chân bàn */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.32, 0.03, 1.72]} />
        <meshStandardMaterial
          color="#d946ef"
          emissive="#d946ef"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* ================= 1. ĐIỆN THOẠI MÀN HÌNH GẬP 3 (TRI-FOLD CYBER SMARTPHONE) ================= */}
      <group
        position={[-0.9, 1.38, 0.3]}
        rotation={[0, 0.25, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'tri-fold-phone',
            title: 'Điện Thoại Màn Hình Gập 3 Cánh (Tri-Fold Cyber OLED)',
            category: 'Future Mobile Tech',
            price: 'Giá: 65.000.000 đ',
            specs: [
              'Màn hình dẻo mở rộng 10.2 inch Tri-Fold độ sáng 3000 nits',
              'Bản lề kép hợp kim Titan - Zirconium chống nhăn 100%',
              'Chip xử lý thần kinh Cyberpunk Neural Core kết nối não bộ BCI',
              'Pin thể rắn Silicon-Carbon 5600mAh siêu mỏng chỉ 3.6mm'
            ],
            desc: 'Siêu phẩm điện thoại gập 3 màn hình tương lai lấy cảm hứng từ công nghệ Cyberpunk. Có thể gập gọn như điện thoại bỏ túi hoặc mở rộng thành máy tính bảng điều khiển SCADA đa nhiệm.'
          })
        }}
        cursor="pointer"
      >
        {/* Khung titan mạ vàng hồng viền máy */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.85, 0.025, 0.55]} />
          <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Mặt màn hình hiển thị 3 khúc uốn cong */}
        <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.52]} />
          <meshStandardMaterial map={triFoldTexture} roughness={0.2} />
        </mesh>

        {/* Cụm camera ma trận hình lục giác phía sau */}
        <mesh position={[0.3, 0.036, -0.15]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      </group>

      {/* ================= 2. MÀN HÌNH TV TRONG SUỐT CYBERPUNK (TRANSPARENT OLED DISPLAY) ================= */}
      <group
        position={[0, 1.38, -0.25]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'transparent-tv',
            title: 'Tivi / Màn Hình Trong Suốt Holographic Cyberpunk 2077',
            category: 'Cyberpunk Displays',
            price: 'Giá: 120.000.000 đ',
            specs: [
              'Tấm nền Transparent Micro-OLED độ trong suốt quang học 92%',
              'Độ phân giải 8K UHD với tần số quét 240Hz thời gian thực',
              'Hiển thị giao diện Hologram Cyberpunk 3D xuyên thấu không cần kính',
              'Truyền dữ liệu và điện năng không dây hoàn toàn bằng sóng lượng tử'
            ],
            desc: 'Màn hình thông minh thế hệ mới nhất cho phép nhìn xuyên qua không gian phòng nhưng vẫn hiển thị sắc nét đồ họa cyberpunk rực rỡ, tích hợp trợ lý AI giám sát showroom.'
          })
        }}
        cursor="pointer"
      >
        {/* Chân đế kim loại nhôm nguyên khối */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.9, 0.08, 0.25]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Trụ đỡ màn hình */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Mặt kính cường lực trong suốt xuyên thấu */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[1.6, 0.95, 0.03]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transparent
            opacity={0.35}
            transmission={0.95}
            roughness={0.05}
            ior={1.52}
          />
        </mesh>

        {/* Lớp hiển thị Hologram phát quang trên mặt kính */}
        <mesh ref={holoScreenRef} position={[0, 0.85, 0.02]}>
          <planeGeometry args={[1.56, 0.92]} />
          <meshStandardMaterial
            map={transparentTvTexture}
            transparent
            opacity={0.9}
            emissive="#00f3ff"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ================= 3. LAPTOP TƯƠNG LAI 2 MÀN HÌNH CYBERPUNK 2077 (CYBERDECK) ================= */}
      <group
        position={[0.95, 1.38, 0.35]}
        rotation={[0, -0.3, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cyberpunk-laptop',
            title: 'Laptop Cyberdeck Dual-Screen Cyberpunk 2077',
            category: 'Quantum Computing',
            price: 'Giá: 88.000.000 đ',
            specs: [
              'Thiết kế 2 màn hình cảm ứng: Màn hình chính 16" OLED 4K + Màn hình phụ ScreenPad Plus 14"',
              'Bàn phím cơ quang học trong suốt RGB từng phím công nghệ switch từ tính',
              'Hệ thống tản nhiệt buồng hơi lộ ống đồng với quạt phản lực siêu êm',
              'Bộ vi xử lý lượng tử 64-Core hỗ trợ nạp mã nhúng vi điều khiển trong 0.001s'
            ],
            desc: 'Cỗ máy tính xách tay tối thượng dành cho lập trình viên nhúng và Hacker tương lai, chạy hệ điều hành Arasaka Neural OS chuyên dụng để nạp code cho PLC Siemens và vi điều khiển ESP32.'
          })
        }}
        cursor="pointer"
      >
        {/* Thân máy dưới (Chassis) */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.7, 0.03, 0.52]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Bàn phím cơ quang học trong suốt phát sáng RGB */}
        <mesh position={[0, 0.04, 0.12]}>
          <boxGeometry args={[0.62, 0.015, 0.22]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={1.5}
            roughness={0.4}
            wireframe
          />
        </mesh>

        {/* Màn hình phụ ScreenPad nghiêng 20 độ */}
        <mesh position={[0, 0.05, -0.06]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[0.6, 0.14]} />
          <meshBasicMaterial color="#d946ef" />
        </mesh>

        {/* Nắp máy & Màn hình chính mở góc 110 độ */}
        <group position={[0, 0.03, -0.24]} rotation={[-0.45, 0, 0]}>
          {/* Lưng nắp máy Carbon */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <boxGeometry args={[0.7, 0.52, 0.02]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Màn hình chính sắc nét hiển thị mã nguồn Cyberpunk */}
          <mesh position={[0, 0.26, 0.015]}>
            <planeGeometry args={[0.66, 0.48]} />
            <meshStandardMaterial map={cyberLaptopTexture} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. DRONE TRỢ LÝ CÔNG NGHỆ MINI BAY LƠ LỬNG ================= */}
      <group
        ref={droneRef}
        position={[0, 2.4, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cyber-drone',
            title: 'Drone Trợ Lý Thông Minh DungAutomation AI Scout',
            category: 'Autonomous Drones',
            price: 'Giá: 18.500.000 đ',
            specs: [
              'Hệ thống động cơ nâng từ trường ion không gây tiếng ồn',
              'Cảm biến LiDAR 3D quét bản đồ và dẫn đường tự động trong nhà',
              'Camera AI 4K nhận diện khuôn mặt khách hàng và kiểm kê kho hàng',
              'Thời lượng bay liên tục 4h với đế sạc từ trường hạ cánh tự động'
            ],
            desc: 'Drone trợ lý bay tuần tra showroom, tự động hướng dẫn khách đến các quầy linh kiện và hỗ trợ vận chuyển microchip siêu nhỏ.'
          })
        }}
        cursor="pointer"
      >
        {/* Thân drone tròn bóng */}
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Mắt camera cảm biến LiDAR phát sáng xanh */}
        <mesh position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#00f3ff"
            emissive="#00f3ff"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>

        {/* 4 Cánh quạt ion phát quang */}
        {[-0.22, 0.22].map((dx, i) =>
          [-0.22, 0.22].map((dz, j) => (
            <group key={`${i}-${j}`} position={[dx, 0.05, dz]}>
              <mesh>
                <cylinderGeometry args={[0.09, 0.09, 0.02, 12]} />
                <meshStandardMaterial
                  color="#22c55e"
                  emissive="#22c55e"
                  emissiveIntensity={2}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* Đèn rọi spotlight màu tím ấm cho khu Cyberpunk */}
      <pointLight position={[0, 3.2, 0]} color="#e879f9" intensity={1.5} distance={6} decay={2} />
    </group>
  )
}
