# Audit cấu trúc SafeKid

Mốc rà soát: `main` tại `5d890fc`. Phạm vi gồm mã ứng dụng, cấu hình build web và Android, service worker, tài liệu và bộ kiểm thử hiện có.

## Đã xử lý trong đợt này

- **Hai bản README.** Tiếng Việt ở trang đầu repo. Bản tiếng Anh ghi cùng phạm vi tính năng, cách chạy, cách build Android và giới hạn kiểm thử.
- **Tách phần độc lập khỏi điểm vào.** `domain/geojson.js` tính hình học của vòng vùng và sai số GPS. `ui/touch-controls.js` quản lý sự kiện giữ và kéo trên nút, tab và link. `main.js` gọi lại các hàm đã tách.
- **Một cách đọc cấu hình MapTiler.** Server dev và build dùng chung bộ đọc biến trong `.env` và bộ chèn giá trị vào HTML. Giá trị chứa dấu nháy, dấu ampersand hoặc ký tự đặc biệt của phép thay thế chuỗi được xử lý ở một chỗ.
- **Giới hạn phạm vi cache.** Service worker chỉ dọn các bản cache SafeKid cũ theo tiền tố. Trả app shell khi điều hướng thiếu mạng, thay vì trả HTML cho request tệp JS hoặc CSS lỗi. Hai mô-đun mới nằm trong danh sách cache lõi.
- **Gói build gọn hơn.** Ảnh moodboard và logo gốc vẫn có trong Git để dùng cho thiết kế. Bản web và Android chỉ đóng gói tài nguyên app cần. Ảnh sinh ra bởi E2E nằm ngoài Git.

## Những điểm nên xử lý tiếp theo

1. **Điểm vào còn quá nhiều trách nhiệm.** `src/main.js` chứa trạng thái, template, định tuyến, hành vi và tác vụ nền của giao diện. Nên tách theo tính năng, bắt đầu với FAQ/S.F AI và các luồng chỉ đọc. Sau đó tách Vùng an toàn hoặc Phát triển, mỗi lần một tính năng. SOS nên đi riêng với kiểm thử thao tác thực tế do có âm thanh, quyền và trạng thái sự kiện.
2. **CSS còn phụ thuộc thứ tự nạp.** Bốn stylesheet có gần 3.200 dòng và một số lớp ghi đè qua nhiều đợt thiết kế. Giữ thứ tự hiện tại cho tới khi có ảnh đối chiếu cho từng route và breakpoint. Khi dọn, chuyển từng nhóm selector cùng trách nhiệm rồi kiểm lại trạng thái focus, motion và bàn phím.
3. **Danh sách cache được duy trì bằng tay.** Thêm kiểm tra tập tệp runtime hoặc sinh danh sách từ build khi số mô-đun tăng. Khi thay đổi cache, kiểm tra cả nâng cấp từ một bản đang cài và tải offline sau lần mở có mạng.
4. **Các bước cài APK chưa có khóa debug ổn định giữa lần build CI.** Xác định cách phân phối và lưu khóa trước khi bật cập nhật đè cho người kiểm thử. Tiếp tục giữ procedure sao lưu vì dữ liệu web và APK tách riêng.
5. **Kiểm thử tự động có giới hạn.** Một số test UI kiểm tra chuỗi mã thay vì tương tác. Ưu tiên chuyển dần sang kiểm thử hành vi. Bản đồ thật, kiểm tra quyền GPS và thông báo, bàn phím, thao tác giữ và âm thanh SOS cần vòng UAT trên thiết bị.

## Ranh giới cho thay đổi mới

Đặt quy tắc thuần trong `domain/`, lưu trữ và quyền thiết bị trong `adapters/`, tác vụ tích hợp trong `services/` và hành vi DOM dùng chung trong `ui/`. Chỉ tách thành thư mục tính năng khi điểm vào và phụ thuộc đã rõ. Để thay đổi dữ liệu hay native trong commit riêng, có kiểm thử cho dữ liệu cũ và quy trình build lại APK.
