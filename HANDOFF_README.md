# SafeKid Parent App — Handoff v2.3 (web-first, Capacitor-ready)

## Cách dùng
1. Upload **toàn bộ file ZIP này** lên AI Coding agent.
2. Copy toàn bộ nội dung `PROMPT_ALL_IN_ONE.md` dán vào ô chat của agent.
3. Agent tự đọc spec, nội dung và asset rồi build. Bạn không cần làm gì thêm.

## Bạn cần chuẩn bị (sau khi build)
- **MapTiler key** (miễn phí): tạo tài khoản, lấy key, giới hạn theo domain HTTPS, đặt vào biến `VITE_MAP_STYLE_URL`. Thiếu key thì app vẫn chạy nhưng bản đồ hiện "Chưa cấu hình bản đồ".
- **Deploy HTTPS** (Vercel/Netlify/Cloudflare Pages) để GPS hoạt động trên điện thoại.
- **Test thật trên điện thoại** theo `docs/UAT_CHECKLIST.md` (agent không thể kiểm GPS/thông báo thật).

## Phạm vi
- Làm bây giờ: web app + PWA, song ngữ Việt/Anh, S.F AI (cục bộ, có giới hạn), Watch Passport Lite, SOS cục bộ.
- Chưa làm (giai đoạn 2): APK/IPA, geofence nền, thông báo đẩy. Code vẫn sẵn sàng để chuyển sang Capacitor, xem `docs/NATIVE_MIGRATION_NOTES.md` do agent tạo.
- Không có: đăng nhập, backend, kết nối đồng hồ, thanh toán, SOS gửi sang máy khác.

## Thứ tự ưu tiên
`SAFEKID_MASTER_SPEC.md` mục 17 và prompt > phần còn lại của spec. Logo giữ nguyên, không vẽ lại.
