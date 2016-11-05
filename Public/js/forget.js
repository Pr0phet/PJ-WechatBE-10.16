;(function(window, undefined){
	$(function(){
		// 返回前一页
		$("#back").click(function(){
			window.history.back(-1);
		});

		// 验证码获取和检查
		var codeCheck = false,
			sending = false;
		$("#getCode").click(function(){
			if(sending == false && phoneCheck == true){
				if($("#phone").val().length == 11){
					codeCheck = false;
					sending = true;
					var times = 60,
						interval = setInterval(function(){
							if(times == 0){
								clearInterval(interval);
								sending = false;
								$("#getCode").val("获取验证码");
							}else{
								$("#getCode").val(times-- + "秒后重试");
							}
						}, 1000);
					$.ajax({
						url: "/EXbook/index.php/Home/Index/sendSMS",
						type: "post",
						data: {
							phone: $("#phone").val(),
						},
						dataType: "json",
						success: function(data){
							if(data.status){
								tools.alertMessage("发送成功");
								$("#codeWarning").html("");
								$("#code")[0].focus();
							}else{
								tools.alertMessage("发送失败");
							}
						},
						error: function(error){
							tools.alertMessage("连接服务器错误");
						},
					});
				}else{
					tools.alertMessage("请输入正确的手机号码");
					$("#phoneWarning").html("请输入正确的手机号码");
				}
			}
		});

		$("#code").blur(function(){
			if(/^\d{4}$/.test($("#code").val())){
				$("#codeWarning").html("");
				$.ajax({
					url: "/EXbook/index.php/Home/Index/checkCode",
					type: "post",
					data: {
						code: $("#code").val(),
					},
					dataType: "json",
					success: function(data){
						if(data.status){
							$("#codeWarning").html("");
							codeCheck = true;
						}else{
							$("#codeWarning").html("验证码错误");
							codeCheck = false;
						}
					},
					error: function(error){
						codingCheck = false;
						tools.alertMessage("连接服务器错误");
					}
				});
			}else{
				$("#codeWarning").html("验证码错误");
			}
		});

		// 提交
		$("#register").ajaxForm({
			url: "/Exbook/index.php/Home/Index/forgetPass",
			type: "post",
			dataType: "json",
			beforeSubmit: function(data){
				for(var i = 0; i < data.length; i++){
					var value = data[i];
					if(value.value == ""){
						tools.alertMessage("手机号和密码不能为空");
						return false;
					}else if(value.name == "phone" && value.value.length != 11){
						tools.alertMessage("手机号只能为11位");
						return false;
					}else if(value.name == "pass" && value.value.length < 8){
						tools.alertMessage("密码至少8位");
						return false;
					}else if(value.name == "repass" && value.value != $("#password").val()){
						tools.alertMessage("两次密码不相同");
						return false;
					}
				}
				if(codeCheck == false){
					tools.alertMessage("验证码错误");
					return false;
				}
			},
			success: function(data){
				if(data.status){
					location.href = "subLogin";
				}else{
					tools.alertMessage("更改错误， 请检查帐号和密码是否正确");
				}
			},
			error: function(error){
				tools.alertMessage("连接服务器错误");
			},
		});

		// 预检验
		var phoneCheck = false;
		$("#phone").blur(function(){
			if($("#phone").val().length == 11){
				$("#phoneWarning").html("");
				phoneCheck = false;
				$.ajax({
					url: "/EXbook/index.php/Home/Index/checkRepeat",
					type: "post",
					data: {
						field: "phone",
						obj: $("#phone").val(),
					},
					dataType: "json",
					success: function(data){
						if(data.status == 1){
							$("#phoneWarning").html("该手机号不存在");
						}else{
							phoneCheck = true;
							$("#phoneWarning").html("");
						}
					},
					error: function(error){
						tools.alertMessage("连接服务器错误")
					}
				});
			}else{
				$("#phoneWarning").html("手机号只能为11位");
			}
		});

		$("#password").blur(function(){
			if($("#password").val().length < 8){
				$("#passwordWarning").html("密码至少8位");
			}else{
				$("#passwordWarning").html("");
			}
		});

		$("#repassword").blur(function(){
			if($("#repassword").val() != $("#password").val()){
				$("#repeatWarning").html("两次密码不相同");
			}else{
				$("#repeatWarning").html("");
			}
		});
	});
})(window);