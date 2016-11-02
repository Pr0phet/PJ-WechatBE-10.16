;(function(window, undefined){
	var id = location.search.match(/\bid=(\d+)/);
	
	if(!id)
		location.href = "index";

	var data = {};

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