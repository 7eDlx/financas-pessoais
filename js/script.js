
const form = document.getElementById("form-transacao");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const data = document.getElementById("data");
const tipo = document.getElementById("tipo");
const mes = document.getElementById("mes");
const lista = document.getElementById("lista-transacoes");
const saldo = document.getElementById("saldo");
const mesAtualLabel = document.getElementById("mes-atual");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let mesAtual = mes.value || "Janeiro";
mesAtualLabel.textContent = mesAtual;

function atualizarSaldo() {
    const ordemMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const indiceAtual = ordemMeses.indexOf(mesAtual);
    const mesesAnteriores = ordemMeses.slice(0, indiceAtual + 1);
    const total = transacoes
        .filter(item => mesesAnteriores.includes(item.mes))
        .reduce((acc, item) => acc + item.valor, 0);
    saldo.textContent = total.toFixed(2);
}

function salvarTransacoes() {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function removerTransacao(index) {
    transacoes.splice(index, 1);
    salvarTransacoes();
    renderizarTransacoes();
}

function formatarTipo(tipo) {
    switch (tipo) {
        case "despesa_fixa": return "Despesa Fixa";
        case "despesa_variavel": return "Despesa Variável";
        case "investimento": return "Investimento";
        case "receita": return "Receita";
        default: return tipo;
    }
}

function formatarData(dataIso) {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function renderizarTransacoes() {
    lista.innerHTML = "";
    mesAtualLabel.textContent = mesAtual;
    transacoes
        .filter(item => item.mes === mesAtual)
        .forEach((item, index) => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${formatarData(item.data)}</td>
                <td>${item.descricao}</td>
                <td>${item.valor.toFixed(2)}</td>
                <td>${formatarTipo(item.tipo)}</td>
                <td><button class="remover" onclick="removerTransacao(${index})">Remover</button></td>
            `;
            lista.appendChild(linha);
        });
    atualizarSaldo();
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const valorNumerico = parseFloat(valor.value);
    const valorFinal = (tipo.value === "receita") ? Math.abs(valorNumerico) : -Math.abs(valorNumerico);

    const novaTransacao = {
        descricao: descricao.value,
        valor: valorFinal,
        data: data.value,
        tipo: tipo.value,
        mes: mes.value
    };
    transacoes.push(novaTransacao);
    salvarTransacoes();
    renderizarTransacoes();
    
    const mesSelecionado = mes.value;
    form.reset();
    mes.value = mesSelecionado;
    mesAtual = mesSelecionado;

});

mes.addEventListener("change", () => {
    mesAtual = mes.value;
    renderizarTransacoes();
});

renderizarTransacoes();
