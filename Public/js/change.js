$(function(){
   window.fail=$("#DeleteFai-box");
   window.failhtml=$("#DeleteFai-box > div");
   //点击退出提示框
   fail.click(function(){
     fail.css('display','none');
   });
});

//判断是否登录
$(function(){
  window.UserId;
  $.ajax({
     type:"GET",
     dataType:"json",
     url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
     success:function(data){
        if(data.success!=0){
            UserId=data.id;
        }else{
            failhtml.html("请先登录");
            fail.css('display','block');
            window.location.href="login.html";
            
        };
     },
     error:function(jqXHR){
       //$("body").html("未知错误"+jqXHR.status);
     },

   });
});


/*
 修改密码表单提交
*/
$(function(){
  $("#ChangePaSu").click(function(){
    var ChangePassOld=$("#ChangePassOld").val();
    var ChangeSetNew1=$("#ChangeSetNew1").val();
    var ChangeSetNew2=$("#ChangeSetNew2").val();
        
        if(ChangePassOld=="请输入旧密码"){
          failhtml.html("请输入旧密码");
          fail.css('display','block');
          return false;
        }else if(ChangeSetNew1=="请设置新密码"){
          
          failhtml.html("请设置新密码");
          fail.css('display','block');
          return false;
        }else if(ChangeSetNew1!=ChangeSetNew2){
          failhtml.html("密码不一致");
          fail.css('display','block');
          return false;
        }else{
          $.ajax({
               type:"POST",
               url:"http://localhost/EXbook/index.php/Home/Index/changePass",
               dataType:"json",
               data:{
                  OldPass:$("#ChangePassOld").val(),
                  NewPass:$("#ChangeSetNew1").val()
               },
               success:function(data){
                if(data.success==03){
                    failhtml.html("更改密码成功,2秒后返回");
                    fail.css('display','block');
                    window.setTimeout("window.location.href='myprofile.html'",2000);
                    return false;
                }else if(data.error==01){
                  failhtml.html("您密码有误");
                  fail.css('display','block');
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

/*修改新名称
  无返回值
*/

$(function(){
  $("#NewNameSu").click(function(){
    var NewName=$("#NewName").val();
    if (NewName=="新名称") {
          failhtml.html("请输入新名称");
          fail.css('display','block');
      return false;
    }else{
      $.ajax({
                   type:"POST",
                   url:"http://localhost/EXbook/index.php/Home/Index/changeName",
                   dataType:"json",
                   data:{
                    NewName:$("#NewName").val()
                   },
                   success:function(data){
                     if(data.success==09){
                         failhtml.html("修改名称成功,3秒后返回");
                         fail.css('display','block');
                         window.setTimeout("window.location.href='myprofile.html'",3000);
                     }else if(data.error=="repeat"){
                         failhtml.html("名称重复");
                         fail.css('display','block');
                     }else if (data.error==06) {
                          failhtml.html("发生未知错误，请重试");
                          fail.css('display','block');
                     }
                   },
                   error:function(jqXHR){
                      failhtml.html("提交失败"+jqXHR.status);
                      fail.css('display','block');
                   },
      });
    }
  });
});

