import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function PlcAutomationDept({ onSelect }) {
  const runLedRef = useRef()
  const atsLedRef = useRef()

  // 1. Texture SCADA HMI Weintek 7-inch
  const hmiTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 320
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#0a192f'
    ctx.fillRect(0, 0, 512, 320)

    ctx.fillStyle = '#0284c7'
    ctx.fillRect(0, 0, 512, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 17px "JetBrains Mono", monospace'
    ctx.fillText('DUNGAUTOMATION SCADA SYSTEM v3.4', 16, 26)

    // Đồng hồ áp suất tròn
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

    // Biểu đồ sản lượng
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(200, 70, 290, 140)
    const barValues = [65, 82, 45, 90, 78, 95]
    barValues.forEach((v, idx) => {
      ctx.fillStyle = idx === 5 ? '#22c55e' : '#38bdf8'
      const h = (v / 100) * 110
      ctx.fillRect(220 + idx * 45, 200 - h, 30, h)
    })

    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 13px "JetBrains Mono", monospace'
    ctx.fillText('● SYSTEM STATUS: RUNNING (100% OK)', 20, 250)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('● MOTOR SPEED: 1450 RPM | VFD: 50.0 Hz', 20, 275)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('● PROFINET IO: CONNECTED TO S7-1200', 20, 300)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 2. Texture mặt CPU Siemens S7-1200
  const plcFaceTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 360
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#64748b'
    ctx.fillRect(0, 0, 512, 360)

    ctx.fillStyle = '#0f766e'
    ctx.fillRect(20, 20, 160, 35)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText('SIEMENS', 36, 46)

    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 20px "JetBrains Mono", monospace'
    ctx.fillText('SIMATIC S7-1200', 200, 44)
    ctx.font = '14px sans-serif'
    ctx.fillText('CPU 1214C DC/DC/DC', 200, 68)

    ctx.fillStyle = '#334155'
    ctx.fillRect(20, 100, 472, 40)
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = i < 8 ? '#22c55e' : '#1e293b'
      ctx.beginPath()
      ctx.arc(40 + i * 32, 120, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 11px monospace'
    ctx.fillText('DI a .0 .1 .2 .3 .4 .5 .6 .7    DO a .0 .1 .2 .3 .4 .5', 26, 110)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 3. Texture Đồng Hồ Đa Năng Tủ MSB (Multifunction Power Meter Selec/Schneider)
  const powerMeterTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 256
    cvs.height = 256
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, 236, 236)

    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 24px monospace'
    ctx.fillText('U: 384.5 V', 25, 60)
    ctx.fillStyle = '#eab308'
    ctx.fillText('I: 1250 A', 25, 110)
    ctx.fillStyle = '#22c55e'
    ctx.fillText('P: 780 kW', 25, 160)
    ctx.fillStyle = '#00f3ff'
    ctx.font = 'bold 20px monospace'
    ctx.fillText('cos φ: 0.98', 25, 210)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 4. Texture Bộ Điều Khiển Tụ Bù Tự Động (PFR Controller Mikro 12 Cấp)
  const pfrTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 256
    cvs.height = 256
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#1e1b4b'
    ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = '#a855f7'
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, 236, 236)

    ctx.fillStyle = '#f43f5e'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText('MIKRO PFR 12-STEP', 25, 45)

    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 36px monospace'
    ctx.fillText('0.98', 65, 115)
    ctx.font = '14px sans-serif'
    ctx.fillText('TARGET: 0.95 (CAPACITIVE)', 25, 150)

    // Dãy LED 12 cấp bù
    for (let c = 0; c < 12; c++) {
      ctx.fillStyle = c < 8 ? '#22c55e' : '#475569'
      ctx.fillRect(25 + (c % 6) * 36, 175 + Math.floor(c / 6) * 30, 24, 18)
    }

    return new THREE.CanvasTexture(cvs)
  }, [])

  // Nhấp nháy LED
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (runLedRef.current) {
      runLedRef.current.material.color.set(Math.sin(t * 4) > 0 ? '#22c55e' : '#14532d')
    }
    if (atsLedRef.current) {
      atsLedRef.current.material.color.set(Math.sin(t * 2) > 0 ? '#22c55e' : '#15803d')
    }
  })

  return (
    <group position={[-6.2, 0, -2.6]}>
      {/* ============================================================
          TỦ 1: TỦ ĐIỆN PHÂN PHỐI TỔNG MSB (MAIN SWITCHBOARD)
          Có máy cắt không khí ACB 3P 2000A, thanh cái đồng và đồng hồ đo
          ============================================================ */}
      <group
        position={[-2.4, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-msb',
            title: 'Tủ Điện Phân Phối Tổng MSB (Main Switchboard 2000A)',
            category: 'Hệ Thống Tủ Điện Công Nghiệp (VASCO)',
            price: 'Dự án: 185.000.000 đ',
            specs: [
              'Máy cắt không khí ACB 3P 2000A Schneider MasterPact / Siemens 3WL',
              'Hệ thống thanh cái đồng (Copper Busbar) mạ thiếc uốn góc chuẩn IEC 61439 Form 3b',
              'Đồng hồ đo đa năng Selec / Schneider PM5350 truyền thông Modbus RTU / RS485',
              'Dàn đèn báo pha R-S-T 220V, chuyển mạch Vôn/Ampe và rơ le bảo vệ quá dòng'
            ],
            desc: 'Tủ điện MSB là trái tim phân phối nguồn điện hạ thế của toàn bộ nhà máy hoặc tòa nhà cao tầng. Thiết kế, bóc tách và cấu hình theo đúng tiêu chuẩn kỹ sư điện Lê Đức Dũng tại Công Ty TNHH VASCO.'
          })
        }}
        cursor="pointer"
      >
        {/* Vỏ tủ tôn sơn tĩnh điện RAL 7035 xám ghi công nghiệp */}
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 4.6, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.4, 0.05]} receiveShadow>
          <boxGeometry args={[1.85, 4.3, 1.25]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Cánh cửa tủ trên với Đồng hồ đo Selec & Đèn báo pha R-S-T */}
        <group position={[0, 3.8, 0.68]}>
          {/* Đồng hồ công suất Selec */}
          <mesh position={[-0.4, 0, 0]}>
            <planeGeometry args={[0.55, 0.55]} />
            <meshStandardMaterial map={powerMeterTexture} roughness={0.3} />
          </mesh>

          {/* 3 Đèn báo pha Đỏ - Vàng - Xanh (R-S-T) */}
          {[-0.1, 0.05, 0.2].map((lx, idx) => {
            const colors = ['#ef4444', '#eab308', '#22c55e']
            return (
              <mesh key={idx} position={[0.4, lx, 0]}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshStandardMaterial
                  color={colors[idx]}
                  emissive={colors[idx]}
                  emissiveIntensity={2.5}
                  toneMapped={false}
                />
              </mesh>
            )
          })}
        </group>

        {/* Khối Máy Cắt Không Khí ACB 3P 2000A (Air Circuit Breaker) */}
        <group position={[0, 2.3, 0.45]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 1.4, 0.8]} />
            <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Tay kéo cần gạt ACB thao tác nạp cót */}
          <mesh position={[0.3, 0.1, 0.44]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.08, 0.4, 0.1]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Màn hình Trip Unit điện tử */}
          <mesh position={[-0.2, 0.2, 0.41]}>
            <planeGeometry args={[0.5, 0.35]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>

        {/* Thanh cái đồng (Copper Busbar) mạ thiếc uốn góc phía sau qua vách kính */}
        {[-0.4, -0.15, 0.1, 0.35].map((bx, i) => (
          <mesh key={i} position={[bx, 1.1, 0.3]} castShadow>
            <boxGeometry args={[0.08, 1.2, 0.04]} />
            <meshStandardMaterial color="#b45309" metalness={0.95} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* ============================================================
          TỦ 2: TỦ CHUYỂN NGUỒN TỰ ĐỘNG ATS (AUTOMATIC TRANSFER SWITCH)
          Chuyển đổi nguồn Lưới - Máy phát điện dự phòng 800A
          ============================================================ */}
      <group
        position={[-0.3, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-ats',
            title: 'Tủ Chuyển Nguồn Tự Động ATS (Auto Transfer Switch 800A)',
            category: 'Hệ Thống Tủ Điện Công Nghiệp (VASCO)',
            price: 'Dự án: 95.000.000 đ',
            specs: [
              'Khối chuyển nguồn tự động ATS 4P 800A Socomec ATyS / Osung OMT',
              'Bộ điều khiển ATS Controller kỹ thuật số tự động đề nổ máy phát sau 5s mất lưới',
              'Khóa liên động kép cơ - điện tử Interlock chống xung đột 2 nguồn',
              'Bảo vệ mất pha, đảo pha, thấp áp, quá áp và timer trễ ổn định đóng tải'
            ],
            desc: 'Tủ ATS đảm bảo cấp điện liên tục 24/7 cho các nhà máy, dây chuyền sản xuất tự động và trạm server. Khi mất điện lưới, tủ tự động kích hoạt máy phát và chuyển nguồn mượt mà.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 4.6, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.4, 0.05]} receiveShadow>
          <boxGeometry args={[1.65, 4.3, 1.25]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Khối đóng cắt ATS 4P 800A */}
        <group position={[0, 2.5, 0.4]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.2, 0.65]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Cần chuyển nguồn Manual / Auto */}
          <mesh position={[0, 0, 0.35]}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.8} />
          </mesh>
          {/* Đèn báo trạng thái nguồn Lưới (Mains) và Máy Phát (Gen) */}
          <mesh ref={atsLedRef} position={[-0.35, 0.35, 0.34]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0.35, 0.35, 0.34]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Bộ điều khiển ATS Controller trên cánh tủ */}
        <mesh position={[0, 3.8, 0.68]}>
          <boxGeometry args={[0.7, 0.45, 0.04]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================
          TỦ 3: TỦ BÙ CÔNG SUẤT PHẢN KHÁNG (CAPACITOR BANK PANEL)
          Nâng cao hệ số Cos phi >= 0.95, tiết kiệm tiền phạt phản kháng
          ============================================================ */}
      <group
        position={[1.7, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-capbank',
            title: 'Tủ Tụ Bù Công Suất Phản Kháng Tự Động (Capacitor Bank 300 kVAR)',
            category: 'Hệ Thống Tủ Điện Công Nghiệp (VASCO)',
            price: 'Dự án: 75.000.000 đ',
            specs: [
              'Bộ điều khiển tụ bù tự động 12 cấp Mikro PFR96 hiển thị hệ số cos φ kỹ thuật số',
              'Dàn tụ bù hạ thế 3 pha Mikro / Epcos / Samwha 50 kVAR x 6 cấp bù linh hoạt',
              'Cuộn kháng lọc sóng hài (Detuned Reactor) 7% bảo vệ tụ và triệt tiêu sóng hài bậc 5, 7',
              'Contactor chuyên dụng đóng cắt tụ bù có điện trở phóng điện hạn chế dòng xung nạp'
            ],
            desc: 'Tủ tụ bù tự động đo lường hệ số công suất của nhà máy và tự động đóng/ngắt các cấp tụ để duy trì cos φ ≥ 0.95, triệt tiêu hoàn toàn tiền phạt công suất phản kháng của Điện lực EVN.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 4.6, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.4, 0.05]} receiveShadow>
          <boxGeometry args={[1.65, 4.3, 1.25]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Mặt đồng hồ Mikro PFR 12 cấp */}
        <mesh position={[0, 3.8, 0.68]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshStandardMaterial map={pfrTexture} roughness={0.3} />
        </mesh>

        {/* Dàn bình tụ bù tròn mạ thiếc (Cylindrical Capacitors) */}
        {[-0.5, 0, 0.5].map((cx, i) =>
          [1.4, 2.2].map((cy, j) => (
            <group key={`${i}-${j}`} position={[cx, cy, 0.35]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.18, 0.18, 0.55, 18]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
                <meshStandardMaterial color="#b45309" metalness={0.95} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* ============================================================
          TỦ 4: TỦ PLC SIEMENS S7-1200 & HMI SCADA WEINTEK 7-INCH
          Điều khiển tự động hóa dây chuyền, kết nối PROFINET
          ============================================================ */}
      <group
        position={[3.7, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-plc',
            title: 'Tủ Điều Khiển Tự Động Hóa PLC Siemens S7-1200 & HMI SCADA',
            category: 'Hệ Thống Tủ Điện Công Nghiệp (VASCO)',
            price: 'Dự án: 68.500.000 đ',
            specs: [
              'CPU Siemens S7-1200 1214C DC/DC/DC + Module Analog mở rộng SM1231',
              'Màn hình cảm ứng Weintek 7-inch chạy giao diện SCADA giám sát thời gian thực',
              'Biến tần VFD điều khiển tốc độ động cơ 3 pha và bộ nguồn Meanwell 24VDC',
              'Hệ thống rơ le kiếng trung gian IDEC và cầu đấu domino Phoenix Contact'
            ],
            desc: 'Tủ điện điều khiển tự động hóa trung tâm thu thập tín hiệu cảm biến, điều khiển động cơ servo, biến tần và truyền thông dữ liệu lên hệ thống SCADA/MES nhà máy thông minh.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 4.6, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.4, 0.05]} receiveShadow>
          <boxGeometry args={[1.65, 4.3, 1.25]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Thanh DIN-rail nhôm */}
        <mesh position={[0, 3.2, 0.6]} castShadow>
          <boxGeometry args={[1.5, 0.12, 0.04]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Module CPU Siemens S7-1200 */}
        <group position={[-0.3, 3.2, 0.58]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.8, 0.5]} />
            <meshStandardMaterial color="#64748b" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.26]}>
            <planeGeometry args={[0.88, 0.78]} />
            <meshStandardMaterial map={plcFaceTexture} roughness={0.4} />
          </mesh>
          <mesh ref={runLedRef} position={[-0.25, 0.22, 0.27]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Màn hình cảm ứng Weintek HMI 7-inch */}
        <group position={[0, 4.0, 0.68]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.8, 0.08]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.1, 0.7]} />
            <meshStandardMaterial
              map={hmiTexture}
              emissive="#0284c7"
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Biến tần VFD & Bộ nguồn 24VDC tầng dưới */}
        <group position={[0, 1.6, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.9, 0.5]} />
            <meshStandardMaterial color="#1e2430" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.25, 0.26]}>
            <planeGeometry args={[0.35, 0.15]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* Đèn downlight rọi sáng dàn tủ điện công nghiệp */}
      <pointLight position={[0.5, 4.5, 1.2]} color="#e0f2fe" intensity={1.8} distance={8} decay={2} />
    </group>
  )
}

export default PlcAutomationDept
