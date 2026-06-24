<?php
namespace App\Controllers;
use App\Models\UserModel;
class User extends BaseController
{
    public function getIndex()
    {
        $title = 'Daftar User';
        $model = new UserModel();
        $users = $model->findAll();
        return view('user/index', compact('users', 'title'));
    }
    public function getLogin()
    {
        helper(['form']);
        return view('user/login', ['title' => 'Login']);
    }

    public function getRegister()
    {
        helper(['form']);
        return view('user/register', ['title' => 'Register']);
    }

    public function postRegister()
    {
        helper(['form']);
        $rules = [
            'username'     => 'required|min_length[3]|max_length[20]|is_unique[user.username]',
            'email'        => 'required|valid_email|is_unique[user.useremail]',
            'password'     => 'required|min_length[6]|max_length[200]',
            'confpassword' => 'matches[password]'
        ];

        if ($this->validate($rules)) {
            $model = new UserModel();
            $data = [
                'username'     => $this->request->getVar('username'),
                'useremail'    => $this->request->getVar('email'),
                'userpassword' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT)
            ];
            
            $model->save($data);
            
            session()->setFlashdata('flash_msg', 'Registrasi berhasil! Silakan login.');
            return redirect()->to('/user/login');
        } else {
            // Ambil semua pesan error dan gabungkan menjadi string
            $errors = $this->validator->getErrors();
            session()->setFlashdata('flash_msg', implode('<br>', $errors));
            
            return redirect()->back()->withInput();
        }
    }

    public function postLogin()
    {
        helper(['form']);
        $email = $this->request->getPost('email');
        $password = $this->request->getPost('password');
        $session = session();
        $model = new UserModel();
        $login = $model->where('useremail', $email)->first();
        if ($login) {
            $pass = $login['userpassword'];
            if (password_verify($password, $pass)) {
                $login_data = [
                    'user_id' => $login['id'],
                    'user_name' => $login['username'],
                    'user_email' => $login['useremail'],
                    'logged_in' => TRUE,
                ];
                $session->set($login_data);
                return redirect()->to('/admin');
            } else {
                $session->setFlashdata("flash_msg", "Password salah.");
                return redirect()->to('/user/login');
            }
        } else {
            $session->setFlashdata("flash_msg", "email tidak terdaftar.");
            return redirect()->to('/user/login');
        }
    }
    public function getLogout()
    {
        session()->destroy();
        return redirect()->to('/user/login');
    }

}