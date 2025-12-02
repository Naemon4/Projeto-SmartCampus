const btnVerAgendamentos = document.getElementById("btn-meus-agendamentos");
const popup = document.getElementById("popup-agendamentos");
const popupBody = document.getElementById("popup-body");

btnVerAgendamentos.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/agendamento/listarAgendamentosUsuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: document.getElementById("usuarioId").value }),
            credentials: "include"
        });
        const result = await response.json();

        if (result.success) {
            popup.style.display = "block";
            popupBody.innerHTML = ""; // Limpa o conteúdo anterior

            result.data.forEach(agendamento => {
                const agendamentoDiv = document.createElement("div");
                agendamentoDiv.classList.add("p-2", "border", "rounded", "mb-2");
                agendamentoDiv.innerHTML = `
                    <p><strong>Sala:</strong> ${agendamento.Sala.nome}</p>
                    <p><strong>Data:</strong> ${agendamento.data}</p>
                    <p><strong>Início:</strong> ${agendamento.horario_inicio}</p>
                    <p><strong>Fim:</strong> ${agendamento.horario_final}</p>
                `;
                popupBody.appendChild(agendamentoDiv);
            });
        } else {
            alert("Erro: " + result.message);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro inesperado: " + error.message);
    }

});