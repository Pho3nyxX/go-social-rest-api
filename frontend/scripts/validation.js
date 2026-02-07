export function validateUsername(username) {
    if (!username) {
        return "Username is required";
    }
    if (username.length < 3 || username.length > 20) {
        return "Username must be 3–20 characters";
    }
    if (!/(?=.*[a-zA-Z])/.test(username)) {
        return "Username must contain at least one letter";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return "Only letters, numbers, and underscores allowed";
    }
    if (/^_|_$/.test(username)) {
        return "Username cannot start or end with underscore";
    }

    return null;
}

export function validateEmail(email) {
    if (!email) return "Email is required";

    if (email.includes(" "))
        return "Email cannot contain spaces";

    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email))
        return "Invalid email format";

    return null;
}