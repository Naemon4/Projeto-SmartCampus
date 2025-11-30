async function carregarPredios() {
    try {
        const response = await fetch("/api/predio/listarPredios", {
            method: "GET",
            credentials: "include" // 🔑 envia cookie/token
        });
        const result = await response.json();

        const selectPredio = document.getElementById("selectPredio");
        selectPredio.innerHTML = '<option value="">-- Escolha um Prédio --</option>';

        if (result.success && result.predios) {
            result.predios.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.nome;
                opt.textContent = p.nome;
                selectPredio.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Erro ao carregar prédios:", err);
    }
}

async function preencherAndaresParaSala() {
    const predio = document.getElementById("selectPredio").value;
    if (!predio) return;

    try {
        const response = await fetch("/api/andar/listarAndaresDoPredio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ predio_nome: predio }),
            credentials: "include" // 🔑 envia cookie/token
        });

        const result = await response.json();
        console.log("Resposta listar andares:", result);
        const selectAndar = document.getElementById("selectAndar");
        selectAndar.innerHTML = '<option value="">-- Escolha um Andar --</option>';

        if (result.success && result.andares) {
            result.andares.forEach(a => {
                const opt = document.createElement("option");
                opt.value = a.numero;
                opt.textContent = `Andar ${a.numero}`;
                selectAndar.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Erro ao carregar andares:", err);
    }
}

function exibirSeletores() {
    const acao = document.getElementById("selectAcao").value;

    // Esconde tudo
    document.getElementById("divInputNovoPredio").style.display = "none";
    document.getElementById("divSelectPredio").style.display = "none";
    document.getElementById("divInputNovoAndar").style.display = "none";
    document.getElementById("divSelectAndar").style.display = "none";
    document.getElementById("divInputNovaSala").style.display = "none";
    document.getElementById("btnConfirmarAcao").style.display = "none";

    // Mostra conforme ação
    if (acao === "Predio") {
        document.getElementById("divInputNovoPredio").style.display = "block";
        document.getElementById("btnConfirmarAcao").style.display = "block";
    } else if (acao === "Andar") {
        document.getElementById("divSelectPredio").style.display = "block";
        document.getElementById("divInputNovoAndar").style.display = "block";
        document.getElementById("btnConfirmarAcao").style.display = "block";
    } else if (acao === "Sala") {
        document.getElementById("divSelectPredio").style.display = "block";
        document.getElementById("divSelectAndar").style.display = "block";
        document.getElementById("divInputNovaSala").style.display = "block";
        document.getElementById("btnConfirmarAcao").style.display = "block";
    }
}

async function confirmarAdicao() {
    const acao = document.getElementById("selectAcao").value;
    const feedback = document.getElementById("feedback");

    try {
        if (acao === "Predio") {
            const nomePredio = document.getElementById("inputNovoPredio").value;
            const res = await fetch("/api/predio/cadastrarPredio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ predio_nome: nomePredio }),
                credentials: "include" // 🔑 envia cookie/token
            });
            const result = await res.json();
            feedback.textContent = result.message || "Prédio cadastrado!";
            carregarPredios();

        } else if (acao === "Andar") {
            const predio = document.getElementById("selectPredio").value;
            const numero = document.getElementById("inputNovoAndar").value;
            const res = await fetch("/api/andar/cadastrarAndar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero_andar: numero, predio_pertencente_nome: predio }),
                credentials: "include" // 🔑 envia cookie/token
            });
            const result = await res.json();
            feedback.textContent = result.message || "Andar cadastrado!";
            preencherAndaresParaSala();

        } else if (acao === "Sala") {
            const predio = document.getElementById("selectPredio").value;
            const numeroAndar = document.getElementById("selectAndar").value;
            const nomeSala = document.getElementById("inputNovaSala").value;

            const res = await fetch("/api/sala/registrarSala", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomeSala,
                    andar_numero: numeroAndar,
                    predio_pertencente_nome: predio
                }),
                credentials: "include" // 🔑 envia cookie/token
            });
            const result = await res.json();
            feedback.textContent = result.message || "Sala cadastrada!";
        }
    } catch (err) {
        console.error("Erro ao cadastrar:", err);
        feedback.textContent = "Erro ao cadastrar.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarPredios();

  document.getElementById("selectAcao").addEventListener("change", exibirSeletores);
  document.getElementById("selectPredio").addEventListener("change", preencherAndaresParaSala);
  document.querySelector(".form-agendamento").addEventListener("submit", (e) => {
    e.preventDefault();
    confirmarAdicao();
  });
});
