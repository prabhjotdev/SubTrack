# SubTrack

Track subscriptions and loans with clear visibility into renewals, payments, and total costs.

## Overview

SubTrack is a web application that helps individuals manually track subscriptions and loans in one place. It provides clear visibility into upcoming renewals, payment due dates, and total costs - without requiring bank integrations or automation.

## Features

### Subscription Tracking
- Add, edit, and delete subscriptions
- Track vendor, renewal date, amount, and optional notes
- Color-coded tags for easy identification
- Visual indicators for upcoming renewals
- Sorted by soonest renewal date

### Loan Management
- Track total loan amount, paid amount, and remaining balance
- Set payment amounts and due dates
- Visual progress bars showing payment completion
- Color-coded tags for organization
- Automatic calculation of remaining balance and payment progress

### Dashboard
- Overview of upcoming subscriptions (next 30 days)
- Overview of upcoming loan payments (next 30 days)
- Total monthly subscription costs
- Total outstanding loan balances
- Quick visual indicators for due dates

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Data Persistence**: LocalStorage (client-side)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SubTrack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Subscription
1. Navigate to the "Subscriptions" page
2. Click "Add Subscription"
3. Fill in the required fields (Vendor, Renewal Date, Amount, Color Tag)
4. Optionally add description and purchase date
5. Click "Add Subscription"

### Adding a Loan
1. Navigate to the "Loans" page
2. Click "Add Loan"
3. Fill in the required fields (Vendor, Total Loan Amount, Payment Amount, Payment Date, Color Tag)
4. Set the amount paid so far (defaults to 0)
5. Optionally add description and last payment date
6. Click "Add Loan"

### Viewing Dashboard
- The dashboard shows a quick overview of all upcoming renewals and payments
- Summary cards display total monthly subscription costs and outstanding loan balances
- Items are color-coded based on your chosen tags
- Items due within 7 days show a warning badge

## Data Persistence

All data is stored locally in your browser's LocalStorage. This means:
- ✅ Your data persists across sessions
- ✅ No internet connection required after initial load
- ✅ Complete privacy - your data never leaves your device
- ⚠️ Data is tied to your browser - clearing browser data will delete your records
- ⚠️ Data won't sync across different browsers or devices

## Project Structure

```
SubTrack/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── loans/           # Loan-specific components
│   │   └── subscriptions/   # Subscription-specific components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles with Tailwind
├── index.html               # HTML template
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Future Enhancements

Planned features for future versions:
- Email/push notifications for upcoming due dates
- Monthly cost analytics and charts
- CSV export functionality
- Multiple payment history entries for loans
- Auto-renewal frequency tracking (monthly/yearly)
- AI insights and recommendations
- Mobile app version

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.