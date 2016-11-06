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
				tools.alertMessage("用户没有登录");
				location.href="subLogin";
			}
		},
		error: function(e){
			tools.alertMessage("连接服务器失败");
		}
	});

	// 任务开始
	var start = function(){
		// 个人信息
		$.ajax({
			url: "/EXbook/index.php/Home/Index/showUser",
			type: "post",
			dataType: "json",
			success: function(datas){
				new Vue({
					el: "#person",
					data: datas,
				});
				$("#person").css("display", "block");
			},
			error: function(e){
				tools.alertMessage("连接服务器失败");
				location = location;
			}
		})

		// 请求个人发布数据
		var books = [];
		new Vue({
			el: "#books",
			data: {
				books: books,
			},
			methods: {
				del: function(id, event){
					if(window.confirm("确定要删除该信息？")){
						$.ajax({
							url: "/EXbook/index.php/Home/Index/deleteBlock",
							type: "post",
							data: {
								id: id,
							},
							dataType: "json",
							success: function(data){
								if(data.status == 1){
									tools.alertMessage("删除成功");
									location = location;
								}
							},
							error: function(e){
								tools.alertMessage("访问服务器失败");
							},
						});	
					}
				},
				showPicture: function(e){
					$(".maximute").find("img")
					.attr("src", e.target.src)
					.end().css("display", "block");
				},
				layout: function(id, book){
					$.ajax({
						url: "/EXbook/index.php/Home/Index/rentOut",
						type: "post",
						data: {
							id: id,
						},
						dataType: "json",
						success: function(datas){
							if(datas.status == 0){
								tools.alertMessage("出租成功");
								book.status = 0;
							}else if(datas.status == 1){
								tools.alertMessage("取消出租");
								book.status = 1;
							}
						},
						error: function(e){
							tools.alertMessage("连接服务器失败");
						},
					});
				},
			}
		});

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
					books.push.apply(books, datas);
					$("#booksTemplate").css("display", "block");
				}
			},
			error: function(data){
				tools.alertMessage("连接服务器失败");
			},
		});

		$(".maximute").click(function(){
			$(this).css("display", "none");
		}).find("img").on("load", function(){
			$(this).css({
				marginTop:  - $(this).height() * 0.5,
			});
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
								update: books[books.length - 1] ? books[books.length - 1].id : null,
								mode: 1,
							},
							dataType: "json",
							success: function(datas){
								scollStatus = false;
								if(datas.error == "empty"){
									$(".nomore").html("没有更多");
									clearInterval(scollTime);
								}else{
									books.push.apply(books, datas);
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
						tools.alertMessage("注销成功");
						location.href = "subLogin";
					}else{
						tools.alertMessage("注销失败");
					}
				},
				error: function(e){
					tools.alertMessage("连接服务器失败");
				}
			});
		});
	};	
})(window);