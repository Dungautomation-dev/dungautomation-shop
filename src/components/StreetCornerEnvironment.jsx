import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Quang Cảnh Góc Phố Sầm Uất Bao Quanh Showroom (Street Corner Environment)
 * - Thiết kế diorama góc phố mở (Open Diorama Street Corner) chuẩn theo ảnh tham khảo
 * - KHÔNG CÓ BẤT KỲ TÒA NHÀ NÀO LÀM CHE KHUẤT TẦM NHÌN VÀO SHOWROOM
 * - Vỉa hè lát đá sáng màu rộng rãi, cây xanh đa sắc (xanh lục, vàng chanh, hồng anh đào, vàng thu)
 * - Lòng đường Asphalt ngã tư chữ L với vạch qua đường (Zebra crossings) & xe hơi, xe máy giao hàng di chuyển
 * - Cột đèn đường chữ L tối giản hiện đại, ghế băng gỗ, thùng rác phân loại, trụ cứu hỏa
 */
export default function StreetCornerEnvironment({ season = 'spring', isNight = false, onSelect }) {
  const particlesRef = useRef([])
  const movingCarRef = useRef()
  const movingCar2Ref = useRef()
  const movingScooterRef = useRef()

  // 1. Hệ thống 45 hạt thời tiết 4 mùa (Cánh hoa anh đào, đom đóm, lá vàng, bông tuyết)
  const particleData = useMemo(() => {
    return Array.from({ length: 45 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 32,
        Math.random() * 8 + 1,
        (Math.random() - 0.5) * 32
      ],
      speedY: 0.4 + Math.random() * 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 2,
      scale: 0.06 + Math.random() * 0.08
    }))
  }, [])

  // Animation di chuyển của xe hơi & xe máy scooter trên đường
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Hạt thời tiết rơi lượn
    particlesRef.current.forEach((mesh, idx) => {
      if (!mesh) return
      const p = particleData[idx]

      mesh.position.y -= p.speedY * delta
      mesh.position.x += Math.sin(mesh.position.y * 1.5) * 0.3 * delta
      mesh.rotation.z += p.rotationSpeed * delta

      if (mesh.position.y < 0.1) {
        mesh.position.y = 8 + Math.random() * 2
        mesh.position.x = (Math.random() - 0.5) * 32
        mesh.position.z = (Math.random() - 0.5) * 32
      }
    })

    // Xe 1: Ô tô đỏ chạy dọc trục đường phía trước (Z = 13.0, X từ -18 đến 18)
    if (movingCarRef.current) {
      const cycle = (t * 5.2) % 38
      movingCarRef.current.position.x = -19 + cycle
      movingCarRef.current.position.z = 13.0
      movingCarRef.current.rotation.y = Math.PI / 2
    }

    // Xe 2: Ô tô vàng taxi chạy dọc trục đường bên phải (X = 15.5, Z từ -18 đến 18)
    if (movingCar2Ref.current) {
      const cycle2 = (t * 4.6) % 38
      movingCar2Ref.current.position.z = -19 + cycle2
      movingCar2Ref.current.position.x = 15.5
      movingCar2Ref.current.rotation.y = 0
    }

    // Xe máy Scooter giao hàng hỏa tốc chạy trên đường trước (Z = 14.5, X từ 18 về -18)
    if (movingScooterRef.current) {
      const cycle3 = (t * 6.0) % 38
      movingScooterRef.current.position.x = 19 - cycle3
      movingScooterRef.current.position.z = 14.8
      movingScooterRef.current.rotation.y = -Math.PI / 2
    }
  })

  // Bảng màu cây đa sắc theo 4 mùa
  const foliageColors = useMemo(() => {
    switch (season) {
      case 'winter':
        return {
          primary: '#f1f5f9', // Trắng tuyết
          secondary: '#0f766e', // Thông xanh
          accent: '#94a3b8',
          pink: '#e2e8f0'
        }
      case 'autumn':
        return {
          primary: '#ea580c', // Cam rực
          secondary: '#f59e0b', // Vàng hổ phách
          accent: '#b45309',
          pink: '#f97316'
        }
      case 'summer':
        return {
          primary: '#15803d', // Lục đậm
          secondary: '#22c55e', // Lục tươi
          accent: '#84cc16', // Vàng chanh
          pink: '#16a34a'
        }
      case 'spring':
      default:
        return {
          primary: '#16a34a', // Xanh mướt
          secondary: '#84cc16', // Lục non
          accent: '#facc15', // Vàng tươi
          pink: '#f472b6' // Hồng hoa đào / ban
        }
    }
  }, [season])

  const particleColor = useMemo(() => {
    switch (season) {
      case 'winter':
        return '#ffffff'
      case 'autumn':
        return '#f59e0b'
      case 'summer':
        return '#facc15'
      case 'spring':
      default:
        return '#f472b6'
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

      {/* ================= 2. VỈA HÈ LÁT ĐÁ SÁNG MÀU BAO QUANH SHOWROOM (SIDEWALK PAVEMENT) ================= */}
      {/* Vỉa hè phía trước showroom (Z: 7.5 đến 11.2, X: -17.5 đến 13.5) */}
      <mesh position={[-2.0, 0.1, 9.35]} receiveShadow>
        <boxGeometry args={[31.0, 0.12, 3.7]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.78} metalness={0.08} />
      </mesh>

      {/* Vỉa hè bên hông phải showroom (X: 9.5 đến 13.5, Z: -17.5 đến 7.5) */}
      <mesh position={[11.5, 0.1, -5.0]} receiveShadow>
        <boxGeometry args={[4.0, 0.12, 25.0]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.78} metalness={0.08} />
      </mesh>

      {/* Vỉa hè góc ngã tư nối liền (X: 9.5 đến 13.5, Z: 7.5 đến 11.2) */}
      <mesh position={[11.5, 0.1, 9.35]} receiveShadow>
        <boxGeometry args={[4.0, 0.12, 3.7]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.12} />
      </mesh>

      {/* Gờ đá bó vỉa hè (Granite Curbs) bo viền tiếp giáp lòng đường */}
      {/* Gờ bó vỉa trước mặt */}
      <mesh position={[-2.0, 0.12, 11.25]} receiveShadow>
        <boxGeometry args={[31.2, 0.16, 0.16]} />
        <meshStandardMaterial color="#64748b" roughness={0.65} />
      </mesh>
      {/* Gờ bó vỉa bên phải */}
      <mesh position={[13.55, 0.12, -2.0]} receiveShadow>
        <boxGeometry args={[0.16, 0.16, 26.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.65} />
      </mesh>

      {/* ================= 3. LÒNG ĐƯỜNG NHỰA ASPHALT NGÃ TƯ (CORNER ROADWAY) ================= */}
      {/* Nhánh đường trước mặt (East-West Roadway: Z từ 11.3 đến 17.5) */}
      <group position={[0, 0, 14.4]}>
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[35.8, 0.04, 6.2]} />
          <meshStandardMaterial color="#18191e" roughness={0.92} />
        </mesh>
        {/* Vạch tim đường đứt đoạn màu vàng */}
        {[-15, -10, -5, 0, 5, 10].map((lx, li) => (
          <mesh key={`ew-lane-${li}`} position={[lx, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 0.2]} />
            <meshStandardMaterial color="#facc15" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Nhánh đường bên phải (North-South Roadway: X từ 13.6 đến 17.5) */}
      <group position={[15.6, 0, 0]}>
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.04, 35.8]} />
          <meshStandardMaterial color="#18191e" roughness={0.92} />
        </mesh>
        {/* Vạch tim đường đứt đoạn màu vàng */}
        {[-15, -10, -5, 0, 5, 10].map((lz, li) => (
          <mesh key={`ns-lane-${li}`} position={[0, 0.065, lz]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[2.5, 0.2]} />
            <meshStandardMaterial color="#facc15" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ================= 4. VẠCH KẺ ĐƯỜNG CHO NGƯỜI ĐI BỘ (ZEBRA CROSSINGS) ================= */}
      {/* Vạch sang đường trên nhánh đường phía trước (Front Zebra Crossing) */}
      <group position={[6.0, 0.065, 14.4]}>
        {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((zz, zi) => (
          <mesh key={`fcross-${zi}`} position={[0, 0, zz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.48]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.7} />
          </mesh>
        ))}
        {/* Vạch dừng chờ đèn (Stop Line) */}
        <mesh position={[-2.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 5.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      </group>

      {/* Vạch sang đường trên nhánh đường bên phải (Side Zebra Crossing) */}
      <group position={[15.6, 0.065, 4.0]}>
        {[-1.6, -0.8, 0, 0.8, 1.6].map((xx, xi) => (
          <mesh key={`scross-${xi}`} position={[xx, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.48, 3.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.7} />
          </mesh>
        ))}
        {/* Vạch dừng chờ đèn bên hông */}
        <mesh position={[0, 0, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 0.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      </group>

      {/* ================= 5. HÀNG CÂY TỈA ĐA DIỆN 4 MÙA TRÊN VỈA HÈ (LOW-POLY STYLIZED TREES) ================= */}
      {/* 5.1 Cây hoa anh đào / đào bích hồng ở góc ngã tư (Corner Pink Blossom Tree) */}
      <group position={[11.5, 0.1, 9.2]}>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.32, 3.6, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 4.2, 0]} castShadow>
          <dodecahedronGeometry args={[1.7, 1]} />
          <meshStandardMaterial color={foliageColors.pink} roughness={0.65} />
        </mesh>
        <mesh position={[0.5, 4.8, 0.3]} castShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color={foliageColors.secondary} roughness={0.6} />
        </mesh>
      </group>

      {/* 5.2 Cây xanh tươi mát vỉa hè trước (Front Green Tree) */}
      <group position={[4.5, 0.1, 9.2]}>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 3.4, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.8, 0]} castShadow>
          <dodecahedronGeometry args={[1.55, 1]} />
          <meshStandardMaterial color={foliageColors.primary} roughness={0.65} />
        </mesh>
        <mesh position={[-0.4, 4.4, -0.2]} castShadow>
          <dodecahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color={foliageColors.secondary} roughness={0.6} />
        </mesh>
      </group>

      {/* 5.3 Cây vàng chanh vỉa hè trước (Front Lime Tree) */}
      <group position={[-3.5, 0.1, 9.2]}>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 3.2, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <dodecahedronGeometry args={[1.45, 1]} />
          <meshStandardMaterial color={foliageColors.accent} roughness={0.6} />
        </mesh>
      </group>

      {/* 5.4 Cây mùa thu vàng hổ phách vỉa hè xa (Far Front Autumn Tree) */}
      <group position={[-11.5, 0.1, 9.2]}>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.26, 3.0, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, 0]} castShadow>
          <dodecahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial color={foliageColors.secondary} roughness={0.65} />
        </mesh>
      </group>

      {/* 5.5 Cây vỉa hè bên hông phải (Side Green Tree) */}
      <group position={[11.5, 0.1, -2.5]}>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 3.2, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <dodecahedronGeometry args={[1.45, 1]} />
          <meshStandardMaterial color={foliageColors.primary} roughness={0.65} />
        </mesh>
      </group>

      {/* 5.6 Cây hoa đào vỉa hè góc sau phải (Back-Right Blossom Tree) */}
      <group position={[11.5, 0.1, -9.5]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.26, 3.0, 10]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <dodecahedronGeometry args={[1.35, 1]} />
          <meshStandardMaterial color={foliageColors.pink} roughness={0.65} />
        </mesh>
      </group>

      {/* ================= 6. CỘT ĐÈN ĐƯỜNG CHỮ L TỐI GIẢN HIỆN ĐẠI (MINIMALIST L-SHAPED STREETLAMPS) ================= */}
      {/* Cột đèn 1: Góc ngã tư */}
      <group position={[12.5, 0.1, 10.5]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Thân trụ thép đen mờ */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 4.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Cần đèn uốn vuông 90 độ vươn ra lòng đường */}
        <mesh position={[-0.45, 4.75, 0]}>
          <boxGeometry args={[1.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Chóa đèn LED phẳng tinh tế */}
        <mesh position={[-0.9, 4.68, 0]}>
          <boxGeometry args={[0.3, 0.05, 0.16]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#f59e0b"
            emissiveIntensity={isNight ? 2.8 : 1.0}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          position={[-0.9, 4.5, 0]}
          color="#fef08a"
          intensity={isNight ? 2.5 : 1.0}
          distance={9}
          decay={2}
        />
      </group>

      {/* Cột đèn 2: Vỉa hè trước showroom */}
      <group position={[-1.5, 0.1, 10.5]} rotation={[0, 0, 0]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 4.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.75, 0.45]}>
          <boxGeometry args={[0.1, 0.1, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.68, 0.9]}>
          <boxGeometry args={[0.16, 0.05, 0.3]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#f59e0b"
            emissiveIntensity={isNight ? 2.8 : 1.0}
            toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, 4.5, 0.9]} color="#fef08a" intensity={isNight ? 2.2 : 0.9} distance={8} decay={2} />
      </group>

      {/* Cột đèn 3: Vỉa hè trước xa */}
      <group position={[-9.5, 0.1, 10.5]} rotation={[0, 0, 0]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 4.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.75, 0.45]}>
          <boxGeometry args={[0.1, 0.1, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.68, 0.9]}>
          <boxGeometry args={[0.16, 0.05, 0.3]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={isNight ? 2.8 : 1.0} />
        </mesh>
        <pointLight position={[0, 4.5, 0.9]} color="#fef08a" intensity={isNight ? 2.0 : 0.8} distance={8} decay={2} />
      </group>

      {/* Cột đèn 4: Vỉa hè bên phải */}
      <group position={[12.5, 0.1, -6.0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 4.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.75, 0.45]}>
          <boxGeometry args={[0.1, 0.1, 1.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.68, 0.9]}>
          <boxGeometry args={[0.16, 0.05, 0.3]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={isNight ? 2.8 : 1.0} />
        </mesh>
        <pointLight position={[0, 4.5, 0.9]} color="#fef08a" intensity={isNight ? 2.0 : 0.8} distance={8} decay={2} />
      </group>

      {/* ================= 7. GHẾ BĂNG CÔNG VIÊN VEN ĐƯỜNG (PARK BENCHES) ================= */}
      {/* Ghế 1: Vỉa hè trước */}
      <group position={[0.8, 0.1, 9.2]} rotation={[0, 0, 0]}>
        <mesh position={[-0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* Ghế 2: Vỉa hè trước xa */}
      <group position={[-7.0, 0.1, 9.2]} rotation={[0, 0, 0]}>
        <mesh position={[-0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* Ghế 3: Vỉa hè bên phải */}
      <group position={[11.5, 0.1, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[-0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.75, 0.25, 0]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.55]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.08, 0.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 8. THÙNG RÁC PHÂN LOẠI XANH & XÁM VEN VỈA HÈ ================= */}
      <group position={[12.2, 0.1, 8.5]}>
        {/* Thùng xanh tái chế */}
        <mesh position={[-0.22, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.16, 0.85, 16]} />
          <meshStandardMaterial color="#15803d" roughness={0.4} />
        </mesh>
        {/* Thùng xám rác vô cơ */}
        <mesh position={[0.22, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.16, 0.85, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} />
        </mesh>
      </group>

      {/* ================= 9. TRỤ CỨU HỎA ĐỎ ĐẶC TRƯNG ĐÔ THỊ ================= */}
      <group position={[12.5, 0.1, 6.2]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 0.76, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.4} />
        </mesh>
      </group>

      {/* ================= 10. BIỂN TÊN PHỐ HÀ NỘI "PHỐ TỰ ĐỘNG HÓA" ================= */}
      <group
        position={[10.5, 0.1, 8.0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'street-sign',
            title: 'Phố Tự Động Hóa (Automation Street - Hà Nội)',
            category: 'Khu Phố Công Nghệ',
            price: 'Tọa độ: Hoàn Kiếm / Cầu Giấy, Hà Nội',
            specs: [
              'Con phố tập trung các showroom linh kiện tự động hoá và Maker Lab hàng đầu',
              'Không gian giao thoa giữa nét văn hóa Hà Nội và công nghệ tương lai Cyberpunk',
              'Đèn đường LED thông minh điều chỉnh nhiệt độ màu theo 4 Mùa trong năm'
            ],
            desc: 'Góc phố công nghệ sầm uất, nơi các kỹ sư, sinh viên và maker khắp cả nước tìm đến để giao lưu đồ án và mua sắm linh kiện PLC, Dateco, ESP32 chính hãng.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 3.6, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <boxGeometry args={[1.6, 0.45, 0.08]} />
          <meshStandardMaterial color="#0369a1" roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.4, 0]}>
          <boxGeometry args={[1.64, 0.49, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <pointLight position={[0, 3.7, 0.2]} color="#00f3ff" intensity={1.2} distance={3} />
      </group>

      {/* ================= 11. MÁY BÁN NƯỚC TỰ ĐỘNG CYBERPUNK (VENDING MACHINE) ================= */}
      <group
        position={[11.5, 0.1, -5.5]}
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
            desc: 'Máy bán nước giải khát tự động phục vụ 24/7 bên hè phố cho các kỹ sư làm việc ca đêm và khách dạo phố công nghệ.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 2.6, 0.9]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.8, 0.4]}>
          <boxGeometry args={[1.0, 1.3, 0.1]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} transparent opacity={0.8} roughness={0.1} />
        </mesh>
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
        <mesh position={[0, 2.55, 0.46]}>
          <boxGeometry args={[0.9, 0.2, 0.04]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      </group>

      {/* ================= 12. GÓC CÀ PHÊ & TRÀ ĐÁ VỈA HÈ HÀ NỘI ================= */}
      <group position={[11.2, 0.1, -8.0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.75, 0.04, 0.75]} />
          <meshStandardMaterial color="#78350f" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Phin cà phê & ly trà đá */}
        <mesh position={[-0.15, 0.42, 0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.15, 0.41, -0.05]} castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.11, 16]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.85} roughness={0.1} transparent />
        </mesh>
        {/* 2 ghế đẩu nhỏ */}
        <mesh position={[-0.45, 0.16, 0]} castShadow>
          <boxGeometry args={[0.3, 0.32, 0.3]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.6} />
        </mesh>
        <mesh position={[0.45, 0.16, 0]} castShadow>
          <boxGeometry args={[0.3, 0.32, 0.3]} />
          <meshStandardMaterial color="#dc2626" roughness={0.6} />
        </mesh>
      </group>

      {/* ================= 13. CÁC XE Ô TÔ ĐÔ THỊ MINI CUTE TRÊN ĐƯỜNG (CARS & VEHICLES) ================= */}
      {/* 13.1 Xe Đỏ Đô Thị (Red Sedan) - Đang chạy dọc đường trước mặt */}
      <group ref={movingCarRef} position={[0, 0.08, 13.0]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.45, 0.6, 2.5]} />
          <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.88, -0.15]} castShadow>
          <boxGeometry args={[1.3, 0.5, 1.5]} />
          <meshPhysicalMaterial color="#0f172a" transmission={0.85} roughness={0.1} metalness={0.9} transparent opacity={0.8} />
        </mesh>
        {/* Đèn pha */}
        <mesh position={[0, 0.48, 1.26]}>
          <boxGeometry args={[1.1, 0.08, 0.02]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={isNight ? 3 : 1} />
        </mesh>
        {/* 4 Bánh xe */}
        {[-0.78, 0.78].map((bx, bi) =>
          [-0.8, 0.8].map((bz, bj) => (
            <mesh key={`redw-${bi}-${bj}`} position={[bx, 0.24, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.15, 20]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 13.2 Xe Taxi Đô Thị Vàng (Yellow Compact Taxi) - Đang chạy dọc đường bên phải */}
      <group ref={movingCar2Ref} position={[15.6, 0.08, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.65, 2.7]} />
          <meshStandardMaterial color="#eab308" roughness={0.25} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.95, -0.1]} castShadow>
          <boxGeometry args={[1.35, 0.55, 1.6]} />
          <meshPhysicalMaterial color="#0f172a" transmission={0.85} roughness={0.1} metalness={0.9} transparent opacity={0.85} />
        </mesh>
        {/* Biển TAXI phát sáng trên nóc */}
        <mesh position={[0, 1.3, -0.1]}>
          <boxGeometry args={[0.5, 0.14, 0.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#facc15" emissiveIntensity={1.8} />
        </mesh>
        {/* 4 Bánh xe */}
        {[-0.8, 0.8].map((bx, bi) =>
          [-0.85, 0.85].map((bz, bj) => (
            <mesh key={`taxiw-${bi}-${bj}`} position={[bx, 0.25, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.16, 20]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 13.3 Xe Điện Thông Minh Xanh Ngọc (Cyan EV Smart Car) - Đỗ bên lề đường trước */}
      <group position={[-6.0, 0.08, 12.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.65, 2.6]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.95, -0.1]} castShadow>
          <boxGeometry args={[1.35, 0.55, 1.6]} />
          <meshPhysicalMaterial color="#0f172a" transmission={0.85} roughness={0.1} metalness={0.9} transparent opacity={0.8} />
        </mesh>
        {/* 4 Bánh xe */}
        {[-0.8, 0.8].map((bx, bi) =>
          [-0.85, 0.85].map((bz, bj) => (
            <mesh key={`evw-${bi}-${bj}`} position={[bx, 0.25, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.16, 20]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 13.4 Xe Giao Hàng Trắng Mini (White Delivery Van) Đỗ Bên Lề */}
      <group position={[-14.0, 0.08, 12.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 3.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.85, 0.8]} castShadow>
          <boxGeometry args={[1.5, 0.6, 1.2]} />
          <meshPhysicalMaterial color="#0f172a" transmission={0.85} roughness={0.1} transparent opacity={0.8} />
        </mesh>
        {/* 4 Bánh xe */}
        {[-0.85, 0.85].map((bx, bi) =>
          [-1.0, 1.0].map((bz, bj) => (
            <mesh key={`vanw-${bi}-${bj}`} position={[bx, 0.28, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.28, 0.28, 0.18, 20]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 13.5 Xe Máy Scooter Giao Hàng Hỏa Tốc Có Người Lái (Delivery Scooter With Rider) */}
      <group ref={movingScooterRef} position={[0, 0.08, 14.8]}>
        {/* Thân xe máy đỏ cam */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.35, 0.55, 1.3]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Đầu xe & Đèn pha */}
        <mesh position={[0, 0.65, 0.55]} castShadow>
          <boxGeometry args={[0.3, 0.35, 0.2]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.65, 0.66]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={isNight ? 3 : 1} />
        </mesh>
        {/* 2 Bánh xe */}
        {[-0.45, 0.45].map((wz, wi) => (
          <mesh key={`scoot-w-${wi}`} position={[0, 0.22, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#09090b" roughness={0.8} />
          </mesh>
        ))}
        {/* Thùng giao hàng hỏa tốc phía sau xe (Delivery Box) */}
        <mesh position={[0, 0.75, -0.42]} castShadow>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.75, -0.632]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Người lái xe (Rider figure) */}
        {/* Thân người áo khoác cam */}
        <mesh position={[0, 0.95, 0.05]} castShadow>
          <boxGeometry args={[0.32, 0.5, 0.25]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
        {/* Đầu đội mũ bảo hiểm đỏ */}
        <mesh position={[0, 1.35, 0.05]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Kính mũ bảo hiểm */}
        <mesh position={[0, 1.35, 0.18]} castShadow>
          <boxGeometry args={[0.22, 0.1, 0.08]} />
          <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
    </group>
  )
}
