import React from 'react'

/**
 * Khối Đế Diorama Kiến Trúc Mở Rộng 36x36m (Expanded Diorama Plinth Base)
 * Nền tảng nâng đỡ toàn bộ Showroom DungAutomation mở rộng và góc phố sầm uất bao quanh.
 * Thiết kế vát cạnh giật cấp tinh tế, sàn gạch Slate chống chói cao cấp.
 */
export function DioramaPlinth({ season = 'spring' }) {
  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. KHỐI ĐẾ KIẾN TRÚC VÁT CẠNH (PLINTH BASE 36x36m) ================= */}
      {/* Khối đế dưới cùng màu đá basalt xám đen sang trọng */}
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <boxGeometry args={[36, 1.3, 36]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.7} metalness={0.25} />
      </mesh>

      {/* Tầng vát chân bục giật cấp tinh tế */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[36.4, 0.08, 36.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Dải LED cyan tinh tế viền khe âm bục */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[36.44, 0.025, 36.44]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>

      {/* ================= 2. NỀN VỈA HÈ ĐÁ HOA CƯƠNG TOÀN KHU ĐÔ THỊ ================= */}
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[35.8, 0.07, 35.8]} />
        <meshStandardMaterial color="#1e2430" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Lớp tuyết mỏng trên vỉa hè nếu là Mùa Đông */}
      {season === 'winter' && (
        <mesh position={[12, 0.073, 12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </mesh>
      )}

      {/* ================= 3. SÀN SHOWROOM MỞ RỘNG 21x19m NỘI THẤT CAO CẤP ================= */}
      {/* Nẹp viền nhôm titan mờ bo quanh gờ bậc thềm showroom */}
      <mesh position={[-1.0, 0.1, -2.0]} receiveShadow>
        <boxGeometry args={[21.2, 0.06, 19.2]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Sàn đá Slate / Gạch Porcelain xám khói tự nhiên chống chói hoàn toàn */}
      <mesh position={[-1.0, 0.14, -2.0]} receiveShadow>
        <boxGeometry args={[21.0, 0.04, 19.0]} />
        <meshStandardMaterial
          color="#222933"
          roughness={0.68}
          metalness={0.12}
        />
      </mesh>

      {/* Lưới chỉ ron gạch phân ô thanh lịch trên mặt sàn showroom (Tile Joints) */}
      <gridHelper
        args={[21, 16, '#384353', '#333e4d']}
        position={[-1.0, 0.162, -2.0]}
      />

      {/* Len chân tường gạch viền tối màu quanh showroom */}
      {/* Len tường sau (Back Baseboard) */}
      <mesh position={[-1.0, 0.18, -11.45]}>
        <boxGeometry args={[21.0, 0.06, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* Len tường trái (Left Baseboard) */}
      <mesh position={[-11.45, 0.18, -2.0]}>
        <boxGeometry args={[0.1, 0.06, 19.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>
    </group>
  )
}

export default DioramaPlinth
