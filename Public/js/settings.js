;(function(window, undefined){
	var pic = location.search.match(/\bpic=(.*?)(&|$)/);

	if(!pic)
		location.href = "index";

	$("#oldOwnerPic").attr({
		src: pic[1],
	});

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