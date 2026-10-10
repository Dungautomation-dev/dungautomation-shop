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
      {/* ================= STUDIO ARCHITECTURAL LIGHTING RIG (KHỬ CHÓI MẮT) ================= */}
      {/* Ambient Fill Light */}
      <ambientLight
        intensity={(isNightMode ? 0.3 : 0.55) * lightBrightness}
        color={isNightMode ? '#1e293b' : sunColor}
      />

      {/* Main Key Sun Light with Soft Architectural Shadows */}
      <directionalLight
        position={[14, 18, 12]}
        intensity={(isNightMode ? 0.3 : 1.1) * lightBrightness}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-bias={-0.00015}
      />

      {/* Cool Sky Counter Fill */}
      <directionalLight
        position={[-12, 14, -10]}
        intensity={0.3 * lightBrightness}
        color={skyColor}
      />

      {/* Warm Showroom Interior Ceiling Downlight (Cường độ dịu mát không gây chói lóa) */}
      <pointLight
        position={[-1.5, 4.2, -1.5]}
        intensity={(isNightMode ? 1.8 : 1.0) * lightBrightness}
        color="#fed7aa"
        distance={12}
        decay={2}
      />

      {/* Drei HDRI Environment for PBR Reflections */}
      <Environment preset={envPreset} environmentIntensity={(isNightMode ? 0.2 : 0.45) * lightBrightness} />

      {/* Soft Contact Shadows below Diorama Plinth Base */}
      <ContactShadows
        position={[0, -1.41, 0]}
        opacity={isNightMode ? 0.75 : 0.45}
        scale={24}
        blur={2.2}
        far={6}
        resolution={1024}
        color="#090d16"
      />

      {/* Cinematic Post-Processing Pipeline (Bloom + Vignette) */}
      <EffectComposer disableNormalPass multisampling={4}>
        {/* Chỉ phát sáng vật thể có luminanceThreshold cao, KHÔNG làm lóa mặt sàn! */}
        {bloomIntensity > 0 && (
          <Bloom
            luminanceThreshold={0.95}
            luminanceSmoothing={0.2}
            intensity={bloomIntensity}
            mipmapBlur
          />
        )}
        <Vignette eskil={false} offset={0.28} darkness={0.42} />
      </EffectComposer>
    </>
  )
}
