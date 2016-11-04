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
				tools.alertMassage("用户没有登录");
				location.href="subLogin";
			}
		},
		error: function(e){
			tools.alertMassage("连接服务器失败");
		}
	});

	var start = function(){
		$("#changePassword").submit(function(){
			if($("#oldpassword").val().length < 8){
				alert("密码至少8位");
			}else if($("#password").val().length < 8){
				alert("密码至少8位");
			}else if($("#password").val() != $("#repeatPassword").val()){
				alert("两次密码不相同");
			}else{
				$.ajax({
					url: "/EXbook/index.php/Home/Index/changePass",
					type: "post",
					data: {
						oldPass: $("#oldpassword").val(),
						newPass: $("#password").val(),
					},
					dataType: "json",
					success: function(data){
						if(data.status == 1){
							alert("修改成功");
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