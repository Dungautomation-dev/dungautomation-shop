import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Kiến Trúc Showroom Mở Rộng DungAutomation (Store Architecture)
 * - Tường sau & tường trái ốp lam gỗ tuyết tùng (Cedar acoustic slats) sang trọng
 * - Khung dầm thép đen & giàn Pergola mở thoáng khí chuẩn kiến trúc diorama
 * - Bảng hiệu Dateco & Dũng Automation siêu nét, không bị lóa
 * - Đèn rọi spotlight ấm 3000K
 */
export function StoreArchitecture({ isNight }) {
  // Biển hiệu Dũng Automation độ phân giải cao 2048x420 siêu sắc nét, KHÔNG BỊ LÓA
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
    ctx.fillRect(50, 45, 140, 38)
    ctx.fillRect(1858, 45, 140, 38)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px "Segoe UI", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('DATECO', 120, 72)
    ctx.fillText('DATECO', 1928, 72)

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
    ctx.moveTo(300, 215)
    ctx.lineTo(1748, 215)
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
      {/* ================= 1. TƯỜNG SAU & TƯỜNG TRÁI (KIẾN TRÚC MẶT CẮT DIORAMA MỞ RỘNG 21x19m) ================= */}
      {/* Tường sau (Back Wall) - màu xám than kiến trúc */}
      <mesh position={[-1.0, 3.8, -11.5]} receiveShadow castShadow>
        <boxGeometry args={[21.2, 7.6, 0.4]} />
        <meshStandardMaterial color="#1a202c" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* Tường bên trái (Left Wall) */}
      <mesh position={[-11.5, 3.8, -2.0]} receiveShadow castShadow>
        <boxGeometry args={[0.4, 7.6, 19.2]} />
        <meshStandardMaterial color="#1a202c" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* ================= 2. LAM GỖ TUYẾT TÙNG CAO CẤP (CEDAR ACOUSTIC SLATS) ================= */}
      {/* Lam gỗ ốp tường sau tạo cảm giác ấm cúng, sang trọng như showroom Apple */}
      {Array.from({ length: 27 }).map((_, i) => (
        <mesh key={`back-${i}`} position={[-10.6 + i * 0.74, 3.8, -11.26]} castShadow>
          <boxGeometry args={[0.34, 7.2, 0.08]} />
          <meshStandardMaterial color="#854d0e" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}

      {/* Lam gỗ tường trái */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`left-${i}`} position={[-11.26, 3.8, -10.6 + i * 0.74]} castShadow>
          <boxGeometry args={[0.08, 7.2, 0.34]} />
          <meshStandardMaterial color="#854d0e" roughness={0.6} metalness={0.05} />
        </mesh>
      ))}

      {/* Dải LED hắt khe tường trên cùng (Wall Wash Downlight Strip) */}
      <mesh position={[-1.0, 7.3, -11.1]}>
        <boxGeometry args={[20.6, 0.04, 0.04]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive="#fed7aa"
          emissiveIntensity={isNight ? 2.5 : 1.2}
          toneMapped={false}
        />
      </mesh>

      {/* ================= 3. KHUNG DẦM THÉP ĐEN & MÁI PERGOLA MỞ (OPEN TRELLIS BEAMS) ================= */}
      {/* Dầm thép đỉnh tường sau */}
      <mesh position={[-1.0, 7.5, -11.3]} castShadow>
        <boxGeometry args={[21.2, 0.3, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Dầm thép đỉnh tường trái */}
      <mesh position={[-11.3, 7.5, -2.0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 19.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Dầm thép viền trần phía trước (Front Trellis Beam) */}
      <mesh position={[-1.0, 7.5, 7.3]} castShadow>
        <boxGeometry args={[21.2, 0.3, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Dầm thép viền trần bên phải (Right Trellis Beam) */}
      <mesh position={[9.3, 7.5, -2.0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 19.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Các thanh giàn Pergola thoáng khí đón ánh sáng studio, KHÔNG BỊ BÍT KÍN NHƯ HỘP TỐI */}
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`pergola-${i}`} position={[-8.8 + i * 2.2, 7.55, -2.0]} castShadow>
          <boxGeometry args={[0.15, 0.25, 18.6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* Cột góc sau trái */}
      <mesh position={[-11.3, 3.8, -11.3]} castShadow>
        <boxGeometry args={[0.4, 7.6, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Cột góc sau phải */}
      <mesh position={[9.3, 3.8, -11.3]} castShadow>
        <boxGeometry args={[0.4, 7.6, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Cột góc trước trái */}
      <mesh position={[-11.3, 3.8, 7.3]} castShadow>
        <boxGeometry args={[0.4, 7.6, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= 4. BẢNG HIỆU DATECO & DŨNG AUTOMATION NÉT ĐẸP KHÔNG LÓA ================= */}
      <group position={[-1.0, 6.2, -11.05]}>
        {/* Nền khung kim loại sang trọng */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[14.5, 1.85, 0.08]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Mặt bảng hiệu siêu nét, không bị lóa (toneMapped=true, balanced emissive) */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[14.3, 1.75]} />
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
      {[-7.0, -2.5, 2.0, 6.5].map((lx, ix) =>
        [-6.5, -2.0, 2.5].map((lz, iz) => (
          <group key={`${ix}-${iz}`} position={[lx, 7.4, lz]}>
            <mesh>
              <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial
                color="#fffbeb"
                emissive="#fef3c7"
                emissiveIntensity={isNight ? 2.0 : 1.1}
                toneMapped={false}
              />
            </mesh>
            <pointLight
              position={[0, -0.2, 0]}
              color="#ffeedd"
              intensity={isNight ? 1.6 : 0.9}
              distance={9}
              decay={2}
            />
          </group>
        ))
      )}
    </group>
  )
}

export default StoreArchitecture
