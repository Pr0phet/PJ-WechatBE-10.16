;(function(window, undefined){
	// 检测登录状态
	$.ajax({
		url: "/EXbook/index.php/Home/Index/checkSession",
		type: "post",
		dataType: "json",
		success: function(datas){
			if(datas.status == 0){
				tools.alertMessage("用户没有登录");
				location.href = "index";
			}else{
				start();
			}
		},
		error: function(e){
			tools.alertMessage("连接服务器错误");
		}
	});

	// 开始任务
	var start = function(){
		// 获取聊天对方的id和姓名
		var id = location.search.match(/\bid=(\d+)/),
			name = location.search.match(/\bname=(.*?)($|&)/),
			pic = location.search.match(/\bpic=(.*?)($|&)/);

		if(!id || !name || !pic)
			location.href = "index";

		var chatroom = {
			target: {
				id: id[1],
				name: name[1],
				pic: pic[1],
			},
			messages: [],
		}

		$("#name").html(chatroom.target.name);
		new Vue({
			el: "#messages",
			data: chatroom,
		});

		// 初始化IM
		RongIMClient.init("kj7swf8o7whu2");

		// 状态监听
		RongIMClient.setConnectionStatusListener({
			onChanged: function(status){
				switch(status){
					case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
						tools.alertMessage('其他设备登录');
						break;
				}
			}
		});

		// 消息监听
		RongIMClient.setOnReceiveMessageListener({
			onReceived: function (message) {
				chatroom.messages.push({
					pic: chatroom.target.pic,
					content: message.content.content,
					target: true,
				});
			}
		});

		// 请求token
		$.ajax({
			url: "/EXbook/index.php/Home/Rong/check",
			type: "post",
			dataType: "json",
			success: function(datas){
				chatroom.self = {
					id: datas.id,
					name: datas.name,
					pic: datas.pic,
				}

				RongIMClient.connect(datas.token, {
					onSuccess: function(){},
				});

				$(".send").click(function(){
					if($("#message").val() != ""){
						RongIMClient.getInstance().sendMessage(
							RongIMLib.ConversationType.PRIVATE,
							chatroom.target.id,
							new RongIMLib.TextMessage({
								content: $("#message").val(),
								extra: {
									name: chatroom.self.name,
									pic: chatroom.self.pic,
								},
							}), {
								onSuccess: function(){
									chatroom.messages.push({
										pic: chatroom.self.pic,
										content: $("#message").val(),
										target: false,
									});
									$("#message").val("");
								},
							}
						);
					}
				});
			},
			error: function(e){
				tools.alertMessage("访问服务器失败");
			}
		});
	}
})(window);