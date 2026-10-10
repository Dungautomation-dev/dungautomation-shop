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
      {/* Khối đế đá vôi sáng màu sang trọng (Architectural Limestone Base) */}
      <mesh position={[0, -0.75, 0]} receiveShadow>
        <boxGeometry args={[36, 1.3, 36]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Tầng vát chân bục giật cấp tinh tế */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[36.4, 0.08, 36.4]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Gờ nẹp kim loại bo chân đế */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[36.44, 0.025, 36.44]} />
        <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ================= 2. NỀN CỎ XANH & CẢNH QUAN ĐÔ THỊ (VIBRANT GREEN LAWN BASE) ================= */}
      <mesh position={[0, 0.035, 0]} receiveShadow>
        <boxGeometry args={[35.8, 0.07, 35.8]} />
        <meshStandardMaterial color={season === 'winter' ? '#e2e8f0' : '#4ade80'} roughness={0.8} />
      </mesh>

      {/* Lớp tuyết mỏng trên vỉa hè nếu là Mùa Đông */}
      {season === 'winter' && (
        <mesh position={[12, 0.073, 12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
      )}

      {/* ================= 3. SÀN SHOWROOM MỞ RỘNG 21x19m SÁNG RÕ KHÔNG BỊ TỐI ================= */}
      {/* Nẹp viền nhôm xước bo quanh gờ bậc thềm showroom */}
      <mesh position={[-1.0, 0.1, -2.0]} receiveShadow>
        <boxGeometry args={[21.2, 0.06, 19.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Sàn đá bê tông kiến trúc xám ấm sáng rõ (Bright Architectural Slate Floor) */}
      <mesh position={[-1.0, 0.14, -2.0]} receiveShadow>
        <boxGeometry args={[21.0, 0.04, 19.0]} />
        <meshStandardMaterial
          color="#5b6777"
          roughness={0.6}
          metalness={0.15}
        />
      </mesh>

      {/* Lưới chỉ ron gạch phân ô thanh lịch trên mặt sàn showroom (Tile Joints) */}
      <gridHelper
        args={[21, 16, '#718096', '#64748b']}
        position={[-1.0, 0.162, -2.0]}
      />

      {/* Len chân tường gạch viền tối màu quanh showroom */}
      {/* Len tường sau (Back Baseboard) */}
      <mesh position={[-1.0, 0.18, -11.45]}>
        <boxGeometry args={[21.0, 0.06, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Len tường trái (Left Baseboard) */}
      <mesh position={[-11.45, 0.18, -2.0]}>
        <boxGeometry args={[0.1, 0.06, 19.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
    </group>
  )
}

export default DioramaPlinth
