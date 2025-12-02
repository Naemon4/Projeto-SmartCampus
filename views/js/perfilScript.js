document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/usuario/perfil', {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();

        if (result.success) {
            const usuario = result.user;
            document.getElementById('nome').textContent = usuario.nome;
            document.getElementById('email').textContent = usuario.email;
            document.getElementById('cpf').textContent = usuario.cpf;
            document.getElementById('tipoUsuario').textContent = usuario.admin ? 'Administrador' : 'Usuário';
        } else {
            console.error('Erro ao carregar perfil:', result.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});


document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/usuario/logout', {
            method: 'POST',
            credentials: 'include' // para enviar cookies
        });
        const data = await response.json();
        if (data.success) {
            window.location.href = '/';
        } else {
            console.error('Erro ao fazer logout:', data.message);
        }
    } catch (error) {
        console.error('Erro na requisição de logout:', error);
    }
});