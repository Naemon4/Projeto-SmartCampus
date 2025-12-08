const btnVerAgendamentos = document.getElementById("btn-meus-agendamentos");
const btnFecharPopup = document.getElementById("popup-ok")
const popup = document.getElementById("popup-agendamentos");
const popupBody = document.getElementById("popup-body");

btnVerAgendamentos.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/agendamento/listarAgendamentosUsuario", {
            method: "GET",
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
                    <p><strong>Data:</strong> ${agendamento.data_agendamento}</p>
                    <p><strong>Início:</strong> ${agendamento.horario_inicio}</p>
                    <p><strong>Fim:</strong> ${agendamento.horario_fim}</p>
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

btnFecharPopup.addEventListener("click", () => {
    popup.style.display = "none";
    popupBody.innerHTML = ""; // opcional
});