import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function LightingAndPostFx({ isNightMode = false }) {
  return (
    <>
      {/* ================= STUDIO ARCHITECTURAL LIGHTING RIG ================= */}
      {/* Ambient Fill Light */}
      <ambientLight
        intensity={isNightMode ? 0.35 : 0.75}
        color={isNightMode ? '#1e293b' : '#fffbeb'}
      />

      {/* Main Key Sun Light with Soft Architectural Shadows */}
      <directionalLight
        position={[15, 20, 12]}
        intensity={isNightMode ? 0.35 : 1.6}
        color={isNightMode ? '#60a5fa' : '#fffdf5'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.00015}
      />

      {/* Cool Sky Counter Fill */}
      <directionalLight
        position={[-12, 14, -10]}
        intensity={isNightMode ? 0.2 : 0.45}
        color="#bae6fd"
      />

      {/* Warm Showroom Interior Downlight */}
      <pointLight
        position={[-1.5, 4.5, -1.5]}
        intensity={isNightMode ? 3.0 : 1.8}
        color="#fed7aa"
        distance={15}
        decay={2}
      />

      {/* Drei HDRI Environment for PBR Reflections */}
      <Environment preset={isNightMode ? 'night' : 'city'} environmentIntensity={isNightMode ? 0.25 : 0.6} />

      {/* Soft Contact Shadows below Diorama Plinth Base at Y = -1.41 */}
      <ContactShadows
        position={[0, -1.41, 0]}
        opacity={isNightMode ? 0.75 : 0.5}
        scale={24}
        blur={2.2}
        far={6}
        resolution={1024}
        color="#090d16"
      />

      {/* Cinematic Post-Processing Pipeline (Bloom + Vignette) */}
      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom
          luminanceThreshold={0.8}
          luminanceSmoothing={0.25}
          intensity={isNightMode ? 1.4 : 0.85}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.28} darkness={0.45} />
      </EffectComposer>
    </>
  )
}
