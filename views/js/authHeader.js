document.addEventListener("DOMContentLoaded", async () => {
  function toggle(ids, show = false) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList[show ? "remove" : "add"]("hidden");
    });
  }

  const login = ["linkLogin", "linkLoginMoba"];
  const perfil = ["linkPerfil", "linkPerfilMoba"];
  const dashboard = ["dashboard", "dashboardMoba"];
  const agendar = ["agendar", "agendarMoba"];
  const cadastroUsuario = ["linkCadastro", "linkCadastroMoba"];
  const cadastroEspaco = ["cadastrarEspaco", "cadastrarEspacoMoba"];

  // estado inicial: esconde tudo
  toggle([...login, ...perfil, ...dashboard, ...agendar, ...cadastroUsuario, ...cadastroEspaco]);

  try {
    const response = await fetch("/api/usuario/perfil", {
      method: "GET",
      credentials: "include"
    });
    const result = await response.json();

    if (!result.success) {
      // 🔹 Deslogado → só login
      toggle(login, true);
      return;
    }

    const user = result.user; // aqui é "user", não "usuario"

    if (user.admin) {
      // 🔹 Admin → perfil, dashboard, agendar, cadastro de usuário, cadastro de espaço
      toggle([...perfil, ...dashboard, ...agendar, ...cadastroUsuario, ...cadastroEspaco], true);
    } else {
      // 🔹 Usuário normal → perfil, dashboard, agendar
      toggle([...perfil, ...dashboard, ...agendar], true);
    }
  } catch (err) {
    console.error("Erro ao verificar login:", err);
    toggle(login, true);
  }
});
