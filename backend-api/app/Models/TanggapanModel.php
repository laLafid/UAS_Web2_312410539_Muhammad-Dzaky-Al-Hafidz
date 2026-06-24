<?php
namespace App\Models;
use CodeIgniter\Model;
class TanggapanModel extends Model
{
    protected $table = 'tanggapan';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $allowedFields = ['laporan_id', 'user_id', 'isi_tanggapan', 'gambar_tanggapan'];

    public function getTangDenganUser($laporan_id)
    {
        return $this->db->table('tanggapan')
            ->select('tanggapan.*, users.nama as nama_user')
            ->join('users', 'users.id = tanggapan.user_id', 'left')
            ->where('tanggapan.laporan_id', $laporan_id)
            ->orderBy('tanggapan.created_at', 'ASC')
            ->get()
            ->getResultArray();
    }
}