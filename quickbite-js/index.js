"use strict";

// QuickBite: a terminal-based food ordering app for learning core JavaScript.
// Run: node index.js | Test: npm test

const readline = require("node:readline");

// 1. Arrays of objects: our restaurant's menu.
const menu = [
  { id: 1, name: "Chicken Biryani", category: "Non-Veg", price: 220, available: true },
  { id: 2, name: "Paneer Biryani", category: "Veg", price: 180, available: true },
  { id: 3, name: "Chicken Burger", category: "Non-Veg", price: 150, available: false },
  { id: 4, name: "Veg Pizza", category: "Veg", price: 250, available: true },
  { id: 5, name: "French Fries", category: "Veg", price: 100, available: true }
];

// 2. Custom array methods. A callback receives (item, index, originalArray).
function customForEach(items, callback) {
  for (let i = 0; i < items.length; i++) {
    callback(items[i], i, items);
  }
}

function customMap(items, callback) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    result.push(callback(items[i], i, items));
  }
  return result;
}

function customFilter(items, callback) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    if (callback(items[i], i, items)) {
      result.push(items[i]);
    }
  }
  return result;
}

function customFind(items, callback) {
  for (let i = 0; i < items.length; i++) {
    if (callback(items[i], i, items)) {
      return items[i];
    }
  }
  return undefined;
}

// Teaching version: the third argument (initialValue) is required.
function customReduce(items, callback, initialValue) {
  let accumulator = initialValue;
  for (let i = 0; i < items.length; i++) {
    accumulator = callback(accumulator, items[i], i, items);
  }
  return accumulator;
}

function findFood(foodId) {
  return customFind(menu, food => food.id === foodId);
}

function displayMenu(items = menu) {
  // Object destructuring extracts properties from each food object.
  const lines = customMap(items, ({ id, name, price, available }) => {
    return `${id}. ${name} - Rs.${price}${available ? "" : " (UNAVAILABLE)"}`;
  });
  return ["===== QUICKBITE MENU =====", ...lines].join("\n");
}

function displayVegMenu() {
  const vegItems = customFilter(menu, food => food.category === "Veg");
  return displayMenu(vegItems);
}

// 3. Closure: cartItems is private to each cart returned by createCart().
function createCart() {
  let cartItems = [];

  function addToCart(foodId, quantity) {
    const food = findFood(foodId);
    if (!food) return "Food not found.";
    if (!food.available) return `${food.name} is currently unavailable.`;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return "Quantity must be a positive whole number.";
    }

    const existingItem = customFind(cartItems, item => item.id === foodId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Spread syntax copies food fields; quantity adds one new property.
      cartItems.push({ ...food, quantity });
    }
    return `${quantity} x ${food.name} added to cart.`;
  }

  function removeFromCart(foodId) {
    const existingItem = customFind(cartItems, item => item.id === foodId);
    if (!existingItem) return "Item not found in cart.";
    cartItems = customFilter(cartItems, item => item.id !== foodId);
    return `${existingItem.name} removed from cart.`;
  }

  function updateQuantity(foodId, quantity) {
    const existingItem = customFind(cartItems, item => item.id === foodId);
    if (!existingItem) return "Item not found in cart.";
    if (!Number.isInteger(quantity) || quantity < 0) {
      return "Quantity must be a non-negative whole number.";
    }
    if (quantity === 0) return removeFromCart(foodId);
    existingItem.quantity = quantity;
    return `${existingItem.name} quantity updated to ${quantity}.`;
  }

  function calculateTotal() {
    return customReduce(cartItems, (sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  function getItems() {
    // Return copies. Callers cannot change the private cart by accident.
    return customMap(cartItems, item => ({ ...item }));
  }

  function viewCart() {
    if (cartItems.length === 0) return "===== YOUR CART =====\nYour cart is empty.";

    const lines = customMap(cartItems, ({ name, price, quantity }) => {
      return `${name} x ${quantity} = Rs.${price * quantity}`;
    });

    // Array destructuring: inspect the first two cart entries.
    const [firstItem, secondItem] = cartItems;
    const preview = secondItem
      ? `First two choices: ${firstItem.name}, ${secondItem.name}`
      : `Your choice: ${firstItem.name}`;

    return ["===== YOUR CART =====", ...lines, `Total: Rs.${calculateTotal()}`, preview].join("\n");
  }

  function clear() {
    cartItems = [];
  }

  return { addToCart, removeFromCart, updateQuantity, calculateTotal, getItems, viewCart, clear };
}

// 4. Another closure: remember the next order ID across orders.
function createOrderIdGenerator(start = 1000) {
  let lastId = start;
  return function nextOrderId() {
    lastId += 1;
    return lastId;
  };
}
const nextOrderId = createOrderIdGenerator();

// 5. Error-first callback + setTimeout: simulate placing an order.
function placeOrder(items, callback, delayMs = 700) {
  setTimeout(() => {
    if (!Array.isArray(items) || items.length === 0) {
      callback(new Error("Cannot place an order with an empty cart."), null);
      return;
    }

    const invalid = customFind(items, item => !Number.isInteger(item.quantity)
      || item.quantity <= 0 || !Number.isFinite(item.price) || item.price < 0);
    if (invalid) {
      callback(new Error("The cart contains an invalid item."), null);
      return;
    }

    // Snapshot cart data so later mutations do not alter the placed order.
    const orderItems = customMap(items, item => ({ ...item }));
    const order = {
      id: nextOrderId(),
      items: orderItems,
      total: customReduce(orderItems, (sum, item) => sum + item.price * item.quantity, 0),
      status: "PLACED"
    };
    callback(null, order);
  }, delayMs);
}

// 6. Promise + setTimeout: fake payment; no real money is collected.
function processPayment(order, shouldSucceed = true, delayMs = 900) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!order || !Number.isFinite(order.total)) {
        reject(new Error("Invalid order for payment."));
        return;
      }
      if (!shouldSucceed) {
        reject(new Error(`Payment failed for order #${order.id}.`));
        return;
      }
      resolve({ orderId: order.id, amount: order.total, status: "PAID" });
    }, delayMs);
  });
}

// 7. Promise + setInterval + clearInterval: simulate delivery updates.
function trackDelivery(orderId, onStatus = () => {}, intervalMs = 700) {
  const statuses = ["Preparing food", "Food ready", "Out for delivery", "Delivered"];
  return new Promise(resolve => {
    let index = 0;
    const intervalId = setInterval(() => {
      const status = statuses[index];
      onStatus(status);
      index += 1;
      if (index === statuses.length) {
        clearInterval(intervalId);
        resolve({ orderId, status: "DELIVERED" });
      }
    }, intervalMs);
  });
}

// 8. Connect callbacks -> Promise -> another Promise with .then()/.catch().
// A successful order clears the cart; payment failure retains it for retry.
function checkout(cart, options = {}) {
  const {
    shouldSucceed = true,
    orderDelayMs = 700,
    paymentDelayMs = 900,
    deliveryIntervalMs = 700,
    onStatus = () => {}
  } = options;

  return new Promise((resolve, reject) => {
    placeOrder(cart.getItems(), (error, order) => {
      if (error) {
        reject(error);
        return;
      }

      onStatus(`Order #${order.id} placed. Total: Rs.${order.total}`);
      processPayment(order, shouldSucceed, paymentDelayMs)
        .then(receipt => {
          onStatus(`Payment successful: Rs.${receipt.amount}`);
          return trackDelivery(order.id, onStatus, deliveryIntervalMs);
        })
        .then(delivery => {
          cart.clear();
          resolve({ order, delivery });
        })
        .catch(reject);
    }, orderDelayMs);
  });
}

// 9. Interactive CLI: readline is built into Node.js, not an external package.
function startCli() {
  const cart = createCart();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let checkoutInProgress = false;

  function help() {
    console.log(`\nCommands:\n  menu              Display the restaurant menu\n  veg               Display vegetarian dishes\n  search 3          Find food by ID\n  add 1 2           Add two portions of food #1\n  remove 1          Remove food #1 from the cart\n  update 4 3        Set food #4 quantity to three\n  cart              View items and calculate the total\n  checkout          Order with successful simulated payment\n  checkout fail     Simulate a rejected payment\n  help              Show these commands\n  exit              Close the application\n`);
  }

  console.log("Welcome to QuickBite! (Educational simulation, no real orders or payments)");
  help();
  rl.setPrompt("quickbite> ");
  rl.prompt();

  rl.on("line", input => {
    // Array destructuring: unpack command and optional arguments.
    const [command, first, second] = input.trim().toLowerCase().split(/\s+/);
    if (command === "exit") {
      rl.close();
      return;
    }
    if (checkoutInProgress && command !== "help") {
      console.log("Checkout is running. Please finish this order first.");
      rl.prompt();
      return;
    }

    switch (command) {
      case "menu": console.log(displayMenu()); break;
      case "veg": console.log(displayVegMenu()); break;
      case "search": {
        const food = findFood(Number(first));
        console.log(food ? `${food.name} - Rs.${food.price} (${food.available ? "available" : "unavailable"})` : "Food not found.");
        break;
      }
      case "add": console.log(cart.addToCart(Number(first), Number(second))); break;
      case "remove": console.log(cart.removeFromCart(Number(first))); break;
      case "update": console.log(cart.updateQuantity(Number(first), Number(second))); break;
      case "cart": console.log(cart.viewCart()); break;
      case "help": help(); break;
      case "checkout": {
        if (cart.getItems().length === 0) {
          console.log("Your cart is empty. Add food first.");
          break;
        }
        if (first && first !== "fail" && first !== "success") {
          console.log("Use 'checkout' or 'checkout fail'.");
          break;
        }
        checkoutInProgress = true;
        console.log("Placing your order...");
        checkout(cart, {
          shouldSucceed: first !== "fail",
          onStatus: message => console.log(message)
        })
          .then(({ order }) => {
            console.log(`Order #${order.id} delivered successfully. Cart cleared.`);
          })
          .catch(error => {
            console.log(`${error.message} Cart retained for retry.`);
          })
          .finally(() => {
            checkoutInProgress = false;
            rl.prompt();
          });
        return;
      }
      case "": break;
      default: console.log("Unknown command. Type 'help'.");
    }
    rl.prompt();
  });
}

// Tests can import functions without starting the interactive terminal.
if (require.main === module) {
  startCli();
}

module.exports = {
  menu, customForEach, customMap, customFilter, customFind, customReduce,
  findFood, displayMenu, displayVegMenu, createCart, createOrderIdGenerator,
  placeOrder, processPayment, trackDelivery, checkout, startCli
};