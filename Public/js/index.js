;(function(window, undefined){
	// 渲染首页
	var books = [{
		price: "5",
		owner: "coderben",
		time: "1 minute ago",
		desciption: "123",
		commentNum: "5",
		owner_pic: "/EXbook/Public/img/touxiang.jpg"
	}];

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
			console.log(datas);
			books.push.apply(books, datas);
		},
		error: function(e){
			tools.alertMessage("连接服务器失败");
		},
	});
})(window);