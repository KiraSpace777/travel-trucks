# TravelTrucks — Online Camper and Truck Rental Platform

TravelTrucks is a modern web application for the TravelTrucks company, which specializes in renting trucks and comfortable campervans for traveling.

## Brief Description

The application allows users to browse the catalog of available campers for rent, filter them by various technical criteria, view detailed information about each vehicle including reviews and a photo gallery, and book a camper for their desired dates.

## 🌟 Main Features of the Application

### 1. Home Page (`/`)

- **Hero Banner**: Attractive interface with a clear Call to Action (CTA).
- **Navigation**: Quick transition to the catalog via the "View Now" button.

### 2. Catalog Page (`/catalog`)

API ROUTE (`/campers`)
API ROUTE (`/campers/filters`)

- **Server-Side Filtering**: Full backend vehicle filtering via API query parameters (location, body form, engine type, transmission type),
  route (`/campers/filters`).
- **Dynamic Pagination**: Infinite loading (Load More) of 4 cards at a time implemented using TanStack Query (`useInfiniteQuery`).
- **Window Isolation**: The "Show more" button on a vehicle card opens the detailed camper page in a separate browser tab (`target="_blank"`), preserving the filter state in the current window.
- **Catalog State Manager**: When receiving an empty result from the server, the component displays a branded "No campers found" placeholder and provides dynamic parameter resetting and query re-fetching via interactive "Clear filters" and "View all campers" buttons.

### 3. Camper Details Page (`/catalog/[camperId]`)

API ROUTE (`/campers/{camperId}`)

- **Information Block**: Complete technical specifications of the vehicle (dimensions, tank volume, fuel consumption).
- **Interactive Gallery**: Cyclic image slider (Thumbs Gallery Loop) based on the Swiper library.
- **User Reviews**: Display of real customer text reviews with a visual five-star rating scale.
- **Booking Form**: Built-in interactive form with live validation of required fields (Name, Email) and sending a POST request to the server with an instant success notification.

### 4. Global Navigation Error Handling

- **Not Found Page**: Integrated the system `not-found.tsx` handler to automatically intercept invalid or non-existent URL routes within the Next.js App Router architecture.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Programming Language**: TypeScript (+ Swagger)
- **State and Server Management**: TanStack Query v5 (`useInfiniteQuery`)
- **Styling**: Pure CSS Modules (`*.module.css`) based on original constants and the Figma color palette
- **Slider**: Swiper.js (React Components)
- **Icons**: React Icons
- **Base API URL**: https://goit.study

## 📁 Project Structure

```
travel-trucks/
├── app/                              # Native Next.js App Router directory (Routing)
│   ├── [[...slug]]/                  # Optional catch-all route for the home page
│   │   └── page.tsx                  # Website Home Page with banner and call-to-action button
│   ├── catalog/                      # Pages related to the vehicle catalog
│   │   ├── [camperId]/               # Dynamic route for the camper details page by ID
│   │   │   └── page.tsx              # Server component for fetching camper details and reviews
│   │   └── page.tsx                  # Catalog page (Renders vehicle list, sidebar, and loads more cards)
│   ├── globals.css
│   ├── layout.tsx                    # Root layout of the website (Header, Providers, Page body)
│   ├── loading.tsx                   # System loading animation component for page transitions
│   ├── not-found.module.css
│   └── not-found.tsx                 # Custom error page (Page Not Found)
├── components/                       # Directory for isolated frontend UI components
│   ├── CamperCard/
│   │   ├── CamperCard.module.css
│   │   └── CamperCard.tsx            # Vehicle card component in the catalog list
│   ├── CampersFiltersSidebar/
│   │   ├── CampersFiltersSidebar.module.css
│   │   └── CampersFiltersSidebar.tsx # Sidebar / Filter panel: location input and classic radio buttons without icons
│   ├── CampersNotFound/
│   │   ├── CampersNotFound.module.css
│   │   └── CampersNotFound.tsx       # Placeholder block displayed when no campers match the filters
│   ├── CatalogLoader/
│   │   ├── CatalogLoader.module.css
│   │   └── CatalogLoader.tsx         # Reusable loading text component for the main loader
│   ├── CatalogPageView/
│   │   ├── CatalogPageView.module.css
│   │   └── CatalogPageView.tsx       # Client container combining the filters sidebar and infinite card list
│   ├── HomePageView/
│   │   ├── HomePageView.module.css
│   │   └── HomePageView.tsx          # Home page content: headings, descriptions, and start button to catalog
│   ├── IdCamperBookingForm/
│   │   ├── IdCamperBookingForm.module.css
│   │   └── IdCamperBookingForm.tsx   # Booking and validation form with two required fields: Name and Email
│   ├── IdCamperPageView/
│   │   ├── IdCamperPageView.module.css
│   │   └── IdCamperPageView.tsx      # Main camper page by ID, combining slider, description, table, and form (4 blocks)
│   ├── IdCamperReviews/
│   │   ├── IdCamperReviews.module.css
│   │   └── IdCamperReviews.tsx       # Safely validates the array, renders the user's initial in a circle, and displays the star rating
│   ├── IdImageSlider/
│   │   ├── IdImageSlider.module.css
│   │   └── IdImageSlider.tsx         # Image gallery: main slider and four thumbnails with a red scrollbar
│   ├── IdVehicleTable/
│   │   ├── IdVehicleTable.module.css
│   │   └── IdVehicleTable.tsx        # Equipment and technical specifications table, outputs text rows
│   ├── NavigationHeader/
│   │   ├── NavigationHeader.module.css
│   │   └── NavigationHeader.tsx      # Main website navigation menu (Header)
│   ├── Providers/
│   │   └── TanStackProvider.tsx      # Configuration and activation of the TanStack Query client provider
│   └── StarRating/
│       ├── StarRating.module.css
│       └── StarRating.tsx            # Component for automatic fractional rating display
├── constants/
│   └── environment.ts                # Stores the base server URL constant for backend requests
├── public/
│   ├── image/
│   │   ├── Hero-2x.jpg               # High-resolution hero banner background image for Retina/HiDPI screens
│   │   ├── Hero.jpg                  # Standard hero banner background image
│   │   └── no-campers-found.png      # Image for the empty catalog state
│   ├── caravan-camping.svg           # Decorative UI icon
│   └── sprite.svg                    # Icons, project SVG sprite
├── types/                            # Strict TypeScript typing directory
│   └── campers.ts                    # Server data model interfaces without forced type casting
└── utils/                            # Isolated helper functions and server API requests
    ├── camperDetailsApi.ts           # Server requests for the details page by ID and booking form submission
    └── fetchCampersApi.ts            # Catalog list fetch functions with filtering parameters

```

## 🚀 Installation and Setup Instructions

### Prerequisites

Make sure you have **Node.js** (version 18.0.0 or higher is recommended) and the **npm** package manager installed on your computer.

### 1. Clone the repository:

```bash
git clone https://github.com/KiraSpace777/travel-trucks.git
cd travel-trucks
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory of the project and add the base API URL:

```env
NEXT_PUBLIC_API_URL=https://campers-api.goit.study
```

### 4. Run in development mode:

```bash
npm run dev
```

After that, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Author Information

- **Developer**: [Anna Krochak / KiraSpace777]
- **Role in Project**: FULLSTACK Developer
- **REPOSITORY**: https://github.com/KiraSpace777/travel-trucks
- **Live Application**: https://travel-trucks-one-blond.vercel.app/
- **Backend Documentation (API)**: [https://campers-api.goit.study/docs](https://campers-api.goit.study/docs)

# --- Additional information ----

# Next.js - React Framework for the Web (general information)

Used by the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.

## Create new Next.js project

```bash
npx create-next-app@latest
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
