import { requireStudent, getProfile } from "../../../shared/js/services/profileService.js";
import { supabase } from "../../../config/supabase.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await requireStudent();
    initMobileNavigation();
    await loadProfile();

    if (document.getElementById("uploadBtn")) document.getElementById("uploadBtn").addEventListener("click", uploadAvatar);
    if (document.getElementById("saveProfile")) document.getElementById("saveProfile").addEventListener("click", saveProfile);
    if (document.getElementById("logoutBtn")) document.getElementById("logoutBtn").addEventListener("click", logout);
}

function initMobileNavigation() {
    const menuToggle = document.getElementById("mobileMenuToggle");
    const sidebarDock = document.getElementById("sidebarDock");
    if (menuToggle && sidebarDock) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebarDock.classList.toggle("active");
        });
        document.addEventListener("click", (e) => {
            if (sidebarDock.classList.contains("active") && !sidebarDock.contains(e.target)) {
                sidebarDock.classList.remove("active");
            }
        });
    }
}

async function loadProfile() {
    const profile = await getProfile();
    if (!profile) return;

    const setNodeText = (id, val) => { if(document.getElementById(id)) document.getElementById(id).textContent = val || "Not Assigned"; };
    const setNodeValue = (id, val) => { if(document.getElementById(id)) document.getElementById(id).value = val || ""; };

    setNodeText("studentName", profile.full_name);
    setNodeText("email", profile.email);
    setNodeText("programme", profile.programme);
    setNodeText("faculty", profile.faculty);
    setNodeText("department", profile.department);
    setNodeText("matricule", profile.student_number);

    setNodeValue("fullName", profile.full_name);
    setNodeValue("phone", profile.phone);
    setNodeValue("gender", profile.gender || "Male");
    setNodeValue("dob", profile.date_of_birth);
    setNodeValue("address", profile.address);

    if (document.getElementById("profilePreview")) {
        document.getElementById("profilePreview").src = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "Student")}&background=4F46E5&color=fff&size=100`;
    }
}

async function saveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
        full_name: document.getElementById("fullName")?.value || "",
        phone: document.getElementById("phone")?.value || "",
        gender: document.getElementById("gender")?.value || "Male",
        date_of_birth: document.getElementById("dob")?.value || null,
        address: document.getElementById("address")?.value || ""
    };

    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
    if (error) { alert("Data save exception: " + error.message); return; }

    alert("Profile configurations saved successfully.");
    await loadProfile();
}

async function uploadAvatar() {
    const fileInput = document.getElementById("avatarInput");
    const file = fileInput?.files?.[0];
    if (!file) { alert("Please pick an image first."); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileName = `${user.id}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });
    if (uploadError) { alert("File upload blocked: " + uploadError.message); return; }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const { error: dbError } = await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
    if (dbError) { alert("Database update exception: " + dbError.message); return; }

    alert("Profile image updated!");
    await loadProfile();
}

async function logout() {
    await supabase.auth.signOut();
    window.location.href = "../../auth/login.html";
}