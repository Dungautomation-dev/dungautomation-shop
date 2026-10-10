import React, { useMemo } from 'react'
import * as THREE from 'three'

export function StoreArchitecture({ isNight }) {
  // Biển hiệu Neon độ phân giải cao sắc nét bằng HTML5 Canvas 2D
  const mainNeonTex = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 1024
    cvs.height = 160
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, 1024, 160)
    ctx.font = 'bold 56px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#00f3ff'
    ctx.shadowBlur = 24
    ctx.fillStyle = '#ffffff'
    ctx.fillText('⚡ DUNGAUTOMATION ⚡', 512, 80)
    ctx.shadowBlur = 8
    ctx.fillStyle = '#00f3ff'
    ctx.fillText('⚡ DUNGAUTOMATION ⚡', 512, 80)
    return new THREE.CanvasTexture(cvs)
  }, [])

  const subNeonTex = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 1024
    cvs.height = 100
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, 1024, 100)
    ctx.font = 'bold 36px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#f59e0b'
    ctx.shadowBlur = 18
    ctx.fillStyle = '#fef08a'
    ctx.fillText('SIEMENS PLC • ESP32 • ARDUINO • ROBOTICS LAB', 512, 50)
    return new THREE.CanvasTexture(cvs)
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. TƯỜNG SAU & TƯỜNG TRÁI (KIẾN TRÚC MẶT CẮT DIORAMA) ================= */}
      {/* Tường sau (Back Wall) - màu xám than kiến trúc */}
      <mesh position={[-1.5, 3.8, -9.0]} receiveShadow castShadow>
        <boxGeometry args={[15.2, 7.6, 0.4]} />
        <meshStandardMaterial color="#1a202c" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* Tường bên trái (Left Wall) */}
      <mesh position={[-9.0, 3.8, -1.5]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 7.6, 15.2]} />
        <meshStandardMaterial color="#1a202c" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* ================= 2. LAM GỖ TUYẾT TÙNG CAO CẤP (CEDAR ACOUSTIC SLATS) ================= */}
      {/* Lam gỗ ốp tường sau tạo cảm giác ấm cúng, sang trọng như showroom Apple */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`back-${i}`} position={[-7.5 + i * 0.8, 3.8, -8.76]} castShadow>
          <boxGeometry args={[0.35, 7.2, 0.08]} />
          <meshStandardMaterial color="#854d0e" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}

      {/* Lam gỗ tường trái */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`left-${i}`} position={[-8.76, 3.8, -7.5 + i * 0.8]} castShadow>
          <boxGeometry args={[0.08, 7.2, 0.35]} />
          <meshStandardMaterial color="#854d0e" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}

      {/* Dải LED hắt khe tường trên cùng (Wall Wash Downlight Strip) */}
      <mesh position={[-1.5, 7.3, -8.6]}>
        <boxGeometry args={[14.8, 0.04, 0.04]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#fed7aa"
          emissiveIntensity={isNight ? 2.5 : 1.2}
          toneMapped={false}
        />
      </mesh>

      {/* ================= 3. KHUNG DẦM THÉP ĐEN & MÁI PERGOLA MỞ (OPEN TRELLIS BEAMS) ================= */}
      {/* Dầm thép chạy dọc đỉnh tường sau */}
      <mesh position={[-1.5, 7.5, -8.8]} castShadow>
        <boxGeometry args={[15.2, 0.3, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Dầm thép đỉnh tường trái */}
      <mesh position={[-8.8, 7.5, -1.5]} castShadow>
        <boxGeometry args={[0.3, 0.3, 15.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Các thanh giàn Pergola thoáng khí đón ánh sáng studio, KHÔNG BỊ BÍT KÍN NHƯ HỘP TỐI */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`pergola-${i}`} position={[-6.5 + i * 2.2, 7.55, -4.5]} castShadow>
          <boxGeometry args={[0.15, 0.25, 8.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Cột góc sau trái */}
      <mesh position={[-8.8, 3.8, -8.8]} castShadow>
        <boxGeometry args={[0.4, 7.6, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= 4. BẢNG HIỆU NEON TRANG TRỌNG TRÊN TƯỜNG SHOWROOM ================= */}
      <group position={[-1.5, 6.2, -8.6]}>
        {/* Nền mica đen bóng sang trọng */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[10.5, 1.6, 0.08]} />
          <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Chữ Neon phát quang chính */}
        <mesh position={[0, 0.22, 0.05]}>
          <planeGeometry args={[10.0, 1.2]} />
          <meshStandardMaterial
            map={mainNeonTex}
            transparent
            emissive="#00f3ff"
            emissiveIntensity={isNight ? 2.8 : 1.8}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Dòng chữ phụ vàng ấm */}
        <mesh position={[0, -0.45, 0.05]}>
          <planeGeometry args={[8.5, 0.6]} />
          <meshStandardMaterial
            map={subNeonTex}
            transparent
            emissive="#f59e0b"
            emissiveIntensity={isNight ? 2.4 : 1.5}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ================= 5. ĐÈN RỌI SPOTLIGHT ÂM TRẦN WARM 3000K ================= */}
      {[-5, 0, 4].map((lx, ix) => (
        <group key={ix} position={[lx, 7.4, -2.5]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#fffbeb"
              emissive="#fef3c7"
              emissiveIntensity={isNight ? 2.2 : 1.2}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, -0.2, 0]}
            color="#ffeedd"
            intensity={isNight ? 2.2 : 1.2}
            distance={10}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}

export default StoreArchitecture
