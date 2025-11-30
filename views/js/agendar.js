const form = document.getElementById("form-agendamento");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        bloco: document.getElementById("select-block").value,
        andar: document.getElementById("select-floor").value,
        sala: document.getElementById("select-room").value,
        data: document.getElementById("date-display").value,
        horarioInicio: document.getElementById("time-display-start").value,
        horarioFinal: document.getElementById("time-display-end").value
    };

    try {
        const response = await fetch("/api/agendamento/agendar", { // ✅ barra inicial
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include"
        });

        const result = await response.json(); // ✅ nome diferente

        if (result.success) {
            alert("Agendamento concluído ✅")
        } else {
            alert("Erro: " + result.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro inesperado: " + error.message);
    }
});