;(function(window, undefined){
	var id = location.search.match(/\bid=(\d+)/);
	
	if(!id)
		location.href = "index";

	$.ajax({
		url: "/EXbook/index.php/Home/Index/detailBlock",
		type: "post",
		data: {
			id: id[1],
		},
		dataType: "json",
		success: function(datas){
			new Vue({
				el: "#information",
				data: datas,
			});
		},
		error: function(e){
			tools.alertMessage("访问服务器错误");
		},
	});
})(window);