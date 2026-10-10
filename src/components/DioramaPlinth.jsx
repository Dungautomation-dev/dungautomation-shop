import React from 'react'

export function DioramaPlinth() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Khối đế chính màu đá phiến xám đen sang trọng (Plinth Base) */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <boxGeometry args={[22, 1.4, 22]} />
        <meshStandardMaterial color="#1a202c" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* 2. Dải LED Cyan viền phát quang 360° quanh chân bục */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[22.2, 0.1, 22.2]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* 3. Sàn vỉa hè ngoại thất lát đá hoa cương xám (Outdoor Sidewalk) */}
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[21.8, 0.08, 21.8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* 4. Sàn nội thất cửa hàng (Gạch đá cẩm thạch trắng Italian White Marble) */}
      <mesh position={[-1.5, 0.06, -1.5]} receiveShadow>
        <boxGeometry args={[15, 0.1, 15]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Lưới phân chia gạch nhẹ nhàng trên sàn showroom */}
      <gridHelper
        args={[15, 15, '#cbd5e1', '#e2e8f0']}
        position={[-1.5, 0.12, -1.5]}
      />
    </group>
  )
}

export default DioramaPlinth
