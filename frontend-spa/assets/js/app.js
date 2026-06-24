const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const apiUrl = "http://localhost/UAS/backend-api/public";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSendingPost = error.config && error.config.url.endsWith('/post') && error.config.method === 'post';

    if (error.response && error.response.status === 401 && !isSendingPost) {
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      localStorage.clear();
      window.location.href = "#/login";
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/laporan", component: LaporanPublik },
  { path: "/artikel", component: Artikel, meta: { requiresAuth: true } },
  { path: "/about", component: About },
];

const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  if (to.matched.some((r) => r.meta.requiresAuth) && !isAuthenticated) {
    alert("Akses Ditolak! Anda harus login terlebih dahulu.");
    next("/login");
  } else {
    next();
  }
});

function applySettings() {
  applyTheme(localStorage.getItem("silapor-theme") || "blue");
  applyCustomColor(localStorage.getItem("silapor-custom-color") || "");
  applyFontSize(localStorage.getItem("silapor-font") || "md");
  applyFontFamily(localStorage.getItem("silapor-font-family") || "inter");
  applyDarkMode(localStorage.getItem("silapor-dark") === "true");
}

function applyTheme(name) {
  const themes = {
    blue:  { primary: "#1e40af", dark: "#1e3a8a" },
    green: { primary: "#166534", dark: "#14532d" },
    red:   { primary: "#991b1b", dark: "#7f1d1d" },
    slate: { primary: "#334155", dark: "#1e293b" },
    teal:  { primary: "#0f766e", dark: "#115e59" },
  };
  const t = themes[name] || themes.blue;
  document.documentElement.style.setProperty("--color-primary", t.primary);
  document.documentElement.style.setProperty("--color-primary-dark", t.dark);
}

// Darken a hex color by a given ratio (0–1)
function darkenHex(hex, ratio) {
  let r = parseInt(hex.slice(1,3),16);
  let g = parseInt(hex.slice(3,5),16);
  let b = parseInt(hex.slice(5,7),16);
  r = Math.round(r * (1 - ratio));
  g = Math.round(g * (1 - ratio));
  b = Math.round(b * (1 - ratio));
  return "#" + [r,g,b].map(x => x.toString(16).padStart(2,"0")).join("");
}

function applyCustomColor(hex) {
  if (!hex) return;
  const dark = darkenHex(hex, 0.12);
  document.documentElement.style.setProperty("--color-primary", hex);
  document.documentElement.style.setProperty("--color-primary-dark", dark);
}

function applyFontSize(size) {
  document.body.classList.remove("font-sm", "font-md", "font-lg");
  document.body.classList.add("font-" + size);
}

function applyFontFamily(family) {
  const families = ["inter", "poppins", "nunito", "lato", "serif", "mono"];
  families.forEach(f => document.body.classList.remove("font-" + f));
  document.body.classList.add("font-" + family);
}

function applyDarkMode(isDark) {
  document.body.classList.toggle("dark", isDark);
}

window.applyTheme       = applyTheme;
window.applyCustomColor = applyCustomColor;
window.darkenHex        = darkenHex;
window.applyFontSize    = applyFontSize;
window.applyFontFamily  = applyFontFamily;
window.applyDarkMode    = applyDarkMode;

const app = createApp({
  data() { return { isLoggedIn: false }; },
  mounted() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    applySettings();
  },
  methods: {
    logout() {
      if (confirm("Yakin ingin keluar?")) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userToken");
        this.isLoggedIn = false;
        this.$router.push("/");
      }
    },
  },
});

app.use(router);
app.mount("#app");