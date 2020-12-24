
function start() {

	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    
    //Principais variáveis do jogo
    var jogo = {}
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
            
            //Chama função Disparo	
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
    
}