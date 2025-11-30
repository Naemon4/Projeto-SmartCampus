const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        const response = await fetch("/api/usuario/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
            credentials: "include" // garante envio/recebimento de cookies HttpOnly
        });

        const result = await response.json();

        if (result.success) {
            alert("Login realizado com sucesso!");
            // Redireciona para página protegida
            window.location.href = "/";
        } else {
            alert("Erro: " + result.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
});