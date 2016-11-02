;(function(window, undefined){
	// 渲染首页
	var books = [];

	new Vue({
		el: "#books",
		data: {
			books: books,
		},
	});


	$.ajax({
		url: "/EXbook/index.php/Home/Index/showBlocks",
		type: "post",
		data: {
			mode: 0,
		},
		dataType: "json",
		success: function(datas){
			if(datas.error == "empty"){
				$(".nomore").html("没有更多");
			}else{
				console.log(datas);
				// books.push.apply(books, datas);	
			}
		},
		error: function(e){
			tools.alertMessage("连接服务器失败");
		},
	});

	// 滑动添加
	var scollStatus = false,
		scollTime = window.setInterval(function(){
			if(scollStatus == false){
				if($("#index").height() + $("#viewbox").offset().top
					< 1.5 * document.body.clientHeight){
					scollStatus = true;
					$.ajax({
						url: "/EXbook/index.php/Home/Index/showBlocks",
						type: "post",
						data: {
							update: books[books.length - 1] ? books[books.length - 1].id : null,
							mode: 0,
						},
						dataType: "json",
						success: function(datas){
							scollStatus = false;
							if(datas.error == "empty"){
								$(".nomore").html("没有更多");
								clearInterval(scollTime);
							}else{
								books.push.apply(books, datas);
							}
						},
						error: function(e){
							tools.alertMessage("连接服务器失败");
						}
					});
				}
			}
		}, 200);
})(window);