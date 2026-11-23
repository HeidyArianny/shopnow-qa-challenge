# Spec analysis

## Questions for the PO (prioritized)

### P1 — Payment integrity, security and inventory

1. What should happen if a payment is approved but order creation fails?
2. What prevents duplicate charges when customers click Pay multiple times or retry a failed checkout?
3. Can users access only their own orders and payments? What response should be returned when attempting to access another customer's order?
4. At what point is inventory reserved or deducted?
5. What validation applies to shipping details and card numbers?

### P2 — Cart and pricing

6. Should guest carts survive browser closure, and should carts merge when a guest logs in?
7. What happens when available stock changes after a product has been added to the cart?
8. Are there coupon eligibility restrictions or requirements?
9. Should a coupon remain applied when the cart contents or quantities change? And should coupons be case-sensitive?

### P3 — User experience and environment

10. Should product searches be case-insensitive?
11. Should category filtering and product search work together?
12. What date and time format should be displayed alongside the Argentina timezone requirement?
13. How can confirmation email delivery be verified in the local testing environment?

## Ambiguities found

- The specification requires cart persistence but does not define whether persistence is browser-based or account-based.
- Cart merging and isolation between different authenticated users are unspecified.
- The checkout flow does not define retry behavior, duplicate submission prevention or recovery after payment failures.
- Coupon eligibility and rules are unspecified.
- The expected HTTP response for unauthorized access to another user's order is not explicitly defined.
- The specification does not define when stock is reserved or how concurrent purchases should be handled.
- Shipping field validation requirements are incomplete.
- Argentina time is required, but the expected date and time display format is unspecified.
- Confirmation email delivery is required, but the local environment does not provide a documented way to verify it.

## Assumptions I make to move forward

- A declined payment must not create a successful charge or completed order.
- A successful payment and its corresponding order should remain consistent.
- Retrying a failed checkout should not result in unintended duplicate charges.
- Users should not access another user's private orders or payments.
- Unauthorized order access should return an appropriate authorization error, such as HTTP 403 or 404, without exposing private information.
- Cart contents must survive a page reload and browser closure.
- Only one coupon may be active per purchase.
- Coupon codes are case-insensitive.
- Coupon discounts are calculated against the current subtotal and recalculated when that subtotal changes.
- Monetary calculations should use consistent rounding to two decimal places, pending PO confirmation of the rounding strategy.
- Quantity must remain between 1 and available stock.
- Inventory restrictions should be enforced by the backend, not only by the UI.
- Displayed monetary totals must use two decimal places.
- Argentina time refers to the America/Argentina/Buenos_Aires timezone.
