;(function(window, undefined){
	$("#changePassword").submit(function(){
		if($("#password").val().length < 8){
			alert("密码至少8位");
		}else if($("#password").val() != $("#repeatPassword").val()){
			alert("两次密码不相同");
		}else{
			$.ajax({
				url: "/EXbook/index.php/Home/Index/forgetPass",
				type: "post",
				data: {
					pass: $("#password").val(),
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
})(window);