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
				tools.alertMessage("用户没有登录");
				location.href="subLogin";
			}
		},
		error: function(e){
			tools.alertMessage("连接服务器失败");
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
				delPic: function(picture){
					if(window.confirm("确定要删除图片？")){
						picture.show = false;
						$("#picture" + picture.id).remove();	
					}
				}
			}
		});

		// 图片预览
		$("#picture").change(function(){
			if(this.files.length == 0)
				return;
			try{
				data.pictures.push({
					url: window.URL.createObjectURL(this.files[0]),
					show: true,
					id: data.pictures.length,
				});
			}catch(e){
				var reader = new FileReader();

				reader.onload = function(e){
					data.pictures.push({
						url: e.target.result,
						show: true,
						id: data.pictures.length,
					});
				}
				reader.readAsDataURL(this.files[0])
			}
			$(this).attr({
				id: "picture" + (data.pictures.length - 1),
				name: "picture" + (data.pictures.length - 1),
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
						tools.alertMessage("描述不能为空");
						return false;
					}else if(value.name == "price" && !/^\d+$/.test(value.value)){
						tools.alertMessage("价格不能为空且必须为数字");
						return false;
					}else if(value.name == "tag" && value.value == "请选择"){
						tools.alertMessage("请选择书本分类");
						return false;
					}
				}
				if(data.pictures.length == 0){
					tools.alertMessage("图片不能为空");
					return false;
				}
			},
			success: function(data){
				if(data.status == 1){
					tools.alertMessage("发布成功");
					location.href = "index";
				}else{
					tools.alertMessage("发布失败");
				}
			},
			error: function(e){
				tools.alertMessage("连接服务器错误");
			},
		});
	};	
})(window);