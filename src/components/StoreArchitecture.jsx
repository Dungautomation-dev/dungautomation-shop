import React, { useMemo } from 'react'
import * as THREE from 'three'

export function StoreArchitecture({ isNight }) {
  // Tạo texture chữ Neon sắc nét bằng HTML5 Canvas
  const mainNeonTex = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 1024
    cvs.height = 160
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, 1024, 160)
    ctx.font = 'bold 64px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#00f3ff'
    ctx.shadowBlur = 28
    ctx.fillStyle = '#00f3ff'
    ctx.fillText('⚡ DUNGAUTOMATION ⚡', 512, 80)
    ctx.shadowBlur = 10
    ctx.fillText('⚡ DUNGAUTOMATION ⚡', 512, 80)
    return new THREE.CanvasTexture(cvs)
  }, [])

  const subNeonTex = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 1024
    cvs.height = 120
    const ctx = cvs.getContext('2d')
    ctx.clearRect(0, 0, 1024, 120)
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#f59e0b'
    ctx.shadowBlur = 24
    ctx.fillStyle = '#fef08a'
    ctx.fillText('PLC • ARDUINO • ROBOTICS • IOT LAB', 512, 60)
    return new THREE.CanvasTexture(cvs)
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Tường sau (Back Wall) */}
      <mesh position={[-1.5, 4.0, -9.0]} receiveShadow castShadow>
        <boxGeometry args={[16, 8, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 2. Tường bên trái (Left Wall) */}
      <mesh position={[-9.0, 4.0, -1.5]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 8, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 3. Lam gỗ ốp tường cao cấp (Slatted Wood Acoustic Panels) */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} position={[-8.8, 4.0, -8.5 + i * 0.8]} castShadow>
          <boxGeometry args={[0.15, 7.6, 0.4]} />
          <meshStandardMaterial color="#b45309" roughness={0.55} />
        </mesh>
      ))}

      {/* 4. Cột thép kết cấu màu đen & Mái che Pergola (Black Aluminum Beams) */}
      {[-8.8, 6.2].map((rx, idx) => (
        <mesh key={idx} position={[rx, 3.9, 6.2]} castShadow>
          <boxGeometry args={[0.5, 7.8, 0.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Mái trần Pergola */}
      <mesh position={[-1.5, 8.0, -1.5]} castShadow>
        <boxGeometry args={[16, 0.6, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 5. Cửa kính trong suốt phía trước (Glass Storefront) */}
      <mesh position={[-1.5, 3.8, 6.2]}>
        <boxGeometry args={[15, 7.4, 0.12]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.05}
          transmission={0.85}
          ior={1.5}
        />
      </mesh>

      {/* 6. BẢNG HIỆU NEON LỚN TRÊN MÁI (NEON STOREFRONT SIGN) */}
      <group position={[-1.5, 9.0, 6.2]}>
        {/* Hộp biển nhôm xước đen */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[11, 1.8, 0.4]} />
          <meshStandardMaterial color="#0b0f19" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Biển Neon chính "DUNGAUTOMATION" */}
        <mesh position={[0, 0.2, 0.22]}>
          <planeGeometry args={[10.5, 1.4]} />
          <meshStandardMaterial
            map={mainNeonTex}
            transparent
            emissive="#06b6d4"
            emissiveIntensity={isNight ? 2.5 : 1.6}
            roughness={0.2}
          />
        </mesh>

        {/* Biển Neon phụ "PLC • ARDUINO • ROBOTICS • IOT LAB" */}
        <mesh position={[0, -0.65, 0.22]}>
          <planeGeometry args={[8.5, 0.7]} />
          <meshStandardMaterial
            map={subNeonTex}
            transparent
            emissive="#f59e0b"
            emissiveIntensity={isNight ? 2.2 : 1.4}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 7. HỆ THỐNG ĐÈN ÂM TRẦN LED WARM 3000K */}
      {[-5, 0, 5].map((lx, ix) =>
        [-5, 0].map((lz, iz) => (
          <group key={`${ix}-${iz}`} position={[lx, 7.6, lz]}>
            <mesh>
              <sphereGeometry args={[0.18, 12, 12]} />
              <meshBasicMaterial color="#fffbeb" />
            </mesh>
            <pointLight
              color="#ffedd5"
              intensity={isNight ? 1.5 : 0.8}
              distance={12}
              decay={2}
            />
          </group>
        ))
      )}
    </group>
  )
}

export default StoreArchitecture
