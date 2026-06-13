import {
    registerUser
} from "../../shared/js/services/authService.js";

const form =
document.getElementById("registerForm");

const message =
document.getElementById("registerMessage");

form.addEventListener(
"submit",
handleRegister
);

async function handleRegister(e){

    e.preventDefault();

    const fullName=
    document.getElementById("fullName").value.trim();

    const email=
    document.getElementById("email").value.trim();

    const role=
    document.getElementById("role").value;

    const password=
    document.getElementById("password").value;

    const confirmPassword=
    document.getElementById("confirmPassword").value;

    if(password!==confirmPassword){

        message.style.color="red";

        message.innerHTML=
        "Passwords do not match.";

        return;

    }

    const button=
    form.querySelector("button");

    button.disabled=true;

    button.innerHTML=
    "Creating Account...";

    const result=
    await registerUser(
        fullName,
        email,
        password,
        role
    );

    if(result.success){

        message.style.color="green";

        message.innerHTML=

        "Account created successfully. Check your email.";

        form.reset();

    }

    else{

        message.style.color="red";

        message.innerHTML=result.error;

    }

    button.disabled=false;

    button.innerHTML=

    '<i class="bi bi-person-plus"></i> Register';

}