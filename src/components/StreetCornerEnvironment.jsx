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

      {/* ================= 7. DÃY NHÀ PHỐ CỔ HÀ NỘI & TECH HUB PHÍA SAU (BACKDROP BUILDINGS) ================= */}
      {/* 7.1 Nhà phố Pháp cổ Hà Nội (French-Colonial Shophouse) */}
      <group
        position={[-4.5, 0, -10.2]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'hanoi-shophouse',
            title: 'Khu Nhà Phố Cổ Hà Nội (Kiến Trúc Pháp Cổ Điển)',
            category: 'Quang Cảnh Đô Thị Xung Quanh',
            price: 'Khu bảo tồn di sản & phố công nghệ',
            specs: [
              'Kiến trúc nhà phố 2 tầng tường vàng đặc trưng, mái ngói dốc đỏ cam truyền thống',
              'Ban công sắt nghệ thuật uốn hoa văn cổ điển kết hợp giàn hoa rủ ban công',
              'Tầng 1 là quán cà phê vỉa hè "Cà Phê Phố Cổ 1986" với mái hiên sọc kẻ kinh điển'
            ],
            desc: 'Quang cảnh phố cổ Hà Nội liền kề tạo nên không gian giao thoa văn hóa độc đáo giữa nét rêu phong hoài niệm của Thủ đô nghìn năm và công nghệ tự động hóa hiện đại.'
          })
        }}
        cursor="pointer"
      >
        {/* Khối nhà chính tường vàng cổ kính */}
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 6.4, 1.6]} />
          <meshStandardMaterial color="#eab308" roughness={0.75} />
        </mesh>

        {/* Mái ngói dốc kiểu Pháp màu cam đất nung */}
        <mesh position={[0, 6.7, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[7.2, 0.6, 2.0]} />
          <meshStandardMaterial color="#9a3412" roughness={0.65} />
        </mesh>

        {/* Gờ chỉ phào phân tầng kiến trúc Pháp */}
        <mesh position={[0, 3.2, 0.82]}>
          <boxGeometry args={[7.0, 0.18, 0.12]} />
          <meshStandardMaterial color="#fef08a" roughness={0.5} />
        </mesh>

        {/* Cửa sổ chớp gỗ xanh lá sẫm tầng 2 */}
        {[-2.0, 0, 2.0].map((wx, wi) => (
          <group key={`win-${wi}`} position={[wx, 4.5, 0.82]}>
            {/* Khung vòm cửa sổ */}
            <mesh castShadow>
              <boxGeometry args={[1.1, 1.6, 0.1]} />
              <meshStandardMaterial color="#14532d" roughness={0.5} />
            </mesh>
            {/* Ban công sắt nghệ thuật nhỏ nhô ra */}
            <mesh position={[0, -0.7, 0.2]}>
              <boxGeometry args={[1.3, 0.45, 0.35]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} wireframe={false} />
            </mesh>
            {/* Chậu hoa ban công */}
            <mesh position={[0, -0.45, 0.35]}>
              <boxGeometry args={[1.0, 0.15, 0.15]} />
              <meshStandardMaterial color="#f472b6" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Tầng 1: Biển hiệu quán CÀ PHÊ PHỐ CỔ 1986 */}
        <mesh position={[0, 2.7, 0.85]}>
          <boxGeometry args={[3.2, 0.5, 0.08]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>

        {/* Mái hiên di động bạt sọc đỏ trắng vỉa hè */}
        <group position={[0, 2.2, 1.2]} rotation={[0.3, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.2, 0.05, 1.0]} />
            <meshStandardMaterial color="#dc2626" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* 7.2 Tòa nhà văn phòng công nghệ Modern Glass Tech Hub bên cạnh */}
      <group position={[3.2, 0, -10.4]}>
        {/* Khối tháp kính xanh hiện đại */}
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 8.4, 1.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Các mảng kính phản quang màu cyan */}
        <mesh position={[0, 4.2, 0.77]}>
          <planeGeometry args={[5.4, 7.8]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            metalness={0.6}
            roughness={0.1}
            transmission={0.4}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* ================= 8. CỘT ĐÈN ĐƯỜNG CỔ ĐIỂN HÀ NỘI (VINTAGE COLONIAL STREET LAMP) ================= */}
      <group position={[7.6, 0, 7.6]}>
        {/* Khối đế gang đúc hoa văn */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.3, 0.7, 16]} />
          <meshStandardMaterial color="#14532d" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Thân cột gang cao uốn lượn */}
        <mesh position={[0, 2.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.14, 3.4, 16]} />
          <meshStandardMaterial color="#14532d" roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Vành tay vươn cong cổ điển */}
        <mesh position={[0, 4.05, 0]}>
          <boxGeometry args={[1.2, 0.12, 0.12]} />
          <meshStandardMaterial color="#14532d" metalness={0.8} />
        </mesh>

        {/* 2 Chao đèn lồng hình lục giác tỏa sáng vàng ấm */}
        {[-0.5, 0.5].map((lx, li) => (
          <group key={`lamp-${li}`} position={[lx, 3.8, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.12, 0.35, 6]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={isNight ? 3.0 : 1.2}
                roughness={0.2}
              />
            </mesh>
            {/* Nắp nón chao đèn đồng */}
            <mesh position={[0, 0.22, 0]}>
              <coneGeometry args={[0.24, 0.14, 6]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <pointLight
              position={[0, -0.1, 0]}
              color="#fbbf24"
              intensity={isNight ? 2.5 : 1.0}
              distance={7}
              decay={2}
            />
          </group>
        ))}
      </group>

      {/* ================= 9. LÒNG ĐƯỜNG NHỰA ASPHALT & VẠCH SANG ĐƯỜNG (ZEBRA CROSSING) ================= */}
      <group position={[9.4, 0, 0]}>
        {/* Mặt đường nhựa Asphalt đen xám */}
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.04, 21.6]} />
          <meshStandardMaterial color="#18181b" roughness={0.95} />
        </mesh>

        {/* Vạch kẻ đường cho người đi bộ (Zebra Crossing) tại góc ngã tư */}
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((zz, zi) => (
          <mesh key={`zebra-${zi}`} position={[0, 0.065, 3.5 + zz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.2, 0.38]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
          </mesh>
        ))}

        {/* Vạch tim đường đứt đoạn màu vàng nét đứt */}
        {[-8, -5, -2, 7, 10].map((zy, yi) => (
          <mesh key={`lane-${yi}`} position={[0.2, 0.065, zy]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 1.8]} />
            <meshStandardMaterial color="#facc15" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ================= 10. GÓC CÀ PHÊ & TRÀ ĐÁ VỈA HÈ HÀ NỘI ================= */}
      <group position={[7.6, 0.08, -3.2]}>
        {/* Bàn gỗ con mộc mạc vỉa hè */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.7, 0.04, 0.7]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.32, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Phin cà phê nhôm truyền thống trên bàn */}
        <mesh position={[-0.15, 0.4, 0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Ly trà đá thủy tinh Hà Nội */}
        <mesh position={[0.15, 0.39, -0.05]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.11, 16]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.85} roughness={0.1} transparent />
        </mesh>

        {/* 2 Chiếc ghế đẩu nhỏ đặt quanh bàn */}
        <mesh position={[-0.45, 0.15, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
        </mesh>
        <mesh position={[0.45, 0.15, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
      </group>

      {/* ================= 11. XE Ô TÔ ĐIỆN ĐÔ THỊ MINI (CYBER SMART CAR) ĐỖ VEN ĐƯỜNG ================= */}
      <group
        position={[9.4, 0.08, -6.5]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'smart-ev-car',
            title: 'Xe Điện Đô Thị Mini Tự Hành (Smart City Robotaxi)',
            category: 'Smart Mobility & Logistics',
            price: 'Công nghệ: Tự hành Cấp độ 4 (Level 4 Autonomous)',
            specs: [
              'Động cơ điện nam châm vĩnh cửu công suất 45kW, phạm vi di chuyển 300km/lần sạc',
              'Cụm cảm biến LiDAR 360° trên nóc xe và camera AI nhận diện vật cản đô thị',
              'Tự động định vị đón trả khách dạo phố công nghệ và giao linh kiện mạch in tốc hành'
            ],
            desc: 'Phương tiện giao thông xanh nhỏ gọn đỗ ven hè phố tự động hóa, là giải pháp di chuyển thông minh cho cư dân đô thị tương lai.'
          })
        }}
        cursor="pointer"
      >
        {/* Thân xe bo tròn màu xanh ngọc Cyber Mint */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.65, 2.6]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.25} metalness={0.6} />
        </mesh>

        {/* Khoang cabin kính nóc Panorama vòm tròn */}
        <mesh position={[0, 0.95, -0.1]} castShadow>
          <boxGeometry args={[1.35, 0.55, 1.6]} />
          <meshPhysicalMaterial
            color="#0f172a"
            transmission={0.85}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Đèn pha LED trước xe */}
        <mesh position={[0, 0.52, 1.31]}>
          <boxGeometry args={[1.2, 0.08, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={isNight ? 3 : 1}
          />
        </mesh>

        {/* 4 Bánh xe cao su mâm đúc thể thao */}
        {[-0.8, 0.8].map((bx, bi) =>
          [-0.85, 0.85].map((bz, bj) => (
            <mesh key={`wheel-${bi}-${bj}`} position={[bx, 0.25, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.16, 20]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}

        {/* Cụm cảm biến LiDAR xoay trên nóc xe */}
        <mesh position={[0, 1.3, -0.1]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      </group>

      {/* ================= 12. BỒN HOA CÔNG VIÊN VEN HÈ ================= */}
      <group position={[7.6, 0.08, -8.2]}>
        {/* Thành bồn hoa xây đá xám bo viền */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.4, 2.0]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Đất mùn hữu cơ */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[1.0, 0.05, 1.8]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        {/* Các bụi hoa cúc vàng rực rỡ */}
        {[-0.3, 0.3].map((hx, hi) =>
          [-0.6, 0, 0.6].map((hz, hj) => (
            <mesh key={`fl-${hi}-${hj}`} position={[hx, 0.48, hz]} castShadow>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#facc15" roughness={0.6} />
            </mesh>
          ))
        )}
      </group>

      {/* ================= 13. TOÀN CẢNH ĐÔ THỊ MỞ RỘNG 4 PHÍA (FULL SURROUNDING LANDSCAPE 160X160M) ================= */}
      {/* 13.1 Mặt nền đô thị rộng lớn bao trùm toàn bộ không gian xung quanh */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[140, 0.04, 140]} />
        <meshStandardMaterial color="#111827" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Các trục đường nhựa đại lộ mở rộng về 4 hướng */}
      {/* Trục đường lớn phía Nam (Z = 14) */}
      <group position={[0, 0.01, 15]}>
        <mesh receiveShadow>
          <boxGeometry args={[130, 0.02, 7.5]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>
        {/* Vạch sơn tim đường vàng */}
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 0.25]} />
          <meshStandardMaterial color="#facc15" roughness={0.8} />
        </mesh>
      </group>

      {/* Trục đường lớn phía Đông (X = 16) */}
      <group position={[18, 0.01, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[8.5, 0.02, 130]} />
          <meshStandardMaterial color="#18181b" roughness={0.9} />
        </mesh>
      </group>

      {/* 13.2 Khối nhà cao tầng đô thị phía Nam (South City Skyline) */}
      {[-24, -12, 12, 24].map((bx, bi) => (
        <group key={`south-bld-${bi}`} position={[bx, 0, 22]}>
          <mesh castShadow receiveShadow position={[0, 5.5 + (bi % 2) * 2.5, 0]}>
            <boxGeometry args={[9.5, 11 + (bi % 2) * 5, 7.0]} />
            <meshStandardMaterial color={bi % 2 === 0 ? '#1e293b' : '#334155'} roughness={0.6} />
          </mesh>
          {/* Cửa sổ phát sáng ấm ban đêm */}
          <mesh position={[0, 5.5, -3.52]}>
            <planeGeometry args={[8.0, 9.0]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fde047"
              emissiveIntensity={isNight ? 1.5 : 0.4}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* 13.3 Khối tháp trung tâm công nghệ phía Đông (East Tech Towers) */}
      {[-16, 0, 16].map((bz, bj) => (
        <group key={`east-bld-${bj}`} position={[28, 0, bz]}>
          <mesh castShadow receiveShadow position={[0, 8.0 + (bj % 2) * 4, 0]}>
            <boxGeometry args={[8.0, 16 + (bj % 2) * 8, 12.0]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Mặt kính vách dựng phản chiếu xanh cyan */}
          <mesh position={[-4.02, 8.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[11.0, 14.0]} />
            <meshPhysicalMaterial
              color="#0284c7"
              emissive="#00f3ff"
              emissiveIntensity={isNight ? 0.8 : 0.2}
              roughness={0.1}
              transmission={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* 13.4 Khuôn viên nhà máy Dateco & công viên sinh thái phía Tây (West Campus & Lake) */}
      <group position={[-26, 0, 0]}>
        {/* Tòa nhà điều hành sản xuất Dateco phía Tây */}
        <mesh position={[0, 4.5, -8]} castShadow receiveShadow>
          <boxGeometry args={[12.0, 9.0, 16.0]} />
          <meshStandardMaterial color="#1e2430" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Mặt hồ nước sinh thái phản chiếu ánh đèn */}
        <mesh position={[0, 0.03, 10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 14]} />
          <meshPhysicalMaterial
            color="#0369a1"
            transmission={0.8}
            roughness={0.08}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* 13.5 Hàng cột đèn đường thông minh trên các đại lộ xa */}
      {[-30, -15, 0, 15, 30].map((lx, li) => (
        <group key={`slamp-${li}`} position={[lx, 0, 11.5]}>
          <mesh position={[0, 2.8, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.1, 5.6, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 5.6, 0.4]}>
            <boxGeometry args={[0.3, 0.1, 0.8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <pointLight
            position={[0, 5.4, 0.6]}
            color="#fef08a"
            intensity={isNight ? 2.5 : 1.0}
            distance={10}
            decay={2}
          />
        </group>
      ))}

      {/* 13.6 Hàng cây xanh bóng mát trên các vỉa hè xa */}
      {[-28, -20, -12, 12, 20, 28].map((tx, ti) => (
        <group key={`stree-${ti}`} position={[tx, 0, 18.5]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.25, 3.0, 10]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow>
            <dodecahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial color={foliageColor} roughness={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

