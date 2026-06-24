<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
class Auth extends ResourceController
{
    protected $format = 'json';
    public function login()
    {
        $email    = $this->request->getVar('username'); // tetap terima 'username' dari frontend
        $password = $this->request->getVar('password');
        $model = new UserModel();
        // Cari by email atau nama
        $user = $model->where('email', $email)
                      ->orWhere('nama', $email)
                      ->first();
        if ($user && password_verify($password, $user['password'])) {
            return $this->respond([
                'status'   => 200,
                'error'    => null,
                'messages' => 'Login Berhasil',
                'data'     => [
                    'id'       => $user['id'],
                    'username' => $user['nama'],
                    'role'     => $user['role'],
                    'token'    => base64_encode('TOKEN-SECRET-' . $user['email'])
                ]
            ], 200);
        }
        return $this->failUnauthorized('Email atau Password salah.');
    }
}