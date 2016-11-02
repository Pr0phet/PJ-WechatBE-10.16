;(function(window, undefined){
	var id = location.search.match(/\bid=(\d+)/);
	
	if(!id)
		location.href = "index";

	var data = {}
	$.ajax({
		url: "/EXbook/index.php/Home/Index/detailBlock",
		type: "post",
		data: {
			id: id[1],
		},
		dataType: "json",
		success: function(datas){
			data = datas;
			new Vue({
				el: "#information",
				data: data,
			});
		},
		error: function(e){
			tools.alertMessage("访问服务器错误");
		},
	});

	$(".putComment").click(function(){
		$(".leaders").stop().animate({
			bottom: -50,
		}, function(){
			$(this).addClass("writeComment")
			.html("<input type='button' value='发送' class='send'>"+ "<div class='box'>"+
				"<input type='text' class='commentText' placeholder='评论' /></div>")
			.animate({
				bottom: 0,
			}).find(".send").click(function(){
				$.ajax({
					url: "/EXbook/index.php/Home/Index/addComment",
					type: "post",
					data: {
						id: id[1],
						comment: $(".commentText").val(),
					},
					dataType: "json",
					success: function(datas){
						data.comments = data.comments || [],
						data.comments.push({
							owner: datas.owner,
							pic: datas.owner_pic,
							description: datas.content,
							time: datas.time,
						});
					},
					error: function(e){
						tools.alertMessage("连接数据库错误");
					}
				});
			});
		});
	});
})(window);