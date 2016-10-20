//判断是否登录
$(function(){
  window.ltoken;
  window.username;
  window.userid;
  window.userhead;
$.ajax({
          type:"GET",
          dataType:"json",
          url:"http://localhost/EXbook/index.php/Home/Index/checkSession",
          success:function(data){
             if(data.success!=0){
                  ltoken=data.token;//得到用户token
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
// 初始化
// RongIMClient.init(appkey, [dataAccessProvider],[options]);
// appkey:官网注册的appkey。
// dataAccessProvider:自定义本地存储方案的实例，不传默认为内存存储，自定义需要实现WebSQLDataProvider所有的方法，此参数必须是传入实例后的对象。

RongIMClient.init("x18ywvqf8wznc");
//var token = "Jwr9C+8uoGnL6ZHMbc21GGVrF9kEmAYIKZg77fOVsJD0w3t6cRhUEkuf7T8hHFubKBgCiSwv8DYyTtuSfRl5EQ==";
var token = ltoken;
/*
 *@param config {Object} 初始化配置参数
 */
// 连接融云服务器。
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
//定义全局
 $(function(){
  window.fail=$("#DeleteFai-box");
  window.failhtml=$("#DeleteFai-box > div");
  fail.click(function() {
    fail.css('display','none');
  });

// 消息监听器
 RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
        // 判断消息类型
        switch(message.messageType){
            case RongIMClient.MessageType.TextMessage:
                 $("#me-box").append(
                   "<div class='message-box'>"+
                       "<img src='"+message.content.user.portraitUri+"' class='me-head' name='"+message.content.user.id+"'>"+
                       "<div class='me-name'>"+message.content.user.name+"</div>"+
                       "<div class='me-content'>"+message.content.content+"</div>"+
                  "</div>"
                  );
                  $("img").click(function(){
                    var targetid=$(this).attr('name');
                    window.location="chat.html?target="+targetid;
                  });
                   // 发送的消息内容将会被打印
                break;
            default:
                // 自定义消息
                // do something...
        }
    }
});
});



