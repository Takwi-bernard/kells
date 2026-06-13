import { supabase }
from "../../config/supabase.js";

async function protectPage() {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
        window.location.replace("../auth/login.html");
        return false;
    }

    return true;
}

async function redirectUser() {

    const profile = await getProfile();

    if (profile.role === "admin") {
        window.location.href =
        "../admin/dashboard.html";
    } else {
        window.location.href =
        "../student/dashboard.html";
    }

}

async function resetPassword(email){

    return await supabase.auth.resetPasswordForEmail(
        email,
        {
            redirectTo:
            window.location.origin +
            "/auth/reset-password.html"
        }
    );

}

async function restoreSession(){

    const {
        data: { session }
    } = await supabase.auth.getSession();

    return session;

}