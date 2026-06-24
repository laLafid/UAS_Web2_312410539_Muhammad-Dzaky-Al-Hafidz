<?php
namespace App\Cells;

use App\Models\ArtikelModel;

class RandomArtikel
{
    public function render(int $limit = 5)
    {
        $model = new ArtikelModel();
        $artikel = $model->select('artikel.judul, artikel.slug')
            ->orderBy('RAND()') // Ini adalah kunci untuk pengacakan
            ->limit($limit)
            ->findAll();

        return view('components/random_artikel', [
            'artikel' => $artikel,
            'title'   => 'Artikel Pilihan' // Judul dinamis untuk widget ini
        ]);
    }
}