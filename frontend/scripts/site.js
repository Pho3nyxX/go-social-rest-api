const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const postBtn = document.getElementById("postBtn");
const postsContainer = document.getElementById("postsContainer");

if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const usernameInput = document.getElementById("username");
        const emailInput = document.getElementById("email");
        const message = document.getElementById("message");

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();

        // validation
        if (!username || !email) {
            message.textContent = "Username and email are required";
            return;
        }

        // disable button while submitting
        registerBtn.disabled = true;
        registerBtn.textContent = "Registering...";

        try {
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email })
            });

            // check HTTP status
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            const data = await res.json();
            message.textContent = data.message || "Registered successfully";

            // clear form
            usernameInput.value = "";
            emailInput.value = "";

        } catch (err) {
            message.textContent = err.message || "Registration failed";
        } finally {
            // re-enable button
            registerBtn.disabled = false;
            registerBtn.textContent = "Register";
        }
    });
}
