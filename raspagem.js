(function() {


"use strict";

function rasparDados(){
			/*
			=========================================================================
			O novo código-fonte da página, além de dificultar a raspagem de conteúdo,
			literalmente proíbe que ela seja veita diretamente. 
			
			Pra nossa sorte, existe uma forma de driblar isso ;) Follow me!
			=========================================================================
			*/

			//todo o código HTML da tabela foi salvo numa string
		    var HTMLBruto = document.getElementsByClassName('body style-scope ytsp-sponsors-dialog')[0].innerHTML;


		   	//a string foi renderizada como HTML de novo, como se esse código estivesse
		  	//em outro arquivo, livre dos scripts de restrição
		    var doc = new DOMParser().parseFromString(HTMLBruto, "text/html");


		    //limpeza de conteúdo inútil
		    Array.prototype.slice.call(doc.getElementsByTagName('iron-icon')).forEach(
			  function(item) {
			    item.remove();
			});

		    //Arrays com as colunas da tabela, pegos do nosso próprio HTML
		    let links         = doc.getElementsByTagName('a');
		    let nomes         = doc.getElementsByClassName('sponsor-info-name');
		    let tiers         = doc.getElementsByClassName('sponsor-current_tier');
		    let logs          = doc.getElementsByClassName('sponsor-last-update');
		    let times         = doc.getElementsByClassName('sponsor-total-time'); //vide comentario abaixo
		    let time_on_level = [];
		    let time_total    = [];


		    /*
			A classe 'sponsor-total-time' é usada tanto pro 'Total time on level' quanto
			pro 'Total time on level' e por isso, o Array ta alocando essas duas variáveis ao
			mesmo tempo. 

			Como elas aparecem em ordem, uma depois da outra, fica fácil separar:
		    */

		    for(let i=0 ; i < times.length ; i++) 
		    {

		    	//ADD: Converter esse valor pra int

		    	if(i % 2 == 0) //se a posição no array for divisível por 2
		    	{
		    		time_on_level.push(times[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm," ").trim());
		    	}
		    	else
		    	{
		    		time_total.push(times[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm," ").trim());
		    	}

		    }



		   

		    /*
			   ORGANIZAÇÃO DOS ARRAYS E MONTAGEM DO CSV

			   Simplificando bastante, arrays são variáveis com vários valores dentrokkkk
			   Imagina a seguinte tabela

			   *------------------------------------*
			   |      NOME       |      IDADE       |
			   *------------------------------------*
			   |      João       |        18        |
			   *------------------------------------*
			   |      Pedro      |        29        |
			   *------------------------------------*

				Ela tem duas colunas, podemos dividir em 2 arrays:

				var nome  = ["João", "Pedro"];
				var idade = [18, 29];

				Para pegar um valor específico, podemos usar a posição dele no array, partindo do 0

				nome[0]  ===> "João"
				idade[0] ===> 18
				
				nome[1]  ===> "Pedro"
				idade[1] ===> 29
				
				Partindo desse princípio, podemos criar uma variável que contenha todas as info de uma linha(posição) 
				específica:

				var linha1 = nome[0] + ' - ' + idade[0]; ====> "João - 18"
				var linha2 = nome[1] + ' - ' + idade[1]; ====> "Pedro - 29"
				
				O código abaixo se baseia nisso para gerar o texto do CSV, com o auxílio de um laço de repetição
		    */
		    var CSV = "";



		    for(let i=0 ; i<nomes.length ; i++) //loop do tamanho da lista
		    {
		    	
		    	var nome = nomes[i].innerText; 
		    	var tier = tiers[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm," ").trim(); //pra remover os espaços do início
		    	var link = links[i].href;

		    	//para dividir o link e pegar só o ChannelID
		    	var arry = link.split("/"); 
	            link     = arry[arry.length - 2];


		    	var t_lvl = time_on_level[i];
		    	var t_all = time_total[i];
		    	var log   = logs[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm," ").trim();


		    	//montagem de uma linha de acordo com a posição do loop e suas colunas correspondentes
		    	var linha = '"'   + nome  + 
		    				'","' + tier  + 
		    				'","' + link  + 
		    				'","' + t_lvl + 
		    				'","' + t_all + 
		    				'","' + log   + '"\n'; //O \n serve pra quebrar linha

		    	CSV = CSV + linha;
		    }
		    

		    //criação do arquivo para download
		    var link    = document.createElement('a');
		    link.setAttribute('download', 'teste.csv');
		    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSV));
		    link.click(); 

	}
	

	//Código para quando o botão no menu de contexto for acionado
	if(window.hasOwnProperty("btnDireitoRaspar") && btnDireitoRaspar){
			btnDireitoRaspar = false;
			rasparDados();
	}
})();
