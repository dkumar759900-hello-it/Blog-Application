# MyBlog – Full Stack Blog Application

MyBlog is a full-stack blog application that allows users to register, log in, create blog posts, manage their blogs, and explore published content. It provides a simple and responsive interface with backend authentication and MongoDB database integration.

## Features

- **User Registration:** Create an account using name, email, and password.
- **User Login:** Secure login using password hashing and JWT authentication.
- **User Dashboard:** View profile information and blog statistics.
- **Create Blog:** Publish blogs with title, category, description, and content.
- **All Blogs:** Browse published blog posts.
- **Blog Details:** View complete blog information and author details.
- **My Blogs:** View and manage blogs created by the logged-in user.
- **CRUD Operations:** Create, read, update, and delete blog posts.
- **Responsive UI:** Designed to work on desktop, tablet, and mobile devices.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs

### Database
- MongoDB
- Mongoose
- MongoDB Compass

### Development Tools
- Visual Studio Code
- Git and GitHub
- Live Server
- Postman / API testing through browser and PowerShell

## Project Structure

```text
Blog-Application/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── all-blogs.html
├── blog-details.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dkumar759900-hello-it/Blog-Application.git
```

### 2. Open the Project

Open the `Blog-Application` folder in Visual Studio Code.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/myblog
JWT_SECRET=your_secret_key
```

### 5. Start MongoDB

Make sure MongoDB Community Server is installed and running on your computer.

### 6. Start the Backend Server

From the backend folder, run:

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

### 7. Run the Frontend

Open `index.html` using the Live Server extension in Visual Studio Code.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/blogs/create` | Create a blog |
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/blogs/my-blogs` | Get logged-in user's blogs |
| GET | `/api/blogs/:id` | Get blog details |

Additional update and delete routes are implemented in the blog routes.

## Database

MyBlog uses MongoDB to store user accounts and blog posts. Mongoose is used for database models and operations.

## Security

- Passwords are hashed using bcryptjs.
- JWT tokens are used for user authentication.
- Protected routes require a valid authentication token.
- Environment variables are used for sensitive configuration.

## Author

**Deepak Singh**

B.Tech Computer Science and Engineering

## GitHub Repository

[Blog-Application – GitHub](https://github.com/dkumar759900-hello-it/Blog-Application)

---

*Developed as a Full Stack Web Development Internship Project.*