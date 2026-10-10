import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Phân Khu Trưng Bày Hệ Thống Tủ Bảng Điện & Trạm Biến Áp DATECO
 * Bao gồm đầy đủ 8 dòng sản phẩm chính hãng Dateco:
 * 1. Trạm Kiosk ngoài trời
 * 2. Trạm Trụ máy biến áp 1 cột
 * 3. Tủ Ngăn Kéo MCC
 * 4. Tủ Điện Tàu Biển
 * 5. Tủ Trung Thế RMU 24kV-36kV
 * 6. Tủ Phân Phối Tổng MSB 2000A
 * 7. Tủ Điện Điều Khiển PLC Siemens S7-1200 + HMI SCADA
 * 8. Bàn Điều Khiển Desk Console
 */
export function PlcAutomationDept({ onSelect }) {
  const runLedRef = useRef()
  const atsLedRef = useRef()
  const marineAlarmLedRef = useRef()

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
    ctx.fillText('DATECO INDUSTRIAL SCADA v4.0', 16, 26)

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
    ctx.fillText('● HỆ THỐNG DATECO: RUNNING (100% OK)', 20, 250)
    ctx.fillStyle = '#f59e0b'
    ctx.fillText('● ĐỘNG CƠ BƠM 1-4: ONLINE | BIẾN TẦN: 50.0 Hz', 20, 275)
    ctx.fillStyle = '#94a3b8'
    ctx.fillText('● PROFINET IO: KẾT NỐI PLC SIEMENS S7-1200', 20, 300)

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

  // 3. Texture Mặt Tủ Ngăn Kéo MCC (Motor Control Center Withdrawable Drawers)
  const mccTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 512
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#334155'
    ctx.fillRect(0, 0, 512, 512)

    // Tiêu đề Dateco MCC
    ctx.fillStyle = '#0284c7'
    ctx.fillRect(20, 15, 472, 40)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('DATECO - TỦ NGĂN KÉO MCC 400V', 40, 42)

    // 5 Tầng ngăn kéo rút (Drawers)
    for (let r = 0; r < 5; r++) {
      const y = 70 + r * 85
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(25, y, 462, 75)
      ctx.strokeStyle = '#64748b'
      ctx.lineWidth = 2
      ctx.strokeRect(25, y, 462, 75)

      // Tay khóa xoay liên động ngăn kéo
      ctx.fillStyle = '#09090b'
      ctx.fillRect(50, y + 25, 45, 25)

      // Đèn báo trạng thái Run / Trip
      ctx.fillStyle = '#22c55e'
      ctx.beginPath(); ctx.arc(140, y + 38, 8, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#ef4444'
      ctx.beginPath(); ctx.arc(170, y + 38, 8, 0, Math.PI * 2); ctx.fill()

      // Tên lộ động cơ
      ctx.fillStyle = '#f1f5f9'
      ctx.font = 'bold 16px monospace'
      ctx.fillText(`M${r + 1}: BƠM NƯỚC THẢI ${(r + 1) * 15}kW`, 210, y + 42)
    }

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 4. Texture Tủ Điện Tàu Biển (Marine Switchboard)
  const marineTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 512
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#1e2430'
    ctx.fillRect(0, 0, 512, 512)

    ctx.fillStyle = '#0f766e'
    ctx.fillRect(20, 15, 472, 45)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('DATECO - TỦ ĐIỆN TÀU BIỂN (VR / DNV)', 35, 45)

    // Dãy đồng hồ đo kim hàng hải chống rung (Vôn kế, Ampe kế, Tần số kế, Đồng hồ hòa đồng bộ)
    for (let m = 0; m < 4; m++) {
      const x = 40 + m * 115
      ctx.fillStyle = '#020617'
      ctx.fillRect(x, 80, 95, 95)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.strokeRect(x, 80, 95, 95)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px sans-serif'
      const names = ['VOLT', 'AMPERE', 'Hz', 'SYNCHRO']
      ctx.fillText(names[m], x + 25, 105)
      ctx.fillStyle = '#22c55e'
      ctx.font = 'bold 14px monospace'
      const vals = ['440V', '650A', '60.0Hz', 'SYNC']
      ctx.fillText(vals[m], x + 25, 140)
    }

    // Các rơ le bảo vệ máy phát điện tàu thủy
    ctx.fillStyle = '#334155'
    ctx.fillRect(35, 200, 442, 130)
    ctx.fillStyle = '#facc15'
    ctx.font = 'bold 15px monospace'
    ctx.fillText('BẢO VỆ MÁY PHÁT CHÍNH (MAIN GEN 1 & 2)', 55, 235)
    ctx.fillText('REVERSE POWER RELAY: 100% ARMED', 55, 270)
    ctx.fillText('CHỐNG CHẬM ĐẤT (EARTH FAULT): NORMAL', 55, 305)

    // Khóa liên động và tay gạt ACB tàu biển
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(180, 350, 150, 130)
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(220, 390, 70, 50)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText('TRIP', 235, 422)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 5. Texture Tủ Trung Thế RMU 24kV (Medium Voltage Switchgear)
  const rmuTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 512
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#475569'
    ctx.fillRect(0, 0, 512, 512)

    // Tiêu đề
    ctx.fillStyle = '#b91c1c'
    ctx.fillRect(20, 15, 472, 45)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('DATECO - TỦ TRUNG THẾ 24kV / 36kV', 35, 45)

    // Biển báo nguy hiểm điện cao thế hình tam giác
    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.moveTo(256, 80); ctx.lineTo(210, 155); ctx.lineTo(302, 155); ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 36px sans-serif'
    ctx.fillText('⚡', 242, 142)

    // Sơ đồ đơn tuyến Mimic Diagram
    ctx.strokeStyle = '#facc15'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(80, 200); ctx.lineTo(432, 200) // Thanh cái trung thế
    ctx.moveTo(160, 200); ctx.lineTo(160, 290) // Nhánh 1 (Dao cắt tải LBS)
    ctx.moveTo(350, 200); ctx.lineTo(350, 290) // Nhánh 2 (Máy cắt VCB)
    ctx.stroke()

    // Rơ le bảo vệ kỹ thuật số MiCOM
    ctx.fillStyle = '#090d16'
    ctx.fillRect(100, 330, 312, 140)
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2
    ctx.strokeRect(100, 330, 312, 140)

    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 15px monospace'
    ctx.fillText('DIGITAL RELAY: MiCOM P123', 125, 365)
    ctx.fillText('OVERCURRENT (50/51): ACTIVE', 125, 395)
    ctx.fillText('EARTH FAULT (50N/51N): OK', 125, 425)
    ctx.fillText('SF6 PRESSURE: 0.14 MPa [NORMAL]', 125, 455)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // 6. Texture Bàn Điều Khiển Desk Console
  const deskConsoleTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 256
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, 512, 256)

    // Khung màn hình hiển thị trung tâm
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(130, 20, 252, 130)
    ctx.strokeStyle = '#00f3ff'
    ctx.lineWidth = 3
    ctx.strokeRect(130, 20, 252, 130)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px "JetBrains Mono", monospace'
    ctx.fillText('BÀN ĐIỀU KHIỂN DATECO', 160, 50)
    ctx.fillStyle = '#22c55e'
    ctx.fillText('HỆ THỐNG TRẠM ĐIỆN VẬN HÀNH', 145, 80)
    ctx.fillStyle = '#facc15'
    ctx.fillText('CHẾ ĐỘ: SCADA CENTRAL AUTO', 145, 110)

    // Các cụm nút ấn công nghiệp Idec (Đỏ, Vàng, Xanh)
    const btnColors = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6']
    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = btnColors[b]
      ctx.beginPath()
      ctx.arc(45 + b * 25, 200, 10, 0, Math.PI * 2)
      ctx.fill()
    }

    // Nút dừng khẩn cấp E-STOP
    ctx.fillStyle = '#ef4444'
    ctx.beginPath(); ctx.arc(440, 200, 16, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = 4; ctx.stroke()

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
    if (marineAlarmLedRef.current) {
      marineAlarmLedRef.current.material.color.set(Math.sin(t * 6) > 0 ? '#ef4444' : '#7f1d1d')
    }
  })

  return (
    <group position={[-6.2, 0, -2.6]}>
      {/* ============================================================
          1. TỦ PHÂN PHỐI TỔNG MSB 2000A DATECO (MAIN SWITCHBOARD)
          ============================================================ */}
      <group
        position={[-3.6, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-msb',
            title: 'Tủ Điện Phân Phối Tổng MSB (Dateco Main Switchboard 2000A)',
            category: 'Hệ Thống Tủ Bảng Điện DATECO',
            price: 'Dự án: 185.000.000 đ',
            specs: [
              'Máy cắt không khí ACB 3P 2000A Schneider MasterPact / Siemens 3WL',
              'Hệ thống thanh cái đồng (Copper Busbar) mạ thiếc uốn góc chuẩn IEC 61439 Form 3b',
              'Đồng hồ đo đa năng Selec / Schneider PM5350 truyền thông Modbus RTU / RS485',
              'Vỏ tủ thép chấn CNC sơn tĩnh điện độ dày 2.0mm chuẩn Dateco tiêu chuẩn IP54'
            ],
            desc: 'Tủ điện MSB Dateco là trái tim phân phối nguồn điện hạ thế của toàn bộ nhà máy hoặc tòa nhà cao tầng, đảm bảo an toàn tuyệt đối và cấp điện liên tục 24/7.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 4.6, 1.4]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Cánh tủ khoét ô kính hiển thị máy cắt ACB */}
        <mesh position={[0, 2.8, 0.71]} castShadow>
          <boxGeometry args={[1.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        {/* Khung máy cắt ACB màu đen cam */}
        <mesh position={[0, 2.8, 0.74]}>
          <boxGeometry args={[0.95, 1.1, 0.06]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>
      </group>

      {/* ============================================================
          2. TỦ NGĂN KÉO MCC (MOTOR CONTROL CENTER) DATECO
          ============================================================ */}
      <group
        position={[-1.8, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-mcc',
            title: 'Tủ Trung Tâm Điều Khiển Động Cơ Ngăn Kéo MCC (Dateco)',
            category: 'Hệ Thống Tủ Bảng Điện DATECO',
            price: 'Dự án: 145.000.000 đ',
            specs: [
              'Cấu trúc dạng ngăn kéo rút (Withdrawable Drawers) dễ dàng bảo trì nóng không cần ngắt điện toàn trạm',
              'Tích hợp khởi động từ Contactor, rơ le nhiệt điện tử và Aptomat khối MCCB từng ngăn',
              'Khóa liên động cơ khí an toàn tuyệt đối chuẩn IEC 61439 Form 4b',
              'Hệ thống thanh cái phân phối bọc cách điện co nhiệt chịu dòng ngắn mạch cao'
            ],
            desc: 'Tủ ngăn kéo MCC Dateco chuyên dùng cho các nhà máy hóa chất, xi măng, xử lý nước thải và dây chuyền sản xuất liên tục yêu cầu thay thế nhanh.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 4.6, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Mặt cánh tủ hiển thị các tầng ngăn kéo rút MCC */}
        <mesh position={[0, 2.4, 0.71]}>
          <planeGeometry args={[1.5, 4.3]} />
          <meshStandardMaterial map={mccTexture} roughness={0.3} />
        </mesh>
      </group>

      {/* ============================================================
          3. TỦ TRUNG THẾ RMU 24kV - 36kV DATECO
          ============================================================ */}
      <group
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-rmu',
            title: 'Tủ Trung Thế RMU 24kV - 36kV Cách Điện Khí SF6 (Dateco)',
            category: 'Hệ Thống Tủ Bảng Điện DATECO',
            price: 'Dự án: 220.000.000 đ',
            specs: [
              'Tủ hợp bộ mạch vòng trung thế RMU 24kV/36kV Schneider / ABB',
              'Khoang máy cắt chân không VCB kết hợp rơ le bảo vệ kỹ thuật số MiCOM P123',
              'Cách điện khí SF6 hoàn toàn kín khí chống ẩm ướt và bụi bẩn đạt chuẩn IP67',
              'Đèn báo pha điện áp trung thế dạng tụ và chỉ thị vị trí dao tiếp địa'
            ],
            desc: 'Tủ trung thế RMU Dateco đóng cắt bảo vệ tuyến cáp ngầm trung thế cho các trạm biến áp Kiosk, nhà máy công nghiệp và tòa nhà văn phòng cao tầng.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 4.6, 1.4]} />
          <meshStandardMaterial color="#475569" roughness={0.35} metalness={0.6} />
        </mesh>
        {/* Mặt tủ trung thế có sơ đồ Mimic và rơ le số */}
        <mesh position={[0, 2.4, 0.71]}>
          <planeGeometry args={[1.5, 4.3]} />
          <meshStandardMaterial map={rmuTexture} roughness={0.3} />
        </mesh>
      </group>

      {/* ============================================================
          4. TỦ ĐIỆN TÀU BIỂN DATECO (MARINE SWITCHBOARD)
          ============================================================ */}
      <group
        position={[1.8, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-marine',
            title: 'Tủ Điện Tàu Biển & Hàng Hải Chuẩn Đăng Kiểm VR/DNV (Dateco)',
            category: 'Hệ Thống Tủ Bảng Điện DATECO',
            price: 'Dự án: 195.000.000 đ',
            specs: [
              'Đạt tiêu chuẩn đăng kiểm hàng hải Việt Nam (VR) và Quốc tế (DNV-GL, Lloyd)',
              'Vỏ thép tấm chấn dập chịu rung lắc cấp độ biển động và chống sương muối ăn mòn',
              'Hệ thống hòa đồng bộ máy phát điện tàu thủy tự động Auto-Synchronizing',
              'Rơ le bảo vệ công suất ngược (Reverse Power) và giám sát cách điện rò đất'
            ],
            desc: 'Tủ điện tàu biển Dateco cung cấp giải pháp phân phối điện và điều khiển động lực cho các tàu hàng viễn dương, tàu dầu và giàn khoan ngoài khơi.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 4.6, 1.4]} />
          <meshStandardMaterial color="#1e2430" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Mặt tủ tàu biển */}
        <mesh position={[0, 2.4, 0.71]}>
          <planeGeometry args={[1.5, 4.3]} />
          <meshStandardMaterial map={marineTexture} roughness={0.3} />
        </mesh>
        {/* Đèn tháp còi báo sự cố hàng hải gắn trên nóc tủ */}
        <group position={[0, 4.85, 0.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh ref={marineAlarmLedRef} position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          5. TỦ ĐIỆN ĐIỀU KHIỂN PLC SIEMENS S7-1200 & HMI SCADA DATECO
          ============================================================ */}
      <group
        position={[3.6, 0, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'cabinet-plc',
            title: 'Tủ Điều Khiển Tự Động Hóa PLC Siemens S7-1200 & HMI SCADA',
            category: 'Hệ Thống Tủ Bảng Điện DATECO',
            price: 'Dự án: 68.500.000 đ',
            specs: [
              'CPU Siemens S7-1200 1214C DC/DC/DC + Module Analog mở rộng SM1231',
              'Màn hình cảm ứng Weintek 7-inch chạy giao diện SCADA giám sát thời gian thực',
              'Biến tần VFD điều khiển tốc độ động cơ 3 pha và bộ nguồn Meanwell 24VDC',
              'Hệ thống rơ le kiếng trung gian IDEC và cầu đấu domino Phoenix Contact'
            ],
            desc: 'Tủ điện điều khiển tự động hóa trung tâm Dateco thu thập tín hiệu cảm biến, điều khiển động cơ servo, biến tần và truyền thông dữ liệu lên hệ thống SCADA/MES nhà máy thông minh.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 4.6, 1.4]} />
          <meshStandardMaterial color="#334155" roughness={0.45} metalness={0.4} />
        </mesh>

        {/* Module CPU Siemens S7-1200 */}
        <group position={[-0.2, 3.2, 0.58]}>
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
      </group>

      {/* ============================================================
          6. BÀN ĐIỀU KHIỂN TRUNG TÂM DATECO (DESK-TYPE CONTROL CONSOLE)
          ============================================================ */}
      <group
        position={[2.0, 0, 2.2]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'desk-console',
            title: 'Bàn Điều Khiển Trung Tâm Vận Hành Dateco Control Console',
            category: 'Hệ Thống Tủ Bảng Điện DATECO',
            price: 'Dự án: 85.000.000 đ',
            specs: [
              'Thiết kế dạng bàn vát nghiêng công thái học thuận tiện cho kỹ sư ngồi hoặc đứng vận hành',
              'Mặt bàn tích hợp nút nhấn Idec, switch xoay chọn chế độ Manual/Auto, còi báo sự cố',
              'Màn hình điều khiển HMI SCADA công nghiệp hiển thị sơ đồ công nghệ trạm điện',
              'Khoang dưới có khóa để lắp đặt PLC, nguồn DC dự phòng UPS và bộ chuyển mạch Switch'
            ],
            desc: 'Bàn điều khiển trung tâm Dateco thường được đặt trong phòng điều khiển trung tâm (CCR) của các nhà máy nhiệt điện, thủy điện, xi măng và trạm xử lý nước.'
          })
        }}
        cursor="pointer"
      >
        {/* Khối thân dưới của bàn điều khiển */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.2, 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Mặt bàn vát nghiêng 30 độ công thái học */}
        <group position={[0, 1.25, 0.05]} rotation={[-0.45, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.08, 0.95]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <planeGeometry args={[2.4, 0.88]} />
            <meshStandardMaterial map={deskConsoleTexture} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ============================================================
          7. TRẠM BIẾN ÁP KIOSK HỢP BỘ NGOÀI TRỜI DATECO (OUTDOOR KIOSK)
          Đặt ở góc sân ngoại thất phía sau bên ngoài showroom
          ============================================================ */}
      <group
        position={[-5.8, 0, 6.5]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'station-kiosk',
            title: 'Trạm Biến Áp Kiosk Hợp Bộ Ngoài Trời Dateco (Kiosk Substation)',
            category: 'Hệ Thống Trạm Biến Áp DATECO',
            price: 'Dự án trọn gói: 350.000.000 đ',
            specs: [
              'Trạm biến áp hợp bộ ngoài trời công suất đến 2500kVA 22/0.4kV',
              'Vỏ tôn mạ kẽm sơn tĩnh điện màu ghi sáng ngoài trời chống tia UV và thời tiết khắc nghiệt',
              'Mái dốc 2 bên thoát nước mưa tự nhiên và cửa chớp thông gió Louver tản nhiệt máy biến áp',
              'Gồm 3 khoang riêng biệt an toàn: Khoang Trung thế RMU - Khoang Máy biến áp - Khoang Hạ thế'
            ],
            desc: 'Trạm Kiosk Dateco được lắp đặt rộng rãi tại các khu đô thị mới, khu công nghiệp, bệnh viện và trung tâm thương mại nhờ tính thẩm mỹ cao và tiết kiệm diện tích đất xây dựng.'
          })
        }}
        cursor="pointer"
      >
        {/* Khối trạm Kiosk vỏ kim loại màu ghi sáng */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.6, 2.2]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Mái Kiosk dốc 2 bên màu ghi sẫm */}
        <mesh position={[0, 3.7, 0]} castShadow>
          <boxGeometry args={[3.4, 0.35, 2.4]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
        {/* Cửa chớp Louver tản nhiệt */}
        {[-0.8, 0.8].map((cx, ci) => (
          <mesh key={`louver-${ci}`} position={[cx, 1.6, 1.11]}>
            <boxGeometry args={[1.1, 1.8, 0.04]} />
            <meshStandardMaterial color="#475569" roughness={0.6} />
          </mesh>
        ))}
        {/* Biển cảnh báo điện cao thế Dateco */}
        <mesh position={[0, 2.8, 1.12]}>
          <boxGeometry args={[0.9, 0.35, 0.02]} />
          <meshStandardMaterial color="#facc15" roughness={0.2} />
        </mesh>
      </group>

      {/* ============================================================
          8. TRẠM TRỤ THÉP MÁY BIẾN ÁP 1 CỘT DATECO (SINGLE-POLE SUBSTATION)
          Đặt ở góc sân ngoại thất ven đường
          ============================================================ */}
      <group
        position={[-8.5, 0, 7.8]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'station-pole',
            title: 'Trạm Biến Áp Trụ Thép Đơn Thân 1 Cột Dateco (Trạm Trụ)',
            category: 'Hệ Thống Trạm Biến Áp DATECO',
            price: 'Dự án trọn gói: 160.000.000 đ',
            specs: [
              'Trụ thép đơn thân mạ kẽm nhúng nóng tiết kiệm diện tích tối đa cho đô thị',
              'Đặt máy biến áp 3 pha ngâm dầu công suất đến 630kVA trên đỉnh trụ',
              'Tủ phân phối hạ thế trạm trụ Dateco tích hợp gọn gàng ngay dưới chân cột',
              'Trang bị chống sét van LA, cầu chì tự rơi FCO và hệ thống tiếp địa an toàn'
            ],
            desc: 'Trạm trụ Dateco là giải pháp cấp điện tối ưu cho các tuyến phố nội thành Hà Nội và vỉa hè hẹp, không chiếm diện tích mặt đất mà vẫn đảm bảo mỹ quan đô thị.'
          })
        }}
        cursor="pointer"
      >
        {/* Trụ thép tròn mạ kẽm */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, 5.2, 20]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Khung bệ đỡ máy biến áp trên cao */}
        <mesh position={[0, 5.3, 0]} castShadow>
          <boxGeometry args={[1.4, 0.15, 1.4]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        {/* Máy biến áp 3 pha trên đỉnh trụ có cánh tản nhiệt */}
        <mesh position={[0, 6.1, 0]} castShadow>
          <boxGeometry args={[1.0, 1.3, 0.9]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        {/* Sứ cách điện cao thế màu nâu gốm trên đỉnh */}
        {[-0.3, 0, 0.3].map((bx, bi) => (
          <mesh key={`bushing-${bi}`} position={[bx, 7.0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.5, 12]} />
            <meshStandardMaterial color="#78350f" roughness={0.2} />
          </mesh>
        ))}
        {/* Tủ hạ thế trạm trụ Dateco gắn dưới chân cột */}
        <mesh position={[0, 1.4, 0.45]} castShadow>
          <boxGeometry args={[0.9, 1.4, 0.45]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Đèn downlight rọi sáng dàn tủ điện Dateco */}
      <pointLight position={[0, 4.5, 1.5]} color="#e0f2fe" intensity={1.8} distance={10} decay={2} />
    </group>
  )
}

export default PlcAutomationDept
