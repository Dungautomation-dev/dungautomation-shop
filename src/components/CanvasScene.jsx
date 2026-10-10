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

export default function CanvasScene({ isNightMode, onSelectItem, cameraPreset }) {
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
          desc: 'Chi tiết linh kiện tại cửa hàng DungAutomation.'
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
        toneMappingExposure: 1.15
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

      {/* Lighting Rig, HDRI Environment & Post-processing Bloom */}
      <LightingAndPostFx isNightMode={isNightMode} />

      {/* ================= ARCHITECTURAL DIORAMA SCENE ================= */}
      <group position={[0, 0, 0]}>
        {/* Curving Plinth, Italian Marble Floor & Sidewalk */}
        <DioramaPlinth />

        {/* Slatted Cedar Walls, Structural Steel Beams, Glass & Neon Signage */}
        <StoreArchitecture isNight={isNightMode} />

        {/* Department 1: Siemens PLC S7-1200, HMI SCADA, Inverter VFD Cabinet */}
        <PlcAutomationDept level={2} onSelect={handleSelect} />

        {/* Department 2: 6-DOF Robotic Arm, Turntable, 3D Printer */}
        <RoboticsDept level={2} onSelect={handleSelect} demoBoost={false} />

        {/* Department 3: Maker Lab Workbench, Rigol Oscilloscope, Soldering Station */}
        <MakerBenchDept level={2} onSelect={handleSelect} />

        {/* Department 4: Illuminated Glass Vitrine with Arduino, ESP32, Raspberry Pi */}
        <ArduinoEspDept level={2} onSelect={handleSelect} />

        {/* Department 5: Walnut Checkout Counter, Electric Scooter, Streetlamp & Planters */}
        <CheckoutDept onSelect={handleSelect} />

        {/* Stylized Humanoid Customers & Staff walking with animated legs */}
        <Customers onSelect={handleSelect} />
      </group>
    </Canvas>
  )
}
