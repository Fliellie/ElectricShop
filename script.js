
function updateShopStatus() {
            const now = new Date();
            const currentHour = now.getHours();
            
            const badge = document.getElementById('shop-status-badge');
            const text = document.getElementById('status-text');
            
            // Giờ hành chính: Từ 7h (>=7) đến trước 20h (<20)
            if (currentHour >= 7 && currentHour < 20) {
                badge.className = "status-badge status-open";
                text.innerText = "Trong giờ hành chính";
            } else {
                badge.className = "status-badge status-closed";
                text.innerText = "Ngoài giờ hành chính";
            }
        }

        // Chạy kiểm tra ngay khi tải trang xong
        window.addEventListener('DOMContentLoaded', () => {
            updateShopStatus();
            // Thiết lập chạy lại hàm kiểm tra sau mỗi 60000ms (1 phút)
            setInterval(updateShopStatus, 60000);
        });




