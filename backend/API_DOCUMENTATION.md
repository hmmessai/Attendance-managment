# Backend API Documentation

Base URL: `http://<HOST>:<PORT>/api`

Authentication: JWT Bearer token required for protected endpoints. Obtain token via `/auth/login` or `/auth/register`.

---

**Auth**

- POST `/api/auth/register`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Success: `201` { message, token }

- POST `/api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - Success: `200` { token }

- GET `/api/auth/currentUser` (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` { name, email }

---

**Student**

- GET `/api/student/all` (protected)
  - Headers: `Authorization: Bearer <token>`
  - Success: `200` { data: [ { id, name, section }, ... ] }

- GET `/api/student/get` (protected)
  - NOTE: This endpoint expects JSON body even though it's a GET in code.
  - Body: `{ "id": "<studentId>" }`
  - Success: `200` { student: { id, name, section, attendance: [ { id, day, status } ] } }

- POST `/api/student/create` (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": string, "section": string }`
  - Success: `201` { message }

---

**Attendance**

- GET `/api/attendance/get-full` (protected)
  - NOTE: implemented as GET but expects JSON body.
  - Body: `{ "studentId": "<studentId>" }`
  - Success: `200` -> array of attendance documents
  - 404 if no records

- GET `/api/attendance/get-daily` (protected)
  - Body: `{ "studentId": "<studentId>", "date": "YYYY-MM-DD" }`
  - Success: `200` -> array of attendance docs for given date

- POST `/api/attendance/create-yearly` (protected)
  - Body: `{ "studentId": "<studentId>", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }`
  - Creates attendance records (weekends only per code). Success: `201` { message, records: <number> }
  - 400 on duplicate handling or creation issues

- POST `/api/attendance/create-yearly-all` (protected)
  - Body: `{ "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }`
  - Creates records for all students across date range (weekends only). Success: `201` { message, records: <number> }

- PUT `/api/attendance/update-status` (protected)
  - Body options:
    - `{ "attendanceId": "<id>", "status": "Present|Absent|Late-30mins|Late-1hr|Late-2hrs|Permission" }` OR
    - `{ "studentId": "<studentId>", "date": "YYYY-MM-DD", "status": "..." }`
  - Success: `200` { message: "Attendance status updated", record }
  - 400 for invalid status or missing identifiers, 404 if record not found

- POST `/api/attendance/post-bulk` (protected)
  - Body: `{ "data": { "<studentId>": "<status>", ... }, "day": "YYYY-MM-DD" }`
  - `day` defaults to today if omitted. Success: `200` { message }

- DELETE `/api/attendance/clear-records` (protected)
  - Deletes all attendance records. Success: `200` { message }

---

Errors: endpoints return JSON with `message` or `error`. Typical status codes used: `200`, `201`, `400`, `401`, `404`, `500`.

Examples

- Login (curl):

  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"you@example.com","password":"yourpass"}'

- Protected request example (get all students):

  curl -X GET http://localhost:5000/api/student/all \
    -H "Authorization: Bearer <TOKEN>" \
    -H "Content-Type: application/json"

Notes & Recommendations

- Some endpoints are defined as GET but expect a JSON body (`/get`, `/get-full`, `/get-daily`). Consider changing them to POST or move parameters to query string for REST semantics.
- Validate request payloads and add OpenAPI/Swagger spec for better developer experience.

File generated from backend route/controller definitions.
