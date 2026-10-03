/* Speedy Welding & Fab — small vanilla helpers, no dependencies */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* Mobile menu */
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Gallery filters */
  var filterBar = document.querySelector(".filters");
  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      document.querySelectorAll("[data-gallery] > li").forEach(function (li) {
        li.hidden = !(f === "all" || (li.getAttribute("data-cat") || "").split(" ").indexOf(f) > -1);
      });
    });
  }

  /* Lightbox */
  var lb = document.querySelector(".lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-text");
    var lbCount = lb.querySelector(".lb-count");
    var items = [];
    var idx = 0;
    var lastFocus = null;

    function visibleItems() {
      return Array.prototype.filter.call(document.querySelectorAll("[data-full]"), function (b) {
        return !b.closest("li[hidden]");
      });
    }
    function show(i) {
      idx = (i + items.length) % items.length;
      var b = items[idx];
      var thumb = b.querySelector("img");
      lbImg.src = b.getAttribute("data-full");
      lbImg.alt = thumb ? thumb.alt : "";
      lbCap.textContent = b.getAttribute("data-caption") || "";
      lbCount.textContent = (idx + 1) + " / " + items.length;
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-full]");
      if (!b) return;
      e.preventDefault();
      items = visibleItems();
      lastFocus = b;
      show(items.indexOf(b));
      lb.showModal();
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) lb.close(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    lb.addEventListener("close", function () { lbImg.removeAttribute("src"); if (lastFocus) lastFocus.focus(); });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) show(dx < 0 ? idx + 1 : idx - 1);
      x0 = null;
    });
  }

  /* Quote form: builds an email or text message — no server or paid service needed */
  var form = document.getElementById("quote-form");
  if (form) {
    function body() {
      var v = function (n) { return (form.elements[n].value || "").trim(); };
      var lines = [
        "Hi Jason, I'd like a quote.",
        "",
        "Name: " + v("name"),
        "Phone: " + v("phone"),
        "Job type: " + v("type"),
        "Location: " + v("location"),
        "",
        v("details"),
        "",
        "(I'll attach photos of the job.)"
      ];
      return lines.join("\n");
    }
    function ok() {
      if (!form.reportValidity()) return false;
      return true;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ok()) return;
      var subject = "Quote request — " + (form.elements.type.value || "welding job");
      window.location.href = "mailto:speedyweldingandfab@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body());
    });
    var smsBtn = document.getElementById("send-text");
    if (smsBtn) {
      smsBtn.addEventListener("click", function () {
        if (!ok()) return;
        var ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
        window.location.href = "sms:4037154370" + (ios ? "&" : "?") + "body=" + encodeURIComponent(body());
      });
    }
  }
})();
