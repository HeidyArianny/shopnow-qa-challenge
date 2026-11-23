
import { test, expect } from "@playwright/test";
import { resetData } from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetData(request);
});

test("[BUG-02] applying a valid coupon updates the total", async ({ page, request }) => {
  const coupon = await request.post("/api/coupons/validate", {
    data: { code: "FLOCK10" },
  });

  expect(coupon.status()).toBe(200);
  expect((await coupon.json()).percent).toBe(10);

  await page.goto("/product/1");

  await page.getByTestId("quantity-select").selectOption("2");
  await page.getByTestId("add-to-cart").click();

  await page.goto("/cart");

  await expect(page.getByTestId("cart-total")).toContainText("$16.70");

  await page.getByTestId("coupon-input").fill("FLOCK10");
  await page.getByTestId("coupon-apply").click();

  await expect(page.getByTestId("cart-total")).toContainText("$15.03");
});
