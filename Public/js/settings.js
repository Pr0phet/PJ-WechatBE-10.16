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

	var start = function(){
		$.ajax({
			url: "/EXbook/index.php/Home/Index/showUser",
			type: "post",
			dataType: "json",
			success: function(data){
				$("#oldOwnerPic").attr({
					src: data.owner_pic,
				});
			},
			error: function(e){
				tools.alertMessage("连接服务器失败");
			}
		});

		$("#touxiang").change(function(){
			$("#boxs").ajaxSubmit({
				url: "/EXbook/index.php/Home/Index/changePic",
				type: "post",
				dataType: "json",
				mimeType: "multipart/form-data",
				success: function(data){
					if(data.status == 1){
						location = location;
					}
				}, 
				error: function(e){
					tools.alertMessage("连接服务器失败");
				},
			});
		});
	}



	
})(window);