import React from 'react'

export default function CheckoutDept({ onSelect }) {

  return (
    <group position={[1.8, 0, 4.2]}>
      {/* ================= CHECKOUT COUNTER DESK ================= */}
      <group
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'checkout',
            title: 'Khu Thu Ngân & Đóng Gói Hoả Tốc DungAutomation',
            category: 'Logistics & Checkout',
            price: 'Doanh thu: 285.500.000 đ/tháng',
            specs: [
              'POS Dual Screen Cảm ứng & Máy quét mã vạch Honeywell 2D',
              'Kho đóng gói hộp carton bọc bóng khí ESD chống tĩnh điện',
              'Đối tác vận chuyển: GrabExpress, ViettelPost, ShopeeXpress',
              'Đội xe máy giao hàng hoả tốc nội thành Hà Nội trong 1-2h'
            ],
            desc: 'Quầy thanh toán và trung tâm xử lý đơn hàng công nghệ cao. Tất cả linh kiện PLC, Vi điều khiển đều được kiểm tra sóng xung trước khi đóng niêm phong hộp DungAutomation.'
          })
        }}
      >
        {/* Main walnut desk base */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.0, 0.9]} />
          <meshStandardMaterial color="#2d1d12" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Italian Calacatta White Marble Countertop */}
        <mesh position={[0, 1.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.06, 1.0]} />
          <meshStandardMaterial color="#f0ede6" roughness={0.15} metalness={0.05} />
        </mesh>

        {/* Counter front recessed LED accent strip */}
        <mesh position={[0, 0.1, 0.46]}>
          <boxGeometry args={[2.0, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#00f3ff"
            emissive="#00f3ff"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>

        {/* POS Cashier Main Screen */}
        <group position={[-0.4, 1.06, 0.1]} rotation={[0, 0.2, 0]}>
          {/* Base & Neck */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.16, 16]} />
            <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Monitor */}
          <mesh position={[0, 0.28, 0]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.28, 0.03]} />
            <meshStandardMaterial color="#111115" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Glowing display surface */}
          <mesh position={[0, 0.28, 0.017]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.38, 0.24]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        </group>

        {/* Customer Facing Screen */}
        <group position={[-0.4, 1.34, 0.04]} rotation={[0.2, Math.PI + 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.2, 0.02]} />
            <meshStandardMaterial color="#111115" />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.27, 0.17]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Barcode scanner gun on stand */}
        <group position={[0.4, 1.15, 0.1]}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.04, 0.14, 12]} />
            <meshStandardMaterial color="#ff6b00" roughness={0.4} />
          </mesh>
          <mesh position={[0.04, 0.09, 0]} rotation={[0, 0, 0.5]} castShadow>
            <boxGeometry args={[0.1, 0.05, 0.06]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Laser beam hint */}
          <mesh position={[0.1, 0.1, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#ff0044" />
          </mesh>
        </group>

        {/* Receipt Printer */}
        <group position={[0.7, 1.12, -0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.12, 0.22]} />
            <meshStandardMaterial color="#18181b" roughness={0.3} />
          </mesh>
          {/* Paper slip sticking out */}
          <mesh position={[0, 0.07, -0.02]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.1, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} />
          </mesh>
        </group>

        {/* Shopping Basket with Tiny Microcontrollers */}
        <group position={[0.8, 1.1, 0.25]}>
          {/* Red Wire Basket */}
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.12, 0.22]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} wireframe />
          </mesh>
          {/* Small boxed items inside */}
          <mesh position={[-0.05, 0.04, 0]} castShadow>
            <boxGeometry args={[0.08, 0.06, 0.12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0.06, 0.05, 0.02]} rotation={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.09, 0.05, 0.1]} />
            <meshStandardMaterial color="#16a34a" />
          </mesh>
        </group>

        {/* Stack of DungAutomation Shipping Cartons beside desk */}
        <group position={[-1.4, 0, 0.1]}>
          {/* Bottom large box */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.44, 0.55]} />
            <meshStandardMaterial color="#b47d48" roughness={0.8} />
          </mesh>
          {/* Branded Tape */}
          <mesh position={[0, 0.442, 0]}>
            <planeGeometry args={[0.1, 0.55]} />
            <meshStandardMaterial color="#ff7700" />
          </mesh>
          {/* Top smaller box rotated */}
          <mesh position={[0.04, 0.55, 0.02]} rotation={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.3, 0.42]} />
            <meshStandardMaterial color="#c68d59" roughness={0.8} />
          </mesh>
          {/* White shipping label sticker */}
          <mesh position={[0.04, 0.55, 0.233]} rotation={[0, 0.35, 0]}>
            <planeGeometry args={[0.12, 0.08]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ================= OUTDOOR SIDEWALK LOGISTICS ================= */}
      {/* DungAutomation Electric Courier Scooter */}
      <group
        position={[2.4, 0, 1.8]}
        rotation={[0, -0.6, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'courier-scooter',
            title: 'Xe Điện Giao Hàng Siêu Tốc DungAutomation Express',
            category: 'Đội Xe Vận Chuyển',
            price: 'Tốc độ: 55 km/h | Bán kính 20km',
            specs: [
              'Pin Lithium 72V 35Ah cho quãng đường 90km/lần sạc',
              'Thùng hàng giữ nhiệt 75L chống rung xóc, chống nước IP67',
              'Đèn pha LED ma trận công suất lớn soi sáng phố đêm Hà Nội',
              'Trang bị GPS giám sát lộ trình đơn hàng thời gian thực'
            ],
            desc: 'Phương tiện chuyên chở các linh kiện tự động hoá khẩn cấp (PLC, Cảm biến, Servo) đến các nhà máy tại KCN Thăng Long, Bắc Ninh, Nội Bài chỉ trong 60 phút.'
          })
        }}
      >
        {/* Main Chassis / Footrest */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.3, 0.12, 1.1]} />
          <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Front Fairing body */}
        <mesh position={[0, 0.48, 0.38]} rotation={[-0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.5, 0.3]} />
          <meshStandardMaterial color="#00e5ff" metalness={0.4} roughness={0.2} />
        </mesh>
        {/* LED Headlight */}
        <mesh position={[0, 0.6, 0.54]} rotation={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
        {/* Handlebars */}
        <mesh position={[0, 0.82, 0.32]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.65, 12]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Rubber Grips */}
        <mesh position={[-0.3, 0.82, 0.32]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>
        <mesh position={[0.3, 0.82, 0.32]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>
        {/* Comfy Seat */}
        <mesh position={[0, 0.45, -0.05]} castShadow>
          <boxGeometry args={[0.26, 0.1, 0.55]} />
          <meshStandardMaterial color="#262626" roughness={0.7} />
        </mesh>
        {/* Front Wheel */}
        <group position={[0, 0.2, 0.52]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.09, 24]} />
            <meshStandardMaterial color="#171717" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.095, 16]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
        {/* Rear Wheel */}
        <group position={[0, 0.2, -0.48]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.09, 24]} />
            <meshStandardMaterial color="#171717" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.095, 16]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
        {/* Big Yellow Insulated Courier Box */}
        <group position={[0, 0.65, -0.42]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.4, 0.42]} />
            <meshStandardMaterial color="#eab308" roughness={0.3} />
          </mesh>
          {/* Logo badge */}
          <mesh position={[0, 0, 0.212]}>
            <planeGeometry args={[0.32, 0.15]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Glowing neon green parcel strip */}
          <mesh position={[0, -0.15, 0.213]}>
            <planeGeometry args={[0.3, 0.02]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
        {/* Kickstand leaning on floor */}
        <mesh position={[-0.14, 0.1, 0]} rotation={[0, 0, -0.4]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.26, 8]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} />
        </mesh>
      </group>

      {/* ================= VINTAGE ARCHITECTURAL STREETLAMP ================= */}
      <group position={[3.6, 0, 0.8]}>
        {/* Cast iron tiered base */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.28, 0.3, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Tall slender pole */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.07, 3.5, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Ornate Capital ring */}
        <mesh position={[0, 3.65, 0]}>
          <cylinderGeometry args={[0.14, 0.06, 0.18, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glass Lantern Housing */}
        <mesh position={[0, 3.9, 0]}>
          <cylinderGeometry args={[0.2, 0.14, 0.4, 6]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.85}
            opacity={1}
            transparent
            roughness={0.1}
            ior={1.5}
          />
        </mesh>
        {/* Lantern Cap */}
        <mesh position={[0, 4.18, 0]} castShadow>
          <coneGeometry args={[0.26, 0.22, 6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Super warm glowing incandescent bulb */}
        <mesh position={[0, 3.9, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#ffbe53"
            emissive="#ff9800"
            emissiveIntensity={4.5}
            toneMapped={false}
          />
        </mesh>
        <pointLight
          position={[0, 3.8, 0]}
          color="#ffaa33"
          intensity={6}
          distance={8}
          decay={2}
          castShadow
        />
      </group>

      {/* ================= CONCRETE PLANTERS & LUSH FICUS PLANTS ================= */}
      <group position={[3.6, 0, -1.8]}>
        {/* Architectural Charcoal Concrete Planter Box */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.7, 1.8]} />
          <meshStandardMaterial color="#27272a" roughness={0.9} />
        </mesh>
        {/* Soil bed */}
        <mesh position={[0, 0.68, 0]}>
          <boxGeometry args={[0.52, 0.04, 1.72]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>
        {/* 3 Lush stylized Ficus Bushes */}
        {[-0.55, 0, 0.55].map((z, idx) => (
          <group key={idx} position={[0, 0.8, z]}>
            {/* Main stem */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.04, 0.45, 8]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
            {/* Foliage cluster */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <dodecahedronGeometry args={[0.32, 1]} />
              <meshStandardMaterial color={idx === 1 ? '#15803d' : '#16a34a'} roughness={0.6} />
            </mesh>
            <mesh position={[0.08, 0.42, 0.06]} castShadow>
              <dodecahedronGeometry args={[0.22, 1]} />
              <meshStandardMaterial color="#22c55e" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= OUTDOOR DIGITAL PROMO TOTEM ================= */}
      <group position={[0.2, 0, 5.2]} rotation={[0, -0.2, 0]}>
        {/* Totem base */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.2, 0.25]} />
          <meshStandardMaterial color="#18181b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Totem Pillar */}
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 1.7, 0.08]} />
          <meshStandardMaterial color="#09090b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glowing Totem Screen */}
        <mesh position={[0, 1.15, 0.045]}>
          <planeGeometry args={[0.48, 1.3]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#00e5ff"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
