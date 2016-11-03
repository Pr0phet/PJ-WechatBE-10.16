;(function(window, undefined){
	// 渲染首页
	var data = {
		books: [],
	};

	new Vue({
		el: "#books",
		data: {
			books: data.books,
		},
		methods: {
			showPicture: function(e){
				$(".maximute").find("img")
				.attr("src", e.target.src)
				.end().css("display", "block");
			},
		},
	});

	$(".maximute").click(function(){
		$(this).css("display", "none");
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
				$(".nomore").html("没有更多了");
			}else{
				data.books.push.apply(data.books, datas);	
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
							update: data.books[data.books.length - 1] ? data.books[data.books.length - 1].id : null,
							mode: 0,
						},
						dataType: "json",
						success: function(datas){
							scollStatus = false;
							if(datas.error == "empty"){
								$(".nomore").html("没有更多");
								clearInterval(scollTime);
							}else{
								data.books.push.apply(data.books, datas);
							}
						},
						error: function(e){
							tools.alertMessage("连接服务器失败");
						}
					});
				}
			}
		}, 200);

	// 搜索
	$("#search").click(function(){
		if($("#searchText").val() == "")
			return;
		clearInterval(scollTime)
		$.ajax({
			url: "/EXbook/index.php/Home/Index/showBlocks",
			type: "post",
			data: {
				mode: 0,
				keyword: $("#searchText").val(),
			},
			success: function(datas){
				data.books.splice(0, data.books.length);
				if(datas.error != "empty")
					data.books.push.apply(data.books, datas);
				$(".nomore").html("没有更多");
			}
		});
	})
})(window);