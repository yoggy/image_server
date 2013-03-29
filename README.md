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
  /
      
  /image_post.html
      
  /image_post
      
  /image_list
      
  /image_view.html
      
  /image_jpeg?name=target_name
      
  /image_jpeg?_id=object_id
      
</pre>
