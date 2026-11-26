
// USER LOGIN WITH BACKEND API
const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

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

// DASHBOARD BLOGS
const dashboardContainer = document.querySelector(".dashboard-blog-container");

async function loadDashboardBlogs() {

    if (!dashboardContainer) return;

    const token = localStorage.getItem("token");

    if (!token) {
        dashboardContainer.textContent = "Please login to view your blogs.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/blogs/my-blogs",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
        }

        const blogs = await response.json();

        dashboardContainer.innerHTML = "";

        blogs.forEach(function (blog) {

            const blogCard = document.createElement("div");
            blogCard.className = "dashboard-blog-card";

            const title = document.createElement("h3");
            title.textContent = blog.title;

            const description = document.createElement("p");
            description.textContent = blog.description || "";

            const category = document.createElement("p");
            category.textContent = "Category: " + blog.category;

            const status = document.createElement("span");
            status.textContent = blog.status || "Published";

            blogCard.appendChild(title);
            blogCard.appendChild(description);
            blogCard.appendChild(category);
            blogCard.appendChild(status);

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

loadDashboardBlogs();
