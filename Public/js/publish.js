;(function(window, undefined){
	// 检查登录状态
	$.ajax({
		url: "/EXbook/index.php/Home/Index/checkSession",
		type: "post",
		dataType: "json",
		success: function(data){
			if(data.status == 1){
				start();
			}else{
				location.href="subLogin";
			}
		},
		error: function(e){
			tools.alertMassage("连接服务器失败");
		}
	});

	// 任务开始
	var start = function(){
		var data = {
			pictures: [],
			delPicture: [],
		};

		new Vue({
			el: "#publish",
			data: data,
			methods: {
				delPic: function(index){
					data.delPicture[index] = true;
					$("#picture" + (index + 1)).remove();
				}
			}
		});

		// 图片预览
		$("#picture").change(function(){
			if(this.files.length == 0)
				return;
			try{
				data.pictures.push(window.URL.createObjectURL(this.files[0]));
			}catch(e){
				var reader = new FileReader();

				reader.onload = function(e){
					data.pictures.push(e.target.result);
				}
				reader.readAsDataURL(this.files[0])
			}
			$(this).attr({
				id: "picture" + data.pictures.length,
				name: "picture" + data.pictures.length,
			});
			$("#file").append('<input type="file" accept="image/*" id="picture"/>')
			.find("#picture").change(arguments.callee);
			$("#picsTemplate").css("display", "block");
		});

		// 发布
		$("#publish").ajaxForm({
			url: "/EXbook/index.php/Home/Index/createBlock",
			type: "post",
			dataType: "json",
			beforeSubmit: function(datas){
				for(var index in datas){
					var value = datas[index];
					if(value.name == "description" && value.value == ""){
						tools.alertMassage("描述不能为空");
						return false;
					}else if(value.name == "price" && !/^\d+$/.test(value.value)){
						tools.alertMassage("价格不能为空且必须为数字");
						return false;
					}else if(value.name == "tag" && value.value == "请选择"){
						tools.alertMassage("请选择书本分类");
						return false;
					}
				}
				if(data.pictures.length == 0){
					tools.alertMassage("图片不能为空");
					return false;
				}
			},
			success: function(data){
				if(data.status == 1){
					tools.alertMassage("发布成功");
					location.href = "index";
				}else{
					tools.alertMassage("发布失败");
				}
			},
			error: function(e){
				tools.alertMassage("连接服务器错误");
			},
		});
	};	
})(window);