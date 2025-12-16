document.getElementById("logoutButton").addEventListener('click', async () => {
    try {

        const result = await fetch('/api/usuario/logout', {
            method: 'GET',
            credentials: 'include'
        })

        const response = await result.json()

        if (response.success) {
            window.location.href = "/login";
        } else {
            alert("Erro ao fazer logout");
        }

    } catch (error) {
        console.error("Erro no logout:", err);
        alert("Erro inesperado ao sair");
    }
})