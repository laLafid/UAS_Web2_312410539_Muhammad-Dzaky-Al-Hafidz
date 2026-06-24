<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ArtikelModel;
use App\Models\TanggapanModel;

class Post extends ResourceController
{
    use ResponseTrait;
    private $uploadPath = FCPATH . 'uploads/';
    private $uploadUrl = '/uploads/';

    public function index()
    {
        $model = new ArtikelModel();
        $data['artikel'] = $model->getArtikelDenganKategori();
        return $this->respond($data);
    }

    public function kategori()
    {
        $model = new \App\Models\KategoriModel();
        return $this->respond(['kategori' => $model->findAll()]);
    }

    public function show($id = null)
    {
        $model = new ArtikelModel();
        $data = $model->where('id', $id)->first();
        if ($data)
            return $this->respond($data);
        return $this->failNotFound('Data tidak ditemukan.');
    }

    public function create()
    {
        $model = new ArtikelModel();

        $gambarNama = null;
        $gambar = $this->request->getFile('gambar_bukti');

        if ($gambar && $gambar->isValid() && !$gambar->hasMoved()) {
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($gambar->getMimeType(), $allowedTypes)) {
                return $this->fail('Format file tidak didukung.');
            }
            if ($gambar->getSize() > 2 * 1024 * 1024) {
                return $this->fail('Ukuran file maksimal 2MB.');
            }
            $gambarNama = $gambar->getRandomName();
            $gambar->move($this->uploadPath, $gambarNama);
        }

        $judul = $this->request->getVar('judul');
        if (empty($judul))
            return $this->fail('Judul tidak boleh kosong.');
        $rules = [
            'judul' => 'required|min_length[5]|max_length[150]',
            'isi_laporan' => 'required|min_length[10]',
            'nama_pelapor' => 'required|alpha_space|max_length[180]',
            'no_hp_pelapor' => 'required|numeric|min_length[9]|max_length[13]',
            'email_pelapor' => 'required|valid_email',
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $model->insert([
            'kategori_id' => $this->request->getVar('kategori_id'),
            'nama_pelapor' => $this->request->getVar('nama_pelapor'),
            'email_pelapor' => $this->request->getVar('email_pelapor'),
            'no_hp_pelapor' => $this->request->getVar('no_hp_pelapor'),
            'judul' => $judul,
            'isi_laporan' => $this->request->getVar('isi_laporan'),
            'lokasi' => $this->request->getVar('lokasi'),
            'status' => $this->request->getVar('status') ?? 'Baru',
            'gambar_bukti' => $gambarNama,
        ]);

        

        return $this->respondCreated([
            'status' => 201,
            'error' => null,
            'messages' => ['success' => 'Laporan berhasil ditambahkan.']
        ]);
    }

    public function update($id = null)
    {
        $model = new ArtikelModel();
        if (!$id || !$model->find($id))
            return $this->failNotFound('Data tidak ditemukan.');

        $gambar = $this->request->getFile('gambar_bukti');
        $gambarNama = null;

        if ($gambar && $gambar->isValid() && !$gambar->hasMoved()) {
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($gambar->getMimeType(), $allowedTypes))
                return $this->fail('Format file tidak didukung.');
            if ($gambar->getSize() > 2 * 1024 * 1024)
                return $this->fail('Ukuran file maksimal 2MB.');
            $gambarNama = $gambar->getRandomName();
            $gambar->move($this->uploadPath, $gambarNama);
        }

        $rawInput = $this->request->getRawInput();
        $data = array_filter([
            'kategori_id' => $this->request->getVar('kategori_id') ?? $rawInput['kategori_id'] ?? null,
            'nama_pelapor' => $this->request->getVar('nama_pelapor') ?? $rawInput['nama_pelapor'] ?? null,
            'email_pelapor' => $this->request->getVar('email_pelapor') ?? $rawInput['email_pelapor'] ?? null,
            'no_hp_pelapor' => $this->request->getVar('no_hp_pelapor') ?? $rawInput['no_hp_pelapor'] ?? null,
            'judul' => $this->request->getVar('judul') ?? $rawInput['judul'] ?? null,
            'isi_laporan' => $this->request->getVar('isi_laporan') ?? $rawInput['isi_laporan'] ?? null,
            'lokasi' => $this->request->getVar('lokasi') ?? $rawInput['lokasi'] ?? null,
            'status' => $this->request->getVar('status') ?? $rawInput['status'] ?? null,
            'gambar_bukti' => $gambarNama,
        ], fn($v) => $v !== null);

        $model->update($id, $data);
        return $this->respond([
            'status' => 200,
            'error' => null,
            'messages' => ['success' => 'Laporan berhasil diubah.']
        ]);
    }

    public function delete($id = null)
    {
        $model = new ArtikelModel();
        $laporan = $model->find($id);
        if (!$laporan)
            return $this->failNotFound('Data tidak ditemukan.');

        if (!empty($laporan['gambar_bukti'])) {
            $filePath = $this->uploadPath . $laporan['gambar_bukti'];
            if (file_exists($filePath))
                unlink($filePath);
        }

        $model->delete($id);
        return $this->respondDeleted([
            'status' => 200,
            'error' => null,
            'messages' => ['success' => 'Laporan berhasil dihapus.']
        ]);
    }

    public function getTang($laporan_id = null)
    {
        if (!$laporan_id)
            return $this->fail('ID laporan tidak valid.');
        $model = new TanggapanModel();
        return $this->respond([
            'tanggapan' => $model->getTangDenganUser($laporan_id)
        ]);
    }

    public function addTang()
    {
        $laporan_id = $this->request->getVar('laporan_id');
        $isi = $this->request->getVar('isi_tanggapan');
        $user_id = $this->request->getVar('user_id') ?? 1;

        if (empty($laporan_id) || empty($isi)) {
            return $this->fail('laporan_id dan isi_tanggapan wajib diisi.');
        }

        $laporanModel = new ArtikelModel();
        if (!$laporanModel->find($laporan_id)) {
            return $this->failNotFound('Laporan tidak ditemukan.');
        }

        $gambarNama = null;
        $gambar = $this->request->getFile('gambar_tanggapan');
        if ($gambar && $gambar->isValid() && !$gambar->hasMoved()) {
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($gambar->getMimeType(), $allowedTypes)) {
                return $this->fail('Format gambar tidak didukung.');
            }
            if ($gambar->getSize() > 2 * 1024 * 1024) {
                return $this->fail('Ukuran gambar maksimal 2MB.');
            }
            $gambarNama = $gambar->getRandomName();
            $gambar->move($this->uploadPath . 'tanggapan/', $gambarNama);
        }

        $model = new TanggapanModel();
        $model->insert([
            'laporan_id' => $laporan_id,
            'user_id' => $user_id,
            'isi_tanggapan' => $isi,
            'gambar_tanggapan' => $gambarNama,
        ]);

        return $this->respondCreated([
            'status' => 201,
            'error' => null,
            'messages' => ['success' => 'Tanggapan berhasil ditambahkan.']
        ]);
    }

    public function deleteTang($id = null)
    {
        if (!$id) {
            return $this->fail('ID tanggapan tidak valid.');
        }

        $model = new TanggapanModel();
        $tanggapan = $model->find($id);

        if (!$tanggapan) {
            return $this->failNotFound('Tanggapan tidak ditemukan.');
        }

        if (!empty($tanggapan['gambar_tanggapan'])) {
            $filePath = $this->uploadPath . 'tanggapan/' . $tanggapan['gambar_tanggapan'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status' => 200,
            'error' => null,
            'messages' => ['success' => 'Tanggapan berhasil dihapus.']
        ]);
    }
}