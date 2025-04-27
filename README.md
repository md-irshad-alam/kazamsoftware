# 📝 Task Notes Application

A real-time task notes app built with modern web technologies. This application allows users to create, update, and view tasks with real-time sync using Socket.IO. It supports infinite scrolling and paginated API fetching (10 tasks per page).

---

## 🚀 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express.js
- **Real-time**: Socket.IO
- **Language**: TypeScript (Frontend and Backend)
- **Database**: MongoDB
- **Cache**: Redis
- **Pagination**: Infinite Scroll with controlled API fetch
- **Limit**: Only 10 pages (maximum 100 tasks) can be fetched

---
## Important URL
- Backend deployed URL https://kazamsoftware.onrender.com
- Front-End deployement URL https://kazamsoftware-84tk.vercel.app/

## 📦 Features

- ✅ Real-time updates using Socket.IO
- ✅ Add, update, and delete task notes
- ✅ Infinite scrolling for task list
- ✅ Paginated backend API (10 tasks per page)
- ✅ API fetches a maximum of 10 pages (100 tasks)
- ✅ Redis is used as a temporary cache for tasks
- ✅ When Redis has more than 40 tasks, they are inserted into MongoDB automatically
- ✅ Clean architecture with TypeScript on both client and server
- ✅ Responsive and fast UI built with React & Vite

---
## 📂 Folder Structure
      FrontEnd
          --src
              --app.jsx

            --Service
                  ---FetcchAllTask.jsx
        Backend
            controller 
                  -db.js
            model
                schema.ts
            redis
                redisConfiguration.ts
            index.ts

            env
                PORT: ''
                REDISPORT: ''
                MONGO_URI: ""
                REDISHOST:''
                TASK_KEY:""
                RED_URL:""
                MONGO_PASS
                MONGO_USERNAME:""
----

## Responsive Design

#mobile
![image](https://github.com/user-attachments/assets/83395691-b358-4ee9-8e7a-aae05f299b8d)
#iPad mini
![image](https://github.com/user-attachments/assets/655d2a12-81e8-4c27-ba81-c2ef1c0ceed6)


---

## 📡 API Endpoints

### `GET /getAll`

- Returns All tasks
  
### `POST /api/tasks`

- Adds a new task
  -- socket.emit('add', task},


## 🧠 Redis and MongoDB Integration

- Tasks are first stored temporarily in **Redis** for faster access.
- When the number of tasks in Redis exceeds **40**, the tasks are **bulk inserted into MongoDB**.
- This ensures fast performance and optimized database operations.

---

## 🔁 Real-Time Features (Socket.IO)

- Whenever a task is added, updated, or deleted, all connected clients receive instant updates in real-time without refreshing the page.

---

## 🧑‍💻 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/task-notes-app.git
cd task-notes-app

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
PORT=5000
MONGO_URI=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev

```
