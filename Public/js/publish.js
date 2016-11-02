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
			pictures: []
		};

		new Vue({
			el: "#publish",
			data: data,
		});

		// 图片预览
		$("#picture").change(function(){
			if(this.files.length == 0)
				return;
			try{
				for(var i = 0; i < this.files.length; i++){
					data.pictures.push(window.URL.createObjectURL(this.files[i]));
				}
			}catch(e){
				var reader = new FileReader(),
					files = this.files,
					i = 0;
				reader.onload = function(e){
					data.pictures.push(e.target.result);
				}
				reader.onloadend = function(e){
					if(i < files.length){
						try{
							reader.readAsDataURL(files[++i]);
						}catch(e){
							console.log(e);
						}				
					}
				}
				reader.readAsDataURL(files[i]);
			}
			$("#picture").id += data.pictures.length;
			$("#file").append('<input type="file" accept="image/*" multiple="true" id="picture"/>');
		});

		// 发布
		$("#publish").submit(function(){
			
		})

		$("#publish").ajaxForm({
			url: "/EXbook/index.php/Home/Index/createBlock",
			type: "post",
			dataType: "json",
			mimeType: "multipart/form-data",
			beforeSubmit: function(datas){
				for(var value of datas){
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
				console.log(data);
				if(data.status == 1){
					tools.alertMassage("发布成功");
				}else{
					tools.alertMassage("发布失败");
				}
			},
		});
	};	
})(window);