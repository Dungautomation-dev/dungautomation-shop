import React, { useMemo } from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function LightingAndPostFx({
  isNightMode = false,
  season = 'spring',
  bloomIntensity = 0.6,
  lightBrightness = 0.95
}) {
  // Màu sắc ánh sáng thay đổi theo 4 Mùa
  const { sunColor, skyColor, envPreset } = useMemo(() => {
    switch (season) {
      case 'winter':
        return {
          sunColor: isNightMode ? '#38bdf8' : '#e0f2fe',
          skyColor: '#bae6fd',
          envPreset: isNightMode ? 'night' : 'apartment'
        }
      case 'autumn':
        return {
          sunColor: isNightMode ? '#ea580c' : '#fed7aa',
          skyColor: '#fdba74',
          envPreset: isNightMode ? 'sunset' : 'sunset'
        }
      case 'summer':
        return {
          sunColor: isNightMode ? '#60a5fa' : '#fffbeb',
          skyColor: '#93c5fd',
          envPreset: isNightMode ? 'night' : 'city'
        }
      case 'spring':
      default:
        return {
          sunColor: isNightMode ? '#a855f7' : '#fff1f2',
          skyColor: '#fbcfe8',
          envPreset: isNightMode ? 'night' : 'city'
        }
    }
  }, [season, isNightMode])

  return (
    <>
      {/* ================= SUNNY LOW-POLY DAYLIGHT RIG (CHUẨN ĐỒ HỌA ẢNH THAM KHẢO) ================= */}
      {/* Ambient Fill Light - Sáng rõ toàn diện, không bị tối đen */}
      <ambientLight
        intensity={(isNightMode ? 0.35 : 0.95) * lightBrightness}
        color={isNightMode ? '#1e293b' : '#ffffff'}
      />

      {/* Ánh sáng bán cầu (Hemisphere Light) mô phỏng bầu trời xanh & mặt đất ấm */}
      <hemisphereLight
        skyColor={isNightMode ? '#1e293b' : '#bae6fd'}
        groundColor={isNightMode ? '#0f172a' : '#fef08a'}
        intensity={(isNightMode ? 0.25 : 0.75) * lightBrightness}
      />

      {/* Ánh sáng Mặt Trời rực rỡ buổi sáng/trưa (Key Sunlight with Soft Shadows) */}
      <directionalLight
        position={[22, 32, 18]}
        intensity={(isNightMode ? 0.3 : 2.2) * lightBrightness}
        color={isNightMode ? '#38bdf8' : '#fffbeb'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={65}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.00015}
      />

      {/* Ánh sáng bầu trời phản xạ ngược (Sky Fill) */}
      <directionalLight
        position={[-18, 20, -16]}
        intensity={(isNightMode ? 0.2 : 0.6) * lightBrightness}
        color={skyColor}
      />

      {/* Đèn trung tâm Showroom tỏa sáng ấm cúng */}
      <pointLight
        position={[-1.0, 5.0, -2.0]}
        intensity={(isNightMode ? 2.0 : 1.2) * lightBrightness}
        color="#fed7aa"
        distance={18}
        decay={2}
      />

      {/* Drei HDRI Environment cho phản quang PBR tự nhiên */}
      <Environment preset={envPreset} environmentIntensity={(isNightMode ? 0.25 : 0.55) * lightBrightness} />

      {/* Bóng tiếp xúc mềm bên dưới khối đế (Contact Shadows) */}
      <ContactShadows
        position={[0, -1.41, 0]}
        opacity={isNightMode ? 0.7 : 0.35}
        scale={40}
        blur={2.4}
        far={8}
        resolution={1024}
        color="#1e293b"
      />

      {/* Hậu kỳ Bloom nhẹ nhàng, KHÔNG DÙNG VIGNETTE ĐEN gây tối mờ */}
      <EffectComposer disableNormalPass multisampling={4}>
        {bloomIntensity > 0 && (
          <Bloom
            luminanceThreshold={0.96}
            luminanceSmoothing={0.2}
            intensity={bloomIntensity * 0.5}
            mipmapBlur
          />
        )}
      </EffectComposer>
    </>
  )
}
