import React, { useState, useEffect, Suspense } from 'react'
import CanvasScene from './components/CanvasScene'
import UIOverlay from './components/UIOverlay'

export default function App() {
  const [isNightMode, setIsNightMode] = useState(false)
  const [season, setSeason] = useState('spring') // 'spring', 'summer', 'autumn', 'winter'
  const [bloomIntensity, setBloomIntensity] = useState(0.35) // Dịu nhẹ, không lóa mắt
  const [lightBrightness, setLightBrightness] = useState(0.9)
  const [selectedItem, setSelectedItem] = useState(null)
  const [cameraPreset, setCameraPreset] = useState('overview')
  const [stats, setStats] = useState({
    revenue: 348250000,
    orders: 48,
    efficiency: 99.4,
    visitors: 24
  })

  // Tự động gia tăng doanh thu theo thời gian thực (Tycoon Mode)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const addedRev = Math.floor(Math.random() * 3 + 1) * 150000
        return {
          ...prev,
          revenue: prev.revenue + addedRev,
          orders: prev.orders + 1,
          visitors: prev.visitors + (Math.random() > 0.5 ? 1 : 0)
        }
      })
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-viewport">
      <Suspense
        fallback={
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <div className="loading-text">⚡ ĐANG KHỞI TẠO DIORAMA 3D DUNGAUTOMATION...</div>
          </div>
        }
      >
        <CanvasScene
          isNightMode={isNightMode}
          season={season}
          bloomIntensity={bloomIntensity}
          lightBrightness={lightBrightness}
          onSelectItem={setSelectedItem}
          cameraPreset={cameraPreset}
        />
      </Suspense>

      <UIOverlay
        selectedItem={selectedItem}
        onCloseInspect={() => setSelectedItem(null)}
        isNightMode={isNightMode}
        onToggleNightMode={() => setIsNightMode((v) => !v)}
        season={season}
        onChangeSeason={setSeason}
        bloomIntensity={bloomIntensity}
        onChangeBloom={setBloomIntensity}
        lightBrightness={lightBrightness}
        onChangeBrightness={setLightBrightness}
        onCameraPreset={setCameraPreset}
        stats={stats}
      />
    </div>
  )
}
