var dados = [];

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
		window.addEventListener("scroll", function(event) {
			if( !scrolling ) {
				scrolling = true;
				(!window.requestAnimationFrame) ? setTimeout(checkTimelineScroll, 250) : window.requestAnimationFrame(checkTimelineScroll);
			}
		});
	}

	function checkTimelineScroll() {
		verticalTimelinesArray.forEach(function(timeline){
			timeline.showBlocks();
		});
		scrolling = false;
	};

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

function addBloco(order, casos, mortes, texto, dataFormatada, url) {
	const div = this.document.createElement('div');

	div.className = 'cd-timeline__block';
	
	div.id = order;

	div.innerHTML =
		`<div id = "picture-` + order + `" class="cd-timeline__img cd-timeline__img--picture cd-timeline__img--hidden">
			<img src="img/perola.svg" alt="Picture" style="transform: scale(2.5);">
        </div>

        <div id="content-` + order + `" class="cd-timeline__content text-component cd-timeline__content--hidden" style="background-color: #F3FAF8">
			<p id= "text-` + order + `" class="color-contrast-medium texto">"` + texto + `"</p>

			<div id="data-` + order + `" class="flex-start justify-between items-center">
			    
				<span id="span-data-` + order + `" class="cd-timeline__date texto">` + dataFormatada + ` <br> <br>
				Casos: <span style="color:#75cd65;">` + formatNumber(casos) + `</span><br> Mortes: <span style="color: #792a93;">` + formatNumber(mortes) + `</span>
				</span>

				<a id="link-data-` + order + `" href="` + url + `" class="btn btn--subtle texto">Leia mais</a>
				
				<div style="text-align: right; margin-left: 80%; margin-top: -50px"><img src="img/bolsonaro.png"></div>

			</div>
		</div>`;
	// <div id = "picture-` + order + `" class="cd-timeline__img cd-timeline__img--picture">
	// <div id="content-` + order + `" class="cd-timeline__content text-component">
	// <h2 id="titulo-` + order + `"> Casos: ` + casos + ` Mortes: ` + mortes + `</h2> (linha 106)

	return div;
};

function cargaInicial() {
	loadJSON(function (json) {
		json.forEach(element => {
			document.getElementById("div-pai-conteudo").appendChild(
				addBloco(element['order'], element['cases'], element['deaths'], element['text'], element['formattedDate'], element['url'])
			);
			dados.push(JSON.parse(`{ "order":"` + element['order'] + `" , "cases":"` + element['cases'] + `", "deaths":"` + element['deaths'] + `" }`));
		});
	});
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
			var qtdCasos = buscarQtdeCasos(idOrder, dados);
			var qtdMortes = buscarQtdeMortes(idOrder, dados);

			qtdCasos = qtdCasos.toLocaleString('pt-BR');
			
			calculaBarraProgresso(qtdCasos, qtdMortes);

			document.getElementById("rotuloCasos").innerText = formatNumber(qtdCasos);
			document.getElementById("rotuloMortes").innerText = formatNumber(qtdMortes);
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

	var scrolled = (casos / 12000000) * 100;
	document.getElementById("barraCasos").style.width = scrolled + "%";

	scrolled = (mortes / 12000000) * 100;
	document.getElementById("barraMortes").style.width = scrolled + "%";
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}