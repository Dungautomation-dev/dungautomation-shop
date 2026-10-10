import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Stylized Architectural Diorama Humanoid Character (Chuẩn nhân vật kiến trúc nghệ thuật)
function DioramaCharacter({
  initialPos = [0, 0, 0],
  jacketColor = '#2563eb',
  pantsColor = '#1f2937',
  hairColor = '#18181b',
  hasTablet = false,
  hasBag = false,
  hasHelmet = false,
  waypoints = [],
  speed = 1.0,
  onSelect,
  info
}) {
  const rootRef = useRef()
  const bodyRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const currentWp = useRef(0)
  const waitTimer = useRef(0)
  const isWalking = useRef(true)

  useFrame((state, delta) => {
    if (!rootRef.current) return
    const time = state.clock.elapsedTime

    if (waypoints.length > 1) {
      if (waitTimer.current > 0) {
        waitTimer.current -= delta
        isWalking.current = false
      } else {
        isWalking.current = true
        const target = waypoints[currentWp.current]
        const currentPos = rootRef.current.position
        const dir = new THREE.Vector3(target[0] - currentPos.x, 0, target[2] - currentPos.z)
        const dist = dir.length()

        if (dist < 0.18) {
          waitTimer.current = target[3] || 2.5
          currentWp.current = (currentWp.current + 1) % waypoints.length
        } else {
          dir.normalize()
          rootRef.current.position.x += dir.x * speed * delta
          rootRef.current.position.z += dir.z * speed * delta

          const targetAngle = Math.atan2(dir.x, dir.z)
          rootRef.current.rotation.y = THREE.MathUtils.lerp(
            rootRef.current.rotation.y,
            targetAngle,
            delta * 7
          )
        }
      }
    }

    // Walking animation
    if (isWalking.current) {
      const swing = Math.sin(time * speed * 6.5) * 0.4
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.7
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.7

      // Nhấp nhô bước chân (Natural vertical bobbing)
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.03 * Math.abs(Math.sin(time * speed * 6.5))
      }
    } else {
      // Idle pose
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(time * 1.8) * 0.04
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(time * 1.8) * 0.04
      if (bodyRef.current) bodyRef.current.position.y = Math.sin(time * 2) * 0.015
    }
  })

  return (
    <group
      ref={rootRef}
      position={initialPos}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(info)
      }}
      cursor="pointer"
    >
      <group ref={bodyRef}>
        {/* ================= ĐẦU VÀ TÓC NGHỆ THUẬT ================= */}
        <group position={[0, 1.52, 0]}>
          {/* Khuôn mặt thanh tú */}
          <mesh castShadow>
            <sphereGeometry args={[0.13, 18, 18]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>

          {/* Mũ bảo hiểm hoặc tóc phong cách */}
          {hasHelmet ? (
            <mesh position={[0, 0.04, -0.01]} castShadow>
              <sphereGeometry args={[0.15, 18, 18]} />
              <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
            </mesh>
          ) : (
            <mesh position={[0, 0.05, -0.02]} castShadow>
              <sphereGeometry args={[0.14, 18, 18]} />
              <meshStandardMaterial color={hairColor} roughness={0.7} />
            </mesh>
          )}

          {/* Cổ mảnh kết nối tự nhiên */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>
        </group>

        {/* ================= THÂN TRÊN & ÁO KHOÁC THIẾT KẾ VÁT ================= */}
        <group position={[0, 1.15, 0]}>
          {/* Thân áo khoác thuôn nhẹ từ vai xuống eo */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.14, 0.52, 16]} />
            <meshStandardMaterial color={jacketColor} roughness={0.5} />
          </mesh>

          {/* Cổ áo polo/blazer */}
          <mesh position={[0, 0.22, 0.06]}>
            <boxGeometry args={[0.14, 0.06, 0.06]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>

          {/* Túi đeo chéo / Balo nếu có */}
          {hasBag && (
            <mesh position={[0, -0.02, -0.14]} castShadow>
              <boxGeometry args={[0.22, 0.26, 0.12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>
          )}

          {/* Tablet SCADA cầm trên tay kỹ sư phát sáng */}
          {hasTablet && (
            <group position={[0.22, -0.05, 0.2]} rotation={[0.4, -0.3, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.22, 0.15, 0.02]} />
                <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Màn hình SCADA thu nhỏ */}
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[0.2, 0.13]} />
                <meshStandardMaterial
                  color="#00f3ff"
                  emissive="#00f3ff"
                  emissiveIntensity={2}
                  toneMapped={false}
                />
              </mesh>
            </group>
          )}
        </group>

        {/* ================= TAY TRÁI & TAY PHẢI ================= */}
        <group ref={leftArmRef} position={[-0.22, 1.34, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.035, 0.44, 12]} />
            <meshStandardMaterial color={jacketColor} />
          </mesh>
          <mesh position={[0, -0.46, 0]} castShadow>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.22, 1.34, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.035, 0.44, 12]} />
            <meshStandardMaterial color={jacketColor} />
          </mesh>
          <mesh position={[0, -0.46, 0]} castShadow>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        </group>

        {/* ================= HÔNG VÀ 2 CHÂN THUÔN DÀI ================= */}
        {/* Hông */}
        <mesh position={[0, 0.84, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.13, 0.14, 16]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>

        {/* Chân trái */}
        <group ref={leftLegRef} position={[-0.08, 0.76, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.72, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Giày sneaker thanh lịch */}
          <group position={[0, -0.74, 0.03]}>
            <mesh castShadow>
              <boxGeometry args={[0.09, 0.06, 0.18]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, -0.025, 0]}>
              <boxGeometry args={[0.095, 0.02, 0.19]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        </group>

        {/* Chân phải */}
        <group ref={rightLegRef} position={[0.08, 0.76, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.72, 12]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Giày sneaker */}
          <group position={[0, -0.74, 0.03]}>
            <mesh castShadow>
              <boxGeometry args={[0.09, 0.06, 0.18]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, -0.025, 0]}>
              <boxGeometry args={[0.095, 0.02, 0.19]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

export function Customers({ onSelect }) {
  return (
    <group>
      {/* 1. Kỹ sư tự động hóa cầm tablet SCADA kiểm tra tủ PLC Siemens */}
      <DioramaCharacter
        initialPos={[-4.5, 0, -2.2]}
        jacketColor="#0f766e" // Teal công nghiệp lịch sự
        pantsColor="#1e293b"
        hairColor="#1c1917"
        hasTablet={true}
        speed={0.8}
        waypoints={[
          [-5.2, 0, -2.5, 6.0], // Đứng kiểm tra tủ PLC
          [-3.8, 0, -2.0, 3.5], // Đối chiếu thông số HMI
          [-2.2, 0, -2.5, 4.0], // Xem máy in 3D
          [-5.2, 0, -2.5, 6.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-engineer',
          title: 'Kỹ Sư Trưởng Quốc Tuấn - Nhà Máy KCN Bắc Ninh',
          category: 'Khách Hàng Doanh Nghiệp (B2B)',
          price: 'Hợp đồng dự án: 48.500.000 đ',
          specs: [
            'Nhu cầu: 5x Bộ CPU Siemens S7-1200 1214C + Module SM1231 Analog',
            'Ứng dụng: Giám sát SCADA và điều khiển dây chuyền đóng gói tự động',
            'Đang thực hiện: Cầm tablet kiểm tra kết nối mạng truyền thông PROFINET'
          ],
          desc: 'Kỹ sư tự động hóa đang thao tác trên tablet SCADA để kiểm tra tín hiệu xung của tủ điện trước khi ký hợp đồng nhập số lượng lớn.'
        }}
      />

      {/* 2. Nữ Maker IoT đeo ba lô dạo quanh kệ ESP32-S3 */}
      <DioramaCharacter
        initialPos={[-4.5, 0, 1.8]}
        jacketColor="#6366f1" // Tím Indigo hiện đại
        pantsColor="#334155"
        hairColor="#451a03"
        hasBag={true}
        speed={0.9}
        waypoints={[
          [-5.0, 0, 2.2, 5.0], // Ngắm nghía kệ ESP32-S3
          [-3.5, 0, 1.5, 3.0], // Tìm kiếm cảm biến môi trường
          [-4.5, 0, 0.5, 4.0], // Đọc tài liệu datasheet
          [-5.0, 0, 2.2, 5.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-maker',
          title: 'Thùy Linh - Kỹ Sư Thiết Kế Phần Cứng IoT',
          category: 'Maker & Nghiên Cứu R&D',
          price: 'Giỏ hàng: 1.250.000 đ',
          specs: [
            'Tìm kiếm: ESP32-S3 Dual Type-C N16R8 & Màn hình hiển thị tròn SPI',
            'Dự án: Thiết bị trạm quan trắc môi trường thông minh kết nối MQTT',
            'Nhận xét: "Linh kiện ở DungAutomation rất chuẩn, chân mạ vàng sáng bóng!"'
          ],
          desc: 'Nữ kỹ sư trẻ tài năng đang chọn bo mạch vi điều khiển thế hệ mới hỗ trợ Wi-Fi và Bluetooth để làm sản phẩm khởi nghiệp.'
        }}
      />

      {/* 3. Shipper xe điện giao hàng hỏa tốc DungAutomation Express */}
      <DioramaCharacter
        initialPos={[3.4, 0, 3.2]}
        jacketColor="#ea580c" // Cam thương hiệu DungAutomation
        pantsColor="#0f172a"
        hasHelmet={true}
        speed={1.2}
        waypoints={[
          [2.5, 0, 3.6, 2.0], // Nhận kiện hàng tại quầy
          [3.8, 0, 2.8, 4.0], // Đứng kiểm tra đơn cạnh xe máy điện
          [4.5, 0, 1.5, 1.5], // Ra vỉa hè
          [2.5, 0, 3.6, 2.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-shipper',
          title: 'Tuấn Anh - Đội Giao Vận DungAutomation Express',
          category: 'Giao Hàng Hỏa Tốc 1h',
          price: 'Đã hoàn thành: 36 đơn hôm nay',
          specs: [
            'Đơn hàng: Module PLC & Cảm biến tiệm cận đi KCN Thăng Long',
            'Phương tiện: Xe máy điện chuyên dụng trang bị thùng cách nhiệt chống sốc',
            'Cam kết: Giao hàng hỏa tốc trong 60 phút nội thành Hà Nội'
          ],
          desc: 'Shipper chuyên nghiệp túc trực sẵn sàng chuyển linh kiện khẩn cấp đến các nhà máy gặp sự cố cần thay thế ngay.'
        }}
      />

      {/* 4. Du khách dạo bước trên vỉa hè ngắm robot 6 trục qua kính */}
      <DioramaCharacter
        initialPos={[5.5, 0, -2.5]}
        jacketColor="#be185d" // Áo khoác măng tô hồng cánh sen sang trọng
        pantsColor="#18181b"
        hairColor="#0a0a0a"
        speed={0.7}
        waypoints={[
          [5.5, 0, -2.5, 1.0], // Đi trên vỉa hè
          [4.5, 0, -1.5, 5.0], // Dừng lại ngắm cánh tay robot gắp chip
          [5.0, 0, 1.8, 3.0],  // Ngắm bảng hiệu đèn neon
          [5.5, 0, 4.5, 1.0],
          [5.5, 0, -2.5, 1.0]
        ]}
        onSelect={onSelect}
        info={{
          id: 'customer-passerby',
          title: 'Khách Tham Quan Công Nghệ Phố Cổ Hà Nội',
          category: 'Người Dạo Phố',
          price: 'Trải nghiệm thị giác 3D',
          specs: [
            'Hành động: Trầm trồ trước cánh tay robot 6 trục gắp chip công nghiệp',
            'Địa điểm: Vỉa hè lát đá hoa cương trước showroom DungAutomation',
            'Đánh giá: "Cửa hàng tự động hóa thiết kế đẳng cấp như bảo tàng công nghệ!"'
          ],
          desc: 'Người qua đường bị thu hút bởi ánh sáng neon ấm áp và hoạt động mượt mà của cánh tay robot tự động.'
        }}
      />
    </group>
  )
}

export default Customers
