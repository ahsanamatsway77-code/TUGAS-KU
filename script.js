"use strict";
/* ===== Helper ===== */
const KEY = "tugasku.v2";
const $ = (s) => document.querySelector(s);
const esc = (t) =>
  String(t ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const day = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};
const dt = (s) => new Date(s + "T00:00");
const tgl = (s) =>
  dt(s).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
const sel = (list, v) =>
  list.map((x) => `<option ${x == v ? "selected" : ""}>${x}</option>`).join("");
const toast = (m) => {
  const t = $("#toast");
  t.textContent = m;
  t.classList.add("on");
  setTimeout(() => t.classList.remove("on"), 2200);
};
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const CATS = [
  "Tugas",
  "Makalah",
  "Presentasi",
  "Praktikum",
  "Quiz",
  "Ujian",
  "Project",
];
const PRI = { Low: 1, Medium: 2, High: 3, Urgent: 4 };
const STAT = ["Belum dimulai", "Sedang dikerjakan", "Selesai"];
const NCAT = [
  "Informatika",
  "Matematika",
  "Fisika",
  "Elektronika",
  "Bahasa Inggris",
  "Umum",
];
const GR = {
  A: 4,
  "A-": 3.75,
  "B+": 3.25,
  B: 3,
  "B-": 2.75,
  "C+": 2.25,
  C: 2,
  D: 1,
  E: 0,
};
const QUOTES = [
  "Mulai dari yang paling kecil, yang penting mulai.",
  "Belajar 30 menit tiap hari lebih ampuh daripada begadang semalam.",
  "Deadline bukan musuh, cuma pengingat.",
  "Satu bug yang kamu pahami hari ini menghemat sepuluh jam besok.",
  "Istirahat itu bagian dari belajar, bukan hadiah setelahnya.",
];

/* ===== Konten statis: materi & kuis ===== */
const MAT = [
  {
    id: "ohm",
    t: "Hukum Ohm",
    k: "Fisika & Elektro",
    lv: "Mudah",
    min: 15,
    d: "Hubungan tegangan, arus, dan hambatan.",
    b: "Hukum Ohm: V = I × R\nV = tegangan (volt), I = arus (ampere), R = hambatan (ohm).\n\nContoh: R = 100 Ω dan V = 5 V\nI = V / R = 5 / 100 = 0,05 A = 50 mA.\n\nDaya listrik: P = V × I (watt). Dengan data di atas, P = 5 × 0,05 = 0,25 W.\n\nTips: tulis segitiga V di atas, I dan R di bawah. Tutup besaran yang dicari.",
  },
  {
    id: "biner",
    t: "Bilangan Biner",
    k: "Informatika",
    lv: "Mudah",
    min: 20,
    d: "Cara komputer menyimpan angka.",
    b: "Komputer memakai basis 2 (hanya 0 dan 1).\n\nBiner ke desimal: 1101 = 1×8 + 1×4 + 0×2 + 1×1 = 13.\n\nDesimal ke biner: bagi 2 terus, catat sisanya dari bawah ke atas.\n13 / 2 = 6 sisa 1\n6 / 2 = 3 sisa 0\n3 / 2 = 1 sisa 1\n1 / 2 = 0 sisa 1\nBaca dari bawah: 1101.\n\n1 byte = 8 bit, jadi bisa menyimpan 256 nilai (0–255).",
  },
  {
    id: "gerbang",
    t: "Gerbang Logika",
    k: "Informatika",
    lv: "Sedang",
    min: 25,
    d: "AND, OR, NOT, dan tabel kebenaran.",
    b: "AND: keluaran 1 hanya jika semua masukan 1.\nOR: keluaran 1 jika minimal satu masukan 1.\nNOT: membalik masukan (0 jadi 1).\nXOR: keluaran 1 jika masukan berbeda.\n\nTabel AND (A,B → Y)\n0,0 → 0\n0,1 → 0\n1,0 → 0\n1,1 → 1\n\nNAND = AND lalu dibalik. NAND disebut gerbang universal karena semua gerbang lain bisa dibuat darinya.",
  },
  {
    id: "algo",
    t: "Dasar Algoritma",
    k: "Informatika",
    lv: "Sedang",
    min: 30,
    d: "Input, proses, output, dan pseudocode.",
    b: "Algoritma adalah urutan langkah yang jelas untuk menyelesaikan masalah.\n\nPola dasar: Input → Proses → Output.\n\nContoh rata-rata dua nilai:\n1. Baca a dan b\n2. hasil = (a + b) / 2\n3. Tampilkan hasil\n\nTiga struktur utama: urutan, percabangan (jika... maka...), dan perulangan (ulangi sampai...).\nSebelum mengetik kode, tulis dulu langkahnya di kertas.",
  },
  {
    id: "html",
    t: "Dasar HTML",
    k: "Informatika",
    lv: "Mudah",
    min: 25,
    d: "Kerangka halaman web pertamamu.",
    b: 'HTML menyusun struktur halaman.\n\nKerangka minimal:\n<!DOCTYPE html>\n<html>\n  <head><title>Halamanku</title></head>\n  <body>\n    <h1>Judul</h1>\n    <p>Paragraf.</p>\n    <a href="https://example.com">Tautan</a>\n  </body>\n</html>\n\nhead berisi info halaman, body berisi yang tampil. Latihan: ubah teks lalu refresh browser.',
  },
  {
    id: "himp",
    t: "Himpunan",
    k: "Matematika",
    lv: "Mudah",
    min: 20,
    d: "Gabungan, irisan, dan selisih.",
    b: "Himpunan adalah kumpulan objek yang jelas.\n\nMisal A = {1, 2, 3} dan B = {2, 3, 4}\nGabungan A ∪ B = {1, 2, 3, 4}\nIrisan A ∩ B = {2, 3}\nSelisih A − B = {1}\n\nBanyak anggota himpunan ditulis n(A). Di sini n(A) = 3.\nRumus: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).",
  },
  {
    id: "belajar",
    t: "Teknik Belajar Efektif",
    k: "Pendukung",
    lv: "Mudah",
    min: 15,
    d: "Cara belajar yang terbukti, tanpa begadang.",
    b: "1. Pomodoro: 25 menit fokus, 5 menit rehat. Pakai menu Fokus.\n2. Active recall: tutup catatan, lalu tulis ulang apa yang kamu ingat.\n3. Spaced repetition: ulangi materi di hari ke-1, 3, 7, dan 14.\n4. Teknik Feynman: jelaskan materi dengan bahasa sederhana seolah ke teman.\n5. Kerjakan soal, jangan hanya membaca ulang.\n\nTidur cukup membantu otak menyimpan apa yang baru dipelajari.",
  },
];
const QZ = {
  Informatika: [
    [
      "Bilangan biner 1101 sama dengan desimal…",
      ["11", "12", "13", "14"],
      2,
      "8 + 4 + 0 + 1 = 13.",
    ],
    [
      "Gerbang yang keluarannya 1 hanya jika semua masukan 1?",
      ["OR", "AND", "XOR", "NOT"],
      1,
      "Itu definisi AND.",
    ],
    [
      "Tag HTML untuk membuat tautan?",
      ["<a>", "<link>", "<p>", "<href>"],
      0,
      "Tag <a> dengan atribut href.",
    ],
    [
      "Urutan langkah untuk menyelesaikan masalah disebut…",
      ["Variabel", "Algoritma", "Kompiler", "Protokol"],
      1,
      "Itu pengertian algoritma.",
    ],
    [
      "1 byte terdiri dari berapa bit?",
      ["4", "8", "16", "32"],
      1,
      "1 byte = 8 bit.",
    ],
  ],
  "HTML & CSS": [
    [
      "Properti CSS untuk mengubah warna teks adalah…",
      ["color", "font-color", "text-style", "fgcolor"],
      0,
      "Gunakan color, misalnya color: navy;.",
    ],
    [
      "Tag HTML untuk menampilkan gambar adalah…",
      ["<img>", "<src>", "<imgtag>", "<pic>"],
      0,
      "Tag <img> dengan atribut src.",
    ],
    [
      "Selector CSS untuk elemen ber-class “kartu” adalah…",
      ["#kartu", ".kartu", "kartu", "*kartu"],
      1,
      "Class dipilih dengan titik, id dengan tanda pagar.",
    ],
    [
      "display: flex dipakai untuk…",
      [
        "Menyusun elemen secara fleksibel dalam baris atau kolom",
        "Menyembunyikan elemen",
        "Mengganti font",
        "Membuat animasi",
      ],
      0,
      "Flexbox mengatur tata letak anak elemen.",
    ],
    [
      "Atribut untuk teks pengganti gambar adalah…",
      ["title", "alt", "name", "text"],
      1,
      "alt tampil jika gambar gagal dimuat dan dibaca pembaca layar.",
    ],
  ],
  JavaScript: [
    [
      "Kata kunci untuk variabel yang nilainya tidak boleh diganti ulang?",
      ["var", "let", "const", "static"],
      2,
      "const membuat referensi tetap.",
    ],
    [
      'Hasil dari 2 + "3" di JavaScript adalah…',
      ["5", "23", "error", "undefined"],
      1,
      'Angka digabung dengan string menjadi string "23".',
    ],
    [
      "Operator perbandingan nilai sekaligus tipe data?",
      ["=", "==", "===", "=>"],
      2,
      "=== membandingkan nilai dan tipe.",
    ],
    [
      "Metode untuk menambah elemen di akhir array?",
      ["push()", "pop()", "shift()", "add()"],
      0,
      "push menambah di akhir, pop menghapus dari akhir.",
    ],
    [
      "Hasil typeof 42 adalah…",
      ["string", "number", "int", "object"],
      1,
      "JavaScript hanya punya tipe number untuk angka.",
    ],
  ],
  "Logika Pemrograman": [
    [
      "Struktur yang dipakai untuk mengulang perintah?",
      ["if", "for", "switch", "return"],
      1,
      "for dan while adalah perulangan.",
    ],
    [
      "Hasil 10 % 3 adalah…",
      ["0", "1", "3", "3,33"],
      1,
      "% adalah sisa bagi: 10 = 3×3 + 1.",
    ],
    [
      "true AND false menghasilkan…",
      ["true", "false", "null", "error"],
      1,
      "AND hanya true jika keduanya true.",
    ],
    [
      "Perulangan for (i=1; i<=5; i++) berjalan berapa kali?",
      ["4", "5", "6", "1"],
      1,
      "i bernilai 1, 2, 3, 4, 5.",
    ],
    [
      "Bug dalam pemrograman adalah…",
      ["Kesalahan pada program", "Jenis variabel", "Fitur baru", "Nama file"],
      0,
      "Bug adalah kesalahan atau perilaku tak terduga pada program.",
    ],
  ],
  Matematika: [
    [
      "Jika A={1,2,3} dan B={2,3,4}, maka A ∩ B =",
      ["{2,3}", "{1,4}", "{1,2,3,4}", "{3}"],
      0,
      "Irisan hanya anggota yang ada di keduanya.",
    ],
    [
      "2x + 6 = 14, nilai x adalah…",
      ["3", "4", "5", "6"],
      1,
      "2x = 8, jadi x = 4.",
    ],
    ["3² + 4² =", ["7", "12", "25", "49"], 2, "9 + 16 = 25."],
    [
      "Jika f(x) = 2x + 1, maka f(3) =",
      ["5", "6", "7", "8"],
      2,
      "2×3 + 1 = 7.",
    ],
    [
      "Negasi dari “Hari ini hujan” adalah…",
      [
        "Hari ini tidak hujan",
        "Besok hujan",
        "Hujan deras",
        "Hari ini cerah dan hujan",
      ],
      0,
      "Negasi membalik nilai kebenaran pernyataan.",
    ],
  ],
  "Fisika & Elektro": [
    [
      "Jika R = 10 Ω dan I = 2 A, maka V =",
      ["5 V", "12 V", "20 V", "0,2 V"],
      2,
      "V = I × R = 2 × 10 = 20 V.",
    ],
    [
      "Satuan hambatan listrik adalah…",
      ["Volt", "Ampere", "Ohm", "Watt"],
      2,
      "Hambatan diukur dalam ohm (Ω).",
    ],
    [
      "Tegangan 5 V dan arus 2 A menghasilkan daya…",
      ["2,5 W", "3 W", "7 W", "10 W"],
      3,
      "P = V × I = 10 W.",
    ],
    [
      "Satuan SI untuk massa adalah…",
      ["gram", "kilogram", "newton", "joule"],
      1,
      "Satuan SI massa adalah kilogram.",
    ],
    [
      "Pada rangkaian seri, arus di setiap komponen…",
      ["Sama", "Berbeda", "Nol", "Tak terhingga"],
      0,
      "Hanya ada satu jalur arus.",
    ],
  ],
};

/* ===== Data & penyimpanan ===== */
const demo = () => ({
  profile: {
    name: "Mahasiswa PTIK",
    prodi: "Pendidikan Teknik Informatika dan Komputer",
    univ: "Universitas Negeri Semarang",
    sem: 1,
    theme: "light",
    goal: 300,
  },
  tasks: [
    {
      id: 1,
      title: "Makalah Pengantar Teknologi Informasi",
      course: "Pengantar TI",
      cat: "Makalah",
      pri: "High",
      st: 1,
      due: day(3),
      time: "23:59",
      desc: "Minimal 8 halaman.",
      subs: [
        { t: "Cari 5 referensi", d: true },
        { t: "Tulis pendahuluan", d: false },
        { t: "Susun daftar pustaka", d: false },
      ],
    },
    {
      id: 2,
      title: "Laporan Praktikum Logika Digital",
      course: "Logika Digital",
      cat: "Praktikum",
      pri: "Urgent",
      st: 0,
      due: day(1),
      time: "16:00",
      desc: "",
      subs: [
        { t: "Tabel kebenaran", d: false },
        { t: "Analisis", d: false },
      ],
    },
    {
      id: 3,
      title: "Presentasi Fisika: Hukum Ohm",
      course: "Fisika Dasar",
      cat: "Presentasi",
      pri: "Medium",
      st: 0,
      due: day(7),
      time: "",
      desc: "",
      subs: [],
    },
    {
      id: 4,
      title: "Latihan Algoritma: Perulangan",
      course: "Algoritma",
      cat: "Tugas",
      pri: "Low",
      st: 2,
      due: day(-1),
      time: "",
      desc: "",
      subs: [],
    },
  ],
  notes: [
    {
      id: 1,
      title: "Rumus dasar listrik",
      cat: "Elektronika",
      tags: "ohm rumus",
      body: "V = I × R\nP = V × I",
      pin: true,
      date: day(0),
    },
    {
      id: 2,
      title: "Struktur HTML",
      cat: "Informatika",
      tags: "web",
      body: "html > head + body",
      pin: false,
      date: day(0),
    },
  ],
  jadwal: [
    {
      id: 1,
      hari: "Senin",
      jam: "07:30",
      mk: "Pengantar Teknologi Informasi",
      ruang: "E3-201",
      jenis: "Kuliah",
    },
    {
      id: 2,
      hari: "Selasa",
      jam: "09:00",
      mk: "Logika Digital",
      ruang: "Lab Elektro",
      jenis: "Praktikum",
    },
    {
      id: 3,
      hari: "Rabu",
      jam: "10:00",
      mk: "Algoritma dan Pemrograman",
      ruang: "E4-102",
      jenis: "Kuliah",
    },
    {
      id: 4,
      hari: "Kamis",
      jam: "13:00",
      mk: "Fisika Dasar",
      ruang: "D2-301",
      jenis: "Kuliah",
    },
    {
      id: 5,
      hari: "Jumat",
      jam: "08:00",
      mk: "Bahasa Inggris",
      ruang: "E3-105",
      jenis: "Kuliah",
    },
  ],
  habits: [
    "Belajar 30 menit",
    "Membaca materi",
    "Mengerjakan tugas",
    "Olahraga",
  ].map((n, i) => ({ id: i + 1, name: n, log: {} })),
  mapel: [
    { id: 1, name: "Pengantar TI", sks: 3, g: "A" },
    { id: 2, name: "Algoritma", sks: 3, g: "B+" },
    { id: 3, name: "Fisika Dasar", sks: 3, g: "B" },
  ],
  sessions: {},
  quiz: [],
  mat: {},
});
let S = (() => {
  try {
    return { ...demo(), ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return demo();
  }
})();
const save = () => localStorage.setItem(KEY, JSON.stringify(S));
const ms = (id) => S.mat[id] || (S.mat[id] = { st: 0, bm: false });

/* ===== Modal formulir serbaguna ===== */
function formModal(title, fields, vals, onSave) {
  $("#form").innerHTML =
    `<h3>${title}</h3>` +
    fields
      .map(
        ([n, l, t, o, r]) =>
          `<label>${l}` +
          (t === "select"
            ? `<select name="${n}">${sel(o, vals[n])}</select>`
            : t === "area"
              ? `<textarea name="${n}" rows="5">${esc(vals[n])}</textarea>`
              : `<input name="${n}" type="${t}" value="${esc(vals[n])}" ${r ? "required" : ""}>`) +
          `</label>`,
      )
      .join("") +
    `<div class="row"><button class="btn">Simpan</button><button type="button" class="btn ghost" onclick="closeModal()">Batal</button></div>`;
  $("#form").onsubmit = (e) => {
    e.preventDefault();
    onSave(Object.fromEntries(new FormData(e.target)));
    closeModal();
  };
  $("#modal").classList.add("on");
}
const closeModal = () => $("#modal").classList.remove("on");
$("#modal").onclick = (e) => {
  if (e.target.id === "modal") closeModal();
};
const del = (key, id, msg) => {
  if (confirm("Hapus " + msg + "?")) {
    S[key] = S[key].filter((x) => x.id !== id);
    save();
    render();
    toast("Dihapus");
  }
};

/* ===== Navigasi ===== */
const toggleTheme = () => {
  S.profile.theme = S.profile.theme === "dark" ? "light" : "dark";
  save();
  render();
};
const NAV = [
  ["beranda", "Beranda", "M3 11l9-8 9 8M5 10v10h14V10"],
  ["tugas", "Tugas", "M4 12l5 5L20 6"],
  ["jadwal", "Jadwal", "M4 5h16v15H4zM4 10h16M9 3v4M15 3v4"],
  [
    "materi",
    "Materi",
    "M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1z",
  ],
  ["kuis", "Kuis", "M9 9a3 3 0 116 0c0 2-3 2-3 4M12 17v.5"],
  ["catatan", "Catatan", "M5 3h14v18H5zM9 8h6M9 12h6M9 16h4"],
  ["fokus", "Fokus", "M12 5a8 8 0 100 16 8 8 0 000-16zM12 9v4l3 2M9 2h6"],
  [
    "kebiasaan",
    "Kebiasaan",
    "M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z",
  ],
  ["nilai", "Nilai", "M5 3h14v18H5zM8 7h8M8 12h2M13 12h3M8 17h8"],
  ["pengaturan", "Atur", "M4 7h10M18 7h2M4 17h2M10 17h10"],
];
let page = "beranda";
const go = (p) => {
  page = p;
  render();
  window.scrollTo(0, 0);
};
function render() {
  document.documentElement.dataset.theme = S.profile.theme;
  $("#nav").innerHTML = NAV.map(
    ([id, l, p]) =>
      `<button class="${id === page ? "on" : ""}" onclick="go('${id}')"><svg viewBox="0 0 24 24"><path d="${p}"/></svg>${l}</button>`,
  ).join("");
  $("#tt").textContent =
    S.profile.theme === "dark" ? "Mode terang" : "Mode gelap";
  $("#view").innerHTML = P[page]();
}

/* ===== Tugas ===== */
let tf = { q: "", c: "", p: "", s: "deadline", v: "list" };
const searchTask = (v) => {
  tf.q = v;
  if (page !== "tugas") go("tugas");
  else $("#tl").innerHTML = taskList();
};
const taskCls = (t) => {
  if (t.st === 2) return "";
  const d = (dt(t.due) - dt(day(0))) / 864e5;
  return d <= 0 ? "bad" : d <= 3 ? "warn" : "";
};
function taskRow(t) {
  return `<div class="task ${taskCls(t)} ${t.st === 2 ? "done" : ""}"><input type="checkbox" ${t.st === 2 ? "checked" : ""} onchange="toggleTask(${t.id})" aria-label="Selesai">
  <div class="tt"><b>${esc(t.title)}</b><small>${esc(t.course)} · ${t.cat} · ${tgl(t.due)} ${t.time || ""} · ${STAT[t.st]}</small>
  ${t.subs.length ? `<div class="subs">${t.subs.map((s, i) => `<label><input type="checkbox" ${s.d ? "checked" : ""} onchange="toggleSub(${t.id},${i})">${esc(s.t)}</label>`).join("")}</div>` : ""}</div>
  <span class="tag">${t.pri}</span><div class="acts"><button onclick="editTask(${t.id})">edit</button>${t.st < 2 ? `<button onclick="moveTask(${t.id})">maju</button>` : ""}<button onclick="delTask(${t.id})">hapus</button></div></div>`;
}
function taskList() {
  const q = tf.q.toLowerCase();
  const l = S.tasks
    .filter(
      (t) =>
        (!q || (t.title + t.course).toLowerCase().includes(q)) &&
        (!tf.c || t.cat === tf.c) &&
        (!tf.p || t.pri === tf.p),
    )
    .sort((a, b) =>
      tf.s === "judul"
        ? a.title.localeCompare(b.title)
        : tf.s === "prioritas"
          ? PRI[b.pri] - PRI[a.pri]
          : a.due.localeCompare(b.due),
    );
  if (!l.length)
    return `<div class="empty">Belum ada tugas yang cocok. Tekan “+ Tugas” untuk menambah.</div>`;
  return tf.v === "list"
    ? l.map(taskRow).join("")
    : `<div class="kb">${STAT.map(
        (n, i) =>
          `<div><h4>${n} (${l.filter((t) => t.st === i).length})</h4>${l
            .filter((t) => t.st === i)
            .map(taskRow)
            .join("")}</div>`,
      ).join("")}</div>`;
}
const setTf = (k, v) => {
  tf[k] = v;
  if (k === "v") render();
  else $("#tl").innerHTML = taskList();
};
const toggleTask = (id) => {
  const t = S.tasks.find((x) => x.id === id);
  t.st = t.st === 2 ? 0 : 2;
  save();
  render();
};
const moveTask = (id) => {
  const t = S.tasks.find((x) => x.id === id);
  t.st = Math.min(2, t.st + 1);
  save();
  render();
};
const toggleSub = (id, i) => {
  const s = S.tasks.find((x) => x.id === id).subs[i];
  s.d = !s.d;
  save();
  render();
};
const delTask = (id) => del("tasks", id, "tugas ini");
function editTask(id) {
  const old = S.tasks.find((t) => t.id === id);
  const v = old
    ? { ...old, st: STAT[old.st], subs: old.subs.map((s) => s.t).join("\n") }
    : {
        title: "",
        course: "",
        cat: "Tugas",
        pri: "Medium",
        st: STAT[0],
        due: day(3),
        time: "",
        desc: "",
        subs: "",
      };
  formModal(
    old ? "Edit tugas" : "Tugas baru",
    [
      ["title", "Judul", "text", 0, 1],
      ["course", "Mata kuliah", "text"],
      ["cat", "Jenis", "select", CATS],
      ["pri", "Prioritas", "select", Object.keys(PRI)],
      ["st", "Status", "select", STAT],
      ["due", "Deadline", "date", 0, 1],
      ["time", "Jam", "time"],
      ["desc", "Deskripsi", "area"],
      ["subs", "Subtugas (satu per baris)", "area"],
    ],
    v,
    (d) => {
      const t = old || { id: Date.now(), subs: [] },
        prev = Object.fromEntries(t.subs.map((s) => [s.t, s.d]));
      Object.assign(t, {
        title: d.title,
        course: d.course,
        cat: d.cat,
        pri: d.pri,
        st: STAT.indexOf(d.st),
        due: d.due,
        time: d.time,
        desc: d.desc,
        subs: d.subs
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => ({ t: x, d: !!prev[x] })),
      });
      if (!old) S.tasks.push(t);
      save();
      render();
      toast("Tugas disimpan");
    },
  );
}

/* ===== Jadwal & kalender ===== */
let cal = new Date();
cal.setDate(1);
let selDay = day(0);
const calMove = (n) => {
  cal.setMonth(cal.getMonth() + n);
  render();
};
function editJadwal(id) {
  const old = S.jadwal.find((j) => j.id === id),
    v = old || {
      hari: "Senin",
      jam: "08:00",
      mk: "",
      ruang: "",
      jenis: "Kuliah",
    };
  formModal(
    old ? "Edit jadwal" : "Jadwal baru",
    [
      ["hari", "Hari", "select", HARI.slice(1).concat(HARI[0])],
      ["jam", "Jam mulai", "time", 0, 1],
      ["mk", "Mata kuliah", "text", 0, 1],
      ["ruang", "Ruang", "text"],
      [
        "jenis",
        "Jenis",
        "select",
        ["Kuliah", "Praktikum", "Diskusi", "Belajar mandiri"],
      ],
    ],
    v,
    (d) => {
      if (old) Object.assign(old, d);
      else S.jadwal.push({ id: Date.now(), ...d });
      save();
      render();
      toast("Jadwal disimpan");
    },
  );
}
const agendaFor = (k) =>
  S.jadwal
    .filter((j) => j.hari === HARI[dt(k).getDay()])
    .sort((a, b) => a.jam.localeCompare(b.jam));
function pJadwal() {
  const y = cal.getFullYear(),
    m = cal.getMonth(),
    blank = (new Date(y, m, 1).getDay() + 6) % 7,
    n = new Date(y, m + 1, 0).getDate();
  let cells = "<i></i>".repeat(blank);
  for (let d = 1; d <= n; d++) {
    const k = iso(new Date(y, m, d));
    cells += `<button class="cd ${k === selDay ? "on" : ""} ${k === day(0) ? "now" : ""}" onclick="selDay='${k}';render()">${d}${S.tasks.some((t) => t.due === k && t.st < 2) ? "<u></u>" : ""}</button>`;
  }
  const due = S.tasks.filter((t) => t.due === selDay);
  return `<h2>Jadwal & Kalender</h2><p class="sub">Titik merah = ada deadline tugas.</p><div class="two"><div>
   <div class="row"><button class="btn ghost" onclick="calMove(-1)">‹</button><b>${cal.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</b><button class="btn ghost" onclick="calMove(1)">›</button></div>
   <div class="cal">${["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((h) => `<small>${h}</small>`).join("")}${cells}</div></div>
   <div><h3>Agenda ${tgl(selDay)}</h3>${agendaFor(selDay)
     .map(
       (j) =>
         `<div class="task"><div class="tt"><b>${j.jam} ${esc(j.mk)}</b><small>${esc(j.ruang)} · ${j.jenis}</small></div></div>`,
     )
     .join("")}
   ${due.map((t) => `<div class="task ${taskCls(t)}"><div class="tt"><b>Deadline: ${esc(t.title)}</b><small>${t.time || "seharian"} · ${STAT[t.st]}</small></div></div>`).join("")}
   ${!agendaFor(selDay).length && !due.length ? `<div class="empty">Tidak ada agenda di tanggal ini.</div>` : ""}</div></div>
   <div class="row"><h3 style="margin:0">Jadwal mingguan</h3><button class="btn" onclick="editJadwal()">+ Jadwal</button></div>
   ${HARI.slice(1)
     .concat(HARI[0])
     .map((h) => ({
       h,
       l: S.jadwal
         .filter((j) => j.hari === h)
         .sort((a, b) => a.jam.localeCompare(b.jam)),
     }))
     .filter((x) => x.l.length)
     .map(
       (x) =>
         `<h4 style="margin:12px 0 6px">${x.h}</h4>${x.l.map((j) => `<div class="task"><div class="tt"><b>${j.jam} ${esc(j.mk)}</b><small>${esc(j.ruang)} · ${j.jenis}</small></div><div class="acts"><button onclick="editJadwal(${j.id})">edit</button><button onclick="del('jadwal',${j.id},'jadwal ini')">hapus</button></div></div>`).join("")}`,
     )
     .join("")}`;
}

/* ===== Materi ===== */
let mf = "";
const MST = ["Belum dipelajari", "Sedang dipelajari", "Selesai"];
function pMateri() {
  const ks = [...new Set(MAT.map((m) => m.k))],
    done = MAT.filter((m) => ms(m.id).st === 2).length;
  return `<h2>Pusat Belajar</h2><p class="sub">${done} dari ${MAT.length} materi selesai.</p>
  <div class="chips"><button class="${!mf ? "on" : ""}" onclick="mf='';render()">Semua</button>${ks.map((k) => `<button class="${mf === k ? "on" : ""}" onclick="mf='${k}';render()">${k}</button>`).join("")}<button class="${mf === "bm" ? "on" : ""}" onclick="mf='bm';render()">Bookmark</button></div>
  <div class="cards">${MAT.filter(
    (m) => !mf || m.k === mf || (mf === "bm" && ms(m.id).bm),
  )
    .map(
      (
        m,
      ) => `<div class="card"><small>${m.k} · ${m.lv} · ${m.min} menit</small><b>${m.t}</b><p>${m.d}</p>
   <div class="bar"><i style="width:${ms(m.id).st * 50}%"></i></div><small>${MST[ms(m.id).st]}</small>
   <div class="row" style="margin:4px 0 0"><button class="btn" onclick="openMat('${m.id}')">Baca</button><button class="btn ghost" onclick="bmMat('${m.id}')">${ms(m.id).bm ? "Hapus bookmark" : "Bookmark"}</button></div></div>`,
    )
    .join("")}</div>`;
}
const bmMat = (id) => {
  ms(id).bm = !ms(id).bm;
  save();
  render();
};
const stMat = (id) => {
  const m = ms(id);
  m.st = (m.st + 1) % 3;
  save();
  render();
  openMat(id);
};
function openMat(id) {
  const m = MAT.find((x) => x.id === id);
  $("#form").innerHTML =
    `<h3>${m.t}</h3><small>${m.k} · ${m.lv} · ${m.min} menit</small><p style="white-space:pre-wrap">${esc(m.b)}</p><div class="row"><button type="button" class="btn" onclick="stMat('${id}')">Status: ${MST[ms(id).st]} (ubah)</button><button type="button" class="btn ghost" onclick="closeModal()">Tutup</button></div>`;
  $("#form").onsubmit = (e) => e.preventDefault();
  $("#modal").classList.add("on");
}

/* ===== Kuis ===== */
let qz = null;
const startQ = (cat) => {
  qz = { cat, i: 0, a: Array(QZ[cat].length).fill(-1), done: false };
  render();
};
const pick = (i) => {
  qz.a[qz.i] = i;
  render();
};
const navQ = (n) => {
  qz.i += n;
  render();
};
const exitQ = () => {
  qz = null;
  render();
};
function finishQ() {
  const score = qz.a.filter((a, i) => a === QZ[qz.cat][i][2]).length;
  S.quiz.unshift({ cat: qz.cat, score, total: qz.a.length, date: day(0) });
  S.quiz = S.quiz.slice(0, 20);
  qz.done = true;
  save();
  render();
}
function pKuis() {
  if (!qz)
    return `<h2>Kuis Latihan</h2><p class="sub">Pilih topik, jawab 5 soal, lihat pembahasannya.</p><div class="row">${Object.keys(
      QZ,
    )
      .map((c) => `<button class="btn" onclick="startQ('${c}')">${c}</button>`)
      .join("")}</div>
   <h3>Riwayat skor</h3>${S.quiz.length ? S.quiz.map((h) => `<div class="task"><div class="tt"><b>${h.cat}</b><small>${tgl(h.date)}</small></div><span class="tag">${h.score}/${h.total}</span></div>`).join("") : `<div class="empty">Belum ada riwayat. Coba satu kuis dulu.</div>`}`;
  const Q = QZ[qz.cat];
  if (qz.done) {
    const sc = qz.a.filter((a, i) => a === Q[i][2]).length;
    return `<h2>Hasil ${qz.cat}</h2><big style="margin:10px 0">${Math.round((sc / Q.length) * 100)}</big><p class="sub">Benar ${sc} dari ${Q.length}.</p>
    ${Q.map((q, i) => `<div class="task ${qz.a[i] === q[2] ? "" : "bad"}"><div class="tt"><b>${i + 1}. ${esc(q[0])}</b><small>Jawabanmu: ${qz.a[i] < 0 ? "kosong" : esc(q[1][qz.a[i]])} · Benar: ${esc(q[1][q[2]])}<br>${esc(q[3])}</small></div></div>`).join("")}
    <div class="row"><button class="btn" onclick="startQ('${qz.cat}')">Ulangi</button><button class="btn ghost" onclick="exitQ()">Pilih topik lain</button></div>`;
  }
  const q = Q[qz.i];
  return `<h2>${qz.cat}</h2><p class="sub">Soal ${qz.i + 1} dari ${Q.length}</p><div class="bar"><i style="width:${((qz.i + 1) / Q.length) * 100}%"></i></div><h3 style="margin-top:18px;font-size:1.1rem">${esc(q[0])}</h3>
  ${q[1].map((o, i) => `<button class="opt ${qz.a[qz.i] === i ? "sel" : ""}" onclick="pick(${i})"><b>${"ABCD"[i]}.</b> ${esc(o)}</button>`).join("")}
  <div class="row"><button class="btn ghost" ${qz.i ? "" : "disabled"} onclick="navQ(-1)">Sebelumnya</button>${qz.i < Q.length - 1 ? `<button class="btn" onclick="navQ(1)">Berikutnya</button>` : `<button class="btn" onclick="finishQ()">Selesai & lihat nilai</button>`}<button class="btn ghost" onclick="exitQ()">Keluar</button></div>`;
}

/* ===== Catatan ===== */
let nq = "",
  nc = "";
function noteList() {
  const l = S.notes
    .filter(
      (n) =>
        (!nc || n.cat === nc) &&
        (n.title + n.body + n.tags).toLowerCase().includes(nq.toLowerCase()),
    )
    .sort((a, b) => b.pin - a.pin);
  return l.length
    ? l
        .map(
          (
            n,
          ) => `<div class="card ${n.pin ? "pin" : ""}"><small>${n.cat} · ${tgl(n.date)}${
            n.tags
              ? " · " +
                n.tags
                  .split(/[ ,]+/)
                  .filter(Boolean)
                  .map((x) => "#" + esc(x))
                  .join(" ")
              : ""
          }</small><b>${esc(n.title)}</b><p>${esc(n.body)}</p>
   <div class="row" style="margin:0"><button class="link" onclick="pinNote(${n.id})">${n.pin ? "lepas pin" : "pin"}</button><button class="link" onclick="editNote(${n.id})">edit</button><button class="link" onclick="del('notes',${n.id},'catatan ini')">hapus</button></div></div>`,
        )
        .join("")
    : `<div class="empty">Belum ada catatan. Tulis ringkasan materi pertamamu.</div>`;
}
const pinNote = (id) => {
  const n = S.notes.find((x) => x.id === id);
  n.pin = !n.pin;
  save();
  render();
};
function editNote(id) {
  const old = S.notes.find((n) => n.id === id),
    v = old || { title: "", cat: "Umum", tags: "", body: "" };
  formModal(
    old ? "Edit catatan" : "Catatan baru",
    [
      ["title", "Judul", "text", 0, 1],
      ["cat", "Kategori", "select", NCAT],
      ["tags", "Tag (pisahkan spasi)", "text"],
      ["body", "Isi", "area"],
    ],
    v,
    (d) => {
      if (old) Object.assign(old, d);
      else S.notes.push({ id: Date.now(), pin: false, date: day(0), ...d });
      save();
      render();
      toast("Catatan disimpan");
    },
  );
}
const pCatatan = () =>
  `<h2>Catatan</h2><div class="row"><input placeholder="Cari catatan…" value="${esc(nq)}" oninput="nq=this.value;$('#nl').innerHTML=noteList()"><select onchange="nc=this.value;$('#nl').innerHTML=noteList()"><option value="">Semua kategori</option>${sel(NCAT, nc)}</select><button class="btn" onclick="editNote()">+ Catatan</button></div><div class="cards" id="nl">${noteList()}</div>`;

/* ===== Fokus (Pomodoro) ===== */
const ft = { total: 1500, left: 1500, mode: "belajar", run: null };
function tick() {
  ft.left--;
  if (ft.left <= 0) {
    clearInterval(ft.run);
    ft.run = null;
    if (ft.mode === "belajar") {
      const m = Math.round(ft.total / 60);
      S.sessions[day(0)] = (S.sessions[day(0)] || 0) + m;
      save();
      toast(`Sesi selesai, +${m} menit`);
    } else toast("Rehat selesai");
    ft.left = ft.total;
    render();
    return;
  }
  const c = $("#clock");
  if (c) {
    c.textContent = clock();
    $("#rp").style.strokeDashoffset = 326.7 * (1 - ft.left / ft.total);
  }
}
const clock = () =>
  `${String(Math.floor(ft.left / 60)).padStart(2, "0")}:${String(ft.left % 60).padStart(2, "0")}`;
const toggleT = () => {
  if (ft.run) {
    clearInterval(ft.run);
    ft.run = null;
  } else ft.run = setInterval(tick, 1000);
  render();
};
const resetT = () => {
  clearInterval(ft.run);
  ft.run = null;
  ft.left = ft.total;
  render();
};
const setT = (m, mode) => {
  clearInterval(ft.run);
  ft.run = null;
  ft.total = ft.left = m * 60;
  ft.mode = mode;
  render();
};
const customT = () => {
  const m = +$("#cm").value;
  m > 0 && m <= 180 ? setT(m, "belajar") : toast("Isi 1–180 menit");
};
function pFokus() {
  const rec = Object.entries(S.sessions).sort().reverse().slice(0, 5),
    tot = Object.values(S.sessions).reduce((a, b) => a + b, 0);
  return `<div class="focus"><h2>Fokus Belajar</h2><div class="chips" style="justify-content:center"><button onclick="setT(25,'belajar')">25 belajar</button><button onclick="setT(5,'istirahat')">5 rehat</button><button onclick="setT(50,'belajar')">50 belajar</button><button onclick="setT(10,'istirahat')">10 rehat</button></div>
  <div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="rt"/><circle cx="60" cy="60" r="52" class="rp" id="rp" style="stroke-dashoffset:${326.7 * (1 - ft.left / ft.total)}"/></svg><div><b id="clock">${clock()}</b><small>${ft.mode === "belajar" ? "Mode belajar" : "Mode istirahat"}</small></div></div>
  <div class="row" style="justify-content:center"><button class="btn" onclick="toggleT()">${ft.run ? "Pause" : ft.left < ft.total ? "Resume" : "Start"}</button><button class="btn ghost" onclick="resetT()">Reset</button></div>
  <div class="row" style="justify-content:center"><input id="cm" type="number" min="1" max="180" placeholder="Menit" style="width:100px"><button class="btn ghost" onclick="customT()">Atur timer</button></div>
  <p class="sub">Total fokus: ${tot} menit</p>${rec.map(([d, m]) => `<div class="task"><div class="tt"><b>${tgl(d)}</b></div><span class="tag">${m} menit</span></div>`).join("")}</div>`;
}

/* ===== Kebiasaan ===== */
const streak = (h) => {
  let n = 0,
    i = h.log[day(0)] ? 0 : -1;
  while (h.log[day(i)]) {
    n++;
    i--;
  }
  return n;
};
const toggleHab = (id, d) => {
  const h = S.habits.find((x) => x.id === id);
  h.log[d] ? delete h.log[d] : (h.log[d] = 1);
  save();
  render();
};
const addHab = () =>
  formModal(
    "Kebiasaan baru",
    [["name", "Nama kebiasaan", "text", 0, 1]],
    { name: "" },
    (d) => {
      S.habits.push({ id: Date.now(), name: d.name, log: {} });
      save();
      render();
    },
  );
function pKebiasaan() {
  const days = [...Array(7)].map((_, i) => day(i - 6));
  return `<h2>Kebiasaan Belajar</h2><p class="sub">Centang tiap hari. Rantai berturut-turut itu yang bikin konsisten.</p>
  ${
    S.habits
      .map((h) => {
        const pct = Math.round((days.filter((d) => h.log[d]).length / 7) * 100);
        return `<div class="hab"><b>${esc(h.name)}<br><small class="fire">${streak(h)} hari beruntun</small> <small>· ${pct}% minggu ini</small></b>
   <div class="dots">${days.map((d) => `<label>${["M", "S", "S", "R", "K", "J", "S"][dt(d).getDay()]}<input type="checkbox" ${h.log[d] ? "checked" : ""} onchange="toggleHab(${h.id},'${d}')"></label>`).join("")}</div><button class="link" onclick="del('habits',${h.id},'kebiasaan ini')">hapus</button></div>`;
      })
      .join("") || `<div class="empty">Belum ada kebiasaan.</div>`
  }
  <div class="row"><button class="btn" onclick="addHab()">+ Kebiasaan</button></div>`;
}

/* ===== Nilai (IPS) ===== */
const setG = (id, g) => {
  S.mapel.find((x) => x.id === id).g = g;
  save();
  render();
};
const addMk = () =>
  formModal(
    "Mata kuliah",
    [
      ["name", "Nama", "text", 0, 1],
      ["sks", "SKS", "number", 0, 1],
      ["g", "Nilai", "select", Object.keys(GR)],
    ],
    { name: "", sks: 3, g: "A" },
    (d) => {
      S.mapel.push({ id: Date.now(), name: d.name, sks: +d.sks || 1, g: d.g });
      save();
      render();
    },
  );
function pNilai() {
  const sks = S.mapel.reduce((a, m) => a + m.sks, 0),
    ips = sks ? S.mapel.reduce((a, m) => a + m.sks * GR[m.g], 0) / sks : 0;
  return `<h2>Kalkulator IPS</h2><p class="sub">Isi nilai tiap mata kuliah, IPS dihitung otomatis (skala 4,00).</p><div class="blk gold" style="margin-bottom:14px"><big>${ips.toFixed(2)}</big>IPS dari ${sks} SKS</div>
  ${S.mapel.map((m) => `<div class="task"><div class="tt"><b>${esc(m.name)}</b><small>${m.sks} SKS</small></div><select onchange="setG(${m.id},this.value)">${sel(Object.keys(GR), m.g)}</select><div class="acts"><button onclick="del('mapel',${m.id},'mata kuliah ini')">hapus</button></div></div>`).join("")}
  <div class="row"><button class="btn" onclick="addMk()">+ Mata kuliah</button></div>`;
}

/* ===== Beranda ===== */
function pBeranda() {
  const h = new Date().getHours(),
    open = S.tasks
      .filter((t) => t.st < 2)
      .sort((a, b) => a.due.localeCompare(b.due));
  const wk = [...Array(7)].map((_, i) => day(i - 6)),
    mins = wk.map((d) => S.sessions[d] || 0),
    tot = mins.reduce((a, b) => a + b, 0),
    mx = Math.max(30, ...mins),
    goal = S.profile.goal || 300;
  const today = agendaFor(day(0)),
    best = Math.max(0, ...S.habits.map(streak));
  return `<h1 class="hero">${h < 11 ? "Pagi" : h < 15 ? "Siang" : h < 18 ? "Sore" : "Malam"}, ${esc(S.profile.name)}.</h1><p class="sub">${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
  <div class="bento"><div class="blk navy w4"><h3>Hari ini</h3>${today.map((j) => `<div class="ag"><b>${j.jam}</b><span>${esc(j.mk)} <small>${esc(j.ruang)}</small></span></div>`).join("")}${open
    .slice(0, 3)
    .map(
      (t) =>
        `<div class="ag"><b>${tgl(t.due)}</b><span>${esc(t.title)} <small>${t.pri}</small></span></div>`,
    )
    .join(
      "",
    )}${!today.length && !open.length ? `<div class="ag">Kosong. Waktunya belajar mandiri.</div>` : ""}</div>
  <div class="blk cyan"><big>${open.length}</big>tugas belum selesai</div>
  <div class="blk gold"><big>${tot}</big>menit fokus minggu ini, target ${goal}<div class="meter"><i style="width:${Math.min(100, (tot / goal) * 100)}%"></i></div></div>
  <div class="blk blue"><big>${best}</big>hari beruntun terbaik</div>
  <div class="blk w3"><h3>Menit fokus 7 hari</h3><div class="bars">${wk.map((d, i) => `<div><i style="height:${(mins[i] / mx) * 100}%"></i>${["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][dt(d).getDay()]}</div>`).join("")}</div></div>
  <div class="blk w3 quote">${QUOTES[new Date().getDate() % QUOTES.length]}</div></div>
  <div class="row"><button class="btn" onclick="editTask()">Tambah tugas</button><button class="btn ghost" onclick="go('fokus')">Mulai fokus</button><button class="btn ghost" onclick="go('kuis')">Coba kuis</button><button class="btn ghost" onclick="go('materi')">Buka materi</button></div>`;
}

/* ===== Pengaturan, export, import, reset ===== */
function pPengaturan() {
  const p = S.profile;
  return `<h2>Pengaturan</h2><div class="set"><label>Nama<input id="sName" value="${esc(p.name)}"></label><label>Program studi<input id="sProdi" value="${esc(p.prodi)}"></label><label>Universitas<input id="sUniv" value="${esc(p.univ)}"></label><label>Semester<input id="sSem" type="number" min="1" max="14" value="${p.sem}"></label>
  <label>Target fokus mingguan (menit)<input id="sGoal" type="number" min="30" value="${p.goal}"></label><label>Tema<select id="sTheme"><option value="light" ${p.theme === "light" ? "selected" : ""}>Terang</option><option value="dark" ${p.theme === "dark" ? "selected" : ""}>Gelap</option></select></label>
  <div class="row"><button class="btn" onclick="saveSet()">Simpan</button><button class="btn ghost" onclick="exportData()">Export JSON</button><label class="btn ghost">Import JSON<input type="file" accept=".json" hidden onchange="importData(this.files[0])"></label><button class="btn danger" onclick="resetData()">Reset data</button></div></div>`;
}
function saveSet() {
  Object.assign(S.profile, {
    name: $("#sName").value || "Mahasiswa",
    prodi: $("#sProdi").value,
    univ: $("#sUniv").value,
    sem: +$("#sSem").value || 1,
    goal: +$("#sGoal").value || 300,
    theme: $("#sTheme").value,
  });
  save();
  render();
  toast("Pengaturan disimpan");
}
function exportData() {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }),
  );
  a.download = "tugasku-backup.json";
  a.click();
}
function importData(f) {
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d.tasks || !d.profile) throw 0;
      S = { ...demo(), ...d };
      save();
      render();
      toast("Data diimpor");
    } catch {
      toast("File JSON tidak valid");
    }
  };
  r.readAsText(f);
}
function resetData() {
  if (confirm("Hapus SEMUA data dan kembali ke data contoh?")) {
    S = demo();
    save();
    render();
    toast("Data direset");
  }
}

const P = {
  beranda: pBeranda,
  tugas: () =>
    `<h2>Tugas Saya</h2><div class="row"><select onchange="setTf('c',this.value)"><option value="">Semua jenis</option>${sel(CATS, tf.c)}</select><select onchange="setTf('p',this.value)"><option value="">Semua prioritas</option>${sel(Object.keys(PRI), tf.p)}</select><select onchange="setTf('s',this.value)"><option value="deadline" ${tf.s === "deadline" ? "selected" : ""}>Deadline terdekat</option><option value="prioritas" ${tf.s === "prioritas" ? "selected" : ""}>Prioritas</option><option value="judul" ${tf.s === "judul" ? "selected" : ""}>Judul A–Z</option></select><div class="chips" style="margin:0"><button class="${tf.v === "list" ? "on" : ""}" onclick="setTf('v','list')">List</button><button class="${tf.v === "kanban" ? "on" : ""}" onclick="setTf('v','kanban')">Kanban</button></div></div><div id="tl">${taskList()}</div>`,
  jadwal: pJadwal,
  materi: pMateri,
  kuis: pKuis,
  catatan: pCatatan,
  fokus: pFokus,
  kebiasaan: pKebiasaan,
  nilai: pNilai,
  pengaturan: pPengaturan,
};
render();
