<?php
namespace Home\Controller;
use Think\Controller;
import('Org.Im.rongcloud');
/**
 * Class IndexController
 * @package Home\Controller
 * @author Pr0phet
 */
class IndexController extends Controller
{
    private static $sms_user = "13929470083";
    private static $sms_pass = "gtagta123";
    private static $sms_url = "http://sms.tehir.cn/code/sms/api/v1/send?";


    public function index()
    {
    		$this->display();
    }


    /**
     * 发送验证码
     * @POST phone 发送验证码的电话
     * @return 验证码/error(数组)
     */
    public function sendSMS()
    {
        $Phone = I('post.phone');
        $checkNum = (string)rand(1000, 9999);
        session(array('checkNum' => $checkNum, 'expire' => '900'));
        session('checkNum',$checkNum);

        $ch = curl_init();
        $url = $this::$sms_url . "srcSeqId=0" . "&account=" . $this::$sms_user . "&password=" . $this::$sms_pass . "&mobile=" . $Phone . "&code=" . $checkNum . "&time=15";
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        $res = curl_exec($ch);
        $res = json_decode($res, true);

        if ($res['responseCode'] == '0') {
            curl_close($ch);
            $this->ajaxReturn(array('status' => '1'));
        } else {
            curl_close($ch);
            $this->ajaxReturn(array('status' => '0'));
        }
    }

    public function checkSession()
    {
        $this->ajaxReturn(array('status' => session('?userid')));
    }

    public function checkCode()
    {
        $code = I('post.code');
        if(!session('?checkNum'))
        {
            $this -> ajaxReturn(array('status' => '-1'));
        }
        elseif(session('checkNum') != $code)
        {
            $this -> ajaxReturn(array('status' => '0'));
        }
        else
        {
            $this -> ajaxReturn(array('status' => '1'));
        }
    }

    /**
     *  登录
     * @POST(phone) 登录电话
     * @POST(pass) 密码
     * @return 数组 error / success
     */
    public function login()
    {
        $phone = I('post.phone');
        $pass = I('post.pass');
        $user = M('user');
        $condition['phone'] = $phone;
        $res = $user->WHERE($condition)->find();
        if (!$res) {
            $this->ajaxReturn(array('status' => '-1'));
        } elseif ($res['pass'] != $pass) {
            $this->ajaxReturn(array('status' => '0'));
        } else {
            session(array('name' => 'userid'));
            session(array('name' => 'username'));
            session('userid', $res['id']);
            session('username', $res['name']);
            $this->ajaxReturn(array('status' => '1'));
        }
    }

    /**
     * 注销
     * 直接用，什么都不用post
     */
    public function logout()
    {
        session('userid', null);
        $this->ajaxReturn(array('status' => '1'));
    }

    public function checkRepeat()
    {
        $db = M('user');
        $field = I('post.field');
        $checkObj = I('post.obj');
        $condition[$field] = $checkObj;
        $res = $db -> WHERE($condition) -> find();
        if($res)
        {
            $this -> ajaxReturn(array('status' => '0'));
        }
        else
        {
            $this -> ajaxReturn(array('status' => '1'));
        }
    }

    /**
     * 注册（记得先验证好验证码）
     * @POST 电话
     * @POST 注册昵称
     * @POST 密码
     * @POST 头像
     * @return success/error
     */
    public function register()
    {
        $db = M('user');
        $data['phone'] = I('post.phone');
        $data['name'] = I('post.name');
        $data['pass'] = I('post.pass');
        $res = $db -> add($data);
        if (!$res)
        {
            $this->ajaxReturn(array('status' => '0'));
        }
        else
        {
            $this->ajaxReturn(array('status' => '1'));
        }
    }


    //--------对书块的操作---------

    /**
     * 新建出租图书
     * @POST 书本描述
     * @POST 价格
     * @POST 标签
     * @return success/error
     */
    public function createBlock()
    {
        $books = M('books');
        $picRepo = M('picrepo');

        $data['description'] = I('post.description');
        $data['price'] = I('post.price');
        $data['tag'] = I('post.tag');
        $data['owner'] = session('userid');
        $data['ct'] = time();

        $saveBook = $books->add($data);
        $config = array(
            'maxSize' => '1572864', //最大1.5M
            'rootPath' => './Public/upload/', //根目录
            'savePath' => session('userid') . '/', //分类存储图片（相对于根目录）
            'exts' => array('jpg', 'jpeg', 'png'),
            'replace' => true
        );
        $upload = new \Think\Upload($config);
        $res = $upload->upload();
        if ($res) {
            $i = 0;
            foreach ($res as $index) {
                $pic[$i]['url'] = '/EXbook/Public/upload/' . $index['savepath'] . $index['savename'];
                $pic[$i]['flag'] = $saveBook;
                $i++;
            }
            $picRepo->addAll($pic);
            $this->ajaxReturn(array('status' => '1'));
        } else {
            echo $upload->getError();
            return;
        }
    }


    /**
     * 查询前五个书块
     * @POST 查询关键字（非必要）
     * @return 长度为五的一个数组，其中包括字段[id]书块id,[owner]发布者,[price]价格,[time]创建时间,[pic]此字段内容有可能为数组 是图片url,[description]描述,[commentNum]评论数量
     */
    public function showBlocks()
    {
        $books = M('books');
        $update = (int)I('post.update',0) ? I('post.update') : null;
        $mode = I('post.mode');
        $search = I('post.keyword', 0) ? I('post.keyword') : null;
        $condition['status'] = 1;
        if ($mode == 1)
        {
            $condition['owner'] = session('userid');
            unset($condition['status']);
        }
        if ($search != null)
        {
            $where['description'] = array('like', "%$search%");
            $where['owner'] = array('like', "%$search%");
            $where['_logic'] = 'OR';
            $condition['_complex'] = $where;
        }
        $blocks = $books -> WHERE($condition) -> ORDER('id desc') ->limit(5) -> select();
        if ($update != null)
        {
            $blocks = $books -> WHERE('id < '.$update) -> ORDER('id desc') -> limit(5) -> select();
        }
        if ($blocks)
        {
            for ($i = 0; $i < count($blocks); $i++)
            {
                $user = M('user');
                $map['id'] = $blocks[$i]['owner'];
                $feed = $user -> WHERE($map) -> find();
                $data[$i]['id'] = $blocks[$i]['id'];
                $data[$i]['owner'] = $feed['name'];
                $data[$i]['owner_pic'] = $feed['pic'];
                $data[$i]['price'] = $blocks[$i]['price'];
                $data[$i]['time'] = $this->showTime($blocks[$i]['ct']);
                $data[$i]['pic'] = $this->getPic($blocks[$i]['id']);
                $data[$i]['desciption'] = $blocks[$i]['description'];
                $data[$i]['commentNum'] = $this->getComments($blocks[$i]['id'])['num'];
                $data[$i]['publishNum'] = count($books->WHERE($condition)->select());
                $data[$i]['status'] = $blocks[$i]['status'];
            }
        }
        else
        {
            $data['error'] = "empty";
        }
        $this->ajaxReturn($data);
    }

    public function detailBlock()
    {
        $condition['flag'] = I('post.id');
        //getComments
        $com = M('comments');
        $user = M('user');
        $flag = $com->WHERE($condition)->select();
        if ($flag) {
            for ($i = 0; $i < count($flag); $i++) {
                $owner = $user->WHERE('id = ' . $flag[$i]['ownerid'])->find();
                $data['comments'][$i]['owner'] = $owner['name'];
                $data['comments'][$i]['pic'] = $owner['pic'];
                $data['comments'][$i]['description'] = $flag[$i]['content'];
                $data['comments'][$i]['time'] = $this->showTime($flag[$i]['time']);
            }
        } else {
            $data['comments'] = array();
        }
        //getDetail
        $condition['id'] = I('post.id');
        $books = M('books');
        $res = $books->WHERE($condition)->find();
        $selectOwner['id'] = $res['owner'];
        $data['id'] = $res['id'];
        $data['owner'] = $user->WHERE($selectOwner)->find()['name'];
        $data['ownerid'] = $res['owner'];
        $data['owner_pic'] = $user->WHERE($selectOwner)->find()['pic'];
        $data['price'] = $res['price'];
        $data['time'] = $this->showTime($res['ct']);
        $data['pic'] = $this->getPic($res['picflag']);
        $data['description'] = $res['description'];
        $this->ajaxReturn($data);
    }

    /**
     * 删除书块
     * @POST 书块id
     * @return success/error
     */
    public function deleteBlock()
    {
        $books = M('books');

        $id = I('post.id');

        $picflag = $commentsflag = $id;

        $picRepo = M('picrepo');
        $picCondition['flag'] = $picflag;
        $pics = $picRepo->WHERE($picCondition)->select();
        for ($i = 0; $i < count($pics); $i++) {
            unlink($pics[$i]['url']);
        }
        $picRepo->WHERE($picCondition)->delete();

        $commentsRepo = M('comments');
        $commentsCondition['flag'] = $commentsflag;
        $commentsRepo->WHERE($commentsCondition)->delete();
        $books->WHERE('id = ' . $id)->delete();
        $this->ajaxReturn(array('status' => '1'));
    }

    /**
     * 出租操作
     * @POST 书块id
     * @return success/error
     */
    public function rentOut()
    {
        $books = M('books');
        $id = I('post.id');
        $condition['id'] = $id;
        $status = $books -> WHERE($condition) -> find();
        if($status['status'] == 1)
        {
            $data['status'] = 0;
        }
        else
        {
            $data['status'] = 1;
        }
        $res = $books->WHERE($condition)->save($data);
        if ($res) {
            $this->ajaxReturn(array('status' => $data['status']));
        } else {
            $this->ajaxReturn(array('status' => '-1'));
        }
    }

    /**
     * 新增评论
     * @POST 书块id
     * @POST 评论内容
     * @return success/error
     */
    public function addComment()
    {
        $comment = M('comments');
        $user = M('user');

        $id = I('post.id');
        $data['content'] = I('post.comment');
        $data['flag'] = $id;
        $data['ownerid'] = session('userid');
        $data['time'] = time();

        $res = $comment->add($data);
        $data['time'] = $this->showTime($data['time']);
        $owner = $user -> WHERE('id = '. session('userid')) -> find();
        $data['owner'] = $owner['name'];
        $data['owner_pic'] = $owner['pic'];
        if ($res) {
            $this->ajaxReturn($data);
        } else {
            $this->ajaxReturn(array('error' => '0'));
        }
    }

    //----------end of operation about block ---------


    //----------user----------

//    public function getName()
//    {
//        $id = I('post.id');
//        $user = M('user');
//
//        $name = $user->WHERE('id = ' . $id)->find()['name'];
//        $this->ajaxReturn($name);
//    }

//    public function checkExsist()
//    {
//        $phone = I('post.phone');
//        $user = M('user');
//        $res = $user -> WHERE('phone ='. $phone) -> find();
//        if($res)
//        {
//            $this -> ajaxReturn(1);
//        }
//        else
//        {
//            $this -> ajaxReturn(0);
//        }
//    }

    public function showUser()
    {
        $db = M('user');
        $books = M('books');
        $condition['id'] = session('userid');
        $res = $db -> WHERE($condition) -> find();
        $data['owner'] = $res['name'];
        $data['owner_pic'] = $res['pic'];
        $selectB['owner'] = session("userid");
        $num =  count($books -> WHERE($selectB) -> select());
        $data['number'] = $num;
        $this -> ajaxReturn($data);
    }

//    /**
//     * 获取用户头像
//     * @POST 用户id
//     * @return success/error
//     */
//    public function showPic()
//    {
//        $db = M('user');
//        $id = session('userid');
//        $condition['id'] = $id;
//        $pic = $db -> WHERE($condition) -> find();
//        if($pic)
//        {
//            $this -> ajaxReturn(array('success' => $pic));
//        }
//        else
//        {
//            $this -> ajaxReturn(array('error' => '06'));
//        }
//    }

    /**
     * 修改用户名称
     * @POST 新用户名
     * @return success/error
     */
    public function changeName()
    {
        $db = M('user');
        $newName = I('post.newName');
        $conndition['id'] = session('userid');
        $data['name'] = $newName;
        $res = $db -> WHERE($data) -> find();
        if($res)
            $this -> ajaxReturn(array('error' => 'repeat'));
        $res = $db -> WHERE($conndition) -> save($data);
        if($res)
        {
            $rongCloud = new \rongcloud('x18ywvqf8wznc','CIJoQrifglW3FE');
            $rongCloud -> user() -> refresh(session('userid'),$newName);

            $this -> ajaxReturn(array('status' => '1'));
        }
        else
        {
            $this -> ajaxReturn(array('status' => '0'));
        }
    }

    /**
     * 修改用户头像
     * @POST 头像
     * @return success/error
     */
    public function changePic()
    {
        $db = M('user');
        $conditon['id'] = session('userid');
        $config = array(
            'maxSize' => '1572864', //最大1.5M
            'rootPath' => './Public/upload/', //根目录
            'savePath' => session('userid').'/', //分类存储图片（相对于根目录）
            'saveName' => 'userpic', //文件命名规则
            'autoSub' => false,
            'exts' => array('jpg','jpeg','png'),
            'replace' => true
        );
        $upload = new \Think\Upload($config);
        $info = $upload -> uploadOne($_FILES['touxiang']);
        if(!$info)
        {
            echo $upload -> getError()."/n";
            var_dump($_FILES);
            $this -> ajaxReturn(array('status' => '-1'));
        }
        else
        {
            $data['pic'] = '/EXbook/Public/upload/'.$info['savepath'].$info['savename'];
            $res = $db -> WHERE($conditon) -> save($data)；
            $rongCloud = new \rongcloud('x18ywvqf8wznc','CIJoQrifglW3FE');
            $rongCloud -> user() -> refresh(session('userid'),$data['pic']);
            $this -> ajaxReturn(array('status' => '1'));
        }
    }

    /**
     * 修改密码
     * @POST 旧密码
     * @POST 新密码
     * @return success/error
     */
    public function changePass()
    {
        $db = M('user');
        $old_pass = I('post.oldPass');
        $new_pass = I('post.newPass');
        $condition['id'] = session('userid');
        $user = $db -> WHERE($condition) -> find();
        if(!$user)
        {
            $this -> ajaxReturn(array('status' => '-1'));
        }
        elseif($user['pass'] == $old_pass)
        {
            $data['pass'] = $new_pass;
            $db -> WHERE($condition) -> save($data);
            $this -> ajaxReturn(array('status' => '1'));
        }
        else
        {
            $this -> ajaxReturn(array('status' => '0'));
        }
    }

    /**
     * 忘记密码（先通过手机短信验证）
     * @POST 新密码
     * @POST 电话号码
     * @return success/error
     */
    public function forgetPass()
    {
        $db = M('user');
        $data['pass'] = I('post.pass');
        $condition['phone'] = I('post.phone');
        $res = $db -> WHERE($condition) -> save($data);
        if(!$res)
        {
            $this -> ajaxReturn(array('status' => '0'));
        }
        else
        {
            session('checkNum',null);
            $this -> ajaxReturn(array('status' => '1'));
        }
    }

    //---------user end-----------





    //---------private function----------(以下函数无须理会)

    private function getComments($flag)
    {
        $db = M('comments');
        $condition['flag'] = $flag;
        $data = $db -> WHERE($condition) -> select();
        $num = count($data);
        $data['num'] = $num;
//        if($data)
//        {
//            $data['time'] = $this->showTime($data['time']);
//        }
        return $data;
    }

    private function getPic($flag)
    {
        $db = M('picrepo');
        $condition['flag'] = $flag;
        $data = $db -> WHERE($condition) -> field('url') -> select();
        return $data;
    }

    private function showTime($time)
    {
        $res = time() - $time;
        if($res < 60)
        {
            return $res.'秒前';
        }
        elseif($res <= 3600)
        {
            return (int)($res / 60) .'分钟前';
        }
        elseif($res <= 86400)
        {
            return (int)($res / 3600) .'小时前';
        }
        else
        {
            return date('Y-M-D');
        }
    }

    public function subLogin()
    {
        $this -> display();
    }

    public function subRegister()
    {
        $this -> display();
    }

    public function forget()
    {
        $this -> display();
    }

    public function connect()
    {
        $this -> display();
    }

    public function message()
    {
        $this -> display();
    }

    public function personal()
    {
        $this -> display();
    }

    public function publish()
    {
        $this -> display();
    }

    public function changePassword()
    {
        $this -> display();
    }

    public function chatroom()
    {
        $this -> display();
    }

    public function infomation()
    {
        $this -> display();
    }

    public function settings()
    {
        $this -> display();
    }
}