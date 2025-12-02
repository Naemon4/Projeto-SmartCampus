const buttonContainer = document.getElementById('buttonContainer');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('api/sala/gerarQRCodes', {
            method: 'GET',
            credentials: 'include' // para enviar cookies
        });

        if (response.success) {
            buttonContainer.innerHTML += `<button id="btn-gerar-qrcodes" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Gerar QR Codes</button>`;

            document.getElementById('btn-gerar-qrcodes').addEventListener('click', async () => {
                const data = await response.json();

                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'salas_qrcodes.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            });
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro inesperado: " + error.message);
    }
});