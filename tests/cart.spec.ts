import { test, expect } from "@playwright/test";
import { resetData } from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetData(request);
});



test("[BUG-03] multiple cart items persist after page reload", async ({ page }) => {
  await page.goto("/product/1");
  await page.getByTestId("quantity-select").selectOption("2");
  await page.getByTestId("add-to-cart").click();

  await page.goto("/product/2");
  await page.getByTestId("quantity-select").selectOption("1");
  await page.getByTestId("add-to-cart").click();

  await page.goto("/cart");

  await expect(page.getByTestId("cart-line-1")).toBeVisible();
  await expect(page.getByTestId("cart-line-2")).toBeVisible();

  await page.reload();

  await expect(page.getByTestId("cart-line-1")).toBeVisible();
  await expect(page.getByTestId("cart-line-2")).toBeVisible();
});

