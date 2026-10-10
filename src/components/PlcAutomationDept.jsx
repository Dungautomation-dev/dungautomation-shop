import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function PlcAutomationDept({ onSelect }) {
  const runLedRef = useRef()

  // 1. Tạo texture sắc nét cho màn hình SCADA Weintek HMI 7-inch
  const hmiTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 320
    const ctx = cvs.getContext('2d')

    // Nền giao diện SCADA xanh đen công nghiệp
    ctx.fillStyle = '#0a192f'
    ctx.fillRect(0, 0, 512, 320)

    // Thanh tiêu đề SCADA
    ctx.fillStyle = '#0284c7'
    ctx.fillRect(0, 0, 512, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px "JetBrains Mono", monospace'
    ctx.fillText('DUNGAUTOMATION SCADA SYSTEM v3.4', 16, 26)

    // Đồng hồ áp suất tròn (Gauge dial)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(100, 140, 50, 0.7 * Math.PI, 2.3 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 15px sans-serif'
    ctx.fillText('PRESSURE', 60, 140)
    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 18px monospace'
    ctx.fillText('6.4 BAR', 64, 165)

    // Biểu đồ cột giám sát sản lượng (Production Bar Chart)
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(200, 70, 290, 140)
    const barValues = [65, 82, 45, 90, 78, 95]
    barValues.forEach((v, idx) => {
      ctx.fillStyle = idx === 5 ? '#22c55e' : '#38bdf8'
      const h = (v / 100) * 110
      ctx.fillRect(220 + idx * 45, 200 - h, 30, h)
    })

    // Thông số trạng thái thời gian thực
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 14px "JetBrains Mono", monospace'
    ctx.fillText('● SYSTEM STATUS: RUNNING (100% OK)', 20, 250)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('● MOTOR SPEED: 1450 RPM | VFD: 50.0 Hz', 20, 280)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('● PROFINET IO: CONNECTED TO S7-1200', 20, 305)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 2. Tạo texture chi tiết cho mặt CPU Siemens S7-1200
  const plcFaceTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 360
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(0, 0, 512, 360)

    // Khối logo Siemens
    ctx.fillStyle = '#0f766e'
    ctx.fillRect(20, 20, 160, 35)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('SIEMENS', 36, 46)

    // Tên model SIMATIC S7-1200
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 20px "JetBrains Mono", monospace'
    ctx.fillText('SIMATIC S7-1200', 200, 44)
    ctx.font = '14px sans-serif'
    ctx.fillText('CPU 1214C DC/DC/DC', 200, 68)

    // Dãy đèn LED I/O
    ctx.fillStyle = '#334155'
    ctx.fillRect(20, 100, 472, 40)
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = i < 8 ? '#22c55e' : '#1e293b'
      ctx.beginPath()
      ctx.arc(40 + i * 32, 120, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    // Nhãn DI/DO
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 11px monospace'
    ctx.fillText('DI a .0 .1 .2 .3 .4 .5 .6 .7    DO a .0 .1 .2 .3 .4 .5', 26, 110)

    // Cổng Ethernet PROFINET
    ctx.fillStyle = '#18181b'
    ctx.fillRect(40, 220, 80, 80)
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 3
    ctx.strokeRect(40, 220, 80, 80)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // Hiệu ứng nhấp nháy đèn RUN/STOP PLC thời gian thực
  useFrame(({ clock }) => {
    if (runLedRef.current) {
      const blink = Math.sin(clock.getElapsedTime() * 4) > 0
      runLedRef.current.material.color.set(blink ? '#22c55e' : '#14532d')
    }
  })

  return (
    <group
      position={[-6.2, 0, -2.8]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.('plc_automation')
      }}
      cursor="pointer"
    >
      {/* ================= TỦ RACK CÔNG NGHIỆP RITTAL (INDUSTRIAL CABINET) ================= */}
      {/* Vỏ tủ tôn dập sơn tĩnh điện xám ghi chống rỉ */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 4.6, 1.4]} />
        <meshStandardMaterial color="#242b35" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Lòng tủ khoét rỗng với thanh gắn thiết bị */}
      <mesh position={[0, 2.4, 0.1]} receiveShadow>
        <boxGeometry args={[4.1, 4.3, 1.25]} />
        <meshStandardMaterial color="#181e26" roughness={0.7} />
      </mesh>

      {/* Rãnh nhôm gá thiết bị DIN-Rail công nghiệp mạ kẽm */}
      {[-0.65, 0.85].map((dy, idx) => (
        <mesh key={idx} position={[0, 2.4 + dy, 0.72]} castShadow>
          <boxGeometry args={[3.9, 0.14, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* ================= 1. MODULE PLC SIEMENS S7-1200 CHI TIẾT ================= */}
      <group position={[-0.9, 3.25, 0.58]}>
        {/* Thân chính CPU Siemens */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.85, 1.25, 0.75]} />
          <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Mặt trước in nhãn sắc nét */}
        <mesh position={[0, 0, 0.38]}>
          <planeGeometry args={[1.8, 1.2]} />
          <meshStandardMaterial map={plcFaceTexture} roughness={0.4} />
        </mesh>

        {/* Nắp lật màu cam đặc trưng của Siemens S7-1200 ở mép trên & dưới */}
        <mesh position={[0, 0.58, 0.1]} castShadow>
          <boxGeometry args={[1.82, 0.15, 0.72]} />
          <meshStandardMaterial color="#ea580c" roughness={0.35} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.58, 0.1]} castShadow>
          <boxGeometry args={[1.82, 0.15, 0.72]} />
          <meshStandardMaterial color="#ea580c" roughness={0.35} metalness={0.1} />
        </mesh>

        {/* Đèn LED RUN/STOP xanh nhấp nháy thực tế */}
        <mesh ref={runLedRef} position={[-0.55, 0.35, 0.39]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* ================= 2. MÀN HÌNH HMI CẢM ỨNG WEINTEK 7-INCH ================= */}
      <group position={[1.05, 3.25, 0.72]}>
        {/* Bezel viền nhôm phay xước cao cấp */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.8} />
        </mesh>

        {/* Màn hình hiển thị giao diện SCADA sống động */}
        <mesh position={[0, 0, 0.055]}>
          <planeGeometry args={[1.65, 1.05]} />
          <meshStandardMaterial
            map={hmiTexture}
            emissive="#0284c7"
            emissiveIntensity={0.6}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* ================= 3. CÁC BIẾN TẦN VFD ĐIỀU KHIỂN ĐỘNG CƠ ================= */}
      {[-1.2, 0, 1.2].map((vx, vIdx) => (
        <group key={vIdx} position={[vx, 1.75, 0.56]}>
          {/* Vỏ biến tần kim loại đen với rãnh tản nhiệt */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.85, 1.05, 0.65]} />
            <meshStandardMaterial color="#1e2430" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Màn hình 7 thanh hiển thị tần số 50.00 Hz */}
          <mesh position={[0, 0.32, 0.33]}>
            <planeGeometry args={[0.45, 0.18]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {/* Núm xoay chiết áp điều chỉnh tần số */}
          <mesh position={[0, 0.05, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Đèn rọi LED ấm chiếu sáng góc tủ PLC */}
      <pointLight position={[0, 4.4, 1.2]} color="#e0f2fe" intensity={1.5} distance={5} />
    </group>
  )
}

export default PlcAutomationDept
