document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("prediosContainer");

  try {
    // 1. Buscar prédios
    const prediosRes = await fetch("/api/predio/listarPredios", {
      method: "GET",
      credentials: "include"
    });
    const { success, predios } = await prediosRes.json();
    if (!success) throw new Error("Erro ao listar prédios");

    for (const predio of predios) {
      // Caixa do prédio
      const predioBox = document.createElement("div");
      predioBox.className = "bg-white shadow rounded";

      // Cabeçalho clicável
      const predioHeader = document.createElement("div");
      predioHeader.className = "cursor-pointer p-4 bg-blue-600 text-white font-semibold rounded-t";
      predioHeader.textContent = predio.nome;
      predioBox.appendChild(predioHeader);

      // Container retrátil
      const andarList = document.createElement("div");
      andarList.className = "space-y-4 p-4 hidden"; // começa escondido
      predioBox.appendChild(andarList);

      container.appendChild(predioBox);

      // Toggle retrátil
      predioHeader.addEventListener("click", () => {
        andarList.classList.toggle("hidden");
      });

      // 2. Buscar andares do prédio
      const andaresRes = await fetch("/api/andar/listarAndaresDoPredio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predio_nome: predio.nome })
      });
      const andaresData = await andaresRes.json();
      if (!andaresData.success) continue;

      for (const andar of andaresData.andares) {
        const andarBox = document.createElement("div");
        andarBox.className = "border-l-4 border-blue-300 pl-2";

        const andarTitle = document.createElement("h3");
        andarTitle.className = "text-lg font-medium text-gray-700 mb-2";
        andarTitle.textContent = `Andar ${andar.numero}`;
        andarBox.appendChild(andarTitle);

        const salaGrid = document.createElement("div");
        salaGrid.className = "grid grid-cols-2 gap-4"; // salas em grid
        andarBox.appendChild(salaGrid);

        andarList.appendChild(andarBox);

        // 3. Buscar salas do andar
        const salasRes = await fetch("/api/sala/listarSalas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            predio_pertencente_nome: predio.nome,
            andar_numero: andar.numero
          })
        });
        const salasData = await salasRes.json();
        if (!salasData.success) continue;

        for (const sala of salasData.data) {
          const salaCard = document.createElement("div");
          salaCard.className =
            "p-3 rounded shadow text-white font-semibold " +
            (sala.status === "ocupado"
              ? "bg-red-500"
              : sala.status === "livre"
              ? "bg-green-500"
              : "bg-gray-400");

          salaCard.textContent = sala.nome;
          salaGrid.appendChild(salaCard);
        }
      }
    }
  } catch (err) {
    console.error("Erro ao carregar prédios:", err);
    container.innerHTML = `<p class="text-red-600">Erro ao carregar dados.</p>`;
  }
});
