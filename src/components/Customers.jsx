import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Stylized cute humanoid character component with animated limbs
function StylizedCharacter({
  initialPos = [0, 0, 0],
  colorBody = '#3b82f6',
  colorHair = '#1c1917',
  colorPants = '#1f2937',
  hasCap = false,
  hasBackpack = false,
  waypoints = [],
  speed = 1.2,
  onSelect,
  info
}) {
  const groupRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const currentWaypointIndex = useRef(0)
  const waitTimer = useRef(0)
  const isWalking = useRef(true)

  // Waypoints loop
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime

    if (waypoints.length > 1) {
      if (waitTimer.current > 0) {
        waitTimer.current -= delta
        isWalking.current = false
      } else {
        isWalking.current = true
        const target = waypoints[currentWaypointIndex.current]
        const currentPos = groupRef.current.position
        const dir = new THREE.Vector3(target[0] - currentPos.x, 0, target[2] - currentPos.z)
        const dist = dir.length()

        if (dist < 0.15) {
          // Reached waypoint, pause for 2.5s to browse/shop
          waitTimer.current = target[3] || 2.0
          currentWaypointIndex.current = (currentWaypointIndex.current + 1) % waypoints.length
        } else {
          dir.normalize()
          groupRef.current.position.x += dir.x * speed * delta
          groupRef.current.position.z += dir.z * speed * delta

          // Smoothly rotate towards direction
          const targetAngle = Math.atan2(dir.x, dir.z)
          groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetAngle,
            delta * 8
          )
        }
      }
    }

    // Walking leg/arm swing cycle
    if (isWalking.current) {
      const swing = Math.sin(time * speed * 7) * 0.45
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.8
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.8
    } else {
      // Idle breathing
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.05
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(time * 2) * 0.05
    }
  })

  return (
    <group
      ref={groupRef}
      position={initialPos}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(info)
      }}
      cursor="pointer"
    >
      {/* Head */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.5} />
      </mesh>

      {/* Hair / Cap */}
      {hasCap ? (
        <group position={[0, 1.58, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.08, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.6} />
          </mesh>
          {/* Cap visor bill */}
          <mesh position={[0, -0.02, 0.16]} rotation={[0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.22, 0.03, 0.15]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, 1.56, -0.02]} castShadow>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={colorHair} roughness={0.8} />
        </mesh>
      )}

      {/* Torso / Jacket */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.34, 0.48, 0.22]} />
        <meshStandardMaterial color={colorBody} roughness={0.6} />
      </mesh>

      {/* Backpack if equipped */}
      {hasBackpack && (
        <mesh position={[0, 1.08, -0.16]} castShadow>
          <boxGeometry args={[0.26, 0.36, 0.14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      )}

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.22, 1.22, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.09, 0.4, 0.09]} />
          <meshStandardMaterial color={colorBody} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.22, 1.22, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.09, 0.4, 0.09]} />
          <meshStandardMaterial color={colorBody} />
        </mesh>
      </group>

      {/* Pelvis */}
      <mesh position={[0, 0.74, 0]} castShadow>
        <boxGeometry args={[0.32, 0.16, 0.2]} />
        <meshStandardMaterial color={colorPants} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.66, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.11, 0.64, 0.11]} />
          <meshStandardMaterial color={colorPants} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.62, 0.04]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.66, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.11, 0.64, 0.11]} />
          <meshStandardMaterial color={colorPants} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.62, 0.04]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.18]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>
    </group>
  )
}

export default function Customers({ onSelect }) {
  // Define 5 distinct dynamic characters in Hanoi DungAutomation Shop
  return (
    <group>
      {/* 1. Maker Engineer browsing Arduino & ESP32 */}
      <StylizedCharacter
        initialPos={[-1.2, 0, 1.5]}
        colorBody="#2563eb" // Blue hoodie
        colorHair="#451a03"
        colorPants="#374151"
        hasBackpack={true}
        speed={1.0}
        waypoints={[
          [-1.5, 0, 1.2, 4.0], // Staring at Arduino Uno shelf
          [-2.2, 0, 2.0, 3.5], // Staring at ESP32-S3 shelf
          [-0.8, 0, 2.5, 2.0], // Pondering
          [-1.5, 0, 1.2, 4.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-1',
          title: 'Kỹ sư Hoàng Nam - Maker IoT Hà Nội',
          category: 'Khách Hàng Thân Thiết',
          price: 'Giỏ hàng dự kiến: 850.000 đ',
          specs: [
            'Đang tìm kiếm: ESP32-S3 N16R8 Dual Type-C & Màn hình tròn GC9A01',
            'Mục đích: Dự án trạm quan trắc chất lượng không khí thông minh tại Cầu Giấy',
            'Đánh giá shop: "DungAutomation có hàng chuẩn chính hãng, mạch hàn sạch đẹp 10/10!"'
          ],
          desc: 'Kỹ sư lập trình nhúng kỳ cựu đang chọn bo mạch vi điều khiển thế hệ mới hỗ trợ Wi-Fi & Bluetooth 5.0 để làm hệ thống Smart Home.'
        }}
      />

      {/* 2. Senior Industrial Engineer inspecting Siemens S7-1200 */}
      <StylizedCharacter
        initialPos={[-3.0, 0, -2.0]}
        colorBody="#475569" // Grey formal polo
        colorHair="#1f2937"
        colorPants="#0f172a"
        speed={0.8}
        waypoints={[
          [-3.2, 0, -2.2, 5.0], // Examining PLC cabinet
          [-2.4, 0, -1.8, 3.0], // Checking Weintek HMI touch screen
          [-3.0, 0, -2.8, 4.0]  // Reviewing 24VDC Industrial Power Supply
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-2',
          title: 'Kỹ sư Trưởng Quốc Tuấn - Nhà Máy Tự Động Hoá KCN Bắc Ninh',
          category: 'Khách Hàng Doanh Nghiệp (B2B)',
          price: 'Hợp đồng dự án: 48.000.000 đ',
          specs: [
            'Nhu cầu: 5x CPU Siemens S7-1200 1214C DC/DC/DC + Module Analog SM1231',
            'Ứng dụng: Điều khiển dây chuyền đóng gói bao bì tự động và giám sát SCADA',
            'Đánh giá: "Cần giao gấp trong chiều nay để lắp tủ điện bảo trì ca đêm!"'
          ],
          desc: 'Chuyên gia tự động hoá công nghiệp đang kiểm tra cấu hình phần cứng tủ PLC Siemens trước khi ký hợp đồng nhập số lượng lớn.'
        }}
      />

      {/* 3. Tech Student testing oscilloscope at MakerBench */}
      <StylizedCharacter
        initialPos={[1.0, 0, -2.2]}
        colorBody="#059669" // Emerald green sweater
        colorHair="#7c2d12"
        colorPants="#1e293b"
        speed={0.9}
        waypoints={[
          [1.0, 0, -2.2, 6.0], // Hands-on bench testing
          [1.8, 0, -1.8, 2.5], // Watching 3D printer
          [1.0, 0, -2.2, 6.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-3',
          title: 'Bạn Minh Châu - Sinh viên ĐH Bách Khoa Hà Nội (HUST)',
          category: 'Khu Vực Trải Nghiệm Maker Lab',
          price: 'Đang mượn máy đo sóng Rigol miễn phí',
          specs: [
            'Thực hành: Đo xung PWM điều khiển động cơ servo máy bay mô hình RC',
            'Khu Maker Lab DungAutomation: Miễn phí trạm hàn & máy hiện sóng cho sinh viên',
            'Đánh giá: "Không gian quá xịn, được tự tay test mạch trước khi mua linh kiện!"'
          ],
          desc: 'Sinh viên năm cuối ngành Điện tử Viễn thông đang sử dụng bàn thực nghiệm chuyên dụng tại cửa hàng DungAutomation để bắt sóng xung PWM.'
        }}
      />

      {/* 4. DungAutomation Fast Shipper in Red Cap picking up order */}
      <StylizedCharacter
        initialPos={[0.8, 0, 3.5]}
        colorBody="#ea580c" // Orange courier uniform
        colorPants="#111827"
        hasCap={true}
        speed={1.4}
        waypoints={[
          [0.8, 0, 3.5, 3.0],  // Waiting at checkout counter
          [1.8, 0, 4.2, 2.0],  // Picking up parcel
          [3.2, 0, 3.8, 1.5],  // Heading out towards electric scooter
          [3.8, 0, 2.0, 3.0],  // Beside the courier scooter
          [1.8, 0, 4.2, 2.0]   // Returning for next batch
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-4',
          title: 'Shipper Tuấn Anh - Đội Giao Vận DungAutomation Express',
          category: 'Vận Chuyển Hoả Tốc 24/7',
          price: 'Đã hoàn thành: 28 đơn/ngày',
          specs: [
            'Đơn hàng hiện tại: Gói combo ESP32 Cam AI + Khung xe robot 4WD đi Thanh Xuân',
            'Thời gian dự kiến giao: 25 phút',
            'Phương tiện: Xe điện DungAutomation pin lithium 72V 90km'
          ],
          desc: 'Nhân viên giao nhận hoả tốc luôn túc trực để chuyển linh kiện ngay khi khách hàng đặt trực tuyến trên website.'
        }}
      />

      {/* 5. Sidewalk Pedestrian admiring the store window */}
      <StylizedCharacter
        initialPos={[4.5, 0, -3.5]}
        colorBody="#db2777" // Pink coat
        colorHair="#09090b"
        colorPants="#3f3f46"
        speed={0.7}
        waypoints={[
          [4.5, 0, -3.5, 1.0], // Walking down sidewalk
          [4.2, 0, -0.5, 4.0], // Stopping to admire 6-DOF Robot Arm through glass
          [4.0, 0, 2.5, 2.0],  // Checking outdoor promo totem
          [4.5, 0, 4.5, 1.0],  // Moving on
          [4.5, 0, -3.5, 1.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-5',
          title: 'Khách Dạo Phố - Du Khách Công Nghệ',
          category: 'Người Qua Đường Phố Cổ',
          price: 'Trải nghiệm thị giác 3D',
          specs: [
            'Hành động: Trầm trồ trước cánh tay robot 6 trục gắp chip công nghiệp trong tủ kính',
            'Địa điểm: Vỉa hè đá granite mặt tiền DungAutomation Shop',
            'Nhận xét: "Cửa hàng tự động hoá thiết kế quá sang trọng và hiện đại!"'
          ],
          desc: 'Người qua đường bị thu hút bởi ánh sáng neon ấm áp và cánh tay robot tự động hoạt động mượt mà xuyên qua lớp kính cường lực trong suốt.'
        }}
      />
    </group>
  )
}
