// ================== ADMIN APPLICATION ================== //
class AdminApp {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.users = [];
        this.orders = [];
        this.currentPage = 'dashboard';
        this.editingProduct = null;
        this.editingUser = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.showAdminApp();
        this.updateAdminInfo();
    }

    // ================== DATA MANAGEMENT ================== //
    async loadData() {
        try {
            // Load products
            const productsResponse = await fetch('http://localhost:3000/products');
            if (productsResponse.ok) {
                this.products = await productsResponse.json();
            } else {
                // Fallback to local data
                this.products = this.getLocalProducts();
            }

            // Load users
            const usersResponse = await fetch('http://localhost:3000/users');
            if (usersResponse.ok) {
                this.users = await usersResponse.json();
            } else {
                // Fallback to local data
                this.users = this.getLocalUsers();
            }

            // Load orders (mock data for now)
            this.orders = this.getMockOrders();

            this.updateDashboard();
        } catch (error) {
            console.error('Error loading data:', error);
            // Use fallback data
            this.products = this.getLocalProducts();
            this.users = this.getLocalUsers();
            this.orders = this.getMockOrders();
            this.updateDashboard();
        }
    }

    getLocalProducts() {
        return [
            {
                id: 1,
                name: "Iphone 14",
                price: 20000000,
                image: "img/iphone.jpg",
                category: "điện thoại",
                hot: true,
                description: "iPhone 14 với thiết kế sang trọng, màn hình Super Retina XDR 6.1 inch, chip A15 Bionic mạnh mẽ, camera kép cải tiến và hỗ trợ 5G."
            },
            {
                id: 2,
                name: "Samsung S23",
                price: 18000000,
                image: "img/samsung.jpg",
                category: "điện thoại",
                hot: false,
                description: "Samsung Galaxy S23 sở hữu màn hình Dynamic AMOLED 2X, Snapdragon 8 Gen 2 mạnh mẽ, camera 50MP chụp đêm xuất sắc."
            },
            {
                id: 3,
                name: "Xiaomi 13",
                price: 15000000,
                image: "img/xiaomi.jpg",
                category: "điện thoại",
                hot: false,
                description: "Xiaomi 13 trang bị Snapdragon 8 Gen 2, màn hình AMOLED 120Hz, hệ thống camera Leica ấn tượng, pin 4500mAh sạc nhanh 67W."
            },
            {
                id: 4,
                name: "Vivo X30",
                price: 7000000,
                image: "img/vivo.jpg",
                category: "điện thoại",
                hot: true,
                description: "Vivo X30 với thiết kế trẻ trung, màn hình AMOLED 6.44 inch, camera 64MP, chip Exynos 980 và pin 4350mAh."
            },
            {
                id: 5,
                name: "Macbook Pro 2023",
                price: 55000000,
                image: "img/macbook.jpg",
                category: "laptop",
                hot: true,
                description: "MacBook Pro 2023 dùng chip Apple M2 Pro, màn hình Liquid Retina XDR, hiệu năng mạnh mẽ, pin lâu và thiết kế sang trọng."
            },
            {
                id: 6,
                name: "Dell XPS 13",
                price: 35000000,
                image: "img/dell.jpg",
                category: "laptop",
                hot: false,
                description: "Dell XPS 13 với màn hình InfinityEdge 13.4 inch, Intel Core thế hệ 12, thiết kế mỏng nhẹ, pin bền bỉ, phù hợp cho công việc."
            },
            {
                id: 7,
                name: "Asus Zenbook",
                price: 25000000,
                image: "img/asus.jpg",
                category: "laptop",
                hot: false,
                description: "Asus ZenBook với thiết kế siêu mỏng, màn hình OLED 14 inch, CPU Intel thế hệ mới, bàn phím NumberPad độc đáo."
            },
            {
                id: 8,
                name: "HP Envy",
                price: 20000000,
                image: "img/hp.jpg",
                category: "laptop",
                hot: true,
                description: "HP Envy sở hữu thiết kế kim loại sang trọng, màn hình 15.6 inch Full HD, hiệu năng mạnh mẽ với Intel Core i7, âm thanh Bang & Olufsen."
            }
        ];
    }

    getLocalUsers() {
        return [
            {
                id: 1,
                name: "Nguyen Van A",
                email: "vana@example.com",
                password: "123456"
            },
            {
                id: 2,
                name: "Tran Thi B",
                email: "thib@example.com",
                password: "abcdef"
            },
            {
                id: 3,
                name: "Le Van C",
                email: "vanc@example.com",
                password: "qwerty"
            }
        ];
    }

    getMockOrders() {
        return [
            {
                id: "ORD001",
                customer: "Nguyen Van A",
                products: "iPhone 14 x1, MacBook Pro x1",
                total: 75000000,
                status: "Đã giao",
                date: "2024-01-15"
            },
            {
                id: "ORD002",
                customer: "Tran Thi B",
                products: "Samsung S23 x2",
                total: 36000000,
                status: "Đang xử lý",
                date: "2024-01-16"
            }
        ];
    }

    // ================== AUTHENTICATION ================== //
    showAdminApp() {
        document.getElementById('adminApp').style.display = 'flex';
    }

    updateAdminInfo() {
        const adminName = document.getElementById('adminName');
        if (adminName) {
            adminName.textContent = 'Admin User';
        }
    }

    // ================== NAVIGATION ================== //
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show selected page
        const targetPage = document.getElementById(pageId + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        const titles = {
            dashboard: 'Dashboard',
            products: 'Quản lý sản phẩm',
            users: 'Quản lý người dùng',
            orders: 'Quản lý đơn hàng',
            settings: 'Cài đặt'
        };
        if (pageTitle) {
            pageTitle.textContent = titles[pageId] || 'Admin Panel';
        }

        this.currentPage = pageId;

        // Load page-specific data
        this.loadPageData(pageId);
    }

    loadPageData(pageId) {
        switch (pageId) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'products':
                this.renderProductsTable();
                break;
            case 'users':
                this.renderUsersTable();
                break;
            case 'orders':
                this.renderOrdersTable();
                break;
        }
    }

    // ================== DASHBOARD ================== //
    updateDashboard() {
        // Update stats
        document.getElementById('totalProducts').textContent = this.products.length;
        document.getElementById('totalUsers').textContent = this.users.length;
        document.getElementById('totalOrders').textContent = this.orders.length;
        
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('vi-VN') + 'đ';

        // Update charts
        this.updateHotProductsChart();
        this.updateCategoryChart();
    }

    updateHotProductsChart() {
        const hotProducts = this.products.filter(p => p.hot);
        const container = document.getElementById('hotProductsChart');
        
        container.innerHTML = hotProducts.map(product => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${product.name}</strong>
                    <br>
                    <small style="color: #666;">${product.price.toLocaleString('vi-VN')}đ</small>
                </div>
                <span class="badge badge-danger">HOT</span>
            </div>
        `).join('');
    }

    updateCategoryChart() {
        const categories = {};
        this.products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
        });

        const container = document.getElementById('categoryChart');
        container.innerHTML = Object.entries(categories).map(([category, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <span>${category}</span>
                <span class="badge badge-info">${count} sản phẩm</span>
            </div>
        `).join('');
    }

    // ================== PRODUCT MANAGEMENT ================== //
    renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString('vi-VN')}đ</td>
                <td>${product.category}</td>
                <td>${product.hot ? '<span class="badge badge-danger">HOT</span>' : '<span class="badge badge-info">Thường</span>'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="adminApp.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminApp.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    }

    addProduct() {
        this.editingProduct = null;
        this.showProductModal();
    }

    editProduct(id) {
        this.editingProduct = this.products.find(p => p.id === id);
        this.showProductModal();
    }

    showProductModal() {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');

        if (this.editingProduct) {
            title.textContent = 'Sửa sản phẩm';
            form.productName.value = this.editingProduct.name;
            form.productPrice.value = this.editingProduct.price;
            form.productCategory.value = this.editingProduct.category;
            form.productDescription.value = this.editingProduct.description;
            form.productHot.checked = this.editingProduct.hot;
            
            // Hiển thị hình ảnh hiện tại
            const fileName = document.getElementById('fileName');
            const imagePreview = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            
            fileName.textContent = this.editingProduct.image || 'Chưa chọn file';
            if (this.editingProduct.image) {
                previewImg.src = this.editingProduct.image;
                imagePreview.style.display = 'block';
            } else {
                imagePreview.style.display = 'none';
            }
        } else {
            title.textContent = 'Thêm sản phẩm';
            form.reset();
            document.getElementById('fileName').textContent = 'Chưa chọn file';
            document.getElementById('imagePreview').style.display = 'none';
        }

        modal.classList.add('show');
    }

    hideProductModal() {
        document.getElementById('productModal').classList.remove('show');
        this.editingProduct = null;
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        const fileName = document.getElementById('fileName');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        if (file) {
            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file hình ảnh!');
                event.target.value = '';
                return;
            }

            // Kiểm tra kích thước file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước file không được vượt quá 5MB!');
                event.target.value = '';
                return;
            }

            // Hiển thị tên file
            fileName.textContent = file.name;

            // Tạo preview
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            fileName.textContent = 'Chưa chọn file';
            imagePreview.style.display = 'none';
        }
    }

    saveProduct(formData) {
        const fileInput = document.getElementById('productImage');
        let imagePath = '';
        
        // Xử lý file upload
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            // Tạo URL tạm thời cho file đã chọn
            imagePath = URL.createObjectURL(file);
        } else if (this.editingProduct && this.editingProduct.image) {
            // Giữ nguyên hình ảnh cũ nếu không chọn file mới
            imagePath = this.editingProduct.image;
        } else {
            // Sử dụng hình ảnh mặc định
            imagePath = 'img/default-product.jpg';
        }

        const productData = {
            name: formData.productName.value,
            price: parseInt(formData.productPrice.value),
            image: imagePath,
            category: formData.productCategory.value,
            description: formData.productDescription.value,
            hot: formData.productHot.checked
        };

        if (this.editingProduct) {
            // Update existing product
            const index = this.products.findIndex(p => p.id === this.editingProduct.id);
            this.products[index] = { ...this.editingProduct, ...productData };
        } else {
            // Add new product
            const newId = Math.max(...this.products.map(p => p.id)) + 1;
            this.products.push({ id: newId, ...productData });
        }

        this.renderProductsTable();
        this.updateDashboard();
        this.hideProductModal();
        this.showNotification('Sản phẩm đã được lưu thành công!', 'success');
    }

    deleteProduct(id) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.renderProductsTable();
            this.updateDashboard();
            this.showNotification('Sản phẩm đã được xóa!', 'success');
        }
    }

    // ================== USER MANAGEMENT ================== //
    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${'*'.repeat(user.password.length)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="adminApp.editUser(${user.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminApp.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    }

    addUser() {
        this.editingUser = null;
        this.showUserModal();
    }

    editUser(id) {
        this.editingUser = this.users.find(u => u.id === id);
        this.showUserModal();
    }

    showUserModal() {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('userModalTitle');
        const form = document.getElementById('userForm');

        if (this.editingUser) {
            title.textContent = 'Sửa người dùng';
            form.userName.value = this.editingUser.name;
            form.userEmail.value = this.editingUser.email;
            form.userPassword.value = this.editingUser.password;
        } else {
            title.textContent = 'Thêm người dùng';
            form.reset();
        }

        modal.classList.add('show');
    }

    hideUserModal() {
        document.getElementById('userModal').classList.remove('show');
        this.editingUser = null;
    }

    saveUser(formData) {
        const userData = {
            name: formData.userName.value,
            email: formData.userEmail.value,
            password: formData.userPassword.value
        };

        if (this.editingUser) {
            // Update existing user
            const index = this.users.findIndex(u => u.id === this.editingUser.id);
            this.users[index] = { ...this.editingUser, ...userData };
        } else {
            // Add new user
            const newId = Math.max(...this.users.map(u => u.id)) + 1;
            this.users.push({ id: newId, ...userData });
        }

        this.renderUsersTable();
        this.updateDashboard();
        this.hideUserModal();
        this.showNotification('Người dùng đã được lưu thành công!', 'success');
    }

    deleteUser(id) {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            this.users = this.users.filter(u => u.id !== id);
            this.renderUsersTable();
            this.updateDashboard();
            this.showNotification('Người dùng đã được xóa!', 'success');
        }
    }

    // ================== ORDERS MANAGEMENT ================== //
    renderOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        if (this.orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;">
                        Chưa có đơn hàng nào
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.products}</td>
                <td>${order.total.toLocaleString('vi-VN')}đ</td>
                <td><span class="badge badge-${this.getOrderStatusClass(order.status)}">${order.status}</span></td>
                <td>${order.date}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="adminApp.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getOrderStatusClass(status) {
        const statusClasses = {
            'Đã giao': 'success',
            'Đang xử lý': 'warning',
            'Đã hủy': 'danger',
            'Chờ xác nhận': 'info'
        };
        return statusClasses[status] || 'info';
    }

    viewOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            alert(`Đơn hàng: ${order.id}\nKhách hàng: ${order.customer}\nSản phẩm: ${order.products}\nTổng tiền: ${order.total.toLocaleString('vi-VN')}đ\nTrạng thái: ${order.status}`);
        }
    }

    // ================== SEARCH & FILTER ================== //
    filterProducts() {
        const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const hotFilter = document.getElementById('hotFilter')?.value || '';

        let filteredProducts = this.products;

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
        }

        if (hotFilter !== '') {
            filteredProducts = filteredProducts.filter(p => p.hot === (hotFilter === 'true'));
        }

        this.renderFilteredProducts(filteredProducts);
    }

    renderFilteredProducts(products) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
                <td>${product.name}</td>
                <td>${product.price.toLocaleString('vi-VN')}đ</td>
                <td>${product.category}</td>
                <td>${product.hot ? '<span class="badge badge-danger">HOT</span>' : '<span class="badge badge-info">Thường</span>'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="adminApp.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminApp.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterUsers() {
        const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
        
        let filteredUsers = this.users;

        if (searchTerm) {
            filteredUsers = filteredUsers.filter(u => 
                u.name.toLowerCase().includes(searchTerm) ||
                u.email.toLowerCase().includes(searchTerm)
            );
        }

        this.renderFilteredUsers(filteredUsers);
    }

    renderFilteredUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${'*'.repeat(user.password.length)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="adminApp.editUser(${user.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="adminApp.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // ================== NOTIFICATIONS ================== //
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ================== EVENT BINDING ================== //
    bindEvents() {

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('collapsed');
            });
        }

        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Product management
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.addProduct());
        }

        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct(e.target);
            });
        }

        // File upload handler
        const productImageInput = document.getElementById('productImage');
        if (productImageInput) {
            productImageInput.addEventListener('change', (e) => {
                this.handleFileUpload(e);
            });
        }

        const cancelProductBtn = document.getElementById('cancelProduct');
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', () => this.hideProductModal());
        }

        // User management
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.addUser());
        }

        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveUser(e.target);
            });
        }

        const cancelUserBtn = document.getElementById('cancelUser');
        if (cancelUserBtn) {
            cancelUserBtn.addEventListener('click', () => this.hideUserModal());
        }

        // Search and filter
        const productSearch = document.getElementById('productSearch');
        if (productSearch) {
            productSearch.addEventListener('input', () => this.filterProducts());
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }

        const hotFilter = document.getElementById('hotFilter');
        if (hotFilter) {
            hotFilter.addEventListener('change', () => this.filterProducts());
        }

        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', () => this.filterUsers());
        }

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }
}

// ================== INITIALIZATION ================== //
let adminApp;

document.addEventListener('DOMContentLoaded', () => {
    adminApp = new AdminApp();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
