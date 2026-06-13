import { requireStudent, getProfile } from "../../shared/js/services/profileService.js";
import { supabase } from "../../config/supabase.js";
import { logoutUser } from "../../shared/js/services/authService.js";

await requireStudent();

document.addEventListener("DOMContentLoaded", async () => {
    initMobileNavigation();
    await loadDashboard();

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);
});

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

async function loadDashboard() {
    try {
        const profile = await getProfile();
        if (!profile) return;

        const nameNode = document.getElementById("userName");
        const welcomeNode = document.getElementById("welcomeText");
        const subtitleNode = document.getElementById("viewportSubtitle");
        const avatarImg = document.getElementById("userAvatar");

        if (nameNode) nameNode.textContent = profile.full_name || "Student User";
        if (welcomeNode) {
            const hr = new Date().getHours();
            let greeting = hr < 12 ? "Good Morning" : hr < 18 ? "Good Afternoon" : "Good Evening";
            welcomeNode.textContent = `${greeting}, ${profile.full_name ? profile.full_name.split(" ")[0] : "Student"}!`;
        }
        if (subtitleNode) {
            subtitleNode.textContent = profile.programme ? `${profile.programme} Environment` : "Academic metrics panel.";
        }
        if (avatarImg) {
            avatarImg.src = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "Student")}&background=4F46E5&color=fff&size=100`;
        }

        await loadStatistics();
        await loadRecentResults();
        await loadNotifications();
        await loadProgress();
    } catch (err) {
        console.error("Dashboard error initialization:", err);
    }
}

async function loadStatistics() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const subjects = await supabase.from("subjects").select("*", { count: "exact", head: true }).eq("student_id", user.id);
    if (document.getElementById("totalSubjects")) document.getElementById("totalSubjects").textContent = subjects.count || 0;

    const results = await supabase.from("results").select("*", { count: "exact", head: true }).eq("student_id", user.id);
    if (document.getElementById("completedExams")) document.getElementById("completedExams").textContent = results.count || 0;
    if (document.getElementById("gpaValue")) document.getElementById("gpaValue").textContent = "3.70";
}

async function loadRecentResults() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from("results").select("*").eq("student_id", user.id).limit(5).order("created_at", { ascending: false });
    if (error) return;

    const tbody = document.getElementById("resultsTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No verified grades saved yet.</td></tr>`;
        return;
    }

    data.forEach(row => {
        tbody.innerHTML += `
            <tr class="border-bottom">
                <td class="fw-bold text-dark py-3">${row.subject || "N/A"}</td>
                <td>${row.ca ?? "--"}</td>
                <td>${row.exam ?? "--"}</td>
                <td><span class="badge bg-light text-dark border px-2.5 py-1.5">${row.grade || "--"}</span></td>
                <td><span class="badge-yield-pass">${row.status || "Approved"}</span></td>
            </tr>
        `;
    });
}

async function loadNotifications() {
    const list = document.getElementById("notificationList");
    if (!list) return;
    list.innerHTML = "";
    ["System online.", "Continuous evaluation tracks updating successfully."].forEach(msg => {
        list.innerHTML += `<li class="list-group-item bg-transparent text-muted small border-0 px-0 py-2"><i class="bi bi-dot text-primary me-2"></i>${msg}</li>`;
    });
}

async function loadProgress() {
    if (document.getElementById("progressBar")) { document.getElementById("progressBar").style.width = "75%"; document.getElementById("progressBar").textContent = "75%"; }
    if (document.getElementById("progressText")) document.getElementById("progressText").innerHTML = "Completed <span class='text-dark fw-bold'>75%</span> of your target modules.";
}