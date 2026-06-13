import { supabase }
from "../../../config/supabase.js";

import {
    getCurrentUser
}
from "./authService.js";

export async function getProfile() {

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return null;
    }

    const {
        data,
        error
    } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

export async function requireLogin() {

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        window.location.href = "../../auth/login.html";
        return;
    }

    return user;
}

export async function requireStudent() {

    await requireLogin();

    const profile = await getProfile();

    if (!profile || profile.role !== "student") {
        window.location.href =
            "../admin/dashboard.html";
    }
}

export async function requireAdmin() {

    await requireLogin();

    const profile = await getProfile();

    if (!profile || profile.role !== "admin") {
        window.location.href =
            "../student/dashboard.html";
    }
}