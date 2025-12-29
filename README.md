# Task Management Application

A full-stack task management system built with React, Node.js, Express, and PostgreSQL.

## Table of Contents

- [Task Management Application](#task-management-application)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Setup Instructions](#setup-instructions)
  - [Technology Stack](#technology-stack)
  - [Screen Shots](#screen-shots)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Tasks](#tasks)
  - [Troubleshooting](#troubleshooting)

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Setup Instructions

1. **Clone and navigate to the project:**
   ```bash
   git clone https://github.com/Ahmed-Ebrahim-23/Task-Management-Application.git
   cd Task-Management-Application
   ```

2. **Start the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Database: localhost:5432

## Technology Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Development**: Docker Compose, Nodemon


## Screen Shots
![alt text](<assets/Screenshot from 2025-12-29 03-11-52.png>)
![alt text](<assets/Screenshot from 2025-12-29 03-12-26.png>) 
![alt text](<assets/Screenshot from 2025-12-29 03-14-51.png>)

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|-------------|
| POST | `/auth/register` | Register new user | No | `{ name, email, password }` |
| POST | `/auth/login` | User login | No | `{ email, password }` |

### Users
| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|-------------|
| GET | `/users` | Get current user info | Yes | - |
| DELETE | `/users` | Delete current user | Yes | - |

### Tasks
| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|-------------|
| GET | `/tasks` | Get all tasks with pagination | Yes | Query: `page`, `limit`, `search`, `status` |
| POST | `/tasks` | Create new task | Yes | `{ title, description }` |
| GET | `/tasks/:taskId` | Get specific task | Yes | - |
| PUT | `/tasks/:taskId` | Update task | Yes | `{ title, description, status }` |
| DELETE | `/tasks/:taskId` | Delete task | Yes | - |
| GET | `/tasks/statistics` | Get task statistics | Yes | - |


## Troubleshooting

- **Port conflicts**: Ensure ports 3000, 3001, and 5432 are available
- **Database connection**: Wait for PostgreSQL to be healthy before accessing

