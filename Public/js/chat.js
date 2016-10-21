//获取目标id

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}


$(function(){
     window.targetid=GetQueryString("target");
    $.ajax({
      type:"POST",
      dataType:"json",
      url:"/EXbook/index.php/Home/Index/getName",
      data:{id:targetid},//目标id
      success:function(data){
           $("#targetName").html(data);//目标姓名
      },
      error:function(jqXHR) {
      }
    });
});



//判断是否登录
$(function(){
  window.token;
  window.username;
  window.userid;
  window.userhead;
$.ajax({
          type:"POST",
          dataType:"json",
          url:"/EXbook/index.php/Home/Rong/check",
          success:function(data){
             if(data!=0){
                  token=data.token;//得到用户token
                  userid=data.id;//用户id
                  userhead=data.pic;//得到用户照片
                  username=data.name;//用户名称
                  RongIMClient.init("x18ywvqf8wznc");
    // 初始化
    RongIMClient.connect(token, {
        onSuccess: function(userId) {
          console.log("Login successfully." + userId);
        },
        onTokenIncorrect: function() {
          console.log('token无效');
        },
        onError:function(errorCode){
              var info = '';
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  info = '超时';
                  break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                  info = '未知错误';
                  break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                  info = '不可接受的协议版本';
                  break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                  info = 'appkey不正确';
                  break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                  info = '服务器不可用';
                  break;
              }
              console.log(errorCode);
            }
      });
// 设置连接监听状态 （ status 标识当前连接状态）
 // 连接状态监听器
 RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
        switch (status) {
            //链接成功
            case RongIMLib.ConnectionStatus.CONNECTED:
                console.log('链接成功');
                break;
            //正在链接
            case RongIMLib.ConnectionStatus.CONNECTING:
                console.log('正在链接');
                break;
            //重新链接
            case RongIMLib.ConnectionStatus.DISCONNECTED:
                console.log('断开连接');
                break;
            //其他设备登录
            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                console.log('其他设备登录');
                break;
              //网络不可用
            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
              console.log('网络不可用');
              break;
            }
    }});
             }else{
                  if(confirm("请先登录")){
                     window.location.href="login.html";
                  }
              };
//发送信息

 $("#SentMsg").click(function(){
     if($("#MyMsg").val()=="我想说"){
       failhtml.html("消息不能为空");
             fail.css('display','block');
     }else{

      // 定义消息类型,文字消息使用 RongIMLib.TextMessage
      // var msg = new RongIMLib.TextMessage({content:"hello",extra:"附加信息"});
      /*content里是 传送的消息user:{id:"userId",name:"名称",portraitUri:"头像"}*/
       var msg = new RongIMLib.TextMessage({content:$("#MyMsg").val(),user:{id:userid,name:username,portraitUri:userhead}});
       var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
       var targetId = targetid; // 目标 Id
       RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                // 发送消息成功
                onSuccess: function (message) {
                  $("#chatbox").append(
                                  "<div class='mychat'>"+
                                     " <div class='ChatmyHead'><img src='"+userhead+"'></div>"+
                                     " <div class='Mysentmsg'>"+
                                        "<div class='tria1'></div>"+
                                        "<div class='rect1'>"+$("#MyMsg").val()+"</div>"+
                                      "</div>"+
                                  "</div>");
                  $("#MyMsg").val('我想说');
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    console.log("Send successfully");
                },
                onError: function (errorCode,message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        default :
                            info = x;
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            }
        );

     };
  });
   // 消息监听器
 RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
        // 判断消息类型
        switch(message.messageType){
            case RongIMClient.MessageType.TextMessage:
                 $("#chatbox").append(
                           "<div class='otherchat'>"+
                              "<div class='othermyHead'><img src='"+message.content.user.portraitUri+"'></div>"+
                              "<div class='othersentmsg'>"+
                                "<div class='tria2'></div>"+
                                "<div class='rect2'>"+message.content.content+"</div>"+
                              "</div>"+
                         " </div>");
                  $("#targetName").html(message.content.user.name);
                   // 发送的消息内容将会被打印
                break;
            default:
                // 自定义消息
                // do something...
        }
    }
});



          },
          error:function(jqXHR){
            console.log(1);
            window.token="73Q0DFIR60PMU9Sg+xcSu7XGo5hHg+2GTxRIdXhPCHD8/lnYhK82MTIUgW+x7upKqQTEjdfUH391Mwx2wkZJRw==";
             //$("body").html("未知错误"+jqXHR.status);
           },
        });
});

//定义全局
 $(function(){
  window.fail=$("#DeleteFai-box");
  window.failhtml=$("#DeleteFai-box > div");
  fail.click(function() {
    fail.css('display','none');
  });
 });



