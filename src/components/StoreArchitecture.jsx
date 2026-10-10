import React, { useMemo } from 'react'
import * as THREE from 'three'

export function StoreArchitecture({ isNight }) {
  // Biển hiệu Dũng Automation độ phân giải cao 2048x400 siêu sắc nét, KHÔNG BỊ LÓA
  const signboardTex = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 2048
    cvs.height = 420
    const ctx = cvs.getContext('2d')

    // Nền mica đen ánh xám công nghiệp sang trọng
    ctx.fillStyle = '#060a12'
    ctx.fillRect(0, 0, 2048, 420)

    // Khung viền chỉ kim loại kép màu xanh cyan thanh lịch
    ctx.strokeStyle = '#00f3ff'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, 2008, 380)
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 2
    ctx.strokeRect(28, 28, 1992, 364)

    // Huy hiệu Dateco góc trái và phải
    ctx.fillStyle = '#0284c7'
    ctx.fillRect(50, 45, 130, 36)
    ctx.fillRect(1868, 45, 130, 36)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('DATECO', 115, 70)
    ctx.fillText('DATECO', 1933, 70)

    // Dòng chữ thương hiệu chính: ⚡ DŨNG AUTOMATION ⚡
    ctx.textAlign = 'center'
    ctx.font = '900 86px "Plus Jakarta Sans", "Segoe UI", Arial, sans-serif'
    
    // Viền nét nhẹ để chữ nổi bật, không dùng blur dày gây nhòe
    ctx.strokeStyle = '#00f3ff'
    ctx.lineWidth = 3
    ctx.strokeText('⚡ DŨNG AUTOMATION ⚡', 1024, 155)

    ctx.fillStyle = '#ffffff'
    ctx.fillText('⚡ DŨNG AUTOMATION ⚡', 1024, 155)

    // Đường gạch chỉ phân cách vàng kim sang trọng
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(320, 215)
    ctx.lineTo(1728, 215)
    ctx.stroke()

    // Khẩu hiệu chính thức: "Chia sẻ để thành công"
    ctx.font = 'italic bold 52px "Segoe UI", serif, sans-serif'
    ctx.fillStyle = '#fde047'
    ctx.shadowColor = '#f59e0b'
    ctx.shadowBlur = 6
    ctx.fillText('“ Chia sẻ để thành công ”', 1024, 285)
    ctx.shadowBlur = 0

    // Dòng giới thiệu thiết bị Dateco
    ctx.font = 'bold 26px "JetBrains Mono", monospace'
    ctx.fillStyle = '#38bdf8'
    ctx.fillText('HỆ THỐNG TỦ ĐIỆN CÔNG NGHIỆP DATECO • SCADA • PLC SIEMENS • ROBOTICS', 1024, 355)

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

      {/* ================= 4. BẢNG HIỆU DATECO & DŨNG AUTOMATION NÉT ĐẸP KHÔNG LÓA ================= */}
      <group position={[-1.5, 6.2, -8.6]}>
        {/* Nền khung kim loại sang trọng */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[11.2, 1.8, 0.08]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Mặt bảng hiệu siêu nét, không bị lóa (toneMapped=true, balanced emissive) */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[11.0, 1.7]} />
          <meshStandardMaterial
            map={signboardTex}
            emissiveMap={signboardTex}
            emissive="#ffffff"
            emissiveIntensity={isNight ? 0.7 : 0.45}
            roughness={0.2}
            metalness={0.1}
            toneMapped={true}
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
