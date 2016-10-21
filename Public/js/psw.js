$(function(){
    $("#ChangePassOld").focus(function(){
        var input_value=$(this).val();
        if(input_value=="请输入旧密码"){
            $(this).val("");
            $(this).attr("type","password");
        }
    })

    $("#ChangePassOld").blur(function(){
        var input_value=$(this).val();
        var value1=$("#changevalue4").val();
        if(input_value==""){
            $(this).val("请输入旧密码");
            $(this).attr("type","text");
        }
    }) 

    $("#ChangeSetNew1").focus(function(){
        var input_value=$(this).val();
        if(input_value=="请设置新密码"){
            $(this).val("");
            $(this).attr("type","password");
        }
    })

    $("#ChangeSetNew1").blur(function(){
        var input_value=$(this).val();
        var value1=$("#changevalue4").val();
        if(input_value==""){
            $(this).val("请设置新密码");
            $(this).attr("type","text");
        }
    }) 

    $("#ChangeSetNew2").focus(function(){
        var input_value=$(this).val();
        if(input_value=="请再次确定密码"){
            $(this).val("");
            $(this).attr("type","password");
        }
    })

    $("#ChangeSetNew2").blur(function(){
        var input_value=$(this).val();
        var value1=$("#changevalue4").val();
        if(input_value==""){
            $(this).val("请再次确定密码");
            $(this).attr("type","text");
        }
    }) 

    $("#userPassword2").focus(function(){
    	var input_value=$(this).val();
    	if(input_value==""){
    		$(this).val("");
    		$(this).attr("type","password");
    	}
    })

    $("#userPassword2").blur(function(){
    	var input_value=$(this).val();
        var value1=$("#changevalue4").val();
    	if(input_value==""){
    		$(this).val("请再次确定密码");
    		$(this).attr("type","text");
    	}
    }) 

    $("#SetNewPass1").focus(function(){
    	var input_value=$(this).val();
    	if(input_value=="请设置新密码"){
    		$(this).val("");
    		$(this).attr("type","password");
    	}
    })

    $("#SetNewPass1").blur(function(){
    	var input_value=$(this).val();
    	if(input_value==""){
    		$(this).val("请设置新密码");
    		$(this).attr("type","text");
    	}
    }) 
    $("#SetNewPass2").focus(function(){
        var input_value=$(this).val();
        if(input_value=="请再次确定密码"){
            $(this).val("");
            $(this).attr("type","password");
        }
    })

    $("#SetNewPass2").blur(function(){
        var input_value=$(this).val();
        var value1=$("#changevalue4").val();
        if(input_value==""){
            $(this).val("请再次确定密码");
            $(this).attr("type","text");
        }
    }) 

    $("#userPassword1").focus(function(){
    	var input_value=$(this).val();
    	if(input_value==""){
            console.log(1);
    		$(this).attr('type','password');

    	}
    })

    $("#userPassword1").blur(function(){
    	var input_value=$(this).val();
    	if(input_value==""){
    		$(this).val("请输入密码");
    		$(this).attr("type","text");
    	}
    }) 

    $("#LoginPass").focus(function(){
        var input_value=$(this).val();
        if(input_value=="请输入密码"){
            $(this).val("");
            $(this).attr("type","password");
        }
    })

    $("#LoginPass").blur(function(){
        var input_value=$(this).val();
        if(input_value==""){
            $(this).val("请输入密码");
            $(this).attr("type","text");
        }
    }) 

});
