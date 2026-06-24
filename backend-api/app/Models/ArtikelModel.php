<?php
namespace App\Models;
use CodeIgniter\Model;
class ArtikelModel extends Model
{
    protected $table = 'laporan';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $allowedFields = [
        'kategori_id', 'nama_pelapor', 'email_pelapor', 'no_hp_pelapor',
        'judul', 'isi_laporan', 'lokasi', 'gambar_bukti', 'status'
    ];

    public function getArtikelDenganKategori()
    {
        return $this->db->table('laporan')
            ->select('laporan.*, kategori.nama_kategori')
            ->join('kategori', 'kategori.id = laporan.kategori_id', 'left')
            ->orderBy('laporan.id', 'DESC')
            ->get()
            ->getResultArray();
    }
}