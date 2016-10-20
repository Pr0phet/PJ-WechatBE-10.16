//定义全局变量
$(function(){
   window.fail=$("#DeleteFai-box");
   window.failhtml=$("#DeleteFai-box > div");
   //点击退出提示框
   fail.click(function(){
     fail.css('display','none');
   });
   //验证码
   $("#Code").focus(function(){
                $("#Code").val("");
                $("#Code").css('color','#ffffff');
                                        });
   //用户名
   $("#username").focus(function(){
                $("#username").val("");
                $("#username").css('color','#ffffff');
                                        });
   //手机号码
   $("#userphone").focus(function(){
                $("#userphone").val("");
                $("#userphone").css('color','#ffffff');
                                        });
   //输入密码
   $("#userPassword1").focus(function(){
                $("#userPassword1").val("");
                $("#userPassword1").css('color','#ffffff');
                                        });
   //密码不一致
   $("#userPassword2").focus(function(){
                $("#userPassword2").val("");
                $("#userPassword2").css('color','#ffffff');
                                        });
}); 



/*发送验证码
  URL未填写
*/
$(function(){
      var sleep = 60;
      var interval = null;
      var btn=$("#re-bu");
      $("#re-bu").click(function(){
          if($("#userphone").val()=="请输入手机号码"){
             failhtml.html("请先输入手机号码");
             fail.css('display','block');
          }else if(!interval){
                btn.css('backgroundColor','rgb(243, 182, 182)');
                btn.attr('disabled','disabled');
                btn.css('cursor','wait');
                btn.val( "重新发送" + sleep--);
                interval = setInterval (function ()
                {
                    if (sleep == 0)
                    {
                        if (!!interval)
                        {
                            clearInterval (interval);
                            interval = null;
                            sleep = 60;
                            btn.css('cursor','pointer');
                            btn.removeAttr("disabled");
                            btn.val( "获取验证码");
                            btn.css('backgroundColor','');
                        }
                        return false;
                    }
                    btn.val("重新发送" + sleep--);
                }, 1000);

                $.ajax({
                   type:"POST",
                   dataType:"json",
                   url:"http://localhost/EXbook/index.php/Home/Index/sendSMS",
                   data:{phone:$("#userphone").val()},
                   success:function(data){
                        $("#Code").blur(function(){
                           $.ajax({
                                type:"POST",
                                dataType:"json",
                                url:"http://localhost/EXbook/index.php/Home/Index/checkCode",
                                data:{code:$("#Code").val()},
                                success:function(data){
                                     if(data.error==08){//验证码错误号码未确定
                                        $("#Code").val("验证码错误");
                                        $("#Code").css('color','red');
                                     };
                                },
                                error:function(jqXHR){
                                        $("#Code").val("验证码失败："+jqXHR.status);
                                        $("#Code").css('color','red');
                                }
                           });
                        });
                   },
                   error:function(jqXHR){
                            $("#Code").val("发送验证码失败："+jqXHR.status);
                            $("#Code").css('color','red');
                   }
                });
             
          }
      });
   }); 

/*注册页面*/
/*注册表单提交 
  URL未填写*/
$(function(){
  var RS=$("#RegisterSu").click(function(){
    var userName=$("#username").val();
    var userPhone=$("#userphone").val();
    var Code=$("#Code").val();
    var userPassword1=$("#userPassword1").val();
    var userPassword2=$("#userPassword2").val();

    if(userName=="用户名称"||userName=="用户名称不能为空"){
      $("#username").val("用户名称不能为空");
      $("#username").css('color','red');
      return false;
    }else if(userPhone=="请输入手机号码"||userPhone=="手机号码不能为空"){
      $("#userphone").val("手机号码不能为空");
      $("#userphone").css('color','red');
      return false;
    }else if(Code=="请输入短信验证码"||Code=="请输入验证码"){
      $("#Code").val("请输入验证码");
      $("#Code").css('color','red');
      return false;
    }else if(userPassword1=="请输入密码"||userPassword1=="密码不能为空"){
      $("#userPassword1").val("密码不能为空");
      $("#userPassword1").css('color','red');
      return false;
    }else if(userPassword1!=userPassword2||userPassword2=="密码不一致"){
      $("#userPassword2").val("密码不一致");
      $("#userPassword2").css('color','red');
      return false;
    }else{
      $.ajax({
        type:"POST",
        url:"http://localhost/EXbook/index.php/Home/Index/register",
        dataType:"json",
        data:{
          userName:$("#username").val(),
          userPhone:$("#userphone").val(),
          userPassword:$("#userPassword1").val()
        },
        success:function(data){
          if(data.success==01){
            failhtml.html("注册成功");
            fail.css('display','block');
            window.location.href="login.html";
            return false;
          }else if(data.error==02){
            failhtml.html("失败请重新注册");
            fail.css('display','block');
            window.location.href="register.html";
            return false;

          }
        },
        error:function(jqXHR){
          failhtml.html("提交失败:"+jqXHR.status);
          fail.css('display','block');
        }
      });
    }
  });
});




//登录
$(function(){
    
    $("#LoginSu").click(function(){
    	var LoginPhone=$("#LoginPhone").val();
    	var LoginPass=$("#LoginPass").val();
        if(LoginPhone=="请输入手机号码"){
          failhtml.html("请输入手机号码");
          fail.css('display','block');

        	return false;
        }else if(LoginPass=="请输入密码"){
          failhtml.html("请输入密码");
          fail.css('display','block');
        }else{
        $.ajax({
    		type:'POST',
    		url:"http://localhost/EXbook/index.php/Home/Index/login",
    		dataType:'json',
    		data:{
    			   phone:$("#LoginPhone").val(),
    			   pass:$("#LoginPass").val()
    		},
    		success:function(data){
                if(data.error==00){
                	failhtml.html("账号不存在");
                  fail.css('display','block');
                }
                else if (data.error==01) {
                	failhtml.html("密码错误");
                  fail.css('display','block');
                }else if(data.success==00){
                	failhtml.html("登录成功");
                  fail.css('display','block');
                	window.location.href="index.html";
                }    		
            },
        error:function(jqXHR){
			         failhtml.html("未知错误"+jqXHR.status);
               fail.css('display','block');
            },
    	});
       }
    });
});





/*忘记密码
  表单提交
  URL未填写*/
$(function(){
	$("#ForgetPassSu").click(function(){
		var userphone=$("#userphone").val();
		var Code=$("#Code").val();
		var SetNewPass1=$("#SetNewPass1").val();
		var SetNewPass2=$("#SetNewPass2").val();
		
		if (userphone=="请输入手机号码") {
          failhtml.html("请输入手机号码");
          fail.css('display','block');
			    return false;
		}else if(Code=="请输入短信验证码"||Code=="请输入验证码"){
           $("#Code").val("请输入验证码");
           $("#Code").css('color','red');
           return false;
    }else if(SetNewPass1=="请设置新密码"){
          failhtml.html("请输入密码");
          fail.css('display','block');
			   return false;
		}else if(SetNewPass1!=SetNewPass2){
      failhtml.html("密码不一致");
      fail.css('display','block');
			return false;
		}else{
			$.ajax({
				type:"POST",
				url:"http://localhost/EXbook/index.php/Home/Index/forgetPass",
				dataType:"json",
				data:{
					ForgetPhone:$("#userphone").val(),
					newPass:$("#SetNewPass1").val()
				},
				success:function(data){
                    if(data.error==06){
                    	failhtml.html("未知错误：请重试");
                      fail.css('display','block');
                    	window.location.href="forgetpw.html";
                    	return false;
                    }else if(data.success==03){
                    	failhtml.html("修改密码成功");
                      fail.css('display','block');
                    	window.location.href="login.html";
                    }
				},
				error:function(jqXHR){
					failhtml.html("提交失败："+jqXHR.status);
          fail.css('display','block');
				}
			});
		}
	});
});

