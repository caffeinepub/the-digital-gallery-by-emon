# The Digital Gallery by Emon

## Current State
- Full-stack e-commerce app with React frontend and localStorage persistence
- Admin panel at /admin (password: Emon2026) with tabs for Orders, Products, Inventory, Finance, Suppliers, Settings
- Settings supports logo text, banners, UPI/bank info, themes, categories, pickup cities
- Customer homepage has static hero section, hardcoded reviews, product grid
- No image upload capability for logo, QR code, product images, or reviews
- No header slideshow functionality

## Requested Changes (Diff)

### Add
- `logoImage` field to Settings (base64 data URL) - admin can upload store logo JPG/PNG
- `qrCodeImage` field to Settings (base64) - admin uploads payment QR code image
- `heroSlideshow` field to Settings: array of base64 images + optional caption, with interval setting (ms)
- `reviews` stored in localStorage as separate key: array of { id, name, rating, text, image (optional base64), date, active }
- `image` field to Product interface (optional base64)
- New admin Settings subsection: "Logo & Branding" - upload logo image (replaces logoText on navbar)
- New admin Settings subsection: "Payment QR Code" - upload QR code image (shown in payment popup)
- New admin Settings subsection: "Header Slideshow" - upload multiple images, set slide interval, reorder/delete slides, toggle on/off
- New admin tab or Settings subsection: "Reviews Manager" - add new review (name, rating, text, photo/SMS screenshot upload), edit existing reviews, toggle active/inactive, delete
- Product add/edit form: add image upload field for product images
- Customer homepage: if heroSlideshow enabled and has images, show auto-rotating slideshow in header background with fade/slide transition
- Customer homepage: if logoImage set, show it in navbar instead of logoText
- Customer homepage: reviews section now loads from localStorage reviews data (dynamic)
- Payment popup: if qrCodeImage set, show it alongside UPI/bank details
- Product cards: if product has image, show it

### Modify
- `data.ts`: Add `logoImage?`, `qrCodeImage?`, `heroSlideshow?` to Settings interface; add `heroSlideshowEnabled`, `heroSlideshowInterval`; add `reviews` localStorage helpers; add `image?` to Product
- AdminPage Settings tab: add image upload sections with file input + preview + clear button
- AdminPage: add Reviews management section (could be a new tab or within Settings)
- HomePage hero section: detect slideshow data and render auto-advancing background
- Navbar: show logoImage if available, else fall back to logoText
- Payment popup in OrderPage: show qrCodeImage if set

### Remove
- Nothing removed; all existing features preserved

## Implementation Plan
1. Update `data.ts`: extend Settings interface with logoImage, qrCodeImage, heroSlideshow fields; add Review interface and localStorage helpers; add image field to Product
2. Update `DataContext.tsx`: expose reviews state and helpers
3. Update `AdminPage.tsx`:
   a. Settings tab: add "Logo & Branding" card with image upload/preview/clear
   b. Settings tab: add "Payment QR Code" card with image upload/preview/clear
   c. Settings tab: add "Header Slideshow" card: multi-image upload, slide list with delete/reorder, interval selector, enable toggle
   d. Add "Reviews" tab: table of reviews with add/edit modal (name, rating, text, image upload for photo/SMS screenshot), toggle active, delete
   e. Products add/edit modal: add image upload field
4. Update `HomePage.tsx`:
   a. Hero section: if heroSlideshowEnabled, animate through slideshow images as background
   b. Navbar logo: show img if logoImage else logoText
   c. Reviews section: load from dynamic reviews data
   d. Product images on product cards
5. Update `OrderPage.tsx`: payment popup shows qrCodeImage if set
6. Update `Navbar.tsx`: logoImage support
