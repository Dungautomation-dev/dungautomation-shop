import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Trạm SCADA Giám Sát Xử Lý Nước Thải & Lập Trình PLC Siemens S7-1200
 * Hiển thị quy trình xử lý nước thải: Bể điều hòa, Anoxic, Aerotank sục khí, Bể lắng, Bơm hồi lưu & Quan trắc đầu ra QCVN.
 */
export function ScadaStationDept({ onSelect }) {
  const phaseRef = useRef(0)
  const aerationBubblesRef = useRef([])

  // Khởi tạo các bong bóng sục khí Aerotank cho canvas SCADA
  useMemo(() => {
    aerationBubblesRef.current = Array.from({ length: 24 }).map(() => ({
      x: 235 + Math.random() * 90,
      y: 190 + Math.random() * 45,
      r: 1.5 + Math.random() * 2.5,
      speed: 25 + Math.random() * 35
    }))
  }, [])

  // 1. Màn hình chính Ultra-wide SCADA Trạm Xử Lý Nước Thải (Canvas Texture Realtime)
  const { scadaCtx, scadaTexture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 640
    cvs.height = 360
    const ctx = cvs.getContext('2d')
    const tex = new THREE.CanvasTexture(cvs)
    return { scadaCtx: ctx, scadaTexture: tex }
  }, [])

  // 2. Màn hình phụ TIA Portal v18 Ladder Logic (Canvas Texture)
  const tiaPortalTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 320
    cvs.height = 420
    const ctx = cvs.getContext('2d')

    // Nền xám đen TIA Portal Siemens
    ctx.fillStyle = '#1e1e24'
    ctx.fillRect(0, 0, 320, 420)

    // Thanh menu trên
    ctx.fillStyle = '#0f766e'
    ctx.fillRect(0, 0, 320, 32)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 13px "Segoe UI", sans-serif'
    ctx.fillText('TIA Portal v18 - [OB1: Main Wastewater]', 10, 21)

    // Cây Project Tree nhỏ bên trái
    ctx.fillStyle = '#26262e'
    ctx.fillRect(0, 32, 90, 388)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px monospace'
    ctx.fillText('▼ PLC_1 [1214C]', 6, 50)
    ctx.fillText('  ► Program blocks', 6, 68)
    ctx.fillText('    ■ OB1 [Main]', 10, 84)
    ctx.fillText('    ■ FB10 [Aeration]', 10, 100)
    ctx.fillText('    ■ DB1 [SCADA_Tag]', 10, 116)
    ctx.fillText('  ► PLC tags', 6, 134)
    ctx.fillText('  ► Watch tables', 6, 150)

    // Vùng soạn thảo Network Ladder Diagram
    ctx.fillStyle = '#18181b'
    ctx.fillRect(92, 34, 226, 384)

    // Network 1
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 11px sans-serif'
    ctx.fillText('Network 1: Aerotank Blower Run', 98, 52)

    // Đường ray nguồn dọc trái & phải
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(105, 60); ctx.lineTo(105, 120); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(310, 60); ctx.lineTo(310, 120); ctx.stroke()

    // Bậc thang tiếp điểm logic (Ladder Rung)
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(105, 90); ctx.lineTo(130, 90); ctx.stroke()

    // Tiếp điểm thường mở NO (Auto_Mode)
    ctx.strokeRect(130, 80, 4, 20)
    ctx.strokeRect(142, 80, 4, 20)
    ctx.fillStyle = '#22c55e'
    ctx.font = '9px monospace'
    ctx.fillText('"Auto_Mode"', 118, 74)

    ctx.beginPath(); ctx.moveTo(146, 90); ctx.lineTo(180, 90); ctx.stroke()

    // Tiếp điểm NO (DO_Low_Alarm)
    ctx.strokeRect(180, 80, 4, 20)
    ctx.strokeRect(192, 80, 4, 20)
    ctx.fillText('"DO_Low"', 172, 74)

    ctx.beginPath(); ctx.moveTo(196, 90); ctx.lineTo(260, 90); ctx.stroke()

    // Cuộn hút Output Coil (Blower_1_Start)
    ctx.beginPath()
    ctx.arc(275, 90, 10, -0.7 * Math.PI, 0.7 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(285, 90, 10, 0.3 * Math.PI, 1.7 * Math.PI)
    ctx.stroke()
    ctx.fillText('"BL_Start"', 258, 74)

    ctx.beginPath(); ctx.moveTo(285, 90); ctx.lineTo(310, 90); ctx.stroke()

    // Network 2: Analog Scaling (DO Sensor)
    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 11px sans-serif'
    ctx.fillText('Network 2: NORM_X & SCALE_X (4-20mA)', 98, 145)

    ctx.fillStyle = '#27272a'
    ctx.fillRect(110, 160, 190, 80)
    ctx.strokeStyle = '#3b82f6'
    ctx.strokeRect(110, 160, 190, 80)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px monospace'
    ctx.fillText('CALCULATE_DO_PPM', 125, 178)
    ctx.fillStyle = '#38bdf8'
    ctx.font = '9px monospace'
    ctx.fillText('IN1 : IW64 (Analog In)', 118, 198)
    ctx.fillText('MIN : 0.0 mg/L', 118, 214)
    ctx.fillText('MAX : 10.0 mg/L', 118, 230)

    // Trạng thái online
    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 11px monospace'
    ctx.fillText('● ONLINE MONITORING: 100% OK', 100, 395)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // Animation cập nhật SCADA thời gian thực
  useFrame((_, delta) => {
    if (!scadaCtx) return
    phaseRef.current += delta

    const t = phaseRef.current

    // Nền tối chuẩn SCADA công nghiệp
    scadaCtx.fillStyle = '#0a101d'
    scadaCtx.fillRect(0, 0, 640, 360)

    // Thanh Header SCADA
    scadaCtx.fillStyle = '#0284c7'
    scadaCtx.fillRect(0, 0, 640, 38)
    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = 'bold 14px "JetBrains Mono", sans-serif'
    scadaCtx.fillText('DUNGAUTOMATION SCADA - TRẠM XỬ LÝ NƯỚC THẢI TỰ ĐỘNG 500 M³/NGÀY.ĐÊM', 14, 24)

    scadaCtx.fillStyle = '#22c55e'
    scadaCtx.font = 'bold 12px monospace'
    scadaCtx.fillText('● AUTO RUN', 545, 24)

    // ================= SƠ ĐỒ CÔNG NGHỆ CÁC BỂ (P&ID) =================
    // 1. Bể Điều Hòa (Equalization Tank)
    const eqLevel = 65 + Math.sin(t * 1.2) * 5
    scadaCtx.fillStyle = '#1e293b'
    scadaCtx.fillRect(25, 75, 100, 150)
    scadaCtx.strokeStyle = '#38bdf8'
    scadaCtx.lineWidth = 2
    scadaCtx.strokeRect(25, 75, 100, 150)

    // Mực nước thải bể điều hòa (màu xám đục)
    const eqHeight = (eqLevel / 100) * 130
    scadaCtx.fillStyle = 'rgba(71, 85, 105, 0.85)'
    scadaCtx.fillRect(27, 223 - eqHeight, 96, eqHeight)

    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = 'bold 11px sans-serif'
    scadaCtx.fillText('BỂ ĐIỀU HÒA', 33, 95)
    scadaCtx.fillStyle = '#facc15'
    scadaCtx.font = 'bold 12px monospace'
    scadaCtx.fillText(`Mức: ${eqLevel.toFixed(1)}%`, 38, 115)

    // Bơm chìm nước thải P-101 (chuyển động xanh lá)
    scadaCtx.fillStyle = '#22c55e'
    scadaCtx.beginPath()
    scadaCtx.arc(75, 200, 12, 0, Math.PI * 2)
    scadaCtx.fill()
    scadaCtx.fillStyle = '#000000'
    scadaCtx.font = 'bold 9px sans-serif'
    scadaCtx.fillText('P101', 65, 203)

    // 2. Bể Thiếu Khí (Anoxic Tank)
    scadaCtx.fillStyle = '#1e293b'
    scadaCtx.fillRect(145, 75, 75, 150)
    scadaCtx.strokeRect(145, 75, 75, 150)

    scadaCtx.fillStyle = 'rgba(51, 65, 85, 0.9)'
    scadaCtx.fillRect(147, 105, 71, 118)

    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = 'bold 10px sans-serif'
    scadaCtx.fillText('BỂ ANOXIC', 150, 95)

    // Cánh khuấy chìm MX-101 xoay tròn
    const mixerAngle = t * 4
    scadaCtx.save()
    scadaCtx.translate(182, 170)
    scadaCtx.rotate(mixerAngle)
    scadaCtx.strokeStyle = '#38bdf8'
    scadaCtx.lineWidth = 3
    scadaCtx.beginPath()
    scadaCtx.moveTo(-10, 0); scadaCtx.lineTo(10, 0)
    scadaCtx.moveTo(0, -10); scadaCtx.lineTo(0, 10)
    scadaCtx.stroke()
    scadaCtx.restore()
    scadaCtx.fillStyle = '#94a3b8'
    scadaCtx.font = '8px sans-serif'
    scadaCtx.fillText('MX101', 170, 195)

    // 3. Bể Hiếu Khí Aerotank (Sục khí bọt O2 sinh học)
    scadaCtx.fillStyle = '#1e293b'
    scadaCtx.fillRect(235, 75, 115, 150)
    scadaCtx.strokeRect(235, 75, 115, 150)

    // Nước bùn vi sinh Aerotank
    scadaCtx.fillStyle = 'rgba(120, 53, 15, 0.85)'
    scadaCtx.fillRect(237, 100, 111, 123)

    // Bọt khí sục oxy dâng lên
    aerationBubblesRef.current.forEach((b) => {
      b.y -= b.speed * delta
      if (b.y < 105) {
        b.y = 215 + Math.random() * 5
        b.x = 242 + Math.random() * 100
      }
      scadaCtx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      scadaCtx.beginPath()
      scadaCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
      scadaCtx.fill()
    })

    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = 'bold 11px sans-serif'
    scadaCtx.fillText('BỂ AEROTANK', 247, 95)
    scadaCtx.fillStyle = '#38bdf8'
    scadaCtx.font = 'bold 11px monospace'
    scadaCtx.fillText('DO: 2.85 mg/L', 246, 122)

    // Máy thổi khí Roots Blower dưới đáy
    scadaCtx.fillStyle = Math.sin(t * 8) > 0 ? '#22c55e' : '#16a34a'
    scadaCtx.fillRect(265, 240, 55, 22)
    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = 'bold 9px monospace'
    scadaCtx.fillText('BLOWER', 270, 255)

    // 4. Bể Lắng Sinh Học (Clarifier)
    scadaCtx.fillStyle = '#1e293b'
    scadaCtx.fillRect(365, 75, 100, 150)
    scadaCtx.strokeRect(365, 75, 100, 150)

    // Nước trong tách bùn
    scadaCtx.fillStyle = 'rgba(14, 165, 233, 0.7)'
    scadaCtx.fillRect(367, 100, 96, 75)
    scadaCtx.fillStyle = 'rgba(120, 53, 15, 0.95)'
    scadaCtx.fillRect(367, 175, 96, 48)

    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = 'bold 11px sans-serif'
    scadaCtx.fillText('BỂ LẮNG SINH HỌC', 368, 95)

    // Bơm tuần hoàn bùn RAS về Anoxic
    scadaCtx.fillStyle = '#22c55e'
    scadaCtx.beginPath()
    scadaCtx.arc(415, 245, 10, 0, Math.PI * 2)
    scadaCtx.fill()
    scadaCtx.fillStyle = '#ffffff'
    scadaCtx.font = '8px sans-serif'
    scadaCtx.fillText('RAS', 407, 248)

    // 5. Đường ống nước (Piping) với mũi tên dòng chảy
    scadaCtx.strokeStyle = '#0284c7'
    scadaCtx.lineWidth = 3
    scadaCtx.beginPath()
    scadaCtx.moveTo(125, 140); scadaCtx.lineTo(145, 140) // EQ -> Anoxic
    scadaCtx.moveTo(220, 140); scadaCtx.lineTo(235, 140) // Anoxic -> Aero
    scadaCtx.moveTo(350, 140); scadaCtx.lineTo(365, 140) // Aero -> Lắng
    scadaCtx.moveTo(465, 120); scadaCtx.lineTo(485, 120) // Lắng -> Khử trùng
    scadaCtx.stroke()

    // Đường ống tuần hoàn bùn RAS quay lại Anoxic
    scadaCtx.strokeStyle = '#d97706'
    scadaCtx.setLineDash([4, 4])
    scadaCtx.beginPath()
    scadaCtx.moveTo(415, 255); scadaCtx.lineTo(415, 275); scadaCtx.lineTo(180, 275); scadaCtx.lineTo(180, 225)
    scadaCtx.stroke()
    scadaCtx.setLineDash([])

    // ================= BẢNG QUAN TRẮC THÔNG SỐ ĐẦU RA QCVN 40:2011 =================
    scadaCtx.fillStyle = '#0f172a'
    scadaCtx.fillRect(485, 55, 145, 235)
    scadaCtx.strokeStyle = '#22c55e'
    scadaCtx.lineWidth = 2
    scadaCtx.strokeRect(485, 55, 145, 235)

    scadaCtx.fillStyle = '#22c55e'
    scadaCtx.font = 'bold 11px sans-serif'
    scadaCtx.fillText('QUAN TRẮC ĐẦU RA', 495, 75)
    scadaCtx.fillStyle = '#94a3b8'
    scadaCtx.font = '9px sans-serif'
    scadaCtx.fillText('QCVN 40 CỘT A', 495, 90)

    const params = [
      { name: 'pH', val: (7.25 + Math.sin(t * 0.5) * 0.08).toFixed(2), unit: '', ok: true },
      { name: 'DO', val: '2.85', unit: 'mg/L', ok: true },
      { name: 'COD', val: '38.2', unit: 'mg/L', ok: true },
      { name: 'TSS', val: '15.4', unit: 'mg/L', ok: true },
      { name: 'Q Lưu lượng', val: (24.5 + Math.sin(t) * 1.2).toFixed(1), unit: 'm³/h', ok: true }
    ]

    params.forEach((p, idx) => {
      scadaCtx.fillStyle = '#e2e8f0'
      scadaCtx.font = 'bold 10px monospace'
      scadaCtx.fillText(`${p.name}:`, 495, 120 + idx * 30)

      scadaCtx.fillStyle = '#38bdf8'
      scadaCtx.font = 'bold 12px monospace'
      scadaCtx.fillText(`${p.val} ${p.unit}`, 495, 135 + idx * 30)
    })

    // Footer Bar
    scadaCtx.fillStyle = '#0f172a'
    scadaCtx.fillRect(0, 325, 640, 35)
    scadaCtx.fillStyle = '#38bdf8'
    scadaCtx.font = 'bold 11px monospace'
    scadaCtx.fillText('TRUYỀN THÔNG PROFINET S7-1200 CPU 1214C | WEINTEK HMI | IGNITION SCADA | CLOUD IoT', 14, 347)

    scadaTexture.needsUpdate = true
  })

  return (
    <group
      position={[-4.2, 0, -6.0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.({
          id: 'scada_wastewater',
          title: 'Hệ Thống SCADA & PLC Giám Sát Trạm Xử Lý Nước Thải 500m³/ngày.đêm',
          category: 'SCADA & Industrial Environmental Automation',
          price: 'Dự án trọn gói: Lập trình PLC S7-1200, Thiết kế SCADA WinCC / Web',
          specs: [
            'Giám sát quy trình P&ID: Bể Điều Hòa, Anoxic, Aerotank sục khí, Lắng sinh học & Khử trùng',
            'Tự động hóa bơm chìm, cánh khuấy, máy thổi khí Roots Blower điều khiển qua biến tần VFD',
            'Đo lường & Quan trắc liên tục 24/7: pH, DO (Oxy hòa tan), COD, TSS và Lưu lượng xả thải',
            'Lập trình TIA Portal v18 S7-1200 kết hợp Web SCADA giám sát từ xa qua điện thoại'
          ],
          desc: 'Trạm điều hành kỹ sư SCADA tự động hóa trạm xử lý nước thải chuẩn công nghiệp, cho phép giám sát thông số môi trường thời gian thực, lưu trữ data log và cảnh báo sự cố tự động.'
        })
      }}
      cursor="pointer"
    >
      {/* ================= 1. BÀN LÀM VIỆC KỸ SƯ SCADA (ENGINEER DESK) ================= */}
      {/* Chân bàn kim loại sơn tĩnh điện */}
      {[-1.3, 1.3].map((dx, i) =>
        [-0.5, 0.5].map((dz, j) => (
          <mesh key={`${i}-${j}`} position={[dx, 0.7, dz]} castShadow>
            <boxGeometry args={[0.08, 1.4, 0.08]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}
      {/* Giằng chân bàn */}
      <mesh position={[0, 0.35, -0.5]}>
        <boxGeometry args={[2.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* Mặt bàn gỗ sồi dày dặn */}
      <mesh position={[0, 1.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.08, 1.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Thảm pad lót chuột công thái học màu tối */}
      <mesh position={[0, 1.485, 0.1]} receiveShadow>
        <boxGeometry args={[2.4, 0.01, 0.9]} />
        <meshStandardMaterial color="#090d16" roughness={0.9} />
      </mesh>

      {/* ================= 2. MÀN HÌNH CHÍNH ULTRA-WIDE SCADA XỬ LÝ NƯỚC THẢI ================= */}
      <group position={[0.2, 2.15, -0.2]}>
        {/* Khung viền màn hình Ultra-wide kim loại siêu mỏng */}
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.25, 0.08]} />
          <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chân đế màn hình kim loại */}
        <mesh position={[0, -0.65, 0.05]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.88, 0.1]} castShadow>
          <boxGeometry args={[0.5, 0.02, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Bề mặt màn hình hiển thị SCADA Nước Thải Realtime */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.14, 1.19]} />
          <meshStandardMaterial
            map={scadaTexture}
            emissive="#0284c7"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ================= 3. MÀN HÌNH PHỤ DỌC TIA PORTAL LADDER LOGIC ================= */}
      <group position={[-1.15, 2.1, -0.05]} rotation={[0, 0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.85, 1.35, 0.06]} />
          <meshStandardMaterial color="#09090b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chân đế màn dọc */}
        <mesh position={[0, -0.68, 0.05]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.9, 0.1]} castShadow>
          <boxGeometry args={[0.35, 0.02, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Bề mặt màn hình TIA Portal */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[0.81, 1.3]} />
          <meshStandardMaterial
            map={tiaPortalTexture}
            emissive="#0f766e"
            emissiveIntensity={0.5}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* ================= 4. THÙNG MÁY PC CASE GAMING/WORKSTATION RGB ================= */}
      <group position={[1.15, 1.9, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.75, 0.65]} />
          <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Mặt kính cường lực hông PC */}
        <mesh position={[-0.18, 0, 0]}>
          <boxGeometry args={[0.01, 0.7, 0.6]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.1} />
        </mesh>
        {/* Quạt tản nhiệt LED RGB phát sáng bên trong */}
        <pointLight position={[-0.1, 0.1, 0]} color="#00f3ff" intensity={1.5} distance={1.8} />
      </group>

      {/* ================= 5. BÀN PHÍM CƠ & CHUỘT QUANG ================= */}
      <group position={[0.2, 1.5, 0.2]}>
        {/* Bàn phím cơ Custom */}
        <mesh position={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.65, 0.025, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Đèn nền RGB bàn phím */}
        <mesh position={[-0.2, 0.015, 0]}>
          <planeGeometry args={[0.62, 0.2]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.8} />
        </mesh>
        {/* Chuột quang không dây */}
        <mesh position={[0.32, 0.015, 0]} castShadow>
          <boxGeometry args={[0.1, 0.03, 0.16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
      </group>

      {/* ================= 6. GHẾ CÔNG THÁI HỌC KỸ SƯ (ERGONOMIC CHAIR) ================= */}
      <group position={[0.2, 0, 0.85]} rotation={[0, Math.PI, 0]}>
        {/* Đế chân 5 chấu có bánh xe */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Trục piston khí nén */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.45, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Đệm ngồi bọc lưới êm ái */}
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[0.65, 0.12, 0.65]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Tựa lưng công thái học uốn cong */}
        <mesh position={[0, 1.15, -0.28]} castShadow>
          <boxGeometry args={[0.58, 0.85, 0.08]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Tựa đầu */}
        <mesh position={[0, 1.65, -0.25]} castShadow>
          <boxGeometry args={[0.32, 0.16, 0.08]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>

      {/* Đèn rọi bàn làm việc kỹ sư */}
      <pointLight position={[0.2, 3.2, 0]} color="#ffffff" intensity={1.8} distance={6} decay={2} />
    </group>
  )
}

export default ScadaStationDept
