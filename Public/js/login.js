;(function(window, undefined){
	$(function(){
		// 返回前一页
		$("#back").click(function(){
			window.history.back(-1);
		});

		$("#login").ajaxForm({
			url: "/EXbook/index.php/Home/Index/login",
			type: "post",
			dataType: "json",
			beforeSubmit: function(data){
				for(var i = 0; i < data.length; i++){
					var value = data[i];
					if(value.value == ""){
						tools.alertMassage("手机号和密码不能为空");
						return false;
					}else if(value.name == "phone" && value.value.length != 11){
						tools.alertMassage("手机号只能为11位");
						return false;
					}else if(value.name == "pass" && value.value.length < 8){
						tools.alertMassage("密码至少8位");
						return false;
					}
				}
			},
			success: function(data){
				if(data.status){
					location.href = "index";
				}else{
					tools.alertMassage("登录错误， 请检查帐号和密码是否正确");
				}
			},
			error: function(error){
				tools.alertMassage("连接服务器错误");
			},
		});

		// 预检验
		var phoneCheck = false;
		$("#phone").blur(function(){
			if(phoneCheck == false){
				if($("#phone").val().length == 11){
					$("#phoneWarning").html("");
				}else{
					$("#phoneWarning").html("手机号只能为11位");
				}
			}
		});

		$("#password").blur(function(){
			if($("#password").val().length < 8){
				$("#passwordWarning").html("密码至少8位");
			}else{
				$("#passwordWarning").html("");
			}
		});
	});
})(window);