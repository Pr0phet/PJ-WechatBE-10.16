//
$(function(){
window.UserId;      

//获取个人信息//判断是否登录
    $.ajax({
     type:"GET",
     dataType:"json",
     url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
     success:function(data){
        if(data!=0){
            UserId=data.id;
            //$("#status").val()= UserId;
        }
     },
     error:function(jqXHR){
     },

   });
//点击搜索
$("#search-button").click(function(){
  $("#SearchResultBox").html("");
  $("#index-body-center").css('display','none');
  $("#SearchResultBox").css('display','block');
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"http://localhost/EXbook/index.php/Home/Index/showBlocks",
		data:{
			keyword:$("#search-text").val()
		},
		success:function(data){

      if (data.error == "empty") 
      {
	    	$("#DeleteFai-box > div").html("抱歉！没有您所要的搜索结果");
            $("#DeleteFai-box").css('display','block');
            $("#DeleteFai-box").click(function(){
            $("#DeleteFai-box").css('display','none');
            $("#index-body-center").css('display','block');
            $("#SearchResultBox").css('display','none');
            });

      }else{
		  console.log(data);
      data.each(function(value, index){
          $("#SearchResultBox").append(
            "<div class='index-content-box'> "+
              "<table cellpadding='0' cellspacing='0'>"+
                "<tr>"+
                  "<td rowspan='6' style='width:60px;'>"+
                    "<div class='index-head-1'><img src='"+value.owner_pic+"'></div>"+
                  "</td>"+    
                "</tr>"+
                "<tr>"+
                  "<td class='index-name-1'>"+value.owner+"</td>"+
                  "<td class='index-money-1'>"+
                    "<img src='/EXbook/Public/photo/PNG/mo.png'>"+value.price+
                  "</td>"+
                "</tr>"+
                "<tr>"+
                  "<td colspan='2' class='index-time-1'>"+value.time+"</td>"+
                "</tr>"+
                "<tr>"+
                  "<td colspan='2'>"+
                    "<div class='index-img-box' id='b"+index+"'>"+
                    "</div>"+
                  "</td>"+
                "</tr>"+
                "<tr>"+
                  "<td colspan='2'>"+
                    "<div class='index-content-1'>"+
                      value.desciption+
                    "</div>"+
                  "</td>"+
                "</tr>"+
                "<tr>"+
                  "<td class='index-more-1'><a href='#' class='more' name='"+value.id+"'>详情</a></td>"+
                  "<td class='index-comment-1'>"+
                     "<div>"+value.commentNum+"</div>"+
                     "<img src='/EXbook/Public/photo/PNG/pl.png'>"+
                  "</td>"+
                "</tr>"+
              "</table>"+
            "</div>");
            for(var j=0;j<value.pic.length;j++){
                $("#b"+index).append("<img class='img-1 img-1-1' src='"+value.pic[j].url+"'>");
              };
          });
      }
            
		},
	    error:function(jqXHR){
	    	$("#DeleteFai-box > div").html("发生错误："+jqXHR.status);
            $("#DeleteFai-box").css('display','block');
            $("#DeleteFai-box").click(function(){
            $("#DeleteFai-box").css('display','none');
            });
	    }
	});

});
//首次加载页面
  getdata(0);
});
//下拉加载
$(function(){
	var flagI=1;
	var WinHeight=$(window).height();//页面可视区域高度
	$(window).scroll(function(){
　　       var scrollTop = $(this).scrollTop();
　　       var scrollHeight = $(document).height();
　　       var windowHeight = $(this).height();
　　       if(scrollTop + windowHeight == scrollHeight){
              flagI++;
              getdata(flagI);        
           }
   });
});



//加载页面
function getdata(flag){
	$.ajax({
	type:"get",
	dataType:"json",
	data:{flag:flag},
	url:"/EXbook/index.php/Home/Index/showBlocks",
	success:function(data){
    console.log(data);
    if(data.error=="empty"){
        $("#DeleteFai-box > div").html("没有啦！");
        $("#DeleteFai-box").css('display','block');
        $("#DeleteFai-box").click(function(){
        $("#DeleteFai-box").css('display','none');});
    }else{
      data.forEach(function(value, index){
       $("#index-body-center").append(
           "<div class='index-content-box'> "+
              "<table cellpadding='0' cellspacing='0'>"+
                "<tr>"+
                  "<td rowspan='6' style='width:60px;'>"+
                    "<div class='index-head-1'><img src='"+value.owner_pic+"'></div>"+
                  "</td>"+    
                "</tr>"+
                "<tr>"+
                  "<td class='index-name-1'>"+value.owner+"</td>"+
                  "<td class='index-money-1'>"+
                    "<img src='/EXbook/Public/photo/PNG/mo.png'>"+value.price+
                  "</td>"+
                "</tr>"+
                "<tr>"+
                  "<td colspan='2' class='index-time-1'>"+value.time+"</td>"+
                "</tr>"+
                "<tr>"+
                  "<td colspan='2'>"+
                    "<div class='index-img-box' id='a"+index+"'>"+
                    "</div>"+
                  "</td>"+
                "</tr>"+
                "<tr>"+
                  "<td colspan='2'>"+
                    "<div class='index-content-1'>"+
                      value.desciption+
                    "</div>"+
                  "</td>"+
                "</tr>"+
                "<tr>"+
                  "<td class='index-more-1'><a href='#' class='more' name='"+value.id+"'>详情</a></td>"+
                  "<td class='index-comment-1'>"+
                     "<div>"+value.commentNum+"</div>"+
                     "<img src='/EXbook/Public/photo/PNG/pl.png'>"+
                  "</td>"+
                "</tr>"+
              "</table>"+
            "</div>");
       for(var j=0;j<value.pic.length;j++){
             $("#a"+index).append("<img class='img-1 img-1-1' src='"+value.pic[j].url+"'>");
          };
    })
    }

	},
    error:function(jqXHR){
        //$("body").html("加载页面失败："+jqXHR.status);
    }
});
}

//点击图片转到发布页面
$(function(){
    $("#IsPicture").click(function(){
        window.location.href="issue.html";
});
});
//转到详情
$(function(){
  $("#index-body-center,#SearchResultBox").delegate(".more", "click", function(){
      var DetailId=$(this).attr('name');
      $.ajax({
        type:"POST",
        dataType:"json",
        url:"/EXbook/index.php/Home/Index/detailBlock",
        data:{id:DetailId},
        success:function(data){
                $("#Index").css('display','none');
                $("#search-box").css('display','none');
                $("#navigation-box").css('display','none');
                $("#BookDetail").css('display','block');
                $("#BookdeBox").append(
        "<div class='book-introduce'>"+
            "<div class='book-head'></div>"+
            "<table class='book-box'>"+
               "<tr>"+
                 "<td><div class='book-name'>"+data.owner+"</div></td>"+
               "</tr>"+
               "<tr>"+
                 "<td><div class='book-time'>"+data.time+"</div></td>"+
               "</tr>"+
            "</table>"+
            "<div class='book-money'>"+
                "<img src='/EXbook/Public/photo/PNG/mo2.png'>"+
                "<p>"+data.price+"</p>"+
            "</div>"+
        "</div>"+
        "<div class='imgtext-title'>图文描述</div>"+
        "<div class='imgtext-img-box' id='ImgBox'>"+
        "</div>"+
        "<div class='imgtext-text'>"+
            data.description+
        "</div>"+
        "<div class='comment-title'>留言</div>"+"<p hidden='hidden'>"+DetailId+"</p>"+
        "<div class='comment-box' id='CommentBox'>"+
        "</div>");

        //加载描述图片
          for(var j=0;j<data.pic.length;j++){
              $("#ImgBox").append("<img src='"+data.pic[j].url+"'>");
            };
         //加载targetid
            window.targetid="chat.html?target="+data.ownerid;
            $("#chathtml").attr('href',targetid);
            console.log($("#chathtml").attr('href'));

        // 加载留言
        if (data.comments.flag == 1)
        {
          // var dataArray = $.makeArray(data.comments);
          for(var i = 0; i < data.comments.times; i++){
            $("#CommentBox").append(
              "<div class='comment'>"+
                  "<div class='comment-head'><img src='"+data.comments[i].pic+"'></div>"+
                  "<table class='comment-table'>"+
                      "<tr>"+
                          "<td><div class='comment-name'>"+data.comments[i].owner+"</div></td>"+
                      "</tr>"+
                      "<tr>"+
                          "<td><div class='comment-content'>"+data.comments[i].description+"</div></td>"+
                      "</tr>"+
                  "</table>"+
                  "<div class='comment-time'>"+data.comments[i].time+"</div>"+
              "</div>"
              );

          };
        }
        

        },
        error:function(jqXHR){
            $("#DeleteFai-box > div").html("发生错误："+jqXHR.status);
            $("#DeleteFai-box").css('display','block');
            $("#DeleteFai-box").click(function(){
            $("#DeleteFai-box").css('display','none');
            });
        }
     
      });
   });
});
//点击black后退;
$(function(){
   $("a[name=black]").click(function(){
      $("#Index").css('display','block');
      $("#search-box").css('display','block');
      $("#navigation-box").css('display','block');
      $("#BookDetail").css('display','none');
      $("#BookdeBox").html("");
   });
});
//我要留言
$(function(){
	$("#choose-box > button").click(function(){
		var postbookid=$("p[hidden=hidden]").html();
	//获取个人信息//判断是否登录
         $.ajax({
          type:"GET",
          dataType:"json",
          url:"/EXbook/index.php/Home/Index/checkSession",
          success:function(data){
             if(data.success!=0){
                 UserId=data.id;
                 $("#choose-box").css('display','none');
                 $("#sent-comment").css('display','block');
                 $("#CommentSu").click(function(){
                     if($("#Comment").val()=="评论"||$("#Comment").val()==" "){
                         $("#Comment").val("评论不能为空");
                         $("#Comment").css('color','red'); 
                         $("#Comment").focus(function(){
                             $("#Comment").val(" ");
                             $("#Comment").css('color','#8a8a8a'); 
                         });       
                     }else{
                         $.ajax({
                             type:"POST",
                             url:"/EXbook/index.php/Home/Index/addComment",
                             dataType:"json",
                             data:{
                                 comment:$("#Comment").val(),
                                 postid:postbookid
                             },
                             success:function(data){
                                $("#CommentBox").append(
                                    "<div class='comment'>"+
                                        "<div class='comment-head'><img src='"+data.head+"'></div>"+
                                        "<table class='comment-table'>"+
                                            "<tr>"+
                                                "<td><div class='comment-name'>"+data.name+"</div></td>"+
                                            "</tr>"+
                                            "<tr>"+
                                                "<td><div class='comment-content'>"+$("#Comment").val()+"</div></td>"+
                                            "</tr>"+
                                        "</table>"+
                                        "<div class='comment-time'>"+data.time+"</div>"+
                                    "</div>"
                                 );
                             },
                          error:function(jqXHR){
                               $("#DeleteFai-box >div").val("发生错误："+jqXHR.status);
                               $("#DeleteFai-box").css('display','block');
                               $("#DeleteFai-box").click(function(){
                               $("#DeleteFai-box").css('display','none');
                     });
                 }
                         });
                     };
                 });
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
	});
});