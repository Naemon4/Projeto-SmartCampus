document.addEventListener("DOMContentLoaded", async () => {

    try {

        const params = new URLSearchParams(window.location.search);
        const salaId = params.get("salaId");

        if (!salaId) {
            document.getElementById("status").textContent = "SalaId não informado.";
        }

        // 2. Faz o fetch para sua rota de agendamento
        const response = await fetch("/api/agendamento/agendarAgora", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // se usa cookie/JWT
            body: JSON.stringify({ salaId })
        });

        const result = await response.json();

        if (!result.success) {
            window.location.href = "/agendamentoFalhou";
        }

    } catch (error) {

    }

})