
// DASHBOARD BLOGS
const dashboardContainer =
    document.querySelector(".dashboard-blog-container");

if (dashboardContainer) {

    let blogs = JSON.parse(localStorage.getItem("myBlogs")) || [];

    // Remove duplicate blogs
    const uniqueBlogs = [];

    blogs.forEach(function (blog) {

        const alreadyExists = uniqueBlogs.some(function (item) {
            return item.title === blog.title &&
                item.category === blog.category &&
                item.content === blog.content;
        });

        if (!alreadyExists) {
            uniqueBlogs.push(blog);
        }
    });

    // Save unique blogs
    localStorage.setItem("myBlogs", JSON.stringify(uniqueBlogs));

    // Display saved blogs
    uniqueBlogs.forEach(function (blog) {

        const blogCard = document.createElement("div");
        blogCard.className = "dashboard-blog-card";

        const title = document.createElement("h3");
        title.textContent = blog.title;

        const description = document.createElement("p");
        description.textContent = blog.description;

        const category = document.createElement("p");
        category.textContent = "Category: " + blog.category;

        const status = document.createElement("span");
        status.textContent = "Published";

        blogCard.appendChild(title);
        blogCard.appendChild(description);
        blogCard.appendChild(category);
        blogCard.appendChild(status);

        dashboardContainer.appendChild(blogCard);
    });

    // Update counters
    const totalBlogs = document.querySelector("#totalBlogs");
    const publishedBlogs = document.querySelector("#publishedBlogs");

    const sampleBlogCount =
        dashboardContainer.querySelectorAll(".dashboard-blog-card").length
        - uniqueBlogs.length;

    const total = sampleBlogCount + uniqueBlogs.length;

    totalBlogs.textContent = total;
    publishedBlogs.textContent = total;
}
