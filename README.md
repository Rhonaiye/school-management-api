
```markdown
# 🏫 School Management System API

A full-featured school management system built with **Express.js**, **TypeScript**, and **MongoDB**. The system supports student and teacher management, class organization, attendance tracking, grading, promotion workflows, role-based access, and more.

> ⚠️ **Status: In Development**  
> This project is currently under active development. Contributions and testing are welcome!

---

## 🧰 Tech Stack

- **Backend:** Express.js + TypeScript  
- **Database:** MongoDB + Mongoose  
- **Auth:** JWT-based with role management  
- **Other Tools:** Zod/Joi, Winston, Morgan

---

## 📦 Features (Planned & Built)

### ✅ PHASE 1: Project Bootstrapping
- [x] Node.js + TypeScript setup
- [x] Feature-based folder structure
- [x] MongoDB connection
- [x] `.env` configuration
- [x] Installed core packages (Express, Mongoose, etc.)

### 📚 PHASE 2: Core Entities — CRUD
- [x] **Student Module**
  - CRUD endpoints
  - Filtering by class, name, etc.
- [x] **Class Module**
  - CRUD + assign students
- [x] **Teacher Module**
  - CRUD + assign to classes

### ⏱️ PHASE 3: Core Features
- [x] **Attendance Tracking**
  - Schema: date, status, studentId
  - Mark attendance per class/day
  - Reports: by class, student, or date
- [x] **Grading System**
  - Manual grading schema
  - Subject-based scores per term
  - Grading rules (A/B/C)
  - Manual/Auto grading toggle
  - Report endpoints

### 🎯 PHASE 4: Workflows & Logic
- [x] **Student Promotion**
  - Class hierarchy (e.g., JSS1 → JSS2)
  - Manual promotion logic
  - Grade check optional before promotion
- [ ] **Timetable Scheduling (Optional)**
  - Periods, teachers, classes
  - View by teacher/class

### 🔐 PHASE 5: Authentication & Authorization
- [x] Admin & Teacher login
- [x] JWT-secured routes
- [x] Role-based access (e.g., only admins can create classes)

### 📊 PHASE 6: Dashboards & Reports
- [x] Attendance summaries
- [x] Class grading performance
- [x] Student progress history

### 📱 PHASE 7: Frontend
- Coming soon...
- Admin & Teacher dashboards planned
- Likely web-based, mobile TBD

### 🚀 PHASE 8: Deployment & Polish
- [x] Request validation (zod/joi)
- [x] Logging (winston, morgan)
- [x] Error handling middleware
- [ ] Hosting (Render, Railway, etc.)

### ✅ Final Milestone: Testing & QA
- [x] Unit tests for core features
- [x] Postman route testing
- [x] Role-based access checks
- [x] Manual QA of workflows

### 🧠 Extra (Optional)
- [ ] Automated grading suggestions
- [ ] Smart promotion logic
- [ ] Attendance risk flagging

---

## 📁 Folder Structure

```

src/
├── config/
├── modules/
│   ├── student/
│   ├── class/
│   ├── teacher/
│   ├── attendance/
│   └── ...
├── middleware/
├── utils/
└── server.ts

````

---

## 🛠 Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Rhonaiye/school-management-api.git
   cd school-management-api
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```env
   PORT=5000
   MONGODB_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run in dev mode:

   ```bash
   npm run dev
   ```

---

## 📮 Contributing

Pull requests are welcome as development is ongoing. If you'd like to contribute, open an issue or fork and submit a PR.

---

## 📌 License

[MIT](LICENSE)

---

## 🔖 Status

🚧 **Actively in Development**
Expect updates and new features regularly.

```

---

