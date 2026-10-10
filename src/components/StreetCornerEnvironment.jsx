import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function StreetCornerEnvironment({ season = 'spring', isNight = false, onSelect }) {
  const particlesRef = useRef([])

  // 1. Tạo 40 hạt thời tiết 4 mùa (Cánh hoa, lá vàng, đom đóm, bông tuyết)
  const particleData = useMemo(() => {
    return Array.from({ length: 45 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 18,
        Math.random() * 8 + 1,
        (Math.random() - 0.5) * 18
      ],
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 2,
      scale: 0.06 + Math.random() * 0.08
    }))
  }, [])

  // Animation rơi lượn của hạt thời tiết theo từng mùa
  useFrame((_, delta) => {
    particlesRef.current.forEach((mesh, idx) => {
      if (!mesh) return
      const p = particleData[idx]

      mesh.position.y -= p.speedY * delta
      mesh.position.x += Math.sin(mesh.position.y * 1.5) * 0.3 * delta
      mesh.rotation.z += p.rotationSpeed * delta

      // Khi chạm đất thì reset lên trên ngẫu nhiên
      if (mesh.position.y < 0.1) {
        mesh.position.y = 8 + Math.random() * 2
        mesh.position.x = (Math.random() - 0.5) * 18
        mesh.position.z = (Math.random() - 0.5) * 18
      }
    })
  })

  // Bảng màu cây theo 4 mùa
  const foliageColor = useMemo(() => {
    switch (season) {
      case 'winter':
        return '#e2e8f0' // Tuyết trắng phủ
      case 'autumn':
        return '#ea580c' // Cam cháy mùa thu
      case 'summer':
        return '#15803d' // Xanh lục đậm mùa hạ
      case 'spring':
      default:
        return '#f472b6' // Hồng hoa anh đào / hoa ban mùa xuân
    }
  }, [season])

  const subFoliageColor = useMemo(() => {
    switch (season) {
      case 'winter':
        return '#0f766e' // Tùng bách xanh sẫm dưới tuyết
      case 'autumn':
        return '#f59e0b' // Vàng hổ phách
      case 'summer':
        return '#22c55e' // Xanh tươi mát
      case 'spring':
      default:
        return '#fbcfe8' // Hồng phấn nhạt
    }
  }, [season])

  const particleColor = useMemo(() => {
    switch (season) {
      case 'winter':
        return '#ffffff' // Bông tuyết trắng
      case 'autumn':
        return '#f59e0b' // Lá vàng
      case 'summer':
        return '#facc15' // Đom đóm vàng
      case 'spring':
      default:
        return '#f472b6' // Cánh hoa anh đào
    }
  }, [season])

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. HỆ THỐNG HẠT THỜI TIẾT 4 MÙA ================= */}
      <group>
        {particleData.map((p, idx) => (
          <mesh
            key={idx}
            ref={(el) => (particlesRef.current[idx] = el)}
            position={p.pos}
            scale={p.scale}
          >
            {season === 'winter' ? (
              <sphereGeometry args={[1, 8, 8]} />
            ) : (
              <planeGeometry args={[1.2, 0.8]} />
            )}
            <meshStandardMaterial
              color={particleColor}
              roughness={0.5}
              emissive={season === 'summer' && isNight ? '#facc15' : particleColor}
              emissiveIntensity={isNight ? 1.5 : 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* ================= 2. HÀNG CÂY VEN ĐƯỜNG ĐỔI MÀU THEO 4 MÙA ================= */}
      {/* Cây lớn góc phố vỉa hè phía trước */}
      <group position={[7.8, 0, 4.2]}>
        {/* Thân cây gỗ tự nhiên uốn lượn */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 3.6, 12]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 3.2, 0.1]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.12, 0.18, 1.8, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>

        {/* Tán lá đa diện nghệ thuật 4 mùa */}
        <mesh position={[0, 4.2, 0]} castShadow>
          <dodecahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial color={foliageColor} roughness={0.65} />
        </mesh>
        <mesh position={[0.6, 4.8, 0.4]} castShadow>
          <dodecahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color={subFoliageColor} roughness={0.6} />
        </mesh>
        <mesh position={[-0.5, 3.9, -0.4]} castShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color={foliageColor} roughness={0.7} />
        </mesh>

        {/* Mảng tuyết hoặc hoa rụng dưới gốc cây */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 16]} />
          <meshStandardMaterial color={foliageColor} roughness={0.8} />
        </mesh>
      </group>

      {/* Cây nhỡ bên hông vỉa hè phía sau */}
      <group position={[8.0, 0, -4.5]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 2.8, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.1, 0]} castShadow>
          <dodecahedronGeometry args={[1.3, 1]} />
          <meshStandardMaterial color={foliageColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.3, 3.6, -0.2]} castShadow>
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial color={subFoliageColor} roughness={0.6} />
        </mesh>
      </group>

      {/* ================= 3. BIỂN TÊN PHỐ HÀ NỘI "PHỐ TỰ ĐỘNG HÓA" ================= */}
      <group
        position={[8.8, 0, 7.8]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'street-sign',
            title: 'Phố Tự Động Hóa (Automation Street - Hà Nội)',
            category: 'Khu Phố Công Nghệ',
            price: 'Tọa độ: Hoàn Kiếm / Cầu Giấy, Hà Nội',
            specs: [
              'Con phố tập trung các viện nghiên cứu, showroom linh kiện tự động hoá và Maker Lab',
              'Không gian giao thoa giữa nét cổ kính rêu phong Hà Nội và công nghệ tương lai Cyberpunk',
              'Đèn đường LED thông minh điều chỉnh nhiệt độ màu theo 4 Mùa trong năm'
            ],
            desc: 'Góc phố công nghệ sầm uất bậc nhất Thủ đô, nơi các kỹ sư, sinh viên và maker khắp cả nước tìm đến để giao lưu đồ án và mua sắm linh kiện PLC, ESP32 chính hãng.'
          })
        }}
        cursor="pointer"
      >
        {/* Cột thép đen */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 3.6, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Bảng tên phố màu xanh viền trắng đặc trưng Hà Nội */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <boxGeometry args={[1.6, 0.45, 0.08]} />
          <meshStandardMaterial color="#0369a1" roughness={0.4} />
        </mesh>
        {/* Viền kim loại */}
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[1.64, 0.49, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>

        {/* Đèn rọi LED hắt biển tên phố ban đêm */}
        <mesh position={[0, 3.75, 0.15]}>
          <boxGeometry args={[0.3, 0.06, 0.12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <pointLight position={[0, 3.7, 0.2]} color="#00f3ff" intensity={1.2} distance={3} />
      </group>

      {/* ================= 4. MÁY BÁN NƯỚC TỰ ĐỘNG CYBERPUNK (VENDING MACHINE) ================= */}
      <group
        position={[7.8, 0, -1.2]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'vending-machine',
            title: 'Máy Bán Nước Tự Động Cyberpunk Vending Machine',
            category: 'Smart City & Street Tech',
            price: 'Nạp năng lượng: 15.000 đ - 35.000 đ',
            specs: [
              'Menu: Cyber Energy 2077, Cà Phê Trứng Hà Nội, Trà Sữa Trân Châu Matcha',
              'Thanh toán: Chạm thẻ NFC, quét mã QR MoMo/VietQR hoặc ví Crypto Solana',
              'Tích hợp màn hình OLED hiển thị thông báo tin tức công nghệ thời gian thực'
            ],
            desc: 'Máy bán nước giải khát tự động phục vụ 24/7 bên hè phố cho các kỹ sư làm việc tăng ca ca đêm và khách dạo phố công nghệ.'
          })
        }}
        cursor="pointer"
      >
        {/* Thân máy kim loại sơn tĩnh điện xanh tím Cyberpunk */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 2.6, 0.9]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Khung kính trưng bày đồ uống trong suốt */}
        <mesh position={[0, 1.8, 0.4]}>
          <boxGeometry args={[1.0, 1.3, 0.1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            transparent
            opacity={0.8}
            roughness={0.1}
          />
        </mesh>

        {/* Các hàng lon nước ngọt phát sáng bên trong */}
        {[-0.35, 0, 0.35].map((cx, i) =>
          [1.5, 1.8, 2.1].map((cy, j) => (
            <mesh key={`${i}-${j}`} position={[cx, cy, 0.35]}>
              <cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />
              <meshStandardMaterial
                color={i === 0 ? '#ef4444' : i === 1 ? '#06b6d4' : '#22c55e'}
                emissive={i === 0 ? '#ef4444' : i === 1 ? '#06b6d4' : '#22c55e'}
                emissiveIntensity={0.8}
              />
            </mesh>
          ))
        )}

        {/* Khe lấy nước bên dưới có đèn LED vàng ấm */}
        <mesh position={[0, 0.45, 0.42]}>
          <boxGeometry args={[0.7, 0.35, 0.12]} />
          <meshStandardMaterial color="#09090b" roughness={0.8} />
        </mesh>

        {/* Biển hiệu trên nóc máy bán nước phát sáng Neon */}
        <mesh position={[0, 2.55, 0.46]}>
          <boxGeometry args={[0.9, 0.2, 0.04]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#f43f5e"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ================= 5. GHẾ BĂNG ĐÁ THÔNG MINH CHO NGƯỜI ĐI BỘ ================= */}
      <group position={[7.8, 0, 1.8]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Chân ghế đá khối */}
        <mesh position={[-0.7, 0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.7, 0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.5, 0.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Mặt ghế gỗ phủ Nano chống nước */}
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.65]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
        {/* Đèn LED ấm âm gầm ghế */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.6, 0.02, 0.04]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ================= 6. TRỤ CỨU HỎA ĐỎ ĐẶC TRƯNG ĐÔ THỊ ================= */}
      <group position={[8.5, 0, 6.2]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 0.8, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.4} />
        </mesh>
      </group>
    </group>
  )
}
