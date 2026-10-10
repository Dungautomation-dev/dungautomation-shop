# DungAutomation 3D Isometric Electronics Store ⚡ (R3F + Drei + Bloom)

> **Architectural Cutaway Diorama Shop 3D** – Trải nghiệm không gian showroom tự động hóa và điện tử công nghệ cao thu nhỏ chuẩn studio, xây dựng hoàn toàn bằng **React Three Fiber (R3F)**, **Drei**, và **Post-Processing (Bloom + Contact Shadows)**.

---

### 🌐 Trải Nghiệm Chơi Trực Tiếp Trên Web:
👉 **GitHub Pages:** [https://dungautomation-dev.github.io/dungautomation-shop/](https://dungautomation-dev.github.io/dungautomation-shop/)  
👉 **Mã Nguồn GitHub:** [https://github.com/Dungautomation-dev/dungautomation-shop](https://github.com/Dungautomation-dev/dungautomation-shop)

---

## 🏛️ Kiến Trúc Không Gian & Điểm Nhấn Nghệ Thuật (Architectural Diorama)

Lấy cảm hứng từ các tác phẩm kiến trúc mặt cắt 3D cao cấp (Architectural Cutaway Box), cửa hàng **DungAutomation** tại Hà Nội được thiết kế tỉ mỉ từng chi tiết:

1. **Bục Đế Kiến Trúc Bo Góc (Curved Plinth Base):**
   - Khối đế đá phiến màu xám than sang trọng, nâng toàn bộ cửa hàng lên không gian triển lãm.
   - Dải LED Cyan viền phát quang 360° chạy dọc chân bục.
   - Vỉa hè lát đá hoa cương xám ngoài phố kết hợp sàn showroom ốp đá cẩm thạch trắng Italian Calacatta White Marble.

2. **Mặt Tiền & Kết Cấu Hiện Đại:**
   - Hệ khung thép đen kết hợp lam gỗ tuyết tùng (Cedar Slatted Walls) tự nhiên ấm áp.
   - Bảng hiệu Neon 3D khổng lồ `⚡ DUNGAUTOMATION ⚡` tỏa ánh sáng rực rỡ xuyên qua lớp kính cường lực.
   - Đèn đường kiểu cổ điển phát ánh sáng vàng ấm 2700K soi rọi bồn cây xanh Ficus ngoài vỉa hè.

3. **5 Phân Khu Trưng Bày & Trải Nghiệm Công Nghệ Chuyên Sâu:**
   - 🎛️ **Tủ Tự Động Hóa Công Nghiệp PLC & SCADA:** CPU Siemens S7-1200 1214C với nắp cam đặc trưng, đèn LED RUN/STOP nhấp nháy chu kỳ xung, màn hình cảm ứng Weintek HMI 7-inch, biến tần VFD và bộ nguồn Meanwell 24VDC.
   - 🦾 **Trạm Trình Diễn Cánh Tay Robot 6 Trục (6-DOF Kinematics):** Đặt trên bục xoay Turntable phát quang viền vàng, chu trình Pick & Place gắp chip microchip tự động cùng máy in 3D công nghiệp CoreXY đang đùn nhựa.
   - 🔬 **Bàn Kỹ Thuật Maker Lab Thực Nghiệm:** Trải thảm xanh chống tĩnh điện ESD, máy hiện sóng kỹ thuật số Rigol 4 kênh hiển thị dạng sóng dao động thời gian thực bằng HTML5 Canvas Texture, trạm hàn nhiệt Quick 936A và breadboard cắm dây rainbow jumper.
   - ⚡ **Tủ Kính Trưng Bày Vi Điều Khiển IoT:** 3 tầng kính trong suốt trưng bày Arduino Uno R3 xanh chuẩn, ESP32-S3 chân mạ vàng, Raspberry Pi 4 Model B và cảm biến môi trường.
   - 🛵 **Quầy Thu Ngân & Đội Xe Vận Chuyển Hoả Tốc:** Bàn thu ngân gỗ óc chó ốp đá cẩm thạch, hệ thống POS cảm ứng 2 màn hình, máy quét barcode, các chồng kiện hàng DungAutomation bọc chống tĩnh điện và xe máy điện giao hàng hỏa tốc đỗ ở vỉa hè.

4. **Nhân Vật Hoạt Họa Động (Animated Walking Customers):**
   - Các kỹ sư nhà máy KCN Bắc Ninh, sinh viên ĐH Bách Khoa Hà Nội, maker lập trình nhúng, shipper hỏa tốc và du khách dạo phố di chuyển tuần tự với chu trình bước chân (Walk Cycles).
   - Click vào bất kỳ nhân vật hay thiết bị nào để mở bảng **Thông Số Kỹ Thuật & Báo Giá** chi tiết.

5. **Ánh Sáng & Hiệu Ứng Điện Ảnh (Cinematic Post-Processing):**
   - `<Bloom>`: Tạo hiệu ứng viền sáng rực rỡ chân thực cho bảng hiệu neon, màn hình và đèn LED báo hiệu.
   - `<ContactShadows>`: Đổ bóng tiếp xúc siêu mịn dưới đáy bục và đồ đạc giống ảnh render kiến trúc 3ds Max/Blender.
   - `<Environment preset="city">`: Ánh sáng môi trường HDRI phản xạ PBR trên bề mặt kính và kim loại.
   - Chuyển đổi ☀️ **Ngày Nắng** và 🌙 **Đêm Neon** tức thì chỉ với 1 click.
   - Nhạc nền **Lofi Ambient Tech** tự tổng hợp bằng Web Audio API không phụ thuộc tải file mạng.

---

## 🛠️ Công Nghệ Sử Dụng (Modern Tech Stack)

- **Ngôn ngữ & Nền tảng:** React 19, Vite 8, JavaScript (ES Modules)
- **3D Engine:** [Three.js](https://threejs.org/) (r186)
- **React 3D Renderer:** [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) (R3F v9)
- **Vũ khí 3D Helpers:** [@react-three/drei](https://github.com/pmndrs/drei) (v10) - OrbitControls, Html, Float, ContactShadows, Environment
- **Hiệu ứng Hậu kỳ:** [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) - Bloom, Vignette
- **Triển khai CI/CD:** GitHub Actions tự động build & deploy lên GitHub Pages

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

### Cách 1: Chạy 1-Click (Dành cho Windows)
Chỉ cần nhấp đúp vào file `Run_DungAutomation_Shop.bat` ở thư mục gốc để tự động cài đặt và mở trình duyệt.

### Cách 2: Bằng dòng lệnh terminal
```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Mở trình duyệt tại: http://localhost:5173
```

---

## 📜 Bản Quyền & Tác Giả

Dự án được xây dựng và phát triển bởi **Dung Automation**  
*Mã nguồn mở theo giấy phép MIT License.*
