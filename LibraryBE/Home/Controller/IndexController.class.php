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
        $this -> display();
    }

    /**
     * 发送验证码
     * @POST phone 发送验证码的电话
     * @return 验证码/error(数组)
     */
    public function sendSMS()
    {
        $Phone = '13929470083';
        $checkNum = (string)rand(1000,9999);
        session(array('checkNum' => $checkNum , 'expire' => '900'),$checkNum);

        $ch = curl_init();
        $url = $this::$sms_url."srcSeqId=0"."&account=".$this::$sms_user."&password=".$this::$sms_pass."&mobile=".$Phone."&code=".$checkNum."&time=15";
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_URL, $url );
        $res = curl_exec($ch);
        $res = json_decode($res,true);

        if($res['responseCode'] == '0')
        {
            $this -> ajaxReturn(array('success' => '10'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
        curl_close($ch);
    }

    public function checkSession()
    {
        $this ->  ajaxReturn(session('?userid'));
    }

    public function checkCode()
    {
        $this -> ajaxReturn((
            (I('post.checkNum') == session('checkNum')) ? array('success' => '10') : array('error' => '06')
        ));
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
        $res = $user -> WHERE($condition) -> find();
        if(!$res)
        {
            $this -> ajaxReturn(array('error' => '00'));
        }
        elseif($res['pass'] != $pass)
        {
            $this -> ajaxReturn(array('error' => '01'));
        }
        else
        {
            session(array('name' => 'userid'));
            session(array('name' => 'username'));
            session('userid',$res['id']);
            session('username',$res['name']);
            $this -> ajaxReturn(array('success' => '00'));
        }
    }

    /**
     * 注销
     * 直接用，什么都不用post
     */
    public function logout()
    {
        session('userid',null);
        $this -> ajaxReturn(array('success' => '04'));
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
        $raw = I('post.');
        $data = array();
        if($raw['checkNum'] == session('checkNum'))
        {
            $data['phone'] = $raw['phone'];
            $data['name'] = $raw['name'];
            $data['pass'] = $raw['pass'];
            $config = array(
                'maxSize' => '1572864', //最大1.5M
                'rootPath' => './Public/upload/', //根目录
                'savePath' => session('userid').'/', //分类存储图片（相对于根目录）
                'saveName' => 'userpic', //文件命名规则
                'exts' => array('jpg','jpeg','png'),
                'replace' => true
            );
            $upload = new \Think\upload($config);
            $info = $upload -> uploadOne($_FILES['pic']);
            if(!$info)
            {
                $this -> ajaxReturn(array('error' => '03'));
                exit();
            }
            else
            {
                $data['pic'] = $info['savepath'];
            }
        }
        $res = $db -> create($data);
        if($res != true)
        {
            $this -> ajaxReturn(array('error' => '02'));
        }
        else
        {
            session('checkNum',null);
            $this -> ajaxReturn(array('success' => '01'));
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
    public function creatBlock()
    {
        $books = M('books');
        $picRepo = M('picrepo');
        $user = M('user');
        $owner_pic = $user -> WHERE('id = '.session('userid')) -> find();

        $raw = I('post.');
        $data['description'] = $raw['description'];
        $data['price'] = $raw['price'];
        $data['tag'] = $raw['tag'];
        $data['owner'] = session('userid');
        $data['ownerpic'] = $owner_pic['pic'];
        $data['ct'] = time();

        $saveBook = $books -> add($data);
        $config = array(
            'maxSize' => '1572864', //最大1.5M
            'rootPath' => './Public/upload/', //根目录
            'savePath' => session('userid').'/', //分类存储图片（相对于根目录）
            'exts' => array('jpg','jpeg','png'),
            'replace' => true
        );
        $upload = new \Think\Upload($config);
        $res = $upload -> upload();
        if($res)
        {
            $save['picflag'] = $saveBook;
            $save['commentsflag'] =$saveBook;
            for($i = 0; $i < count($res); $i++)
            {
                $pic[$i]['url'] = $res[$i]['savepath'];
                $pic[$i]['flag'] = $data['picflag'];
                $pic[$i]['tag'] = $data['tag'];
            }
            $picRepo -> saveAll($pic);
            $books -> WHERE('id = '.$saveBook) -> save($save);
            $this -> ajaxReturn(array('success' => '07'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
    }


    /**
     * 查询前五个书块
     * @POST flag
     * @POST 个人中心（非必要）
     * @POST 查询关键字（非必要）
     * @return 长度为五的一个数组，其中包括字段[id]书块id,[owner]发布者,[price]价格,[time]创建时间,[pic]此字段内容有可能为数组 是图片url,[description]描述,[commentNum]评论数量
     */
    public function showBlocks()
    {
        $books = M('books');
        $flag = (int)I('post.flag')*5;
        $mode = I('post.mode',0) ? I('post.mode') : 'public';
        $search = I('post.keyword',0) ? I('post.keyword') : null;
        $condition['status'] = 1;
        if($mode == 'personal')
        {
            $condition['owner'] = session('username');
            unset($condition['status']);
        }
        if($search != null)
        {
            $where['description'] = array('like',"%$search%");
            $where['owner'] = array('like',"%$search%");
            $where['_logic'] = 'OR';
            $condition['_complex'] = $where;
        }
        $blocks = $books -> WHERE($condition) -> limit("$flag,5") ->select();
        if($blocks)
        {
            for ($i = 0; $i < count($blocks); $i++)
            {
                $data[$i]['id'] = $blocks[$i]['id'];
                $data[$i]['owner'] = $blocks[$i]['owner'];
                $data[$i]['owner_pic'] = $blocks[$i]['owner_pic'];
                $data[$i]['price'] = $blocks[$i]['price'];
                $data[$i]['time'] = $this->showTime($blocks[$i]['ct']);
                $data[$i]['pic'] = $this->getPic($blocks[$i]['picflag'], 'book');
                $data[$i]['desciption'] = $blocks[$i]['description'];
                $data[$i]['commentNum'] = $this->getComments($blocks[$i]['commentsflag'])['num'];
                $data[$i]['publishNum'] = count($books->WHERE($condition)->select());
                $data[$i]['status'] = $blocks[$i]['status'];
            }
        }
        else
        {
            $data['error'] = "empty";
        }
        $this -> ajaxReturn($data);
    }

    public function detailBlock()
    {
        $condition['flag'] = I('post.id');
        //getComments
        $com = M('comments');
        $user = M('user');
        $flag = $com -> WHERE($condition) -> select();
        if($flag)
        {
            $data['comments']['flag'] = 1;
            for ($i = 0; $i < count($flag); $i++)
            {
                $owner = $user->WHERE('id = ' . $flag[$i]['ownerid'])->find();
                $data['comments'][$i]['owner'] = $owner['name'];
                $data['comments'][$i]['pic'] = $owner['pic'];
                $data['comments'][$i]['description'] = $flag[$i]['content'];
                $data['comments'][$i]['time'] = $this->showTime($flag[$i]['time']);
            }
            $data['comments']['times'] = count($flag);
        }
        else
        {
            $data['comments']['flag'] = 0;
        }
        //getDetail
        $condition['status'] = 1;
        $books = M('books');
        $res = $books -> WHERE($condition) -> find();
        $selectOwner['name'] = $res['owner'];
        $data['id'] = $res['id'];
        $data['owner'] = $res['owner'];
        $data['ownerid'] = $user -> WHERE($selectOwner) -> find();
        $data['owner_pic'] = $res['owner_pic'];
        $data['price'] = $res['price'];
        $data['time'] = $this -> showTime($res['ct']);
        $data['pic'] = $this -> getPic($res['picflag'],'book');
        $data['description'] = $res['description'];
        $this -> ajaxReturn($data);
    }

    /**
     * 删除书块
     * @POST 书块id
     * @return success/error
     */
    public function deleteBlock()
    {
        $books = M('books');

        $id = I('post.BookChunkId');
        $block = $books -> WHERE('id = '.$id) -> find();

        $picflag = $block['picflag'];
        $commentsflag = $block['commentsflag'];

        $picRepo = M('picrepo');
        $picCondition['flag'] = $picflag;
        $pics = $picRepo -> WHERE($picCondition) -> select();
        for($i = 0; $i < count($pics); $i++)
        {
            unlink($pics[$i]['url']);
        }
        $picRes = $picRepo -> WHERE($picCondition) -> delete();

        $commentsRepo = M('comments');
        $commentsCondition['flag'] = $commentsflag;
        $commentsRes = $commentsRepo -> WHERE($commentsCondition) -> delete();
        if($picRes && $commentsRes)
        {
            $books -> WHERE('id = '.$id) -> delete();
            $this -> ajaxReturn(array('success' => '05'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
    }

    /**
     * 出租操作
     * @POST 书块id
     * @return success/error
     */
    public function rentOut()
    {
        $books= M('books');
        $id = I('post.BookChunkId');
        $condition['id'] = $id;
        $data['status'] = '0';
        $res = $books -> WHERE($condition) -> save($data);
        if($res)
        {
            $this -> ajaxReturn(array('success' => '06'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
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

        $userinfo = $user -> WHERE('id = '.session('userid')) -> find();
        $data['head'] = $userinfo['pic'];
        $data['name'] = $userinfo['name'];
        $id = I('post.postid');
        $data['content'] = I('post.comment');
        $data['flag'] = $id;
        $data['ownerid'] = session('userid');
        $data['time'] = time();

        $res = $comment -> add($data);
        $data['time'] = $this -> showTime($data['time']);
        if($res)
        {
            $this -> ajaxReturn($data);
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
    }

    //----------end of operation about block ---------


    //----------user----------

    public function showUser()
    {
        $db = M('user');
        $books = M('books');
        $condition['id'] = session('userid');
        $res = $db -> WHERE($condition) -> find();
        $data['owner'] = $res['name'];
        $data['pic'] = $res['pic'];
        $selectB['owner'] = $res['name'];
        $num =  count($books -> WHERE($selectB) -> select());
        $data['number'] = $num;
        $this -> ajaxReturn($data);
    }

    /**
     * 获取用户头像
     * @POST 用户id
     * @return success/error
     */
    public function showPic()
    {
        $db = M('user');
        $id = session('userid');
        $condition['id'] = $id;
        $pic = $db -> WHERE($condition) -> find();
        if($pic)
        {
            $this -> ajaxReturn(array('success' => $pic));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
    }

    /**
     * 修改用户名称
     * @POST 新用户名
     * @return success/error
     */
    public function changeName()
    {
        $db = M('user');
        $newName = I('post.NewName');
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

            $this -> ajaxReturn(array('success' => '09'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
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
            'exts' => array('jpg','jpeg','png'),
            'replace' => true
        );
        $upload = new \Think\upload($config);
        $info = $upload -> uploadOne($_FILES['pic']);
        if(!$info)
        {
            $this -> ajaxReturn(array('error' => '03'));
        }
        else
        {
            $data['pic'] = $info['savepath'];
            $res = $db -> WHERE($conditon) -> save($data);
            if(!$res)
            {
                $this -> ajaxReturn(array('error' => '04'));
            }
            else
            {
                $rongCloud = new \rongcloud('x18ywvqf8wznc','CIJoQrifglW3FE');
                $rongCloud -> user() -> refresh(session('userid'),$data['pic']);

                $this -> ajaxReturn(array('success' => '02'));
            }
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
        $old_pass = I('post.OldPass');
        $new_pass = I('post.NewPass');
        $condition['id'] = session('userid');
        $user = $db -> WHERE($condition) -> find();
        if(!$user)
        {
            $this -> ajaxReturn(array('error' => '05'));
        }
        elseif($user['pass'] == $old_pass)
        {
            $data['pass'] = $new_pass;
            $db -> WHERE($condition) -> save($data);
            $this -> ajaxReturn(array('success' => '03'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '01'));
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
            $this -> ajaxReturn(array('error' => '06'));
        }
        else
        {
            session('checkNum',null);
            $this -> ajaxReturn(array('success' => '03'));
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
        if($data)
        {
            $data['time'] = $this->showTime($data['time']);
        }
        return $data;
    }

    private function getPic($flag,$tag)
    {
        $db = M('picrepo');
        $condition['flag'] = $flag;
        $condition['tag'] = $tag;
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
}