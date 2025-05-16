document.addEventListener('DOMContentLoaded', function () {
  // Handle video play/pause functionality
  const video = document.querySelector('.hero-video');
  const toggleBtn = document.getElementById('videoToggleBtn');

  if (video && toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        toggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" role="img" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11 26L11 6H12L12 26H11ZM20 26L20 6H21L21 26H20Z" fill="currentColor"></path>
          </svg>
        `;
        toggleBtn.setAttribute('aria-label', 'Pause video');
      } else {
        video.pause();
        toggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 5.14v14l11-7-11-7z" fill="currentColor"></path>
          </svg>
        `;
        toggleBtn.setAttribute('aria-label', 'Play video');
      }
    });
  }

  // CRUD cho sản phẩm demo
  let products = JSON.parse(localStorage.getItem('products') || '[]');
  const productForm = document.getElementById('productForm');
  const productList = document.getElementById('productList');
  const productId = document.getElementById('productId');
  const productName = document.getElementById('productName');
  const productPrice = document.getElementById('productPrice');
  const cancelEdit = document.getElementById('cancelEdit');

  function renderProducts() {
    productList.innerHTML = '';
    if (products.length === 0) {
      productList.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Chưa có sản phẩm nào</td></tr>`;
      return;
    }
    products.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><b>${p.name}</b></td>
        <td>$${p.price}</td>
        <td>
          <button onclick="editProduct(${idx})" class="btn btn-outline-primary btn-sm me-2">Sửa</button>
          <button onclick="deleteProduct(${idx})" class="btn btn-outline-danger btn-sm">Xóa</button>
        </td>
      `;
      productList.appendChild(tr);
    });
  }
  function renderCrudProductCards() {
  const grid = document.getElementById('crudProductCards');
  if (!grid) return;
  grid.innerHTML = '';
  if (products.length === 0) return;
  products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image-container">
        <img src="https://via.placeholder.com/300x200?text=Product" alt="${p.name}" class="product-image" />
        <div class="add-to-cart-overlay">
          <button class="add-to-cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">Admin</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">$${p.price}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

  window.editProduct = function (idx) {
    const p = products[idx];
    productId.value = idx;
    productName.value = p.name;
    productPrice.value = p.price;
    cancelEdit.style.display = 'inline-block';
  };

  window.deleteProduct = function (idx) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      products.splice(idx, 1);
      localStorage.setItem('products', JSON.stringify(products));
      renderProducts();
      renderCrudProductCards();
      productForm.reset();
      cancelEdit.style.display = 'none';
    }
  };

  productForm.onsubmit = function (e) {
    e.preventDefault();
    const idx = productId.value;
    if (idx === '') {
      // Create
      products.push({ name: productName.value, price: productPrice.value });
    } else {
      // Update
      products[idx] = { name: productName.value, price: productPrice.value };
    }
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    renderCrudProductCards();
    productForm.reset();
    productId.value = '';
    cancelEdit.style.display = 'none';
  };

  cancelEdit.onclick = function () {
    productForm.reset();
    productId.value = '';
    cancelEdit.style.display = 'none';
  };

  renderProducts();
  renderCrudProductCards();

  // Admin login logic
  const crudSection = document.getElementById('crudSection');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLoginError = document.getElementById('adminLoginError');
  const showAdminLoginBtn = document.getElementById('showAdminLoginBtn');

  const ADMIN_USER = "admin";
  const ADMIN_PASS = "1";

  function checkAdminLogin() {
    if (localStorage.getItem('isAdmin') === 'true') {
      crudSection.style.display = '';
      showAdminLoginBtn.style.display = 'none';
    } else {
      crudSection.style.display = 'none';
      showAdminLoginBtn.style.display = '';
    }
  }
  checkAdminLogin();

  adminLoginForm.onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      localStorage.setItem('isAdmin', 'true');
      adminLoginError.textContent = '';
      checkAdminLogin();
      // Ẩn modal sau khi đăng nhập thành công
      const modal = bootstrap.Modal.getInstance(document.getElementById('adminLoginModal'));
      modal.hide();
    } else {
      adminLoginError.textContent = 'Sai tài khoản hoặc mật khẩu!';
    }
  };

  // Nút đăng xuất (nên thêm vào CRUD section)
  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Đăng xuất';
  logoutBtn.className = 'btn btn-link text-danger float-end';
  logoutBtn.onclick = function () {
    localStorage.removeItem('isAdmin');
    checkAdminLogin();
  };
  crudSection.prepend(logoutBtn);
});