
const foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 199,
    description: "Classic cheese pizza with fresh tomato sauce.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Classic Burger",
    category: "Burger",
    price: 149,
    description: "Juicy burger with lettuce, cheese and sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Creamy Pasta",
    category: "Pasta",
    price: 179,
    description: "Creamy pasta with delicious white sauce.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 99,
    description: "Rich chocolate cake for sweet cravings.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Cold Coffee",
    category: "Drinks",
    price: 89,
    description: "Chilled and creamy coffee.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Cheese Pizza",
    category: "Pizza",
    price: 249,
    description: "Loaded with melted cheese and herbs.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Crispy Burger",
    category: "Burger",
    price: 169,
    description: "Crispy patty with fresh veggies.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Chocolate Dessert",
    category: "Dessert",
    price: 119,
    description: "A sweet chocolate treat.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Fresh Lemon Drink",
    category: "Drinks",
    price: 69,
    description: "A refreshing drink for a sunny day.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=600&q=80"
  }
];

// Load saved cart and orders
function loadData(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let cart = loadData("craveCart");
let orders = loadData("craveOrders");
let activeCategory = "All";

function saveCart() {
  localStorage.setItem("craveCart", JSON.stringify(cart));
}

function saveOrders() {
  localStorage.setItem("craveOrders", JSON.stringify(orders));
}

// Update cart count in the navbar on every page
function updateCartCount() {
  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

// MENU PAGE
function renderFoods() {
  const foodGrid = document.getElementById("food-grid");

  if (!foodGrid) return;

  const searchInput = document.getElementById("search");
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredFoods = foods.filter(food => {
    const matchesCategory =
      activeCategory === "All" ||
      food.category === activeCategory;

    const matchesSearch =
      food.name.toLowerCase().includes(searchText) ||
      food.category.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  foodGrid.innerHTML = filteredFoods.map(food => `
    <article class="food-card">
      <img src="${food.image}" alt="${food.name}" loading="lazy">

      <div class="food-info">
        <h3>${food.name}</h3>
        <p>${food.description}</p>

        <div class="food-bottom">
          <span class="price">₹${food.price}</span>
          <button class="add-btn" data-add="${food.id}">
            + Add
          </button>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("no-results").hidden =
    filteredFoods.length > 0;
}

// Add food to cart
function addToCart(id) {
  const food = foods.find(item => item.id === id);

  if (!food) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...food, quantity: 1 });
  }

  saveCart();
  updateCartCount();
}

// Event delegation for menu buttons
document.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(Number(button.dataset.add));

    const originalText = button.textContent;
    button.textContent = "✓ Added";

    setTimeout(() => {
      if (button.isConnected) {
        button.textContent = originalText;
      }
    }, 700);
  }
});

// Category filters
document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    document.querySelectorAll(".category").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderFoods();
  });
});

const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("input", renderFoods);
}

// CART PAGE
function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  updateCartCount();
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");

  if (!cartItems) return;

  const emptyCart = document.getElementById("empty-cart");
  const summary = document.getElementById("cart-summary");

  if (cart.length === 0) {
    cartItems.innerHTML = "";
    emptyCart.hidden = false;
    summary.hidden = true;
    return;
  }

  emptyCart.hidden = true;
  summary.hidden = false;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>₹${item.price} each</p>
      </div>

      <div class="quantity">
        <button data-minus="${item.id}" aria-label="Decrease quantity">−</button>
        <strong>${item.quantity}</strong>
        <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
      </div>

      <strong>₹${item.price * item.quantity}</strong>

      <button class="remove-btn" data-remove="${item.id}">
        Remove
      </button>
    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cart-total").textContent = `₹${total}`;
}

// Cart controls
document.addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");

  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

// CHECKOUT
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString("en-IN"),
    status: "Order Placed",
    items: cart.map(item => ({ ...item })),
    total: cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    )
  };

  orders.unshift(order);
  saveOrders();

  cart = [];
  saveCart();
  updateCartCount();

  alert("Order placed successfully! Thank you for choosing Crave.");

  window.location.href = "orders.html";
}

const checkoutButton = document.getElementById("checkout-btn");

if (checkoutButton) {
  checkoutButton.addEventListener("click", checkout);
}

// MY ORDERS PAGE
function renderOrders() {
  const ordersList = document.getElementById("orders-list");

  if (!ordersList) return;

  const noOrders = document.getElementById("no-orders");

  if (orders.length === 0) {
    ordersList.innerHTML = "";
    noOrders.hidden = false;
    return;
  }

  noOrders.hidden = true;

  ordersList.innerHTML = orders.map(order => `
    <article class="order-card">
      <div class="order-header">
        <div>
          <h3>Order #${order.id}</h3>
          <p>${order.date}</p>
        </div>
        <span class="order-status">${order.status}</span>
      </div>

      <div class="order-lines">
        ${order.items.map(item => `
          <div>
            ${item.name} × ${item.quantity}
            — ₹${item.price * item.quantity}
          </div>
        `).join("")}
      </div>

      <div class="order-total">
        <span>Total Paid</span>
        <span>₹${order.total}</span>
      </div>
    </article>
  `).join("");
}

// Initialize whichever page is open
updateCartCount();
renderFoods();
renderCart();
renderOrders();