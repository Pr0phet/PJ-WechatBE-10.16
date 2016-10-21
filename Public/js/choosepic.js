
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
     url:"/EXbook/index.php/Home/Index/checkSession",
     success:function(data){
        if(data!=0){
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
  window.a=0;
});

//判断图片大小
$(document).ready(function () {
        window.files = $("#chooseImage").prop('files');//获取到文件列表
        $("#chooseImage").change(function () {
                var filepath = $("#chooseImage").val();
                var extStart = filepath.lastIndexOf(".");
                var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                var file_size = 0;
                    file_size = this.files[0].size;
                var size = file_size / 1024;
                if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                      failhtml.html("图片格式错误");
                      fail.css('display','block');
                    return false;
                } else if (size > 3072) {
                      failhtml.html("图片大小不能超过3M！");
                      fail.css('display','block');
                      return false;
                               } 
                  else if(files.length > 9){
                      failhtml.html("最多选择9张");
                      fail.css('display','block');
                    }
                  else{
                       setImagePreviews();
                     }
                return true;
            });
        });

//下面用于多图片上传预览功能
    function setImagePreviews(avalue) {
        var docObj = document.getElementById("chooseImage");
        var dd = document.getElementById("imageformbox");
        dd.innerHTML = "";
        a++;
        var fileList = docObj.files;
        for (var i = 0; i < fileList.length; i++) {            

            dd.innerHTML ="<div style='float:left'> <img id='img" + i + "' class='imgb'/> </div>";
            var imgObjPreview = document.getElementById("img"+i); 
            if (docObj.files && docObj.files[i]) {
                //火狐下，直接设img属性
                imgObjPreview.style.display = 'block';
                imgObjPreview.style.width = '70px';
                imgObjPreview.style.height = '70px';
                imgObjPreview.style.marginBottom='10px';
                imgObjPreview.style.marginRight='5px';
                //imgObjPreview.src = docObj.files[0].getAsDataURL();
                //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
            }
            else {
                //IE下，使用滤镜
                docObj.select();
                var imgSrc = document.selection.createRange().text;
                alert(imgSrc)
                var localImagId = document.getElementById("img" + i);
                //必须设置初始大小
                localImagId.style.width = "70px";
                localImagId.style.height = "70px";
                imgObjPreview.style.marginBottom='10px';
                imgObjPreview.style.marginRight='5px';
                //图片异常的捕捉，防止用户修改后缀来伪造图片
                try {
                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                }
                catch (e) {
                    alert("您上传的图片格式不正确，请重新选择!");
                    return false;
                }
                imgObjPreview.style.display = 'none';
                document.selection.empty();
            }
        } 

        return true;
    }


//发布

$(function(){
$("#cp-button").click(function() {
    var options={   
               beforeSubmit:  showRequest, 
               success:       showResponse, 
               resetForm: true, 
               type:'post',
               dataType:  'json' }
        if(a==0){
                failhtml.html('请选择照片！');
                fail.css('display','block');
                return false;
          }else{
            $("#IsForm").ajaxSubmit(options); 
        }
});
  });
  
  function showRequest(formData, jqForm, options){
            $("#DeleteFai-box1 > div").html('正在提交！');
            $("#DeleteFai-box1").css('display','block');
            return true;
  };
  function showResponse(responseText, statusText)  { 
            $("#DeleteFai-box1 > div").html('提交成功！');
            $("#DeleteFai-box1").click(function(){
               css('display','none');
            });
            window.location="myprofile.html";
            return true;
  }
