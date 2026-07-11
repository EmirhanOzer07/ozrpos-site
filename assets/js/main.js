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
const EPOSTA = "emirhann0077@gmail.com";

// --- GitHub Releases -------------------------------------------
const REPO = "EmirhanOzer07/OZR-Pos";
const RELEASES_SAYFASI = "https://github.com/" + REPO + "/releases/latest";

document.addEventListener("DOMContentLoaded", function () {
  iletisimKur();
  surumBilgisiCek();
  sssKur();
  mobilMenuKur();
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
