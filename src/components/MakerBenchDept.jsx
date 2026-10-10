import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function MakerBenchDept({ onSelect }) {
  // Tạo canvas vẽ sóng dao động kỹ thuật số cho máy hiện sóng Rigol (Oscilloscope)
  const { oscCtx, oscTexture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 256
    cvs.height = 160
    const ctx = cvs.getContext('2d')
    const tex = new THREE.CanvasTexture(cvs)
    return { oscCtx: ctx, oscTexture: tex }
  }, [])

  const phaseRef = useRef(0)

  // Cập nhật sóng dao động thời gian thực (Live animated waveform)
  useFrame((_, delta) => {
    if (!oscCtx) return
    phaseRef.current += delta * 6

    // Nền màn hình oscilloscope đen xanh kỹ thuật số
    oscCtx.fillStyle = '#051923'
    oscCtx.fillRect(0, 0, 256, 160)

    // Lưới chia ô đo lường chuẩn oscilloscope
    oscCtx.strokeStyle = '#003554'
    oscCtx.lineWidth = 1
    for (let x = 0; x < 256; x += 32) {
      oscCtx.beginPath(); oscCtx.moveTo(x, 0); oscCtx.lineTo(x, 160); oscCtx.stroke()
    }
    for (let y = 0; y < 160; y += 32) {
      oscCtx.beginPath(); oscCtx.moveTo(0, y); oscCtx.lineTo(256, y); oscCtx.stroke()
    }

    // Vẽ sóng xung PWM / Sin màu xanh lục neon phát sáng rực rỡ
    oscCtx.strokeStyle = '#00f3ff'
    oscCtx.lineWidth = 2.5
    oscCtx.shadowColor = '#00f3ff'
    oscCtx.shadowBlur = 8
    oscCtx.beginPath()
    for (let px = 0; px < 256; px++) {
      const py = 80 + Math.sin(px * 0.08 + phaseRef.current) * 32 + Math.sin(px * 0.03 - phaseRef.current * 1.5) * 12
      if (px === 0) oscCtx.moveTo(px, py)
      else oscCtx.lineTo(px, py)
    }
    oscCtx.stroke()

    // Đo đạc số liệu
    oscCtx.shadowBlur = 0
    oscCtx.fillStyle = '#facc15'
    oscCtx.font = 'bold 11px monospace'
    oscCtx.fillText('CH1: 3.30Vpp  FREQ: 24.00MHz', 8, 16)

    oscTexture.needsUpdate = true
  })

  return (
    <group
      position={[-1.2, 0, -6.2]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.('maker_lab')
      }}
      cursor="pointer"
    >
      {/* ================= BÀN KỸ THUẬT GỖ TỰ NHIÊN (MAKER WORKBENCH) ================= */}
      {/* Chân bàn thép sơn tĩnh điện màu đen */}
      {[-1.8, 1.8].map((lx, ix) =>
        [-0.7, 0.7].map((lz, iz) => (
          <mesh key={`${ix}-${iz}`} position={[lx, 0.7, lz]} castShadow>
            <boxGeometry args={[0.12, 1.4, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Mặt bàn gỗ óc chó dày vát cạnh tự nhiên */}
      <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.1, 1.8]} />
        <meshStandardMaterial color="#3e2723" roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Thảm cao su xanh chống tĩnh điện ESD Mat */}
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <boxGeometry args={[3.8, 0.02, 1.5]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>

      {/* ================= 1. MÁY HIỆN SÓNG SỐ RIGOL DS1054Z ================= */}
      <group position={[-1.1, 1.78, -0.2]}>
        {/* Thân máy màu xám nhạt */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.65, 0.45]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
        </mesh>

        {/* Quai xách máy đo màu xanh */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.8, 0.08, 0.06]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>

        {/* Màn hình hiển thị sóng chuyển động thời gian thực */}
        <mesh position={[-0.2, 0.02, 0.23]}>
          <planeGeometry args={[0.65, 0.45]} />
          <meshStandardMaterial
            map={oscTexture}
            emissive="#00f3ff"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Cụm núm vặn điều chỉnh bên phải màn hình */}
        <mesh position={[0.35, 0.1, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0.35, -0.1, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>

      {/* ================= 2. TRẠM HÀN CHỈNH NHIỆT QUICK 936A ================= */}
      <group position={[0.3, 1.65, -0.25]}>
        {/* Thân trạm hàn đen kim loại */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.4, 0.5]} />
          <meshStandardMaterial color="#18181b" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Đèn báo nhiệt độ đỏ */}
        <mesh position={[-0.15, 0.08, 0.26]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Núm xoay nhiệt độ */}
        <mesh position={[0.08, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>

        {/* Tay hàn gác trên khay sắt */}
        <group position={[0.5, 0.05, 0]} rotation={[0, 0, 0.35]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.45, 12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          {/* Mũi hàn kim loại sáng bóng */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <coneGeometry args={[0.015, 0.12, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ================= 3. BREADBOARD VÀ DÂY CẮM JUMPER RAINBOW ================= */}
      <group position={[1.2, 1.54, 0.2]}>
        {/* Bo testboard trắng */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.05, 0.55]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* Hàng lỗ cắm */}
        <mesh position={[0, 0.026, 0]}>
          <planeGeometry args={[0.82, 0.48]} />
          <meshStandardMaterial color="#94a3b8" wireframe />
        </mesh>

        {/* Dây cầu jumper 7 màu uốn cong tự nhiên */}
        {[-0.25, -0.05, 0.15].map((wx, wIdx) => {
          const colors = ['#ef4444', '#10b981', '#3b82f6']
          return (
            <mesh key={wIdx} position={[wx, 0.06, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.03, 0.05, 0.3]} />
              <meshBasicMaterial color={colors[wIdx]} />
            </mesh>
          )
        })}
      </group>

      {/* Đèn kính lúp chiếu sáng rực rỡ trên bàn */}
      <pointLight position={[0, 2.8, 0]} color="#ffffff" intensity={1.8} distance={5} decay={2} />
    </group>
  )
}

export default MakerBenchDept
