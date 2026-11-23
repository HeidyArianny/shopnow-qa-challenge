
import { test, expect } from "@playwright/test";
import { resetData, USERS } from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetData(request);
});

test("[BUG-01] users cannot access another customer's order", async ({ request }) => {
  // Verify that Ana owns and can access order #1.
  const anaLogin = await request.post("/api/login", {
    data: USERS.ana,
  });

  expect(anaLogin.status()).toBe(200);

  const ownOrder = await request.get("/api/orders/1");
  expect(ownOrder.status()).toBe(200);

  await request.post("/api/logout");

  // Authenticate as Bruno.
  const brunoLogin = await request.post("/api/login", {
    data: USERS.bruno,
  });

  expect(brunoLogin.status()).toBe(200);

  // Verify that Bruno cannot access Ana's order.
  const response = await request.get("/api/orders/1");

  expect([403, 404]).toContain(response.status());
});
