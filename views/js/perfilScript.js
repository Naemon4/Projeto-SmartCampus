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

            if (usuario.admin) {
                const buttonContainer = document.getElementById('buttonContainer');

                const btnImprimir = document.createElement('button');
                btnImprimir.textContent = "Imprimir QRCodes";
                btnImprimir.className = "bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition";

                // exemplo de ação ao clicar
                btnImprimir.addEventListener("click", async () => {

                    try {

                        const response = await fetch('/api/sala/gerarQRCodes', {
                            method: 'GET',
                            credentials: 'include'
                        });

                        if (response.ok) {
                            const result = await response.blob();
                            const url = window.URL.createObjectURL(result);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "salas_qrcodes.pdf"; // nome do arquivo
                            document.body.appendChild(a);
                            a.click();

                            // limpa
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        }

                    } catch (error) {
                        console.error('Erro no botão dos qrcode', error);
                    }

                });

                buttonContainer.appendChild(btnImprimir);
            }
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