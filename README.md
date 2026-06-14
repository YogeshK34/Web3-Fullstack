# 🚀 Express API - User Management Backend

A lightweight Express.js REST API built to practice full CRUD operations. This serves as the backend for a React frontend application.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Middleware:** CORS, Express JSON Parser
* **Database:** Local JSON array (`/data/users.json`)

---

## 🏃‍♂️ Getting Started

### 1. Installation
Clone the repository, navigate to the project folder, and install the dependencies:
```bash
npm install express cors
```

### 2. Project Structure
Ensure your directory looks like this:
```text
├── data/
│   └── users.json       # Initial seed data array: []
├── server.js            # Main Express file
└── README.md
```

### 3. Run the Server
Start your server locally on port 3000:
```bash
node server.js
```
*The terminal should output: `Express is running on port: 3000`*

---

## 🗺️ API Documentation (Endpoints)

Your React app can hit the following endpoints using `fetch` or `axios` at `http://localhost:3000`:

| Method | Endpoint | Description | Request Body Payload | Expected Success Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Health check endpoint | None | `200 OK` + Message |
| **GET** | `/users` | Fetch all users | None | `200 OK` + `users` array |
| **GET** | `/users/:id` | Fetch single user details | None | `200 OK` + `data` object |
| **POST** | `/create` | Create a new user resource | `{ "name": "...", "niche": "..." }` | `201 Created` + `data` object with new ID |
| **PATCH**| `/update/:id`| Update parts of an existing user | `{ "name": "..." }` OR `{ "niche": "..." }` | `200 OK` + updated `data` object |
| **DELETE**| `/delete/:id`| Completely remove a user | None | `200 OK` + deleted `data` object |

---

## ⚠️ HTTP Error Statuses Handled

When testing or linking your React frontend forms, keep an eye out for these explicit validation responses:
* **`400 Bad Request`**: Sent if you pass an invalid ID type (e.g., `/users/abc`), or if your payloads are empty/incomplete (`POST` or `PATCH`).
* **`404 Not Found`**: Sent if you query, update, or delete a user ID that does not exist in the memory array.

---

## 💡 Frontend Integration Hints for Tomorrow

* **CORS is enabled**: The backend already includes `app.use(cors())`, meaning your React app running on `http://localhost:5173` (Vite) or `http://localhost:3000` will not hit any cross-origin blocks.
* **Header Requirement**: Remember to pass `"Content-Type": "application/json"` in your headers whenever you use `fetch()` for `POST` or `PATCH` requests.

