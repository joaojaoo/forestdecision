// ==========================
// FORESTDECISION
// ==========================

let areas = JSON.parse(localStorage.getItem("areas")) || [];

const form = document.getElementById("formArea");
const listaAreas = document.getElementById("listaAreas");

const totalAreas = document.getElementById("totalAreas");
const totalAlertas = document.getElementById("totalAlertas");
const totalCriticas = document.getElementById("totalCriticas");

const resultado = document.getElementById("resultado");

const pesquisa = document.getElementById("pesquisaMunicipio");


// ==========================
// SALVAR
// ==========================

function salvar(){

    localStorage.setItem("areas",JSON.stringify(areas));

}


// ==========================
// PRIORIDADE
// ==========================

function calcularPrioridade(hectares){

    hectares = Number(hectares);

    if(hectares >= 100){

        return "Alta";

    }

    if(hectares >= 50){

        return "Média";

    }

    return "Baixa";

}


// ==========================
// RECOMENDAÇÃO
// ==========================

function gerarRecomendacao(area){

    if(area.prioridade=="Alta"){

        resultado.innerHTML=`

        <h3>🔴 PRIORIDADE ALTA</h3>

        <p><b>Área:</b> ${area.nome}</p>

        <p><b>Município:</b> ${area.municipio}</p>

        <p><b>Área Desmatada:</b> ${area.hectares} ha</p>

        <hr>

        <p>✔ Fiscalização imediata.</p>

        <p>✔ Solicitar imagens de satélite.</p>

        <p>✔ Enviar equipe de campo.</p>

        `;

    }

    else if(area.prioridade=="Média"){

        resultado.innerHTML=`

        <h3>🟡 PRIORIDADE MÉDIA</h3>

        <p><b>Área:</b> ${area.nome}</p>

        <p><b>Município:</b> ${area.municipio}</p>

        <p><b>Área Desmatada:</b> ${area.hectares} ha</p>

        <hr>

        <p>✔ Agendar fiscalização.</p>

        <p>✔ Continuar monitorando.</p>

        `;

    }

    else{

        resultado.innerHTML=`

        <h3>🟢 PRIORIDADE BAIXA</h3>

        <p><b>Área:</b> ${area.nome}</p>

        <p><b>Município:</b> ${area.municipio}</p>

        <p><b>Área Desmatada:</b> ${area.hectares} ha</p>

        <hr>

        <p>✔ Apenas monitoramento.</p>

        `;

    }

}


// ==========================
// CARDS
// ==========================

function atualizarCards(){

    totalAreas.innerHTML = areas.length;

    let alertas = 0;

    let criticas = 0;

    areas.forEach(area=>{

        if(area.prioridade!="Baixa"){

            alertas++;

        }

        if(area.prioridade=="Alta"){

            criticas++;

        }

    });

    totalAlertas.innerHTML = alertas;

    totalCriticas.innerHTML = criticas;

}


// ==========================
// TABELA
// ==========================

function atualizarTabela(lista = areas){

    listaAreas.innerHTML="";

    lista.forEach((area,index)=>{

        let classe="";

        if(area.prioridade=="Alta") classe="alta";

        if(area.prioridade=="Média") classe="media";

        if(area.prioridade=="Baixa") classe="baixa";

        listaAreas.innerHTML += `

        <tr onclick="mostrarDetalhes(${index})">

            <td>${area.nome}</td>

            <td>${area.municipio}</td>

            <td>${area.estado}</td>

            <td>${area.hectares} ha</td>

            <td class="${classe}">

                ${area.prioridade}

            </td>

            <td>

                <button class="btnExcluir"

                onclick="event.stopPropagation(); excluir(${index})">

                Excluir

                </button>

            </td>

        </tr>

        `;

    });

    atualizarCards();

}


// ==========================
// CADASTRO
// ==========================

form.addEventListener("submit",function(e){

    e.preventDefault();

    let area={

        nome:document.getElementById("nome").value,

        municipio:document.getElementById("municipio").value,

        estado:document.getElementById("estado").value,

        hectares:document.getElementById("hectares").value

    };

    area.prioridade = calcularPrioridade(area.hectares);

    areas.push(area);

    salvar();

    atualizarTabela();

    gerarRecomendacao(area);

    form.reset();

});


// ==========================
// PESQUISA
// ==========================

pesquisa.addEventListener("keyup",function(){

    let texto = pesquisa.value.toLowerCase();

    let filtradas = areas.filter(area=>{

        return area.municipio.toLowerCase().includes(texto);

    });

    atualizarTabela(filtradas);

});


// ==========================
// INICIAR
// ==========================

atualizarTabela();

if(areas.length>0){

    gerarRecomendacao(areas[areas.length-1]);

}
// ==========================
// EXCLUIR ÁREA
// ==========================

function excluirArea(index){

    if(confirm("Deseja realmente excluir esta área?")){

        areas.splice(index,1);

        salvar();

        atualizarTabela();

        if(areas.length > 0){

            gerarRecomendacao(areas[areas.length-1]);

        }else{

            resultado.innerHTML =
            "Cadastre uma área para receber uma recomendação automática.";

        }

    }

}


// ==========================
// MODAL DE DETALHES
// ==========================

const modal = document.getElementById("modalArea");

const detalhes = document.getElementById("detalhesArea");

const fecharModal = document.querySelector(".fechar");


function mostrarDetalhes(index){

    let area = areas[index];

    detalhes.innerHTML = `

        <h3>${area.nome}</h3>

        <hr><br>

        <p><strong>Município:</strong> ${area.municipio}</p>

        <p><strong>Estado:</strong> ${area.estado}</p>

        <p><strong>Área Desmatada:</strong> ${area.hectares} hectares</p>

        <p><strong>Prioridade:</strong> ${area.prioridade}</p>

        <br>

        <h4>Recomendação do Sistema</h4>

        <p>${textoRecomendacao(area.prioridade)}</p>

    `;

    modal.style.display = "flex";

}


function textoRecomendacao(prioridade){

    if(prioridade=="Alta"){

        return "Enviar equipe imediatamente, solicitar imagens de satélite e iniciar fiscalização.";

    }

    if(prioridade=="Média"){

        return "Monitorar a região e programar fiscalização preventiva.";

    }

    return "Continuar monitorando a área periodicamente.";

}


fecharModal.onclick = function(){

    modal.style.display="none";

}


window.onclick = function(event){

    if(event.target==modal){

        modal.style.display="none";

    }

}


// ==========================
// GERAR PDF
// ==========================

document.getElementById("btnRelatorio").addEventListener("click",gerarPDF);


function gerarPDF(){

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);

    pdf.text("ForestDecision",20,20);

    pdf.setFontSize(12);

    pdf.text("Relatório de Áreas Monitoradas",20,30);

    let y = 45;

    if(areas.length==0){

        pdf.text("Nenhuma área cadastrada.",20,y);

    }else{

        areas.forEach((area,i)=>{

            pdf.text(
            `${i+1}. ${area.nome}`,20,y);

            y+=8;

            pdf.text(
            `Município: ${area.municipio}`,25,y);

            y+=8;

            pdf.text(
            `Estado: ${area.estado}`,25,y);

            y+=8;

            pdf.text(
            `Área: ${area.hectares} ha`,25,y);

            y+=8;

            pdf.text(
            `Prioridade: ${area.prioridade}`,25,y);

            y+=12;

            if(y>270){

                pdf.addPage();

                y=20;

            }

        });

    }

    pdf.save("Relatorio_ForestDecision.pdf");

}


// ==========================
// MAPA
// ==========================

const mapa = document.getElementById("mapa");

if(mapa){

    mapa.addEventListener("click",function(){

        alert(
        "Mapa ilustrativo.\n\nEm um sistema real seriam exibidas as áreas monitoradas através de um SIG."
        );

    });

}


// ==========================
// ANIMAÇÃO DOS CARDS
// ==========================

document.querySelectorAll(".card").forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0px)";

    });

});


// ==========================
// FINALIZAÇÃO
// ==========================

atualizarCards();