//判断是否登录 获取id
$(function(){
    var UserId;
    $.ajax({
     type:"GET",
     dataType:"json",
     url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
     success:function(data){
        if(data.success!=0){
            $("#userId").var = data.id;
        }else{
            if(confirm("请先登录")){
                window.location.href="login.html";
            }
        };
     },
     error:function(jqXHR){
       //$("body").html("未知错误"+jqXHR.status);
     },

   });

//获取信息
  $.ajax({
       type:"POST",
       dataType:"json",
       url:"http://localhost/EXbook/index.php/Home/Index/showUser",
       data:{id:$("#userId").var},
       success:function(data){
       	   $("#mp-head-img").append("<img src='"+data.pic+"'>");
       	   $(".mp-p3").html(data.owner);
       },
       error:function(jqXHR){
             $("body").html("未知错误"+jqXHR.status);
       }
	});
});