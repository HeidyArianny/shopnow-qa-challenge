
import { test, expect } from "@playwright/test";
import { resetData, USERS } from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetData(request);
});

test("declined payment does not create a successful charge or order", async ({ request }) => {
  const login = await request.post("/api/login", {
    data: USERS.ana,
  });

  expect(login.status()).toBe(200);

  const ordersBefore = await request.get("/api/orders");
  const paymentsBefore = await request.get("/api/payments");

  expect(ordersBefore.status()).toBe(200);
  expect(paymentsBefore.status()).toBe(200);

  const initialOrders = await ordersBefore.json();
  const initialPayments = await paymentsBefore.json();

  const checkout = await request.post("/api/checkout", {
    data: {
      items: [{ productId: 1, quantity: 1 }],
      coupons: [],
      shipping: {
        name: "Ana Garcia",
        address: "1234 Corrientes Ave",
      },
      card: {
        number: "4242424242420000",
      },
    },
  });

  const ordersAfter = await request.get("/api/orders");
  const paymentsAfter = await request.get("/api/payments");

  expect(ordersAfter.status()).toBe(200);
  expect(paymentsAfter.status()).toBe(200);

  const finalOrders = await ordersAfter.json();
  const finalPayments = await paymentsAfter.json();

  console.log("Checkout status:", checkout.status());
  console.log("Checkout response:", await checkout.text());
  console.log("Orders before:", initialOrders);
  console.log("Orders after:", finalOrders);
  console.log("Payments before:", initialPayments);
  console.log("Payments after:", finalPayments);

  expect(checkout.status()).toBe(402);
  expect(finalOrders).toHaveLength(initialOrders.length);

  expect(
    finalPayments.filter(
      (payment: { status: string }) =>
        payment.status.toLowerCase() === "approved"
    )
  ).toHaveLength(
    initialPayments.filter(
      (payment: { status: string }) =>
        payment.status.toLowerCase() === "approved"
    ).length
  );
});
