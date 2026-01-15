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

## 🚀 Features

* **Modern UI/UX:** Clean design utilizing glassmorphism effects, glowing elements, and responsive layouts.
* **Interactive Sections:**
    * **Hero:** Dynamic introduction with floating animations and social links.
    * **About:** Personal introduction and professional highlights.
    * **Projects:** Showcase of recent work with GitHub and live demo links.
    * **Education:** Timeline view of academic history.
    * **Contact:** Functional contact form integrated with EmailJS.
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
* **Animations:** Smooth fade-ins, scrolling transitions, and hover effects using CSS animations.

## 🛠️ Tech Stack

* **Frontend Framework:** [React.js](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Email Service:** [EmailJS](https://www.emailjs.com/)

## ⚙️ Installation & Setup

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
