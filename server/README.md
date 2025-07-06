# Task Management

A Node.js/Express REST API for managing users, projects, and tasks, with authentication and seeding support. This project uses MongoDB via Mongoose.

## Features
- User authentication (JWT)
- Project and task management
- Role-based access (seeded roles)
- Database seeding for quick testing

## Project Structure
```
├── app.js                # Main application entry point
├── config/               # Database and config files
├── controller/           # Route controllers
├── middleware/           # Auth, validation, error handling
├── models/               # Mongoose models (User, Project, Task, Role)
├── router/               # Express route definitions
├── seeders/              # Seeder scripts
├── service/              # Business logic
├── validate/             # Joi validation schemas
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB instance (local or remote)

### Installation
1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   dbhost=localhost
   db=pricingplans
   PRIVATE_KEY=your_jwt_secret_key
   ```
   - `PORT`: Port for the server (default: 3000)
   - `dbhost`: MongoDB host (e.g., localhost)
   - `db`: MongoDB database name
   - `PRIVATE_KEY`: Secret key for JWT signing

### Running the Server
Start the development server:
```
npm start
```
The server will run on `http://localhost:3000` (or your specified PORT).

## Seeding the Database
To quickly populate the database with test data (one user, two projects, and three tasks per project), run:
```
npm run seed
```
This will create:
- A user with email: `test@example.com` and password: `Test@123`
- Two projects linked to this user
- Three tasks for each project

## API Overview

### Authentication
- JWT-based authentication is required for most endpoints.
- Obtain a token via the login endpoint (not shown here).

### Main Endpoints
- `POST   /task/create`         - Create a new task
- `GET    /task/get/:id`        - Get a task by ID
- `GET    /task/getAlltask`     - Get all tasks
- `PUT    /task/update/:id`     - Update a task
- `DELETE /task/delete/:id`     - Delete a task
- Similar endpoints exist for projects and users.

### Validation
- All create/update endpoints use Joi validation.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE) 