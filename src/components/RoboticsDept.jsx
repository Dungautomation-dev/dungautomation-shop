import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function RoboticsDept({ onSelect }) {
  const joint1Ref = useRef()
  const joint2Ref = useRef()
  const joint3Ref = useRef()
  const printHeadRef = useRef()

  // Chu trình động học cánh tay robot 6 trục (6-DOF Kinematics Animation)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1.5

    if (joint1Ref.current) {
      joint1Ref.current.rotation.y = Math.sin(t * 0.7) * 0.65
    }
    if (joint2Ref.current) {
      joint2Ref.current.rotation.x = -0.3 + Math.sin(t * 1.1) * 0.35
    }
    if (joint3Ref.current) {
      joint3Ref.current.rotation.x = 0.2 + Math.cos(t * 1.1) * 0.4
    }

    // Đầu in 3D đùn nhựa di chuyển
    if (printHeadRef.current) {
      printHeadRef.current.position.x = 1.3 + Math.sin(t * 3.2) * 0.22
      printHeadRef.current.position.z = 1.1 + Math.cos(t * 3.8) * 0.22
    }
  })

  return (
    <group
      position={[2.2, 0, -2.8]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.('robotics')
      }}
      cursor="pointer"
    >
      {/* ================= 1. BỤC TRÒN XOAY TRƯNG BÀY TRUNG TÂM (TURNTABLE PLINTH) ================= */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.6, 0.8, 36]} />
        <meshStandardMaterial color="#1a202c" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Vành gờ nhôm vát cạnh trên cùng của bục */}
      <mesh position={[0, 0.81, 0]} receiveShadow>
        <cylinderGeometry args={[2.52, 2.52, 0.04, 36]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Vòng LED phát sáng màu cam công nghiệp viền quanh bục */}
      <mesh position={[0, 0.825, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.42, 2.49, 36]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* ================= 2. CÁNH TAY ROBOT CÔNG NGHIỆP 6 TRỤC (6-DOF ARM) ================= */}
      <group position={[-0.4, 0.82, -0.3]}>
        {/* Khối đế robot tròn có ốc siết */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.62, 0.24, 24]} />
          <meshStandardMaterial color="#18181b" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Khớp xoay Trục 1 (Waist Joint) */}
        <group ref={joint1Ref} position={[0, 0.24, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.45, 0.4, 20]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Khớp vai Trục 2 (Shoulder Joint) */}
          <group ref={joint2Ref} position={[0, 0.38, 0]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.26, 0.26, 0.6, 20]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Cánh tay dưới (Lower Arm Segment) - Màu cam công nghiệp KUKA/ABB */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <boxGeometry args={[0.3, 1.3, 0.28]} />
              <meshStandardMaterial color="#ea580c" roughness={0.35} metalness={0.15} />
            </mesh>

            {/* Khớp khuỷu Trục 3 (Elbow Joint) */}
            <group ref={joint3Ref} position={[0, 1.45, 0]}>
              <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.5, 20]} />
                <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* Cánh tay trên (Forearm) */}
              <mesh position={[0, 0.65, 0]} castShadow>
                <boxGeometry args={[0.24, 1.1, 0.24]} />
                <meshStandardMaterial color="#ea580c" roughness={0.35} metalness={0.15} />
              </mesh>

              {/* Cổ tay xoay Trục 4, 5, 6 & Tay gắp hút chân không */}
              <group position={[0, 1.25, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.14, 0.16, 0.2, 16]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.8} />
                </mesh>

                {/* Giác hút chân không */}
                <mesh position={[0, 0.15, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.12, 0.12, 16]} />
                  <meshStandardMaterial color="#0284c7" roughness={0.3} />
                </mesh>

                {/* Con chip vi mạch đang được gắp (Glowing Microchip) */}
                <mesh position={[0, 0.25, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.04, 0.22]} />
                  <meshStandardMaterial
                    color="#00f3ff"
                    emissive="#00f3ff"
                    emissiveIntensity={3}
                    toneMapped={false}
                  />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ================= 3. MÁY IN 3D CÔNG NGHIỆP COREXY ================= */}
      <group position={[1.3, 0.82, 0.8]}>
        {/* Khung máy nhôm định hình V-Slot anodized đen */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.2, 1.1, 1.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} wireframe />
        </mesh>

        {/* Khay nhiệt bàn in (Heated Bed) */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.04, 0.9]} />
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Vật thể đang được in 3D (Vật mẫu màu xanh phát quang) */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.22, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>

        {/* Đầu in di chuyển (Extruder Toolhead) */}
        <group ref={printHeadRef} position={[0, 0.72, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.16, 0.22]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.6} />
          </mesh>
          <mesh position={[0, -0.09, 0]}>
            <coneGeometry args={[0.04, 0.06, 12]} />
            <meshStandardMaterial color="#eab308" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Đèn spotlight chiếu sáng bục robot */}
      <pointLight position={[0, 3.8, 0]} color="#ffedd5" intensity={2.2} distance={6} decay={2} />
    </group>
  )
}

export default RoboticsDept
