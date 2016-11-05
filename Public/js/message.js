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
					time: (function(time){
						var diff = (new Date().getTime()) - time;
						if((diff /= 1000) < 60){
							return parseInt(diff) + "秒";
						}else if((diff /= 60) < 60){
							return parseInt(diff) + "分";
						}else if((diff /= 60) < 24){
							return parseInt(diff) + "时";
						}else if((diff /= 24) < 30){
							return parseInt(diff) + "天";
						}else if((diff /= 30) < 12){
							return parseInt(diff) + "月";
						}else{
							return parseInt(diff /= 12) + "年";
						}
					})(message.sentTime),
					pic: message.content.extra.pic,
					name: message.content.extra.name,
					message: message.content.content,
				});
			},
		});

		// 请求token
		$.ajax({
			url: "/EXbook/index.php/Home/Rong/check",
			type: "post",
			dataType: "json",
			success: function(datas){
				RongIMClient.connect(datas.token, {
					onSuccess: function(){},
				});
			},
			error: function(e){
				tools.alertMessage("访问服务器失败");
			}
		});

		// 查询评论
		$.ajax({
			url: "/EXbook/index.php/Home/Index/getPersonalComment",
			type: "post",
			dataType: "json",
			success: function(datas){
				console.log(datas);
			},
			error: function(e){
				// tools.alertMessage("连接服务器错误");
			},
		})
	}
})(window);