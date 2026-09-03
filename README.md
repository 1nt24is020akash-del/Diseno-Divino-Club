# Diseño Divino

Diseño Divino is a modern digital platform for a college creative community. It gives students one place to discover, explore, register for, and engage with workshops, events, competitions, hackathons, challenges, and other creative activities.

The experience is built around modern UI/UX, student engagement, event discovery, straightforward registration, responsive layouts, and a creative interactive visual language. The interface combines a dark futuristic atmosphere with practical student workflows, from finding an event to receiving a digital pass or attendance letter.

## 🌐 Live Demo

Live Website: [diseno-divino-club.vercel.app](https://diseno-divino-club.vercel.app/)

## ✨ Features

### 🏠 Home & Club Experience

- Diseño Divino creative community introduction
- Hero event showcase with selectable featured experiences
- Club information and reasons to join
- Community statistics, including events conducted, registrations, active members, and challenges completed
- Previous creative activity gallery content retained in the home experience
- Animated counters, interactive artwork, responsive sections, and a Three.js background scene

### 🔍 Explore Activities

- Search activities by title, description, or location
- Filters for all activities, workshops, events, competitions, hackathons, social/community activities, upcoming activities, this week, and this month
- Reusable event cards with event images, category, status, date, time, location, description, capacity, and available spots
- Card hover tilt and image motion on pointer devices
- Full event-card click and `View Details` navigation
- Dynamic details modal with description, requirements, expectations, organizer, duration, venue, and seat availability
- Interested/saved activity state
- Responsive event grids that stack on small screens

### 📝 Event Registration

- Event-specific registration flow from the details modal
- Authentication modal for sign-in or account creation
- Student details collection for registration:
  - Full name
  - Email address
  - College name
  - University Seat Number (USN)
  - Branch
  - Phone number
- College and branch selectors with validation
- USN, email, and phone validation with inline feedback
- Event-specific confirmation modal showing the selected event and available spots
- Registration success popup with event details
- Registered events appear in My Activities

### 📍 Location & Navigation

- Venue and location information is shown on event cards, details, confirmation, passes, and attendance letters
- Google Maps directions link is available from successful registration and digital event pass views

### 📄 Attendance Letter

Registered students can generate a downloadable attendance request letter containing:

- Student name, USN, branch, and college details
- Club and organizer name
- Event name, category, date, time, duration, and venue
- Attendance consideration request addressed to a class teacher or faculty in charge
- Event description and registration information
- HOD or authorized signatory area
- Organizing club signature area
- PDF download generated with `jsPDF`

### 🎫 Digital Event Pass

After registration, students can access a digital event pass with:

- Student name, USN, branch, and college
- Event name, category, date, time, venue, and duration
- Diseño Divino branding
- Registration ID
- QR code containing registration and event verification data
- Downloadable PDF pass
- Add to My Activities and directions actions

### 🏆 Leaderboard & Gamification

- Student leaderboard with featured podium cards and student rows
- XP totals and animated XP progress bars
- Student profile images with initials fallback
- Event participation and category-based achievement data
- Registration, attendance, workshop, hackathon, and competition XP rules in the leaderboard utility
- Featured student achievements and prize information
- Stable featured leaderboard presentation for a consistent public experience

The badge definitions currently present in the project include:

- Active Member
- Innovator
- Creative Mind
- Event Explorer
- Community Builder
- Rising Star
- Top Performer

### 👤 Student Profile

The dedicated [`/profile`](https://diseno-divino-club.vercel.app/profile) page uses the signed-in student’s stored data and includes:

- Profile avatar or initials
- Full name, USN, branch, college, and Diseño Divino membership status
- Total XP
- Events attended
- Hackathons participated in
- Certificates earned
- Challenges completed
- Dynamic profile completion percentage and missing fields
- Activity timeline based on registration and attendance records
- Earned and locked badge collection
- Recent registered or attended events
- Certificate preview panel
- Links back to My Activities and Explore

### 📜 My Certificates

The dedicated [`/certificates`](https://diseno-divino-club.vercel.app/certificates) page includes:

- Student summary and certificate count
- Responsive certificate card grid
- Event image, event name, completion date, club, college, status, and certificate ID
- Filters for all certificates, workshops, events, hackathons, and competitions
- View Certificate preview modal
- Personalized PDF certificate download
- QR verification code in the certificate preview and PDF
- Empty state when no eligible certificates are available

Certificates are shown only for the signed-in student’s registration records with `attendanceStatus: "Checked In"`.

### 🔔 Smart Notifications

- Notification bell in the main navbar
- Unread count badge and per-user read state
- Animated notification dropdown
- Mark one notification as read
- Mark all notifications as read
- Close button, outside-click dismissal, and `Escape` dismissal
- Notification sound for newly received notifications after browser interaction
- Stable notifications derived from the current student and event state
- Registration confirmation notifications
- Certificate-ready notifications after attendance validation
- Hackathon seat alerts
- Upcoming event reminders
- Notification clicks open the relevant event or certificates page

### ⏳ Live Countdown

- Countdown displayed in hackathon event details
- Uses the actual event date and start time from `src/data/hackathons.js`
- Updates every second
- Displays days, hours, minutes, and seconds
- Shows a live status when the event begins
- Shows a completed status after the event duration
- Prevents negative countdown values

### 💻 Hackathons

- Dedicated hackathon activity data and event cards
- Hackathon themes, eligibility, prizes, rules, rounds, requirements, and expectations
- Team registration flow
- Team leader and member details
- Team size validation up to five members
- Team registration success view
- Round 1 PPT or idea submission modal
- Submission status shown in My Activities
- View or update the stored Round 1 submission
- Hackathon-specific notifications and countdown support

### 📱 Fully Responsive Design

The application is designed for mobile phones, tablets, laptops, and desktop screens. Responsive behavior includes mobile navigation, stacked event and dashboard grids, viewport-safe modals, responsive forms, horizontally scrollable filter rows, mobile-friendly profile and certificate layouts, and touch-compatible card interactions.

## 🛠️ Tech Stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 8
- JavaScript with JSX
- CSS
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/)
- [Drei](https://github.com/pmndrs/drei)
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [QRCode](https://github.com/soldair/node-qrcode) for QR code generation
- ESLint with React Hooks and React Refresh plugins

No React Router, Supabase, or external database SDK is currently used.

## 📂 Project Structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── nmit-logo.svg
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── ActivityCard.jsx
│   │   ├── AuthModal.jsx
│   │   ├── BackgroundScene.jsx
│   │   ├── BranchSelect.jsx
│   │   ├── CapacityMeter.jsx
│   │   ├── Certificates.jsx
│   │   ├── ChatbotWidget.jsx
│   │   ├── CollegeSelect.jsx
│   │   ├── ConfirmationDialog.jsx
│   │   ├── DigitalEventPass.jsx
│   │   ├── EventCountdown.jsx
│   │   ├── Footer.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Navbar.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── ProfileDashboard.jsx
│   │   ├── PptSubmissionModal.jsx
│   │   ├── RegistrationConfirmModal.jsx
│   │   ├── RegistrationDetailsModal.jsx
│   │   ├── RegistrationForm.jsx
│   │   ├── SearchBar.jsx
│   │   └── TeamRegistrationModal.jsx
│   ├── data/
│   │   ├── activities.js
│   │   ├── branchOptions.js
│   │   ├── collegeOptions.js
│   │   └── hackathons.js
│   ├── utils/
│   │   ├── attendanceLetter.js
│   │   ├── authService.js
│   │   ├── chatbotService.js
│   │   ├── hackathonStorage.js
│   │   ├── leaderboard.js
│   │   └── storage.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js with npm
- A modern browser with local storage support

### 1. Clone the repository

```bash
git clone https://github.com/1nt24is020akash-del/Diseno-Divino-Club.git
```

### 2. Navigate into the project

```bash
cd Diseno-Divino-Club
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite, normally [http://localhost:5173/](http://localhost:5173/).

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the project

```bash
npm run lint
```

## ⚙️ Configuration

No environment variables are currently required to run the project.

The current application stores state in browser `localStorage`, including authentication sessions, accounts, registrations, interests, teams, PPT submissions, notification read state, and attendance records. Data is specific to the browser origin and is not shared automatically between localhost and Vercel.

The [`vercel.json`](vercel.json) rewrite keeps the single-page application available at the dedicated `/profile` and `/certificates` paths on Vercel.

## 🎨 Design Decisions

- Dark futuristic visual theme suited to a creative student club
- Purple and cyan accent colors with restrained glow effects
- Strong typography and clear visual hierarchy
- Event cards designed for scanning, comparison, and repeated interaction
- Smooth transitions, reveal effects, image motion, counters, and modal animations
- Three.js background scene for depth and a distinctive club atmosphere
- Clear section navigation with active state tracking while scrolling
- Responsive grids, forms, modals, dropdowns, and dashboard panels
- Accessible labels, focus states, semantic buttons, dialog roles, and readable contrast
- Touch-friendly alternatives to hover-only behavior through direct card interactions

## 📋 Original Task Requirements

| Requirement | Implementation |
| --- | --- |
| Explore upcoming activities | Implemented with event data, filters, and search |
| View activity information | Implemented with reusable event details modal |
| Register or express interest | Implemented with authentication, registration, and interest state |
| User feedback and validation | Implemented with inline form errors, capacity states, confirmation, success, and toast feedback |
| Responsive design | Implemented across the home experience, dashboards, forms, cards, and modals |
| Modern and engaging UI/UX | Implemented with the Diseño Divino visual system, motion, imagery, and interactive background |
| Deployment | Vercel |
| Source code | GitHub |

## 📸 Screenshots

Screenshots are not currently stored as repository image files. Suggested captures for future documentation:

- Home Page
- Explore Activities
- Event Details
- Registration and Confirmation
- Leaderboard
- Student Profile
- My Certificates
- Mobile Navigation and Mobile View

## 🧭 User Flow

```text
Home
  → Explore Activities
  → Search / Filter
  → View Event Details
  → Register
  → Registration Success
  → Download Attendance Letter / Digital Event Pass
```

Additional flows:

```text
Profile Avatar
  → Profile Dropdown
  → My Profile
  → /profile
```

```text
Navbar
  → My Certificates
  → /certificates
```

```text
Explore
  → Hackathon Details
  → Team Registration
  → Round 1 PPT Submission
```

## 📦 Deployment

The application is deployed using Vercel from the `main` branch of the GitHub repository.

Production URL: [https://diseno-divino-club.vercel.app/](https://diseno-divino-club.vercel.app/)

The Vercel rewrite configuration in [`vercel.json`](vercel.json) supports direct navigation to `/profile` and `/certificates` while the application uses lightweight client-side path handling.

## 📝 Assumptions

- Event catalog content is maintained as local demonstration data in `src/data/activities.js` and `src/data/hackathons.js`.
- Authentication and student records are browser-local rather than backed by a shared production database.
- Registration, team, PPT, notification, and attendance state is scoped to the browser origin.
- Certificate availability depends on a local registration record being marked `Checked In` through the existing pass-validation flow.
- QR codes are generated for local verification payloads; production-grade cross-user verification would require a shared backend and database.
- The featured leaderboard presentation uses stable featured student data, while the leaderboard utility retains XP calculation logic for registration records.
- The Three.js background may log a non-blocking deprecation warning from its current clock implementation.

## 🏁 Final Notes

Diseño Divino turns a simple college club activity requirement into a polished digital experience focused on creativity, student engagement, intuitive navigation, meaningful participation, and responsive design.
