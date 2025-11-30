const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        nome: document.getElementById("name").value,
        email: document.getElementById("email").value,
        cpf: document.getElementById("cpf").value,
        senha: document.getElementById("password").value,
        confirmarSenha: document.getElementById("confirm-password").value,
        userType: document.getElementById("user-type").value
    };

    try {
        const response = await fetch("/api/usuario/registrar", { // ✅ barra inicial
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include"
        });

        const result = await response.json(); // ✅ nome diferente

        if (result.success) {
            window.location.href = '/login';
        } else {
            alert("Erro: " + result.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro inesperado: " + error.message);
    }
});
