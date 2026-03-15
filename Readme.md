# 🌊 ZenBoard - Real-Time Kanban Workspace

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Live Demo:** [Click here to view the live project](https://zen-board-chi.vercel.app)

ZenBoard is a full-stack, real-time project management application inspired by Trello. It allows users to create isolated workspaces, organize tasks into drag-and-drop lists, and collaborate seamlessly with team members via WebSockets.

## ✨ Key Features

* **Multi-Tenant Architecture:** Secure, isolated boards where users can only view and manage projects they own or have been invited to.
* **Real-Time Collaboration:** Changes made by one user (creating cards, deleting lists, adding members) are instantly broadcasted to all other active users on the board using Socket.io rooms.
* **Secure Authentication:** JWT-based login and registration system with encrypted passwords and protected API routes.
* **Relational Data Management:** Full CRUD (Create, Read, Update, Delete) capabilities cascading across a PostgreSQL database (Boards → Lists → Cards).
* **Workspace Dashboard:** A centralized hub to view all owned and shared projects, with the ability to create or permanently delete entire workspaces.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS (Styling & UI)
* Axios (API calls)
* React Router DOM (Navigation)
* Lucide React (Icons)

**Backend:**
* Node.js & Express
* PostgreSQL (`pg` library)
* Socket.io (Real-time engine)
* JSON Web Tokens (JWT Auth)

**Deployment:**
* Vercel (Frontend)
* Render (Backend API & WebSockets)
* Neon.tech (Serverless PostgreSQL Database)

## 🚀 Local Setup & Installation

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Harjot2022/zenboard.git](https://github.com/Harjot2022/zenboard.git)
cd Zenboard