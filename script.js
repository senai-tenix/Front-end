// Função para buscar os tênis do servidor (GET)
async function buscarTenis() {
    try {
        const response = await fetch("http://localhost:8080/api/tenis");
        if (response.ok) {
            const tenis = await response.json();
            exibirTenis(tenis);
        } else {
            console.error("Erro ao buscar tênis:", response.status);
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
}
// Função para exibir os tênis no HTML
function exibirTenis(tenis) {
    const container = document.getElementById("produtosContainer");
    // Se não houver tênis, esconder o container
    if (tenis.length === 0) {
        container.style.display = "none";
    } else {
        container.style.display = "grid";
        container.innerHTML = "";
        tenis.forEach((tenis) => {
            const divQuadrado = document.createElement('div');
            divQuadrado.className = 'quadrados';
            divQuadrado.id = `produto-${tenis.id}`;
            const img = document.createElement('img');
            img.src = tenis.img;
            img.alt = tenis.nome;
            const pNome = document.createElement('p');
            pNome.className = 'nome';
            pNome.textContent = tenis.nome;
            const h2Preco = document.createElement('h2');
            h2Preco.className = 'preco';
            h2Preco.textContent = `R$ ${tenis.preco.toFixed(2)}`;
            const divBotoes = document.createElement('div');
            divBotoes.className = 'botoes';
            // Botão para modificar
            const btnModificar = document.createElement('button');
            btnModificar.className = 'botao modificar';
            btnModificar.textContent = 'Modificar';
            btnModificar.addEventListener("click", function() {
                // Preenche o popup com os dados do tênis
                document.getElementById("novoNome").value = tenis.nome;
                document.getElementById("novoPreco").value = tenis.preco;
                document.getElementById("novoImagem").value = tenis.img;
                // Exibe o popup de modificação
                document.getElementById("popup").style.display = "block";
                // Configura o evento do botão "Salvar" para atualizar o tênis
                document.getElementById("salvarButton").onclick = () => salvarAlteracoes(tenis.id);
            });
            // Botão para excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.className = 'botao excluir';
            btnExcluir.textContent = 'Excluir';
            btnExcluir.addEventListener("click", () => excluirTennis(tenis.id));
            divBotoes.appendChild(btnModificar);
            divBotoes.appendChild(btnExcluir);
            divQuadrado.appendChild(img);
            divQuadrado.appendChild(pNome);
            divQuadrado.appendChild(h2Preco);
            divQuadrado.appendChild(divBotoes);
            container.appendChild(divQuadrado);
        });
    }
}
// Função para salvar as alterações de um tênis
async function salvarAlteracoes(id) {
    const novoNome = document.getElementById("novoNome").value;
    const novoPreco = parseFloat(document.getElementById("novoPreco").value);
    const novoImagem = document.getElementById("novoImagem").value;
    // Verifica se todos os campos estão preenchidos
    if (!novoNome || !novoPreco || !novoImagem) {
        alert("Preencha todos os campos.");
        return;
    }
    const updatedTenix = { nome: novoNome, preco: novoPreco, img: novoImagem };
    try {
        const response = await fetch(`http://localhost:8080/api/tenis/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTenix),
        });
        if (response.ok) {
            alert("Produto modificado com sucesso!");
            buscarTenis(); // Atualiza a lista de tênis
            document.getElementById("popup").style.display = "none"; // Fecha o popup
        } else {
            alert("Erro ao modificar produto.");
        }
    } catch (error) {
        alert("Erro na requisição:" + error.message);
    }
}
// Função para excluir um tênis
async function excluirTennis(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/tenis/${id}`, { method: "DELETE" });
        if (response.ok) {
            alert("Produto excluído com sucesso!");
            document.getElementById(`produto-${id}`).remove(); // Remove o produto da lista
        } else {
            alert("Erro ao excluir produto.");
        }
    } catch (error) {
        alert("Erro na requisição:" + error.message);
    }
}
// Função para adicionar um novo tênis via popup
document.querySelector(".novo").addEventListener("click", function() {
    // Limpa os campos do popup de adicionar
    document.getElementById("addNome").value = "";
    document.getElementById("addPreco").value = "";
    document.getElementById("addImagem").value = "";
    // Exibe o popup de adicionar
    document.getElementById("addPopup").style.display = "block";
});
// Função para salvar um novo tênis
async function salvarNovoTennis() {
    const nome = document.getElementById("addNome").value;
    const preco = parseFloat(document.getElementById("addPreco").value);
    const imagem = document.getElementById("addImagem").value;
    // Verifica se todos os campos estão preenchidos
    if (!nome || !preco || !imagem) {
        alert("Preencha todos os campos.");
        return;
    }
    const novoTenix = { nome, preco, img: imagem };
    try {
        const response = await fetch("http://localhost:8080/api/tenis/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoTenix),
        });
        if (response.ok) {
            alert("Tênis adicionado com sucesso!");
            buscarTenis(); // Atualiza a lista de tênis
            document.getElementById("addPopup").style.display = "none"; // Fecha o popup
        } else {
           alert("Erro ao adicionar tênis.");
       }
   } catch (error) {
       alert("Erro na requisição:" + error.message);
   }
}
// Listener para o botão "Salvar" no popup de adicionar
document.getElementById("salvarNovoButton").addEventListener("click", salvarNovoTennis);
// Listener para fechar o popup de adicionar
document.getElementById("closeAddButton").addEventListener("click", () => {
      document.getElementById("addPopup").style.display = "none";
});
// Listener para fechar o popup de modificação
document.getElementById("closeButton").addEventListener("click", () => {
      document.getElementById("popup").style.display = "none";
});
// Carregar os tênis ao inicializar a página
window.onload = buscarTenis;