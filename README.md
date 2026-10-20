# Smart QR Menu — MVP

A mobile-first, time-aware restaurant menu built with React, Vite, Tailwind CSS, Framer Motion and Lucide icons.

## Features

- Time-aware greeting and recommended menu category using `Asia/Kolkata` (IST)
- Customers can browse any menu category at any time
- Cinematic photo cards, animated entrances and item detail modal
- Search within the selected category
- Responsive mobile-first layout
- Sample data is kept in `src/data/menu.js`

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Build for deployment

```bash
npm run build
npm run preview
```

Deploy the project to Vercel or Netlify as a Vite app. Build command: `npm run build`; output directory: `dist`.

## Customizing the menu

Edit `src/data/menu.js`. Each item has an `id`, `category`, `name`, `description`, `price`, `tag`, `veg`, and Unsplash image ID. Replace sample dishes, prices and images with the restaurant's actual menu before using it with customers.

## Time rules

The current time is calculated with the `Asia/Kolkata` timezone. Update `getRecommendation()` and the category start/end values in `src/data/menu.js` to match the restaurant's actual service hours.

## Notes

- This is a front-end prototype. There is no database, admin panel, ordering, payment, or Petpooja integration.
- Food photos are remote Unsplash images and need an internet connection.
- The displayed dishes and prices are illustrative demo data, not a real restaurant menu.
