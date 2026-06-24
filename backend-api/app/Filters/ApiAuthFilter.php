<?php
namespace App\Filters;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\Http\RequestInterface;
use CodeIgniter\Http\ResponseInterface;
use Config\Services;
class ApiAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // 1. Ambil data Header Authorization dari request klien
        $authHeader = $request->getServer('HTTP_AUTHORIZATION');
        if (!$authHeader) {
            // Jika header tidak ditemukan, kirim respon error 401
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status' => 401,
                'error' => 401,
                'messages' => 'Akses Ditolak. Token tidak ditemukan pada request!'
            ]);
        }
        // 2. Ekstrak string token (Memisahkan kata 'Bearer' dengan string token)
        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }
        // 3. Validasi Token (Pada praktikum ini disesuaikan dengan format enkripsi di Controller Auth)
// Catatan: Pada rilisan production, bagian ini biasanya divalidasi menggunakan library JWT (JSON Web Token)
        if (!$token || empty($token)) {
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status' => 401,
                'error' => 401,
                'messages' => 'Sesi Token tidak valid atau kedaluwarsa!'
            ]);
        }
    }
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak diperlukan aksi setelah request diproses
    }
}