import { supabase }
from "../../config/supabase.js";

async function requireLogin() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
        window.location.href =
        "../auth/login.html";
    }

    return session;
}