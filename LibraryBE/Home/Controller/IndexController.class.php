<?php
namespace Home\Controller;
use Think\Controller;

/**
 * Class IndexController
 * @package Home\Controller
 * @author Pr0phet
 */
class IndexController extends Controller
{
    private static $sms_user = "13929470083";
    private static $sms_pass = "gtagta123";
    private static $sms_url = "http://222.73.117.169/msg/HttpBatchSendSM";


    /**
     * 发送验证码
     * @POST phone 发送验证码的电话
     */
    public function sendSMS()
    {
        $Phone = I('post.phone');
        $checkNum = (string)random_int(1000,9999);
        session(array('checkNum' => $checkNum , 'expire' => '900'));
        $tpl = "【EX-book】您此次的验证码为".$checkNum."\n【15分钟后失效】";
        $data = array(
            'account' => $this::$sms_user,
            'pswd' => $this::$sms_pass,
            'mobile' => $Phone,
            'msg' => $tpl,
            'needstatus' => 'true'
        );
        $options = array(
            'CURLOPT_URL' => $this::$sms_url,
            'CURLOPT_POST' => true,
            'CURLOPT_RETURNTRANSFER' => true,
            'CURLOPT_POSTFILEDS' => $data
        );
        $curl = curl_init();
        curl_setopt_array($curl,$options);
        $res = curl_exec($curl);
        $res = explode(',',$res);
        $res = explode("\n",$res);
        if($res[0] == '0')
        {
            $this -> ajaxReturn($checkNum);
        }
        else
        {
            $this -> ajaxReturn(array('sendError' => $res[0]));
        }
        curl_close($curl);

    }

    public function checkSession()
    {
        return session('?userid');
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
            session(array('userid' => $res['id']));
            $this -> ajaxReturn(array('success' => '00'));
        }
    }

    public function logout()
    {
        session('userid',null);
        $this -> ajaxReturn(array('success' => '04'));
    }

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

    public function creatBlock()
    {
        $books = M('books');
        $picRepo = M('picRepo');

        $raw = I('post.');
        $data['description'] = $raw['description'];
        $data['price'] = $raw['price'];
        $data['tag'] = $raw['tag'];
        $data['owner'] = session('userid');
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


    public function showBlocks()
    {
        $books = M('books');
        $flag = (int)I('post.flag')*5;
        $mode = I('post.mode',0) ? I('post.mode') : 'public';
        $search = I('post.keyword',0) ? I('post.keyword') : null;
        if($mode == 'personal')
        {
            $condition['id'] = session('userid');
        }
        if($search != null)
        {
            $condition['title'] = $search;
        }
        $condition['status'] = 1;
        $blocks = $books -> WHERE($condition) -> limit("$flag,5") ->select();
        for($i = 0 ; $i < 5 ; $i++)
        {
            $data[$i]['id'] = $blocks[$i]['id'];
            $data[$i]['owner'] = $blocks[$i]['owner'];
            $data[$i]['price'] = $blocks[$i]['price'];
            $data[$i]['time'] = $this->showTime($blocks[$i]['ct']);
            $data[$i]['pic'] = $this -> getPic($blocks[$i]['flag'],'book');
            $data[$i]['desciption'] = $blocks[$i]['description'];
            $data[$i]['commentNum'] = count($this -> getComments($blocks[$i]['commentsflag']));
        }
        $this -> ajaxReturn($data);
    }

    public function deleteBlock()
    {
        $books = M('books');

        $id = I('post.id');
        $block = $books -> WHERE('id = '.$id) -> find();

        $picflag = $block['picflag'];
        $commentsflag = $block['commentsflag'];

        $picRepo = M('picRepo');
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

    public function rentOut()
    {
        $books= M('books');
        $id = I('post.id');
        $condition['id'] = $id;
        $data['status'] = '1';
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

    public function addComment()
    {
        $comment = M('comments');

        $id = I('post.id');
        $data['content'] = I('post.commment');
        $data['flag'] = $id;
        $data['ownerid'] = session('userid');
        $data['time'] = time();

        $res = $comment -> add($data);
        if($res)
        {
            $this -> ajaxReturn(array('success' => '08'));
        }
        else
        {
            $this -> ajaxReturn(array('error' => '06'));
        }
    }

    //----------end of operation about block ---------


    //----------user----------

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
                $this -> ajaxReturn(array('success' => '02'));
            }
        }
    }

    public function changePass()
    {
        $db = M('user');
        $old_pass = I('post.old');
        $new_pass = I('post.new');
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





    //---------private function----------

    private function getComments($flag)
    {
        $db = M('comments');
        $condition['flag'] = $flag;
        $data = $db -> WHERE($condition) -> select();
        $data['time'] = $this->showTime($data['time']);
        return $data;
    }

    private function getPic($flag,$tag)
    {
        $db = M('picRepo');
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
            return $res.'秒';
        }
        elseif($res <= 3600)
        {
            return $res / 60 .'分钟前';
        }
        elseif($res <= 86400)
        {
            return $res / 3600 .'小时前';
        }
        else
        {
            return date('Y-M-D');
        }
    }



}