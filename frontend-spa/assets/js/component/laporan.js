const LaporanPublik = {
  template: `
  <div class="min-h-screen bg-gray-50 py-10 px-6">
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Laporan Publik</h2>
        <p class="text-gray-500 text-sm mt-1">Daftar pengaduan masyarakat yang telah masuk ke sistem.</p>
      </div>

      <!-- Filter Status -->
      <div class="flex gap-2 flex-wrap mb-6">
        <button v-for="f in filters" :key="f.value"
          @click="activeFilter = f.value"
          :class="activeFilter === f.value ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition">
          {{ f.label }} ({{ f.value === 'semua' ? total : counts[f.value] || 0 }})
        </button>
      </div>

      <div v-if="loading" class="text-center py-16 text-gray-400 text-sm">Memuat laporan...</div>

      <div v-else-if="filtered.length === 0" class="text-center py-16 text-gray-400 text-sm">
        Tidak ada laporan untuk kategori ini.
      </div>

      <div v-else class="grid md:grid-cols-2 gap-4">
        <div v-for="item in filtered" :key="item.id"
          class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition cursor-pointer"
          @click="openDetail(item)">
          <div class="flex items-start justify-between gap-3 mb-3">
            <h3 class="font-semibold text-gray-800 text-sm leading-snug">{{ item.judul }}</h3>
            <span :class="statusClass(item.status)"
              class="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0">
              {{ item.status }}
            </span>
          </div>
          <img v-if="item.gambar_bukti"
            :src="apiUrl + '/uploads/' + item.gambar_bukti"
            class="w-full h-36 object-cover rounded-lg mb-3 border" />
          <p class="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-3">{{ item.isi_laporan }}</p>
          <div class="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
            <span>{{ item.nama_kategori || 'Umum' }}</span>
            <span>{{ item.lokasi || '-' }}</span>
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Lihat detail
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- detal -->
    <div v-if="showDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDetail">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div class="flex items-center gap-2">
            <span :class="statusClass(detailLaporan?.status)" class="text-xs px-2 py-1 rounded-full font-medium">
              {{ detailLaporan?.status }}
            </span>
            <span class="text-xs text-gray-400">{{ detailLaporan?.nama_kategori || 'Umum' }}</span>
          </div>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">&times;</button>
        </div>

        <div class="px-6 py-5 space-y-5">

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-1">{{ detailLaporan?.judul }}</h3>
            <div class="flex items-center gap-3 text-xs text-gray-400 mb-4">
              <span>{{ detailLaporan?.nama_pelapor || 'Anonim' }}</span>
              <span>·</span>
              <span>{{ detailLaporan?.lokasi || '-' }}</span>
              <span>·</span>
              <span>{{ formatDate(detailLaporan?.created_at) }}</span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">{{ detailLaporan?.isi_laporan }}</p>
          </div>

          <div v-if="detailLaporan?.gambar_bukti">
            <p class="text-xs font-medium text-gray-500 mb-2">Foto Bukti Laporan</p>
            <img :src="apiUrl + '/uploads/' + detailLaporan.gambar_bukti"
              class="w-full max-h-56 object-cover rounded-xl border cursor-pointer"
              @click="previewImg = apiUrl + '/uploads/' + detailLaporan.gambar_bukti" />
          </div>

          <div class="border-t border-gray-100 pt-4">
            <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tanggapan Petugas
              <span class="text-xs font-normal text-gray-400">({{ tanggapanList.length }})</span>
            </h4>

            <div v-if="loadingTanggapan" class="text-center py-6 text-gray-400 text-xs">Memuat tanggapan...</div>

            <div v-else-if="tanggapanList.length === 0"
              class="bg-gray-50 rounded-xl p-6 text-center">
              <div class="text-2xl mb-2">📋</div>
              <p class="text-gray-400 text-xs">Belum ada tanggapan dari petugas.</p>
            </div>

            <div v-else class="space-y-3">
              <div v-for="t in tanggapanList" :key="t.id" class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-white text-xs font-bold">P</span>
                </div>
                <div class="flex-1">
                  <div class="bg-blue-50 border border-blue-100 rounded-xl rounded-tl-none px-4 py-3">
                    <p class="text-sm text-gray-700 leading-relaxed">{{ t.isi_tanggapan }}</p>
                    <img v-if="t.gambar_tanggapan"
                      :src="apiUrl + '/uploads/tanggapan/' + t.gambar_tanggapan"
                      class="mt-2 w-full max-h-48 object-cover rounded-lg border border-blue-200 cursor-pointer"
                      @click="previewImg = apiUrl + '/uploads/tanggapan/' + t.gambar_tanggapan" />
                  </div>
                  <div class="flex items-center gap-2 mt-1 px-1">
                    <span class="text-xs font-medium text-gray-600">{{ t.nama_user || 'Petugas' }}</span>
                    <span class="text-gray-300">·</span>
                    <span class="text-xs text-gray-400">{{ formatDate(t.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="detailLaporan?.status === 'Selesai'" class="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-green-800">Laporan Telah Diselesaikan</p>
                <p class="text-xs text-green-600 mt-0.5">Pengaduan ini telah ditangani dan dinyatakan selesai oleh petugas.</p>
              </div>
            </div>

            <div v-else-if="detailLaporan?.status === 'Ditolak'" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-red-800">Laporan Ditolak</p>
                <p class="text-xs text-red-600 mt-0.5">Pengaduan ini tidak dapat diproses. Lihat tanggapan petugas untuk keterangan lebih lanjut.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div v-if="previewImg" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
      @click="previewImg = null">
      <img :src="previewImg" class="max-w-full max-h-full rounded-xl shadow-2xl" />
      <button class="absolute top-4 right-4 text-white text-2xl font-bold opacity-70 hover:opacity-100">&times;</button>
    </div>

  </div>
  `,
  data() {
    return {
      apiUrl: "http://localhost/UAS/backend-api/public",
      laporan: [],
      loading: true,
      activeFilter: "semua",
      filters: [
        { label: "Semua", value: "semua" },
        { label: "Baru", value: "Baru" },
        { label: "Diproses", value: "Diproses" },
        { label: "Selesai", value: "Selesai" },
        { label: "Ditolak", value: "Ditolak" },
      ],
      // Detail
      showDetail: false,
      detailLaporan: null,
      tanggapanList: [],
      loadingTanggapan: false,
      previewImg: null,
    };
  },
  computed: {
    total() { return this.laporan.length; },
    counts() {
      return this.laporan.reduce((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      }, {});
    },
    filtered() {
      if (this.activeFilter === "semua") return this.laporan;
      return this.laporan.filter(l => l.status === this.activeFilter);
    },
  },
  mounted() {
    axios.get(this.apiUrl + "/post")
      .then(res => { this.laporan = res.data.artikel || []; })
      .catch(() => {})
      .finally(() => { this.loading = false; });
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
    openDetail(item) {
      this.detailLaporan = item;
      this.tanggapanList = [];
      this.showDetail = true;
      document.body.style.overflow = "hidden";
      this.loadingTanggapan = true;
      axios.get(this.apiUrl + "/tanggapan/" + item.id)
        .then(res => { this.tanggapanList = res.data.tanggapan || []; })
        .catch(() => { this.tanggapanList = []; })
        .finally(() => { this.loadingTanggapan = false; });
    },
    closeDetail() {
      this.showDetail = false;
      this.detailLaporan = null;
      this.previewImg = null;
      document.body.style.overflow = "";
    },
  },
};