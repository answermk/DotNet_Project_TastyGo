DotNet_Project_TastyGo
----------------------
# TastyGO - Food Delivery Platform
-----------------------------------
## Overview
TastyGO is a comprehensive food delivery platform consisting of a modern React frontend and a robust .NET backend. The platform enables seamless food ordering, delivery tracking, and restaurant management with features for customers, restaurant owners, and administrators.

## System Architecture

### Frontend (TastyGO Web Application)
A modern, responsive web application built with React and TypeScript.

#### Technology Stack
- *React 18.3.1* - UI library
- *TypeScript 5.5.3* - Type safety
- *Vite 5.4.2* - Build tool
- *Tailwind CSS 3.4.1* - Styling
- *Material-UI 7.1.0* - UI components
- *React Router DOM 6.22.3* - Routing
- *i18next* - Internationalization
- *SignalR* - Real-time updates
- *Axios* - HTTP client
- *React-Toastify* - Notifications
- *Recharts* - Data visualization
- *Lucide React* - Icons

### Backend (FoodDeliver API)
A robust .NET 8.0 Web API service handling core business logic and data management.

#### Technology Stack
- *.NET 8.0* - Backend framework
- *Entity Framework Core 9.0.5* - ORM
- *SQL Server* - Database
- *JWT Authentication* - Security
- *Swagger/OpenAPI* - API documentation
- *iText7 (9.2.0)* - PDF generation
- *EPPlus (8.0.5)* - Excel handling
- *CsvHelper (33.0.1)* - CSV processing

## Features

### Core Functionality
- User Authentication and Authorization
- Multi-language Support (English, French, Kinyarwanda)
- Dark/Light Theme
- Real-time Order Tracking
- File Upload/Download
- Analytics and Reporting

### User Roles

#### Customer Features
- Browse Restaurants
- View Menus
- Place Orders
- Track Deliveries
- Order History
- Profile Management
- Favorites Management

#### Admin Features
- Dashboard Analytics
- User Management
- Order Management
- Restaurant Management
- System Settings
- Report Generation
- Audit Logging
- System Health Monitoring

#### Restaurant Features
- Menu Management
- Order Processing
- Business Analytics
- Profile Settings
- Operating Hours Management

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- .NET 8.0 SDK
- SQL Server
- npm or yarn
- Visual Studio 2022 or later (recommended for backend)

### Frontend Setup

1. Navigate to frontend directory
bash
cd TG FRONT 1/TastyGO/FRONTEND


2. Install dependencies
bash
npm install


3. Create .env file
env
VITE_API_URL=http://localhost:7047


4. Start development server
bash
npm run dev


Frontend will be available at http://localhost:5174

### Backend Setup

1. Navigate to backend directory
bash
cd FoodDeliver


2. Update connection string in appsettings.json
json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-US8TVAN\\S25249;Database=FoodDeliver;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}


3. Apply database migrations
bash
dotnet ef database update


4. Run the API
bash
dotnet run


Backend API will be available at http://localhost:7047

## Project Structure

### Frontend Structure

src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── pages/         # Page components
├── services/      # API services
├── utils/         # Utility functions
├── hooks/         # Custom React hooks
├── types/         # TypeScript definitions
├── locales/       # Translation files
└── config/        # Configuration files


### Backend Structure

FoodDeliver/
├── Controllers/   # API endpoints
├── Models/        # Data models and DTOs
├── Services/      # Business logic
├── Data/          # Database context
├── Middleware/    # Custom middleware
└── Utils/         # Helper classes


## API Documentation
Access Swagger documentation at http://localhost:7047/swagger

## Authentication
The platform uses JWT Bearer token authentication:
1. Obtain token from /api/auth/login
2. Include in requests:

Authorization: Bearer <your-token>


## Real-time Features
Implemented using SignalR:
- Order status updates
- New order notifications
- Chat messages
- System notifications

## Error Handling
- Global error handling middleware
- API error interceptors
- Form validation
- Network error handling
- User-friendly notifications

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[MIT License](LICENSE)
