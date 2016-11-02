;(function(window, undefined){
	var id = location.search.match(/\bid=(\d+)/);
	
	if(!id)
		location.href = "index";

	var data = {
		description: "123",
		owner: "coderben",
		owner_pic: "/EXbook/Public/img/touxiang.jpg",
		pic: [{
			url: "/EXbook/Public/img/touxiang.jpg",
		}, {
			url: "/EXbook/Public/img/touxiang.jpg",
		}],
		price: "123",
		time: "1小时前",
		comments: [{
			time: "17:30",
			owner: "lalala",
			description: "tell me why",
			pic: "/EXbook/Public/img/touxiang.jpg",
		}],
	};

	new Vue({
		el: "#information",
		data: data,
	});

	$.ajax({
		url: "/EXbook/index.php/Home/Index/detailBlock",
		type: "post",
		data: {
			id: id[1],
		},
		dataType: "json",
		success: function(datas){
			console.log(datas);
			// data = datas;
		},
		error: function(e){

		},
	});
})(window);