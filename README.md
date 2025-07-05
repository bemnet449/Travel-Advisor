# TravelAdvisor

A travel planning and mapping application built with Next.js.

## Features

- Interactive map with MapLibre GL
- Location search and autocomplete
- Route planning between locations
- Nearby places discovery (banks, ATMs, currency exchange)
- Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add:
   ```
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key_here
   ```
   
   Get your free MapTiler API key from: https://www.maptiler.com/

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Start on the landing page
2. Click "Get Started" to navigate to the map
3. Enter start and destination locations
4. View nearby places and plan your route

## Technologies Used

- Next.js 15
- React 19
- MapLibre GL
- Tailwind CSS
- OpenStreetMap Nominatim API
- Overpass API

## API Endpoints

- `/api/overpass` - Fetch nearby places using Overpass API

## Project Structure

```
src/
├── app/
│   ├── api/overpass/route.js
│   ├── Landing/page.jsx
│   ├── map/page.jsx
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── styles/
│   └── ta.css
└── utils/
    ├── locationUtils.js
    └── overpassUtils.js
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
