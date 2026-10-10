import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Mô hình Dây Chuyền Băng Tải Phân Loại Sản Phẩm Tự Động Mini
 * Tích hợp băng tải chuyển động thực tế, cảm biến quang phát tia laser,
 * xilanh khí nén SMC phân loại phôi, tháp đèn tín hiệu 3 tầng và điều khiển PLC.
 */
export function MiniConveyorDept({ onSelect }) {
  const roller1Ref = useRef()
  const roller2Ref = useRef()
  const cylinderPistonRef = useRef()
  const towerGreenLedRef = useRef()
  const sensorLedRef = useRef()

  // Phôi sản phẩm di chuyển
  const workpiece1Ref = useRef() // Phôi nhôm (Good)
  const workpiece2Ref = useRef() // Phôi đỏ (Reject - bị gạt)
  const workpiece3Ref = useRef() // Phôi xanh (Good)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // 1. Con lăn rulo 2 đầu băng tải xoay liên tục
    if (roller1Ref.current) roller1Ref.current.rotation.x = t * 6
    if (roller2Ref.current) roller2Ref.current.rotation.x = t * 6

    // 2. Chuyển động của các phôi sản phẩm dọc băng tải (từ x = -1.2 đến 1.2)
    const speed = 0.85

    // Phôi 1: Phôi nhôm bạc (chạy thẳng từ đầu đến cuối băng tải)
    if (workpiece1Ref.current) {
      const pos1 = ((t * speed) % 3.0) - 1.4
      workpiece1Ref.current.position.x = pos1
      // Khi đến cuối thì rơi vào máng thành phẩm
      if (pos1 > 1.2) {
        workpiece1Ref.current.position.y = 1.35 - (pos1 - 1.2) * 1.5
      } else {
        workpiece1Ref.current.position.y = 1.35
      }
    }

    // Phôi 2: Phôi nhựa đỏ (bị xilanh khí nén gạt rơi vào máng Reject tại x = 0.2)
    if (workpiece2Ref.current) {
      const cycle2 = (t * speed + 1.0) % 3.0
      const pos2 = cycle2 - 1.4
      workpiece2Ref.current.position.x = pos2

      // Vị trí trạm gạt khí nén tại x = 0.2
      if (pos2 > 0.2 && pos2 < 0.8) {
        // Bị gạt lệch sang trục Z (vào máng reject)
        const pusherOffset = Math.min((pos2 - 0.2) * 1.8, 0.45)
        workpiece2Ref.current.position.z = pusherOffset
        workpiece2Ref.current.position.y = 1.35 - (pos2 - 0.2) * 0.7
      } else if (pos2 >= 0.8) {
        workpiece2Ref.current.position.z = 0.45
        workpiece2Ref.current.position.y = 0.95
      } else {
        workpiece2Ref.current.position.z = 0
        workpiece2Ref.current.position.y = 1.35
      }
    }

    // Phôi 3: Phôi nhựa xanh (Good)
    if (workpiece3Ref.current) {
      const pos3 = ((t * speed + 2.0) % 3.0) - 1.4
      workpiece3Ref.current.position.x = pos3
      if (pos3 > 1.2) {
        workpiece3Ref.current.position.y = 1.35 - (pos3 - 1.2) * 1.5
      } else {
        workpiece3Ref.current.position.y = 1.35
      }
    }

    // 3. Xilanh khí nén SMC thụt thò khi phôi đỏ đi qua
    if (cylinderPistonRef.current) {
      const cyclePiston = (t * speed + 1.0) % 3.0
      // Đẩy ra khi cycle nằm trong khoảng 1.55 đến 1.85 (tương ứng pos2 quanh 0.2)
      if (cyclePiston > 1.55 && cyclePiston < 1.85) {
        const stroke = Math.sin((cyclePiston - 1.55) * (Math.PI / 0.3)) * 0.25
        cylinderPistonRef.current.position.z = -0.22 + stroke
      } else {
        cylinderPistonRef.current.position.z = -0.22
      }
    }

    // 4. Đèn cảm biến quang nháy đỏ khi phôi đi qua trạm cảm biến (tại x = -0.2)
    if (sensorLedRef.current) {
      const isDetected = Math.sin(t * speed * 2 * Math.PI) > 0.3
      sensorLedRef.current.material.color.set(isDetected ? '#ef4444' : '#22c55e')
    }

    // 5. Tháp đèn tín hiệu 3 tầng (Xanh lá chớp nháy chế độ RUN)
    if (towerGreenLedRef.current) {
      towerGreenLedRef.current.material.color.set(
        Math.sin(t * 3) > 0 ? '#22c55e' : '#15803d'
      )
    }
  })

  return (
    <group
      position={[-1.6, 0, -1.8]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.({
          id: 'mini_conveyor',
          title: 'Dây Chuyền Băng Tải Phân Loại Sản Phẩm Tự Động Mini',
          category: 'Industrial Automation Demo',
          price: 'Mô hình thực nghiệm: 24.500.000 đ',
          specs: [
            'Băng tải cao su PVC chống trượt, động cơ DC 24V 60W điều tốc PWM tích hợp Encoder quang học',
            'Cảm biến quang Omron E3Z-D61 nhận diện phôi và Cảm biến tiệm cận kim loại Omron E2E',
            'Cụm xilanh khí nén SMC dẫn hướng MGPM16-30Z và van điện từ Festo phân loại phôi lỗi Reject',
            'Tháp đèn tín hiệu 3 tầng PATLITE (Red/Yellow/Green) hiển thị trạng thái vận hành',
            'Lập trình điều khiển phối hợp PLC Siemens S7-1200 kết nối truyền thông công nghiệp'
          ],
          desc: 'Mô hình dây chuyền phân loại tự động hóa mini kích thước thu nhỏ mô phỏng thực tế quá trình sản xuất nhà máy thông minh, phục vụ đào tạo R&D và kiểm thử thuật toán PLC.'
        })
      }}
      cursor="pointer"
    >
      {/* ================= 1. KHUNG BÀN NHÔM ĐỊNH HÌNH 40X40 ================= */}
      {/* 4 Chân nhôm định hình */}
      {[-1.4, 1.4].map((lx, ix) =>
        [-0.45, 0.45].map((lz, iz) => (
          <group key={`${ix}-${iz}`} position={[lx, 0.55, lz]}>
            <mesh castShadow>
              <boxGeometry args={[0.08, 1.1, 0.08]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Bánh xe công nghiệp có khóa màu cam */}
            <mesh position={[0, -0.55, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.04, 12]} />
              <meshStandardMaterial color="#ea580c" roughness={0.4} />
            </mesh>
          </group>
        ))
      )}

      {/* Thanh giằng nhôm định hình ngang dọc */}
      {[-0.45, 0.45].map((lz, iz) => (
        <mesh key={`tie-x-${iz}`} position={[0, 0.25, lz]}>
          <boxGeometry args={[2.8, 0.06, 0.06]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {[-1.4, 1.4].map((lx, ix) => (
        <mesh key={`tie-z-${ix}`} position={[lx, 0.25, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.9]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Mặt bàn gá tấm Inox phay xước sáng bóng */}
      <mesh position={[0, 1.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.04, 1.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* ================= 2. KHUNG SƯỜN BĂNG TẢI & DÂY ĐAI CAO SU ================= */}
      <group position={[0, 1.25, 0]}>
        {/* Sườn thép chấn 2 bên băng tải sơn xám tĩnh điện */}
        <mesh position={[0, 0.06, -0.22]} castShadow>
          <boxGeometry args={[2.8, 0.12, 0.04]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0.22]} castShadow>
          <boxGeometry args={[2.8, 0.12, 0.04]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Dây đai băng tải cao su PVC đen nhám chống tĩnh điện */}
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[2.7, 0.02, 0.4]} />
          <meshStandardMaterial color="#18181b" roughness={0.85} />
        </mesh>

        {/* 2 Con lăn Rulo nhôm ở 2 đầu băng tải */}
        <mesh ref={roller1Ref} position={[-1.35, 0.06, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.42, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh ref={roller2Ref} position={[1.35, 0.06, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.42, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Động cơ giảm tốc DC 24V gắn bên hông Rulo đầu vào */}
        <group position={[-1.4, 0.06, -0.32]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[0.12, 0.12, 0.08]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      </group>

      {/* ================= 3. CÁC PHÔI SẢN PHẨM DI CHUYỂN TRÊN BĂNG TẢI ================= */}
      {/* Phôi 1: Phôi nhôm khối vuông kim loại (Good) */}
      <mesh ref={workpiece1Ref} position={[-1.2, 1.35, 0]} castShadow>
        <boxGeometry args={[0.14, 0.12, 0.14]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Phôi 2: Phôi nhựa đỏ (Reject - bị xilanh gạt) */}
      <mesh ref={workpiece2Ref} position={[-0.4, 1.35, 0]} castShadow>
        <boxGeometry args={[0.13, 0.12, 0.13]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>

      {/* Phôi 3: Phôi nhựa xanh (Good) */}
      <mesh ref={workpiece3Ref} position={[0.6, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
        <meshStandardMaterial color="#10b981" roughness={0.4} />
      </mesh>

      {/* ================= 4. CẢM BIẾN QUANG PHÁT TIA LASER OMRON ================= */}
      <group position={[-0.2, 1.35, 0]}>
        {/* Thân cảm biến quang vuông đen gắn trên giá thép */}
        <mesh position={[0, 0.05, -0.28]} castShadow>
          <boxGeometry args={[0.05, 0.1, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {/* Đèn LED chỉ thị trạng thái cảm biến (Xanh -> Đỏ khi phát hiện phôi) */}
        <mesh ref={sensorLedRef} position={[0, 0.11, -0.28]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        {/* Tia laser đỏ mảnh chiếu ngang băng tải phát hiện vật */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.44, 8]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
        </mesh>

        {/* Gương phản xạ bên kia băng tải */}
        <mesh position={[0, 0.05, 0.24]}>
          <boxGeometry args={[0.04, 0.06, 0.02]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} />
        </mesh>
      </group>

      {/* ================= 5. XILANH KHÍ NÉN SMC PHÂN LOẠI PHÔI (PUSHER) ================= */}
      <group position={[0.2, 1.35, 0]}>
        {/* Thân xilanh nhôm cố định bên hông */}
        <mesh position={[0, 0.05, -0.42]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.28]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Piston trục thép thụt thò gạt phôi */}
        <group ref={cylinderPistonRef} position={[0, 0.05, -0.22]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 12]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Đầu gạt cao su bản dẹp */}
          <mesh position={[0, 0, 0.12]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.03]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>

        {/* Máng trượt phôi lỗi (Reject Chute) bên hông đối diện */}
        <group position={[0, -0.05, 0.38]} rotation={[0.45, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.02, 0.4]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Khay đựng phôi lỗi màu đỏ bên dưới gầm */}
        <mesh position={[0, -0.35, 0.5]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.25]} />
          <meshStandardMaterial color="#ef4444" roughness={0.5} />
        </mesh>
      </group>

      {/* Máng hứng thành phẩm đạt ở cuối băng tải (Good Parts Bin) */}
      <mesh position={[1.45, 1.05, 0]} castShadow>
        <boxGeometry args={[0.28, 0.25, 0.38]} />
        <meshStandardMaterial color="#10b981" roughness={0.5} />
      </mesh>

      {/* ================= 6. ĐÈN THÁP TÍN HIỆU 3 TẦNG (SIGNAL TOWER LIGHT) ================= */}
      <group position={[-1.3, 1.15, 0.4]}>
        {/* Cột trụ nhôm */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
        {/* Tầng Xanh lá (Auto Run) */}
        <mesh ref={towerGreenLedRef} position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        {/* Tầng Vàng (Standby) */}
        <mesh position={[0, 0.61, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
          <meshStandardMaterial color="#eab308" roughness={0.3} />
        </mesh>
        {/* Tầng Đỏ (Alarm) */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
        {/* Nắp chụp đỉnh đen */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.02, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* ================= 7. HỘP NÚT NHẤN ĐIỀU KHIỂN TẠI CHỖ ================= */}
      <group position={[-0.8, 1.17, 0.38]}>
        {/* Vỏ hộp nhựa ABS vàng */}
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.08, 0.12]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
        {/* Nút Start xanh */}
        <mesh position={[-0.08, 0.05, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        {/* Nút Stop đen */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        {/* Nút E-Stop nấm đỏ */}
        <mesh position={[0.08, 0.06, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.03, 12]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* ================= 8. CỤM VAN KHÍ NÉN FESTO & BỘ LỌC KHÍ SMC ================= */}
      <group position={[0.8, 0.7, 0.4]}>
        {/* Bộ lọc khí điều áp SMC có đồng hồ áp tròn */}
        <mesh position={[-0.2, 0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.25, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[-0.2, 0.3, 0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Cụm van điện từ Solenoid Festo */}
        <mesh position={[0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.12]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} />
        </mesh>
      </group>

      {/* Đèn downlight chiếu rọi mặt băng tải */}
      <pointLight position={[0, 2.5, 0]} color="#ffffff" intensity={1.5} distance={5} decay={2} />
    </group>
  )
}

export default MiniConveyorDept
