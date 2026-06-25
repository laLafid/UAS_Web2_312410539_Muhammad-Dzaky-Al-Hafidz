<?php
namespace App\Filters;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $origin = $request->getHeaderLine('Origin');
        $allowed = [
            'https://laLafid.github.io',
            'http://localhost',
            'http://127.0.0.1'
        ];

        if (in_array($origin, $allowed)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-App-Client-Key');
        header('Access-Control-Allow-Credentials: true');

        // Preflight request
        if ($request->getMethod() === 'options') {
            header('HTTP/1.1 204 No Content');
            exit();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}