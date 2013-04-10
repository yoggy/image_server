var target_name;
var image_size;
var update_interval;

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

$(document).ready(function() {
	init();
	periodic_reload_image();
});

