import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'

export function RoboticsDept({ level, onSelect, isSelected, demoBoost }) {
  const joint1Ref = useRef()
  const joint2Ref = useRef()
  const joint3Ref = useRef()
  const printHeadRef = useRef()

  // Chu trình động học cánh tay robot 6 trục (6-DOF Kinematics Animation)
  useFrame(({ clock }) => {
    const speed = demoBoost ? 4.5 : 1.4
    const t = clock.getElapsedTime() * speed

    if (joint1Ref.current) {
      joint1Ref.current.rotation.y = Math.sin(t * 0.8) * 0.75
    }
    if (joint2Ref.current) {
      joint2Ref.current.rotation.x = -0.3 + Math.sin(t * 1.2) * 0.4
    }
    if (joint3Ref.current) {
      joint3Ref.current.rotation.x = 0.2 + Math.cos(t * 1.2) * 0.45
    }

    // Đầu in 3D đùn nhựa di chuyển
    if (printHeadRef.current) {
      printHeadRef.current.position.x = 1.4 + Math.sin(t * 3.5) * 0.28
      printHeadRef.current.position.z = 1.2 + Math.cos(t * 4.2) * 0.28
    }
  })

  return (
    <group
      position={[2.0, 0, -1.0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('robot_arm')
      }}
    >
      {/* 3D Floating Tag Label */}
      <Html position={[0, 4.6, 0]} center distanceFactor={22}>
        <div className={`html-3d-tag ${isSelected ? 'selected' : ''}`}>
          🤖 CÁNH TAY ROBOT 6-DOF & MÁY IN 3D (CẤP {level})
        </div>
      </Html>

      {/* 1. Bục tròn xoay trưng bày trung tâm (Round Turntable Plinth) */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.7, 2.9, 1.0, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Vòng LED phát sáng màu cam công nghiệp viền quanh bục */}
      <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.65, 2.75, 32]} />
        <meshBasicMaterial color="#ea580c" />
      </mesh>

      {/* ============================================================
          2. CÁNH TAY ROBOT CÔNG NGHIỆP 6-DOF (MÀU CAM KUKA / FANUC)
          ============================================================ */}
      <group position={[-0.4, 1.0, 0]}>
        {/* Đế xoay robot Base */}
        <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.7, 0.8, 0.5, 20]} />
          <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Khớp xoay thân Joint 1 */}
        <group ref={joint1Ref} position={[0, 0.5, 0]}>
          {/* Cánh tay dưới Link 1 */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.45, 1.8, 0.45]} />
            <meshStandardMaterial color="#ea580c" metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Khớp khuỷu tay Joint 2 */}
          <group ref={joint2Ref} position={[0, 1.8, 0]}>
            {/* Cánh tay trên Link 2 */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <boxGeometry args={[0.35, 1.5, 0.35]} />
              <meshStandardMaterial color="#ea580c" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Khớp cổ tay Joint 3 & Đầu gắp Gripper */}
            <group ref={joint3Ref} position={[0, 1.5, 0]}>
              <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[0.28, 0.4, 0.48]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} />
              </mesh>

              {/* Vi mạch phát quang đang được robot gắp */}
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[0.38, 0.14, 0.38]} />
                <meshStandardMaterial
                  color="#00f3ff"
                  emissive="#06b6d4"
                  emissiveIntensity={1.8}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ============================================================
          3. MÁY IN 3D CÔNG NGHỆ CAO (3D PRINTER)
          ============================================================ */}
      <group position={[1.4, 1.0, 1.2]}>
        {/* Khung nhôm định hình 2020 màu xám */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.5} wireframe={false} />
        </mesh>
        {/* Bàn in gia nhiệt màu đen */}
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.08, 1.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Đầu đùn nhựa Extruder di chuyển linh hoạt */}
        <mesh ref={printHeadRef} position={[0, 0.8, 0]}>
          <boxGeometry args={[0.24, 0.24, 0.24]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>

      {/* Floating Hologram Icon khi lên Cấp 2 */}
      {level >= 2 && (
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
          <mesh position={[0, 5.8, 0]}>
            <dodecahedronGeometry args={[0.38, 0]} />
            <meshBasicMaterial color="#ea580c" wireframe />
          </mesh>
        </Float>
      )}
    </group>
  )
}

export default RoboticsDept
