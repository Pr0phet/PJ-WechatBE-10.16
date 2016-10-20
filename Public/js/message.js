$(function(){
//获取个人信息
var UserId;
var personnal="personnal";
$.ajax({
  type:"POST",
  dataType:"json",
  url:"http://localhost/EXbook/index.php/Home/Index/showUser",
  data:{mode:personnal},
  error:function(jqXHR){
    alert("未知错误"+jqXHR.status);
  },

});
//获取登录id
$.ajax({
	type:"GET",
	dataType:"json",
	url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
	success:function(data){
		UserId=data.id;
	},
	error:function(jqXHR){
		alert("未知错误:请重新登录");
		//window.location.href="login.html";
	}
});
//获取页面内容

});