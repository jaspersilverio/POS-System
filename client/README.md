# Dripline POS System

A comprehensive Point-of-Sale (POS) system designed for clothing stores, featuring inventory management, sales tracking, and customer feedback collection.

## Project Structure

### Backend (Laravel/PHP)
- **Authentication**: Secure login/register with Sanctum token authentication
- **Role Management**: Three user roles (admin, manager, cashier) with appropriate permissions
- **Products & Inventory**: Product management with stock tracking and low stock alerts
- **Transactions**: Sales processing with receipt generation and optional discount application
- **Feedback**: Post-transaction customer feedback collection and analysis

### Frontend (React/TypeScript)
- **Authentication**: Secure login/register forms with validation
- **Dashboard**: Overview of key metrics and recent activity
- **Products**: Product catalog browsing and management
- **Inventory**: Stock level tracking and management
- **Transactions**: Sales processing interface
- **Reports**: Sales data visualization and feedback analysis

## Setup Instructions

### MySQL Setup
1. Download and Install Docker Desktop

2. Start Docker Desktop and open a terminal running this command (change [YOUR_PASSWORD] and save it in a secure place):
   ```
   docker run -d --name dripline-mysql -e MYSQL_ROOT_PASSWORD=[YOUR_PASSWORD] -p 3306:3306 mysql:latest
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install PHP dependencies:
   ```
   composer install
   ```

3. Set up your environment file:
   ```
   copy .env.example .env
   php artisan key:generate
   ```

4. Configure your database in the .env file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=dripline_pos
   DB_USERNAME=root
   DB_PASSWORD=[YOUR_MYSQL_PASSWORD]
   ```

5. Run migrations:
   ```
   php artisan migrate
   ```

6. Start the development server:
   ```
   php artisan serve
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Features

### Core Features
- Product Management/Inventory Management
- Stock Monitoring with alerts for low stock
- Statistics and Reports on sales and customer feedback
- Payment Transaction with Discount options
- Receipt Printing and Email functionality
- User Management with Role-Based Access Control
- Email Receipt with Personalized Content
- User Authentication with security awareness
- Post-Transaction Survey for customer feedback
- Customizable Farewell Messages
- Data Analysis and Improvement Suggestions

## Development Status

- Backend API: Implemented
- Frontend Auth: Implemented
- Dashboard: Basic implementation
- Products & Inventory: In progress
- Transactions: In progress
- Reports & Feedback: In progress

## Next Steps

1. Complete the Products and Inventory management interfaces
2. Implement the Transaction processing workflow
3. Develop Feedback collection and reporting
4. Add Charts and data visualization
5. Implement Receipt printing and emailing

## License

This project is for demonstration purposes only. 