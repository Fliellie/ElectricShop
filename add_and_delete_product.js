// Khởi tạo Supabase Client
const supabaseClient = window.supabase.createClient(
    "https://eufiogyuvfvanasqjvev.supabase.co",
    "sb_publishable_IvnP5PqePMNxS3HeAbJSug_6Ul18Uk9"
);

/**
 * Hàm định dạng mốc thời gian ISO từ Supabase thành dạng chuỗi ngày tháng dễ đọc (Việt Nam)
 */
function formatTime(isoString) {
    if (!isoString) return "Chưa rõ";
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * HÀM 1: Tải danh sách sản phẩm từ Supabase và đổ vào bảng bên trái
 */
async function loadProducts() {
    const tableBody = document.getElementById("product-table-body");
    if (!tableBody) return;

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 20px; color: #dc2626; font-weight: 500;">
                    Lỗi: Không thể tải sản phẩm từ hệ thống.
                </td>
            </tr>
        `;
        return;
    }

    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 20px; color: #64748b;">
                    Hiện tại hệ thống dữ liệu chưa có sản phẩm nào.
                </td>
            </tr>
        `;
        return;
    }

    let tableHTML = "";

    data.forEach(product => {
        const id = product.id || "";
        const timeCreated = formatTime(product.created_at);
        const name = product.name || "Chưa đặt tên";
        const price = product.price || "null";
        const description = product.description || "";
        const brand = product.brand || "";
        const manufacturer = product.manufacturer || "";
        const status = product.status || "";
        const imageUrl = product.image_url || "https://via.placeholder.com/40";

        tableHTML += `
            <tr>
                <td title="${id}">${id}</td>
                <td title="${timeCreated}">${timeCreated}</td>
                <td title="${name}"><strong>${name}</strong></td>
                <td title="${price}">${price}</td>
                <td title="${description}">${description}</td>
                <td title="${brand}">${brand}</td>
                <td title="${manufacturer}">${manufacturer}</td>
                <td title="${status}">${status}</td>
                <td>
                    <img src="${imageUrl}" class="img-preview" alt="${name}" onerror="this.src='https://via.placeholder.com/40'">
                </td>
                <td class="actions-cell">
                    <button class="btn-action btn-edit" onclick="editProduct(${id})">Sửa</button>
                    <button class="btn-action btn-delete" onclick="deleteProduct(${id})">Xóa</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = tableHTML;
}

/**
 * HÀM 2: Thêm sản phẩm mới vào Supabase
 */
async function addProduct(event) {
    event.preventDefault(); // Chặn reload trang

    const productForm = document.getElementById('product-form');
    const boxImgPreview = document.getElementById('box-img-preview');

    // Lấy giá trị từ các ô nhập liệu
    const name = document.getElementById('product-name').value.trim();
    const price = document.getElementById('product-price').value.trim();
    const description = document.getElementById('product-desc').value.trim();
    const brand = document.getElementById('product-brand').value.trim();
    const manufacturer = document.getElementById('product-manufacturer').value.trim();
    const status = document.getElementById('product-status').value.trim();
    
    // ĐỘT PHÁ Ở ĐÂY: Lấy trực tiếp dữ liệu nguồn từ ô vuông Preview (Chứa được cả link mạng lẫn Base64 của file vừa dán)
    let imageUrl = "";
    if (boxImgPreview && boxImgPreview.style.display !== 'none') {
        imageUrl = boxImgPreview.src;
    }

    // Đối tượng dữ liệu gửi lên Supabase
    const newProduct = {
        name: name,
        price: price || null, 
        description: description,
        brand: brand,
        manufacturer: manufacturer,
        status: status,
        image_url: imageUrl
    };

    // Gọi API lệnh Insert của Supabase
    const { data, error } = await supabaseClient
        .from("products")
        .insert([newProduct]);

    if (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Thêm sản phẩm thất bại! Vui lòng kiểm tra lại kết nối.");
    } else {
        alert("Thêm sản phẩm thành công!");
        if (productForm) productForm.reset(); // Xóa sạch form nhập liệu
        resetImagePreview(); // Reset lại ô vuông xem trước ảnh
        loadProducts(); // Tải lại bảng ngay lập tức để cập nhật danh sách
    }
}

/**
 * HÀM 3: Xóa sản phẩm khỏi Supabase dựa vào ID
 */
async function deleteProduct(id) {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm có ID: ${id} không?`)) {
        return; 
    }

    const { error } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Không thể xóa sản phẩm này. Hãy kiểm tra lại quyền hoặc kết nối.");
    } else {
        alert(`Đã xóa sản phẩm ID ${id} thành công!`);
        loadProducts(); // Cập nhật lại danh sách bảng
    }
}

/**
 * HÀM KHUNG: Sửa sản phẩm
 */
function editProduct(id) {
    alert("Tính năng sửa sản phẩm có ID: " + id + " đang được phát triển.");
}

/**
 * HÀM RESET KHUNG XEM TRƯỚC ẢNH
 */
function resetImagePreview() {
    const boxImgPreview = document.getElementById('box-img-preview');
    const uploadText = document.getElementById('upload-text');
    const fileInput = document.getElementById('product-image-file');
    if (boxImgPreview && uploadText) {
        boxImgPreview.src = '';
        boxImgPreview.style.display = 'none';
        uploadText.style.display = 'block';
    }
    if (fileInput) fileInput.value = ""; // Xóa dữ liệu file cũ
}

/**
 * HÀM CLICK VÀO Ô VUÔNG ĐỂ CHỌN HOẶC NHẬP LINK
 */
function triggerImageInput() {
    const fileInput = document.getElementById('product-image-file');
    const imageUrlInput = document.getElementById('product-image-url');
    
    // Tạo lựa chọn cho người dùng
    const choice = confirm("Bấm OK để CHỌN FILE ẢNH từ máy tính.\nBấm CANCEL nếu bạn muốn DÁN LINK URL từ Internet.");
    
    if (choice) {
        if (fileInput) fileInput.click();
    } else {
        const URLPrompt = prompt("Nhập hoặc dán link ảnh từ Internet (https://...):");
        if (URLPrompt && imageUrlInput) {
            imageUrlInput.value = URLPrompt;
            imageUrlInput.dispatchEvent(new Event('input')); 
        }
    }
}

/**
 * HÀM XỬ LÝ KHI PASTE (CTRL+V) ẢNH
 */
function handleImagePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    const boxImgPreview = document.getElementById('box-img-preview');
    const uploadText = document.getElementById('upload-text');
    const imageUrlInput = document.getElementById('product-image-url');

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === 0) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (boxImgPreview && uploadText) {
                    boxImgPreview.src = e.target.result;
                    boxImgPreview.style.display = 'block';
                    uploadText.style.display = 'none';
                    
                    if (imageUrlInput) imageUrlInput.value = "[Ảnh được dán từ Clipboard]";
                }
            };
            
            reader.readAsDataURL(blob);
            break; 
        }
    }
}

/**
 * KHỞI CHẠY LẮP GHÉP SỰ KIỆN KHI TRANG TẢI XONG (BẢO VỆ DOM)
 */
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', addProduct);
    }

    const imageUrlInput = document.getElementById('product-image-url');
    const boxImgPreview = document.getElementById('box-img-preview');
    const uploadText = document.getElementById('upload-text');
    const fileInput = document.getElementById('product-image-file');
    const uploadBox = document.getElementById('upload-box');

    // 1. Xử lý khi người dùng gõ/dán link URL vào textarea
    if (imageUrlInput) {
        imageUrlInput.addEventListener('input', function() {
            const url = this.value.trim();
            if (url && boxImgPreview && uploadText) {
                boxImgPreview.src = url;
                boxImgPreview.style.display = 'block';
                uploadText.style.display = 'none';
            } else {
                resetImagePreview();
            }
        });
    }

    // 2. Xử lý hiển thị Preview khi người dùng chọn file từ máy (Browse)
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (boxImgPreview && uploadText) {
                        boxImgPreview.src = event.target.result;
                        boxImgPreview.style.display = 'block';
                        uploadText.style.display = 'none';
                        if (imageUrlInput) imageUrlInput.value = "[Ảnh đã chọn từ máy]";
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. Kích hoạt tiêu điểm nhận diện Ctrl+V cho ô upload
    if (uploadBox) {
        uploadBox.setAttribute('tabindex', '0');
    }

    // Tự động làm mới bảng sau 1 phút
    setInterval(loadProducts, 60000);
});