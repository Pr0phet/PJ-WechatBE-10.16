;(function(window, undefined){
	// 检查登录状态
	$.ajax({
		url: "/EXbook/index.php/Home/Index/checkSession",
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				start();
			}else{
				location.href="subLogin";
			}
		},
		error: function(e){
			tools.alertMassage("连接服务器失败");
		}
	});

	// 任务开始
	var start = function(){
		var data = {
			information: {
				owner: "default",
				owner_pic: "/EXbook/Public/img/touxiang.jpg",
				number: 0,
			},
			books: [],
		};

		new Vue({
			el: content,
			data: data,
		});

		// 个人信息
		$.ajax({
			url: "/EXbook/index.php/Home/Index/showUser",
			type: "post",
			dataType: "json",
			success: function(datas){
				data.information = datas;
			},
			error: function(e){
				tools.alertMassage("连接服务器失败");
				location = location;
			}
		})

		// 请求个人发布数据
		$.ajax({
			url: "/EXbook/index.php/Home/Index/showBlocks",
			type: "post",
			data: {
				mode: 1,
			},
			dataType: "json",
			success: function(datas){
				if(datas.error == "empty"){
					$(".nomore").html("没有更多");
				}else{
					console.log(datas);
					data.books = datas;
				}
			},
			error: function(data){
				tools.alertMassage("连接服务器失败");
			},
		});

		// 滑动添加
		var scollStatus = false,
			scollTime = window.setInterval(function(){
				if(scollStatus == false){
					if($("#content").height() + $("#content").offset().top
						< 1.5 * document.body.clientHeight){
						scollStatus = true;
						$.ajax({
							url: "/EXbook/index.php/Home/Index/showBlocks",
							type: "post",
							data: {
								update: data.books[data.books.length - 1] ? data.books[data.books.length - 1].id : null,
								mode: 1,
							},
							dataType: "json",
							success: function(datas){
								scollStatus = false;
								if(datas.error == "empty"){
									$(".nomore").html("没有更多");
									clearInterval(scollTime);
								}else{
									data.books.push.apply(data.books, datas);
								}
							},
							error: function(e){
								tools.alertMessage("连接服务器失败");
							}
						});
					}
				}
			}, 200);

		// 注销
		$("#logout").click(function(){
			$.ajax({
				url: "/EXbook/index.php/Home/Index/logout",
				type: "post",
				dataType: "json",
				success: function(datas){
					if(datas.status == 1){
						tools.alertMassage("注销成功");
						location.href = "index";
					}else{
						tools.alertMassage("注销失败");
					}
				},
				error: function(e){
					tools.alertMassage("连接服务器失败");
				}
			});
		});
	};	
})(window);