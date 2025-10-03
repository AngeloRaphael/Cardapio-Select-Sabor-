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
    switch (bairroSelecionado) {
        case 'Angola': taxaDeEntrega = 5.00; break;
        case 'Bom Retiro': taxaDeEntrega = 9.00; break;
        case 'Brasileia': taxaDeEntrega = 6.00; break;
        case 'Cachoeira': taxaDeEntrega = 6.00; break;
        case 'Centro': taxaDeEntrega = 6.00; break;
        case 'Decamao': taxaDeEntrega = 4.00; break;
        case 'Godoy': taxaDeEntrega = 9.00; break;
        case 'Guarujá': taxaDeEntrega = 2.00; break;
        case 'Ingá': taxaDeEntrega = 5.00; break;
        case 'Ingá alto': taxaDeEntrega = 6.00; break;
        case 'Jardim Brasília': taxaDeEntrega = 9.00; break;
        case 'Niterói': taxaDeEntrega = 9.00; break;
        case 'Novo Guarujá': taxaDeEntrega = 3.00; break;
        case 'Novo horizonte': taxaDeEntrega = 5.00; break;
        case 'Petrópolis': taxaDeEntrega = 8.00; break;
        case 'Pingo-DÁgua': taxaDeEntrega = 7.00; break;
        case 'Santa Inês': taxaDeEntrega = 3.00; break;


        default: taxaDeEntrega = 0.00; break;
    }
    document.getElementById('taxa-entrega').textContent = formatarValor(taxaDeEntrega);
    atualizarResumo();
}

// Adiciona um item ao pedido
function adicionarAoPedido(nome, preco) {
    pedido.push({ nome, preco });
    total += preco;
    atualizarResumo();
}

// Remove um item do pedido
function removerDoPedido(index) {
    total -= pedido[index].preco;
    pedido.splice(index, 1);
    atualizarResumo();
}

// Atualiza a lista do pedido e o total
function atualizarResumo() {
    const lista = document.getElementById('lista-pedido');
    const totalEl = document.getElementById('total-pedido');
    lista.innerHTML = '';

    pedido.forEach((p, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        const span = document.createElement('span');
        span.textContent = `${p.nome} - R$ ${formatarValor(p.preco)}`;

        const btn = document.createElement('button');
        btn.textContent = '❌';
        btn.style.marginLeft = '10px';
        btn.style.background = '#000000ff';
        btn.style.border = 'none';
        btn.style.color = 'white';
        btn.style.padding = '2px 6px';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => removerDoPedido(index);

        li.appendChild(span);
        li.appendChild(btn);
        lista.appendChild(li);
    });

    const totalComTaxa = total + taxaDeEntrega;
    totalEl.textContent = formatarValor(totalComTaxa);
}

// Finaliza o pedido e abre o WhatsApp
function finalizarPedido() {
    if (pedido.length === 0) {
        alert('Adicione itens ao pedido antes de finalizar.');
        return;
    }

    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;

    if (!bairro || !rua || !numero) {
        alert('Por favor, preencha todos os campos de endereço.');
        return;
    }

    const mensagem = pedido.map(p => `- ${p.nome}: R$ ${formatarValor(p.preco)}`).join('');
    const texto = `Olá! Gostaria de fazer o seguinte pedido: ${mensagem}` +
        ` Taxa de entrega: R$ ${formatarValor(taxaDeEntrega)}` +
        ` Total: R$ ${formatarValor(total + taxaDeEntrega)}` +
        ` Bairro: ${bairro}` +
        ` Rua: ${rua}, Número: ${numero}, Complemento: ${complemento}`;

    const numeroWhatsApp = '5531995034674';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Cria botões de adicionar
function adicionarBotaoPedido(el, nome, preco) {
    const btn = document.createElement('button');
    btn.innerText = `Adicionar ${nome}`;
    btn.className = 'botao-adicionar';
    btn.setAttribute('aria-label', `Adicionar o item ${nome} ao pedido`);
    btn.onclick = () => adicionarAoPedido(nome, preco);
    el.appendChild(btn);
}

// Botões de açaí
function adicionarBotaoAcai(card, nomeBase) {
    const precos = card.querySelectorAll('.precos div');
    precos.forEach(precoDiv => {
        const span = precoDiv.querySelector('span')?.innerText;
        // Pega só o texto que está depois do <br>
        const linhas = precoDiv.innerHTML.split('<br>');
        const precoTexto = linhas[1]?.trim() || '';
        const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.'));

        if (nomeBase && !isNaN(preco)) {
            const nomeCompleto = `${nomeBase} ${span}`;
            adicionarBotaoPedido(precoDiv, nomeCompleto, preco);
        }
    });
}

// Inicializa
window.onload = () => {
    const itens = document.querySelectorAll('.pedido');
    itens.forEach(el => {
        const nome = el.querySelector('h2')?.innerText || el.querySelector('p.nomeAcresc')?.innerText;
        const precoTexto = el.querySelector('.preco')?.innerText;
        const preco = parseFloat(precoTexto?.replace('R$', '').replace(',', '.'));
        if (nome && !isNaN(preco)) {
            adicionarBotaoPedido(el, nome, preco);
        }
    });

    const acaiCards = document.querySelectorAll('.acai-card');
    acaiCards.forEach(card => {
        const nomeBase = card.querySelector('h2')?.innerText;
        if (nomeBase) adicionarBotaoAcai(card, nomeBase);
    });

    atualizarTaxaDeEntrega();
};
