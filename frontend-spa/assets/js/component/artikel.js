const Artikel = {
  template: `
  <div class="min-h-screen bg-gray-50 py-10 px-6">
    <div class="max-w-5xl mx-auto">

      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Manajemen Laporan</h2>
          <p class="text-gray-500 text-sm mt-1">Kelola semua laporan pengaduan yang masuk.</p>
        </div>
        <button @click="openModal()" class="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Tambah Laporan
        </button>
      </div>

      <div v-if="alertMsg" :class="alertType === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'"
        class="border px-4 py-3 rounded-lg mb-4 text-sm flex justify-between items-center">
        <span>{{ alertMsg }}</span>
        <button @click="alertMsg = ''" class="ml-4 font-bold text-lg leading-none">&times;</button>
      </div>

      <div v-if="loading" class="text-center py-16 text-gray-400 text-sm">Memuat data...</div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
            <tr>
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Gambar</th>
              <th class="px-4 py-3">Judul</th>
              <th class="px-4 py-3">Pelapor</th>
              <th class="px-4 py-3">Kategori</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Penanganan</th>
              <th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="artikelList.length === 0">
              <td colspan="8" class="text-center py-12 text-gray-400">Belum ada laporan.</td>
            </tr>
            <tr v-for="(item, index) in artikelList" :key="item.id" class="hover:bg-gray-50 dark-hover transition">
              <td class="px-4 py-3 text-gray-500">{{ index + 1 }}</td>
              <td class="px-4 py-3">
                <img v-if="item.gambar_bukti"
                  :src="apiUrl + '/uploads/' + item.gambar_bukti"
                  class="w-14 h-14 object-cover rounded-lg border" alt="bukti" />
                <span v-else class="text-gray-300 text-xs italic">-</span>
              </td>
              <td class="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{{ item.judul }}</td>
              <td class="px-4 py-3 text-gray-600">
                <div>{{ item.nama_pelapor || '-' }}</div>
                <div class="text-xs text-gray-400">{{ item.email_pelapor || '' }}</div>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ item.nama_kategori || '-' }}</td>
              <td class="px-4 py-3">
                <span :class="statusClass(item.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <button @click="openTanggapanModal(item)"
                  class="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Tanggapi
                </button>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button @click="openModal(item)" class="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg transition">Edit</button>
                  <button @click="hapus(item.id)" class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- edit/tambah -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h3 class="text-lg font-bold text-gray-800">{{ isEdit ? 'Edit Laporan' : 'Tambah Laporan' }}</h3>
              <p class="text-gray-500 text-xs mt-0.5">{{ isEdit ? 'Ubah data laporan yang dipilih.' : 'Isi form untuk menambah laporan baru.' }}</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
          </div>
          <div class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul <span class="text-red-500">*</span></label>
              <input v-model="form.judul" type="text" placeholder="Judul laporan"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor</label>
                <input v-model="form.nama_pelapor" type="text" placeholder="Nama lengkap"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
                <input v-model="form.no_hp_pelapor" type="text" placeholder="08xx"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Pelapor</label>
              <input v-model="form.email_pelapor" type="email" placeholder="email@contoh.com"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select v-model="form.kategori_id"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">-- Pilih Kategori --</option>
                <option v-for="kat in kategoriList" :key="kat.id" :value="kat.id">{{ kat.nama_kategori }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input v-model="form.lokasi" type="text" placeholder="Lokasi kejadian"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Isi Laporan</label>
              <textarea v-model="form.isi_laporan" rows="4" placeholder="Deskripsi lengkap laporan..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="form.status"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Baru">Baru</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gambar Bukti</label>
              <input type="file" accept="image/*" @change="handleGambar" ref="fileInput"
                class="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100" />
              <div v-if="previewUrl" class="mt-3">
                <p class="text-xs text-gray-400 mb-1">Preview:</p>
                <img :src="previewUrl" class="w-full max-h-48 object-cover rounded-lg border" />
              </div>
              <div v-else-if="isEdit && form.gambarLama" class="mt-3">
                <p class="text-xs text-gray-400 mb-1">Gambar saat ini:</p>
                <img :src="apiUrl + '/uploads/' + form.gambarLama" class="w-full max-h-48 object-cover rounded-lg border" />
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button @click="closeModal" class="flex-1 border border-gray-300 text-gray-700 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition">Batal</button>
            <button @click="submitForm" :disabled="submitting"
              class="flex-1 btn-primary text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50">
              {{ submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah') }}
            </button>
          </div>
        </div>
      </div>

      <!-- respon admin -->
      <div v-if="showTanggapanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h3 class="text-lg font-bold text-gray-800">Laporan Penanganan</h3>
              <p class="text-gray-500 text-xs mt-0.5 truncate max-w-sm">{{ selectedLaporan?.judul }}</p>
            </div>
            <button @click="closeTanggapanModal" class="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
          </div>

          <div class="px-6 py-5 space-y-5">

            <div class="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <div class="flex items-center gap-2">
                <span :class="statusClass(selectedLaporan?.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">{{ selectedLaporan?.status }}</span>
                <span class="text-gray-400 text-xs">{{ selectedLaporan?.nama_kategori || 'Umum' }}</span>
              </div>
              <p class="text-gray-600 text-xs leading-relaxed">{{ selectedLaporan?.isi_laporan }}</p>
              <img v-if="selectedLaporan?.gambar_bukti"
                :src="apiUrl + '/uploads/' + selectedLaporan.gambar_bukti"
                class="w-full max-h-40 object-cover rounded-lg border mt-2" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-3">
                Riwayat
                <span class="ml-1 text-xs font-normal text-gray-400">({{ tanggapanList.length }})</span>
              </h4>

              <div v-if="loadingTanggapan" class="text-center py-6 text-gray-400 text-xs">Memuat tanggapan...</div>

              <div v-else-if="tanggapanList.length === 0" class="text-center py-6 text-gray-300 text-xs">
                Belum ada tanggapan untuk laporan ini.
              </div>

              <div v-else class="space-y-3">
                <div v-for="t in tanggapanList" :key="t.id"
                  class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-white text-xs font-bold">A</span>
                  </div>
                  <div class="flex-1">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none px-4 py-3">
                      <p class="text-sm text-gray-700 leading-relaxed">{{ t.isi_tanggapan }}</p>
                      <img v-if="t.gambar_tanggapan"
                        :src="apiUrl + '/uploads/tanggapan/' + t.gambar_tanggapan"
                        class="mt-2 w-full max-h-48 object-cover rounded-lg border border-blue-200 cursor-pointer"
                        @click="previewTanggapanImg = apiUrl + '/uploads/tanggapan/' + t.gambar_tanggapan" />
                    </div>
                    <div class="flex items-center gap-2 mt-1 px-1">
                      <span class="text-xs font-medium text-gray-600">{{ t.nama_user || 'Admin' }}</span>
                      <span class="text-gray-300">·</span>
                      <span class="text-xs text-gray-400">{{ formatDate(t.created_at) }}</span>
                      <button @click="hapusTanggapan(t.id)" class="ml-auto text-xs text-red-400 hover:text-red-600 transition">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Tambah</h4>

              <div v-if="tanggapanError" class="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg mb-3">
                {{ tanggapanError }}
              </div>

              <textarea v-model="tanggapanForm.isi_tanggapan" rows="3"
                placeholder="Tulis tindak lanjut atau keterangan dari petugas..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3"></textarea>

              <div class="mb-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">Lampirkan Foto (opsional)</label>
                <input type="file" accept="image/*" @change="handleGambarTanggapan"
                  class="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100" />
                <div v-if="previewTanggapanUpload" class="mt-2">
                  <div class="relative inline-block">
                    <img :src="previewTanggapanUpload" class="h-24 w-auto object-cover rounded-lg border" />
                    <button @click="clearGambarTanggapan"
                      class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center leading-none">&times;</button>
                  </div>
                </div>
              </div>

              <button @click="kirimTanggapan" :disabled="submittingTanggapan"
                class="w-full btn-primary text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50">
                {{ submittingTanggapan ? 'Mengirim...' : 'Kirim' }}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div v-if="previewTanggapanImg" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4"
        @click="previewTanggapanImg = null">
        <img :src="previewTanggapanImg" class="max-w-full max-h-full rounded-xl shadow-2xl" />
      </div>

    </div>
  </div>
  `,

  data() {
    return {
      apiUrl: "http://localhost/UAS/backend-api/public",
      artikelList: [],
      kategoriList: [],
      loading: true,
      showModal: false,
      isEdit: false,
      submitting: false,
      alertMsg: "",
      alertType: "success",
      previewUrl: null,
      fileGambar: null,
      form: {
        id: null, judul: "", nama_pelapor: "", email_pelapor: "",
        no_hp_pelapor: "", kategori_id: "", lokasi: "", isi_laporan: "",
        status: "Baru", gambarLama: null,
      },
      // Tanggapan
      showTanggapanModal: false,
      selectedLaporan: null,
      tanggapanList: [],
      loadingTanggapan: false,
      submittingTanggapan: false,
      tanggapanError: "",
      tanggapanForm: { isi_tanggapan: "" },
      fileGambarTanggapan: null,
      previewTanggapanUpload: null,
      previewTanggapanImg: null,
    };
  },

  mounted() {
    this.fetchLaporan();
    this.fetchKategori();
  },

  methods: {
    statusClass(s) {
      return {
        Baru: "bg-yellow-100 text-yellow-700",
        Diproses: "bg-blue-100 text-blue-700",
        Selesai: "bg-green-100 text-green-700",
        Ditolak: "bg-red-100 text-red-700",
      }[s] || "bg-gray-100 text-gray-600";
    },
    formatDate(d) {
      if (!d) return "-";
      return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    },
    showAlert(msg, type = "success") {
      this.alertMsg = msg;
      this.alertType = type;
      setTimeout(() => (this.alertMsg = ""), 4000);
    },
    fetchLaporan() {
      this.loading = true;
      axios.get(this.apiUrl + "/post")
        .then((res) => { this.artikelList = res.data.artikel || []; })
        .catch(() => { this.showAlert("Gagal memuat data laporan.", "error"); })
        .finally(() => { this.loading = false; });
    },
    fetchKategori() {
      axios.get(this.apiUrl + "/kategori")
        .then((res) => { this.kategoriList = res.data.kategori || []; })
        .catch(() => {});
    },

    // --- Modal Edit/Tambah ---
    openModal(item = null) {
      this.previewUrl = null;
      this.fileGambar = null;
      if (item) {
        this.isEdit = true;
        this.form = {
          id: item.id, judul: item.judul,
          nama_pelapor: item.nama_pelapor || "", email_pelapor: item.email_pelapor || "",
          no_hp_pelapor: item.no_hp_pelapor || "", kategori_id: item.kategori_id || "",
          lokasi: item.lokasi || "", isi_laporan: item.isi_laporan || "",
          status: String(item.status), gambarLama: item.gambar_bukti || null,
        };
      } else {
        this.isEdit = false;
        this.form = { id: null, judul: "", nama_pelapor: "", email_pelapor: "", no_hp_pelapor: "", kategori_id: "", lokasi: "", isi_laporan: "", status: "Baru", gambarLama: null };
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.previewUrl = null;
      this.fileGambar = null;
    },
    handleGambar(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.fileGambar = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    submitForm() {
      if (!this.form.judul.trim()) { this.showAlert("Judul tidak boleh kosong.", "error"); return; }
      this.submitting = true;
      const formData = new FormData();
      ["judul","nama_pelapor","email_pelapor","no_hp_pelapor","kategori_id","lokasi","isi_laporan","status"]
        .forEach(k => formData.append(k, this.form[k]));
      if (this.fileGambar) formData.append("gambar_bukti", this.fileGambar);
      const req = this.isEdit
        ? axios.post(this.apiUrl + "/post/update/" + this.form.id, formData)
        : axios.post(this.apiUrl + "/post", formData);
      req
        .then(() => { this.showAlert(this.isEdit ? "Laporan berhasil diubah." : "Laporan berhasil ditambahkan."); this.closeModal(); this.fetchLaporan(); })
        .catch((err) => { this.showAlert(err.response?.data?.messages?.error || "Terjadi kesalahan.", "error"); })
        .finally(() => { this.submitting = false; });
    },
    hapus(id) {
      if (!confirm("Yakin ingin menghapus laporan ini?")) return;
      axios.delete(this.apiUrl + "/post/" + id)
        .then(() => { this.showAlert("Laporan berhasil dihapus."); this.fetchLaporan(); })
        .catch(() => { this.showAlert("Gagal menghapus laporan.", "error"); });
    },

    // --- Modal Tanggapan ---
    openTanggapanModal(item) {
      this.selectedLaporan = item;
      this.tanggapanList = [];
      this.tanggapanForm = { isi_tanggapan: "" };
      this.tanggapanError = "";
      this.fileGambarTanggapan = null;
      this.previewTanggapanUpload = null;
      this.showTanggapanModal = true;
      document.body.style.overflow = "hidden";
      this.fetchTanggapan(item.id);
    },
    closeTanggapanModal() {
      this.showTanggapanModal = false;
      this.selectedLaporan = null;
      this.previewTanggapanImg = null;
      document.body.style.overflow = "";
    },
    fetchTanggapan(laporanId) {
      this.loadingTanggapan = true;
      axios.get(this.apiUrl + "/tanggapan/" + laporanId)
        .then(res => { this.tanggapanList = res.data.tanggapan || []; })
        .catch(() => { this.tanggapanList = []; })
        .finally(() => { this.loadingTanggapan = false; });
    },
    handleGambarTanggapan(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.fileGambarTanggapan = file;
      this.previewTanggapanUpload = URL.createObjectURL(file);
    },
    clearGambarTanggapan() {
      this.fileGambarTanggapan = null;
      this.previewTanggapanUpload = null;
    },
    kirimTanggapan() {
      if (!this.tanggapanForm.isi_tanggapan.trim()) {
        this.tanggapanError = "Isi tanggapan tidak boleh kosong.";
        return;
      }
      this.submittingTanggapan = true;
      this.tanggapanError = "";
      const fd = new FormData();
      fd.append("laporan_id", this.selectedLaporan.id);
      fd.append("isi_tanggapan", this.tanggapanForm.isi_tanggapan);
      if (this.fileGambarTanggapan) fd.append("gambar_tanggapan", this.fileGambarTanggapan);
      axios.post(this.apiUrl + "/tanggapan", fd)
        .then(() => {
          this.tanggapanForm = { isi_tanggapan: "" };
          this.fileGambarTanggapan = null;
          this.previewTanggapanUpload = null;
          this.fetchTanggapan(this.selectedLaporan.id);
          this.fetchLaporan();
        })
        .catch(() => { this.tanggapanError = "Gagal mengirim tanggapan. Coba lagi."; })
        .finally(() => { this.submittingTanggapan = false; });
    },
    hapusTanggapan(id) {
      if (!confirm("Hapus tanggapan ini?")) return;
      axios.delete(this.apiUrl + "/tanggapan/" + id)
        .then(() => { this.fetchTanggapan(this.selectedLaporan.id); })
        .catch(() => { this.tanggapanError = "Gagal menghapus tanggapan."; });
    },
  },
};