const state = {
  currentLang: "zh-Hans",
  isListening: false,
  audioTimeout: null,
};

const translations = {
  "zh-Hans": {
    themeLabel: "暗色",
    themeOptionLight: "亮色",
    languageLabel: "中文简体",
    login: "登录",
    startWithGoogle: "使用 Google 开始",
    slogan: "让语言，从心里长出来。",
    subtitle: "InnerLing 不教语言，而是提供一个语言可以自然生长的空间。",
    listen: "点击这里，先听听看。",
    response: "这是一个可以慢慢说话的地方，如果愿意，可以说说看。",
    privacy: "隐私政策",
    terms: "服务条款",
    cookies: "Cookie设置",
  },
  "zh-Hant": {
    themeLabel: "暗色",
    themeOptionLight: "亮色",
    languageLabel: "中文繁体",
    login: "登入",
    startWithGoogle: "使用 Google 開始",
    slogan: "讓語言，從心裡長出來。",
    subtitle: "InnerLing 不教語言，而是提供一個語言可以自然生長的空間。",
    listen: "點擊這裡，先聽聽看。",
    response: "這是一個可以慢慢說話的地方，如果願意，可以說說看。",
    privacy: "隱私政策",
    terms: "服務條款",
    cookies: "Cookie設定",
  },
  en: {
    themeLabel: "Dark",
    themeOptionLight: "Light",
    languageLabel: "English",
    login: "Log in",
    startWithGoogle: "Start with Google",
    slogan: "Let language grow from within.",
    subtitle: "InnerLing does not teach language, but offers a space where it can grow naturally.",
    listen: "Click here to listen first.",
    response: "This is a place where you can speak slowly. If you want, give it a try.",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookie Settings",
  },
};

const page = document.querySelector(".page");
const body = document.body;
const audio = document.getElementById("voice");
const logo = document.querySelector(".logo");

const applyTranslations = (lang) => {
  const dict = translations[lang] || translations["zh-Hans"];
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (dict[key]) {
      node.textContent = dict[key];
    }
  });
};

const setLanguage = (lang) => {
  state.currentLang = lang;
  document.documentElement.lang = lang === "en" ? "en" : lang;
  applyTranslations(lang);
};

const setTheme = (theme) => {
  if (theme === "light") {
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
  }
};

const closeDropdowns = () => {
  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    dropdown.classList.remove("is-open");
  });
};

const openDropdown = (dropdown) => {
  const isOpen = dropdown.classList.contains("is-open");
  closeDropdowns();
  if (!isOpen) {
    dropdown.classList.add("is-open");
  }
};

const startListening = () => {
  if (state.isListening) {
    return;
  }
  state.isListening = true;
  page.classList.add("is-speaking");

  const finalizeResponse = () => {
    page.classList.add("show-response");
    page.classList.remove("is-speaking");
  };

  if (audio) {
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        state.audioTimeout = setTimeout(finalizeResponse, 2500);
      });
    }

    audio.addEventListener(
      "ended",
      () => {
        finalizeResponse();
      },
      { once: true }
    );
  } else {
    state.audioTimeout = setTimeout(finalizeResponse, 2500);
  }
};

const initLogoFallback = () => {
  const img = logo.querySelector("img");
  if (!img) {
    logo.classList.add("is-fallback");
    return;
  }

  if (img.complete && img.naturalWidth === 0) {
    logo.classList.add("is-fallback");
    return;
  }

  img.addEventListener("error", () => {
    logo.classList.add("is-fallback");
  });
};

const initDropdowns = () => {
  document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".dropdown-trigger");
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      openDropdown(dropdown);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDropdown(dropdown);
      }
    });
  });

  document.addEventListener("click", () => {
    closeDropdowns();
  });
};

const initActions = () => {
  document.querySelectorAll("[data-lang]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const lang = item.getAttribute("data-lang");
      setLanguage(lang);
      closeDropdowns();
    });
  });

  const themeLight = document.querySelector("[data-theme-value='light']");
  if (themeLight) {
    themeLight.addEventListener("click", (event) => {
      event.stopPropagation();
      setTheme("light");
      closeDropdowns();
    });
  }

  const listen = document.querySelector("[data-action='listen']");
  if (listen) {
    listen.addEventListener("click", () => {
      startListening();
    });
  }
};

initLogoFallback();
initDropdowns();
initActions();
setLanguage(state.currentLang);
setTheme("dark");
