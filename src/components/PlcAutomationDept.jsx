import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'

export function PlcAutomationDept({ level, onSelect, isSelected }) {
  const runLedRef = useRef()

  // Hiệu ứng nhấp nháy đèn RUN/STOP PLC thời gian thực
  useFrame(({ clock }) => {
    if (runLedRef.current) {
      const blink = Math.sin(clock.getElapsedTime() * 6) > 0
      runLedRef.current.material.color.set(blink ? '#22c55e' : '#14532d')
    }
  })

  return (
    <group
      position={[-6.5, 0, -1.0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('plc_automation')
      }}
    >
      {/* 3D Floating Tag Label */}
      <Html position={[0, 5.2, 0]} center distanceFactor={22}>
        <div className={`html-3d-tag ${isSelected ? 'selected' : ''}`}>
          🏭 TỦ PLC SIEMENS & HMI (CẤP {level})
        </div>
      </Html>

      {/* Tủ rack công nghiệp thép tĩnh điện màu xám ghi (Industrial Cabinet) */}
      <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 4.5, 1.5]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Rãnh nhôm gá thiết bị DIN-Rail */}
      {[-0.6, 0.9].map((dy, idx) => (
        <mesh key={idx} position={[0, 2.25 + dy, 0.76]} castShadow>
          <boxGeometry args={[3.8, 0.15, 0.05]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* ============================================================
          1. MODULE PLC SIEMENS S7-1200 (CHÍNH HÃNG)
          ============================================================ */}
      <group position={[-0.9, 3.15, 0.55]}>
        {/* Thân vỏ nhựa xám Siemens */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.3, 0.8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>

        {/* Nắp lật màu cam đặc trưng của dòng Siemens S7-1200 */}
        <mesh position={[0, 0.55, 0.02]} castShadow>
          <boxGeometry args={[1.75, 0.22, 0.82]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.55, 0.02]} castShadow>
          <boxGeometry args={[1.75, 0.22, 0.82]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} />
        </mesh>

        {/* Cổng mạng Ethernet PROFINET RJ45 màu đen */}
        <mesh position={[0.5, -0.4, 0.42]}>
          <boxGeometry args={[0.35, 0.3, 0.1]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>

        {/* Dãy đèn LED chỉ thị I/O và RUN/STOP */}
        <mesh ref={runLedRef} position={[-0.45, 0.35, 0.42]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[-0.25, 0.35, 0.42]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* ============================================================
          2. MÀN HÌNH HMI CẢM ỨNG WEINTEK 7-INCH (CHẠY GIAO DIỆN SCADA)
          ============================================================ */}
      <group position={[1.0, 3.2, 0.78]}>
        {/* Viền bezel đen màn hình */}
        <mesh castShadow>
          <boxGeometry args={[1.65, 1.15, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Mặt kính hiển thị biểu đồ SCADA tự động hóa */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.45, 0.95]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ============================================================
          3. BIẾN TẦN VFD VÀ BỘ NGUỒN TỔ ONG 24VDC
          ============================================================ */}
      {[-1.2, 0, 1.2].map((vx, vIdx) => (
        <group key={vIdx} position={[vx, 1.55, 0.55]}>
          {/* Vỏ biến tần với cánh tản nhiệt */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.85, 1.1, 0.65]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Màn hình hiển thị số 50.00 Hz đỏ */}
          <mesh position={[0, 0.35, 0.34]}>
            <planeGeometry args={[0.45, 0.2]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}

      {/* Hologram Floating Gear khi nâng cấp */}
      {level >= 2 && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
          <mesh position={[0, 5.8, 0]}>
            <torusGeometry args={[0.35, 0.08, 8, 16]} />
            <meshBasicMaterial color="#f59e0b" wireframe />
          </mesh>
        </Float>
      )}
    </group>
  )
}

export default PlcAutomationDept
