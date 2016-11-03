;(function(window, undefined){
	var data = [];

	new Vue({
		el: "#messages",
		data: {
			messages: data,
		},
		methods: {
			toChatRoom: function(message, e){
				location.href = "chatroom?id=" + message.id
				+ "&name=" + message.name + "&pic=" + message.pic;
			}
		}
	});

	// 检测登录状态
	$.ajax({
		url: "/EXbook/index.php/Home/Index/checkSession",
		type: "post",
		dataType: "json",
		success: function(datas){
			if(datas.status == 0){
				location.href = "subLogin";
			}else{
				start();
			}
		},
		error: function(e){
			tools.alterMessage("连接服务器错误");
		},
	});

	var start = function(){
		// 初始化IM
		RongIMClient.init("kj7swf8o7whu2");

		// 状态监听
		RongIMClient.setConnectionStatusListener({
			onChanged: function(status){
				switch(status){
					case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
						tools.alterMessage('其他设备登录');
						break;
				}
			}
		});

		// 消息监听
		RongIMClient.setOnReceiveMessageListener({
			onReceived: function (message) {
				data.push({
					id: message.senderUserId,
					time: message.sentTime,
					pic: message.content.extra.pic,
					name: message.content.extra.name,
					message: message.content.content,
				});
			}
		});

		// 请求token
		$.ajax({
			url: "/EXbook/index.php/Home/Rong/check",
			type: "post",
			dataType: "json",
			success: function(datas){
				console.log(datas);
				RongIMClient.connect(datas.token, {
					onSuccess: function(){},
				});
			},
			error: function(e){
				tools.alterMessage("访问服务器失败");
			}
		});
	}
})(window);