const supabaseClient = window.supabase.createClient(
    "https://eufiogyuvfvanasqjvev.supabase.co",
    "sb_publishable_IvnP5PqePMNxS3HeAbJSug_6Ul18Uk9"
);

async function loadProducts() {
    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id");

    const luoiSanPham = document.getElementById("danh-sach-san-pham");

    if (error) {
        console.error(error);
        luoiSanPham.innerHTML = `
            <p>Không thể tải sản phẩm.</p>
        `;
        return;
    }

    if (data.length === 0) {
        luoiSanPham.innerHTML = `
            <p>Hiện chưa có sản phẩm nào.</p>
        `;
        return;
    }

    luoiSanPham.innerHTML = "";

    data.forEach(product => {
    // Xử lý hiển thị giá nếu bị null hoặc trống
    const displayPrice = product.price ? product.price : "Liên hệ";
    
    luoiSanPham.innerHTML += `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image_url}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300'">
                ${product.status ? `<span class="product-status-badge">${product.status}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name" title="${product.name}">${product.name}</h3>
                
                <div class="product-meta-bottom">
                    <div class="product-price-box">
                        <span class="price-label">Giá tương đối:</span>
                        <span class="price-current">${displayPrice}</span>
                    </div>
                    <div class="product-actions">
                        <a href="chitiet-sanpham.html?id=${product.id}" class="btn-view-detail">
                            Xem Chi Tiết
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
});
}

// Chạy khi trang web tải xong
document.addEventListener("DOMContentLoaded", () => {
    // 1. Gọi hàm lần đầu tiên ngay lập tức khi vào trang
    loadProducts();

    // 2. Thiết lập chạy lại hàm này sau mỗi 1 phút (60000ms)
    setInterval(() => {
        console.log("Đang tự động cập nhật lại danh sách sản phẩm...");
        loadProducts();
    }, 60000); 
});