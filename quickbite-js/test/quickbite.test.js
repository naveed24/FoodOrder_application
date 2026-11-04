"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  menu, customForEach, customMap, customFilter, customFind, customReduce,
  findFood, displayVegMenu, createCart, createOrderIdGenerator,
  placeOrder, processPayment, trackDelivery, checkout
} = require("../index");

test("custom methods transform, filter, find, reduce and iterate", () => {
  assert.deepEqual(customMap([1, 2, 3], x => x * 2), [2, 4, 6]);
  assert.deepEqual(customFilter([1, 2, 3, 4], x => x % 2 === 0), [2, 4]);
  assert.equal(customFind(menu, x => x.id === 3).name, "Chicken Burger");
  assert.equal(customFind(menu, x => x.id === 20), undefined);
  assert.equal(customReduce([10, 20, 30], (sum, x) => sum + x, 0), 60);
  assert.equal(customReduce([], (sum, x) => sum + x, 4), 4);
  const visited = [];
  customForEach(["a", "b"], (x, i) => visited.push(`${i}:${x}`));
  assert.deepEqual(visited, ["0:a", "1:b"]);
});

test("menu lookup and vegetarian menu", () => {
  assert.equal(findFood(1).name, "Chicken Biryani");
  assert.equal(findFood(999), undefined);
  assert.match(displayVegMenu(), /Paneer Biryani/);
  assert.doesNotMatch(displayVegMenu(), /Chicken Biryani/);
});

test("cart validates food, quantities, and availability", () => {
  const cart = createCart();
  assert.match(cart.addToCart(100, 1), /not found/);
  assert.match(cart.addToCart(3, 1), /unavailable/);
  assert.match(cart.addToCart(1, -1), /positive whole/);
  assert.match(cart.addToCart(1, 1.5), /positive whole/);
  assert.equal(cart.calculateTotal(), 0);
});

test("cart uses closure state and customReduce for total", () => {
  const cart = createCart();
  cart.addToCart(1, 2);
  cart.addToCart(4, 1);
  assert.equal(cart.calculateTotal(), 690);
  cart.addToCart(1, 1);
  assert.equal(cart.calculateTotal(), 910);
  assert.match(cart.viewCart(), /Chicken Biryani x 3/);
  const publicSnapshot = cart.getItems();
  publicSnapshot[0].quantity = 999;
  assert.equal(cart.calculateTotal(), 910, "private cart should not be mutated by snapshot");
  cart.updateQuantity(4, 3);
  assert.equal(cart.calculateTotal(), 1410);
  cart.removeFromCart(1);
  assert.equal(cart.calculateTotal(), 750);
  cart.updateQuantity(4, 0);
  assert.equal(cart.calculateTotal(), 0);
  assert.match(cart.viewCart(), /empty/);
});

test("cart instances are isolated and order ID generator remembers previous number", () => {
  const a = createCart();
  const b = createCart();
  a.addToCart(5, 1);
  assert.equal(a.calculateTotal(), 100);
  assert.equal(b.calculateTotal(), 0);
  const next = createOrderIdGenerator(200);
  assert.equal(next(), 201);
  assert.equal(next(), 202);
});

test("placeOrder rejects an empty cart using error-first callback", () => {
  return new Promise(resolve => {
    placeOrder([], (error, order) => {
      assert.match(error.message, /empty cart/);
      assert.equal(order, null);
      resolve();
    }, 0);
  });
});

test("placeOrder produces total and cloned order items", () => {
  return new Promise(resolve => {
    const items = [{ id: 1, name: "Biryani", price: 220, quantity: 2 }];
    placeOrder(items, (error, order) => {
      assert.equal(error, null);
      assert.equal(order.total, 440);
      assert.equal(order.status, "PLACED");
      items[0].quantity = 500;
      assert.equal(order.items[0].quantity, 2);
      resolve();
    }, 0);
  });
});

test("payment Promise resolves or rejects", () => {
  const order = { id: 1234, total: 690 };
  return processPayment(order, true, 0)
    .then(receipt => {
      assert.equal(receipt.amount, 690);
      return assert.rejects(processPayment(order, false, 0), /Payment failed/);
    });
});

test("delivery ticks through statuses and stops", () => {
  const statuses = [];
  return trackDelivery(1001, status => statuses.push(status), 1)
    .then(result => {
      assert.equal(result.status, "DELIVERED");
      assert.deepEqual(statuses, ["Preparing food", "Food ready", "Out for delivery", "Delivered"]);
    });
});

test("successful checkout delivers and clears the cart", () => {
  const cart = createCart();
  const statuses = [];
  cart.addToCart(1, 2);
  cart.addToCart(4, 1);
  return checkout(cart, {
    shouldSucceed: true, orderDelayMs: 0, paymentDelayMs: 0,
    deliveryIntervalMs: 1, onStatus: status => statuses.push(status)
  }).then(({ order, delivery }) => {
    assert.equal(order.total, 690);
    assert.equal(delivery.status, "DELIVERED");
    assert.equal(cart.calculateTotal(), 0);
    assert.equal(statuses.at(-1), "Delivered");
  });
});

test("failed payment stops delivery and retains the cart", () => {
  const cart = createCart();
  const statuses = [];
  cart.addToCart(4, 1);
  return assert.rejects(
    checkout(cart, {
      shouldSucceed: false, orderDelayMs: 0, paymentDelayMs: 0,
      deliveryIntervalMs: 1, onStatus: status => statuses.push(status)
    }), /Payment failed/
  ).then(() => {
    assert.equal(cart.calculateTotal(), 250);
    assert.equal(statuses.includes("Delivered"), false);
  });
});