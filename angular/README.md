# Clotchcy E-commerce — Angular 22

Responsive e-commerce UI converted from the supplied reference image, with a cleaner modern implementation.

## Included
- Angular 22 standalone components
- Responsive desktop/tablet/mobile layout
- Home page with hero, categories, collections, best sellers, reviews, community and footer
- Products listing with search, category/collection filters and sorting
- Product detail page with size/color selection and quantity
- Functional cart with localStorage persistence
- Add/remove/update cart items
- Responsive cart summary and checkout CTA
- Angular routing
- No Bootstrap/CoreUI dependency; styling is custom SCSS

## Run

```bash
npm install
npm start
```

Open http://localhost:4200

Production build:

```bash
npm run build
```

## Node / Angular compatibility
This project targets Angular 22.0.x. Angular's compatibility table lists Node 24.15+ as supported for Angular 22, so Node 24.19.0 is suitable.

## Images
The demo uses remote Unsplash image URLs so the project remains lightweight. For production, replace these URLs in `src/app/data.ts` and the home component with your own licensed product/brand assets.

## Main routes
- `/`
- `/products`
- `/product/1`
- `/cart`
