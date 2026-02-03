"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("waitlist-button");
    const input = document.getElementById("waitlist-email");

    button.addEventListener("click", handleSubmit);
    
    // Permitir envío con Enter
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    });

    async function handleSubmit() {
        const email = input.value.trim();

        if (!email) {
            showMessage("Please enter your email", "error");
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Please enter a valid email address", "error");
            return;
        }

        // Deshabilitar botón durante la petición
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = "Joining...";

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.ok) {
                showMessage("You've joined the waitlist! 🎉", "success");
                input.value = "";
            } else {
                showMessage(data.error || "Something went wrong. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            showMessage("Network error. Please check your connection.", "error");
        } finally {
            // Rehabilitar botón
            button.disabled = false;
            button.textContent = originalText;
        }
    }

    function showMessage(message, type) {
        // Usar alert por ahora (puedes cambiarlo por un toast más bonito)
        alert(message);
        
        // Alternativa: crear un toast personalizado
        // createToast(message, type);
    }

    // Función opcional para crear un toast más bonito
    function createToast(message, type) {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});