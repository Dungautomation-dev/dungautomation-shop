import React from 'react'

export function DioramaPlinth({ season = 'spring' }) {
  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. KHỐI ĐẾ KIẾN TRÚC VÁT CẠNH (PLINTH BASE) ================= */}
      {/* Khối đế dưới cùng màu đá basalt xám đen sang trọng */}
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <boxGeometry args={[22, 1.3, 22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Tầng vát chân bục giật cấp tinh tế */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[22.3, 0.08, 22.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* ================= 2. DẢI LED CYAN VIỀN KHÔNG BỊ TRÙNG TỌA ĐỘ ================= */}
      {/* Đặt ở khe âm dưới gờ vỉa hè tại Y = -0.03 */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[22.34, 0.025, 22.34]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      {/* ================= 3. SÀN VỈA HÈ ĐÁ HOA CƯƠNG NGOẠI THẤT (GRANITE PAVERS) ================= */}
      {/* Nằm trọn vẹn tại Y = 0.035, bề dày 0.07 -> Đỉnh sàn vỉa hè đạt Y = 0.07 */}
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[21.8, 0.07, 21.8]} />
        <meshStandardMaterial color="#1e2430" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Vạch kẻ hoa văn lát đá vỉa hè ngoại thất tinh tế */}
      <mesh position={[6.5, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 21.6]} />
        <meshStandardMaterial color="#171c26" roughness={0.9} />
      </mesh>

      {/* Mảng tuyết vỉa hè nếu là mùa đông */}
      {season === 'winter' && (
        <mesh position={[8.5, 0.073, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 21.5]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </mesh>
      )}

      {/* ================= 4. SÀN SHOWROOM NỘI THẤT CAO CẤP CHỐNG CHÓI (NON-GLARE MATTE SLATE FLOOR) ================= */}
      {/* Nẹp viền kim loại nhôm titan phay xước bo cạnh bậc thềm */}
      <mesh position={[-1.5, 0.10, -1.5]} receiveShadow>
        <boxGeometry args={[15.2, 0.06, 15.2]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Sàn đá Slate/Gạch Porcelain xám khói cao cấp, độ nhám 0.6 khử chói hoàn toàn */}
      <mesh position={[-1.5, 0.14, -1.5]} receiveShadow>
        <boxGeometry args={[15.0, 0.04, 15.0]} />
        <meshStandardMaterial
          color="#29303d" // Xám khói đá tự nhiên cao cấp, không bị nổ trắng chói mắt
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Lưới đường ron gạch phân ô thanh lịch trên sàn (Tile Joints) */}
      <gridHelper
        args={[15, 12, '#3b4759', '#3b4759']}
        position={[-1.5, 0.162, -1.5]}
      />

      {/* Len chân tường gạch viền tối màu quanh showroom */}
      <mesh position={[-1.5, 0.18, -8.95]}>
        <boxGeometry args={[14.8, 0.06, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
      <mesh position={[-8.95, 0.18, -1.5]}>
        <boxGeometry args={[0.1, 0.06, 14.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
    </group>
  )
}

export default DioramaPlinth
