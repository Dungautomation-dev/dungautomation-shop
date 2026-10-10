import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html } from '@react-three/drei'
import * as THREE from 'three'

export function MakerBenchDept({ level, onSelect, isSelected }) {
  // Tạo canvas vẽ sóng dao động kỹ thuật số cho máy hiện sóng (Oscilloscope)
  const { oscCanvas, oscCtx, oscTexture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 256
    cvs.height = 160
    const ctx = cvs.getContext('2d')
    const tex = new THREE.CanvasTexture(cvs)
    return { oscCanvas: cvs, oscCtx: ctx, oscTexture: tex }
  }, [])

  const phaseRef = useRef(0)

  // Cập nhật sóng dao động thời gian thực (Live animated waveform)
  useFrame((_, delta) => {
    if (!oscCtx) return
    phaseRef.current += delta * 5

    // Nền màn hình oscilloscope xanh thẫm
    oscCtx.fillStyle = '#064e3b'
    oscCtx.fillRect(0, 0, 256, 160)

    // Lưới chia ô đo lường
    oscCtx.strokeStyle = '#047857'
    oscCtx.lineWidth = 1
    for (let x = 0; x < 256; x += 32) {
      oscCtx.beginPath(); oscCtx.moveTo(x, 0); oscCtx.lineTo(x, 160); oscCtx.stroke()
    }
    for (let y = 0; y < 160; y += 32) {
      oscCtx.beginPath(); oscCtx.moveTo(0, y); oscCtx.lineTo(256, y); oscCtx.stroke()
    }

    // Vẽ sóng xung PWM / Sin màu xanh lục phát sáng rực rỡ
    oscCtx.strokeStyle = '#34d399'
    oscCtx.lineWidth = 3
    oscCtx.beginPath()
    for (let px = 0; px < 256; px++) {
      const py = 80 + Math.sin(px * 0.08 + phaseRef.current) * 35 + Math.sin(px * 0.03 - phaseRef.current * 2) * 14
      if (px === 0) oscCtx.moveTo(px, py)
      else oscCtx.lineTo(px, py)
    }
    oscCtx.stroke()

    oscTexture.needsUpdate = true
  })

  return (
    <group
      position={[0, 0, -6.5]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect('maker_bench')
      }}
    >
      {/* 3D Floating Tag Label */}
      <Html position={[0, 4.2, 0]} center distanceFactor={22}>
        <div className={`html-3d-tag ${isSelected ? 'selected' : ''}`}>
          🔬 TRẠM HÀN & ĐO KIỂM R&D (CẤP {level})
        </div>
      </Html>

      {/* 1. Bàn kỹ thuật gỗ sồi chịu lực cao (Heavy Maker Workbench) */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.6, 2.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* 2. Thảm làm việc chống tĩnh điện ESD màu xanh dương (ESD Anti-Static Mat) */}
      <mesh position={[0, 1.62, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.04, 1.9]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* ============================================================
          3. MÁY HIỆN SÓNG SỐ (RIGOL DIGITAL OSCILLOSCOPE)
          ============================================================ */}
      <group position={[-1.6, 2.1, -0.4]}>
        {/* Thùng máy hiện sóng */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.95, 0.7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Màn hình LCD hiển thị sóng chạy thời gian thực */}
        <mesh position={[0, 0, 0.36]}>
          <planeGeometry args={[0.95, 0.7]} />
          <meshBasicMaterial map={oscTexture} />
        </mesh>
        {/* Các núm vặn điều chỉnh Scale / Timebase */}
        {[0.6, 0.6].map((nx, nIdx) => (
          <mesh key={nIdx} position={[nx, -0.15 + nIdx * 0.3, 0.38]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* ============================================================
          4. TRẠM HÀN THIẾC QUICK 936A & CUỘN DÂY THIẾC
          ============================================================ */}
      <group position={[0.2, 1.9, -0.4]}>
        {/* Máy hàn */}
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.55, 0.65]} />
          <meshStandardMaterial color="#0f766e" roughness={0.5} />
        </mesh>
        {/* Núm chỉnh nhiệt độ 350°C màu vàng */}
        <mesh position={[0, 0, 0.34]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {/* Giá cắm tay hàn & cuộn thiếc hàn sáng bóng */}
        <mesh position={[0.6, -0.1, 0.1]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================
          5. BREADBOARD CẮM MẠCH VÀ BÓ DÂY JUMPER 5 MÀU
          ============================================================ */}
      <group position={[1.4, 1.66, 0.2]}>
        {/* Solderless Breadboard trắng */}
        <mesh receiveShadow>
          <boxGeometry args={[1.3, 0.08, 0.55]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </mesh>
        {/* Chip IC vi mạch cắm giữa rãnh */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.5, 0.06, 0.18]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Dây cắm Jumper nhiều màu sắc uốn cong */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((wx, wIdx) => {
          const colors = ['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#a855f7']
          return (
            <mesh key={wIdx} position={[wx, 0.1, (wIdx % 2 === 0 ? 0.15 : -0.15)]}>
              <boxGeometry args={[0.04, 0.12, 0.18]} />
              <meshBasicMaterial color={colors[wIdx]} />
            </mesh>
          )
        })}
      </group>

      {/* Đèn kính lúp chiếu sáng rực rỡ trên bàn */}
      <pointLight position={[0, 2.6, 0]} color="#ffffff" intensity={0.9} distance={6} />
    </group>
  )
}

export default MakerBenchDept
