<?php
/**
 * Created by PhpStorm.
 * User: Prophet
 * Date: 2016/10/17
 * Time: 21:29
 */

namespace Home\Controller;
use Think\Controller;

class MessageController extends Controller
{
    public function index()
    {
        $this -> display();
    }
}