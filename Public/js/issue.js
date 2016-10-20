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
//发布
$(function(){
  $("#CreatNewSu").click(function(){
      if($("#CreatNewDes").val()=="|文字描述"){
         $("#CreatNewDes").val("描述不能为空！");
         $("#CreatNewDes").css('color','red');
         $("#CreatNewDes").focus(function(){
           $("#CreatNewDes").val("");
           $("#CreatNewDes").css('color','#b1b1b1');
         });
         return false;
      }else if($("#CreatNewPri").val()=="|输入价格"){
           $("#CreatNewPri").val("价格不能为空！");
           $("#CreatNewPri").css('color','red');
           $("#CreatNewPri").focus(function(){
           $("#CreatNewPri").val("");
           $("#CreatNewPri").css('color','#b1b1b1');
         }); return false; 
      }else if (images.localId.length==0) {
            failhtml.html("照片不能为空");
            fail.css('display','block');
            return false;
      }else{
           $.ajax({
               type:"POST",
               dataType:"json",
               url:"http://localhost/EXbook/index.php/Home/Index/createBlock",
               data:{
                  description:$("#CreatNewDes").val(),
                  price:$("#CreatNewPri").val(),
                  classf:$("select  option:selected").text(),
                  pic:images.localId,
               },
               success:function(data){
                   if(data.success==07){
                        failhtml.html("新增成功");
                        fail.css('display','block');
                   }else{
                        failhtml.html("未知错误：请重试");
                        fail.css('display','block');
                   };
               },
               error:function(jqXHR){
                        failhtml.html("错误："+jqXHR.status);
                        fail.css('display','block');
               }
           });
      }
  });
});

$(function(){  
      
      wx.config({
      debug: false,
      appId: appId,
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: [
        'chooseImage',
      ]
  });

// 5 图片接口
// 5.1 拍照、本地选图
   window.images.localId=new Array();
   document.querySelector('#chooseImage').onclick = function () {
    wx.chooseImage({
      success: function (res) {
        images.localId = res.localIds;
        for(var i;i<images.localId.length;i++){
          $("#sp-box").append("<img class='upimg' src='"+images.localId[i]+"''>")
        };
      },
      fail:function(res){
        alert("错误");
      }
    });
  };});

