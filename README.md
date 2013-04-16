image_server
============
画像履歴の格納・表示を行うサーバ。
node.js + MongoDBで作成。

how to use
============
for Ubuntu 12.04
<pre>
  $ sudo apt-get install libopencv-dev libcv-dev libhighgui-dev
  $ sudo apt-get install mongodb mongodb-dev libmongo-client-dev
  $ sudo apt-get install nodejs-dev npm
  $ sudo npm install -g node-gyp
  $ git clone https://github.com/yoggy/image_server.git
  $ cd image_server
  $ npm install -d
  $ node app.js
</pre>

URLs
============
<pre>
  * 画像の送信
    /image_post.html
    /image_post
      
  * 画像履歴一覧の表示(HTML)
    /image_list
    /image_list?name=target_name
      
  *  画像の表示(HTML, ライブビュー)
    /image_view.html
    /image_view.html?name=target_name

  * 画像情報のクエリー(JSON)
    /image_query
    /image_query?name=target_name
    /image_query?name=target_name&limit=100
    /image_query?name=target_name&skip=100

  * 画像の表示(JPEG、最新の画像を表示)
    /image_jpeg?name=target_name

  * 画像の表示(JPEG, _id直接指定)
    /image_jpeg?_id=object_id

</pre>

how to upload image.
============
curlを使って画像ファイルをアップロードする例。
<pre>
  $ curl -F name=camera1 -F image=@image.jpg http://localhost:20080/image_post
</pre>

