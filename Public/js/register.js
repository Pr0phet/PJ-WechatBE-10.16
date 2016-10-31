;((window, undefined) => {
	$(() => {
		// 返回前一页
		$("#back").click(() => {
			window.history.back(-1);
		});

		// 验证码获取和检查
		var codeCheck = false,
			sending = false;
		$("#getCode").click(() => {
			if(sending == false){
				if($("#phone").val().length == 11){
					sending = true;
					var times = 60,
						interval = setInterval(() => {
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
						success: (data) => {
							codeCheck = false;
							if(data.status){
								tools.alertMassage("发送成功");
							}else{
								tools.alertMassage("发送失败");
							}
						},
						error: (error) => {
							tools.alertMassage("连接服务器错误");
						},
					});
				}else{
					tools.alertMassage("请输入正确的手机号码");
				}
			}
		});

		var codingCheck = false
		$("#code").blur(() => {
			if(codingCheck == false){
				if(/^\d{4}$/.test($("#code").val())){
					$("#codeWarning").html("");
					codingCheck = true;
					$.ajax({
						url: "/EXbook/index.php/Home/Index/checkCode",
						type: "post",
						data: {
							code: $("#code").val(),
						},
						dataType: "json",
						success: (data) => {
							codingCheck = false;
							if(data.status){
								$("#codeWarning").html("");
							}else{
								$("#codeWarning").html("验证码错误");
							}
						},
						error: (error) => {
							codingCheck = false;
							tools.alertMassage("连接服务器错误");
						}
					});
				}else{
					$("#codeWarning").html("验证码错误");
				}
			}
		});

		$("#register").ajaxForm({
			url: "/Exbook/index.php/Home/Index/register",
			type: "post",
			dataType: "json",
			beforeSubmit: (data) => {
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
					}else if(value.name == "name" && value.value == ""){
						tools.alertMassage("用户名不能为空");
						return false;
					}else if(value.name == "repass" && value.value != $("#password").val()){
						tools.alertMassage("两次密码不相同");
						return false;
					}else if(codeCheck == false){
						tools.alertMassage("验证码错误");
						return false;
					}
				}
			},
			success: (data) => {
				if(data.status){
					location.href = "index.html";
				}else{
					tools.alertMassage("登录错误， 请检查帐号和密码是否正确");
				}
			},
			error: (error) => {
				tools.alertMassage("连接服务器错误");
			},
		});

		// 预检验
		var phoneCheck = false;
		$("#phone").blur(() => {
			if(phoneCheck == false){
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
						success: (data) => {
							phoneCheck = false
							if(data == 1){
								$("#phoneWarning").html("该手机号已存在");
							}else{
								$("#phoneWarning").html("");
							}
						},
						error: (error) => {
							tools.alertMassage("连接服务器错误")
						}
					});
				}else{
					$("#phoneWarning").html("手机号只能为11位");
				}
			}
		});

		$("#username").blur(() => {
			if($("#username").val() == ""){
				$("#usernameWarning").html("用户名不能为空");
			}else{
				$("#usernameWarning").html("");
			}
		});

		$("#password").blur(() => {
			if($("#password").val().length < 8){
				$("#passwordWarning").html("密码至少8位");
			}else{
				$("#passwordWarning").html("");
			}
		});

		$("#repassword").blur(() => {
			if($("#repassword").val() != $("#password").val()){
				$("#repeatWarning").html("两次密码不相同");
			}else{
				$("#repeatWarning").html("");
			}
		});
	});
})(window);