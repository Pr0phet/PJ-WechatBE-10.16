;(function(window, undefined){
	$(function(){
		// 验证码获取和检查
		var codeCheck = false,
			sending = false;
		$("#getCode").click(function(){
			if(codeCheck == false && sending == false){
				if($("#phone").val().length == 11){
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
							if(data.status == 1){
								tools.warning("发送成功");
								$("#codeWarning").html("");
								$("#code")[0].focus();
							}else{
								tools.alertMassage("发送失败");
							}
						},
						error: function(e){
							tools.alertMassage("连接服务器错误");
						}
					})
				}else{
					tools.warning("请输入正确的手机号码", "phoneWarning");
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
						tools.alertMassage("连接服务器错误");
					}
				});
			}else{
				$("#codeWarning").html("验证码错误");
			}
		});

		// 提交注册
		$("#register").ajaxForm({
			url: "/EXbook/index.php/Home/Index/register",
			type: "post",
			dataType: "json",
			beforeSubmit: function(data){
				var password, repeatPassword;
				for(var i = 0; i < data.length; i++){
					if(data[i].name == "phone"){
						if(data[i].value == ""){
							return tools.warning("手机号不能为空", "phoneWarning");
						}else if(data[i].value.length != 11){
							return tools.warning("手机号只能为11位", "phoneWarning");
						}
					}else if(data[i].name == "pass"){
						password = data[i].value;
						if(data[i].value == ""){
							return tools.warning("密码不能为空", "passwordWarning");
						}else if(data[i].value.length < 8){
							return tools.warning("密码至少为8位", "passwordWarning");
						}
					}else if(data[i].name == "name" && data[i].value == ""){
						return tools.warning("用户名不能为空", "usernameWarning");
					}else if(data[i].name == "repass"){
						repeatPassword = data[i].value;
					}
				}
				if(!password || !repeatPassword || password != repeatPassword){
					return tools.warning("两次密码不相同", "repeatWarning");
				}else if(codeCheck == false){
					return tools.warning("验证码错误", "codeWarning");
				}
			},
			success: function(data){
				if(data.status == 1){
					tools.alertMassage("注册成功");
					location.href = "index";
				}else{
					tools.alertMassage("注册失败， 请检查帐号和密码是否正确");
				}
			},
			error: function(error){
				tools.alertMassage("连接服务器错误");
			},
		});

		// 预检验
		var phoneCheck = false
		$("#phone").blur(function(){
			if(phoneCheck == true)
				return;
			if($("#phone").val().length == 11){
				$("#phoneWarning").html("");
				phoneCheck = true;
				$.ajax({
					url: "/EXbook/index.php/Home/Index/checkRepeat",
					type: "post",
					data: {
						field: "phone",
						obj: $("#phone").val(),
					},
					dataType: "json",
					success: function(data){
						if(data.status == 0){
							$("#phoneWarning").html("该手机号已存在");
						}else{
							$("#phoneWarning").html("");
						}
					},
					error: function(error){
						phoneCheck = false;
						tools.alertMassage("连接服务器错误");
					}
				});
			}else if($("#phone").val() == ""){
				$("#phoneWarning").html("手机号不能为空");
			}else{
				$("#phoneWarning").html("手机号只能为11位");
			}
		});

		var usernameCheck = false;
		$("#username").blur(function(){
			if(usernameCheck == true)
				return;
			if($("#username").val() == ""){
				$("#usernameWarning").html("用户名不能为空");
			}else{
				$("#usernameWarning").html("");
				usernameCheck = true;
				$.ajax({
					url: "/EXbook/index.php/Home/Index/checkRepeat",
					type: "post",
					data: {
						field: "name",
						obj: $("#useraname").val(),
					},
					dataType: "json",
					success: function(data){
						usernameCheck = false;
						if(data.status == 0){
							$("#phoneWarning").html("该用户名已存在");
						}else{
							$("#phoneWarning").html("");
						}
					},
					error: function(error){
						usernameCheck = false;
						tools.alertMassage("连接服务器错误");
					}
				});
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