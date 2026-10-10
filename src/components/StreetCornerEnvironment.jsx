import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Quang Cảnh Góc Phố Sầm Uất Bao Quanh Showroom (Street Corner Environment)
 * - Đồ họa tươi sáng, chuẩn phong cách Low-Poly Isometric City rực rỡ như ảnh tham khảo
 * - KHÔNG BỊ TỐI ĐEN CÔNG NGHỆ, ngập tràn ánh nắng ấm áp buổi sáng
 * - Vỉa hè lát đá sáng màu rộng rãi, thoáng đãng, KHÔNG BỊ CÂY CỐI CHE KHUẤT MẶT TIỀN SHOWROOM
 * - Dãy nhà phố pastel xinh xắn phía bên kia đường (vàng chanh, cam đất, xanh dương, trắng kem)
 * - Lòng đường Asphalt xám sáng với vạch người đi bộ (Zebra crossings) & xe cộ, xe máy scooter lưu thông
 * - Mây trắng bồng bềnh và đồi xanh xa xa trên nền trời xanh mát
 */
export default function StreetCornerEnvironment({ season = 'spring', isNight = false, onSelect }) {
  const cloudsRef = useRef()
  const movingCarRef = useRef()
  const movingCar2Ref = useRef()
  const movingScooterRef = useRef()

  // Animation di chuyển của xe cộ trên đường và mây trời trôi
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    // Mây trời trôi chầm chậm trên cao
    if (cloudsRef.current) {
      cloudsRef.current.position.x = ((t * 0.8) % 80) - 40
    }

    // Xe 1: Ô tô đỏ chạy dọc trục đường phía trước (Z = 14.0, X từ -24 đến 24)
    if (movingCarRef.current) {
      const cycle = (t * 5.5) % 48
      movingCarRef.current.position.x = -24 + cycle
      movingCarRef.current.position.z = 13.8
      movingCarRef.current.rotation.y = Math.PI / 2
    }

    // Xe 2: Ô tô vàng taxi chạy dọc trục đường bên phải (X = 15.6, Z từ -24 đến 24)
    if (movingCar2Ref.current) {
      const cycle2 = (t * 4.8) % 48
      movingCar2Ref.current.position.z = -24 + cycle2
      movingCar2Ref.current.position.x = 15.6
      movingCar2Ref.current.rotation.y = 0
    }

    // Xe 3: Xe máy Scooter giao hàng hỏa tốc chạy trên đường trước (Z = 15.0, X từ 24 về -24)
    if (movingScooterRef.current) {
      const cycle3 = (t * 6.2) % 48
      movingScooterRef.current.position.x = 24 - cycle3
      movingScooterRef.current.position.z = 15.2
      movingScooterRef.current.rotation.y = -Math.PI / 2
    }
  })

  // Bảng màu cây đa sắc tươi tắn theo 4 mùa
  const foliageColors = useMemo(() => {
    switch (season) {
      case 'winter':
        return {
          primary: '#e2e8f0', // Trắng tuyết phủ
          secondary: '#0f766e', // Tùng bách xanh
          accent: '#cbd5e1',
          pink: '#f1f5f9'
        }
      case 'autumn':
        return {
          primary: '#ea580c', // Cam rực
          secondary: '#f59e0b', // Vàng hổ phách
          accent: '#d97706',
          pink: '#f97316'
        }
      case 'summer':
        return {
          primary: '#15803d', // Xanh lục đậm mát
          secondary: '#22c55e', // Xanh lá non
          accent: '#84cc16', // Vàng chanh
          pink: '#16a34a'
        }
      case 'spring':
      default:
        return {
          primary: '#16a34a', // Xanh mướt tươi
          secondary: '#84cc16', // Lục non
          accent: '#facc15', // Vàng tươi
          pink: '#f472b6' // Hoa đào / ban hồng
        }
    }
  }, [season])

  return (
    <group position={[0, 0, 0]}>
      {/* ================= 1. MÂY TRẮNG BỒNG BỀNH & BẦU TRỜI NẮNG ẤM (LOW-POLY CLOUDS) ================= */}
      <group ref={cloudsRef} position={[0, 24, 0]}>
        {[-22, -6, 12, 28].map((cx, ci) => (
          <group key={`cloud-${ci}`} position={[cx, (ci % 2) * 2, -10 + (ci % 3) * 8]}>
            <mesh>
              <dodecahedronGeometry args={[2.5, 1]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[2.0, -0.4, 0]}>
              <dodecahedronGeometry args={[1.8, 1]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[-1.8, -0.5, 0.4]}>
              <dodecahedronGeometry args={[1.6, 1]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 2. ĐỒI XANH DỊU MÁT XA XA NGOẠI Ô (DISTANT HILLS) ================= */}
      <group position={[0, -2, -35]}>
        {[-32, -12, 10, 30].map((hx, hi) => (
          <mesh key={`hill-${hi}`} position={[hx, 4 + (hi % 2) * 3, 0]}>
            <sphereGeometry args={[16 + (hi % 2) * 4, 16, 16]} />
            <meshStandardMaterial color={hi % 2 === 0 ? '#86efac' : '#a7f3d0'} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* ================= 3. VỈA HÈ LÁT ĐÁ SÁNG MÀU THÔNG THOÁNG (BRIGHT CLEAN SIDEWALKS) ================= */}
      {/* Vỉa hè phía trước showroom (Z: 7.5 đến 11.2, X: -17.5 đến 13.5) */}
      <mesh position={[-2.0, 0.1, 9.35]} receiveShadow>
        <boxGeometry args={[31.0, 0.12, 3.7]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Vỉa hè bên hông phải showroom (X: 9.5 đến 13.5, Z: -17.5 đến 7.5) */}
      <mesh position={[11.5, 0.1, -5.0]} receiveShadow>
        <boxGeometry args={[4.0, 0.12, 25.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Vỉa hè góc ngã tư (X: 9.5 đến 13.5, Z: 7.5 đến 11.2) */}
      <mesh position={[11.5, 0.1, 9.35]} receiveShadow>
        <boxGeometry args={[4.0, 0.12, 3.7]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Gờ đá bó vỉa hè (Granite Curbs) */}
      <mesh position={[-2.0, 0.12, 11.25]} receiveShadow>
        <boxGeometry args={[31.2, 0.16, 0.16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>
      <mesh position={[13.55, 0.12, -2.0]} receiveShadow>
        <boxGeometry args={[0.16, 0.16, 26.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* ================= 4. LÒNG ĐƯỜNG NHỰA ASPHALT XÁM SÁNG NGÃ TƯ (BRIGHT ASPHALT ROADWAY) ================= */}
      {/* Nhánh đường trước mặt (East-West Roadway: Z từ 11.3 đến 17.5) */}
      <group position={[0, 0, 14.4]}>
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[35.8, 0.04, 6.2]} />
          <meshStandardMaterial color="#556173" roughness={0.88} />
        </mesh>
        {/* Vạch tim đường đứt đoạn màu vàng tươi */}
        {[-15, -10, -5, 0, 5, 10].map((lx, li) => (
          <mesh key={`ew-lane-${li}`} position={[lx, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.5, 0.22]} />
            <meshStandardMaterial color="#fde047" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Nhánh đường bên phải (North-South Roadway: X từ 13.6 đến 17.5) */}
      <group position={[15.6, 0, 0]}>
        <mesh position={[0, 0.04, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.04, 35.8]} />
          <meshStandardMaterial color="#556173" roughness={0.88} />
        </mesh>
        {/* Vạch tim đường đứt đoạn màu vàng tươi */}
        {[-15, -10, -5, 0, 5, 10].map((lz, li) => (
          <mesh key={`ns-lane-${li}`} position={[0, 0.065, lz]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[2.5, 0.22]} />
            <meshStandardMaterial color="#fde047" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ================= 5. VẠCH KẺ ĐƯỜNG NGƯỜI ĐI BỘ TRẮNG SÁNG (ZEBRA CROSSINGS) ================= */}
      {/* Vạch sang đường phía trước (Front Zebra Crossing) */}
      <group position={[6.0, 0.065, 14.4]}>
        {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((zz, zi) => (
          <mesh key={`fcross-${zi}`} position={[0, 0, zz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.2, 0.52]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        ))}
        {/* Vạch dừng chờ đèn (Stop Line) */}
        <mesh position={[-2.2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.32, 5.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      {/* Vạch sang đường bên phải (Side Zebra Crossing) */}
      <group position={[15.6, 0.065, 4.0]}>
        {[-1.6, -0.8, 0, 0.8, 1.6].map((xx, xi) => (
          <mesh key={`scross-${xi}`} position={[xx, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.52, 3.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 0.32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      </group>

      {/* ================= 6. DÃY NHÀ PHỐ PASTEL ĐỐI DIỆN BÊN KIA ĐƯỜNG (COLORFUL TOWN BUILDINGS) ================= */}
      {/* 6.1 Tòa nhà vàng chanh 2 tầng (Yellow Townhouse with Awning) */}
      <group position={[6.5, 0, 21.5]}>
        {/* Khối nhà chính */}
        <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 7.2, 5.2]} />
          <meshStandardMaterial color="#fde047" roughness={0.5} />
        </mesh>
        {/* Mái vòm lan can tầng thượng */}
        <mesh position={[0, 7.4, 0]} castShadow>
          <boxGeometry args={[7.0, 0.4, 5.4]} />
          <meshStandardMaterial color="#fef08a" roughness={0.4} />
        </mesh>
        {/* Bồn cây trên sân thượng */}
        <mesh position={[0, 7.8, 2.2]}>
          <boxGeometry args={[5.5, 0.4, 0.5]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        {/* Mái hiên sọc xanh biển tầng trệt (Striped Awning) */}
        <mesh position={[0, 3.2, 2.8]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[5.8, 0.12, 1.2]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.4} />
        </mesh>
        {/* Các ô cửa sổ kính sáng màu viền trắng */}
        {[-1.8, 1.8].map((wx, wi) => (
          <group key={`yw-win-${wi}`} position={[wx, 5.2, 2.62]}>
            <mesh>
              <boxGeometry args={[1.5, 1.8, 0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.2, 1.5]} />
              <meshStandardMaterial color="#bae6fd" roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6.2 Tòa nhà xanh dương pastel 3 tầng (Sky Blue 3-Story Boutique) */}
      <group position={[-2.2, 0, 21.5]}>
        <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 9.6, 5.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Khung viền chỉ trắng quanh ban công */}
        <mesh position={[0, 9.8, 0]} castShadow>
          <boxGeometry args={[6.4, 0.4, 5.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
        {/* Cửa sổ 3 tầng */}
        {[3.0, 5.8, 8.2].map((wy, wj) =>
          [-1.5, 1.5].map((wx, wi) => (
            <group key={`bl-win-${wj}-${wi}`} position={[wx, wy, 2.62]}>
              <mesh>
                <boxGeometry args={[1.4, 1.6, 0.08]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[1.1, 1.3]} />
                <meshStandardMaterial color="#e0f2fe" roughness={0.1} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* 6.3 Tòa nhà cam đất ấm áp 2 tầng (Terracotta Orange Bakery) */}
      <group position={[-10.2, 0, 21.5]}>
        <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.4, 6.8, 5.2]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} />
        </mesh>
        {/* Mái hiên trắng kem */}
        <mesh position={[0, 3.0, 2.8]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[5.6, 0.12, 1.2]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.4} />
        </mesh>
        {/* Cửa sổ tầng 2 */}
        {[-1.6, 1.6].map((wx, wi) => (
          <group key={`or-win-${wi}`} position={[wx, 5.0, 2.62]}>
            <mesh>
              <boxGeometry args={[1.4, 1.6, 0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.1, 1.3]} />
              <meshStandardMaterial color="#bae6fd" roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6.4 Dãy nhà bên kia đường nhánh phải (Side Street Townhouses) */}
      {/* Nhà trắng kem có ban công xanh (Mint Cream Apartment) */}
      <group position={[21.5, 0, 5.0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 8.0, 5.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* Cửa sổ viền cam đất */}
        {[-1.8, 1.8].map((wx, wi) => (
          <group key={`mc-win-${wi}`} position={[wx, 5.2, 2.62]}>
            <mesh>
              <boxGeometry args={[1.5, 1.8, 0.08]} />
              <meshStandardMaterial color="#ea580c" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.2, 1.5]} />
              <meshStandardMaterial color="#e0f2fe" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Nhà màu cam mơ 3 tầng bên phải (Apricot Orange House) */}
      <group position={[21.5, 0, -3.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.2, 9.6, 5.2]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.2, 2.8]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[5.6, 0.12, 1.2]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>

      {/* ================= 7. HÀNG CÂY TRANG TRÍ (ĐÃ LOẠI BỎ CÂY CHẮN MẶT TIỀN SHOWROOM) ================= */}
      {/* 7.1 Cây ở góc công viên bên trái xa (Far Front-Left Park Tree) - Không chắn shop */}
      <group position={[-15.5, 0.1, 9.5]}>
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 3.2, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.8, 0]} castShadow>
          <dodecahedronGeometry args={[1.6, 1]} />
          <meshStandardMaterial color={foliageColors.pink} roughness={0.65} />
        </mesh>
        <mesh position={[0.4, 4.4, 0.2]} castShadow>
          <dodecahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color={foliageColors.secondary} roughness={0.6} />
        </mesh>
      </group>

      {/* 7.2 Cây bên kia đường phía trước (Across Street Tree 1) */}
      <group position={[1.5, 0.1, 18.5]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.25, 3.0, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={foliageColors.primary} roughness={0.65} />
        </mesh>
      </group>

      {/* 7.3 Cây bên kia đường nhánh phải (Across Side Street Tree 2) */}
      <group position={[18.5, 0.1, 1.5]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.25, 3.0, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={foliageColors.accent} roughness={0.65} />
        </mesh>
      </group>

      {/* 7.4 Cây góc sau phải xa (Far Back-Right Tree) */}
      <group position={[12.0, 0.1, -14.0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.25, 3.0, 10]} />
          <meshStandardMaterial color="#3e2723" roughness={0.9} />
        </mesh>
        <mesh position={[0, 3.5, 0]} castShadow>
          <dodecahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial color={foliageColors.primary} roughness={0.65} />
        </mesh>
      </group>

      {/* ================= 8. CỘT ĐÈN ĐƯỜNG CHỮ L TỐI GIẢN (ĐẶT GỌN GÀNG TRÊN GỜ BÓ VỈA) ================= */}
      {/* Cột đèn 1: Gờ bó vỉa góc ngã tư */}
      <group position={[13.2, 0.1, 10.8]} rotation={[0, -Math.PI / 4, 0]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 4.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.45, 4.75, 0]}>
          <boxGeometry args={[1.0, 0.08, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-0.85, 4.68, 0]}>
          <boxGeometry args={[0.26, 0.04, 0.14]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={isNight ? 2.8 : 0.8} />
        </mesh>
      </group>

      {/* Cột đèn 2: Gờ bó vỉa trước xa bên trái */}
      <group position={[-11.5, 0.1, 10.8]} rotation={[0, 0, 0]}>
        <mesh position={[0, 2.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 4.8, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.75, 0.45]}>
          <boxGeometry args={[0.08, 0.08, 1.0]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.68, 0.85]}>
          <boxGeometry args={[0.14, 0.04, 0.26]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={isNight ? 2.8 : 0.8} />
        </mesh>
      </group>

      {/* ================= 9. TIỆN ÍCH PHỐ (GHẾ BĂNG, THÙNG RÁC, BIỂN BÁO, CÀ PHÊ) ================= */}
      {/* Ghế băng gỗ đặt sát gờ vỉa hè trước */}
      <group position={[-5.0, 0.1, 9.8]} rotation={[0, 0, 0]}>
        <mesh position={[-0.7, 0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.7, 0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.08, 0.55]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} />
        </mesh>
      </group>

      {/* Thùng rác phân loại 2 ngăn góc phố */}
      <group position={[12.2, 0.1, 8.5]}>
        <mesh position={[-0.2, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.8, 16]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>
        <mesh position={[0.2, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.8, 16]} />
          <meshStandardMaterial color="#64748b" roughness={0.4} />
        </mesh>
      </group>

      {/* Trụ cứu hỏa đỏ */}
      <group position={[12.8, 0.1, 6.5]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.7, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>

      {/* Biển tên phố "Phố Tự Động Hóa" */}
      <group
        position={[10.5, 0.1, 8.0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.({
            id: 'street-sign',
            title: 'Phố Tự Động Hóa (Automation Street - Hà Nội)',
            category: 'Khu Phố Công Nghệ',
            price: 'Tọa độ: Hoàn Kiếm / Cầu Giấy, Hà Nội',
            specs: [
              'Con phố tập trung các showroom linh kiện tự động hoá và Maker Lab hàng đầu',
              'Không gian giao thoa giữa nét văn hóa Hà Nội và công nghệ tương lai',
              'Đèn đường LED thông minh điều chỉnh nhiệt độ màu theo 4 Mùa trong năm'
            ],
            desc: 'Góc phố công nghệ sầm uất, nơi các kỹ sư, sinh viên và maker khắp cả nước tìm đến để giao lưu đồ án và mua sắm linh kiện PLC, Dateco, ESP32 chính hãng.'
          })
        }}
        cursor="pointer"
      >
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 3.6, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <boxGeometry args={[1.5, 0.42, 0.07]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
      </group>

      {/* ================= 10. PHƯƠNG TIỆN ĐÔ THỊ ĐI LẠI SINH ĐỘNG (VEHICLES LIKE IMAGE 2) ================= */}
      {/* 10.1 Xe Đỏ Sedan chạy trên đường trước mặt */}
      <group ref={movingCarRef} position={[0, 0.08, 13.8]}>
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.58, 2.4]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.85, -0.15]} castShadow>
          <boxGeometry args={[1.25, 0.48, 1.4]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.1} transparent opacity={0.85} />
        </mesh>
        {/* 4 Bánh xe */}
        {[-0.75, 0.75].map((bx, bi) =>
          [-0.75, 0.75].map((bz, bj) => (
            <mesh key={`redw-${bi}-${bj}`} position={[bx, 0.22, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.22, 0.22, 0.14, 16]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 10.2 Xe Taxi Vàng chạy trên đường bên phải */}
      <group ref={movingCar2Ref} position={[15.6, 0.08, 0]}>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.45, 0.62, 2.5]} />
          <meshStandardMaterial color="#facc15" roughness={0.25} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.9, -0.1]} castShadow>
          <boxGeometry args={[1.3, 0.5, 1.5]} />
          <meshStandardMaterial color="#bae6fd" roughness={0.1} transparent opacity={0.85} />
        </mesh>
        {/* Biển TAXI */}
        <mesh position={[0, 1.25, -0.1]}>
          <boxGeometry args={[0.45, 0.12, 0.18]} />
          <meshStandardMaterial color="#ffffff" emissive="#facc15" emissiveIntensity={1.2} />
        </mesh>
        {/* 4 Bánh xe */}
        {[-0.78, 0.78].map((bx, bi) =>
          [-0.8, 0.8].map((bz, bj) => (
            <mesh key={`taxiw-${bi}-${bj}`} position={[bx, 0.24, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.15, 16]} />
              <meshStandardMaterial color="#09090b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 10.3 Xe Máy Scooter Giao Hàng Hỏa Tốc Có Người Lái (Delivery Scooter With Rider) */}
      <group ref={movingScooterRef} position={[0, 0.08, 15.2]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.32, 0.5, 1.2]} />
          <meshStandardMaterial color="#ea580c" roughness={0.3} />
        </mesh>
        {/* 2 Bánh xe */}
        {[-0.42, 0.42].map((wz, wi) => (
          <mesh key={`scoot-w-${wi}`} position={[0, 0.2, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.09, 16]} />
            <meshStandardMaterial color="#09090b" roughness={0.8} />
          </mesh>
        ))}
        {/* Thùng giao hàng hỏa tốc */}
        <mesh position={[0, 0.7, -0.38]} castShadow>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
        {/* Người lái xe đội mũ bảo hiểm đỏ */}
        <mesh position={[0, 0.9, 0.05]} castShadow>
          <boxGeometry args={[0.28, 0.45, 0.22]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.28, 0.05]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}
