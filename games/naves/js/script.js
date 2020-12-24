
function start() {

	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    
    //Principais variáveis do jogo
    var jogo = {}
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
        movefundo();
        moveJogador();
    }

    //Função que movimenta o fundo do jogo
	function movefundo() {
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
    
}