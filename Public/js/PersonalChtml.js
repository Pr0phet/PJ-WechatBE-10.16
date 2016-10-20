//
$(function(){
window.UserId;      

//获取个人信息//判断是否登录
    $.ajax({
     type:"GET",
     dataType:"json",
     url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
     success:function(data){
        if(data.success!=0){
            UserId=data.id;
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
//定义全局变量
$(function(){
window.fail=$("#DeleteFai-box");
});
//获取个人信息
$.ajax({
    type:"GET",
    dataType:"json",
    url:"http://localhost/EXbook/index.php/Home/Index/showUser",
    success:function(data){
        var PeCeIsNun=$("#PeCeIsNu").html(data.number);//发布的数字
        var PeCeMyName=$("#PeCeMyName").html(data.owner);//获取名字
        var ownerpic = data.pic;
        $("#PeCeHead > img").attr('src',ownerpic);//加头像图片地址
    },
    error:function(jqXHR){}
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
//

//加载页面
function getdata(flag){
 $.ajax({
  type:"POST",
  dataType:"json",
  url:"http://localhost/EXbook/index.php/Home/Index/showBlocks",
  data:{mode:"personal",
        flag:flag},
  success:function(data){
    console.log(data);
    if (data.error != "empty") {
            data.forEach((value, index) =>{
              $("#PeCeBox").append(
                               "<div class='is-bg' id='"+value.id+"'>"+
                                     "<div class='is-pic' id='a"+index+"'></div>"+
                                     "<div class='is-ri-box'>"+
                                          "<div class='is-pri'>"+
                                              "<img src='/EXbook/Public/photo/PNG/mo.png'>"+
                                              "<div>"+value.price+"</div>"+
                                          "</div>"+
                                          "<button class='is-bu-rent' name='"+value.id+"'>已出租请点击</button>"+
                                     "</div>"+
                                     "<div class='is-content'>    "+value.desciption+"</div>"+
                                           "<div class='is-bo-box'>"+
                                             "<div class='is-time'>"+value.time+"</div>"+
                                             "<button class='is-bu-delete' name='"+value.id+"'>删除</button>"+
                                             "<div class='is-me'>"+
                                                   "<img src='/EXbook/Public/photo/PNG/pl.png'>"+
                                                   "<div class='is-me-nu'>"+value.commentNum+"</div>"+   
                                               "</div>"+
                                               "<a href='#' class='more' name='"+value.id+"'>详情</a>"+
                                                  "</div>"+
                                  "</div>"+
                                 "</div>");
             for(var j=0;j<value.pic.length;j++){
              $("#a"+index).append("<img class='img-1 img-1-1' src='"+value.pic[j].url+"'>");
                };
              });
            }
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
   $(".more").click(function(){
      var DetailId=$(this).attr('name');
      $.ajax({
        type:"POST",
        dataType:"json",
        url:"http://localhost/EXbook/index.php/Home/Index/detailBlock",
        data:{DetailId:DetailId},
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
                                     "<img src='photo/PNG/mo2.png'>"+
                                     "<p>"+data.price+"</p>"+
                                 "</div>"+
                             "</div>"+
                             "<div class='imgtext-title'>图文描述</div>"+
                             "<div class='imgtext-img-box' id='ImgBox'>"+
                                 "<div></div>"+
                                 "<div></div>"+
                             "</div>"+
                             "<div class='imgtext-text'>"+
                                data.description+
                             "</div>"+
                             "<div class='comment-title'>留言</div>"+"<p hidden='hidden'>"+DetailId+"</p>"+
                             "<div class='comment-box' id='CommentBox'></div>");
        //加载targetid
        window.targetid="chat.html?target="+data.ownerid;
        $("#chathtml").attr('href',targetid);
        //加载描述图片
        data.forEach((value,index) => {
        for(var j=0;j<value.pic.length;j++){
            $("#ImgBox").appen("<img src='"+value.pic[j].url+"'>")
          };
           //加载留言
          $("#CommentBox").append(
            "<div class='comment'>"+
                "<div class='comment-head'><img src='"+value.owner_pic+"'></div>"+
                "<table class='comment-table'>"+
                    "<tr>"+
                        "<td><div class='comment-name'>"+value.owner+"</div></td>"+
                    "</tr>"+
                    "<tr>"+
                        "<td><div class='comment-content'>"+value.desciption+"</div></td>"+
                    "</tr>"+
                "</table>"+
                "<div class='comment-time'>"+value.time+"</div>"+
            "</div>"
            );

        });
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
      $("#Person").css('display','block');
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
          url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
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
                             url:"http://localhost/EXbook/index.php/Home/Index/addComment",
                             dataType:"json",
                             data:{
                                 comment:$("#Comment").val(),
                                 postid:postbookid,
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
                                        "<div class='comment-time'>"+data.name+"</div>"+
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
//注销操作
$(function(){
$("a[name='PcCannal']").click(function(){
  if(confirm('您确定要注销吗?')){
    $.ajax({
      type:"POST",
      dataType:"json",
      url:"http://localhost/EXbook/index.php/Home/Index/logout",
      success:function(data){
              if(data.success==04){
                alert("注销成功");
                window.location.href="login.html";
              }
      },
      error:function(jqXHR){
        fail.css('display','block');
      }
    });
  };
});
});
//提示操作
$(function(){

//退出未知错误提示
    $("#DeleteFai-box").click(function(){
           $("#DeleteFai-box").css('display','none');
            });
//取消删除
    $("#DeBlockCannel").click(function(){
          $("#de-box").css('display','none');
       });
//退出成功出租提示
    $("#su-box").click(function(){
      $("#su-box").css('display','none');
    })
//退出成功删除提示
    $("#con-box").click(function(){
      $("#con-box").css('display','none');
    })
});
//出租点击
$(function(){
  $("#PeCeBox").delegate('.is-bu-rent', 'click', function() {
     var BookChunkId=$(this).attr('name');
     $.ajax({
      type:"POST",
      url:"http://localhost/EXbook/index.php/Home/Index/rentOut",
      dataType:"json",
      data:{BookChunkId:BookChunkId},
      success:function(data){
        if(data.success==06){
          $(this).html("已出租");
          $("#su-box").css('display','block');
        }else if(data.error==06){
          $("#DeleteFai-box").css('display','block');
              
        }
      },
        error:function(jqXHR){
             alert(BookChunkId);
              $("#de-box").css('display','none');
              $("#DeleteFai-box").css('display','block');
        },
     });  
   });
//点击删除
$("#PeCeBox").delegate('.is-bu-delete', 'click', function() {
        var BookChunkId=$(this).attr('name');
       $("#de-box").css('display','block');
       $("#DeBlockConfirm").click(function(){
           $.ajax({
            type:"POST",
            url:"http://localhost/EXbook/index.php/Home/Index/deleteBlock",
            dataType:"json",
            data:{BookChunkId:BookChunkId},
            success:function(data){
              if(data.success==05){
                  $("#con-box").click(function(){
                        $("#"+BookChunkId).remove();
                  });
                  $("#con-box").css('display','block');
              }else if(data.error==06){
                $("#DeleteFai-box").css('display','block');

              }
            },
            error:function(jqXHR){
              $("#DeleteFai-box").css('display','block');
            }
        });
       });
});
});
