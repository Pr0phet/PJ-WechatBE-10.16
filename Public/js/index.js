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
			books.push.apply(books, datas);
			console.log(books[books.length - 1].id)
		},
		error: function(e){
			tools.alertMessage("连接服务器失败");
		},
	});
})(window);