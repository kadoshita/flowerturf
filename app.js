var multiparty;

function start() {
	// MultiParty インスタンスを生成
	multiparty = new MultiParty({
		"key": "9a496dd9-0f6e-48ce-b8b5-7037607a9bf0",
		"reliable": true,
		"video":false,
		"audio":true,
		"debug": 3
	});
	/////////////////////////////////
	// for MediaStream
	multiparty.on('my_ms', function(video) {
		// 自分のvideoを表示
		var vNode = MultiParty.util.createVideoNode(video);
		vNode.setAttribute("class", "video my-video");
		vNode.volume = 0;
		$(vNode).appendTo("#streams");
		multiparty.send(getUser()+'さんが参加しました。');
	}).on('peer_ms', function(video) {
		//console.log("video received!!")
		// peerのvideoを表示
		//console.log(video);
		var vNode = MultiParty.util.createVideoNode(video);
		vNode.setAttribute("class", "video peer-video");
		$(vNode).appendTo("#streams");
		//console.log($("#streams"))
		var mute = !$(this).data("muted");
		multiparty.mute({video: mute});
		$(this).text("video " + (mute ? "unmute" : "mute")).data("muted", mute);
	}).on('ms_close', function(peer_id) {
	// peerが切れたら、対象のvideoノードを削除する
		$("#"+peer_id).remove();
	})

	////////////////////////////////
	// for DataChannel
	multiparty.on('message', function(mesg) {
		var time=new getTime();
		// peerからテキストメッセージを受信
		$("p.receive").append('<p class=\"time\">'+time[0]+':'+time[1]+':'+time[2]+'</p>'+mesg.data + "<br><hr>");
	});

	////////////////////////////////
	// Error handling
	multiparty.on('error', function(err) {
		alert(err);
	});

	multiparty.start();

	//////////////////////////////////////////////////////////
	// テキストフォームに入力されたテキストをpeerに送信
	$("#message form").on("submit", function(ev){
		ev.preventDefault();  // onsubmitのデフォルト動作（reload）を抑制

		// テキストデータ取得
		/*input[type=text]*/
		var $text = $(this).find("textarea");
		var data = $text.val();

		if(data.length > 0) {
			var time=new getTime();
			data = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			$("p.receive").append('<p class=\"time\">'+time[0]+':'+time[1]+':'+time[2]+'</p>'+data + "<br><hr>");

			// メッセージを接続中のpeerに送信する
			multiparty.send(data);
			$text.val("");
		}
	});

	///////////////////////////////////////////////////
	// handle mute/unmute
	/*$("#video-mute").on("click", function(ev) {
	var mute = !$(this).data("muted");
	multiparty.mute({video: mute});
	$(this).text("video " + (mute ? "unmute" : "mute")).data("muted", mute);
	});*/

	$("#audio-mute").on("click", function(ev){
		var mute = !$(this).data("muted");
		multiparty.mute({audio: mute});
		$(this).text("audio " + (mute ? "unmute" : "mute")).data("muted", mute);
	});
}

start();

function getTime(){
	var date=new Date();
	var hour=date.getHours();
	var min=date.getMinutes();
	var sec=date.getSeconds();
	var time=new Array(hour,min,sec);
	return time;
}

function getUser() {
	var url = document.location.href;
	var args = url.split('?');
	if (args.length > 1) {
		var user = args[1];
		if (user != "") {
			return user;
		}
	}
	return "guest";
}