<?php
namespace App\Cells;
use App\Models\ArtikelModel;
class ArtikelTerkini
{

    public function render(?string $kategori = null, int $limit = 5)
    {
        $kategoriModel = new \App\Models\KategoriModel();

        // Logika pengacakan kategori jika input adalah 'random' atau null
        if ($kategori === null || $kategori === 'random') {
            $randomKat = $kategoriModel->orderBy('RAND()')->first();
            $kategori = $randomKat ? $randomKat['nama_kategori'] : 'umum';
        }

        $model = new \App\Models\ArtikelModel();
        $artikel = $model->select('artikel.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id_kategori = artikel.id_kategori')
            ->where('kategori.nama_kategori', $kategori) // Mencari berdasarkan nama di tabel kategori
            ->orderBy('artikel.created_at', 'DESC')
            ->limit($limit)
            ->find();

        return view('components/artikel_terkini', [
            'artikel'   => $artikel,
            'kategori'  => $kategori
        ]);
    }

}