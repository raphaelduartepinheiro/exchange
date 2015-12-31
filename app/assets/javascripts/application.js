// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require bootstrap
//= require bootstrap-datepicker
//= require locales/bootstrap-datepicker.pt-BR
//= require highcharts

$(function(){
	$('.date').datepicker({
		language: 'pt-BR',
	    format: 'yyyy-mm-dd'
	});

	function validation(){
		if ($("#currency").val() == ""){
			alert("Preencha a Moeda");
			return false;
		} else if ($("#start-date").val() == ""){
			alert("Preencha a Data Inicial");
			return false;
		} else if ($("#final-date").val() == ""){			
			alert("Preencha a Data Final");
			return false;
		}
		// } else if (Date.parse($("#final-date").val()) < )
		return true;
	}

	function getAllRates(data){
		var date;
		var result = [];
		for (var i=0;i<Object.keys(data.rates).length;i++){
			date = Object.keys(data.rates)[i]
			result.push(parseFloat(data.rates[date].rate));
		}
		return result;
	}

	function search(){
		var result = 
		$.ajax({
			url: 'CurrencyQuote/search.json?currency=' + $("#currency").val() + 
			"&start_date=" + $("#start-date").val() + "&final_date=" + $("#final-date").val(),
			type: 'GET'
		}).done(function(data){
			if (data.error == undefined){
				loadGraphic(data);
			} else{
				alert(data.error);
			}
			
		});
	}

	$("#obter-cotacao").click(function(){
		if (validation())
			search();
			//$("#container").removeClass("hidden");
	});

	function loadGraphic(data){
	    $('#container').highcharts({
	        chart: {
		      	height: 400,
	          	width: 1020,
	            zoomType: 'x'
	        },
	        title: {
	            text: 'De ' + data.from + ' para Real (BRL)',
	        },
	        subtitle: {
	            text: document.ontouchstart === undefined ?
	                    'Click and drag in the plot area to zoom in' :
	                    'Pinch the chart to zoom in'
	        },
	        xAxis: {
	            type: 'datetime',
	            minRange: 24 * 3600000 // fourteen days
	        },
	        yAxis: {
	            title: {
	                text: 'Taxa'
	            }
	        },
	        legend: {
	            enabled: false
	        },
	        plotOptions: {
	            area: {
	                fillColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
	                    stops: [
	                        [0, Highcharts.getOptions().colors[0]],
	                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	                    ]
	                },
	                marker: {
	                    radius: 2
	                },
	                lineWidth: 1,
	                states: {
	                    hover: {
	                        lineWidth: 1
	                    }
	                },
	                threshold: null
	            }
	        },

	        series: [{
	            type: 'area',
	            name: 'De ' + data.from + ' para Real (BRL)',
	            pointInterval: 24 * 3600 * 1000,
	            pointStart: Date.parse(Object.keys(data.rates)[0]), //Date.UTC(2006, 0, 1),
	            data: getAllRates(data)
	        }]
	    });

	}

});