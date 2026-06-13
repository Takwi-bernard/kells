async function loadStats() {

    const students =
    await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

    const exams =
    await supabase
    .from("exams")
    .select("*", { count: "exact", head: true });

    document.getElementById("studentCount")
        .textContent = students.count;

    document.getElementById("examCount")
        .textContent = exams.count;
}