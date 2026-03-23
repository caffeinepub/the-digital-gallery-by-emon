# The Digital Gallery by Emon

## Current State
- React + Tailwind + localStorage frontend
- HomePage with hero slideshow, products grid, reviews
- OrderPage: 4-step flow (size → photo → details → summary+payment)
- AdminPage: full CMS (products, orders, settings, reviews, finance, suppliers)
- Navbar: no cart, no customer login
- TrackPage: order lookup by ID or phone
- DataContext: shared state for products, orders, settings, reviews
- No cart, no customer login, no quantity selector, no shipping zones, no 60-min cancel, no trust badges, no live order count, no WhatsApp alert on new order, no product image slideshow

## Requested Changes (Diff)

### Add
- **Customer Login**: Simple modal login with name + phone (localStorage session). Accessible from Navbar. Persists across page reloads.
- **Cart System**: Add-to-cart from ProductCard and product detail. Cart icon in Navbar shows count. Dedicated CartPage with quantity controls, remove items, proceed to checkout.
- **Quantity Selector**: On product order page (step 0), allow Qty 1–10.
- **My Orders Hub**: `/my-orders` route. Shows customer's orders (by phone). View status, cancel (within 60 min), request refund.
- **60-Minute Cancel Grace Period**: On order placement, store `createdAt`. Cancel button active for 60 min only. After 60 min, status auto-label becomes "Artist is Designing", cancel disabled.
- **Multi-step Checkout**: Cart → Address (name, phone, pincode) → Shipping (auto-calculated from admin-defined zone rates) → Payment modal (UPI QR, deep-links to PhonePe/GPay, success chime + haptic).
- **Trust Badge Strip**: Near payment button: "Verified Artist | Secure UPI | Quality Checked".
- **Live Order Count**: On HomePage hero: "X orders placed in [City] today" (uses real order count from localStorage).
- **WhatsApp Deep-Link Alert**: On order placement, auto-trigger WhatsApp deep-link pre-filled with full order details to admin's number (from settings.whatsapp). Opens in new tab.
- **Product Image Slideshow**: Each product can have up to 5 images. Product detail/order page shows image slideshow with zoom/preview modal. Admin product form has 5 image upload slots.
- **Shipping Zones in Admin**: Admin > Settings > Locations & Shipping. Admin defines zones: zone name, pincode prefix(es), shipping charge. Checkout calculates shipping by matching customer pincode.
- **WhatsApp Order Confirm Template in Admin**: Admin > Orders > per-order "Send WhatsApp Confirm" button with pre-filled template.
- **Admin Shipping Rates**: Admin can define zone name + pincode prefixes + charge.

### Modify
- **Navbar**: Add cart icon (with count), My Orders link (visible when logged in), Login/Logout button.
- **ProductCard**: "Add to Cart" button instead of direct order link. Click product to see detail with slideshow.
- **OrderPage**: Now the "order" flow starts from cart. Existing OrderPage repurposed as product detail + add-to-cart page with image slideshow, qty selector, reviews section.
- **data.ts**: Add `CartItem` type, `ShippingZone` type; update `Order` with `quantity`, `cancelledAt?`, `shippingZone`; update `Product` with `images?: string[]`; update `Settings` with `shippingZones`; add cart helpers.
- **App.tsx**: Add routes for `/cart`, `/checkout`, `/my-orders`, `/product/$productId`.
- **AdminPage**: Add shipping zones editor in Settings tab; add 5-image slots to product form; add per-order WhatsApp confirm button.

### Remove
- Nothing to remove (TrackPage can remain as fallback).

## Implementation Plan
1. Update `data.ts`: Add CartItem, ShippingZone types; extend Order (quantity, cancelledAt, shippingZone, pincode); extend Product (images array); extend Settings (shippingZones); add cart CRUD helpers; add customerSession helpers.
2. Update `DataContext.tsx`: Expose cart state, customerSession state, setCart, setCustomerSession.
3. Update `App.tsx`: Add routes `/cart`, `/checkout`, `/my-orders`, `/product/$productId`.
4. Update `Navbar.tsx`: Cart icon with badge, My Orders link, Login/Logout.
5. Create `CustomerLoginModal.tsx`: Name + phone form, stores to localStorage.
6. Update `ProductCard.tsx`: Add to Cart button, link to `/product/$productId`.
7. Create `ProductDetailPage.tsx`: Image slideshow (up to 5 images) with zoom modal, qty selector, reviews section, add-to-cart button.
8. Create `CartPage.tsx`: List cart items, qty controls, remove, subtotal, proceed to checkout.
9. Create `CheckoutPage.tsx`: Step 1 address (name/phone/pincode), Step 2 shipping display, Step 3 payment modal with UPI QR + PhonePe/GPay deep-links + success chime + haptic + WhatsApp alert to admin + trust badges.
10. Create `MyOrdersPage.tsx`: Customer login gate. List orders by phone. Show status, 60-min cancel, refund request.
11. Update `AdminPage.tsx`: Add shipping zones editor; add 5-image slots in product form; add WhatsApp confirm button per order.
12. Update `HomePage.tsx`: Live order count in hero section.
