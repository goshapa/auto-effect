(function () {
  var root = document.documentElement;
  var TG_USER = "autoeffect";

  function currentLang() {
    return root.getAttribute("lang") === "ru" ? "ru" : "uz";
  }

  function setLang(lang) {
    root.setAttribute("lang", lang);
    try { localStorage.setItem("ae-lang", lang); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    document.querySelectorAll("[data-ph-uz]").forEach(function (el) {
      el.placeholder = el.getAttribute("data-ph-" + lang);
    });
    document.title = lang === "ru"
      ? "Auto Effect — детейлинг-студия в Ташкенте"
      : "Auto Effect — Toshkentdagi detailing studiya";
    clearError();
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });

  /* Толщина плёнки */
  var gauge = document.getElementById("gauge");
  var filmValue = document.getElementById("film-value");
  var tabs = document.querySelectorAll(".film-tabs button");
  var notes = document.querySelectorAll("[data-film-note]");

  function setFilm(um) {
    gauge.style.setProperty("--um", um);
    filmValue.textContent = um;
    tabs.forEach(function (t) { t.setAttribute("aria-pressed", String(t.dataset.um === um)); });
    notes.forEach(function (n) { n.hidden = n.dataset.filmNote !== um; });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { setFilm(t.dataset.um); });
  });
  setFilm("210");

  /* Услуги */
  var items = document.querySelectorAll(".serv-item");
  var view = document.getElementById("serv-view");

  function openService(item) {
    items.forEach(function (i) {
      var on = i === item;
      i.classList.toggle("on", on);
      i.querySelector(".serv-btn").setAttribute("aria-expanded", String(on));
    });
    var img = item.querySelector(".serv-body img");
    view.src = img.getAttribute("src");
    view.alt = img.alt;
  }
  items.forEach(function (item) {
    item.querySelector(".serv-btn").addEventListener("click", function () { openService(item); });
  });

  /* Заявка собирается в готовое сообщение для Telegram */
  var form = document.getElementById("order");
  var model = document.getElementById("car-model");
  var error = document.getElementById("order-error");
  var copyBtn = document.getElementById("order-copy");

  function clearError() {
    error.textContent = "";
    model.classList.remove("bad");
  }

  function buildMessage() {
    var ru = currentLang() === "ru";
    var picked = Array.prototype.map.call(
      form.querySelectorAll('input[name="service"]:checked'),
      function (c) { return c.parentNode.querySelector('[lang="' + currentLang() + '"]').textContent; }
    );
    var lines = [
      (ru ? "Здравствуйте! Хочу узнать цену." : "Assalomu alaykum! Narxini bilmoqchiman."),
      (ru ? "Автомобиль: " : "Avtomobil: ") + model.value.trim()
    ];
    if (picked.length) lines.push((ru ? "Услуги: " : "Xizmatlar: ") + picked.join(", "));
    return lines.join("\n");
  }

  function validate() {
    if (model.value.trim()) { clearError(); return true; }
    error.textContent = currentLang() === "ru"
      ? "Напишите марку и модель автомобиля, чтобы мастер назвал цену."
      : "Usta narxni aytishi uchun avtomobil rusumini yozing.";
    model.classList.add("bad");
    model.focus();
    return false;
  }

  model.addEventListener("input", clearError);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    window.open("https://t.me/" + TG_USER + "?text=" + encodeURIComponent(buildMessage()), "_blank", "noopener");
  });

  copyBtn.addEventListener("click", function () {
    if (!validate()) return;
    var ru = currentLang() === "ru";
    var done = function () {
      error.textContent = ru ? "Текст скопирован. Вставьте его в чат." : "Matn nusxalandi. Uni chatga joylang.";
    };
    var fail = function () {
      error.textContent = ru ? "Не удалось скопировать. Позвоните нам: +998 93 700 05 50." : "Nusxalab bo‘lmadi. Qo‘ng‘iroq qiling: +998 93 700 05 50.";
    };
    if (navigator.clipboard) navigator.clipboard.writeText(buildMessage()).then(done, fail);
    else fail();
  });

  setLang(currentLang());
})();
