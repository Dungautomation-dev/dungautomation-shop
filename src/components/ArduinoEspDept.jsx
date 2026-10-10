import React from 'react'
import { Float, Html } from '@react-three/drei'

export function ArduinoEspDept({ level, onSelect, isSelected }) {
  return (
    <group
      position={[-6.5, 0, -6.5]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('arduino_esp')
      }}
    >
      {/* 3D Floating Tag Label */}
      <Html position={[0, 5.2, 0]} center distanceFactor={22}>
        <div className={`html-3d-tag ${isSelected ? 'selected' : ''}`}>
          ⚡ ESP32 & ARDUINO LAB (CẤP {level})
        </div>
      </Html>

      {/* Kệ kính 3 tầng khung thép hộp đen nhám */}
      <mesh position={[-2.1, 2.5, 0]} castShadow>
        <boxGeometry args={[0.1, 5.0, 1.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[2.1, 2.5, 0]} castShadow>
        <boxGeometry args={[0.1, 5.0, 1.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 3 tầng kính cường lực có dải LED soi sáng */}
      {[0, 1, 2].map((shelfIdx) => {
        const yPos = 1.0 + shelfIdx * 1.5
        return (
          <group key={shelfIdx} position={[0, yPos, 0]}>
            {/* Tấm kính */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.2, 0.08, 1.4]} />
              <meshPhysicalMaterial
                color="#e0f2fe"
                transparent
                opacity={0.5}
                roughness={0.1}
                transmission={0.8}
              />
            </mesh>

            {/* Dải LED phát sáng dưới mép kính */}
            <mesh position={[0, -0.06, 0.65]}>
              <boxGeometry args={[4.0, 0.04, 0.06]} />
              <meshBasicMaterial color="#00f3ff" />
            </mesh>

            {/* CÁC BOARD MẠCH VI ĐIỀU KHIỂN TRƯNG BÀY CHI TIẾT */}
            {[-1.4, -0.45, 0.45, 1.4].map((bx, bIdx) => {
              const isArduino = (bIdx % 2 === 0)
              const isEsp = (bIdx === 1)
              const isPi = (bIdx === 3)

              return (
                <group key={bIdx} position={[bx, 0.1, 0.1]}>
                  {/* Bo mạch PCB */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.7, 0.05, 0.9]} />
                    <meshStandardMaterial
                      color={isArduino ? '#0284c7' : (isPi ? '#166534' : '#18181b')}
                      roughness={0.3}
                      metalness={0.1}
                    />
                  </mesh>

                  {/* Chip vi điều khiển kim loại trung tâm */}
                  <mesh position={[0, 0.05, 0]}>
                    <boxGeometry args={[isEsp ? 0.42 : 0.28, 0.04, isEsp ? 0.42 : 0.28]} />
                    <meshStandardMaterial
                      color={isEsp ? '#d4d4d8' : '#27272a'}
                      metalness={isEsp ? 0.9 : 0.4}
                      roughness={0.3}
                    />
                  </mesh>

                  {/* Cổng USB kim loại sáng bóng */}
                  <mesh position={[0, 0.08, -0.4]}>
                    <boxGeometry args={[0.26, 0.14, 0.2]} />
                    <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                  </mesh>

                  {/* Hàng chân cắm Header Pins màu đen viền vàng */}
                  {[-0.3, 0.3].map((hx, hIdx) => (
                    <mesh key={hIdx} position={[hx, 0.08, 0]}>
                      <boxGeometry args={[0.06, 0.1, 0.8]} />
                      <meshStandardMaterial color="#09090b" roughness={0.5} />
                    </mesh>
                  ))}
                </group>
              )
            })}
          </group>
        )
      })}

      {/* Floating Hologram Icon trên đỉnh kệ khi nâng cấp */}
      {level >= 2 && (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh position={[0, 5.8, 0]}>
            <octahedronGeometry args={[0.35, 0]} />
            <meshBasicMaterial color="#00f3ff" wireframe />
          </mesh>
        </Float>
      )}
    </group>
  )
}

export default ArduinoEspDept
