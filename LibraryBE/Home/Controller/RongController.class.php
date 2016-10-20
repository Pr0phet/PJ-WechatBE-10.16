<?php
/**
 * Created by PhpStorm.
 * User: Prophet
 * Date: 2016/10/18
 * Time: 22:33
 */

namespace Home\Controller;
use Think\Controller;
import('Org.Im.rongcloud');

class RongController extends Controller
{
    private static $APPkey = "x18ywvqf8wznc";
    private static $APPSecret = "CIJoQrifglW3FE";
    //Im类库引用

    private function imToken($status)
    {
        if($status)
        {
            //获取用户
            $db = M('user');
            $id = session('userid');
            $user = $db->WHERE('id = ' . $id)->find();
            $name = $user['owner'];
            $pic = $user['pic'];

            $rongCloud = new \RongCloud($this::$APPkey, $this::$APPSecret);
            $token = $rongCloud->user()->getToken($id, $name, $pic);
            $data['id'] = $id;
            $data['name'] = $name;
            $data['pic'] = $pic;
            $data['token'] = $token;
            $this->ajaxReturn($data);
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
    }

    public function checkOnline()
    {
        $id = I('post.id');
        $rongcloud = new \RongCloud($this::$APPkey,$this::$APPSecret);
        $result = $rongcloud -> user() -> checkOnline($id);
        $result = json_decode($result,true);
        $this ->imToken($result['status']);
    }
}