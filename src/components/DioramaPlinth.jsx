import React from 'react'

export function DioramaPlinth() {
  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. KHỐI ĐẾ KIẾN TRÚC VÁT CẠNH (PLINTH BASE) ================= */}
      {/* Khối đế dưới cùng màu đá basalt xám đen sang trọng */}
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <boxGeometry args={[22, 1.3, 22]} />
        <meshStandardMaterial color="#11151c" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Tầng vát chân bục giật cấp tinh tế */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[22.3, 0.08, 22.3]} />
        <meshStandardMaterial color="#181e28" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* ================= 2. DẢI LED CYAN VIỀN KHÔNG BỊ TRÙNG TỌA ĐỘ (ZERO Z-FIGHTING) ================= */}
      {/* Đặt ở khe âm (recessed groove) dưới gờ vỉa hè tại Y = -0.03, không chạm vào mặt sàn */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[22.34, 0.025, 22.34]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      {/* ================= 3. SÀN VỈA HÈ ĐÁ HOA CƯƠNG NGOẠI THẤT (GRANITE PAVERS) ================= */}
      {/* Nằm trọn vẹn tại Y = 0.035, bề dày 0.07 -> Đỉnh sàn vỉa hè đạt Y = 0.07 */}
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[21.8, 0.07, 21.8]} />
        <meshStandardMaterial color="#252b36" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Vạch kẻ hoa văn lát đá vỉa hè ngoại thất tinh tế */}
      <mesh position={[6.5, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 21.6]} />
        <meshStandardMaterial color="#222731" roughness={0.9} />
      </mesh>

      {/* ================= 4. SÀN SHOWROOM NỘI THẤT NÂNG BẬC CAO CẤP ================= */}
      {/* Bậc thềm nâng cao hẳn lên Y = 0.14 (vượt trên vỉa hè 7cm), viền nẹp kim loại bo cạnh */}
      {/* Nẹp viền kim loại đồng ánh kim (Brass trim) */}
      <mesh position={[-1.5, 0.10, -1.5]} receiveShadow>
        <boxGeometry args={[15.2, 0.06, 15.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Sàn đá cẩm thạch trắng Italian Calacatta White Marble */}
      <mesh position={[-1.5, 0.14, -1.5]} receiveShadow>
        <boxGeometry args={[15.0, 0.04, 15.0]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.18}
          metalness={0.06}
        />
      </mesh>

      {/* Len chân tường gạch viền tối màu quanh showroom */}
      <mesh position={[-1.5, 0.17, -8.95]}>
        <boxGeometry args={[14.8, 0.05, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      <mesh position={[-8.95, 0.17, -1.5]}>
        <boxGeometry args={[0.1, 0.05, 14.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </group>
  )
}

export default DioramaPlinth
