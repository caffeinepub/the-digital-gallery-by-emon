# The Digital Gallery by Emon

## Current State
- Full e-commerce + admin platform with products, orders, checkout, reviews, hero slideshow, cart, customer login, My Orders hub
- Delivery uses pincode-based shipping zone system
- Admin panel manages products, categories, settings, banners, reviews, orders
- Products labelled as "canvas prints" throughout
- About section has text logo option
- No blog or About Me editable section
- No delete functionality for order history in admin

## Requested Changes (Diff)

### Add
- Delete button per order in admin orders tab (with confirm dialog)
- "Clear All Orders" button in admin orders tab
- About Me section: admin-editable bio (name, profile description, photo - use existing store logo as profile image)
- Blog section: admin can create/edit/delete blog posts (title, date, content, optional image); displayed at /blog on customer side
- New route /blog for customer blog page
- Location-based delivery: admin creates named locations (city/area name + delivery charge); customers pick from dropdown at checkout

### Modify
- Replace ALL instances of "canvas prints" / "Canvas Prints" / "canvas print" with "photo frames" / "Photo Frames" / "photo frame" throughout entire codebase
- About section in admin: remove text logo option; show store logo image as profile avatar
- Checkout page: replace pincode input + shipping zone logic with location dropdown based on admin-defined locations
- DataContext: add deliveryLocations array to settings (name, charge), add blogPosts array, add aboutMe object (bio, extra fields)
- Admin Settings: add "Delivery Locations" section to manage named locations with charges
- Admin: add "Blog" tab for managing posts
- Admin: add "About Me" tab for editing bio content

### Remove
- Text logo upload/display option in About section of admin
- Pincode-based shipping zone system from checkout and admin settings

## Implementation Plan
1. Update DataContext: add deliveryLocations, blogPosts, aboutMe to state/localStorage defaults
2. Update AdminPage: add delete/clear buttons in Orders tab; add Delivery Locations settings section; add Blog tab; update About section to show logo as profile and remove text logo; add About Me tab
3. Update CheckoutPage: replace pincode/zone logic with location dropdown using deliveryLocations from settings
4. Add BlogPage component at /blog route
5. Update App.tsx to add /blog route
6. Global text replace: "canvas prints" -> "photo frames" in all files
