import {
    loginUser
} from "../../../shared/js/services/authService.js";

import {
    getProfile
} from "../../../shared/js/services/profileService.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");

form.addEventListener("submit", handleLogin);

async function handleLogin(e) {
    e.preventDefault();

    message.innerHTML = "";
    message.className = "";

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    if (!email || !password) {
        message.className = "alert alert-danger mt-3";
        message.innerHTML = "Please fill in all fields.";
        return;
    }

    message.className = "alert alert-info mt-3";
    message.innerHTML = "Signing in...";

    try {

        const result = await loginUser(
            email,
            password
        );

        if (!result.success) {
            message.className = "alert alert-danger mt-3";
            message.innerHTML = result.error;
            return;
        }

        const profile = await getProfile();

        if (!profile) {
            message.className = "alert alert-danger mt-3";
            message.innerHTML =
                "Unable to load user profile.";
            return;
        }

        message.className = "alert alert-success mt-3";
        message.innerHTML = "Login successful!";

        setTimeout(() => {

            if (profile.role === "admin") {

                window.location.replace(
                    "../admin/dashboard.html"
                );

            } else {

                window.location.replace(
                    "../student/dashboard.html"
                );

            }

        }, 500);

    } catch (error) {

        console.error(error);

        message.className = "alert alert-danger mt-3";
        message.innerHTML =
            error.message || "An unexpected error occurred.";

    }
}