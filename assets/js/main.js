/* ============================================================
   OZR POS — site davranışları
   - WhatsApp / e-posta iletişim linklerini tek yerden kurar
   - En son sürümü GitHub Releases API'den çeker (indirme linki
     sürüm adına kilitlenmez, her release'te site güncellemesi gerekmez)
   - SSS akordeonu ve mobil menü
   ============================================================ */

// --- İLETİŞİM AYARLARI (tek yer) -------------------------------
// WhatsApp numarası: ülke koduyla, boşluksuz. Örn: "905551112233"
// Boş bırakılırsa WhatsApp butonları gizlenir, e-posta öne çıkar.
const WHATSAPP_NUMARA = "905462782300";
const WHATSAPP_MESAJ = "Merhaba, OZR POS hakkında bilgi almak istiyorum.";
const TELEFON_GOSTER = "0546 278 23 00";
const EPOSTA = "emirhann0077@gmail.com";

// --- GitHub Releases -------------------------------------------
const REPO = "EmirhanOzer07/OZR-Pos";
const RELEASES_SAYFASI = "https://github.com/" + REPO + "/releases/latest";

document.addEventListener("DOMContentLoaded", function () {
  iletisimKur();
  surumBilgisiCek();
  sssKur();
  mobilMenuKur();
  lightboxKur();
});

function iletisimKur() {
  var waLinkler = document.querySelectorAll(".wa-link");
  var mailLinkler = document.querySelectorAll(".mail-link");

  if (WHATSAPP_NUMARA) {
    var url = "https://wa.me/" + WHATSAPP_NUMARA +
      "?text=" + encodeURIComponent(WHATSAPP_MESAJ);
    waLinkler.forEach(function (a) { a.href = url; a.target = "_blank"; a.rel = "noopener"; });
  } else {
    waLinkler.forEach(function (a) { a.style.display = "none"; });
  }

  mailLinkler.forEach(function (a) {
    a.href = "mailto:" + EPOSTA + "?subject=" + encodeURIComponent("OZR POS Bilgi Talebi");
  });
  document.querySelectorAll(".eposta-metin").forEach(function (el) { el.textContent = EPOSTA; });

  document.querySelectorAll(".tel-link").forEach(function (a) {
    if (WHATSAPP_NUMARA) {
      a.href = "tel:+" + WHATSAPP_NUMARA;
      var m = a.querySelector(".tel-metin");
      if (m) m.textContent = TELEFON_GOSTER;
    } else {
      a.style.display = "none";
    }
  });
}

function surumBilgisiCek() {
  var indirBtnler = document.querySelectorAll(".indir-link");
  var surumEtiketler = document.querySelectorAll(".surum-etiket");

  // API'ye ulaşılamazsa her buton yine de releases sayfasına gider
  indirBtnler.forEach(function (a) { a.href = RELEASES_SAYFASI; });

  fetch("https://api.github.com/repos/" + REPO + "/releases/latest")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      if (!rel) return;
      var surum = (rel.tag_name || "").replace(/^v/, "");
      if (surum) {
        surumEtiketler.forEach(function (el) { el.textContent = "v" + surum; });
      }
      var zip = (rel.assets || []).find(function (a) { return a.name.toLowerCase().endsWith(".zip"); });
      if (zip) {
        indirBtnler.forEach(function (a) { a.href = zip.browser_download_url; });
        var boyutEl = document.querySelector(".indir-boyut");
        if (boyutEl) boyutEl.textContent = "(" + (zip.size / 1048576).toFixed(0) + " MB)";
      }
    })
    .catch(function () { /* sessiz: fallback linkler zaten kurulu */ });
}

function sssKur() {
  document.querySelectorAll(".sss-soru").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var oge = btn.closest(".sss-oge");
      var cevap = oge.querySelector(".sss-cevap");
      var acik = oge.classList.toggle("acik");
      cevap.style.maxHeight = acik ? cevap.scrollHeight + "px" : "0";
      btn.setAttribute("aria-expanded", acik ? "true" : "false");
    });
  });
}

function mobilMenuKur() {
  var dugme = document.querySelector(".menu-dugme");
  var menu = document.querySelector(".ust-menu");
  if (!dugme || !menu) return;
  dugme.addEventListener("click", function () { menu.classList.toggle("acik"); });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { menu.classList.remove("acik"); });
  });
}

function lightboxKur() {
  var gorseller = Array.prototype.slice.call(document.querySelectorAll("img[data-buyut]"));
  if (!gorseller.length) return;

  var kutu = document.createElement("div");
  kutu.className = "lightbox";
  kutu.innerHTML =
    '<button class="lightbox-kapat" aria-label="Kapat">✕</button>' +
    '<button class="lightbox-ok lightbox-sol" aria-label="Önceki görsel">‹</button>' +
    '<div class="lightbox-ic">' +
    '<img src="" alt="">' +
    '<div class="lightbox-baslik"></div>' +
    '</div>' +
    '<button class="lightbox-ok lightbox-sag" aria-label="Sonraki görsel">›</button>';
  document.body.appendChild(kutu);

  var img = kutu.querySelector("img");
  var baslik = kutu.querySelector(".lightbox-baslik");
  var mevcut = 0;

  function goster(i) {
    mevcut = (i + gorseller.length) % gorseller.length;
    var kaynak = gorseller[mevcut];
    img.src = kaynak.src;
    img.alt = kaynak.alt || "";
    baslik.textContent = kaynak.alt || "";
  }

  function ac(i) {
    goster(i);
    kutu.classList.add("acik");
    document.body.style.overflow = "hidden";
  }

  function kapat() {
    kutu.classList.remove("acik");
    document.body.style.overflow = "";
  }

  gorseller.forEach(function (el, i) {
    el.addEventListener("click", function () { ac(i); });
  });

  kutu.querySelector(".lightbox-kapat").addEventListener("click", kapat);
  kutu.querySelector(".lightbox-sol").addEventListener("click", function () { goster(mevcut - 1); });
  kutu.querySelector(".lightbox-sag").addEventListener("click", function () { goster(mevcut + 1); });

  kutu.addEventListener("click", function (e) {
    if (e.target === kutu) kapat();
  });

  document.addEventListener("keydown", function (e) {
    if (!kutu.classList.contains("acik")) return;
    if (e.key === "Escape") kapat();
    else if (e.key === "ArrowLeft") goster(mevcut - 1);
    else if (e.key === "ArrowRight") goster(mevcut + 1);
  });
}
