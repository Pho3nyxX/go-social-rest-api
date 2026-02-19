import { validateUsername, validateEmail, validatePassword } from "./validation.js";

const registerBtn = document.getElementById("registerBtn");
// const loginBtn = document.getElementById("loginBtn");
// const postBtn = document.getElementById("postBtn");
// const postsContainer = document.getElementById("postsContainer");

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
