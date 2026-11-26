
const API_URL = "http://localhost:5000/api";

// USER LOGIN WITH BACKEND API
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login Successful!");
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Login failed!");
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Unable to connect to server!");
        }
    });
}


// DISPLAY BLOG CARD
function createBlogCard(blog) {
    const card = document.createElement("div");
    card.className = "blog-card";

    const title = document.createElement("h3");
    title.textContent = blog.title;

    const description = document.createElement("p");
    description.textContent = blog.description || "";

    const category = document.createElement("p");
    category.textContent = "Category: " + (blog.category || "General");

    const author = document.createElement("p");
    author.textContent = "By: " + (blog.author?.name || "Unknown");

    const readMore = document.createElement("a");
    readMore.href = `blog-details.html?id=${encodeURIComponent(blog._id)}`;
    readMore.textContent = "Read More";

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(category);
    card.appendChild(author);
    card.appendChild(readMore);

    return card;
}


// LOAD LATEST BLOGS ON HOME PAGE
async function loadLatestBlogs() {
    const container = document.querySelector(".blog-container");

    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/blogs`);

        if (!response.ok) {
            throw new Error("Unable to fetch blogs");
        }

        const blogs = await response.json();

        container.innerHTML = "";

        if (blogs.length === 0) {
            container.textContent = "No blogs available yet.";
            return;
        }

        blogs.slice(0, 3).forEach(blog => {
            container.appendChild(createBlogCard(blog));
        });

    } catch (error) {
        console.error("Latest Blogs Error:", error);
        container.textContent = "Unable to load blogs.";
    }
}


// LOAD ALL BLOGS PAGE
async function loadAllBlogs() {
    const container = document.querySelector(".all-blogs-container");

    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/blogs`);

        if (!response.ok) {
            throw new Error("Unable to fetch blogs");
        }

        const blogs = await response.json();

        container.innerHTML = "";

        if (blogs.length === 0) {
            container.textContent = "No blogs found.";
            return;
        }

        blogs.forEach(blog => {
            container.appendChild(createBlogCard(blog));
        });

    } catch (error) {
        console.error("All Blogs Error:", error);
        container.textContent = "Unable to load blogs.";
    }
}


// LOAD INDIVIDUAL BLOG DETAILS
async function loadBlogDetails() {
    const container = document.querySelector("#blogDetails");

    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");

    if (!blogId) {
        container.textContent = "Blog ID not found.";
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/blogs/${encodeURIComponent(blogId)}`
        );

        if (!response.ok) {
            throw new Error("Blog not found");
        }

        const blog = await response.json();

        container.innerHTML = "";

        const title = document.createElement("h1");
        title.textContent = blog.title;

        const category = document.createElement("p");
        category.textContent = "Category: " + blog.category;

        const description = document.createElement("h3");
        description.textContent = blog.description || "";

        const author = document.createElement("p");
        author.textContent = "Author: " + (blog.author?.name || "Unknown");

        const content = document.createElement("p");
        content.textContent = blog.content || "";

        container.append(title, category, description, author, content);

    } catch (error) {
        console.error("Blog Details Error:", error);
        container.textContent = "Unable to load blog details.";
    }
}


// DASHBOARD BLOGS
const dashboardContainer = document.querySelector(
    ".dashboard-blog-container"
);

async function loadDashboardBlogs() {
    if (!dashboardContainer) return;

    const token = localStorage.getItem("token");

    if (!token) {
        dashboardContainer.textContent =
            "Please login to view your blogs.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/blogs/my-blogs`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const blogs = await response.json();

        dashboardContainer.innerHTML = "";


        blogs.forEach(function (blog) {

            const blogCard = document.createElement("div");
            blogCard.className = "dashboard-blog-card";

            blogCard.innerHTML = `
        <h3>${blog.title}</h3>
        <p>${blog.description || ""}</p>
        <p>Category: ${blog.category}</p>
        <span>${blog.status || "Published"}</span>
        <br><br>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

            // Edit Blog
            blogCard.querySelector(".edit-btn").addEventListener("click", async () => {

                const title = prompt("Enter new blog title:", blog.title);
                if (!title) return;

                const response = await fetch(
                    `http://localhost:5000/api/blogs/${blog._id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            title,
                            category: blog.category,
                            description: blog.description,
                            content: blog.content
                        })
                    }
                );

                const data = await response.json();
                alert(data.message);
                loadDashboardBlogs();
            });

            // Delete Blog
            blogCard.querySelector(".delete-btn").addEventListener("click", async () => {

                if (!confirm("Are you sure you want to delete this blog?")) return;

                const response = await fetch(
                    `http://localhost:5000/api/blogs/${blog._id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();
                alert(data.message);
                loadDashboardBlogs();
            });

            dashboardContainer.appendChild(blogCard);
        });


        const totalBlogs = document.querySelector("#totalBlogs");
        const publishedBlogs = document.querySelector("#publishedBlogs");

        if (totalBlogs) {
            totalBlogs.textContent = blogs.length;
        }

        if (publishedBlogs) {
            publishedBlogs.textContent = blogs.filter(
                blog => blog.status === "Published"
            ).length;
        }

        if (blogs.length === 0) {
            dashboardContainer.textContent = "No blogs found.";
        }

    } catch (error) {
        console.error("Dashboard Error:", error);
        dashboardContainer.textContent = "Unable to load blogs.";
    }
}


// RUN PAGE FUNCTIONS
loadLatestBlogs();
loadAllBlogs();
loadBlogDetails();
loadDashboardBlogs();



// MODULE 5: PROTECTED DASHBOARD
const currentToken = localStorage.getItem("token");

if (window.location.pathname.endsWith("dashboard.html")) {

    if (!currentToken) {
        alert("Please login first!");
        window.location.href = "login.html";
    }
}

// LOGOUT FUNCTIONALITY
const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();

        localStorage.removeItem("token");

        window.location.href = "login.html";
    });
}

// LOAD USER PROFILE
async function loadUserProfile() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/profile",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const user = await response.json();

        document.querySelector("#profileName").textContent = user.name;
        document.querySelector("#profileEmail").textContent = user.email;

    } catch (error) {
        console.error("Profile Error:", error);
    }
}

// Run profile function only on dashboard
if (document.querySelector("#profileName")) {
    loadUserProfile();
}