import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function LightingAndPostFx({ isNightMode = false }) {
  return (
    <>
      {/* ================= STUDIO LIGHTING RIG ================= */}
      {/* Ambient Fill Light */}
      <ambientLight
        intensity={isNightMode ? 0.35 : 0.75}
        color={isNightMode ? '#1e293b' : '#fff7ed'}
      />

      {/* Main Architectural Key Light with HD Shadows */}
      <directionalLight
        position={[14, 22, 10]}
        intensity={isNightMode ? 0.4 : 1.8}
        color={isNightMode ? '#60a5fa' : '#fffbeb'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0002}
      />

      {/* Cool Sky Counter Fill Light */}
      <directionalLight
        position={[-12, 14, -10]}
        intensity={isNightMode ? 0.2 : 0.5}
        color="#bae6fd"
      />

      {/* Warm Store Interior Ceiling Downlight */}
      <pointLight
        position={[0, 4.2, 0]}
        intensity={isNightMode ? 3.5 : 2.0}
        color="#fed7aa"
        distance={16}
        decay={2}
      />

      {/* Cyan Display Accent Light */}
      <pointLight
        position={[-3, 2.5, 2]}
        intensity={isNightMode ? 2.5 : 1.2}
        color="#38bdf8"
        distance={8}
        decay={2}
      />

      {/* Drei HDRI Environment for PBR Chrome & Glass Reflections */}
      <Environment preset={isNightMode ? 'night' : 'city'} environmentIntensity={isNightMode ? 0.3 : 0.6} />

      {/* Soft Contact Shadows below Diorama Plinth Base */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={isNightMode ? 0.8 : 0.55}
        scale={22}
        blur={2.4}
        far={5}
        resolution={1024}
        color="#090d16"
      />

      {/* Cinematic Post-Processing Pipeline */}
      <EffectComposer disableNormalPass multisampling={4}>
        {/* Soft atmospheric neon bloom */}
        <Bloom
          luminanceThreshold={0.7}
          luminanceSmoothing={0.3}
          intensity={isNightMode ? 1.6 : 1.1}
          mipmapBlur
        />
        {/* Architectural Vignette */}
        <Vignette eskil={false} offset={0.25} darkness={0.5} />
      </EffectComposer>
    </>
  )
}
