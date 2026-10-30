# SERVICE DESK — Restaurant Operations & Toast POS Shift Reconfiguration
**Target Venue:** *The Copper Room – Las Vegas, Nevada*  
**Architecture:** Frontend Interactive Prototype (React + TypeScript + Tailwind CSS + Lucide + Recharts + Canvas Confetti)  
**Primary Goal:** Demonstrate how a high-volume hospitality venue's Toast POS shift-ending and employee management workflows can be reorganized, simplified, and transformed into an intuitive, calm, and reliable operational experience.

---

## 🌟 Executive Overview

Operating a busy restaurant and bar floor leaves little time for navigating clunky back-office menus. When dinner wraps up and night-life service begins, managers need instant clarity on:
- Who is currently on the floor vs. on mandated break intervals
- Missing punches and early/late arrivals before payroll locks
- Cash drawer declarations and variance tracking against Toast expected sales
- Step-by-step guidance through the closing checklist to prevent forgotten closing duties
- Verified manager approvals and digital audit logs

**SERVICE DESK** is an ultra-premium, editorial-grade hospitality tech prototype designed specifically for restaurant owners and floor managers. It communicates deep operational understanding of restaurant workflows and transforms shift-end procedures from stressful chaos into a guided 6-stage closeout.

---

## 🎨 Visual Identity & Design System

In strict adherence to the PRD:
- **Palette:**
  - Background: `#F7F6F2`
  - Main Surface: `#FFFFFF`
  - Secondary Surface: `#F0EFE9`
  - Primary Text: `#252822`
  - Secondary Text: `#777970`
  - Muted Sage: `#758775` (Soft Sage bg: `#E9EFE8`)
  - Terracotta (Attention): `#B87960` (Soft Terracotta bg: `#F9EAE5`)
  - Warm Amber (Pending): `#C39B59` (Soft Amber bg: `#F8F3E8`)
  - Border: `#E8E6DF`
  - Dark Editorial Sidebar: `#282B27`
- **Typography:** Inter for interface elements and Manrope for editorial headings; tabular numerals (`tabular-nums`) for currency, times, and hours.
- **Aesthetic:** Clean, restrained, tactile, and comfortable for extended viewing in low-light restaurant environments. No neon gradients or distracting glassmorphism.

---

## 🚀 Application Structure & Core Screens

1. **Premium Loading Experience** (`src/components/loading/LoadingScreen.tsx`)
   - Warm ivory background with animated circular progress indicator, rotating status messages, and seamless entrance transition.
2. **Landing / Welcome Experience** (`src/pages/LandingPage.tsx`)
   - Editorial hospitality presentation: *"Every Shift. Every Detail. Under Control."*
   - Interactive live dashboard preview component built with actual React elements.
   - 3 structured operational steps and clear value propositions.
3. **Operational Dashboard** (`src/pages/OverviewDashboard.tsx`)
   - Personalized time-of-day greeting (*"Good evening, Alex"*) with live browser clock and date.
   - 4 key operational KPI cards: *Employees on Shift*, *Active Shifts*, *Pending Clock-outs*, and *Closing Progress*.
   - Chronological shift activity feed.
   - "Team on the Floor" real-time status panel.
   - "End-of-Day Readiness" checklist summary with direct *Continue Closing* CTA.
4. **Live Shift Management** (`src/pages/LiveShiftManagement.tsx`)
   - Floor roster table with search, role filters, status filters, and sorting.
   - Functional punch simulation: **Clock In**, **Clock Out**, **Start Break**, **End Break** with confirmation modals.
   - Slide-over drawer with full shift timeline, break history, and sample drawer drop figures.
   - "Edit Shift Details" modal for manual adjustments.
5. **Employee Directory & Profile** (`src/pages/EmployeeManagement.tsx` & `src/pages/EmployeeProfile.tsx`)
   - 14 realistic hospitality staff profiles across GM, Assistant Manager, Servers, Bartenders, Barbacks, Hosts, and Kitchen Staff.
   - "Add Employee" modal with full form validation.
   - Dedicated employee profile view featuring wage rates, weekly hours, punch history, and editable manager notes.
6. **Shift Closing — The Central Workflow** (`src/pages/ShiftClosing.tsx`)
   - Guided 6-stage operational closing workflow:
     1. *Review Employee Attendance*
     2. *Confirm Clock-Outs* (with batch or individual sign-offs)
     3. *Review Shift Hours & Overtime Exceptions*
     4. *Review Cash and Tip Declarations*
     5. *Complete Required Manager Approvals*
     6. *Finalize Closing Summary*
   - Confetti celebration upon closing finalization and downloadable closing summary CSV.
7. **Closing Checklist** (`src/pages/ClosingChecklist.tsx`)
   - Categorized by *Employee Operations*, *Financial Review*, and *Restaurant Closing*.
   - Live completion progress bar, filtering by pending/completed, and "Add Custom Task" modal.
8. **Cash & Tip Reconciliation** (`src/pages/Reconciliation.tsx`)
   - Summary cards: Expected Cash ($1,240.00), Declared Cash ($1,215.00), Net Variance (-$25.00), Declared Tips ($486.50).
   - Drawer variance inspection modal with manager notes and resolution waivers.
   - Dedicated Tip Review tab with server gratuity declarations.
9. **Manager Approvals Center** (`src/pages/ManagerApprovals.tsx`)
   - Handles missing punches, cash shortages, and overtime requests.
   - Real-time updates: approving a missing punch automatically clocks out the employee and reconciles the shift.
10. **Shift Reports & Labor Analytics** (`src/pages/ShiftReports.tsx`)
    - Date filtering (Today, Yesterday, Last 7 Days).
    - Recharts bar chart for *Employee Hours by Day* (Scheduled vs. Actual vs. Overtime).
    - Donut chart for *Labor Hours by Station Role*.
    - Functional **Export CSV** button generating a real spreadsheet file.
11. **Workflow Settings** (`src/pages/WorkflowSettings.tsx`)
    - Shift review rules, mandatory checklist enforcements, notification triggers, and a **Reset Demo Data** option.
12. **Global Notification Center** (`src/components/common/NotificationDropdown.tsx`)
    - Top navigation bell icon with unread indicator, direct action links to relevant screens, and mark-as-read controls.

---

## 🛠 Local Development & Build

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Compile TypeScript & Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📄 Client Disclaimer

*SERVICE DESK is an independent operational concept prototype designed to showcase enhanced shift-end workflows. It is not an official Toast Inc. product. In a production environment, this application connects securely to the Toast Partner APIs (Shift & Time Entries, Labor Management, and Financial Audit Webhooks).*

