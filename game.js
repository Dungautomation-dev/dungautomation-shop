/**
 * DungAutomation 3D Isometric Electronics Store - Architectural Diorama Engine
 * Three.js Isometric View, Procedural Maker Lab & Industrial Automation Models,
 * Animated 6-DOF Robot Arm, Oscilloscope Waveform, Customers AI & Electronics Tycoon.
 */

(function () {
  'use strict';

  // --- 1. DỮ LIỆU CÁC PHÂN KHU SẢN PHẨM (STORE DEPARTMENTS) ---
  const DEPARTMENTS_DATA = {
    arduino_esp: {
      id: 'arduino_esp',
      name: 'Kệ Vi Điều Khiển ESP & Arduino',
      icon: '⚡',
      badge: 'Maker & IoT Zone',
      level: 1,
      baseIncome: 45000, // Doanh thu mỗi nhịp 6s (VNĐ)
      flagship: 'ESP32-WROOM-32U & Arduino Uno R3',
      desc: 'Kệ trưng bày các dòng ESP32 WiFi/Bluetooth, ESP8266, Kit học tập Arduino Uno, Nano, Mega và hàng trăm cảm biến IoT. Dành cho học sinh, sinh viên và dân chơi Maker.',
      upgradeCost: 280000,
      rating: '99% 5★'
    },
    plc_automation: {
      id: 'plc_automation',
      name: 'Tủ PLC & Tự Động Hóa Công Nghiệp',
      icon: '🏭',
      badge: 'Industrial Automation',
      level: 1,
      baseIncome: 95000,
      flagship: 'Siemens S7-1200 CPU 1214C & HMI Weintek',
      desc: 'Khu vực chuyên thiết bị tự động hóa nhà máy: PLC Siemens, Mitsubishi FX5U, Delta, Biến tần Inverter, Màn hình HMI cảm ứng, Cảm biến tiệm cận và Nguồn tổ ong 24VDC.',
      upgradeCost: 650000,
      rating: '98% 5★'
    },
    maker_bench: {
      id: 'maker_bench',
      name: 'Trạm Hàn Mạch & Đo Kiểm R&D',
      icon: '🔬',
      badge: 'Prototyping & Repair Lab',
      level: 1,
      baseIncome: 55000,
      flagship: 'Máy Hiện Sóng Rigol & Trạm Hàn Quick 936A',
      desc: 'Bàn thí nghiệm kỹ thuật trang bị thảm chống tĩnh điện ESD, máy hiện sóng kỹ thuật số, đồng hồ vạn năng, máy cấp nguồn DC và trạm hàn khò chip SMD chuyên nghiệp.',
      upgradeCost: 380000,
      rating: '97% 5★'
    },
    robot_arm: {
      id: 'robot_arm',
      name: 'Bục Trình Diễn Cánh Tay Robot 6-DOF',
      icon: '🤖',
      badge: 'Robotics Showcase',
      level: 1,
      baseIncome: 120000,
      flagship: 'Industrial 6-Axis Robot Arm & 3D Printer',
      desc: 'Bục xoay trình diễn cánh tay robot công nghiệp 6 bậc tự do gắp phôi tự động kết hợp máy in 3D đùn nhựa. Tâm điểm thu hút ánh nhìn của mọi khách hàng ghé shop!',
      upgradeCost: 850000,
      rating: '100% 5★'
    },
    checkout_shipper: {
      id: 'checkout_shipper',
      name: 'Quầy Thu Ngân & Giao Hàng Hỏa Tốc',
      icon: '📦',
      badge: 'Logistics & Checkout',
      level: 1,
      baseIncome: 65000,
      flagship: 'Đội Xe Shipper Giao Linh Kiện 2H',
      desc: 'Quầy tính tiền với máy quét barcode, đóng gói túi chống tĩnh điện và đội xe máy shipper công nghệ sẵn sàng giao linh kiện hỏa tốc cho các xưởng chế tạo.',
      upgradeCost: 420000,
      rating: '99% 5★'
    }
  };

  // Danh sách khách hàng ghé thăm cửa hàng
  const CUSTOMERS_ROSTER = [
    { name: 'Kỹ sư Tuấn Anh', role: 'Kỹ sư Tự động hóa Nhà máy', icon: '👷', quote: 'Đang cần gấp con PLC S7-1200 thay cho dây chuyền đóng gói, may mà DungAutomation có sẵn hàng!' },
    { name: 'Minh Quang', role: 'Sinh viên ĐH Bách Khoa', icon: '🎓', quote: 'Em mua combo ESP32 và cảm biến nhiệt độ DHT22 về làm đồ án IoT Smart Home nộp thầy.' },
    { name: 'Hoàng Maker', role: 'Lập trình viên IoT Embedded', icon: '💻', quote: 'Linh kiện ở đây chuẩn chính hãng, mạch in sắc nét, test kết nối MQTT mượt mà không lỗi!' },
    { name: 'Bác Hưng Chế Tạo', role: 'Thợ chế máy CNC & Laser', icon: '⚙️', quote: 'Qua DungAutomation lấy mấy bộ động cơ bước Driver TB6600 và nguồn 24V về lắp máy.' },
    { name: 'Thu Trang', role: 'Nghiên cứu sinh Robotics', icon: '🤖', quote: 'Cánh tay robot demo ở đây lập trình kinematics mượt quá, nhìn mê ly luôn!' },
    { name: 'Shipper Nam', role: 'Giao hàng hỏa tốc', icon: '🛵', quote: 'Đơn linh kiện DungAutomation gửi đi các tỉnh nhiều lắm, đóng gói bọc xốp chống sốc rất cẩn thận.' }
  ];

  // Trạng thái lưu trữ (Player Game State)
  let gameState = {
    gold: 1250000,
    orders: 18,
    reputation: 96,
    traffic: 12,
    departments: {}
  };

  function loadGameState() {
    try {
      const raw = localStorage.getItem('dungauto_shop_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        gameState = Object.assign(gameState, parsed);
        if (parsed.departments) {
          Object.keys(parsed.departments).forEach(k => {
            if (DEPARTMENTS_DATA[k]) {
              DEPARTMENTS_DATA[k].level = parsed.departments[k].level || 1;
            }
          });
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc save game:', e);
    }
  }

  function saveGameState() {
    try {
      const deptLevels = {};
      Object.keys(DEPARTMENTS_DATA).forEach(k => {
        deptLevels[k] = { level: DEPARTMENTS_DATA[k].level };
      });
      gameState.departments = deptLevels;
      localStorage.setItem('dungauto_shop_v1', JSON.stringify(gameState));
    } catch (e) {
      console.warn('Lỗi ghi save game:', e);
    }
  }

  // --- 2. BIẾN GAME THREE.JS & DIORAMA ---
  let scene, camera, renderer, raycaster, mouse;
  let dirLight, ambientLight, studioRimLight;
  let dioramaGroup;

  // Mô hình động
  let robotArmMesh = null;
  let robotArmJoints = [];
  let oscilloscopeScreen = null;
  let oscilloscopeCanvas, oscilloscopeCtx;
  let printerHeadMesh = null;
  let neonSignMesh = null;
  let ceilingLights = [];

  const animatedCustomers = [];
  let selectedDepartmentKey = 'arduino_esp';
  let inspectedTarget = null;
  let timeMode = 1; // 0: Sáng, 1: Hoàng hôn ấm áp, 2: Đêm Neon Cyberpunk
  let soundEnabled = false;

  // --- 3. KHỞI TẠO THREE.JS ENGINE ---
  function initEngine() {
    const container = document.getElementById('game-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f1117);

    // Setup Orthographic Isometric Camera
    const aspect = window.innerWidth / window.innerHeight;
    const d = 26;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    camera.position.set(45, 45, 45);
    camera.lookAt(0, 3, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    dioramaGroup = new THREE.Group();
    scene.add(dioramaGroup);

    setupLighting();
    buildDioramaPlinth();
    buildStoreArchitecture();
    buildElectronicsDepartments();
    spawnCustomers();
    initOscilloscopeTexture();

    applyLightingMode(timeMode);
    updateHUD();
    renderDepartmentShelf();

    window.addEventListener('resize', onWindowResize);
    setupEvents();
  }

  // --- 4. HỆ THỐNG ÁNH SÁNG STUDIO & CHU KỲ THỜI GIAN ---
  function setupLighting() {
    ambientLight = new THREE.AmbientLight(0xfffbeb, 0.7);
    scene.add(ambientLight);

    dirLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    dirLight.position.set(30, 50, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 150;
    const shadowD = 25;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    scene.add(dirLight);

    // Rim Light tạo viền phản chiếu sang trọng phong cách Architectural Rendering
    studioRimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    studioRimLight.position.set(-30, 35, -30);
    scene.add(studioRimLight);
  }

  function applyLightingMode(mode) {
    timeMode = mode;
    const iconEl = document.getElementById('time-icon');
    const textEl = document.getElementById('time-text');

    if (mode === 0) {
      // 0: BAN NGÀY (Crisp Studio Daylight)
      scene.background.setHex(0x1e293b);
      ambientLight.color.setHex(0xfffbeb);
      ambientLight.intensity = 0.85;
      dirLight.color.setHex(0xfffbeb);
      dirLight.intensity = 1.4;
      studioRimLight.intensity = 0.4;
      toggleInteriorGlow(false);
      if (iconEl) iconEl.innerText = '☀️';
      if (textEl) textEl.innerText = 'Ban Ngày';
    } else if (mode === 1) {
      // 1: HOÀNG HÔN ẤM ÁP (Warm Amber Sunset - Giống ảnh mẫu số 2 & số 5)
      scene.background.setHex(0x0f1117);
      ambientLight.color.setHex(0xfef3c7);
      ambientLight.intensity = 0.7;
      dirLight.color.setHex(0xf59e0b);
      dirLight.intensity = 1.35;
      studioRimLight.intensity = 0.55;
      toggleInteriorGlow(true);
      if (iconEl) iconEl.innerText = '🌇';
      if (textEl) textEl.innerText = 'Hoàng Hôn';
    } else {
      // 2: ĐÊM PHỐ CYBERPUNK (Deep Night with Neon Glow - Giống ảnh Nike & Penthouse đêm)
      scene.background.setHex(0x05070a);
      ambientLight.color.setHex(0x1e1b4b);
      ambientLight.intensity = 0.35;
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.6;
      studioRimLight.intensity = 1.0;
      toggleInteriorGlow(true, true);
      if (iconEl) iconEl.innerText = '🏮';
      if (textEl) textEl.innerText = 'Đêm Neon';
    }
  }

  function toggleInteriorGlow(enable, superGlow = false) {
    ceilingLights.forEach(light => {
      light.intensity = enable ? (superGlow ? 1.6 : 1.1) : 0.4;
    });
    if (neonSignMesh) {
      neonSignMesh.material.emissiveIntensity = enable ? (superGlow ? 2.5 : 1.6) : 0.6;
    }
  }

  // --- 5. TẠO BỤC ĐẾ DIORAMA BO GÓC (ARCHITECTURAL PLINTH) ---
  function buildDioramaPlinth() {
    // Kích thước bục: 22m x 22m, cao 1.6m với các góc bo tròn mềm mại
    const plinthGroup = new THREE.Group();

    // 1. Khối đế chính màu đá phiến xám đậm
    const baseGeo = new THREE.BoxGeometry(22, 1.4, 22);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e2433,
      roughness: 0.7,
      metalness: 0.2
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.7;
    base.receiveShadow = true;
    plinthGroup.add(base);

    // 2. Viền LED phát quang bo quanh chân bục
    const edgeGeo = new THREE.BoxGeometry(22.2, 0.12, 22.2);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const edgeLight = new THREE.Mesh(edgeGeo, edgeMat);
    edgeLight.position.y = 0.02;
    plinthGroup.add(edgeLight);

    // 3. Sàn nội thất cửa hàng (gỗ sồi sáng & đá marble xám vân mây)
    const floorGeo = new THREE.BoxGeometry(15, 0.1, 15);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(-1.5, 0.05, -1.5);
    floor.receiveShadow = true;
    plinthGroup.add(floor);

    // 4. Sàn vỉa hè ngoại thất lát đá hoa cương (Outdoor Sidewalk)
    const walkGeo = new THREE.BoxGeometry(21.8, 0.08, 21.8);
    const walkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.8
    });
    const walk = new THREE.Mesh(walkGeo, walkMat);
    walk.position.y = 0.03;
    walk.receiveShadow = true;
    plinthGroup.add(walk);

    dioramaGroup.add(plinthGroup);
  }

  // --- 6. XÂY DỰNG KIẾN TRÚC STOREFRONT & NỘI THẤT (STORE ARCHITECTURE) ---
  function buildStoreArchitecture() {
    const archGroup = new THREE.Group();

    // 1. Tường hậu & Tường bên phong cách Cutaway (Mở góc nhìn giống ảnh Penthouse & KFC)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8
    });

    // Tường sau (Back Wall)
    const backWallGeo = new THREE.BoxGeometry(16, 8, 0.5);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(-1.5, 4.0, -9.0);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    archGroup.add(backWall);

    // Tường bên trái (Left Wall)
    const leftWallGeo = new THREE.BoxGeometry(0.5, 8, 16);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-9.0, 4.0, -1.5);
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    archGroup.add(leftWall);

    // Lam gỗ ốp tường trang trí phong cách kiến trúc hiện đại (Slatted Wood Panels)
    for (let i = 0; i < 18; i++) {
      const slatGeo = new THREE.BoxGeometry(0.2, 7.6, 0.1);
      const slatMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(-8.8, 4.0, -8.5 + i * 0.8);
      archGroup.add(slat);
    }

    // 2. Mái che kính & Giàn Pergola đen hiện đại (Black Pergola Roof)
    const roofBeamMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    [-8.8, 6.2].forEach(rx => {
      const colGeo = new THREE.BoxGeometry(0.5, 7.8, 0.5);
      const col = new THREE.Mesh(colGeo, roofBeamMat);
      col.position.set(rx, 3.9, 6.2);
      col.castShadow = true;
      archGroup.add(col);
    });

    const topRoofGeo = new THREE.BoxGeometry(16, 0.6, 16);
    const topRoof = new THREE.Mesh(topRoofGeo, roofBeamMat);
    topRoof.position.set(-1.5, 8.0, -1.5);
    topRoof.castShadow = true;
    archGroup.add(topRoof);

    // Cửa kính phía trước (Glass Storefront & Double Glass Doors)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });
    const glassWallGeo = new THREE.BoxGeometry(15, 7.4, 0.12);
    const glassWall = new THREE.Mesh(glassWallGeo, glassMat);
    glassWall.position.set(-1.5, 3.8, 6.2);
    archGroup.add(glassWall);

    // 3. BẢNG HIỆU NEON RỰC RỠ TRÊN MÁI (NEON STORE SIGN)
    const signGroup = new THREE.Group();
    const signBoardGeo = new THREE.BoxGeometry(11, 1.6, 0.4);
    const signBoardMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const signBoard = new THREE.Mesh(signBoardGeo, signBoardMat);
    signBoard.position.set(-1.5, 9.0, 6.2);
    signGroup.add(signBoard);

    // Chữ Neon "DUNGAUTOMATION" (Canvas Texture Glow)
    const neonTexture = createTextTexture('⚡ DUNGAUTOMATION ⚡', '#00f3ff', '#0044ff');
    const textGeo = new THREE.PlaneGeometry(10.5, 1.3);
    const textMat = new THREE.MeshStandardMaterial({
      map: neonTexture,
      transparent: true,
      emissive: 0x06b6d4,
      emissiveIntensity: 1.8
    });
    neonSignMesh = new THREE.Mesh(textGeo, textMat);
    neonSignMesh.position.set(-1.5, 9.0, 6.42);
    signGroup.add(neonSignMesh);

    // Bảng phụ "PLC • ARDUINO • IOT LAB"
    const subTexture = createTextTexture('PLC • ARDUINO • ROBOTICS • IOT', '#facc15', '#b45309');
    const subGeo = new THREE.PlaneGeometry(8, 0.7);
    const subMat = new THREE.MeshStandardMaterial({
      map: subTexture,
      transparent: true,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.5
    });
    const subSign = new THREE.Mesh(subGeo, subMat);
    subSign.position.set(-1.5, 7.8, 6.42);
    signGroup.add(subSign);

    archGroup.add(signGroup);

    // 4. HỆ THỐNG ĐÈN ÂM TRẦN LED WARM 3000K (CEILING SPOTLIGHTS)
    [-5, 0, 5].forEach(lx => {
      [-5, 0].forEach(lz => {
        const spot = new THREE.PointLight(0xffedd5, 1.2, 12, 1.8);
        spot.position.set(lx, 7.4, lz);
        archGroup.add(spot);
        ceilingLights.push(spot);

        const bulbGeo = new THREE.SphereGeometry(0.16, 8, 8);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(lx, 7.6, lz);
        archGroup.add(bulb);
      });
    });

    dioramaGroup.add(archGroup);
  }

  function createTextTexture(text, textColor, glowColor) {
    const cvs = document.createElement('canvas');
    cvs.width = 1024;
    cvs.height = 160;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, 1024, 160);

    ctx.font = 'bold 64px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 24;
    ctx.fillStyle = textColor;
    ctx.fillText(text, 512, 80);

    ctx.shadowBlur = 10;
    ctx.fillText(text, 512, 80);

    return new THREE.CanvasTexture(cvs);
  }

  // --- 7. MÔ HÌNH CÁC PHÂN KHU ĐIỆN TỬ (DETAILED ELECTRONICS HARDWARE) ---
  function buildElectronicsDepartments() {
    const deptGroup = new THREE.Group();

    // ==========================================
    // 1. KỆ VI ĐIỀU KHIỂN ESP32 & ARDUINO (GÓC TÂY BẮC)
    // ==========================================
    const espGroup = new THREE.Group();
    espGroup.position.set(-6.5, 0, -6.5);

    // Kệ trưng bày gỗ & kính chiếu sáng 3 tầng
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    for (let shelf = 0; shelf < 3; shelf++) {
      const shelfGeo = new THREE.BoxGeometry(4.2, 0.1, 1.4);
      const sMesh = new THREE.Mesh(shelfGeo, rackMat);
      sMesh.position.y = 1.0 + shelf * 1.5;
      sMesh.castShadow = true;
      espGroup.add(sMesh);

      // Đèn LED strip dưới mỗi tầng kệ
      const ledGeo = new THREE.BoxGeometry(4.0, 0.04, 0.1);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0, 0.95 + shelf * 1.5, 0.6);
      espGroup.add(led);

      // Đặt các board mạch Arduino & ESP32 tinh xảo lên kệ
      for (let b = 0; b < 4; b++) {
        const boardX = -1.4 + b * 0.95;
        const isArduino = (b % 2 === 0);

        // Mạch PCB (Xanh dương cho Arduino, Đen mạ vàng cho ESP32)
        const pcbGeo = new THREE.BoxGeometry(0.65, 0.05, 0.85);
        const pcbMat = new THREE.MeshStandardMaterial({
          color: isArduino ? 0x0284c7 : 0x18181b,
          roughness: 0.4
        });
        const pcb = new THREE.Mesh(pcbGeo, pcbMat);
        pcb.position.set(boardX, 1.1 + shelf * 1.5, 0.1);
        espGroup.add(pcb);

        // Chip IC kim loại trung tâm & cổng kết nối USB
        const chipGeo = new THREE.BoxGeometry(0.28, 0.04, 0.28);
        const chipMat = new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.9 });
        const chip = new THREE.Mesh(chipGeo, chipMat);
        chip.position.set(boardX, 1.14 + shelf * 1.5, 0.1);
        espGroup.add(chip);
      }
    }

    espGroup.userData = { deptKey: 'arduino_esp' };
    deptGroup.add(espGroup);

    // ==========================================
    // 2. TỦ PLC & TỰ ĐỘNG HÓA CÔNG NGHIỆP (SIEMENS S7-1200)
    // ==========================================
    const plcGroup = new THREE.Group();
    plcGroup.position.set(-6.5, 0, -1.0);

    // Tủ rack công nghiệp kim loại
    const cabinetGeo = new THREE.BoxGeometry(4.2, 4.5, 1.5);
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.position.y = 2.25;
    cabinet.castShadow = true;
    plcGroup.add(cabinet);

    // Màn hình HMI cảm ứng Weintek 7-inch đang chạy giám sát
    const hmiGeo = new THREE.BoxGeometry(1.6, 1.1, 0.1);
    const hmiMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x0369a1 });
    const hmi = new THREE.Mesh(hmiGeo, hmiMat);
    hmi.position.set(1.0, 3.2, 0.8);
    plcGroup.add(hmi);

    // Module PLC Siemens S7-1200 (Vỏ xám ghi đặc trưng + nắp cam Siemens)
    const plcBoxGeo = new THREE.BoxGeometry(1.8, 1.2, 0.8);
    const plcBoxMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
    const plcBox = new THREE.Mesh(plcBoxGeo, plcBoxMat);
    plcBox.position.set(-0.9, 3.2, 0.5);
    plcGroup.add(plcBox);

    // Nắp màu cam Siemens
    const orangeCoverGeo = new THREE.BoxGeometry(1.7, 0.2, 0.82);
    const orangeCoverMat = new THREE.MeshStandardMaterial({ color: 0xea580c });
    const orangeCover = new THREE.Mesh(orangeCoverGeo, orangeCoverMat);
    orangeCover.position.set(-0.9, 3.65, 0.5);
    plcGroup.add(orangeCover);

    // Đèn LED báo nguồn RUN / STOP nhấp nháy xanh lá
    const ledRunGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const ledRunMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const ledRun = new THREE.Mesh(ledRunGeo, ledRunMat);
    ledRun.position.set(-0.4, 3.5, 0.92);
    plcGroup.add(ledRun);

    // Hàng biến tần mini & nguồn 24V phía dưới
    for (let inv = 0; inv < 3; inv++) {
      const invGeo = new THREE.BoxGeometry(0.8, 1.0, 0.6);
      const invMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const invMesh = new THREE.Mesh(invGeo, invMat);
      invMesh.position.set(-1.2 + inv * 1.2, 1.4, 0.5);
      plcGroup.add(invMesh);
    }

    plcGroup.userData = { deptKey: 'plc_automation' };
    deptGroup.add(plcGroup);

    // ==========================================
    // 3. BÀN THÍ NGHIỆM, TRẠM HÀN & ĐO KIỂM R&D (MAKER BENCH)
    // ==========================================
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 0, -6.5);

    // Bàn kỹ thuật gỗ chịu lực
    const deskGeo = new THREE.BoxGeometry(5.2, 1.6, 2.2);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.y = 0.8;
    desk.castShadow = true;
    benchGroup.add(desk);

    // Thảm chống tĩnh điện màu xanh dương (ESD Anti-static Mat)
    const esdGeo = new THREE.BoxGeometry(4.8, 0.04, 1.9);
    const esdMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const esd = new THREE.Mesh(esdGeo, esdMat);
    esd.position.y = 1.62;
    benchGroup.add(esd);

    // Máy Hiện Sóng (Digital Oscilloscope) với màn hình sóng xung nhịp
    const oscGeo = new THREE.BoxGeometry(1.4, 0.9, 0.7);
    const oscMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
    const osc = new THREE.Mesh(oscGeo, oscMat);
    osc.position.set(-1.6, 2.1, -0.4);
    benchGroup.add(osc);

    // Màn hình LCD máy hiện sóng (Dynamic Waveform Texture)
    const screenGeo = new THREE.PlaneGeometry(0.9, 0.65);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    oscilloscopeScreen = new THREE.Mesh(screenGeo, screenMat);
    oscilloscopeScreen.position.set(-1.6, 2.1, -0.04);
    benchGroup.add(oscilloscopeScreen);

    // Trạm hàn nhiệt (Soldering Station & Iron)
    const solderGeo = new THREE.BoxGeometry(0.7, 0.5, 0.6);
    const solderMat = new THREE.MeshStandardMaterial({ color: 0x0f766e });
    const solder = new THREE.Mesh(solderGeo, solderMat);
    solder.position.set(0.2, 1.9, -0.4);
    benchGroup.add(solder);

    // Breadboard cắm dây jumper nhiều màu sắc
    const breadboardGeo = new THREE.BoxGeometry(1.2, 0.08, 0.5);
    const breadboardMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
    const breadboard = new THREE.Mesh(breadboardGeo, breadboardMat);
    breadboard.position.set(1.4, 1.66, 0.2);
    benchGroup.add(breadboard);

    // Bó dây jumper uốn lượn
    for (let j = 0; j < 5; j++) {
      const wireGeo = new THREE.BoxGeometry(0.04, 0.12, 0.25);
      const wireColors = [0xef4444, 0xfacc15, 0x10b981, 0x3b82f6, 0x8b5cf6];
      const wireMat = new THREE.MeshBasicMaterial({ color: wireColors[j] });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.position.set(1.0 + j * 0.2, 1.74, 0.2);
      benchGroup.add(wire);
    }

    benchGroup.userData = { deptKey: 'maker_bench' };
    deptGroup.add(benchGroup);

    // ==========================================
    // 4. BỤC TRÌNH DIỄN CÁNH TAY ROBOT 6-DOF & MÁY IN 3D
    // ==========================================
    const robotGroup = new THREE.Group();
    robotGroup.position.set(2.0, 0, -1.0);

    // Bục tròn trưng bày trung tâm
    const plinthRoundGeo = new THREE.CylinderGeometry(2.6, 2.8, 1.0, 24);
    const plinthRoundMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5 });
    const plinthRound = new THREE.Mesh(plinthRoundGeo, plinthRoundMat);
    plinthRound.position.y = 0.5;
    plinthRound.castShadow = true;
    robotGroup.add(plinthRound);

    // Đèn LED vòng tròn quanh bục
    const ringGeo = new THREE.TorusGeometry(2.65, 0.08, 8, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.98;
    robotGroup.add(ring);

    // CÁNH TAY ROBOT CÔNG NGHIỆP 6-DOF (Màu Cam KUKA / Fanuc)
    const armBaseGeo = new THREE.CylinderGeometry(0.65, 0.75, 0.5, 16);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.6, roughness: 0.4 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });

    const armBase = new THREE.Mesh(armBaseGeo, armMat);
    armBase.position.y = 1.25;
    robotGroup.add(armBase);

    // Khớp 1 xoay thân
    const joint1 = new THREE.Group();
    joint1.position.y = 0.3;
    armBase.add(joint1);

    // Link 1 (Cánh tay dưới)
    const link1Geo = new THREE.BoxGeometry(0.45, 1.8, 0.45);
    const link1 = new THREE.Mesh(link1Geo, armMat);
    link1.position.y = 0.9;
    link1.castShadow = true;
    joint1.add(link1);

    // Khớp 2 (Khuỷu tay)
    const joint2 = new THREE.Group();
    joint2.position.y = 1.8;
    joint1.add(joint2);

    // Link 2 (Cánh tay trên)
    const link2Geo = new THREE.BoxGeometry(0.35, 1.5, 0.35);
    const link2 = new THREE.Mesh(link2Geo, armMat);
    link2.position.y = 0.75;
    link2.castShadow = true;
    joint2.add(link2);

    // Khớp 3 & Đầu kẹp Gripper
    const joint3 = new THREE.Group();
    joint3.position.y = 1.5;
    joint2.add(joint3);

    const gripperGeo = new THREE.BoxGeometry(0.25, 0.4, 0.45);
    const gripper = new THREE.Mesh(gripperGeo, jointMat);
    gripper.position.y = 0.2;
    joint3.add(gripper);

    // Phôi linh kiện vi mạch robot đang gắp
    const partGeo = new THREE.BoxGeometry(0.35, 0.15, 0.35);
    const partMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const part = new THREE.Mesh(partGeo, partMat);
    part.position.y = 0.45;
    joint3.add(part);

    robotArmJoints = [joint1, joint2, joint3];

    // MÁY IN 3D (3D Printer) mini bên cạnh
    const printerGeo = new THREE.BoxGeometry(1.4, 1.5, 1.4);
    const printerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const printer = new THREE.Mesh(printerGeo, printerMat);
    printer.position.set(1.4, 1.75, 1.2);
    robotGroup.add(printer);

    // Đầu đùn nhựa đang in
    const headGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    printerHeadMesh = new THREE.Mesh(headGeo, headMat);
    printerHeadMesh.position.set(1.4, 1.6, 1.2);
    robotGroup.add(printerHeadMesh);

    robotGroup.userData = { deptKey: 'robot_arm' };
    deptGroup.add(robotGroup);

    // ==========================================
    // 5. QUẦY THU NGÂN & ĐỘI SHIPPER (CHECKOUT & LOGISTICS)
    // ==========================================
    const checkoutGroup = new THREE.Group();
    checkoutGroup.position.set(2.5, 0, 4.0);

    // Quầy lễ tân gỗ óc chó cao cấp
    const counterGeo = new THREE.BoxGeometry(4.2, 1.5, 1.4);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.y = 0.75;
    counter.castShadow = true;
    checkoutGroup.add(counter);

    // Dải đèn vàng dưới chân quầy
    const stripGeo = new THREE.BoxGeometry(4.0, 0.06, 0.1);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.set(0, 0.1, 0.72);
    checkoutGroup.add(strip);

    // Màn hình máy POS & Barcode Scanner
    const posGeo = new THREE.BoxGeometry(0.65, 0.5, 0.1);
    const posMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pos = new THREE.Mesh(posGeo, posMat);
    pos.position.set(-0.8, 1.8, 0);
    checkoutGroup.add(pos);

    // Thùng carton đóng gói kiện hàng có tem DungAutomation
    for (let bx = 0; bx < 3; bx++) {
      const boxGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 });
      const bMesh = new THREE.Mesh(boxGeo, boxMat);
      bMesh.position.set(0.6 + bx * 0.5, 1.75, (bx % 2 === 0 ? 0.1 : -0.1));
      checkoutGroup.add(bMesh);
    }

    // CHIẾC XE MÁY SHIPPER HỎA TỐC ĐỖ Ở VỈA HÈ PHÍA TRƯỚC
    const bikeGroup = new THREE.Group();
    bikeGroup.position.set(-2.0, 0.05, 8.5);

    const bikeBodyGeo = new THREE.BoxGeometry(0.4, 0.7, 1.8);
    const bikeBodyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const bikeBody = new THREE.Mesh(bikeBodyGeo, bikeBodyMat);
    bikeBody.position.y = 0.55;
    bikeGroup.add(bikeBody);

    // Thùng giao hàng hỏa tốc màu vàng phía sau xe
    const deliveryBoxGeo = new THREE.BoxGeometry(0.75, 0.8, 0.8);
    const deliveryBoxMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 });
    const deliveryBox = new THREE.Mesh(deliveryBoxGeo, deliveryBoxMat);
    deliveryBox.position.set(0, 1.15, -0.6);
    deliveryBox.castShadow = true;
    bikeGroup.add(deliveryBox);

    checkoutGroup.add(bikeGroup);

    // CỘT ĐÈN ĐƯỜNG KIỂU DÁNG CỔ ĐIỂN NGOẠI THẤT (Giống ảnh Nike & Pizza House)
    const lampPostGroup = new THREE.Group();
    lampPostGroup.position.set(8.5, 0.05, 8.5);

    const postGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.2, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 2.1;
    lampPostGroup.add(post);

    const lanternGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.y = 4.2;
    lampPostGroup.add(lantern);

    const lampLight = new THREE.PointLight(0xfef08a, 1.4, 14, 1.6);
    lampLight.position.y = 4.2;
    lampPostGroup.add(lampLight);

    checkoutGroup.add(lampPostGroup);

    checkoutGroup.userData = { deptKey: 'checkout_shipper' };
    deptGroup.add(checkoutGroup);

    dioramaGroup.add(deptGroup);
  }

  // --- 8. KHÁCH HÀNG & KỸ SƯ AI ĐI LẠI TRONG SHOP (ANIMATED CUSTOMERS) ---
  function spawnCustomers() {
    for (let i = 0; i < 6; i++) {
      const cData = CUSTOMERS_ROSTER[i % CUSTOMERS_ROSTER.length];
      const cMesh = createCustomerMesh(i);

      // Điểm xuất phát từ vỉa hè hoặc trong cửa hàng
      const startX = -4 + Math.random() * 8;
      const startZ = (i < 3) ? 7.5 : (-3 + Math.random() * 6);
      cMesh.position.set(startX, 0.1, startZ);
      dioramaGroup.add(cMesh);

      const cust = {
        mesh: cMesh,
        info: cData,
        targetX: -4 + Math.random() * 7,
        targetZ: -4 + Math.random() * 7,
        speed: 1.1 + Math.random() * 0.7,
        pauseTimer: Math.random() * 3,
        cycle: Math.random() * 10
      };

      cMesh.userData = { customer: cust };
      animatedCustomers.push(cust);
    }
  }

  function createCustomerMesh(idx) {
    const group = new THREE.Group();

    // Màu áo kỹ sư: Xanh navy, Xanh ngọc, Đỏ cam, Trắng sơ mi
    const shirts = [0x0284c7, 0x0f766e, 0xea580c, 0xf8fafc, 0x7c3aed, 0x475569];
    const shirtMat = new THREE.MeshStandardMaterial({ color: shirts[idx % shirts.length], roughness: 0.6 });

    // Thân
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.95, 8);
    const body = new THREE.Mesh(bodyGeo, shirtMat);
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);

    // Đầu & Tóc
    const headGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.35;
    group.add(head);

    // Chân bước đi
    const legGeo = new THREE.BoxGeometry(0.1, 0.48, 0.1);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.1, 0.24, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.1, 0.24, 0);
    group.add(rightLeg);

    group.userData.leftLeg = leftLeg;
    group.userData.rightLeg = rightLeg;
    return group;
  }

  function updateCustomers(delta) {
    animatedCustomers.forEach(cust => {
      if (cust.pauseTimer > 0) {
        cust.pauseTimer -= delta;
        return;
      }

      const dx = cust.targetX - cust.mesh.position.x;
      const dz = cust.targetZ - cust.mesh.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.5) {
        // Đến quầy xem đồ, dừng lại 3 - 6 giây
        cust.pauseTimer = 3.0 + Math.random() * 4.0;
        // Chọn điểm tiếp theo (quầy Arduino, quầy PLC, hoặc ra quầy thu ngân)
        const spots = [
          { x: -5.0, z: -5.0 }, // Xem Arduino
          { x: -5.0, z: -1.0 }, // Xem PLC
          { x: 0.5, z: -4.5 },  // Xem Trạm hàn
          { x: 1.5, z: 0.5 },   // Xem Robot Arm
          { x: 1.5, z: 3.5 },   // Thu ngân
          { x: -2.0, z: 7.5 }   // Vỉa hè ra ngoài
        ];
        const nextSpot = spots[Math.floor(Math.random() * spots.length)];
        cust.targetX = nextSpot.x + (Math.random() - 0.5) * 1.5;
        cust.targetZ = nextSpot.z + (Math.random() - 0.5) * 1.5;
      } else {
        const step = cust.speed * delta;
        cust.mesh.position.x += (dx / dist) * step;
        cust.mesh.position.z += (dz / dist) * step;
        cust.mesh.rotation.y = Math.atan2(dx, dz);

        cust.cycle += delta * 8;
        if (cust.mesh.userData.leftLeg && cust.mesh.userData.rightLeg) {
          cust.mesh.userData.leftLeg.rotation.x = Math.sin(cust.cycle) * 0.45;
          cust.mesh.userData.rightLeg.rotation.x = -Math.sin(cust.cycle) * 0.45;
        }
      }
    });
  }

  // --- 9. HIỆU ỨNG SÓNG DAO ĐỘNG OSCILLOSCOPE & ROBOT ARM ---
  function initOscilloscopeTexture() {
    oscilloscopeCanvas = document.createElement('canvas');
    oscilloscopeCanvas.width = 256;
    oscilloscopeCanvas.height = 160;
    oscilloscopeCtx = oscilloscopeCanvas.getContext('2d');

    const texture = new THREE.CanvasTexture(oscilloscopeCanvas);
    if (oscilloscopeScreen) {
      oscilloscopeScreen.material.map = texture;
      oscilloscopeScreen.material.needsUpdate = true;
    }
  }

  let oscPhase = 0;
  function updateOscilloscope() {
    if (!oscilloscopeCtx || !oscilloscopeScreen) return;
    const ctx = oscilloscopeCtx;
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, 256, 160);

    // Kẻ lưới tọa độ oscilloscope
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1;
    for (let x = 0; x < 256; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 160); ctx.stroke();
    }
    for (let y = 0; y < 160; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }

    // Vẽ sóng PWM/Sin nhấp nháy liên tục
    oscPhase += 0.08;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px < 256; px++) {
      const py = 80 + Math.sin(px * 0.08 + oscPhase) * 35 + Math.sin(px * 0.03 - oscPhase * 2) * 15;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    oscilloscopeScreen.material.map.needsUpdate = true;
  }

  let robotArmTime = 0;
  function updateRobotArm(delta) {
    if (robotArmJoints.length >= 3) {
      robotArmTime += delta * 1.5;
      // Khớp 1 xoay thân qua lại
      robotArmJoints[0].rotation.y = Math.sin(robotArmTime * 0.8) * 0.7;
      // Khớp 2 gập cánh tay
      robotArmJoints[1].rotation.x = -0.3 + Math.sin(robotArmTime * 1.2) * 0.35;
      // Khớp 3 gập cổ tay
      robotArmJoints[2].rotation.x = 0.2 + Math.cos(robotArmTime * 1.2) * 0.4;
    }

    // Máy in 3D di chuyển đầu đùn
    if (printerHeadMesh) {
      printerHeadMesh.position.x = 1.4 + Math.sin(robotArmTime * 3.5) * 0.25;
      printerHeadMesh.position.z = 1.2 + Math.cos(robotArmTime * 4.2) * 0.25;
    }
  }

  // --- 10. KINH TẾ & DOANH THU ĐỊNH KỲ (ECONOMY LOOP) ---
  let economyTick = 0;
  function updateEconomy(delta) {
    economyTick += delta;
    if (economyTick >= 6) { // Cứ 6 giây sinh doanh thu bán linh kiện
      economyTick = 0;
      let totalTickIncome = 0;

      Object.values(DEPARTMENTS_DATA).forEach(dept => {
        const income = Math.round(dept.baseIncome * Math.pow(1.4, dept.level - 1));
        totalTickIncome += income;
      });

      gameState.gold += totalTickIncome;
      gameState.orders += 1 + Math.floor(Math.random() * 2);
      updateHUD();
      saveGameState();
    }
  }

  // --- 11. ĐIỀU KHIỂN CAMERA & TƯƠNG TÁC (CONTROLS & GIZMO) ---
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };

  function setupEvents() {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onMouseWheel);
    window.addEventListener('keydown', onKeyDown);

    // Gắn sự kiện các nút trên thanh Header & Gizmo
    document.getElementById('btn-toggle-time')?.addEventListener('click', () => {
      applyLightingMode((timeMode + 1) % 3);
    });

    document.getElementById('btn-toggle-audio')?.addEventListener('click', toggleAudio);
    document.getElementById('btn-reset-cam')?.addEventListener('click', resetCamera);

    document.getElementById('cam-rot-l')?.addEventListener('click', () => rotateCamera(-Math.PI / 4));
    document.getElementById('cam-rot-r')?.addEventListener('click', () => rotateCamera(Math.PI / 4));
    document.getElementById('cam-zoom-in')?.addEventListener('click', () => zoomCamera(0.85));
    document.getElementById('cam-zoom-out')?.addEventListener('click', () => zoomCamera(1.18));

    document.getElementById('btn-close-inspect')?.addEventListener('click', closeInspectModal);
    document.getElementById('btn-upgrade-dept')?.addEventListener('click', onUpgradeCurrentDepartment);
    document.getElementById('btn-trigger-demo')?.addEventListener('click', triggerLabDemoEffect);
  }

  function onMouseMove(e) {
    if (isDragging) {
      const dx = (e.clientX - prevMousePos.x) * 0.08;
      const dy = (e.clientY - prevMousePos.y) * 0.08;
      camera.position.x -= dx;
      camera.position.z += dy;
      prevMousePos = { x: e.clientX, y: e.clientY };
      return;
    }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onMouseDown(e) {
    if (e.button === 2) { // Chuột phải để lia camera
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      return;
    }

    if (e.button === 0) { // Chuột trái để click vào phân khu hoặc khách hàng
      if (e.target.closest('#hud') || e.target.closest('#inspect-modal')) return;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      // 1. Kiểm tra click trúng khách hàng
      for (let hit of intersects) {
        let obj = hit.object;
        while (obj && !obj.userData?.customer && obj.parent !== scene) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.customer) {
          inspectCustomer(obj.userData.customer);
          return;
        }
      }

      // 2. Kiểm tra click trúng phân khu sản phẩm
      for (let hit of intersects) {
        let obj = hit.object;
        while (obj && !obj.userData?.deptKey && obj.parent !== scene) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.deptKey) {
          selectDepartment(obj.userData.deptKey);
          return;
        }
      }
    }
  }

  function onMouseUp(e) {
    if (e.button === 2) isDragging = false;
  }

  function onMouseWheel(e) {
    zoomCamera(e.deltaY > 0 ? 1.1 : 0.9);
  }

  function onKeyDown(e) {
    const k = e.key.toLowerCase();
    const panSpeed = 2.5;
    if (k === 'w' || e.key === 'ArrowUp') { camera.position.x -= panSpeed; camera.position.z -= panSpeed; }
    if (k === 's' || e.key === 'ArrowDown') { camera.position.x += panSpeed; camera.position.z += panSpeed; }
    if (k === 'a' || e.key === 'ArrowLeft') { camera.position.x -= panSpeed; camera.position.z += panSpeed; }
    if (k === 'd' || e.key === 'ArrowRight') { camera.position.x += panSpeed; camera.position.z += panSpeed; }
    if (k === 'q') rotateCamera(-Math.PI / 4);
    if (k === 'e') rotateCamera(Math.PI / 4);
    if (k === ' ') triggerLabDemoEffect();
  }

  function zoomCamera(factor) {
    camera.zoom = Math.max(0.6, Math.min(2.8, camera.zoom / factor));
    camera.updateProjectionMatrix();
  }

  function rotateCamera(angle) {
    const cx = camera.position.x;
    const cz = camera.position.z;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    camera.position.x = cx * cos - cz * sin;
    camera.position.z = cx * sin + cz * cos;
    camera.lookAt(0, 3, 0);
  }

  function resetCamera() {
    camera.position.set(45, 45, 45);
    camera.zoom = 1.0;
    camera.lookAt(0, 3, 0);
    camera.updateProjectionMatrix();
    showToast('📐 Đã căn giữa góc nhìn Isometric cửa hàng!');
  }

  function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const d = 26;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // --- 12. GIAO DIỆN DIALOG CHI TIẾT (INSPECT MODAL) ---
  function selectDepartment(deptKey) {
    selectedDepartmentKey = deptKey;
    const dept = DEPARTMENTS_DATA[deptKey];
    if (!dept) return;

    inspectedTarget = { type: 'dept', data: dept };
    const modal = document.getElementById('inspect-modal');
    const iconEl = document.getElementById('ins-icon');
    const nameEl = document.getElementById('ins-name');
    const badgeEl = document.getElementById('ins-badge');
    const descEl = document.getElementById('ins-desc');
    const lvlEl = document.getElementById('ins-level');
    const incomeEl = document.getElementById('ins-income');
    const flagshipEl = document.getElementById('ins-flagship');
    const ratingEl = document.getElementById('ins-rating');
    const costEl = document.getElementById('ins-upgrade-cost');

    if (modal && iconEl && nameEl && descEl) {
      iconEl.innerText = dept.icon;
      nameEl.innerText = dept.name;
      badgeEl.innerText = dept.badge;
      descEl.innerText = dept.desc;

      const currentInc = Math.round(dept.baseIncome * Math.pow(1.4, dept.level - 1));
      lvlEl.innerText = `Cấp ${dept.level}`;
      incomeEl.innerText = `+${currentInc.toLocaleString('vi-VN')} đ / 6s`;
      flagshipEl.innerText = dept.flagship;
      ratingEl.innerText = dept.rating;

      const nextCost = Math.round(dept.upgradeCost * Math.pow(1.6, dept.level - 1));
      if (costEl) costEl.innerText = `${nextCost.toLocaleString('vi-VN')} đ`;

      document.getElementById('ins-actions-group').style.display = 'flex';
      modal.style.display = 'block';
    }

    renderDepartmentShelf();
  }

  function inspectCustomer(cust) {
    inspectedTarget = { type: 'customer', data: cust };
    const modal = document.getElementById('inspect-modal');
    const iconEl = document.getElementById('ins-icon');
    const nameEl = document.getElementById('ins-name');
    const badgeEl = document.getElementById('ins-badge');
    const descEl = document.getElementById('ins-desc');
    const lvlEl = document.getElementById('ins-level');
    const incomeEl = document.getElementById('ins-income');
    const flagshipEl = document.getElementById('ins-flagship');
    const ratingEl = document.getElementById('ins-rating');

    if (modal && iconEl && nameEl && descEl) {
      iconEl.innerText = cust.info.icon;
      nameEl.innerText = cust.info.name;
      badgeEl.innerText = cust.info.role;
      descEl.innerText = `"${cust.info.quote}"`;

      lvlEl.innerText = 'Khách VIP';
      incomeEl.innerText = 'Đang mua sắm';
      flagshipEl.innerText = 'Combo Kit IoT';
      ratingEl.innerText = 'Hài lòng 100% ⭐';

      document.getElementById('ins-actions-group').style.display = 'none';
      modal.style.display = 'block';
    }
  }

  function closeInspectModal() {
    const modal = document.getElementById('inspect-modal');
    if (modal) modal.style.display = 'none';
    inspectedTarget = null;
  }

  function onUpgradeCurrentDepartment() {
    if (!inspectedTarget || inspectedTarget.type !== 'dept') return;
    const dept = inspectedTarget.data;
    const cost = Math.round(dept.upgradeCost * Math.pow(1.6, dept.level - 1));

    if (gameState.gold < cost) {
      showToast(`🪙 Bạn cần ${cost.toLocaleString('vi-VN')}đ để nâng cấp phân khu này!`);
      return;
    }

    gameState.gold -= cost;
    dept.level += 1;
    gameState.reputation = Math.min(100, gameState.reputation + 1);

    showToast(`🚀 Nâng cấp thành công ${dept.name} lên Cấp ${dept.level}!`);
    selectDepartment(dept.id);
    updateHUD();
    saveGameState();
  }

  function triggerLabDemoEffect() {
    showToast('✨ Kích hoạt chu trình kiểm thử Lab: Robot Arm tăng tốc, màn hình dao động nhảy sóng!');
    robotArmTime += 5.0; // Đẩy nhanh chu trình robot arm
    if (neonSignMesh) {
      neonSignMesh.material.emissiveIntensity = 3.5;
      setTimeout(() => {
        neonSignMesh.material.emissiveIntensity = (timeMode > 0 ? 1.8 : 0.6);
      }, 1200);
    }
  }

  // --- 13. CẬP NHẬT GIAO DIỆN HUD & SHELF ---
  function updateHUD() {
    const goldEl = document.getElementById('hud-gold');
    if (goldEl) goldEl.innerText = `${gameState.gold.toLocaleString('vi-VN')} đ`;

    const ordersEl = document.getElementById('hud-orders');
    if (ordersEl) ordersEl.innerText = `${gameState.orders} đơn`;

    const repEl = document.getElementById('hud-rep');
    if (repEl) repEl.innerText = `${gameState.reputation}%`;

    const trafficEl = document.getElementById('hud-traffic');
    if (trafficEl) trafficEl.innerText = `${gameState.traffic} khách/phút`;

    // Tính tổng tốc độ bán hàng
    let totalSpeed = 0;
    Object.values(DEPARTMENTS_DATA).forEach(dept => {
      totalSpeed += Math.round(dept.baseIncome * Math.pow(1.4, dept.level - 1));
    });
    const speedEl = document.getElementById('deck-speed');
    if (speedEl) speedEl.innerText = `+${totalSpeed.toLocaleString('vi-VN')} đ / 6s`;
  }

  function renderDepartmentShelf() {
    const shelf = document.getElementById('departments-shelf');
    if (!shelf) return;
    shelf.innerHTML = '';

    Object.values(DEPARTMENTS_DATA).forEach(dept => {
      const card = document.createElement('div');
      const isSelected = (dept.id === selectedDepartmentKey);
      card.className = `dept-card ${isSelected ? 'selected' : ''}`;
      const currentInc = Math.round(dept.baseIncome * Math.pow(1.4, dept.level - 1));

      card.innerHTML = `
        <div class="dept-icon">${dept.icon}</div>
        <div class="dept-name">${dept.name}</div>
        <div class="dept-level">CẤP ${dept.level}</div>
        <div class="dept-rate">+${currentInc.toLocaleString('vi-VN')}đ/6s</div>
      `;

      card.addEventListener('click', () => {
        selectDepartment(dept.id);
      });

      shelf.appendChild(card);
    });
  }

  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast-banner');
    const msgEl = document.getElementById('toast-msg');
    if (!toast || !msgEl) return;

    msgEl.innerText = msg;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- 14. ÂM THANH LOFI TECH (WEB AUDIO API) ---
  let audioCtx = null;
  function toggleAudio() {
    soundEnabled = !soundEnabled;
    const txt = document.getElementById('audio-text');
    const ico = document.getElementById('audio-icon');

    if (soundEnabled) {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      playLofiTechArpeggio();
      if (txt) txt.innerText = 'Tắt Nhạc';
      if (ico) ico.innerText = '🔊';
      showToast('🎵 Đã bật giai điệu Lofi Maker thư thái!');
    } else {
      if (txt) txt.innerText = 'Bật Nhạc';
      if (ico) ico.innerText = '🎵';
      showToast('🔇 Đã tắt âm thanh.');
    }
  }

  function playLofiTechArpeggio() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const notes = [329.63, 392.00, 440.00, 493.88, 587.33, 659.25]; // E minor pentatonic
      let noteIdx = 0;

      function nextChime() {
        if (!soundEnabled) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.8);

        noteIdx = (noteIdx + 1 + Math.floor(Math.random() * 2)) % notes.length;
        setTimeout(nextChime, 1600 + Math.random() * 800);
      }
      nextChime();
    } catch (e) {}
  }

  // --- 15. GAME LOOP ---
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const delta = Math.min(0.06, (now - lastTime) / 1000);
    lastTime = now;

    updateRobotArm(delta);
    updateOscilloscope();
    updateCustomers(delta);
    updateEconomy(delta);

    renderer.render(scene, camera);
  }

  // Khởi động
  window.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    initEngine();
    requestAnimationFrame(animate);
    setTimeout(() => {
      showToast('⚡ Chào mừng bạn đến với Cửa Hàng DungAutomation 3D!');
    }, 600);
  });

})();
