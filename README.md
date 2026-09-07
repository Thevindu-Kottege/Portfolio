# Premium Studio Portfolio — Graphic Designer & Video Editor

A personal, production-ready creative studio portfolio website built for a freelance **Graphic Designer and Video Editor**. Designed with a dark aesthetic, typography, micro-interactions, responsive grid layouts, and a scalable project architecture.

![Portfolio Preview](assets/images/proj1_sports_campaign.jpg)

---

## ✨ Features

- **Dark-Themed Visual Identity**: Sophisticated charcoal background (`#0e0e0f`), crisp off-white typography, and refined warm gold accent (`#c9a96e`).
- **Typography Pairing**: *Playfair Display* for serif headlines + *Inter* for UI copy.
- **Centralized Configuration (`js/config.js`)**: Update Thevindu Kottege, title, bio, email, social links, and resume link in a single file to update the entire site.
- **CMS-Style Portfolio Data (`js/projects.js`)**: Easily add, edit, or remove portfolio projects without writing any HTML.
- **Dynamic Case Study Template (`project.html`)**: Individual case study pages rendered dynamically with routing for Vercel (`/project/slug-name`).
- **Interactive Work Filter (`work.html`)**: Smooth category filtering across Graphic Design, Video Editing, Photography, Motion Graphics, and 3D.
- **High-Converting Contact Form (`contact.html`)**: Interactive form validation, success/error UI states, and ready to connect to Formspree, Netlify Forms, or EmailJS.
- **Mobile Responsive & Accessible**: Custom hamburger navigation, touch support, semantic HTML5, and `prefers-reduced-motion` compliance.

---

## 🛠️ Project Structure

```
.
├── index.html            # Homepage (Hero, Selected Work, Services, CTA)
├── work.html             # All Projects Grid with Category Filters
├── project.html          # Dynamic Case Study Page Template
├── about.html            # Bio, Skills, Software Tools, Experience Timeline
├── contact.html          # Contact Form & Social Links
├── vercel.json           # Vercel Routing, Clean URLs & Cache Headers
├── .gitignore            # Git exclusion rules
│
├── css/
│   ├── variables.css     # Design Tokens & Theme Variables
│   ├── base.css          # CSS Reset & Base Typography
│   ├── components.css    # Nav, Buttons, Cards, Forms, Footer
│   ├── animations.css    # Keyframes, Scroll Reveal, Micro-interactions
│   └── responsive.css    # Media Queries (Mobile, Tablet, Desktop)
│
├── js/
│   ├── config.js         # ⭐ CENTRAL SITE CONFIG (Edit Thevindu Kottege & links here!)
│   ├── projects.js       # ⭐ PORTFOLIO DATA STORE (Add your projects here!)
│   ├── main.js           # Shared Nav, Scroll Reveal & Footer Rendering
│   ├── home.js           # Featured Grid & Skill Bar Animations
│   ├── work.js           # Work Page Category Filter Logic
│   ├── project.js        # Dynamic Case Study Renderer
│   └── contact.js        # Form Validation & Submission Handler
│
└── assets/
    ├── favicon.svg       # Brand Initial Favicon Badge
    └── images/           # High-resolution project imagery
```

---

## 🚀 How to Customize

### 1. Update Personal Info
Open `js/config.js` and update your details:
```javascript
const CONFIG = {
  name: "Thevindu Kottege",
  title: "Graphic Designer & Video Editor",
  email: "hello@yourname.com",
  social: {
    behance: "https://www.behance.net/yourname",
    linkedin: "https://www.linkedin.com/in/yourname",
    instagram: "https://www.instagram.com/yourname",
  },
  resumeUrl: "assets/resume.pdf",
};
```

### 2. Add New Portfolio Projects
Open `js/projects.js` and add your project object to the `PROJECTS` array:
```javascript
{
  id: 9,
  slug: "my-awesome-project",
  title: "My Awesome Project",
  category: "graphic-design",
  categoryLabel: "Graphic Design",
  year: "2026",
  description: "Short project summary.",
  role: "Graphic Designer",
  tools: ["Photoshop", "Illustrator"],
  thumbnail: "assets/images/my-project.jpg",
  heroImage: "assets/images/my-project-hero.jpg",
  brief: "What the client needed...",
  goal: "What we aimed to achieve...",
  myRole: "What I created...",
  featured: true,
}
```

---

## 🌐 How to Upload to GitHub & Host on Vercel

### Step 1: Push to GitHub

1. Open your terminal / command prompt in this project folder:
   ```bash
   cd "C:\Users\ASUS\Documents\Antigravity\Proj.1 - Portfolio"
   ```

2. Initialize Git and commit the files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of portfolio website"
   ```

3. Create a new repository on [GitHub](https://github.com/new) named `portfolio` (keep it public or private).

4. Link and push your local code:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com) and log in (or sign up using your GitHub account).
2. Click **"Add New..."** → **"Project"**.
3. Select your **`portfolio`** repository from GitHub and click **"Import"**.
4. Leave all build settings as default (Framework Preset: *Other* / *Other (Static Website)*).
5. Click **"Deploy"**.

✨ Your website will be live in seconds at `https://portfolio.vercel.app` (or your custom domain)!

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
