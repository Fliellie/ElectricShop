const supabaseClient = window.supabase.createClient(
    "https://eufiogyuvfvanasqjvev.supabase.co",
    "sb_publishable_IvnP5PqePMNxS3HeAbJSug_6Ul18Uk9"
);

async function loadProducts() {

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id");

    const luoiSanPham =
        document.getElementById("danh-sach-san-pham");

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

        luoiSanPham.innerHTML += `
            <div class="product-card">

                <div class="product-image">
                    <img
                        src="${product.image_url}"
                        alt="${product.name}"
                    >
                </div>

                <div class="product-info">

                    <h3 class="product-name">
                        ${product.name}
                    </h3>

                    <p>
                        <strong>Hãng:</strong>
                        ${product.brand}
                    </p>

                    <p>
                        <strong>Nhà sản xuất:</strong>
                        ${product.manufacturer}
                    </p>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-price-box">
                        <span class="price-current">
                            ${product.status}
                        </span>
                    </div>

                    <div class="product-actions">
                        <a
                            href="chitiet-sanpham.html?id=${product.id}"
                            class="btn-view-detail"
                        >
                            Xem Chi Tiết
                        </a>
                    </div>

                </div>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});
