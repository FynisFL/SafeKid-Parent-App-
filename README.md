# SafeKid Parent App

[English documentation](docs/README.en.md) · [Mở bản web](https://fynisfl.github.io/SafeKid-Parent-App-/) · [APK kiểm thử Android](https://github.com/FynisFL/SafeKid-Parent-App-/actions/workflows/native-package.yml)

SafeKid giúp phụ huynh quản lý vị trí điện thoại, vùng an toàn, liên hệ khẩn cấp và thói quen gia đình. Ứng dụng là một SPA JavaScript, có bản web/PWA và bản Android kiểm thử đóng gói bằng Capacitor. Hồ sơ và dữ liệu được lưu trên thiết bị qua IndexedDB.

## Phạm vi hiện tại

- **Vị trí và Vùng an toàn.** Bản đồ hiển thị vị trí của điện thoại đang chạy app. Tạo, sửa và tạm dừng vùng trong mục **Vùng an toàn**. Việc kiểm tra ra/vào vùng chạy khi ứng dụng đang mở và có vị trí.
- **SOS.** Lưu sự kiện, phát chuông và gửi thông báo cục bộ nếu được cấp quyền. Sự kiện không được gửi đến thiết bị khác hay dịch vụ khẩn cấp. Gọi và nhắn tin cần thao tác của người dùng qua ứng dụng hệ thống.
- **Phát triển.** Quản lý thói quen, nhiệm vụ, lịch và điểm thưởng. Android có thể lên lịch thông báo nhắc việc cục bộ khi được cấp quyền. Bản web kiểm tra nhắc việc khi đang mở.
- **Watch Passport Lite và S.F AI.** Hồ sơ đồng hồ nhập tay, chưa ghép nối phần cứng. S.F AI dùng FAQ và quy tắc cục bộ để trả lời hoặc gợi ý điều hướng.
- **Sao lưu.** Xuất và nhập bản sao lưu trong cài đặt. Dữ liệu không đồng bộ giữa web và APK. IndexedDB không được ứng dụng mã hóa tại chỗ.

## Chạy web trên máy

Dùng Node.js 22 để khớp CI. Các lệnh chạy web, build tĩnh và kiểm tra mã JavaScript không cần cài gói npm.

```bash
npm run dev
```

Mở [localhost:4173](http://localhost:4173). Khi triển khai web, dùng HTTPS để trình duyệt có thể cấp quyền GPS. Để ghi đè cấu hình MapTiler, sao chép `.env.example` thành `.env` và điền `VITE_MAP_STYLE_URL`. Khóa trình duyệt xuất hiện trong request, nên giới hạn theo nguồn truy cập trong MapTiler. Tile bản đồ và tìm địa điểm cần mạng và có thể tiết lộ khu vực đang xem hoặc từ khóa tìm kiếm cho nhà cung cấp.

```bash
npm run build
npm run preview
```

Deploy thư mục `dist/`. GitHub Actions tự build và deploy bản web khi `main` thay đổi.

## Build APK kiểm thử

Trên GitHub Actions, mở [workflow Android](https://github.com/FynisFL/SafeKid-Parent-App-/actions/workflows/native-package.yml), chọn lần build thành công rồi tải artifact `safekid-android-phone-test`. Artifact ZIP chứa APK debug.

Để build trên máy, cần Node.js 22, JDK 21 và Android SDK đã cấu hình. Tạo thư mục Android một lần. Chạy lại từ `npm run build:native` khi cập nhật mã nguồn, bỏ qua `npx cap add android` nếu đã có thư mục `android/`.

```bash
npm ci
npm run build:native
npx cap add android
npx cap sync android
node scripts/configure-native.mjs
cd android
./gradlew assembleDebug
```

Trên Windows PowerShell, thay lệnh cuối bằng `.\gradlew.bat assembleDebug`. APK nằm ở `android/app/build/outputs/apk/debug/app-debug.apk`. Mã ứng dụng kiểm thử là `com.safekid.parent.test`. Chữ ký debug có thể khác giữa các lần build CI. Nếu Android từ chối cập nhật, xuất bản sao lưu trước khi gỡ bản cũ. Repo có cấu hình Capacitor cho iOS, nhưng chưa có workflow xuất bản iOS để cài trên máy thật.

## Cấu trúc repo

```text
src/
  main.js     Khởi tạo app, trạng thái, hash routes, render và luồng tương tác
  domain/     Quy tắc và phép tính độc lập với DOM, thiết bị và lưu trữ
  adapters/   IndexedDB, API trình duyệt và cầu nối native
  services/   Sao lưu và gọi MapTiler Geocoding
  config/     Cấu hình bản đồ mặc định
  data/       Nạp nội dung song ngữ
  ui/         Hành vi giao diện dùng lại
native/       Điểm vào Capacitor và mã Android do dự án duy trì
scripts/      Build web/native, chuẩn bị quyền hệ điều hành và chạy QA
tests/        Kiểm thử domain, adapter và các mô-đun JavaScript
content/      Nội dung FAQ, thương hiệu và S.F AI
assets/       Ảnh app, logo gốc và ảnh tham khảo thiết kế
docs/         Tài liệu kỹ thuật, QA và lịch sử quyết định
```

CSS nạp theo thứ tự `styles.css` → `mobile-refinements.css` → `motion.css` → `responsive.css`. Android và iOS sinh từ Capacitor nằm ngoài Git. Web dùng `sw.js` để cache app shell, nên cập nhật danh sách tệp lõi và phiên bản cache khi thêm mô-đun chạy trên trình duyệt.

## Kiểm tra trước khi bàn giao

```bash
npm run typecheck  # Kiểm tra cú pháp JavaScript
npm run lint       # Kiểm tra mẫu ghi log liên quan đến quyền riêng tư
npm test           # Node test runner
npm run build
```

Kiểm thử trình duyệt cần Python, Playwright và Chromium. Cài bằng `python -m pip install playwright` và `python -m playwright install chromium`, mở server với `npm run dev`, rồi chạy `npm run test:e2e` ở terminal khác. Trên Linux, dùng `python3` nếu hệ thống không có lệnh `python`.

Xem [audit cấu trúc](docs/SOURCE_AUDIT.md) và [checklist kiểm thử trên thiết bị](docs/UAT_CHECKLIST.md). Playwright dùng bản đồ giả lập trong một số luồng. GPS, quyền hệ điều hành, âm thanh SOS và cài APK cần xác nhận trên điện thoại thật.

Tài liệu duy trì: [quyết định kỹ thuật](docs/DECISIONS.md), [hướng dẫn giao diện](docs/UI_DESIGN_GUIDE.md) và [nguồn tài nguyên](ASSET_CREDITS.md). FAQ, nội dung thương hiệu và câu trả lời S.F AI trong `content/` là dữ liệu ứng dụng.
