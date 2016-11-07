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
		$("#changePassword").submit(function(){
			if($("#oldpassword").val() == ""){
				alert("昵称不能为空");
			}else{
				$.ajax({
					url: "/EXbook/index.php/Home/Index/changeName",
					type: "post",
					data: {
						newName: $("#oldpassword").val(),
					},
					dataType: "json",
					success: function(data){
						if(data.status == 1){
							alert("修改成功");
							location.href = "settings";
						}else{
							alert("修改失败");
						}
					},
					error: function(e){
						alert("连接服务器失败");
					}
				})
			}
			return false;
		});
	}
	
})(window);