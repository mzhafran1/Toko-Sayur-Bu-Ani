const cart = {};
const cartCountEl = document.getElementById("cart-count");
const cartListEl = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");
const cartStatusEl = document.getElementById("cart-status");
const orderForm = document.getElementById("order-form");
const orderSukses = document.getElementById("order-sukses");
const contactForm = document.getElementById("form-kontak");
const contactSukses = document.getElementById("pesan-sukses");
const kosongkanBtn = document.getElementById("kosongkan-keranjang");

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function updateCart() {
  const items = Object.values(cart);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  if (cartCountEl) cartCountEl.textContent = count;
  if (cartTotalEl) cartTotalEl.textContent = formatRupiah(total);
  if (cartStatusEl) {
    cartStatusEl.textContent = count
      ? `${count} produk dalam keranjang`
      : "Keranjang masih kosong.";
  }

  if (cartListEl) {
    cartListEl.innerHTML = "";

    if (items.length === 0) {
      const kosongItem = document.createElement("li");
      kosongItem.className = "cart-empty";
      kosongItem.textContent = "Keranjangmu masih kosong.";
      cartListEl.appendChild(kosongItem);
      return;
    }

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "cart-item";
      listItem.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <p>${item.qty} x ${formatRupiah(item.price)}</p>
        </div>
        <div class="item-actions">
          <span>${formatRupiah(item.qty * item.price)}</span>
          <button type="button" class="btn-hapus" data-product="${item.name}">Hapus</button>
        </div>
      `;
      cartListEl.appendChild(listItem);
    });
  }
}

function addToCart(name, price) {
  if (!cart[name]) {
    cart[name] = { name, price, qty: 0 };
  }
  cart[name].qty += 1;
  updateCart();
}

function clearCart() {
  Object.keys(cart).forEach((key) => delete cart[key]);
  updateCart();
}

const tombolTambah = document.querySelectorAll(".btn-tambah");
if (tombolTambah.length > 0) {
  tombolTambah.forEach((tombol) => {
    tombol.addEventListener("click", function () {
      const productName = tombol.dataset.product;
      const productPrice = Number(tombol.dataset.price || 0);
      addToCart(productName, productPrice);

      tombol.textContent = "✅ ditambahkan";
      setTimeout(() => {
        tombol.textContent = "+ Tambah";
      }, 1500);
    });
  });
}

if (kosongkanBtn) {
  kosongkanBtn.addEventListener("click", clearCart);
}

if (orderForm) {
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const itemCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    if (itemCount === 0) {
      alert("Keranjang kosong. Tambahkan produk terlebih dahulu.");
      return;
    }

    if (orderSukses) {
      orderSukses.style.display = "block";
    }
    orderForm.reset();
    clearCart();

    setTimeout(() => {
      if (orderSukses) orderSukses.style.display = "none";
    }, 3000);
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (contactSukses) {
      contactSukses.style.display = "block";
    }
    contactForm.reset();
    setTimeout(() => {
      if (contactSukses) contactSukses.style.display = "none";
    }, 3000);
  });
}

updateCart();
