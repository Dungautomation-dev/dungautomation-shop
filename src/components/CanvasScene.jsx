import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

import DioramaPlinth from './DioramaPlinth'
import StoreArchitecture from './StoreArchitecture'
import PlcAutomationDept from './PlcAutomationDept'
import RoboticsDept from './RoboticsDept'
import MakerBenchDept from './MakerBenchDept'
import ArduinoEspDept from './ArduinoEspDept'
import CheckoutDept from './CheckoutDept'
import CyberTechDept from './CyberTechDept'
import StreetCornerEnvironment from './StreetCornerEnvironment'
import MiniConveyorDept from './MiniConveyorDept'
import ScadaStationDept from './ScadaStationDept'
import Customers from './Customers'
import LightingAndPostFx from './LightingAndPostFx'

const DEPT_CATALOG = {
  plc_automation: {
    id: 'plc_automation',
    title: 'Tủ Điều Khiển Công Nghiệp PLC Siemens S7-1200',
    category: 'Industrial Automation',
    price: 'Giá: 6.850.000 đ',
    specs: [
      'CPU 1214C DC/DC/DC, 14 DI / 10 DO / 2 AI onboard',
      'Cổng truyền thông PROFINET Ethernet công nghiệp tốc độ cao',
      'Màn hình HMI cảm ứng màu Weintek 7-inch kết nối SCADA',
      'Biến tần VFD điều khiển động cơ 3 pha và bộ nguồn Meanwell 24VDC'
    ],
    desc: 'Dòng PLC tiêu chuẩn công nghiệp châu Âu chuyên dùng cho các dây chuyền tự động hoá nhà máy, phân loại sản phẩm và hệ thống giám sát SCADA IoT.'
  },
  robotics: {
    id: 'robotics',
    title: 'Cánh Tay Robot Công Nghiệp 6 Trục (6-DOF Manipulator)',
    category: 'Robotics & AI',
    price: 'Giá: 32.500.000 đ',
    specs: [
      '6 bậc tự do linh hoạt với động cơ Servo không chổi than chính xác cao',
      'Tải trọng định mức 3.5kg, tầm với bán kính 650mm',
      'Cơ chế gắp hút chân không và kẹp khí nén Pick & Place',
      'Tích hợp máy in 3D công nghiệp CoreXY in linh kiện tại chỗ'
    ],
    desc: 'Trạm cánh tay robot tự động hoá thực hiện quy trình gắp linh kiện điện tử microchip và đóng gói tự động với độ chính xác lặp lại ±0.03mm.'
  },
  maker_lab: {
    id: 'maker_lab',
    title: 'Bàn Thực Nghiệm Kỹ Thuật & Maker Lab Chuyên Dụng',
    category: 'Maker & Testing Lab',
    price: 'Miễn phí trải nghiệm tại shop',
    specs: [
      'Máy hiện sóng số 4 kênh Rigol DS1054Z 50MHz/1GSa/s',
      'Trạm hàn chỉnh nhiệt Quick 936A chống tĩnh điện ESD',
      'Bộ cấp nguồn lập trình tuyến tính 0-30V 5A hiển thị OLED',
      'Testboard cắm dây thực nghiệm kiểm tra mạch xung PWM'
    ],
    desc: 'Không gian mở dành cho cộng đồng kỹ sư, sinh viên và Maker tự do thử nghiệm vi mạch, bắt sóng dao động xung trước khi ứng dụng thực tế.'
  },
  arduino_esp: {
    id: 'arduino_esp',
    title: 'Tủ Trưng Bày Vi Điều Khiển ESP32, Arduino & Raspberry Pi',
    category: 'Embedded & IoT Boards',
    price: 'Từ: 65.000 đ - 1.850.000 đ',
    specs: [
      'Bo mạch ESP32-S3 Dual Type-C Wi-Fi/BLE 5.0 AI N16R8',
      'Arduino Uno R3 chính hãng nạp chip ATmega328P DIP',
      'Raspberry Pi 4 Model B 8GB RAM hỗ trợ hệ điều hành Linux',
      'Cảm biến môi trường BME280, MPU6050, RFID RC522'
    ],
    desc: 'Tủ kính trưng bày 3 tầng chiếu sáng viền LED tập hợp đầy đủ các dòng bo mạch nhúng thông minh, mạch nạp và module cảm biến IoT phổ biến nhất thị trường.'
  },
  cybertech: {
    id: 'cybertech',
    title: 'Khu Trưng Bày Công Nghệ Tương Lai Cyberpunk 2077',
    category: 'Cyberpunk & Future Gadgets',
    price: 'Từ: 18.500.000 đ - 120.000.000 đ',
    specs: [
      'Điện thoại gập 3 cánh Tri-Fold OLED 10.2 inch uốn dẻo siêu mỏng',
      'Tivi / Màn hình trong suốt Transparent Micro-OLED 8K 240Hz',
      'Laptop Cyberdeck 2 màn hình cảm ứng, bàn phím cơ quang học trong suốt RGB',
      'Drone trợ lý trí tuệ nhân tạo bay lơ lửng bằng lực nâng từ trường ion'
    ],
    desc: 'Khu vực trưng bày những thiết bị công nghệ đỉnh cao phong cách Cyberpunk 2077, cho phép trải nghiệm trực tiếp các thiết bị màn hình gập và màn hình trong suốt thế hệ mới.'
  },
  mini_conveyor: {
    id: 'mini_conveyor',
    title: 'Dây Chuyền Băng Tải Phân Loại Sản Phẩm Tự Động Mini',
    category: 'Industrial Automation Demo',
    price: 'Mô hình thực nghiệm: 24.500.000 đ',
    specs: [
      'Băng tải cao su PVC chống trượt, động cơ DC 24V 60W điều tốc PWM tích hợp Encoder',
      'Cảm biến quang Omron E3Z-D61 nhận diện phôi và Cảm biến tiệm cận kim loại Omron E2E',
      'Cụm xilanh khí nén SMC dẫn hướng MGPM16-30Z và van điện từ Festo phân loại phôi lỗi Reject',
      'Tháp đèn tín hiệu 3 tầng PATLITE (Red/Yellow/Green) hiển thị trạng thái vận hành',
      'Lập trình điều khiển phối hợp PLC Siemens S7-1200 kết nối truyền thông công nghiệp'
    ],
    desc: 'Mô hình dây chuyền phân loại tự động hóa mini kích thước thu nhỏ mô phỏng thực tế quá trình sản xuất nhà máy thông minh, phục vụ đào tạo R&D và kiểm thử thuật toán PLC.'
  },
  scada_wastewater: {
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
  }
}

// Camera smooth navigation controller
function CameraDirector({ preset, controlsRef }) {
  const targetCamPos = useRef(new THREE.Vector3(18, 16, 20))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, 0))
  const isTransitioning = useRef(false)
  const lastPreset = useRef(null)

  useEffect(() => {
    if (preset === lastPreset.current) return
    lastPreset.current = preset

    switch (preset) {
      case 'plc':
        targetCamPos.current.set(-1.5, 5.5, 3.5)
        targetLookAt.current.set(-3.2, 1.6, -2.0)
        break
      case 'robotics':
        targetCamPos.current.set(5.5, 5.2, 1.8)
        targetLookAt.current.set(2.8, 1.5, -2.6)
        break
      case 'maker':
        targetCamPos.current.set(2.6, 5.0, 1.0)
        targetLookAt.current.set(0.8, 1.4, -2.6)
        break
      case 'arduino':
        targetCamPos.current.set(-1.0, 5.2, 6.2)
        targetLookAt.current.set(-2.2, 1.6, 2.5)
        break
      case 'cybertech':
        targetCamPos.current.set(6.2, 4.5, 4.8)
        targetLookAt.current.set(2.8, 1.4, 1.2)
        break
      case 'conveyor':
        targetCamPos.current.set(0.5, 4.2, 0.8)
        targetLookAt.current.set(-1.6, 1.3, -1.8)
        break
      case 'scada':
        targetCamPos.current.set(-2.0, 4.2, -3.4)
        targetLookAt.current.set(-4.2, 1.8, -6.0)
        break
      case 'checkout':
        targetCamPos.current.set(5.8, 4.8, 7.8)
        targetLookAt.current.set(1.8, 1.3, 3.8)
        break
      case 'overview':
      default:
        targetCamPos.current.set(18, 16, 20)
        targetLookAt.current.set(0, 1.5, 0)
        break
    }
    isTransitioning.current = true
  }, [preset])

  // Stop auto-transition as soon as the user starts interacting with mouse/touch!
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const onUserInteraction = () => {
      isTransitioning.current = false
    }

    controls.addEventListener('start', onUserInteraction)
    return () => {
      controls.removeEventListener('start', onUserInteraction)
    }
  }, [controlsRef])

  useFrame((state, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return
    const camera = state.camera

    camera.position.lerp(targetCamPos.current, delta * 3.5)
    controlsRef.current.target.lerp(targetLookAt.current, delta * 3.5)
    controlsRef.current.update()

    const distPos = camera.position.distanceTo(targetCamPos.current)
    const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current)

    // Once reached close to target, stop fighting user input!
    if (distPos < 0.08 && distTarget < 0.08) {
      isTransitioning.current = false
    }
  })

  return null
}

export default function CanvasScene({
  isNightMode,
  season,
  bloomIntensity,
  lightBrightness,
  onSelectItem,
  cameraPreset
}) {
  const controlsRef = useRef()

  const handleSelect = (item) => {
    if (typeof item === 'string') {
      onSelectItem?.(
        DEPT_CATALOG[item] || {
          id: item,
          title: item,
          category: 'Khu Trưng Bày',
          price: 'Liên hệ',
          specs: [],
          desc: 'Chi tiết linh kiện tại showroom DungAutomation.'
        }
      )
    } else {
      onSelectItem?.(item)
    }
  }

  return (
    <Canvas
      shadows
      camera={{ position: [18, 16, 20], fov: 36, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Interactive Orbit Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.06}
        maxPolarAngle={Math.PI / 2 - 0.04} // Keep above plinth base
        minDistance={6}
        maxDistance={45}
        target={[0, 1.5, 0]}
      />

      <CameraDirector preset={cameraPreset} controlsRef={controlsRef} />

      {/* Lighting Rig, HDRI Environment & Post-processing Bloom (Không chói mắt) */}
      <LightingAndPostFx
        isNightMode={isNightMode}
        season={season}
        bloomIntensity={bloomIntensity}
        lightBrightness={lightBrightness}
      />

      {/* ================= ARCHITECTURAL DIORAMA SCENE ================= */}
      <group position={[0, 0, 0]}>
        {/* Curving Plinth, Sàn Slate chống chói & Vỉa hè ngoại thất */}
        <DioramaPlinth season={season} />

        {/* Khung kiến trúc mở không bị che chắn */}
        <StoreArchitecture isNight={isNightMode} />

        {/* Phân khu 1: Siemens PLC S7-1200, HMI SCADA, Inverter VFD Cabinet */}
        <PlcAutomationDept onSelect={handleSelect} />

        {/* Phân khu SCADA: TRẠM KỸ SƯ SCADA GIÁM SÁT TRẠM XỬ LÝ NƯỚC THẢI & TIA PORTAL */}
        <ScadaStationDept onSelect={handleSelect} />

        {/* Phân khu BĂNG TẢI: DÂY CHUYỀN BĂNG TẢI PHÂN LOẠI SẢN PHẨM TỰ ĐỘNG MINI */}
        <MiniConveyorDept onSelect={handleSelect} />

        {/* Phân khu 2: Cánh tay Robot 6-DOF, Mâm xoay Turntable, Máy in 3D */}
        <RoboticsDept onSelect={handleSelect} />

        {/* Phân khu 3: Bàn Maker Lab Workbench, Máy hiện sóng Rigol, Trạm hàn */}
        <MakerBenchDept onSelect={handleSelect} />

        {/* Phân khu 4: Tủ kính vi điều khiển Arduino, ESP32, Raspberry Pi */}
        <ArduinoEspDept onSelect={handleSelect} />

        {/* Phân khu MỚI: ĐỒ CÔNG NGHỆ TƯƠNG LAI CYBERPUNK 2077 (Tri-Fold Phone, TV Trong Suốt, Laptop 2 Màn Hình, Drone) */}
        <CyberTechDept onSelect={handleSelect} />

        {/* Phân khu 5: Quầy Thu Ngân, Xe Máy Điện Giao Vận Hoả Tốc */}
        <CheckoutDept onSelect={handleSelect} />

        {/* CẢNH VẬT GÓC PHỐ 4 MÙA (Hàng cây đổi màu, hạt thời tiết bay, máy bán nước, biển tên phố) */}
        <StreetCornerEnvironment season={season} isNight={isNightMode} onSelect={handleSelect} />

        {/* Nhân vật khách hàng & kỹ sư dạo bước */}
        <Customers onSelect={handleSelect} />
      </group>
    </Canvas>
  )
}
