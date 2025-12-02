document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch("/api/predio/listarPredios", {
      method: "GET",
      credentials: "include"
    });
    const result = await response.json();

    const selectPredio = document.getElementById("predio-select");
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
});

document.getElementById('predio-select').addEventListener('change', async () => {
  const predio = document.getElementById("predio-select").value;
  if (!predio) return;

  try {
    const response = await fetch("/api/andar/listarAndaresDoPredio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ predio_nome: predio }),
      credentials: "include"
    });

    const result = await response.json();
    const selectAndar = document.getElementById("andar-select");
    selectAndar.innerHTML = '<option value="">-- Escolha um Andar --</option>';

    if (result.success && result.andares) {
      selectAndar.disabled = false;
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
});

document.getElementById('andar-select').addEventListener('change', async () => {
  const andar = document.getElementById("andar-select").value;
  const predio = document.getElementById("predio-select").value;
  if (!andar || !predio) return;

  try {
    const response = await fetch("/api/sala/listarSalas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ predio_pertencente_nome: predio, andar_numero: andar }),
      credentials: "include"
    });

    const result = await response.json();
    const selectSala = document.getElementById("sala-select");
    selectSala.innerHTML = '<option value="">-- Escolha uma Sala --</option>';

    if (result.success && result.data) {
      selectSala.disabled = false;
      result.data.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.nome;
        opt.textContent = s.nome;
        selectSala.appendChild(opt);
      });
    } else{
        selectSala.disabled = true;
    }
  } catch (err) {
    console.error("Erro ao carregar salas:", err);
  }
});

const form = document.getElementById("form-agendamento");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Captura os valores dos selects e inputs
  const predio_nome   = document.getElementById("predio-select").value;
  const andar         = document.getElementById("andar-select").value;
  const sala_nome     = document.getElementById("sala-select").value;
  const data          = document.getElementById("date-display").value;
  const horario_inicio = document.getElementById("time-display-start").value;
  const horario_fim  = document.getElementById("time-display-end").value;

  // Monta o payload exatamente como o controller espera
  const payload = {
    predio_nome,
    andar,
    sala_nome,
    data,
    horario_inicio,
    horario_fim
  };

  try {
    const response = await fetch("/api/agendamento/agendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include" // 🔑 garante envio de cookie/session
    });

    const result = await response.json();

    if (result.success) {
      alert("Agendamento realizado com sucesso ✅");
      form.reset();
      // opcional: recarregar lista de agendamentos ou atualizar UI
    } else {
      alert("Erro: " + result.message);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Erro inesperado ao tentar agendar.");
  }
});