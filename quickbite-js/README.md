# QuickBite — JavaScript Food Ordering & Delivery Simulation

QuickBite is an interactive **Node.js command-line project** built to practice the JavaScript fundamentals together in one working application. It starts with a menu and shopping cart, then places orders asynchronously, simulates payments with Promises, and tracks delivery using timers.

> Educational simulation only: QuickBite does not contact restaurants, charge cards, or deliver food.

## Requirements

- Node.js 18 or later
- No external packages, APIs, database, or frameworks

## Run the application

```bash
node index.js
```

Alternatively:

```bash
npm start
```

## Commands

| Command | Behavior |
| --- | --- |
| `menu` | Show all menu items and availability |
| `veg` | Show vegetarian dishes |
| `search 3` | Find food by ID |
| `add 1 2` | Add two Chicken Biryanis |
| `add 4 1` | Add one Veg Pizza |
| `cart` | Show cart and total |
| `update 4 3` | Change Veg Pizza quantity to three |
| `remove 1` | Remove Chicken Biryani entirely |
| `checkout` | Place order, simulate successful payment and delivery |
| `checkout fail` | Demonstrate Promise rejection; cart stays available |
| `help` | Print all commands |
| `exit` | Quit |

### Example

```text
quickbite> add 1 2
2 x Chicken Biryani added to cart.
quickbite> add 4 1
1 x Veg Pizza added to cart.
quickbite> cart
===== YOUR CART =====
Chicken Biryani x 2 = Rs.440
Veg Pizza x 1 = Rs.250
Total: Rs.690
First two choices: Chicken Biryani, Veg Pizza
quickbite> checkout
Placing your order...
Order #1001 placed. Total: Rs.690
Payment successful: Rs.690
Preparing food
Food ready
Out for delivery
Delivered
Order #1001 delivered successfully. Cart cleared.
```

## Learning map

| Concept | Functions to study | Why it matters |
| --- | --- | --- |
| Functions, arrays and objects | `menu`, `displayMenu()`, `findFood()` | Store and display restaurant data |
| Custom `map`, `filter`, `find`, `reduce`, `forEach` | `customMap()`, `customFilter()`, etc. | Re-create array iteration and callback behavior |
| Callbacks | `customMap()`, `placeOrder()` | Pass a function to another function; order placement uses an error-first callback |
| Closures | `createCart()`, `createOrderIdGenerator()` | Preserve private state between function calls |
| Object destructuring | `displayMenu()`, `viewCart()`, `checkout()` | Extract values from objects without repeated dot notation |
| Array destructuring | `viewCart()`, CLI command parsing | Unpack the first cart items or command tokens |
| Promises | `processPayment()`, `trackDelivery()`, `checkout()` | Handle completion or rejection of asynchronous work |
| `setTimeout()` | `placeOrder()`, `processPayment()` | Simulate delayed asynchronous responses |
| `setInterval()`, `clearInterval()` | `trackDelivery()` | Repeatedly update delivery status, then stop |

## How the JavaScript flows

1. `createCart()` creates a private `cartItems` array (closure).
2. `cart.addToCart(foodId, quantity)` finds food using `customFind()` and validates availability and quantity.
3. `cart.calculateTotal()` uses `customReduce()` to sum `price * quantity` **only for selected cart items**.
4. `checkout()` takes a snapshot of the cart and calls `placeOrder(items, callback)`.
5. `placeOrder()` calls the error-first callback after a `setTimeout` delay.
6. `processPayment()` returns a Promise, resolving on success or rejecting on simulated failure.
7. On success, `.then()` returns the `trackDelivery()` Promise, which sends four `setInterval` updates and stops with `clearInterval()`.
8. The cart clears after successful delivery; if payment fails, `.catch()` handles the error and the cart remains ready for retry.

`index.js` uses the `require.main === module` condition so importing it in tests does not start the interactive CLI.

## Test

```bash
npm test
```

Tests use Node's built-in `node:test` and `node:assert/strict`; no `npm install` is needed. They cover custom methods, cart validations, quantity updates, closures, defensive copies, orders, payment success/failure, delivery completion, and checkout.

## Three-hour study plan

- **0–30 min:** Read `menu`, `displayMenu()`, and `findFood()`.
- **30–60 min:** Understand `customMap`, `customFilter`, `customFind`, `customReduce`, `customForEach` by tracing each loop.
- **60–90 min:** Trace `createCart()` and explain why `cartItems` is private.
- **90–110 min:** Change quantities and identify object/array destructuring.
- **110–135 min:** Trace the error-first callback in `placeOrder()`.
- **135–155 min:** Follow Promise `.then()` and `.catch()` in `processPayment()`.
- **155–180 min:** Run both checkout paths and the automated tests.

## Project structure

```text
quickbite-js/
├── index.js                 # Complete interactive application
├── test/
│   └── quickbite.test.js    # Automated tests
├── package.json             # start/test commands; zero dependencies
├── .gitignore
└── README.md
```

## Practice challenges

1. Add a category filter for `Non-Veg` dishes.
2. Add a 10% discount for cart totals over Rs.500.
3. Add a `clear` command to manually empty the cart.
4. Add a fixed delivery charge without changing individual food prices.
5. Explain why the payment-failure path must not clear the cart.

The code intentionally uses `.then()`/`.catch()` rather than `async/await` so the project stays within the requested learning topics.