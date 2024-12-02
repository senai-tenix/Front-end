// Função para buscar os tênis do servidor (GET)
async function buscarTenis() {
    try {
        const response = await fetch("http://localhost:8080/api/tenis");
        if (response.ok) {
            const tenis = await response.json();
            exibirTenis(tenis);
        } else {
            console.error("Erro ao buscar tênis:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao buscar tênis:", error);
    }
}

// Função para exibir os tênis na página
function exibirTenis(tenis) {
    const container = document.getElementById("produtosContainer");
    container.innerHTML = "";  // Limpa os produtos existentes
    tenis.forEach(item => {
        const quadrado = document.createElement("div");
        quadrado.classList.add("quadrados");

        const img = document.createElement("img");
        img.src = item.imagem;
        img.alt = item.nome;

        const nome = document.createElement("p");
        nome.classList.add("nome");
        nome.textContent = item.nome;

        const preco = document.createElement("p");
        preco.classList.add("preco");
        preco.textContent = `R$ ${item.preco.toFixed(2)}`;

        const botoes = document.createElement("div");
        botoes.classList.add("botoes");

        const botaoModificar = document.createElement("button");
        botaoModificar.classList.add("botao", "modificar");
        botaoModificar.textContent = "Modificar";
        botaoModificar.onclick = () => abrirPopupModificar(item);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.classList.add("botao", "excluir");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.onclick = () => excluirTenis(item.id);

        botoes.appendChild(botaoModificar);
        botoes.appendChild(botaoExcluir);

        quadrado.appendChild(img);
        quadrado.appendChild(nome);
        quadrado.appendChild(preco);
        quadrado.appendChild(botoes);

        container.appendChild(quadrado);
    });
}

// Abrir o popup de modificar produto
function abrirPopupModificar(tenis) {
    document.getElementById("novoNome").value = tenis.nome;
    document.getElementById("novoPreco").value = tenis.preco;
    document.getElementById("novoImagem").value = tenis.imagem;
    document.getElementById("popup").style.display = "block";
}

// Fechar o popup de modificar produto
document.getElementById("closeButton").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
});

// Função para salvar as modificações no produto
document.getElementById("salvarButton").addEventListener("click", () => {
    const nome = document.getElementById("novoNome").value;
    const preco = document.getElementById("novoPreco").value;
    const imagem = document.getElementById("novoImagem").value;
    // Lógica de enviar os dados para a API e atualizar o produto
    document.getElementById("popup").style.display = "none";
});

// Função para excluir o tênis
async function excluirTenis(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/tenis/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            alert("Tênis excluído com sucesso!");
            buscarTenis();  // Atualiza a lista
        } else {
            console.error("Erro ao excluir tênis:", response.statusText);
        }
    } catch (error) {
        console.error("Erro ao excluir tênis:", error);
    }
}

// Função para adicionar um novo tênis
document.getElementById("salvarNovoButton").addEventListener("click", () => {
    const nome = document.getElementById("addNome").value;
    const preco = document.getElementById("addPreco").value;
    const imagem = document.getElementById("addImagem").value;

    // Lógica para enviar os dados do novo tênis para o servidor
    document.getElementById("addPopup").style.display = "none";
});

// Buscar os tênis ao carregar a página
window.onload = buscarTenis;
