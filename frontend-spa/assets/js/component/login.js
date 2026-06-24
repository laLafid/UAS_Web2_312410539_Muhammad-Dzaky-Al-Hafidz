const Login = {
  template: `
  <div class="min-h-screen flex items-center justify-center p-4" style="background-color: var(--color-primary)">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

      <!-- Header -->
      <div class="px-8 py-8 text-center" style="background-color: var(--color-primary)">
        <div class="w-14 h-14 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
          <img src="gambar/favicon.ico" alt="CLapor" class="w-14 h-14 rounded-lg object-cover" />
        </div>
        <h1 class="text-2xl font-bold text-white">Portal Admin</h1>
        <p class="text-white text-opacity-70 text-sm mt-1 opacity-70">Sistem Pelaporan Pengaduan</p>
      </div>

      <!-- Form -->
      <div class="px-8 py-8">
        <div class="mb-5">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
          <input v-model="username" type="text" placeholder="Masukkan email atau username"
            @keyup.enter="handleLogin"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Masukkan password"
              @keyup.enter="handleLogin"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition pr-10" />
            <button @click="showPass = !showPass" type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
              {{ showPass ? 'Sembunyikan' : 'Tampilkan' }}
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <button @click="handleLogin" :disabled="loading"
          class="w-full btn-primary text-white font-semibold py-3 rounded-lg transition text-sm disabled:opacity-60">
          {{ loading ? 'Memverifikasi...' : 'Masuk ke Dashboard' }}
        </button>
      </div>

      <div class="px-8 pb-6 text-center text-xs text-gray-400">
        Hanya untuk administrator dan petugas yang berwenang
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      username: "",
      password: "",
      showPass: false,
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        this.errorMessage = "Email dan password wajib diisi.";
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      axios
        .post(apiUrl + "/api/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.data.status === 200) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userToken", response.data.data.token);
            localStorage.setItem("userName", response.data.data.username);
            if (this.$root) {
              this.$root.isLoggedIn = true;
            }
            this.$router.push("/artikel");
          }
        })
        .catch((error) => {
          this.errorMessage =
            error.response?.data?.messages || "Email atau password salah.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
