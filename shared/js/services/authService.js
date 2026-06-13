import { supabase } from "../../../config/supabase.js";

// REGISTER
export async function registerUser(fullName, email, password, role) {

    try {

        const { data, error } = await supabase.auth.signUp({

            email,
            password,

            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }

        });

        if (error) throw error;

        return {
            success: true,
            data
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }

}

// LOGIN

export async function loginUser(email, password) {

    const { data, error } = await supabase.auth.signInWithPassword({

        email,
        password

    });

    if (error) {

        return {

            success: false,
            error: error.message

        };

    }

    return {

        success: true,
        data

    };

}

// LOGOUT

export async function logoutUser() {

    await supabase.auth.signOut();

    window.location.href = "../../auth/login.html";

}

// CURRENT USER

export async function getCurrentUser() {

    const {

        data: { user }

    } = await supabase.auth.getUser();

    return user;

}

// FORGOT PASSWORD

export async function forgotPassword(email) {

    const { error } =
    await supabase.auth.resetPasswordForEmail(email);

    if (error) {

        return {

            success: false,
            error: error.message

        };

    }

    return {

        success: true

    };

}

// UPDATE PASSWORD

export async function updatePassword(newPassword) {

    const { error } =
    await supabase.auth.updateUser({

        password: newPassword

    });

    if (error) {

        return {

            success: false,
            error: error.message

        };

    }

    return {

        success: true

    };

}