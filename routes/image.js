var fs = require('fs')

function render_error(res, msg) {
	console.log('err : ' + msg);
	res.render('error', { error_result: msg });
}

exports.post = function(req, res) {
	try {
		if (!("name" in req.body)) {
			render_error('err : parameter "name" not found...');
			return;
		}

		var name = req.body.name;
		var tmp_path = req.files.image.path;

		fd = fs.openSync(tmp_path, 'r');
		stats = fs.fstatSync(fd);
		var size = stats.size;
		console.log("name=" + name + ", tmp_path=" + tmp_path + ",size=" + size);

		var buf = new Buffer(size);
		fs.readSync(fd, buf, 0, buf.length);
		fs.close(fd);
		fs.unlinkSync(tmp_path);

		var query = {};
		query['name']  = name;
		query['image'] = buf;
		query['timestamp'] = new Date().getTime(); //milliseconds

		Image.insert(query);

		res.redirect('/image_post.html');
	}
	catch (ex) {
		render_error(res, 'exception occured...ex=' + ex);
	}
};

exports.list = function(req, res) {
	try {
		var query = {};
		var name = "";

		if ("name" in req.query) {
			name = req.query.name;
			query = {name : req.query.name};
		}

		Image.find(query).count(function(err, count) {
			if (err || !count || parseInt(count) == 0 ) {
				res.render('image_list', {images: [], name: name, next_pos:0, prev_pos:-1, item_count:0});
				return;
			}

			var pos = ("pos" in req.query) && req.query.pos > 0 ? parseInt(req.query.pos) : 0;
			var limit = 50;

			Image.find(query).skip(pos).limit(limit).sort({$natural:-1}).toArray(function(err, array) {
				if (err || !array || array.length == 0) {
					res.render('image_list', {images: [], name: name, next_pos:0, prev_pos:-1, item_count:0});
					return;
				}
				var prev_pos = (pos - limit) < 0 ? -1 : (pos - limit);
				var next_pos = (pos + limit) > count ? count : (pos + limit);

				res.render('image_list', {images: array, name: name, next_pos:next_pos, prev_pos:prev_pos, item_count:count});
			});
		});
	}
	catch (ex) {
		render_error(res, 'exception occured...ex=' + ex);
	}
}

exports.query = function(req, res) {
	try {
		var query = {};
		var return_keys = {_id:1, name:1, timestamp:1};
		var name = "";
		var limit = 100;
		var skip = 0;

		if ("name" in req.query) {
			name = req.query.name;
			query = {name : req.query.name};
		}
		if ("limit" in req.query) {
			limit = parseInt(req.query.limit);
		}
		if ("skip" in req.query) {
			skip = parseInt(req.query.skip);
		}

		Image.find(query, return_keys).skip(skip).limit(limit).sort({$natural:-1}).toArray(function(err, array) {
			if (err || !array || array.length == 0) {
				res.send({result:[], count:0, ok:0, msg:"Image.find() failed...err"+err});
				return;
			}
			array.forEach(function(v) {
				v["_id"] = v["_id"].toString();
			});
			res.send({result:array, count:array.length, ok:1, msg:"query success."});
		});
	}
	catch (ex) {
		render_error(res, 'exception occured...ex=' + ex);
	}
}

function render_jpeg(req, res, query) {
	try {
		Image.find(query).limit(1).sort({$natural:-1}).toArray(function(err, array) {
			if (err || !array || array.length == 0) {
				console.log("err : image not found...");
				res.render('error', { error_result: 'image not found...'});
				return;
			}

			var doc = array[0];

			var image = doc.image;
			if ("width" in req.query) {
				CV.readImage(image, function(err, im) {
					var w = parseInt(req.query.width);
					var h = w * im.height() / im.width();
					im.resize(w, h);

					res.setHeader('Content-Type', 'image/jpeg');
					res.setHeader('X-Content-Type-Options', 'nosniff');
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.end(im.toBuffer());
				});
			}
			else {
				res.setHeader('Content-Type', 'image/jpeg');
				res.setHeader('X-Content-Type-Options', 'nosniff');
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.end(image);
			}
		});
	}
	catch (ex) {
		render_error(res, 'exception occured...ex=' + ex);
	}
}

exports.jpeg = function(req, res) {
	try {
		var query = {};

		if ("name" in req.query) {	
			query = {name : req.query.name};
			render_jpeg(req, res, query);
		}
		else if ("_id" in req.query) {	
			query = {_id : new ObjectId(req.query._id)};
			render_jpeg(req, res, query);
		}
		else {
			render_error('parameter "name" or "_id" not found...');
		}
	}
	catch (ex) {
		render_error(res, 'exception occured...ex=' + ex);
	}
}

exports.delete_all = function(req, res) {
	try {
		Image.remove({});
		res.redirect('index.html');
	}
	catch (ex) {
		render_error(res, 'exception occured...ex=' + ex);
	}
}

