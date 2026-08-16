# Clotchcy Admin Panel

Admin dashboard for the Clotchcy ecommerce platform, built on Angular 22 and the [CoreUI](https://coreui.io/angular/) component library.

## Prerequisites

- Node.js `^20.19.0 || ^22.12.0 || ^24.0.0`
- npm `>=10`

## Installation

```bash
npm install
```

## Development server

```bash
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200). The app reloads automatically on source changes.

To run alongside the main Clotchcy storefront (which also defaults to port 4200), use a different port:

```bash
npx ng serve --port 4300
```

## Build

```bash
npm run build
```

Build artifacts are written to `dist/clotchcy-admin/`.

## Tests

```bash
npm test
```

## Tech stack

- Angular 22
- CoreUI for Angular 5.7 (UI component library)
- Chart.js (via `@coreui/angular-chartjs`)
- SCSS / Bootstrap-based theming

## Acknowledgements

This project's UI scaffold is built on the [CoreUI Free Angular Admin Template](https://coreui.io/angular/), MIT licensed by creativeLabs Łukasz Holeczek. See [LICENSE](./LICENSE) for the full license text.
