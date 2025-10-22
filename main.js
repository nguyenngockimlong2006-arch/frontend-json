// ================== Product Class ================== //
class Product {
    constructor(id, name, price, image, category, hot, description) {
        this.id = id;
        this.name = name;
        this.price = Number(price) || 0;
        this.image = image;
        this.category = category;
        this.hot = !!hot;
        this.description = description || "";
    }

    render() {
        const priceFormatted = this.price.toLocaleString('vi-VN');
        const hotBadge = this.hot ? '<div class="hot-badge">HOT</div>' : '';

        return `
            <div class="product" data-id="${this.id}">
                ${hotBadge}
                <img src="${this.image}" alt="${this.name}">
                <a href="detail.html?id=${this.id}"><h3>${this.name}</h3></a>
                <p class="price-text">Giá: ${priceFormatted} đ</p>
                <p class="category-text">Danh mục: ${this.category}</p>
                <p class="description-short">${(this.description||'').substring(0, 50)}...</p>
                <div class="product-buttons">
                    <button class="add-cart" data-id="${this.id}">🛒 Thêm giỏ</button>
                    <button class="buy-now" data-id="${this.id}">⚡ Mua ngay</button>
                </div>
            </div>
        `;
    }

    renderDetail() {
        return `
        <div class="container my-5 " id="detail-product">
            <div class="d-flex gap-4 product">
                <div class="col-md-6 p-4 rounded-2 shadow position-relative" style="max-width: 350px;">
                    <img src="${this.image}" class="img-fluid rounded shadow" alt="${this.name}">
                    ${this.hot ? `<span class="badge bg-danger position-absolute">HOT</span>` : ""}
                </div>
                <div class="d-flex flex-column justify-content-between">
                    <div class="d-flex flex-column justify-content-between">
                        <h2>${this.name}</h2>
                        <p class="text-muted">Danh mục: ${this.category}</p>
                        <h4 class="text-danger price">${this.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
                        <p>${this.description}</p>
                    </div>
                    <div class="mt-3 d-flex gap-2 align-items-center actions">
                        <button class="btn btn-outline-primary btn-buy"><i class="bi bi-cart-check fs-5"></i> Thêm vào giỏ hàng</button>
                        <a href="index.html" class="text-secondary text-decoration-none btn-cart" style="height: fit-content;"><i class="bi bi-arrow-left"></i> Quay lại</a>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

// ================== BIẾN TOÀN CỤC ================== //
// giữ biến cart global để tương thích code cũ
let cart = JSON.parse(localStorage.getItem('klstore_cart')) || [];
let cartCountEl, cartModal, cartItemsEl, cartTotalEl;
let productHot, productLaptop, productDienThoai, productListPhone, productListLaptop;
let checkoutItemsEl, subTotalEl, grandTotalEl;

// ================== HEADER / FOOTER / MODAL TRƯỚC, RỒI CHỌN PHẦN TỬ ================== //
document.addEventListener("DOMContentLoaded", () => {
    // --- Header ---
    const headerHTML = `
    <header class="header">
        <div class="header-container">
            <div class="logo">KLSTORE<span style="color:#f97316;">.VN</span></div>
            <nav class="nav">
                <ul>
                    <li><a href="index.html">Trang chủ</a></li>
                    <li><a href="laptop.html">Laptop</a></li>
                    <li><a href="phone.html">Điện thoại</a></li>
                    <li><a href="#">Phụ kiện</a></li>
                    <li><a href="#">Liên hệ</a></li>
                </ul>
            </nav>
            <div class="search-box-and-cart">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Tìm kiếm sản phẩm...">
                    <button id="searchBtn">🔍</button>
                </div>
                <div class="cart" id="cartIcon">🛒 <span id="cartCount">0</span></div>
            </div>
        </div>
    </header>`;
    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    // --- Footer ---
    const footerHTML = `
    <footer>
        <div class="footer-container">
            <div class="footer-col">
                <h3>Về chúng tôi</h3>
                <p>KLStore chuyên cung cấp laptop, điện thoại, phụ kiện chính hãng.</p>
            </div>
            <div class="footer-col">
                <h3>Liên hệ</h3>
                <ul>
                    <li>📍 Gò Vấp, TP.HCM</li>
                    <li>📞 0909 123 456</li>
                    <li>✉️ KLStore@shop.com</li>
                </ul>
            </div>
            <div class="footer-col">
                <h3>Theo dõi</h3>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">YouTube</a></li>
                    <li><a href="#">Instagram</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">© 2025 KLSTORE.VN</div>
    </footer>`;
    document.body.insertAdjacentHTML("beforeend", footerHTML);

    // --- Cart Modal ---
    const cartModalHTML = `
    <div id="cartModal" class="cart-modal" style="display:none;">
        <div class="cart-modal-content">
            <span id="closeCart" class="close-cart">&times;</span>
            <h2>🛒 Giỏ hàng của bạn</h2>
            <div id="cartItems" class="cart-items"></div>
            <div class="cart-footer">
                <p>Tổng tiền: <strong id="cartTotal">0 đ</strong></p>
                <div class="cart-actions">
                    <button class="checkout-btn">Thanh toán</button>
                    <button class="clear-cart-btn" style="margin-left:8px;">Xóa hết</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", cartModalHTML);

    // --- Bây giờ DOM đã có header/footer/modal -> chọn các phần tử DOM ---
    cartCountEl = document.getElementById("cartCount");
    cartModal = document.getElementById("cartModal");
    cartItemsEl = document.getElementById("cartItems");
    cartTotalEl = document.getElementById("cartTotal");

    productHot = document.getElementById('product-hot');
    productLaptop = document.getElementById('product-laptop');
    productDienThoai = document.getElementById('product-dienthoai');
    productListPhone = document.getElementById('product-list-phone');
    productListLaptop = document.getElementById('product-list-laptop');

    checkoutItemsEl = document.getElementById('checkoutItems');
    subTotalEl = document.getElementById('subTotal');
    grandTotalEl = document.getElementById('grandTotal');

    // Bắt đầu tải dữ liệu sản phẩm
    fetchAndRenderProducts();
});

// ================== CLASS CART (cải tiến, tương thích ngược) ================== //
class Cart {
    constructor() {
        this.key = 'klstore_cart';
        this.items = JSON.parse(localStorage.getItem(this.key)) || [];
        // đảm bảo biến global cart đồng bộ
        cart = this.items;
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        cart = this.items;
    }

    // add product object: {id, name, price, image, ...}
    add(product) {
        if (!product || product.id == null) {
            // nếu thiếu id, tạo id tạm thời
            const tmpId = 'tmp_' + Date.now();
            this.items.push({...product, id: tmpId, quantity: 1});
        } else {
            const existing = this.items.find(i => String(i.id) === String(product.id));
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                this.items.push({...product, quantity: 1});
            }
        }
        this.save();
        this.render();
        alert(`✅ Đã thêm ${product.name} vào giỏ hàng!`);
    }

    // set items (dùng cho mua ngay)
    setAll(items) {
        this.items = items.map(it => ({...it, quantity: it.quantity || 1}));
        this.save();
        this.render();
    }

    remove(index) {
        if (index < 0 || index >= this.items.length) return;
        this.items.splice(index, 1);
        this.save();
        this.render();
    }

    updateQuantity(index, qty) {
        if (index < 0 || index >= this.items.length) return;
        if (qty <= 0) {
            this.items.splice(index, 1);
        } else {
            this.items[index].quantity = qty;
        }
        this.save();
        this.render();
    }

    changeQuantityBy(index, delta) {
        if (index < 0 || index >= this.items.length) return;
        this.updateQuantity(index, (this.items[index].quantity || 1) + delta);
    }

    clear() {
        this.items = [];
        this.save();
        this.render();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (Number(item.price) || 0) * (item.quantity || 1), 0);
    }

    render() {
        // cập nhật DOM refs nếu cần
        cartItemsEl = cartItemsEl || document.getElementById("cartItems");
        cartCountEl = cartCountEl || document.getElementById("cartCount");
        cartTotalEl = cartTotalEl || document.getElementById("cartTotal");

        if (!cartItemsEl || !cartCountEl || !cartTotalEl) return;

        cartItemsEl.innerHTML = "";
        if (this.items.length === 0) {
            cartItemsEl.innerHTML = `<p class="empty-cart" style="text-align:center; color: var(--muted);">Giỏ hàng trống.</p>`;
        } else {
            this.items.forEach((item, index) => {
                const row = document.createElement("div");
                row.classList.add("cart-item");
                row.style.display = "flex";
                row.style.gap = "8px";
                row.style.alignItems = "center";
                row.innerHTML = `
                    ${item.image ? `<img src="${item.image}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">` : ''}
                    <div style="flex:1;min-width:0">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <strong style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px;">${item.name}</strong>
                            <span>${((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
                            <button class="qty-minus" data-index="${index}">-</button>
                            <input class="qty-input" data-index="${index}" value="${item.quantity || 1}" style="width:48px;text-align:center;">
                            <button class="qty-plus" data-index="${index}">+</button>
                            <button class="remove-btn" data-index="${index}" style="margin-left:8px;">Xóa</button>
                        </div>
                    </div>
                `;
                cartItemsEl.appendChild(row);
            });
        }

        // cập nhật tổng & badge
        cartTotalEl.textContent = this.getTotal().toLocaleString('vi-VN') + " đ";
        const totalQty = this.items.reduce((s, it) => s + (it.quantity || 1), 0);
        cartCountEl.textContent = totalQty;

        // attach events
        cartItemsEl.querySelectorAll(".remove-btn").forEach(btn => {
            btn.onclick = (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                this.remove(idx);
                if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
            };
        });
        cartItemsEl.querySelectorAll(".qty-plus").forEach(btn => {
            btn.onclick = (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                this.changeQuantityBy(idx, 1);
                if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
            };
        });
        cartItemsEl.querySelectorAll(".qty-minus").forEach(btn => {
            btn.onclick = (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                this.changeQuantityBy(idx, -1);
                if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
            };
        });
        cartItemsEl.querySelectorAll(".qty-input").forEach(input => {
            input.onchange = (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                let v = parseInt(e.currentTarget.value) || 1;
                if (v < 1) v = 1;
                this.updateQuantity(idx, v);
                if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
            };
        });
    }
}

// tạo instance dùng chung
const cart1 = new Cart();
cart1.render(); // render lần đầu nếu có dữ liệu localStorage

// backward-compatible helpers (giữ API cũ)
function saveCart() {
    cart1.save();
}
function renderCart() {
    cart1.render();
}

// ================== CHECKOUT ================== //
function renderCheckoutSummary() {
    checkoutItemsEl = checkoutItemsEl || document.getElementById('checkoutItems');
    subTotalEl = subTotalEl || document.getElementById('subTotal');
    grandTotalEl = grandTotalEl || document.getElementById('grandTotal');
    if (!checkoutItemsEl || !subTotalEl || !grandTotalEl) return;

    checkoutItemsEl.innerHTML = "";
    let subTotal = 0;
    const shippingFee = 0;

    if (!cart1.items || cart1.items.length === 0) {
        checkoutItemsEl.innerHTML = `<p style="text-align:center; color:var(--hot);">Giỏ hàng trống! Quay lại trang chủ.</p>`;
        document.querySelector('.checkout-submit-btn')?.setAttribute('disabled','true');
    } else {
        cart1.items.forEach(item => {
            subTotal += (Number(item.price) || 0) * (item.quantity || 1);
            const row = document.createElement("div");
            row.classList.add("summary-item");
            row.innerHTML = `<span>${item.name} x${item.quantity || 1}</span><span>${((Number(item.price)||0)*(item.quantity||1)).toLocaleString('vi-VN')} đ</span>`;
            checkoutItemsEl.appendChild(row);
        });
        document.querySelector('.checkout-submit-btn')?.removeAttribute('disabled');
    }

    const grandTotal = subTotal + shippingFee;
    subTotalEl.textContent = subTotal.toLocaleString('vi-VN') + " đ";
    grandTotalEl.textContent = grandTotal.toLocaleString('vi-VN') + " đ";
}

function initCheckoutLogic() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;
    renderCheckoutSummary();
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!cart1.items || cart1.items.length === 0) return alert("❌ Giỏ hàng trống!");
        const name = document.getElementById('fullName')?.value || "Khách hàng";
        alert(`🎉 Đặt hàng thành công!\nCảm ơn ${name}!\nTổng: ${grandTotalEl?.textContent || ''}`);
        cart1.clear();
        // giữ tương thích
        saveCart();
        renderCart();
        window.location.href = 'index.html';
    });
}

// ================== CHUNG (button, modal, search, slider) ================== //
function initProductButtons() {
    document.querySelectorAll(".add-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pEl = e.target.closest(".product");
            const id = pEl.dataset.id || null;
            const name = pEl.querySelector("h3")?.textContent || "Sản phẩm";
            const price = parseInt((pEl.querySelector(".price-text")?.textContent || "").replace(/\D/g, "")) || 0;
            const image = pEl.querySelector("img")?.src || "";
            cart1.add({ id, name, price, image });
        });
    });

    document.querySelectorAll(".buy-now").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pEl = e.target.closest(".product");
            const id = pEl.dataset.id || null;
            const name = pEl.querySelector("h3")?.textContent || "Sản phẩm";
            const price = parseInt((pEl.querySelector(".price-text")?.textContent || "").replace(/\D/g, "")) || 0;
            const image = pEl.querySelector("img")?.src || "";
            cart1.setAll([{ id, name, price, image, quantity: 1 }]);
            window.location.href = 'checkout.html';
        });
    });
}

function initCartModal() {
    const cartIcon = document.getElementById("cartIcon");
    const closeBtn = document.getElementById("closeCart");
    const checkoutBtn = document.querySelector('#cartModal .checkout-btn');
    const clearBtn = document.querySelector('#cartModal .clear-cart-btn');
    if (!cartModal || !cartIcon || !closeBtn) return;

    cartIcon.addEventListener("click", () => { cart1.render(); cartModal.style.display = "flex"; });
    closeBtn.addEventListener("click", () => cartModal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === cartModal) cartModal.style.display = "none"; });

    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if (cart1.items.length > 0) window.location.href = 'checkout.html';
        else alert("Giỏ hàng trống!");
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
        if (confirm("Xóa toàn bộ giỏ hàng?")) cart1.clear();
    });
}

function initSearch() {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    if (!searchBtn || !searchInput) return;
    const performSearch = () => {
        const keyword = searchInput.value.toLowerCase().trim();
        document.querySelectorAll(".product").forEach(p => {
            const name = p.querySelector("h3")?.textContent.toLowerCase() || "";
            p.style.display = name.includes(keyword) ? "flex" : "none";
        });
    };
    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => { if (e.key === "Enter") performSearch(); });
}

// slider (giữ nguyên đơn giản)
let slideIndex = 0, slides = [], dots = [], timer;
function initSlider() {
    slides = document.querySelectorAll(".slide");
    const dotsContainer = document.querySelector(".dots");
    if (!slides.length || !dotsContainer) return;
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.addEventListener("click", () => showSlide(i));
        dotsContainer.appendChild(dot);
    });
    dots = dotsContainer.querySelectorAll("span");
    showSlide(0);
    timer = setInterval(() => showSlide(++slideIndex), 3000);
}
function showSlide(i) {
    if (slides.length === 0) return;
    slideIndex = (i + slides.length) % slides.length;
    document.querySelector(".slides")?.style.setProperty('transform', `translateX(-${slideIndex * 100}%)`);
    dots.forEach(d => d.classList.remove("active"));
    dots[slideIndex]?.classList.add("active");
}

// ================== HIỂN THỊ SẢN PHẨM ================== //
function displayProducts(data) {
    const renderList = (list, container) => {
        if (!container) return;
        container.innerHTML = list.map(item => new Product(item.id, item.name, item.price, item.image, item.category, item.hot, item.description).render()).join("");
    };

    // normalize category check
    const isPhoneCat = (c = '') => {
        const s = (c || '').toLowerCase();
        return s.includes('điện') || s.includes('dien') || s.includes('phone') || s.includes('đt');
    };
    const isLaptopCat = (c = '') => {
        const s = (c || '').toLowerCase();
        return s.includes('lap') || s.includes('laptop');
    };

    if (productHot) renderList(data.filter(p => p.hot), productHot);
    if (productLaptop) renderList(data.filter(p => isLaptopCat(p.category)), productLaptop);
    if (productDienThoai) renderList(data.filter(p => isPhoneCat(p.category)), productDienThoai);
    if (productListPhone) renderList(data.filter(p => isPhoneCat(p.category)), productListPhone);
    if (productListLaptop) renderList(data.filter(p => isLaptopCat(p.category)), productListLaptop);

    // sau khi render xong -> khởi tạo các event
    initializeApplication();
}

// ================== DETAIL PAGE ================== //
const productDetailDiv = document.getElementById('detail-product');
if (productDetailDiv) {
    const id = new URLSearchParams(window.location.search).get('id');
    fetch(`https://raw.githubusercontent.com/nguyenngockimlong2006-arch/backend-json/refs/heads/main/db.json`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            const product = new Product(data.id, data.name, data.price, data.image, data.category, data.hot, data.description);
            productDetailDiv.innerHTML = product.renderDetail();
            // thêm event button "Thêm vào giỏ" trên trang detail (nếu cần)
            document.querySelector(".btn-buy")?.addEventListener("click", () => {
                cart1.add({ id: data.id, name: data.name, price: data.price, image: data.image });
            });
        })
        .catch(() => {
            productDetailDiv.innerHTML = `<p style="color:var(--hot);">Không tìm thấy sản phẩm (server có thể tắt).</p>`;
        });
}

// ================== FETCH PRODUCTS (có fallback demo) ================== //
function fetchAndRenderProducts() {
    // nếu trên trang không có vùng hiển thị sản phẩm thì vẫn khởi tạo app
    const hasProductArea = document.getElementById('product-hot') || document.getElementById('product-list-phone') || document.getElementById('product-list-laptop') || document.getElementById('product-laptop') || document.getElementById('product-dienthoai');

    if (!hasProductArea) {
        // vẫn khởi tạo các chức năng (cart, modal...)
        initializeApplication();
        return;
    }

    fetch('https://raw.githubusercontent.com/nguyenngockimlong2006-arch/backend-json/refs/heads/main/db.json')
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(displayProducts)
        .catch(() => {
            // fallback demo data nếu server JSON không chạy
            const demo = [
                { id: 1, name: "Laptop Gaming ASUS", price: 25000000, image: "img/laptop1.png", category: "Laptop", hot: true, description: "Demo ASUS Gaming - cấu hình tốt" },
                { id: 2, name: "MacBook Air M3", price: 32990000, image: "img/macbookair.png", category: "Laptop", hot: false, description: "Demo MacBook Air M3" },
                { id: 3, name: "iPhone 15 Pro", price: 28990000, image: "img/iphone15.png", category: "Điện thoại", hot: true, description: "Demo iPhone 15 Pro" },
                { id: 4, name: "Samsung S24", price: 20000000, image: "img/s24.png", category: "Điện thoại", hot: false, description: "Demo Samsung S24" }
            ];
            displayProducts(demo);
        });
}

// ================== KHỞI TẠO CHUNG (gắn event sau khi render) ================== //
function initializeApplication() {
    initCartModal();
    initProductButtons();
    initSearch();
    initSlider();
    if (document.getElementById('checkoutForm')) initCheckoutLogic();
}



