# Bus Tech — User Service

The user and authentication microservice of **Bus Tech**, an automated bus scheduling and
operations platform that won **Smart India Hackathon 2024**. It handles registration, login with
JWT, and user profiles for passengers, staff and admins.

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-4-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![JWT](https://img.shields.io/badge/auth-JWT-orange)

## Part of the Bus Tech platform

| Repository | Role |
| --- | --- |
| [Bus-tech-bus](https://github.com/naksh1414/Bus-tech-bus) | Bus fleet, capacity and route assignment |
| [Bus-tech-seat](https://github.com/naksh1414/Bus-tech-seat) | Seat inventory and booking status |
| **Bus-tech-user** (this repo) | Users, authentication and roles |
| [Bus-tech-Admin](https://github.com/naksh1414/Bus-tech-Admin) | Admin dashboard |

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | – | Create an account |
| `POST` | `/login` | – | Log in and receive a JWT |
| `GET` | `/profile` | Bearer token | Get the logged-in user's profile |
| `PUT` | `/profile` | Bearer token | Update the logged-in user's profile |

Protected routes expect `Authorization: Bearer <token>`.

## Roles

Every user has one role: `passenger`, `staff` or `admin`. The role is returned at login so
clients can show the right features.

## Security

- Passwords are hashed with **bcrypt** before storage; plain-text passwords are never saved.
- Access tokens are **signed JWTs** with a configurable expiry.
- Secrets (`JWT_SECRET`, `MONGODB_URI`) are read from the environment and never committed.

## Structure

```
app.ts                 # Express app and startup
config/database.ts     # MongoDB connection
src/
├── routes/            # registration, login, profile
├── services/          # user business logic
├── models/            # Mongoose user schema
├── middleware/        # JWT authentication middleware
├── utils/             # JWT and password helpers
└── types/             # DTOs and role enum
```

## Run it locally

Requires Node.js 18+ and MongoDB.

```bash
git clone https://github.com/naksh1414/Bus-tech-user.git
cd Bus-tech-user
cp .env.example .env        # set MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

The service listens on `http://localhost:8080`.

A `Dockerfile` is included for building a container image.

## Configuration

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign access tokens; use a long random value |
| `JWT_EXPIRY` | Token lifetime, e.g. `1d` |

## Author

Nakshatra Manglik · [nakshatramanglik14@gmail.com](mailto:nakshatramanglik14@gmail.com) ·
[GitHub](https://github.com/naksh1414)
