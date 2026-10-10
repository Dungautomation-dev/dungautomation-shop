import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export default function UIOverlay({
  selectedItem,
  onCloseInspect,
  isNightMode,
  onToggleNightMode,
  onCameraPreset,
  stats = {
    revenue: 348200000,
    orders: 48,
    efficiency: 99.4,
    visitors: 24
  }
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const audioCtxRef = useRef(null)
  const audioIntervalRef = useRef(null)

  // Web Audio API ambient lofi tech synth
  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
      if (audioCtxRef.current) audioCtxRef.current.close()
      setIsPlayingAudio(false)
      showToast('Đã tắt âm thanh nền')
      return
    }

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx

      // Soft ambient chord progression
      const chords = [
        [220, 261.63, 329.63, 392], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392, 493.88], // Cmaj7
        [196, 246.94, 293.66, 349.23] // G7
      ]
      let chordIndex = 0

      const playChord = () => {
        if (!ctx || ctx.state === 'closed') return
        const currentChord = chords[chordIndex % chords.length]
        chordIndex++

        currentChord.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 1.2)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.8)

          osc.connect(gain)
          gain.connect(ctx.destination)

          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 5)
        })
      }

      playChord()
      audioIntervalRef.current = setInterval(playChord, 5000)
      setIsPlayingAudio(true)
      showToast('🎵 Đang phát nhạc nền Lofi Ambient Tech')
    } catch (err) {
      console.warn('Audio init error:', err)
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOrderAction = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
    showToast('🎉 Đã thêm vào danh sách tư vấn & báo giá nhanh!')
  }

  return (
    <div className="hud-container">
      {/* ================= TOP HEADER BAR ================= */}
      <header className="hud-header glass-card">
        <div className="brand-section">
          <div className="brand-badge">
            <span className="brand-glow-dot"></span>
            DUNGAUTOMATION
          </div>
          <div className="brand-title">TRUNG TÂM TỰ ĐỘNG HOÁ & MAKER LAB 3D</div>
        </div>

        {/* Live Shop Metrics */}
        <div className="hud-metrics">
          <div className="metric-pill">
            <span className="metric-icon">💰</span>
            <div className="metric-meta">
              <span className="metric-label">Doanh thu tháng</span>
              <span className="metric-val">{stats.revenue.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
          <div className="metric-pill">
            <span className="metric-icon">📦</span>
            <div className="metric-meta">
              <span className="metric-label">Đơn hôm nay</span>
              <span className="metric-val">{stats.orders} đơn</span>
            </div>
          </div>
          <div className="metric-pill">
            <span className="metric-icon">🦾</span>
            <div className="metric-meta">
              <span className="metric-label">Hiệu suất Robot</span>
              <span className="metric-val">{stats.efficiency}%</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="hud-controls">
          <button
            className={`hud-btn ${isNightMode ? 'active' : ''}`}
            onClick={onToggleNightMode}
            title={isNightMode ? 'Chuyển sang ban ngày' : 'Chuyển sang ban đêm rực sáng neon'}
          >
            {isNightMode ? '🌙 Đêm Neon' : '☀️ Ngày Nắng'}
          </button>

          <button
            className={`hud-btn ${isPlayingAudio ? 'active' : ''}`}
            onClick={toggleAudio}
            title="Bật/Tắt nhạc nền thư giãn"
          >
            {isPlayingAudio ? '🔊 Nhạc Lofi' : '🔇 Âm thanh'}
          </button>

          <button
            className="hud-btn"
            onClick={() => onCameraPreset?.('overview')}
            title="Góc nhìn toàn cảnh diorama"
          >
            🎥 Toàn Cảnh
          </button>
        </div>
      </header>

      {/* ================= BOTTOM DEPARTMENT NAVIGATOR ================= */}
      <nav className="hud-departments glass-card">
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('plc')}
        >
          <span className="dept-icon">🎛️</span>
          <span>Tủ PLC Siemens</span>
        </button>
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('robotics')}
        >
          <span className="dept-icon">🦾</span>
          <span>Robot 6 Trục</span>
        </button>
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('maker')}
        >
          <span className="dept-icon">🔬</span>
          <span>Bàn Maker Lab</span>
        </button>
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('arduino')}
        >
          <span className="dept-icon">⚡</span>
          <span>ESP32 & Arduino</span>
        </button>
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('checkout')}
        >
          <span className="dept-icon">🛵</span>
          <span>Quầy & Giao Vận</span>
        </button>
      </nav>

      {/* ================= CONTROLS HINT (BOTTOM LEFT) ================= */}
      <div className="hud-hint glass-card">
        <div className="hint-header">
          <span>🎮 Thao Tác Chuột & Phím</span>
        </div>
        <div className="hint-body">
          <div>• <b>Chuột trái:</b> Xoay 360° ngắm mọi góc độ</div>
          <div>• <b>Chuột phải:</b> Di chuyển góc nhìn (Pan)</div>
          <div>• <b>Cuộn chuột:</b> Phóng to / Thu nhỏ</div>
          <div>• <b>Click mô hình:</b> Xem thông số kỹ thuật chi tiết</div>
        </div>
      </div>

      {/* ================= INSPECT MODAL / DRAWER ================= */}
      {selectedItem && (
        <aside className="hud-inspect-modal glass-card">
          <div className="inspect-header">
            <span className="inspect-category">{selectedItem.category}</span>
            <button className="inspect-close-btn" onClick={onCloseInspect}>
              ✕
            </button>
          </div>

          <h2 className="inspect-title">{selectedItem.title}</h2>
          <div className="inspect-price-tag">{selectedItem.price}</div>

          <p className="inspect-desc">{selectedItem.desc}</p>

          <div className="inspect-specs-title">Thông số kỹ thuật & Tính năng nổi bật:</div>
          <ul className="inspect-specs-list">
            {selectedItem.specs?.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>

          <div className="inspect-actions">
            <button className="inspect-action-btn primary" onClick={handleOrderAction}>
              ⚡ Đặt Mua & Tư Vấn Kỹ Thuật
            </button>
            <button className="inspect-action-btn secondary" onClick={onCloseInspect}>
              Đóng Xem Lại
            </button>
          </div>
        </aside>
      )}

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="hud-toast glass-card">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
