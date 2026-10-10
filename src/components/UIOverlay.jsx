import React, { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

export default function UIOverlay({
  selectedItem,
  onCloseInspect,
  isNightMode,
  onToggleNightMode,
  season = 'spring',
  onChangeSeason,
  bloomIntensity = 0.35,
  onChangeBloom,
  lightBrightness = 0.9,
  onChangeBrightness,
  onCameraPreset,
  stats = {
    revenue: 348200000,
    orders: 48,
    efficiency: 99.4,
    visitors: 24
  }
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [showLightSettings, setShowLightSettings] = useState(false)
  const [showStarModal, setShowStarModal] = useState(false)
  const [showWelcomeGate, setShowWelcomeGate] = useState(() => {
    return !localStorage.getItem('dungauto_welcome_unlocked')
  })
  const [toastMessage, setToastMessage] = useState(null)
  const audioCtxRef = useRef(null)
  const audioIntervalRef = useRef(null)

  // Hiển thị gợi ý Star GitHub sau 30 giây trải nghiệm nếu chưa từng đánh sao
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem('star_prompted')
    if (!hasPrompted && !showWelcomeGate) {
      const timer = setTimeout(() => {
        setShowStarModal(true)
        sessionStorage.setItem('star_prompted', 'true')
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [showWelcomeGate])

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
          gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 1.2)
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

  const handleStarAction = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.4 }
    })
    setShowStarModal(false)
    showToast('⭐ Cảm ơn bạn rất nhiều vì đã tặng 1 Sao cho Dung Automation trên GitHub!')
    window.open('https://github.com/Dungautomation-dev/dungautomation-shop', '_blank')
  }

  const handleWelcomeStar = () => {
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 }
    })
    localStorage.setItem('dungauto_welcome_unlocked', 'true')
    setShowWelcomeGate(false)
    showToast('⭐ Cảm ơn bạn đã tặng Star cho Dung Automation trên GitHub! Showroom đã mở khóa.')
    window.open('https://github.com/Dungautomation-dev/dungautomation-shop', '_blank')
  }

  const handleWelcomeDirect = () => {
    localStorage.setItem('dungauto_welcome_unlocked', 'true')
    setShowWelcomeGate(false)
    showToast('🚀 Chào mừng bạn bước vào Showroom 3D DungAutomation!')
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
          <div className="brand-title">SHOWROOM TỦ ĐIỆN VASCO & CÔNG NGHỆ 3D</div>
        </div>

        {/* BỘ CHỌN 4 MÙA GÓC PHỐ HÀ NỘI */}
        <div className="season-selector-bar">
          <span className="season-label">Thời tiết:</span>
          <button
            className={`season-pill-btn ${season === 'spring' ? 'active' : ''}`}
            onClick={() => {
              onChangeSeason?.('spring')
              showToast('🌸 Mùa Xuân: Hoa ban & hoa anh đào nở rộ')
            }}
          >
            🌸 Xuân
          </button>
          <button
            className={`season-pill-btn ${season === 'summer' ? 'active' : ''}`}
            onClick={() => {
              onChangeSeason?.('summer')
              showToast('☀️ Mùa Hạ: Tán cây xanh mướt & đom đóm lung linh')
            }}
          >
            ☀️ Hạ
          </button>
          <button
            className={`season-pill-btn ${season === 'autumn' ? 'active' : ''}`}
            onClick={() => {
              onChangeSeason?.('autumn')
              showToast('🍂 Mùa Thu: Cây bàng lá đỏ & hoàng hôn ấm áp')
            }}
          >
            🍂 Thu
          </button>
          <button
            className={`season-pill-btn ${season === 'winter' ? 'active' : ''}`}
            onClick={() => {
              onChangeSeason?.('winter')
              showToast('❄️ Mùa Đông: Tuyết trắng phủ nhẹ góc phố')
            }}
          >
            ❄️ Đông
          </button>
        </div>

        {/* Nút bấm điều khiển hệ thống */}
        <div className="hud-controls">
          {/* Nút Ủng hộ 1 Star GitHub trực tiếp */}
          <a
            href="https://github.com/Dungautomation-dev/dungautomation-shop"
            target="_blank"
            rel="noopener noreferrer"
            className="hud-btn github-star-btn"
            onClick={(e) => {
              confetti({ particleCount: 90, spread: 80, origin: { y: 0.2 } })
              showToast('⭐ Cảm ơn bạn đã ghé thăm & ủng hộ Star trên GitHub!')
            }}
            title="Đánh sao 1-Click ủng hộ repository trên GitHub"
          >
            <span className="star-icon">⭐</span>
            <span>Star Repo</span>
          </a>

          {/* Nút mở lại Welcome Gate thông tin */}
          <button
            className="hud-btn info-btn"
            onClick={() => setShowWelcomeGate(true)}
            title="Xem thông tin dự án & Cổng chào mừng"
          >
            ℹ️ Giới thiệu
          </button>

          {/* Nút mở bảng điều chỉnh ánh sáng chống chói */}
          <button
            className={`hud-btn ${showLightSettings ? 'active' : ''}`}
            onClick={() => setShowLightSettings((v) => !v)}
            title="Tùy chỉnh độ chói và độ sáng của đèn"
          >
            ⚙️ Chỉnh Sáng
          </button>

          <button
            className={`hud-btn ${isNightMode ? 'active' : ''}`}
            onClick={onToggleNightMode}
            title={isNightMode ? 'Chuyển sang ban ngày' : 'Chuyển sang ban đêm rực sáng neon'}
          >
            {isNightMode ? '🌙 Đêm' : '☀️ Ngày'}
          </button>

          <button
            className={`hud-btn ${isPlayingAudio ? 'active' : ''}`}
            onClick={toggleAudio}
            title="Bật/Tắt nhạc nền thư giãn"
          >
            {isPlayingAudio ? '🔊 Nhạc' : '🔇 Âm thanh'}
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

      {/* ================= BẢNG ĐIỀU CHỈNH ÁNH SÁNG & CHỐNG CHÓI POPUP ================= */}
      {showLightSettings && (
        <div className="light-settings-panel glass-card">
          <div className="settings-header">
            <span>⚙️ ĐIỀU CHỈNH ÁNH SÁNG & CHỐNG CHÓI</span>
            <button className="settings-close-btn" onClick={() => setShowLightSettings(false)}>
              ✕
            </button>
          </div>

          {/* Thanh trượt Độ Chói (Bloom Glow) */}
          <div className="setting-group">
            <div className="setting-label-row">
              <span>✨ Độ Chói (Glow / Bloom):</span>
              <span className="setting-val-tag">
                {bloomIntensity === 0 ? 'Đã tắt hoàn toàn' : `${Math.round(bloomIntensity * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bloomIntensity}
              onChange={(e) => onChangeBloom?.(parseFloat(e.target.value))}
              className="tech-slider"
            />
            <div className="slider-presets">
              <button
                className={`preset-btn ${bloomIntensity === 0 ? 'active' : ''}`}
                onClick={() => onChangeBloom?.(0)}
              >
                Tắt Chói (0%)
              </button>
              <button
                className={`preset-btn ${bloomIntensity === 0.35 ? 'active' : ''}`}
                onClick={() => onChangeBloom?.(0.35)}
              >
                Dịu Mát (Chuẩn)
              </button>
              <button
                className={`preset-btn ${bloomIntensity === 0.8 ? 'active' : ''}`}
                onClick={() => onChangeBloom?.(0.8)}
              >
                Rực Rỡ (Cyber)
              </button>
            </div>
          </div>

          {/* Thanh trượt Độ Sáng Đèn (Brightness) */}
          <div className="setting-group">
            <div className="setting-label-row">
              <span>💡 Độ Sáng Showroom:</span>
              <span className="setting-val-tag">{Math.round(lightBrightness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.5"
              step="0.05"
              value={lightBrightness}
              onChange={(e) => onChangeBrightness?.(parseFloat(e.target.value))}
              className="tech-slider"
            />
          </div>
        </div>
      )}

      {/* ================= MODAL GỢI Ý ĐÁNH SAO 1-CLICK GITHUB (STAR PROMPT) ================= */}
      {showStarModal && (
        <div className="star-prompt-modal glass-card">
          <div className="star-prompt-badge">⭐ ỦNG HỘ DỰ ÁN MÃ NGUỒN MỞ</div>
          <h3 className="star-prompt-title">Bạn có thích Showroom 3D DungAutomation không?</h3>
          <p className="star-prompt-desc">
            Dành tặng 1 Sao (Star) trên GitHub để tiếp thêm động lực cho Dung Automation phát triển thêm nhiều dự án Tự động hóa & Web 3D độc đáo nhé!
          </p>
          <div className="star-prompt-actions">
            <button className="star-prompt-btn primary" onClick={handleStarAction}>
              ⭐ Tặng 1 Star Trên GitHub Ngay
            </button>
            <button className="star-prompt-btn secondary" onClick={() => setShowStarModal(false)}>
              Để sau
            </button>
          </div>
        </div>
      )}

      {/* ================= BOTTOM DEPARTMENT NAVIGATOR ================= */}
      <nav className="hud-departments glass-card">
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('plc')}
        >
          <span className="dept-icon">⚡</span>
          <span>Dàn Tủ Điện Công Nghiệp (MSB • ATS • Tụ Bù)</span>
        </button>
        <button
          className="dept-nav-btn"
          onClick={() => onCameraPreset?.('cybertech')}
        >
          <span className="dept-icon">📱</span>
          <span>Đồ Cyberpunk 2077</span>
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
          <div>• <b>Chuột trái:</b> Xoay 360° tự do</div>
          <div>• <b>Chuột phải:</b> Di chuyển góc nhìn (Pan)</div>
          <div>• <b>Cuộn chuột:</b> Phóng to / Thu nhỏ</div>
          <div>• <b>Click tủ điện:</b> Bóc tách vật tư & thông số kỹ thuật thực tế</div>
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

          <div className="inspect-specs-title">Bóc tách vật tư & Thông số kỹ thuật (Chuẩn VASCO):</div>
          <ul className="inspect-specs-list">
            {selectedItem.specs?.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>

          <div className="inspect-actions">
            <button className="inspect-action-btn primary" onClick={handleOrderAction}>
              ⚡ Nhận Báo Giá Dự Án & Hồ Sơ Bản Vẽ
            </button>
            <button className="inspect-action-btn secondary" onClick={onCloseInspect}>
              Đóng Xem Lại
            </button>
          </div>
        </aside>
      )}

      {/* ================= WELCOME STAR GATE & 1-CLICK LAUNCH MODAL ================= */}
      {showWelcomeGate && (
        <div className="welcome-gate-overlay">
          <div className="welcome-gate-card glass-card">
            <div className="welcome-gate-badge">
              <span className="star-pulse">⭐</span> DỰ ÁN MÃ NGUỒN MỞ • REACT THREE FIBER
            </div>

            <h1 className="welcome-gate-title">
              ⚡ SHOWROOM 3D DUNGAUTOMATION
            </h1>
            <p className="welcome-gate-subtitle">
              Không gian số hóa 3D tương tác thời gian thực: Tủ điện công nghiệp VASCO chuẩn nhà máy & Thiết bị công nghệ tương lai Cyberpunk 2077.
            </p>

            <div className="welcome-gate-highlights">
              <div className="highlight-item">
                <span className="hl-icon">⚡</span>
                <div className="hl-text">
                  <b>Tủ Điện VASCO Chuẩn Nhà Máy</b>
                  <span>MSB 2000A • ATS 800A • Tụ Bù 300kVAR • PLC S7-1200 + HMI SCADA</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="hl-icon">📱</span>
                <div className="hl-text">
                  <b>Công Nghệ Cyberpunk 2077</b>
                  <span>Điện thoại gập 3 màn • TV OLED trong suốt 8K • Laptop Cyberdeck</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="hl-icon">🌸</span>
                <div className="hl-text">
                  <b>Góc Phố Hà Nội 4 Mùa</b>
                  <span>Xuân - Hạ - Thu - Đông • Hiệu ứng hoa ban, đom đóm, lá vàng, tuyết trắng</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="hl-icon">🎮</span>
                <div className="hl-text">
                  <b>Tương Tác 360° Chống Chói Đỉnh Cao</b>
                  <span>Bề mặt nhám mịn matte slate • Tự do xoay chuột không lo snap back</span>
                </div>
              </div>
            </div>

            <div className="welcome-gate-cta-box">
              <p className="cta-note">
                Tặng 1 ⭐ Star trên GitHub để ủng hộ tác giả tiếp tục phát triển thêm nhiều dự án Tự động hóa & Web 3D mã nguồn mở chất lượng cao!
              </p>
              <div className="welcome-gate-actions">
                <button
                  className="welcome-btn primary-star"
                  onClick={handleWelcomeStar}
                  title="Mở tab GitHub repo để đánh sao và mở khóa Showroom ngay lập tức"
                >
                  <span className="btn-star-icon">⭐</span>
                  <span>ĐÁNH SAO & TRUY CẬP NGAY</span>
                </button>
                <button
                  className="welcome-btn secondary-skip"
                  onClick={handleWelcomeDirect}
                  title="Vào trực tiếp Showroom không cần qua cổng"
                >
                  Khám phá trực tiếp (Bỏ qua)
                </button>
              </div>
            </div>
          </div>
        </div>
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
