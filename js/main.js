var dados = [];
let totalMortes = 0;
let totalCasos = 0;
let qtdCasos = 0;
let qtdMortes = 0;

(function(){

  // Vertical Timeline - by CodyHouse.co
	function VerticalTimeline( element ) {
		this.element  = element;
		this.blocks   = this.element.getElementsByClassName("cd-timeline__block");
		this.images   = this.element.getElementsByClassName("cd-timeline__img");
		this.contents = this.element.getElementsByClassName("cd-timeline__content");
		this.offset   = 0.8;
		this.hideBlocks();		
	};
	
	// Iniciar com duas cargas de informação - @jeff
	VerticalTimeline.prototype.showFirst = function(){
		if ( !"classList" in document.documentElement ) {
			return; // no animation on older browsers
		}
		
		var self = this;
		for( var i = 0; i < 2; i++) {
			(function(i){
				if(self.contents[i].classList.contains("cd-timeline__content--hidden")) {
					self.contents[i].classList.add("cd-timeline__content--bounce-in");
					self.contents[i].classList.remove("cd-timeline__content--hidden");
					self.images[i].classList.add("cd-timeline__img--bounce-in");
					self.images[i].classList.remove("cd-timeline__img--hidden");
				}
			})(i);
		}

	};

	VerticalTimeline.prototype.hideBlocks = function() {

		if ( !"classList" in document.documentElement ) {
			return; // no animation on older browsers
		}
		//hide timeline blocks which are outside the viewport
		var self = this;
		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				 if( self.blocks[i].getBoundingClientRect().top > window.innerHeight * self.offset ) {
					self.images[i].classList.add("cd-timeline__img--hidden"); 
					self.contents[i].classList.add("cd-timeline__content--hidden"); 
				}
			})(i);
		}
	};

	VerticalTimeline.prototype.showBlocks = function() {
		if (!"classList" in document.documentElement ) {
			return;
		}
		var self = this;
		console.log(this.blocks.length);

		for( var i = 0; i < this.blocks.length; i++) {
			(function(i){
				if(self.contents[i].classList.contains("cd-timeline__content--hidden") 
				&& self.blocks[i].getBoundingClientRect().top <= window.innerHeight*self.offset) {
					// add bounce-in animation
					self.images[i].classList.add("cd-timeline__img--bounce-in");
					self.contents[i].classList.add("cd-timeline__content--bounce-in");
					self.images[i].classList.remove("cd-timeline__img--hidden");
					self.contents[i].classList.remove("cd-timeline__content--hidden");
				}
			})(i);
		}
	};

	var verticalTimelines = document.getElementsByClassName("js-cd-timeline"),
		verticalTimelinesArray = [],
		scrolling = false;
	if( verticalTimelines.length > 0 ) {
		for( var i = 0; i < verticalTimelines.length; i++) {
			(function(i){
				verticalTimelinesArray.push(new VerticalTimeline(verticalTimelines[i]));
			})(i);
		}

		//show timeline blocks on scrolling
		window.addEventListener("scroll", scrollEvent);
		window.addEventListener('BlocosAdicionados', startTimeline); // Evento para quando os blocos forem adicionados 
	}

	function scrollEvent(event){
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
		}
	}

	function checkTimelineScroll() {
		verticalTimelinesArray.forEach(function(timeline){
			timeline.showBlocks();
		});
		scrolling = false;
	};

	function startTimeline(){ // Mostrar os primeiros itens da timeline
		verticalTimelinesArray.forEach(function(timeline){
			timeline.showFirst();
		});
	}

})();

function loadJSON(callback, vetor) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'data/quotes.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(JSON.parse(xobj.responseText));
		}
	};
	xobj.send(null);
};

function addBloco(order, casos, mortes, texto, dataFormatada, url, posicao) {
	const div = this.document.createElement('div');
	var codigoHtml = "";

	div.className = 'cd-timeline__block';
	div.id = order;
	
	let rotateValue = posicao % 2 == 0 ? 0 : 180; 
	let translate = 0;
	let pictureFileName = "";

	// TODO: QUando padronizar imagens, corrigir aqui
	switch(posicao % 3){
		case 0: pictureFileName = "bozo_faixa.svg"; 	break;
		case 1:	pictureFileName = "bozo_mascara.svg"; 	break;
		case 2:	pictureFileName = "bozo_grito.svg"; 	break;
	}

	// GAMBIARRA 
	switch(posicao % 6){
		case 0: translate = 15; break;
		case 1: translate = 3; break;
		case 2: translate = 18; break;
		case 4: translate = 12; break;
		case 5: translate = -5; break;
	}


	// Imagem bolsonaro
	codigoHtml = `<div id = "picture-` + order + `" class="cd-timeline__img cd-timeline__img--picture cd-timeline__img--hidden">
			<img src="img/` + pictureFileName + `" alt="Picture" style="transform: scale(10) translateX(`+ translate + `%) rotateY(`+ rotateValue + `deg); z-index: 200;">
		</div>`;
	
	// Conteudo card
	codigoHtml = codigoHtml +
		`<div id="content-` + order + `" class="cd-timeline__content text-component cd-timeline__content--hidden" style="background-color: #F3FAF8;">
			<span id="titulo-` + order + `" class="data-formatada">` + dataFormatada + `</span>
			<p>
			<p id="text-` + order + `" class="color-contrast-medium texto-balao">"` + texto + `"</p>
			<div id="data-` + order + `" class="flex-start justify-between items-center">
				<a id="link-data-` + order + `" href="` + url + `" class="btn btn--subtle texto-balao" target="_blank">Leia mais</a>
			</div>
		</div>`;

	div.innerHTML = codigoHtml;

	//Casos: <span style="color:#75cd65;">` + formatNumber(casos) + `</span><br> Mortes: <span style="color: #792a93;">` + formatNumber(mortes) + `</span> (linha 116)
        
	// <div id = "picture-` + order + `" class="cd-timeline__img cd-timeline__img--picture">
	// <div id="content-` + order + `" class="cd-timeline__content text-component">
	// <h2 id="titulo-` + order + `"> Casos: ` + casos + ` Mortes: ` + mortes + `</h2> (linha 106)
	// <div style="text-align: right; margin-left: 80%; margin-top: -50px"><img src="img/bolsonaro.png"></div> (linha 115)

	//<span id="span-data-` + order + `" class="cd-timeline__date texto-balao">` + dataFormatada + ` <br> <br>
	//</span>

	return div;
};

function cargaInicial() {
	loadJSON(function (json) {
		var i = 0;

		totalCasos = json[json.length - 1].cases;
		totalMortes = json[json.length - 1].deaths;

		json.forEach(element => {

			element['text'] = replaceAll(element['text'], "hidroxicloroquina", (`<span class="texto-chave">` + `hidroxicloroquina` + `</span>`));
			element['text'] = replaceAll(element['text'], "cloroquina", (`<span class="texto-chave">` + `cloroquina` + `</span>`));
			element['text'] = replaceAll(element['text'], "gripezinha", (`<span class="texto-chave">` + `gripezinha` + `</span>`));
			element['text'] = replaceAll(element['text'], "coronavírus", (`<span class="texto-chave">` + `coronavírus` + `</span>`));
			element['text'] = replaceAll(element['text'], "vírus", (`<span class="texto-chave">` + `vírus` + `</span>`));
			element['text'] = replaceAll(element['text'], "coveiro", (`<span class="texto-chave">` + `coveiro` + `</span>`));
			element['text'] = replaceAll(element['text'], "porra", (`<span class="texto-chave">` + `porra` + `</span>`));
			element['text'] = replaceAll(element['text'], "UTI", (`<span class="texto-chave">` + `UTI` + `</span>`));
			element['text'] = replaceAll(element['text'], "mortes", (`<span class="texto-chave">` + `mortes` + `</span>`));
			element['text'] = replaceAll(element['text'], "pandemia", (`<span class="texto-chave">` + `pandemia` + `</span>`));
			element['text'] = replaceAll(element['text'], "Eu não errei nenhuma desde Março do ano passado.", (`<span class="texto-chave">` + `Eu não errei nenhuma desde Março do ano passado.` + `</span>`));

			document.getElementById("div-pai-conteudo").appendChild(
				addBloco(element['order'], element['cases'], element['deaths'], element['text'], element['formattedDate'], element['url'], i)
			);
			i = i + 1;
			dados.push(JSON.parse(`{ "order":"` + element['order'] + `" , "cases":"` + element['cases'] + `", "deaths":"` + element['deaths'] + `" }`));
		});
	});

	setTimeout(BlocosAdicionados, 250); // Fazer a chamada de evento de mostrar os primeiros blocos 
	setTimeout(AtualizarHeadersValores, 25);
	
}

function AtualizarHeadersValores(){
	document.getElementById("rotuloCasos").innerText = formatNumber(qtdCasos);
	document.getElementById("rotuloMortes").innerText = formatNumber(qtdMortes);
	document.getElementById("rotuloTotalCasos").innerText = formatNumber(totalCasos);
	document.getElementById("rotuloTotalMortes").innerText = formatNumber(totalMortes);
}

function BlocosAdicionados(){
	window.dispatchEvent(new Event('BlocosAdicionados'));
}

// Teste de visibilidade
function isInViewport() {

	var blocos = document.getElementsByClassName("cd-timeline__block");
	for (let index = 0; index < blocos.length; index++) {
		const element = blocos[index];

		var rect = element.getBoundingClientRect();
		if (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		) {
			var idOrder = element.getAttribute("id");
			qtdCasos = buscarQtdeCasos(idOrder, dados);
			qtdMortes = buscarQtdeMortes(idOrder, dados);

			qtdCasos = qtdCasos.toLocaleString('pt-BR');
			
			calculaBarraProgresso(qtdCasos, qtdMortes);
			AtualizarHeadersValores();
		}
	}
}

function buscarQtdeCasos(order, vetor) {
	// iterate over each element in the array
	for (var i = 0; i < vetor.length; i++) {
		// look for the entry with a matching `code` value
		if (vetor[i].order == order) {
			// we found it
			return vetor[i].cases;
		}
	}
}

function buscarQtdeMortes(order, vetor) {
	// iterate over each element in the array
	for (var i = 0; i < vetor.length; i++) {
		// look for the entry with a matching `code` value
		if (vetor[i].order == order) {
			// we found it
			return vetor[i].deaths;
		}
	}
}

function fixaCabecalho() {
	var header = document.getElementById("cabecalho");
	var sticky = header.offsetTop;

	if (window.pageYOffset > sticky) {
		header.classList.add("sticky");
	} else {
		header.classList.remove("sticky");
	}
}

function calculaBarraProgresso(casos, mortes) {
	// progress bar
	/*
	var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	var scrolled = (winScroll / height) * 100;
	document.getElementById("myBar").style.width = scrolled + "%";
	*/
	var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

	var scrolled = (casos / totalCasos) * 100;
	document.getElementById("barraCasos").style.width = scrolled + "%";

	scrolled = (mortes / totalMortes) * 100;
	document.getElementById("barraMortes").style.width = scrolled + "%";
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}


function replaceAll(string, search, replace) {
	return string.split(search).join(replace);
}