# HMS Frontend API - Project Structure Overview

## 1. CSS Files & Organization

### CSS File Locations & Purposes

| File Path | Purpose | Key Theme |
|-----------|---------|-----------|
| [src/index.css](src/index.css) | Global browser reset & typography styles | System-wide defaults |
| [src/App.css](src/App.css) | App-level component styling (legacy Vite template) | General component styles |
| [src/admin/admin.css](src/admin/admin.css) | Admin dashboard theme & components | Red/White professional |
| [src/doctor/doctor.css](src/doctor/doctor.css) | Doctor dashboard theme & components | Red/White professional |
| [src/patient/patient.css](src/patient/patient.css) | Patient dashboard theme & components | Red/White professional |
| [src/main/main.css](src/main/main.css) | Main public pages (navbar, home, about, 404) | Red/White professional |

---

## 2. CSS Color Scheme & Design System

### CSS Variables (Shared Across All Module CSS Files)

**Color Palette:**
- `--primary-red: #e63946` - Main brand color
- `--dark-red: #d62828` - Darker shade for hover/active states
- `--light-red: #ffebee` - Light background variant
- `--accent-red: #ff6b6b` - Accent highlight color
- `--warning-yellow: #ff9800` - Warning/alert color (admin.css, patient.css)
- `--white: #ffffff` - Pure white
- `--off-white: #f8f9fa` - Near-white background
- `--light-gray: #f5f6f8` - Light gray
- `--text-dark: #2d3748` - Primary text color
- `--text-medium: #4a5568` - Secondary text color
- `--text-light: #718096` - Tertiary/muted text

**Borders & Shadows:**
- `--border-color: #e2e8f0` - Standard border
- `--border-light: #edf2f7` - Light border
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` - Box shadow levels
- `--shadow-red: 0 4px 14px 0 rgba(230, 57, 70, 0.2)` - Red-tinted shadow

**Transitions:**
- `--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` - Standard animation
- `--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)` - Fast animation

---

## 3. CSS Component Classes

### Common Across Admin/Doctor/Patient CSS Files

**Containers & Layout:**
- `.admin-container / .doctor-container / .patient-container` - Main page wrapper with gradient background
- `.admin-header / .doctor-header / .patient-header` - Page title section with red gradient

**Dashboard Cards:**
- `.dashboard-cards` - Grid layout for stat cards (responsive grid-cols: auto-fit, min 280px)
- `.dashboard-card` - Individual stat card with hover animation
- `.dashboard-card h3` - Card heading (uppercase, gray)
- `.dashboard-card .count` - Large number display (48px, bold)
- `.dashboard-card .label` - Card label text (uppercase, muted)

**Buttons:**
- `.btn-primary` - Main action button (red gradient, white text)
- `.btn-secondary` - Alternative button (white bg, red border)

**Tables:**
- `.admin-table` - Bordered table container with rounded corners
- `.admin-table thead` - Red gradient header
- `.admin-table tbody tr` - Rows with light-red hover effect
- `.admin-table tbody td` - Cell padding/styling

**Forms:**
- `.admin-form` - Form container with top red border accent
- `.form-group` - Form field wrapper
- `.form-grid` - Two-column form layout (responsive)
- `.form-group input/select/textarea` - Input styling with light gray background
- `.form-group input:focus` - Red border on focus with shadow

**Alerts & Notifications:**
- `.alert` - Base alert styling with animation
- `.alert-success` - Green gradient (✓ icon)
- `.alert-error` - Red gradient (✕ icon)
- `.alert-info` - Blue gradient (ℹ icon)

**Utilities:**
- `.loading-spinner` - Animated spinning loader
- `.modal-overlay` - Semi-transparent backdrop with blur
- `.modal-content` - Centered modal box
- `.password-toggle` - Checkbox for password visibility

### Main Navigation & Pages (main.css only)

**Navigation:**
- `.main-navbar` - Sticky header with red gradient
- `.main-navbar-container` - Centered nav flex layout
- `.main-navbar-logo` - Brand logo/text
- `.main-navbar-links` - Link container (flex)
- `.main-navbar-link` - Individual nav link
- `.main-navbar-link-button` - Special button-style links

**Home Page:**
- `.home-container` - Full-height page wrapper
- `.home-content` - Content centering container
- `.home-title` - Large gradient text (3rem, red gradient)
- `.home-subtitle` - Subtitle text (1.3rem, gray)
- `.home-cards-grid` - Three-column responsive grid
- `.home-card` - Card with top red accent, hover lift effect
- `.home-card-title` - Card heading (red)
- `.home-card-description` - Card description (muted)
- `.home-card-link` - Button link with shine effect on hover

**About Page:**
- `.about-container` - Full-height page
- `.about-content` - Centered content box with top accent
- `.about-title` - Large gradient heading
- `.about-description` - Body text
- `.about-section` - Subsection wrapper
- `.about-section-title` - Subsection heading (red)
- `.about-features-list` - Animated list items

**Not Found (404) Page:**
- `.notfound-container` - Centered error page
- `.notfound-code` - Large "404" in gradient text
- `.notfound-title` - Error message heading
- `.notfound-description` - Helpful text
- `.notfound-link` - Return home link

### Animations (CSS keyframes)

- `@keyframes float` - Floating bubble effect (6s loop)
- `@keyframes fadeInUp` - Fade in + slide up animation
- `@keyframes slideInDown` - Slide down animation for alerts
- `@keyframes spin` - Loading spinner rotation
- `@keyframes fadeIn` - Simple fade-in
- `@keyframes scaleIn` - Scale from 0.9 to 1 + fade

---

## 4. React Components by Directory

### Admin Module (`src/admin/`)

| Component | Purpose | CSS Import | Key Features |
|-----------|---------|-----------|--------------|
| [AdminHome.jsx](src/admin/AdminHome.jsx) | Main admin dashboard | `./admin.css` | Displays doctor, patient, prescription counts |
| [AdminDoctor.jsx](src/admin/AdminDoctor.jsx) | Doctor management | `./admin.css` | CRUD operations for doctors |
| [AdminPatient.jsx](src/admin/AdminPatient.jsx) | Patient management | `./admin.css` | CRUD operations for patients |
| [AdminPrescription.jsx](src/admin/AdminPrescription.jsx) | Prescription management | `./admin.css` | Manage prescriptions |
| [AdminLogin.jsx](src/admin/AdminLogin.jsx) | Admin authentication | `./admin.css` | Login form for admins |
| [AdminNavBar.jsx](src/admin/AdminNavBar.jsx) | Admin navigation | `./admin.css` | Navigation menu for admin section |

**Total Admin Components:** 6 (.jsx files)

---

### Doctor Module (`src/doctor/`)

| Component | Purpose | CSS Import | Key Features |
|-----------|---------|-----------|--------------|
| [DoctorHome.jsx](src/doctor/DoctorHome.jsx) | Main doctor dashboard | `./doctor.css` | Appointment stats & overview |
| [DoctorProfile.jsx](src/doctor/DoctorProfile.jsx) | Doctor profile view/edit | `./doctor.css` | Profile management |
| [DoctorLogin.jsx](src/doctor/DoctorLogin.jsx) | Doctor authentication | `./doctor.css` | Login form for doctors |
| [DoctorRegister.jsx](src/doctor/DoctorRegister.jsx) | Doctor registration | `./doctor.css` | Registration form |
| [DoctorNavBar.jsx](src/doctor/DoctorNavBar.jsx) | Doctor navigation | `./doctor.css` | Navigation menu |
| [DoctorAddPrescription.jsx](src/doctor/DoctorAddPrescription.jsx) | Add prescription form | `./doctor.css` | Create prescriptions |
| [ViewAppointment.jsx](src/doctor/ViewAppointment.jsx) | Appointment details | `./doctor.css` | View/manage appointments |

**Total Doctor Components:** 7 (.jsx files)

---

### Patient Module (`src/patient/`)

| Component | Purpose | CSS Import | Key Features |
|-----------|---------|-----------|--------------|
| [PatientHome.jsx](src/patient/PatientHome.jsx) | Main patient dashboard | `./patient.css` | Appointments & prescriptions stats |
| [PatientProfile.jsx](src/patient/PatientProfile.jsx) | Patient profile view/edit | `./patient.css` | Profile management |
| [PatientLogin.jsx](src/patient/PatientLogin.jsx) | Patient authentication | `./patient.css` | Login form |
| [PatientRegister.jsx](src/patient/PatientRegister.jsx) | Patient registration | `./patient.css` | Registration form |
| [PatientNavBar.jsx](src/patient/PatientNavBar.jsx) | Patient navigation | `./patient.css` | Navigation menu |
| [PatientAppointments.jsx](src/patient/PatientAppointments.jsx) | Appointment list | `./patient.css` | View booked appointments |
| [PatientPrescriptions.jsx](src/patient/PatientPrescriptions.jsx) | Prescription list | `./patient.css` | View prescriptions |

**Total Patient Components:** 7 (.jsx files)

---

### Main Module (`src/main/`)

| Component | Purpose | CSS Import | Key Features |
|-----------|---------|-----------|--------------|
| [Home.jsx](src/main/Home.jsx) | Public landing page | `./main.css` | Role selection cards (Doctor/Admin/Patient) |
| [MainNavBar.jsx](src/main/MainNavBar.jsx) | Public navigation | `./main.css` | Navigation before login |
| [About.jsx](src/main/About.jsx) | About page | `./main.css` | HMS information & features |
| [NotFound.jsx](src/main/NotFound.jsx) | 404 error page | `./main.css` | Page not found view |

**Total Main Components:** 4 (.jsx files)

---

### Root Level Files

| File | Purpose | Type |
|------|---------|------|
| [App.jsx](src/App.jsx) | Main app component with routing | JSX Component |
| [App.css](src/App.css) | Legacy template styles | CSS |
| [main.jsx](src/main.jsx) | App entry point | JSX |
| [index.css](src/index.css) | Global styles | CSS |
| [config.js](src/config.js) | API configuration | JS Config |

### Context API

| File | Purpose |
|------|---------|
| [contextapi/AuthContext.jsx](src/contextapi/AuthContext.jsx) | Authentication state management |

---

## 5. CSS Import Pattern

### How CSS is Imported in Components

All components follow the same pattern:

```jsx
// Example: AdminHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import './admin.css';  // ← CSS imported relative to component directory

export default function AdminHome() {
  // Component logic...
}
```

**Key Pattern:**
- Each module (`admin/`, `doctor/`, `patient/`, `main/`) has its own CSS file
- Components import their module's CSS file using relative path
- CSS files are colocated with components for easy maintenance
- All module CSS files share the same CSS variable system defined in `:root`

---

## 6. CSS Organization Summary

### Module-Based Architecture

```
src/
├── index.css                    ← Global reset & typography
├── App.css                      ← Legacy Vite template
├── admin/
│   ├── admin.css               ← Admin module theme & components
│   ├── AdminHome.jsx
│   ├── AdminDoctor.jsx
│   └── ... (6 components total)
├── doctor/
│   ├── doctor.css              ← Doctor module theme & components
│   ├── DoctorHome.jsx
│   └── ... (7 components total)
├── patient/
│   ├── patient.css             ← Patient module theme & components
│   ├── PatientHome.jsx
│   └── ... (7 components total)
└── main/
    ├── main.css                ← Main/public pages theme
    ├── Home.jsx
    └── ... (4 components total)
```

### Design System Features

1. **Consistent Theming:** All module CSS files use identical CSS variable definitions
2. **Professional Aesthetic:** Red (#e63946) and white color scheme with clean typography
3. **Responsive Design:** Mobile-first approach with media queries (@media max-width: 768px)
4. **Modern Animations:** Smooth transitions, hover effects, and entrance animations
5. **Accessible Components:** Proper focus states, semantic HTML structure support
6. **Component Library:** Reusable classes (buttons, forms, tables, alerts, modals)

---

## 7. Component Count Summary

| Module | Components | CSS File |
|--------|-----------|----------|
| Admin | 6 | admin.css |
| Doctor | 7 | doctor.css |
| Patient | 7 | patient.css |
| Main | 4 | main.css |
| **Total** | **24** | **4 module CSS files** |

---

## 8. CSS Import Usage Matrix

| Component | CSS File | Import Type |
|-----------|----------|-------------|
| AdminHome.jsx | admin.css | `import './admin.css'` |
| AdminDoctor.jsx | admin.css | `import './admin.css'` |
| AdminPatient.jsx | admin.css | `import './admin.css'` |
| AdminPrescription.jsx | admin.css | `import './admin.css'` |
| AdminLogin.jsx | admin.css | `import './admin.css'` |
| AdminNavBar.jsx | admin.css | `import './admin.css'` |
| DoctorHome.jsx | doctor.css | `import './doctor.css'` |
| DoctorProfile.jsx | doctor.css | `import './doctor.css'` |
| DoctorLogin.jsx | doctor.css | `import './doctor.css'` |
| DoctorRegister.jsx | doctor.css | `import './doctor.css'` |
| DoctorNavBar.jsx | doctor.css | `import './doctor.css'` |
| DoctorAddPrescription.jsx | doctor.css | `import './doctor.css'` |
| ViewAppointment.jsx | doctor.css | `import './doctor.css'` |
| PatientHome.jsx | patient.css | `import './patient.css'` |
| PatientProfile.jsx | patient.css | `import './patient.css'` |
| PatientLogin.jsx | patient.css | `import './patient.css'` |
| PatientRegister.jsx | patient.css | `import './patient.css'` |
| PatientNavBar.jsx | patient.css | `import './patient.css'` |
| PatientAppointments.jsx | patient.css | `import './patient.css'` |
| PatientPrescriptions.jsx | patient.css | `import './patient.css'` |
| Home.jsx | main.css | `import './main.css'` |
| MainNavBar.jsx | main.css | `import './main.css'` |
| About.jsx | main.css | `import './main.css'` |
| NotFound.jsx | main.css | `import './main.css'` |

---

## Key Findings

✅ **Well-Organized Structure:** Module-based CSS organization with clear separation of concerns

✅ **Consistent Design System:** Shared CSS variables ensure uniform styling across all modules

✅ **Component Reusability:** Classes like `.btn-primary`, `.dashboard-card`, `.admin-table` can be reused across components

✅ **Professional Theming:** Clean red and white color scheme appropriate for healthcare application

✅ **Responsive Design:** Media queries ensure mobile compatibility

✅ **Animation & Interactivity:** Smooth transitions, hover effects, and entrance animations improve UX

⚠️ **Note:** `admin.css` and `doctor.css` include identical CSS variable definitions - could be refactored into a shared `theme.css` for better maintainability
