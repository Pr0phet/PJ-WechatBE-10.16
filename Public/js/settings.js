;(function(window, undefined){
	$("#touxiang").change(function(){
		console.log(this);
		$("#boxs").ajaxSubmit({
			url: "/EXbook/index.php/Home/Index/changePic",
			type: "post",
			dataType: "json",
			mimeType: "multipart/form-data",
			success: function(data){
				console.log(data);
				if(data.status == 1){
					location = location;
				}
			}, 
			error: function(e){
				alert("连接服务器失败");
			},
		});
	});
})(window);