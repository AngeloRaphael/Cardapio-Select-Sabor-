const pedido = [];
let total = 0;
let taxaDeEntrega = 0;

// Formata o valor no estilo moeda brasileira
function formatarValor(valor) {
    return valor.toFixed(2).replace('.', ',');
}

// Função para atualizar a taxa de entrega com base no bairro
function atualizarTaxaDeEntrega() {
    const bairroSelecionado = document.getElementById('bairro').value;

    // Definindo as taxas para cada bairro
    switch (bairroSelecionado) {
        case 'Açude':
            taxaDeEntrega = 9.00; // açude
            break;
        case 'Angola':
            taxaDeEntrega = 5.00; // angola
            break;
        case 'Bom Retiro':
            taxaDeEntrega = 9.00; // bom retiro
            break;
        case 'Brasileia':
            taxaDeEntrega = 6.00; // brasileia
            break;
        case 'Cachoeira':
            taxaDeEntrega = 6.00; // cachoeira
            break;
        case 'Centro':
            taxaDeEntrega = 6.00; // centro
            break;
        case 'Godoy':
            taxaDeEntrega = 9.00; // godoy
            break;
        case 'Guarujá':
            taxaDeEntrega = 2.00; // guaruja
            break;
        case 'Ingá':
            taxaDeEntrega = 5.00; // inga
            break;
        case 'Ingá alto':
            taxaDeEntrega = 6.00; // inga alto
            break;
        case 'Jardim Brasília':
            taxaDeEntrega = 9.00; // jardim brasilia
            break;
        case 'Niterói':
            taxaDeEntrega = 9.00; // niteroi
            break;
        case 'Novo Guarujá':
            taxaDeEntrega = 3.00; // nv guaruja
            break;
        case 'Novo horizonte':
            taxaDeEntrega = 5.00; // novo horizonte
            break;
        case 'Petrópolis':
            taxaDeEntrega = 8.00; // petropolis
            break;
        case 'Pingo-DÁgua':
            taxaDeEntrega = 7.00; // pingo d agua
            break;
        default:
            taxaDeEntrega = 0.00; // Se nenhum bairro for selecionado, taxa 0
            break;
    }

    // Atualiza a taxa de entrega na tela
    const taxaEl = document.getElementById('taxa-entrega');
    taxaEl.textContent = formatarValor(taxaDeEntrega);

    // Atualiza o total
    atualizarResumo();
}

// Adiciona um item ao pedido
function adicionarAoPedido(nome, preco) {
    pedido.push({ nome, preco });
    total += preco;
    atualizarResumo();
}

// Atualiza a lista do pedido e o total
function atualizarResumo() {
    const lista = document.getElementById('lista-pedido');
    const totalEl = document.getElementById('total-pedido');
    lista.innerHTML = ''; // Limpa a lista antiga
    pedido.forEach(p => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        li.textContent = `${p.nome} - R$ ${formatarValor(p.preco)}`;
        lista.appendChild(li);
    });

    // Calculando o total (incluindo taxa de entrega)
    const totalComTaxa = total + taxaDeEntrega;
    totalEl.textContent = formatarValor(totalComTaxa);
}

// Finaliza o pedido e abre o WhatsApp com a mensagem pronta
function finalizarPedido() {
    if (pedido.length === 0) {
        alert('Adicione itens ao pedido antes de finalizar.');
        return;
    }

    // Captura as informações de endereço
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;


    // Verifica se todos os campos de endereço estão preenchidos
    if (!bairro || !rua || !numero) {
        alert('Por favor, preencha todos os campos de endereço.');
        return;
    }

    // Monta a mensagem para o WhatsApp
    const mensagem = pedido.map(p => `- ${p.nome}: R$ ${formatarValor(p.preco)}`).join('%0A');
    const texto = `Olá! Gostaria de fazer o seguinte pedido: ${mensagem} Total: R$ ${formatarValor(total + taxaDeEntrega)}` +
        ` Taxa de entrega: R$ ${formatarValor(taxaDeEntrega)}` +
        ` Bairro: ${bairro}` +
        ` Rua: ${rua}, Número: ${numero}, Complemento: ${complemento}`;
    

    // Número de WhatsApp do comerciante
    const numeroWhatsApp = '5531986093558'; // Coloque aqui seu número com DDI correto

    // URL do WhatsApp com codificação de URL
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;

    // // Aviso para o usuário caso o número não esteja salvo
    // alert('Se o número não estiver salvo na sua agenda de contatos, a mensagem pode não ser preenchida automaticamente. Você pode copiá-la e colá-la manualmente.');

    // Abre a URL do WhatsApp em uma nova aba
    window.open(url, '_blank');
}

// Função para criar e adicionar o botão no elemento
function adicionarBotaoPedido(el, nome, preco) {
    const btn = document.createElement('button');
    btn.innerText = `Adicionar ${nome}`;
    btn.className = 'botao-adicionar';
    btn.setAttribute('aria-label', `Adicionar o item ${nome} ao pedido`);
    btn.onclick = () => adicionarAoPedido(nome, preco);
    el.appendChild(btn);
}

// Função para lidar com os cards de açaí com vários preços
function adicionarBotaoAcai(card, nomeBase) {
    const precos = card.querySelectorAll('.precos div');
    precos.forEach(precoDiv => {
        const span = precoDiv.querySelector('span')?.innerText;
        const texto = precoDiv.innerText;
        const preco = parseFloat(texto.replace(/[^\d,]/g, '').replace(',', '.'));

        if (nomeBase && !isNaN(preco)) {
            const nomeCompleto = `${nomeBase} ${span}`;
            adicionarBotaoPedido(precoDiv, nomeCompleto, preco);
        }
    });
}

// Quando a página carregar, adiciona os botões automaticamente
window.onload = () => {
    // Adiciona botões para todos os itens com a classe .pedido
    const itens = document.querySelectorAll('.pedido');
    itens.forEach(el => {
        const nome = el.querySelector('h2')?.innerText || el.querySelector('p.nomeAcresc')?.innerText;
        const precoTexto = el.querySelector('.preco')?.innerText;
        const preco = parseFloat(precoTexto?.replace('R$', '').replace(',', '.'));

        if (nome && !isNaN(preco)) {
            adicionarBotaoPedido(el, nome, preco);
        }
    });

    // Adiciona botões para todos os cards de açaí
    const acaiCards = document.querySelectorAll('.acai-card');
    acaiCards.forEach(card => {
        const nomeBase = card.querySelector('h2')?.innerText;
        if (nomeBase) {
            adicionarBotaoAcai(card, nomeBase);
        }
    });

    // Inicializa o bairro selecionado
    atualizarTaxaDeEntrega();
};
