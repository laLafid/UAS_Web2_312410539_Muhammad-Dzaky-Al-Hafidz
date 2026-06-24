const BuatLaporanModal = {
  template: `
  <div class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background:rgba(0,0,0,0.5)">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
  
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div>
          <h2 class="text-lg font-bold text-gray-800">Buat Laporan</h2>
          <p class="text-gray-500 text-xs mt-0.5">Isi form berikut untuk menyampaikan pengaduan Anda.</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
      </div>

      <div class="p-6">
 
        <div v-if="submitted" class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div class="text-4xl mb-3">&#10003;</div>
          <h3 class="font-bold text-green-800 text-lg mb-2">Laporan Berhasil Dikirim</h3>
          <p class="text-green-700 text-sm mb-6">Laporan Anda telah kami terima dan akan segera ditindaklanjuti.</p>
          <div class="flex justify-center gap-3">
            <button @click="reset" class="btn-primary text-white px-5 py-2 rounded-lg text-sm font-medium transition">
              Buat Laporan Lagi
            </button>
            <button @click="$emit('close'); $router.push('/laporan')"
              class="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
              Lihat Laporan 
            </button>
          </div>
        </div>

        <!-- Form -->
        <div v-else class="space-y-5">
          <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {{ errorMsg }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Judul Laporan <span class="text-red-500">*</span></label>
            <input v-model="form.judul" type="text" placeholder="Contoh: Jalan rusak di Jl. Merdeka"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <input type="text" name="honeypot" style="display:none" value="" />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pelapor <span class="text-red-500">*</span></label>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email_pelapor" type="email" placeholder="email@contoh.com"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Pengaduan <span class="text-red-500">*</span></label>
            <select v-model="form.kategori_id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">-- Pilih Kategori --</option>
              <option v-for="kat in kategoriList" :key="kat.id" :value="kat.id">{{ kat.nama_kategori }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Kejadian</label>
            <input v-model="form.lokasi" type="text" placeholder="Alamat atau nama tempat"
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Isi Laporan <span class="text-red-500">*</span></label>
            <textarea v-model="form.isi_laporan" rows="5"
              placeholder="Jelaskan secara detail kejadian atau masalah yang ingin Anda laporkan..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Bukti</label>
            <input type="file" accept="image/*" @change="handleGambar"
              class="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-primary hover:file:bg-blue-100" />
            <div v-if="previewUrl" class="mt-3">
              <img :src="previewUrl" class="w-full max-h-48 object-cover rounded-lg border" />
            </div>
          </div>

          <div class="flex gap-3 pt-1">
            <button @click="$emit('close')"
              class="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg text-sm hover:bg-gray-50 transition">
              Batal
            </button>
            <button @click="kirimLaporan" :disabled="submitting"
              class="flex-1 btn-primary text-white font-semibold py-3 rounded-lg transition text-sm disabled:opacity-50">
              {{ submitting ? 'Mengirim...' : 'Kirim Laporan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      kategoriList: [],
      submitted: false,
      submitting: false,
      errorMsg: "",
      previewUrl: null,
      fileGambar: null,
      form: {
        judul: "", nama_pelapor: "", email_pelapor: "",
        no_hp_pelapor: "", kategori_id: "", lokasi: "", isi_laporan: "",
      },
    };
  },
  mounted() {
    axios.get(apiUrl + "/kategori")
      .then(res => { this.kategoriList = res.data.kategori || []; })
      .catch(() => {});
    document.body.style.overflow = "hidden";
  },
  beforeUnmount() {
    document.body.style.overflow = "";
  },
  methods: {
    handleGambar(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.fileGambar = file;
      this.previewUrl = URL.createObjectURL(file);
    },
    kirimLaporan() {
      if (!this.form.judul.trim() || !this.form.nama_pelapor.trim() || !this.form.isi_laporan.trim()) {
        this.errorMsg = "Judul, nama pelapor, dan isi laporan wajib diisi.";
        return;
      }
      if (!this.form.kategori_id) {
        this.errorMsg = "Kategori pengaduan wajib dipilih.";
        return;
      }
      this.submitting = true;
      this.errorMsg = "";
      const fd = new FormData();
      Object.entries(this.form).forEach(([k, v]) => fd.append(k, v));
      fd.append("status", "Baru");
      if (this.fileGambar) fd.append("gambar_bukti", this.fileGambar);
      axios.post(apiUrl + "/post", fd)
        .then(() => { this.submitted = true; })
        .catch(() => { this.errorMsg = "Terjadi kesalahan. Coba lagi."; })
        .finally(() => { this.submitting = false; });
    },
    reset() {
      this.submitted = false;
      this.form = { judul: "", nama_pelapor: "", email_pelapor: "", no_hp_pelapor: "", kategori_id: "", lokasi: "", isi_laporan: "" };
      this.previewUrl = null;
      this.fileGambar = null;
    },
  },
  emits: ["close"],
};

const Home = {
  components: { BuatLaporanModal },
  template: `
  <div class="min-h-screen">
    <BuatLaporanModal v-if="showModal" @close="showModal = false" />

    <!-- Hero -->
    <div class="bg-primary text-white py-20 px-6 text-center">
      <div class="max-w-5xl mx-auto">
        <div class="inline-block bg-white bg-opacity-10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          Layanan Pengaduan Digital
        </div>
        <h1 class="text-4xl font-bold mb-4 leading-tight">Sistem Pelaporan<br>Pengaduan Masyarakat</h1>
        <p class="text-blue-100 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
          Sampaikan keluhan, aspirasi, dan laporan kejadian di sekitar Anda.
          Kami pastikan setiap laporan ditangani dengan cepat dan transparan.
        </p>
        <div class="flex justify-center gap-3 flex-wrap">
          <button @click="showModal = true"
            class="bg-white text-primary font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition">
            Buat Laporan
          </button>
          <router-link to="/laporan"
            class="border border-white text-white px-6 py-2.5 rounded-lg text-sm hover:bg-white hover:bg-opacity-10 transition">
            Lihat Laporan
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="max-w-5xl mx-auto px-6 -mt-8 mb-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center cursor-pointer hover:shadow-md transition"
          @click="stat.route && $router.push(stat.route)">
          <div class="text-3xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-xs text-gray-500 mt-1">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Info Cards -->
    <div class="max-w-5xl mx-auto px-6 pb-16">
      <h2 class="text-lg font-bold text-gray-700 mb-6 text-center">Cara Menggunakan</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="(info, i) in infos" :key="info.title"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div class="text-primary font-bold text-2xl mb-3">0{{ i + 1 }}</div>
          <h3 class="font-semibold text-gray-800 mb-2">{{ info.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ info.desc }}</p>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      showModal: false,
      stats: [
        { value: "—", label: "Total Laporan", route: "/laporan" },
        { value: "—", label: "Menunggu", route: "/laporan" },
        { value: "—", label: "Diproses", route: "/laporan" },
        { value: "—", label: "Selesai", route: "/laporan" },
      ],
      infos: [
        { title: "Isi Form Laporan", desc: "Lengkapi data diri dan deskripsi kejadian beserta lokasi dan foto bukti." },
        { title: "Laporan Diverifikasi", desc: "Petugas akan memverifikasi dan memproses laporan yang masuk." },
        { title: "Pantau Status", desc: "Cek perkembangan laporan Anda di halaman Laporan." },
      ],
    };
  },
  mounted() {
    axios.get(apiUrl + "/post").then((res) => {
      const data = res.data.artikel || [];
      this.stats[0].value = data.length;
      this.stats[1].value = data.filter(d => d.status === "Baru").length;
      this.stats[2].value = data.filter(d => d.status === "Diproses").length;
      this.stats[3].value = data.filter(d => d.status === "Selesai").length;
    }).catch(() => {});
  },
};