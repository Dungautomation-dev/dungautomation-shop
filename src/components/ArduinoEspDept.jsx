import React, { useMemo } from 'react'
import * as THREE from 'three'

export function ArduinoEspDept({ onSelect }) {
  // Texture bo mạch Arduino Uno R3 xanh dương với đường mạch
  const arduinoTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 256
    cvs.height = 180
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#0284c7'
    ctx.fillRect(0, 0, 256, 180)

    // Đường mạch in màu trắng / mạ thiếc
    ctx.strokeStyle = '#e0f2fe'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(30, 40); ctx.lineTo(120, 40); ctx.lineTo(150, 80)
    ctx.moveTo(40, 140); ctx.lineTo(100, 140); ctx.lineTo(130, 110)
    ctx.stroke()

    // Chip chính ATmega328P DIP màu đen
    ctx.fillStyle = '#18181b'
    ctx.fillRect(80, 70, 110, 40)
    ctx.fillStyle = '#cbd5e1'
    ctx.font = 'bold 9px monospace'
    ctx.fillText('ATMEGA328P-PU', 95, 94)

    // Chữ ARDUINO UNO
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText('ARDUINO UNO', 20, 25)

    // Dãy chân Pin Headers đen
    ctx.fillStyle = '#09090b'
    ctx.fillRect(15, 160, 226, 14)
    ctx.fillRect(50, 6, 191, 14)

    return new THREE.CanvasTexture(cvs)
  }, [])

  // Texture ESP32-S3 mặt đen chân vàng
  const espTexture = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 256
    cvs.height = 180
    const ctx = cvs.getContext('2d')

    ctx.fillStyle = '#18181b'
    ctx.fillRect(0, 0, 256, 180)

    // Shield kim loại màu bạc có logo ESPRESSIF
    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(60, 40, 136, 100)
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 13px sans-serif'
    ctx.fillText('ESPRESSIF', 88, 75)
    ctx.font = 'bold 11px monospace'
    ctx.fillText('ESP32-S3-WROOM-1', 72, 100)
    ctx.font = '9px monospace'
    ctx.fillText('Wi-Fi 2.4G & BLE 5.0', 78, 120)

    // Hàng chân Pin mạ vàng 2 bên mép
    ctx.fillStyle = '#eab308'
    for (let y = 15; y < 165; y += 12) {
      ctx.fillRect(8, y, 14, 6)
      ctx.fillRect(234, y, 14, 6)
    }

    return new THREE.CanvasTexture(cvs)
  }, [])

  return (
    <group
      position={[-6.2, 0, 2.4]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.('arduino_esp')
      }}
      cursor="pointer"
    >
      {/* ================= TỦ KÍNH TRƯNG BÀY CAO CẤP (GLASS SHOWCASE VITRINE) ================= */}
      {/* Khung chân đế thép hộp đen nhám */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.9, 1.6]} />
        <meshStandardMaterial color="#181e28" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* 4 Cột góc inox thanh mảnh */}
      {[-2.1, 2.1].map((cx, i) =>
        [-0.7, 0.7].map((cz, j) => (
          <mesh key={`${i}-${j}`} position={[cx, 2.3, cz]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 2.8, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
          </mesh>
        ))
      )}

      {/* Vỏ kính cường lực trong suốt 4 mặt */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[4.3, 2.7, 1.5]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Nắp đỉnh tủ trưng bày bằng nhôm phay xước */}
      <mesh position={[0, 3.7, 0]} castShadow>
        <boxGeometry args={[4.4, 0.1, 1.6]} />
        <meshStandardMaterial color="#181e28" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= 2 TẦNG KỆ KÍNH BÊN TRONG ================= */}
      {[1.6, 2.7].map((yShelf, sIdx) => (
        <group key={sIdx} position={[0, yShelf, 0]}>
          {/* Tấm kính kệ đỡ */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[4.1, 0.04, 1.35]} />
            <meshPhysicalMaterial
              color="#e0f2fe"
              transmission={0.88}
              transparent
              opacity={1}
              roughness={0.1}
            />
          </mesh>

          {/* Dải LED chiếu sáng hắt viền kính */}
          <mesh position={[0, -0.03, 0.64]}>
            <boxGeometry args={[4.0, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#00f3ff"
              emissive="#00f3ff"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>

          {/* CÁC BOARD MẠCH VI ĐIỀU KHIỂN ĐẶT TRÊN KỆ */}
          {[-1.3, -0.45, 0.45, 1.3].map((bx, bIdx) => {
            const isEsp = (bIdx % 2 === 1)

            return (
              <group key={bIdx} position={[bx, 0.04, (sIdx === 0 ? 0.1 : -0.1)]} rotation={[0, 0.15, 0]}>
                {/* Giá đỡ mica nghiêng 15 độ cho sản phẩm */}
                <mesh position={[0, 0.05, 0]} rotation={[-0.25, 0, 0]} castShadow>
                  <boxGeometry args={[0.7, 0.02, 0.5]} />
                  <meshStandardMaterial
                    map={isEsp ? espTexture : arduinoTexture}
                    roughness={0.3}
                    metalness={0.2}
                  />
                </mesh>

                {/* Đầu cắm kết nối USB kim loại */}
                <mesh position={[0, 0.1, -0.22]} rotation={[-0.25, 0, 0]} castShadow>
                  <boxGeometry args={[0.16, 0.08, 0.14]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      {/* Đèn downlight rọi từ đỉnh tủ kính */}
      <pointLight position={[0, 3.5, 0]} color="#ffffff" intensity={2.0} distance={4} decay={2} />
    </group>
  )
}

export default ArduinoEspDept
