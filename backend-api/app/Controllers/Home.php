<?php
namespace App\Controllers;
use App\Models\KategoriModel;

class Home extends BaseController
{
    public function index()
    {
        $model = new KategoriModel();
        return view('welcome_message', [
            'title' => 'Home',
            'kategori' => $model->findAll()
        ]);
    }
}