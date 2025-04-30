# Payroll Management System

A modern payroll management system built with Next.js, Supabase, and MongoDB.

## 🚀 Features

- Modern UI built with Next.js and Tailwind CSS
- Real-time data processing with Supabase
- Flexible data storage with MongoDB
- Type-safe development with TypeScript
- Responsive design with Radix UI components
- Form handling with React Hook Form
- Data visualization with Recharts
- Authentication and authorization
- Activity logging and analytics

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Supabase account

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd project-bolt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Configure MongoDB and Supabase credentials

4. Set up databases:
   - Follow [MONGODB_SETUP.md](MONGODB_SETUP.md) for MongoDB configuration
   - Follow [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for Supabase configuration

## 🚀 Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build

To build the application for production:

```bash
npm run build
# or
yarn build
```

## 🚀 Production

To start the production server:

```bash
npm run start
# or
yarn start
```

## 🧪 Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: 
  - Supabase (PostgreSQL)
  - MongoDB
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts
- **Type Safety**: TypeScript
- **Testing**: Playwright, Vitest

## 📁 Project Structure

```
project-bolt/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── lib/             # Utility functions and configurations
├── hooks/           # Custom React hooks
├── public/          # Static assets
├── scripts/         # Utility scripts
├── supabase/        # Supabase configurations
├── test-ledger/     # Test data and configurations
└── __tests__/       # Test files
```

## 📚 Documentation

- [MongoDB Setup Guide](MONGODB_SETUP.md)
- [Supabase Setup Guide](SUPABASE_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
