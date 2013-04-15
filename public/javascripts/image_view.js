var target_name;
var image_size;
var update_interval;

// http://jquery-howto.blogspot.jp/2009/09/get-url-parameters-values-with-jquery.html
$.extend({
	getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name){
		return $.getUrlVars()[name];
	}
});

function reload_image() {
	var timestamp = new Date().getTime();
	var image_src = "image_jpeg?name=" + target_name + "&width=" + image_size + "&" + timestamp;

	$('#image_area').attr('src', image_src);
}

function periodic_reload_image() {
	reload_image();
	setTimeout(periodic_reload_image, update_interval);
}

function init() {
	target_name = $("#target_name").val();
	image_size = $("#image_size").val();
	update_interval = $("#update_interval").val();

	$("#target_name").change(function () {
		target_name = $("#target_name").val();
		reload_image();
	});
	$("#image_size").change(function () {
		image_size = $("#image_size").val();
		reload_image();
	});
	$("#update_interval").change(function () {
		update_interval = $("#update_interval").val();
		reload_image();
	});
}

function check_query_string() {
	var name = $.getUrlVar('name');
	if (name) {
		$("#target_name").val(name);
		target_name = name;
	}

	var w = $.getUrlVar('w');
	if (w) {
		$("#image_size").val(w);
		image_size = w; 
	}
}

$(document).ready(function() {
	init();
	check_query_string();
	periodic_reload_image();
});

