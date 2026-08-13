# Personal Portfolio - Muhammad Anas

A modern, responsive, and interactive personal portfolio website built to showcase skills, projects, and education. This application features a glassmorphism UI design, smooth animations, and a fully functional contact form.

## Project Structure
```bash src/
├── assets/         # Static assets (images, svgs)
├── components/     # Reusable UI components (e.g., Button)
├── lay/            # Layout components (Navbar, Footer)
├── sections/       # Page sections (Hero, About, Projects, Education, Contact)
├── App.jsx         # Main application component
├── main.jsx        # Entry point
└── index.css       # Global styles and Tailwind configuration
```

## Features

* **Modern UI/UX:** Clean design utilizing glassmorphism effects, glowing elements, and responsive layouts.
* **Interactive Sections:**
    * **Hero:** Dynamic introduction with floating animations and social links.
    * **About:** Personal introduction and professional highlights.
    * **Projects:** Showcase of recent work with GitHub and live demo links.
    * **Education:** Timeline view of academic history.
    * **Contact:** Functional contact form integrated with EmailJS.
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
* **Animations:** Smooth fade-ins, scrolling transitions, and hover effects using CSS animations.

## Tech Stack

* **Frontend Framework:** [React.js](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Email Service:** [EmailJS](https://www.emailjs.com/)

## Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone [https://github.com/muhammadanas20/personal-portfolio.git](https://github.com/muhammadanas20/personal-portfolio.git)
cd personal-portfolio
 ```
### 2. Install dependencies
```Bash

npm install
```
### 3. Configure Environment Variables
To make the contact form work, you need to set up EmailJS. Create a .env file in the root directory and add your EmailJS credentials:

Code snippet
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```
### 4. Run the development server


```npm run dev```
The application will typically start at http://localhost:5173.

### 5. Build for production
To create a production-ready build:



```npm run build```

## SEO & Google Search Console (step-by-step)

This repo is already wired up for search engines. The site ships with:

| File | What it does |
| --- | --- |
| `public/robots.txt` | Tells Googlebot it may crawl everything and points to the sitemap. Deployed at `https://anastrix.live/robots.txt`. |
| `public/sitemap.xml` | Lists all indexable URLs. Deployed at `https://anastrix.live/sitemap.xml`. |
| `index.html` | Meta title/description, canonical URL, Open Graph + Twitter cards, favicons, and JSON-LD `Person` structured data with your real GitHub/LinkedIn/Instagram profiles. |
| `public/og-image.png` | 1200x630 share image used when your link is shared on WhatsApp, LinkedIn, X, Facebook, etc. |
| `vercel.json` | Redirects the old `/Sitemap.xml` to `/sitemap.xml` and sets cache headers. |

> The DNS record you added in Google Search Console already **verifies ownership** — that part is done. The steps below are what actually gets your site indexed.

### After every deploy, do this in [Google Search Console](https://search.google.com/search-console)

1. **Submit the sitemap** — sidebar → **Sitemaps** → paste `https://anastrix.live/sitemap.xml` → **Submit**. Status should become "Success".
2. **Test robots.txt** — Google usually fetches this automatically; you can confirm under **Settings → robots.txt**.
3. **Inspect your homepage** — paste `https://anastrix.live/` into the top search bar → click **Request Indexing**. Do this again whenever you change your intro text, projects, or title.
4. **Check the "Live Test"** in the same URL inspection panel — it shows the rendered page, your meta tags, and the `Person` structured data Google detected. "Valid" structured data = eligible for rich results.
5. **Wait** — indexing takes a few days to a few weeks for a new domain. Don't re-submit constantly; it doesn't speed things up.

### Tips that actually move the needle

- **Backlinks:** link to `anastrix.live` from your GitHub profile/bio, LinkedIn, Instagram, and any project READMEs. Backlinks are the biggest factor for a personal site.
- **Update content:** Google re-crawls more often when the page changes. New projects, new achievements = new crawl.
- **Don't list fake URLs:** this is a single-page site — all sections live on `/` (`#about`, `#projects`, etc. are on-page anchors, not separate pages). That's why the sitemap only contains the homepage; listing `/about` or `/projects` there would return 404s and look bad to Google.
- **Share the link:** Google discovers new sites fastest through social shares and other pages linking to it.

