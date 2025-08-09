<p align="center">
  <img width="84" alt="Nonsavang Temple Logo" src="./public/logo.png">
  <h1 align="center">Nonsavang Temple</h1>
</p>

<p align="center">
 A comprehensive Income & Expense management system for Nonsavang Temple built with Next.js, TypeScript, and Supabase.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#project-structure"><strong>Project Structure</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Features

### 🔐 Authentication & User Management

- Multi-role authentication system (Admin, Holder, User, Super Admin)
- Secure user registration and login with Supabase Auth
- Role-based access control with protected routes
- User profile management with avatar support

### 💰 Financial Management

- **Income Tracking**
  - Categorized income transactions
  - Donation tracking with donator management
  - Multi-currency support
  - Account-based income recording
- **Expense Management**
  - Categorized expense transactions
  - Receipt image upload support
  - Multi-currency expense tracking
  - Drawer/withdrawer management
- **Account Management**
  - Multiple financial accounts
  - Real-time balance tracking
  - Currency-specific accounts
  - Account history and reporting

### 🏛️ Administrative Features

- **User Administration**
  - User creation and management
  - Role assignment and permissions
  - User activity tracking
- **Category Management**
  - Income category management
  - Expense category management
  - Custom category creation
- **Currency Management**
  - Multi-currency support
  - Currency conversion tracking
  - Custom currency symbols

### 📊 Approval Workflow

- **Transaction Approval System**
  - Pending transaction queue
  - Approval/rejection workflow
  - Role-based approval permissions
  - Transaction status tracking
- **Status Management**
  - Three-state workflow (Pending, Approved, Rejected)
  - Timestamp tracking for status changes
  - Audit trail for all transactions

### 📈 Reporting & Analytics

- **Dashboard Overview**
  - Real-time financial metrics
  - Income vs expense visualization
  - Account balance summaries
  - Transaction trend analysis
- **Advanced Reports**
  - Account-specific reports
  - Donator contribution reports
  - Income/expense comparative reports
  - Date range filtering
- **Data Visualization**
  - Interactive charts and graphs
  - Pie charts for category breakdown
  - Trend analysis with line charts
  - Financial performance metrics

### 🎨 User Experience

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light theme support
  - Intuitive navigation
  - Loading states and animations
- **Internationalization**
  - Lao language support
  - Localized number formatting
  - Cultural-appropriate date formats
- **Data Tables**
  - Sortable and filterable tables
  - Pagination support
  - Bulk operations
  - Export functionality

## Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Charts**: Tremor React, React Feather
- **Icons**: Lucide React, FontAwesome
- **Forms**: React Hook Form with Zod validation

### Backend & Database

- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Real-time**: Supabase Realtime subscriptions
- **API**: Next.js API routes

### Development Tools

- **Code Quality**: ESLint, Prettier
- **Type Safety**: TypeScript with strict mode
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: Yarn
- **Version Control**: Git

### Deployment & Infrastructure

- **Hosting**: Vercel-ready configuration
- **Database**: PostgreSQL via Supabase
- **CDN**: Next.js Image Optimization
- **Environment**: Production-ready configuration

## Demo

You can view a fully working demo at [Nonsavang Temple](https://nonsavang-temple.tyecode.space/).

## Clone and run locally

Follow these steps to set up the project locally on your machine.

#### 1. Prerequisites

Before you begin, ensure you have the following installed:

- <b>Node.js</b> (version 20.10.x or later)
- <b>npm</b> or <b>Yarn</b> (depending on your package manager preference)
- <b>Git</b>
- <b>Supabase account:</b> You’ll need a Supabase project set up.

#### 2. Set Up Supabase

- Create a Supabase Project:
  - Log in to [Supabase](https://supabase.com/) and create a new project.
  - Once the project is created, navigate to the API section under Project Settings to find your SUPABASE_URL and SUPABASE_ANON_KEY.
- Configure Database:
  - Go to the Database section and set up your tables and schemas as required by the project. If you have SQL scripts for initial setup, you can run them here.

#### 3. Clone the Repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/tyecode/nonsavang-temple--web-client.git
```

Navigate into the project directory:

```bash
cd nonsavang-temple--web-client
```

#### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```bash
touch .env.local
```

Add the following environment variables to your `.env.local` file:

```env
# Database
DATABASE_URL=your_database_connection_string

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# Storage Configuration
NEXT_PUBLIC_SUPABASE_BUCKET_PATH=your_storage_bucket_path

# Authentication
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME=nonsavang-auth-token

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: Replace all placeholder values with your actual Supabase project credentials.

#### 5. Install Dependencies

Depending on your package manager, run one of the following commands to install the necessary dependencies:

For npm:

```bash
npm install
```

For Yarn:

```bash
yarn
```

#### 6. Database Setup

Apply the database migrations using Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link your project
supabase link --project-ref your_project_reference

# Apply migrations
supabase db push
```

Alternatively, you can manually run the SQL migrations found in `supabase/migrations/` through your Supabase dashboard.

#### 7. Seed the Database (Optional)

If you want to populate the database with sample data:

```bash
# Run the seed script through Supabase dashboard SQL editor
# Copy and paste the contents of supabase/seed.sql
```

#### 8. Start the Development Server

Start the local development server:

For npm:

```bash
npm run dev
```

For Yarn:

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000/)

#### 9. Additional Scripts

The project includes several useful scripts:

```bash
# Development
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server

# Code Quality
yarn lint         # Run ESLint and Prettier checks
yarn fix          # Auto-fix ESLint and Prettier issues
```

## Project Structure

```
nonsavang-temple--web-client/
├── actions/                    # Server actions for data operations
│   ├── auth-actions.tsx       # Authentication operations
│   ├── expense-actions.tsx    # Expense CRUD operations
│   ├── income-actions.tsx     # Income CRUD operations
│   └── ...                    # Other entity actions
├── app/                       # Next.js App Router structure
│   ├── (admin)/              # Admin-only pages (role-protected)
│   │   ├── accounts/         # Account management
│   │   ├── currencies/       # Currency management
│   │   ├── donators/         # Donator management
│   │   ├── expenses/         # Expense management
│   │   ├── incomes/          # Income management
│   │   └── users/            # User management
│   ├── (holder)/             # Holder role pages
│   │   ├── approved/         # Approved transactions
│   │   ├── pending/          # Pending transactions
│   │   └── rejected/         # Rejected transactions
│   ├── (root)/               # Public/authenticated pages
│   │   ├── report-*/         # Financial reports
│   │   └── api/              # API routes
│   ├── login/                # Authentication page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components (shadcn/ui)
│   ├── pages/                # Page-specific components
│   ├── badges/               # Status and type badges
│   ├── buttons/              # Custom button components
│   ├── cards/                # Card components
│   └── providers/            # Context providers
├── constants/                # Application constants
│   ├── nav-link.ts           # Navigation configuration
│   ├── user-role.ts          # User role definitions
│   └── ...                   # Other constants
├── layouts/                  # Layout components
│   ├── left-bar.tsx          # Sidebar navigation
│   └── top-bar.tsx           # Top navigation bar
├── lib/                      # Utility libraries
│   ├── utils.ts              # General utilities
│   ├── date-format.ts        # Date formatting utilities
│   └── ...                   # Other utilities
├── stores/                   # Zustand state stores
│   ├── useAuthStore.ts       # Authentication state
│   ├── useTransactionStore.ts # Transaction state
│   └── ...                   # Other stores
├── types/                    # TypeScript type definitions
│   ├── user.ts               # User-related types
│   ├── transaction.ts        # Transaction types
│   ├── income.ts             # Income types
│   ├── expense.ts            # Expense types
│   └── ...                   # Other type definitions
├── utils/                    # Utility functions
│   ├── supabase/             # Supabase client configuration
│   └── middlewares/          # Custom middleware functions
├── supabase/                 # Supabase configuration
│   ├── migrations/           # Database migrations
│   ├── config.toml           # Supabase configuration
│   └── seed.sql              # Database seed data
├── public/                   # Static assets
├── middleware.ts             # Next.js middleware
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

### Key Directories Explained

- **`actions/`**: Contains server-side functions for database operations using Supabase
- **`app/`**: Next.js 14 App Router structure with route groups for role-based access
- **`components/`**: Reusable React components built with Radix UI and Tailwind CSS
- **`stores/`**: Zustand stores for client-side state management
- **`types/`**: Comprehensive TypeScript type definitions for type safety
- **`supabase/`**: Database schema, migrations, and Supabase configuration

## License

Licensed under the [MIT License](https://github.com/tyecode/nonsavang-temple--web-client/blob/main/LICENSE). Please read the terms of this license before making modifications to this project.
