import { validateUsername, validateEmail, validatePassword } from "./validation.js";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname.split("/").pop();
    const protectedPages = ["dashboard.html", "post.html"];
    const publicPages = ["login.html", "register.html"];

    if (protectedPages.includes(currentPage)) {
        if (!token) {
            window.location.href = "login.html";
            return;
        }

        const decoded = parseJWT(token);
        if (!decoded) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const welcomeMessage = document.getElementById("welcomeMessage");
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${decoded.username}`;
        }
    }

    if (publicPages.includes(currentPage)) {
        if (token) {
            window.location.href = "dashboard.html";
            return;
        }
    }

    fetchPosts();
});

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const postBtn = document.getElementById("postBtn");

function parseJWT(token) {
    try {
        const base63Payload = token.split('.')[1];
        const decodePayload = atob(base63Payload);
        return JSON.parse(decodePayload);
    } catch (e) {
        return null;
    }
}

function showMessage(element, text, duration = 3000) {
    element.textContent = text;
    if (duration > 0) {
        setTimeout(() => {
            element.textContent = "";
        }, duration);
    }
}

if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const usernameInput = document.getElementById("username");
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const message = document.getElementById("message");

        let username = usernameInput.value.trim();
        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();

        let usernameError = validateUsername(username);
        if (usernameError) {
            showMessage(message, usernameError);
            return;
        }

        let emailError = validateEmail(email);
        if (emailError) {
            showMessage(message, emailError);
            return;
        }

        let passwordError = validatePassword(password);
        if (passwordError) {
            showMessage(message, passwordError);
            return;
        }

        registerBtn.disabled = true;
        registerBtn.textContent = "Registering...";

        try {
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            let data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            showMessage(message, data.message || "Registered successfully");

            usernameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (err) {
            showMessage(message, err.message || "Registration failed");
        } finally {
            registerBtn.disabled = false;
            registerBtn.textContent = "Register.";
        }
    });
}

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const message = document.getElementById("message");

        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();

        let emailError = validateEmail(email);
        if (emailError) {
            showMessage(message, emailError);
            return;
        }

        let passwordError = validatePassword(password);
        if (passwordError) {
            showMessage(message, passwordError);
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        try {
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application'json" },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            localStorage.setItem("token", data.token);

            showMessage(message, "Login successful");

            emailInput.value = "";
            passwordInput.value = "";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (err) {
            showMessage(message, err.message || "Login failed");
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = "Login";
        }
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    })
}

if (postBtn) {
    postBtn.addEventListener("click", async () => {
        const postBody = document.getElementById("postBody").value.trim();
        const message = document.getElementById("postMessage");
        const token = localStorage.getItem("token");

        if (!postBody) {
            message.textContent = "Post cannot be empty";
            return;
        }

        postBtn.disabled = true;

        try {
            const res = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ content: postBody })
            });

            const data = await res.json();

            console.log(data.message);
            if (!res.ok) {
                throw new Error(data.message || "Post failed");
            }

            message.textContent = "Post created successfully";
            document.getElementById("postBody").value = "";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (err) {
            message.textContent = err.message;
        } finally {
            postBtn.disabled = false;
        }
    })
}

async function fetchPosts() {
    const token = localStorage.getItem("token");
    const postsContainer = document.getElementById("postsContainer");

    if (!postsContainer || !token) return;

    try {
        const res = await fetch("http://localhost:8080/api/posts", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            postsContainer.innerHTML = "<p>Failed to load posts.</p>";
            return;
        }

        postsContainer.innerHTML = "";

        data.posts.reverse().forEach(post => {
            const postEl = document.createElement("div");
            postEl.className = "post-card";

            postEl.innerHTML = `
                <div class="post-header">
                    <strong class="post-username">
                        ${post.username || "Unknown"}
                    </strong>

                    <div class="post-actions">
                        <button class="editBtn" data-id="${post.id}">
                            Edit
                        </button>

                        <button class="deleteBtn" data-id="${post.id}">
                            Delete
                        </button>
                    </div>
                </div>

                <p class="post-content">
                    ${post.content}
                </p>

                <small class="post-date">
                    ${new Date(post.createdAt).toLocaleString()}
                </small>
            `;

            const deleteBtn = postEl.querySelector(".deleteBtn");
            const editBtn = postEl.querySelector(".editBtn");

            deleteBtn.addEventListener("click", (e) => {
                const postId = e.target.dataset.id;
                deletePost(postId);
            });

            editBtn.addEventListener("click", (e) => {
                const postId = e.target.dataset.id;

                const contentEl = postEl.querySelector(".post-content");

                const newContent = prompt("Edit your post:", contentEl.textContent);

                if (!newContent) return;

                updatePost(postId, newContent);
            });

            postsContainer.appendChild(postEl);
        });

    } catch (err) {
        console.error(err);
        postsContainer.innerHTML = "<p>Error loading posts.</p>";
    }
}

async function deletePost(postId) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            alert("Failed to delete post");
            return;
        }

        fetchPosts();
    } catch (err) {
        console.error(err);
    }
}

async function updatePost(postId, content) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        let data = {};
        if (res.status !== 204) {
            data = await res.json();
        }

        if (!res.ok) {
            alert("Failed to update post");
            return;
        }

        fetchPosts();
        alert(data.message);
    } catch (err) {
        console.error(err);
    }
}
