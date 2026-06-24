const About = {
  template: `
  <div class="min-h-screen bg-gray-50 py-10 px-6">
    <div class="max-w-5xl mx-auto">

      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Tentang</h2>
        <p class="text-gray-500 text-sm mt-1">Informasi.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">

        <!-- profil -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-primary h-20"></div>
          <div class="px-6 pb-6 -mt-10">
            <img :src="profile.avatar" :alt="profile.nama"
              class="w-20 h-20 rounded-full border-4 border-white shadow object-cover mb-4" />
            <h3 class="text-lg font-bold text-gray-800">{{ profile.nama }}</h3>
            <p class="text-sm text-primary font-medium mb-4">Dev</p>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-400 mb-1">NIM</div>
                <div class="font-semibold text-gray-700">{{ profile.nim }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="text-xs text-gray-400 mb-1">Kelas</div>
                <div class="font-semibold text-gray-700">{{ profile.kelas }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pengaturan -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 class="text-base font-bold text-gray-800">Pengaturan Tampilan</h3>

          <!-- Tema Warna -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2">Warna Tema</p>
            <div class="flex gap-3 flex-wrap items-center">
              <!-- Preset swatches -->
              <button v-for="t in themes" :key="t.name"
                @click="changeTheme(t.name)"
                :style="{ backgroundColor: t.color }"
                :class="activeTheme === t.name && !customColor ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''"
                class="w-8 h-8 rounded-full transition-transform flex-shrink-0"
                :title="t.label">
              </button>

              <!-- Custom color trigger button -->
              <div class="relative flex-shrink-0" ref="pickerWrap">
                <button @click="togglePicker"
                  :class="customColor ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'border-2 border-dashed border-gray-400 hover:border-gray-600'"
                  :style="customColor ? { backgroundColor: customColor, border: 'none' } : { backgroundColor: 'white' }"
                  class="w-8 h-8 rounded-full transition-transform flex items-center justify-center"
                  title="Warna kustom">
                  <span v-if="!customColor" class="text-gray-400 text-base leading-none select-none">+</span>
                  <span v-else class="text-white text-xs leading-none select-none opacity-70">✓</span>
                </button>
           
                <div v-if="showPicker"
                  class="fixed z-[999] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-56"
                  :style="pickerStyle">
                
                  <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>

                  <p class="text-xs font-semibold text-gray-600 mb-3">Warna Kustom</p>

                  <div class="flex justify-center mb-3">
                    <input type="color" :value="customColor || currentPrimaryHex"
                      @input="onColorInput($event.target.value)"
                      class="w-24 h-24 rounded-xl border border-gray-200 cursor-pointer p-1 bg-white" />
                  </div>

                  <!-- Hex input -->
                  <input type="text" :value="customColor || currentPrimaryHex"
                    @input="onColorInput($event.target.value)"
                    maxlength="7"
                    placeholder="#1e40af"
                    class="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary mb-3" />

                  <div v-if="colorShades.length" class="mb-3">
                    <p class="text-xs text-gray-400 mb-1.5">Variasi warna</p>
                    <div class="flex gap-1.5 flex-wrap">
                      <button v-for="shade in colorShades" :key="shade"
                        @click="onColorInput(shade)"
                        :style="{ backgroundColor: shade }"
                        :class="(customColor === shade) ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'hover:scale-110'"
                        class="w-6 h-6 rounded-md transition-transform flex-shrink-0"
                        :title="shade">
                      </button>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button v-if="customColor" @click="clearCustomColor"
                      class="flex-1 text-xs border border-red-200 text-red-500 hover:bg-red-50 py-1.5 rounded-lg transition">
                      Reset
                    </button>
                    <button @click="showPicker = false"
                      class="flex-1 text-xs btn-primary text-white py-1.5 rounded-lg transition">
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-2">Aktif: <span class="font-medium text-gray-600">{{ activeThemeName }}</span></p>
          </div>

          <!-- Mode hitam -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-500 mb-2">Mode</p>
              <div class="flex gap-2">
                <button @click="setDark(false)"
                  :class="!isDark ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium transition">
                  Terang
                </button>
                <button @click="setDark(true)"
                  :class="isDark ? 'text-white ring-1 ring-gray-400' : 'bg-gray-100 text-gray-600'"
                  :style="isDark ? { backgroundColor: currentActiveColor } : {}"
                  class="flex-1 py-1.5 rounded-lg text-xs font-medium transition">
                  Gelap
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 mb-2">Gaya Font</p>
              <select v-model="activeFontFamily" @change="setFontFamily(activeFontFamily)"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50">
                <option v-for="f in fontFamilies" :key="f.value" :value="f.value">{{ f.label }}</option>
              </select>
            </div>
          </div>

        </div>

        <!-- Tentang Proyek -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:col-span-2">
          <h3 class="text-base font-bold text-gray-800 mb-3">Tentang Proyek</h3>
          <p class="text-gray-500 text-sm leading-relaxed mb-5">
            CLapor dibangun sebagai proyek UAS Mata Kuliah Pemrograman Web 2 menggunakan arsitektur
            Decoupled.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="tech in techs" :key="tech.name" class="bg-gray-50 rounded-lg p-3 text-sm">
              <div class="font-medium text-gray-700">{{ tech.name }}</div>
              <div class="text-xs text-gray-400">{{ tech.role }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  `,
  data() {
    return {
      activeTheme: localStorage.getItem("silapor-theme") || "blue",
      isDark:      localStorage.getItem("silapor-dark") === "true",
      activeFont:  localStorage.getItem("silapor-font") || "md",
      activeFontFamily: localStorage.getItem("silapor-font-family") || "inter",
      customColor: localStorage.getItem("silapor-custom-color") || "",
      showPicker: false,
      currentPrimaryHex: "#1e40af",
      colorShades: [],
      pickerStyle: {},
      fontFamilies: [
        { value: "inter",   label: "Inter",               shortLabel: "Inter",      css: "Inter, system-ui, sans-serif" },
        { value: "poppins", label: "Poppins",             shortLabel: "Poppins",    css: "Poppins, system-ui, sans-serif" },
        { value: "nunito",  label: "Nunito",              shortLabel: "Nunito",     css: "Nunito, system-ui, sans-serif" },
        { value: "lato",    label: "Lato",                shortLabel: "Lato",       css: "Lato, system-ui, sans-serif" },
        { value: "serif",   label: "Georgia",             shortLabel: "Georgia",    css: "Georgia, 'Times New Roman', serif" },
        { value: "mono",    label: "Monospace",           shortLabel: "Monospace",  css: "'Courier New', monospace" },
      ],
      themes: [
        { name: "blue",  label: "Biru",  color: "#1e40af" },
        { name: "green", label: "Hijau", color: "#166534" },
        { name: "red",   label: "Merah", color: "#991b1b" },
        { name: "slate", label: "Abu",   color: "#334155" },
        { name: "teal",  label: "Teal",  color: "#0f766e" },
      ],

      profile: {
        nama: "[][][][]",
        nim: "312410539",
        kelas: "I241E",
        avatar: "gambar/ayo.png",
      },
      techs: [
        { name: "CodeIgniter 4", role: "Backend REST API" },
        { name: "Vue.js",        role: "Frontend SPA" },
        { name: "TailwindCSS",   role: "UI" },
        { name: "Axios",         role: "HTTP Client" },
      ],
    };
  },
  mounted() {
    document.addEventListener("click", this.onClickOutside);
    // Sync currentPrimaryHex from active theme on load
    const saved = localStorage.getItem("silapor-theme") || "blue";
    const themeMap = { blue:"#1e40af", green:"#166534", red:"#991b1b", slate:"#334155", teal:"#0f766e" };
    this.currentPrimaryHex = themeMap[saved] || "#1e40af";
    if (this.customColor) this.colorShades = this.generateShades(this.customColor);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onClickOutside);
  },
  computed: {
    currentActiveColor() {
      if (this.customColor) return this.customColor;
      const themeMap = { blue:"#1e40af", green:"#166534", red:"#991b1b", slate:"#334155", teal:"#0f766e" };
      return themeMap[this.activeTheme] || "#1e40af";
    },
    activeThemeName() {
      if (this.customColor) return "Kustom (" + this.customColor + ")";
      return this.themes.find(t => t.name === this.activeTheme)?.label || "Biru";
    },
    fontFamilyPreview() {
      return this.fontFamilies.find(f => f.value === this.activeFontFamily)?.css || "Inter, system-ui, sans-serif";
    },
    activeFontFamilyLabel() {
      return this.fontFamilies.find(f => f.value === this.activeFontFamily)?.shortLabel || "Inter";
    },
  },
  methods: {
    togglePicker() {
      if (!this.showPicker) {
        const btn = this.$refs.pickerWrap;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          let left = rect.left + rect.width / 2 - 112; // 112 = half of w-56 (224px)
          let top  = rect.bottom + 8;
          left = Math.max(8, Math.min(left, window.innerWidth - 232));
          this.pickerStyle = { top: top + "px", left: left + "px" };
        }
      }
      this.showPicker = !this.showPicker;
    },
    onClickOutside(e) {
      const wrap = this.$refs.pickerWrap;
      if (wrap && !wrap.contains(e.target)) this.showPicker = false;
    },
    changeTheme(name) {
      this.activeTheme = name;
      this.customColor = "";
      localStorage.setItem("silapor-theme", name);
      localStorage.removeItem("silapor-custom-color");
      window.applyTheme(name);
      const themeMap = { blue:"#1e40af", green:"#166534", red:"#991b1b", slate:"#334155", teal:"#0f766e" };
      this.currentPrimaryHex = themeMap[name] || "#1e40af";
    },
    generateShades(hex) {
      let r = parseInt(hex.slice(1,3),16)/255;
      let g = parseInt(hex.slice(3,5),16)/255;
      let b = parseInt(hex.slice(5,7),16)/255;
      const max = Math.max(r,g,b), min = Math.min(r,g,b);
      let h, s, l = (max+min)/2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch(max) {
          case r: h = ((g-b)/d + (g<b?6:0))/6; break;
          case g: h = ((b-r)/d + 2)/6; break;
          case b: h = ((r-g)/d + 4)/6; break;
        }
      }
      h = Math.round(h*360); s = Math.round(s*100);
      const hsl2hex = (h,s,l) => {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1-l);
        const f = n => { const k=(n+h/30)%12; return l - a*Math.max(Math.min(k-3,9-k,1),-1); };
        return "#"+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,"0")).join("");
      };
      const lightnesses = [85, 73, 62, 52, 42, 33, 24, 16];
      return lightnesses.map(lv => hsl2hex(h, s, lv));
    },
    onColorInput(hex) {
      if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
      this.customColor = hex;
      this.activeTheme = "";
      this.colorShades = this.generateShades(hex);
      localStorage.setItem("silapor-custom-color", hex);
      localStorage.removeItem("silapor-theme");
      window.applyCustomColor(hex);
    },
    clearCustomColor() {
      this.customColor = "";
      localStorage.removeItem("silapor-custom-color");
      const fallback = "blue";
      this.activeTheme = fallback;
      localStorage.setItem("silapor-theme", fallback);
      window.applyTheme(fallback);
    },
    setDark(val) {
      this.isDark = val;
      localStorage.setItem("silapor-dark", val);
      window.applyDarkMode(val);
    },
    setFont(size) {
      this.activeFont = size;
      localStorage.setItem("silapor-font", size);
      window.applyFontSize(size);
    },
    setFontFamily(family) {
      this.activeFontFamily = family;
      localStorage.setItem("silapor-font-family", family);
      window.applyFontFamily(family);
    },
  },
};