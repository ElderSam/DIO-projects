
function start() {

	$("#inicio").hide();
	
    $("#fundoGame").append(`<div id='jogador' class='anima1'></div>
                            <div id='inimigo1' class='anima2'></div>
                            <div id='inimigo2'></div>
                            <div id='amigo' class='anima3'></div>
                            <div id='placar'></div>
                            <div id='energia'></div>
    `);
    
    //Principais variáveis do jogo
    var jogo = {}
    var podeAtirar = true;
    var fimDeJogo = false;
    var pontos = 0;
    var amigosSalvos = 0;
    var amigosPerdidos = 0;
    var energiaAtual = 3;
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var TECLA = {
        W: 87,
        UP: 38,

        S: 83,
        DOWN: 40,

        D: 68,
        RIGHT: 39,
    }
    
    jogo.pressionou = [];

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

	//Verifica se o usuário pressionou alguma tecla	
	$(document).keydown(function(e){
	    jogo.pressionou[e.which] = true;
	});

	$(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
	});

    //Game Loop
    jogo.timer = setInterval(loop,30); //chama loop() a cada 30ms

    function loop() {
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    }

    //Função que movimenta o fundo do jogo
	function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position",esquerda-1);   
    }

    function moveJogador() {

        if (jogo.pressionou[TECLA.W] || jogo.pressionou[TECLA.UP]) {
            var topo = parseInt($("#jogador").css("top")); //pega a altura do jogador
            $("#jogador").css("top",topo-10); //desce

            if(topo <= 0) { //limita até onde pode descer
                $("#jogador").css("top", topo+10);
            }
        }
        
        if (jogo.pressionou[TECLA.S] || jogo.pressionou[TECLA.DOWN]) {   
            var topo = parseInt($("#jogador").css("top")); //pega a altura do jogador
            $("#jogador").css("top",topo+10); //sobe

            if(topo >= 434) { //limita até onde pode subir
                $("#jogador").css("top", topo-10);
            }
        }
        
        if (jogo.pressionou[TECLA.D] || jogo.pressionou[TECLA.RIGHT]) {
            disparo(); //Chama função Disparo	
        }
    
    }

    function moveInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        
        $("#inimigo1")
            .css("left", posicaoX-velocidade) //move para a esquerda
            .css("top", posicaoY);
        
        if(posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334); //valor aleatório 0-334

            $("#inimigo1")
                .css("left", 694) // volta para a direita
                .css("top", posicaoY);
        }
    }

    function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX-3); //move para a esquerda

        if(posicaoX <= 0) {
            $("#inimigo2").css("left", 775); //volta para a direita
        }
    }

    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));

        $("#amigo").css("left", posicaoX+1);

        if(posicaoX > 915) {   
            $("#amigo").css("left", 0); 
        }
    }

    function disparo() {
        if(podeAtirar) {
            somDisparo.play();
            podeAtirar = false; // para fazer outro disparo enquando executa as funções abaixo

            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30); // cria um intervalo de disparo
        }

        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX+15); //move para a direita

            if(posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        if(colisao1.length > 0) { //verificar se teve colisão com o inimigo1
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1")
                .css("left", 694)
                .css("top", posicaoY);
        }

        // colisão do jogador com o inimigo2 (caminhão)
        if(colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();
            reposicionaInimigo2();
        }

        // Disparo com o inimigo1
        if(colisao3.length > 0) {
            pontos += 100; // jogador recebe pontos
            velocidade += 0.3; // aumenta a velocidade do inimigo1 (helicóptero) a cada abate
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950); // para o disparo ser removido (por outra função)

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1")
                .css("left", 694)
                .css("top", posicaoY);
        }

        // Disparo com o inimigo2
        if(colisao4.length > 0) {
            pontos += 50; // jogador recebe pontos
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();
        }

        // Jogador com o amigo
        if(colisao5.length > 0) {
            somResgate.play();
            amigosSalvos++;
            reposicionaAmigo();
            $("#amigo").remove();
        }

        // Colisão do inimigo2 (caminhão) com o amigo
        if(colisao6.length > 0) {
            amigosPerdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }
    }

    function explosao1(inimigo1X, inimigo1Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 200, opacity: 0}, "slow"); //vai sumindo aos poucos

        var tempoExplosao = window.setInterval(removeExplosao, 1000);

        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }
    
    function reposicionaInimigo2() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if(fimDeJogo == false) {
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    }

    function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div>");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)")
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width: 200, opacity: 0}, "slow");

        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if(fimDeJogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
            }
        }
    }

    // Explosão3
    function explosao3(amigoX, amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
        $("#explosao3")
            .css("top", amigoY)
            .css("left", amigoX);
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    function placar() {
        $("#placar").html(`<h2> Pontos: ${pontos} Salvos: ${amigosSalvos} Perdidos: ${amigosPerdidos} </h2>`)
    }

    // Barra de energia
    function energia() {
        $("#energia").css("background-image", `url(imgs/energia${energiaAtual}.png`);

        if(energiaAtual == 0) {
            gameOver(); //fim de jogo
        }
    }

    function gameOver() {
        fimDeJogo = true;
        musica.pause();
        somGameover.play();

        window.clearInterval(jogo.timer); //para o gameLoop do jogo
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html(`
            <h1> Game Over </h1>
            <p>Sua pontuação foi: ${pontos}</p>
            <button id='reinicia' onClick=reiniciaJogo()>
                <h3>Jogar Novamente</h3>
            </button>
        `);
    }
}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}