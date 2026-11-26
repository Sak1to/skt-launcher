/* =========================================================
   SKT Launcher — Bilingual i18n (RU / EN)
   Persists language in localStorage, supports ?lang=en|ru
   ========================================================= */

(function initI18n() {
  const DICT = {
    ru: {
      // Page Titles
      title_home: "SKT Launcher — шахматный лаунчер на Rust | SKT Arch v0.1 beta",
      title_arch: "SKT Arch v0.1 beta — модель шахматного анализа",
      title_mods: "Модификации и интерфейс — SKT Launcher",
      title_news: "Новости — SKT Launcher",
      title_about: "О проекте — SKT Launcher",

      // Shared Nav & Footer
      nav_home: "Главная",
      nav_mods: "Модули",
      nav_arch: "SKT Arch",
      nav_news: "Новости",
      nav_about: "О проекте",
      nav_dl: "Скачать",
      nav_dl_tg: "Скачать в Telegram",
      dock_cta: "Скачать · скоро Android",
      footer_tg: "Наш Telegram (@sktlauncher)",
      footer_info: "Инфо",
      footer_tg_ch: "Telegram-канал",
      footer_product: "Продукт",
      footer_mods: "Модификации",
      footer_ui: "Интерфейс",
      footer_win_and: "Windows (скоро Android)",
      footer_tech: "Технологии",
      footer_ai: "Нейросеть AIarch v1",
      footer_rust: "Ядро на Rust",
      footer_copy: "SKT Launcher. Все права защищены.",

      // Platform badges & buttons
      btn_dl_win: "Скачать для Windows",
      btn_dl_30: "Попробовать 30 дней",
      btn_dl_short: "Скачать",
      btn_arch_more: "Подробнее о SKT Arch",
      soon_android: "Скоро на Android",
      free_30_short: "Бесплатно на 30 дней",
      free_30_meta: "30 дней бесплатно · @sktlauncher",

      // Homepage Hero
      home_kicker: "НАПИСАН НА RUST · БЕСПЛАТНО НА 30 ДНЕЙ",
      home_h1: "Шахматный лаунчер нового поколения",
      home_sub: "Модификации для сервисов и анализ SKT Arch на Stockfish 19 + нейросети AIarch v1 — бесплатно на 30 дней",
      tab_demo: "Демо",
      tab_live: "Анализ",
      tab_launcher: "Лаунчер",
      demo_desc: "Глубокий и быстрый анализ позиций, тренировка и предсказание человеческих ходов на Chess.com и Lichess.",
      preset_blitz: "Блиц",
      preset_std: "Стандарт",
      preset_deep: "Глубокий",
      btn_start: "Запустить",
      btn_stop: "Остановить",
      slot_tel: "Телеметрия Rust",
      slot_tel_sub: "4 потока · MultiPV 6",
      slot_limit: "Лимит расчёта",
      slot_limit_sub: "Нативный запуск <1с",
      slot_nn: "Нейросеть",
      slot_nn_sub: "Ускорение и прогноз ходов",
      pc_foot_mid: "30 дней бесплатно · Rust",
      status_active: "Активен",
      status_stopped: "Остановлено",
      status_ready: "готов к запуску",
      status_idle: "Ожидание",
      stat_depth: "Глубина",
      stat_nps: "Узлов/с",
      stat_best: "Лучший ход",
      stat_best_short: "Лучший",
      ai_human: "Человек",
      ai_alt: "альт.",

      // Homepage Services & Why
      srv_label: "Поддержка шахматных сервисов и технологий анализа",
      why_h2: "Почему SKT Launcher",
      why_1_t: "Скорость Rust",
      why_1_p: "Ядро лаунчера и связка с движком написаны на Rust. Нативный код запускается мгновенно, не грузит память и работает плавно даже при многопоточном расчёте.",
      why_2_t: "SKT Arch v0.1",
      why_2_p: "Гибридная модель анализа (бесплатно на 30 дней): Stockfish 19 просчитывает точную тактику, а нейросеть AIarch v1 предсказывает человеческие ходы.",
      why_3_t: "Все сервисы рядом",
      why_3_p: "Внутри собраны модификации для Chess.com, Lichess и будущих площадок. Переключение между сервисами и обновления происходят в одном окне.",

      // Homepage Bottom CTA
      cta_h2_1: "Готовы открыть шахматы",
      cta_h2_2: "по-новому?",
      cta_sub: "Попробуй бесплатно на 30 дней — модификации и SKT Arch v0.1 beta уже внутри",

      // Arch Page
      arch_sub: "Модель анализа на базе Stockfish 19 и нейросети AIarch v1 — бесплатно на 30 дней",
      scroll_cue: "Листайте",
      arch_k1: "// гибридный анализ",
      arch_t1: "Глубже и быстрее — потому что с AIarch v1",
      arch_p1: "Обычный движок тратит ресурсы на перебор сотен неестественных веток. SKT Arch объединяет мощь Stockfish 19 и нейросеть AIarch v1 прямо в ядре Rust — анализ остаётся точным и понятным человеку.",
      diag_old_t: "Обычный перебор",
      diag_old_c: "тысячи лишних веток · медленный отклик",
      diag_new_c: "Stockfish 19 + AIarch v1 · напрямую в Rust",
      cmp_1_n: "Скорость",
      cmp_1_ot: "Веб-движки",
      cmp_1_op: "Работают в браузере через JS/WASM и тормозят при глубоком поиске.",
      cmp_1_np: "Нативное ядро на Rust с многопоточным Stockfish 19 — мгновенный расчёт на вашем ПК.",
      cmp_2_n: "Логика ходов",
      cmp_2_ot: "Чистый движок",
      cmp_2_op: "Выдаёт компьютерные линии, которые сложно понять в реальной партии.",
      cmp_2_np: "Нейросеть AIarch v1 показывает естественные человеческие ходы и вероятности.",
      cmp_3_n: "MultiPV и глубина",
      cmp_3_ot: "Ограниченный анализ",
      cmp_3_op: "Одна линия анализа или урезанная глубина без подписки.",
      cmp_3_np: "Настраиваемая глубина, потоки, Hash и до 6 параллельных линий MultiPV.",
      cmp_4_n: "Интеграция",
      cmp_4_ot: "Копирование FEN",
      cmp_4_op: "Нужно вручную переносить партию в сторонние анализаторы.",
      cmp_4_np: "Прямое подключение к Chess.com и Lichess из одного окна лаунчера.",
      cmp_5_n: "Доступ",
      cmp_5_ot: "Платные сервисы",
      cmp_5_op: "Требуют оплату с первого дня за глубокий анализ и дополнительные линии.",
      cmp_5_np: "Бесплатно на 30 дней — модель v0.1 beta уже встроена в SKT Launcher.",
      arch_k2: "// что внутри",
      arch_t2: "Всё для анализа — в одной панели",
      f6_1_p: "Точный просчёт тактики, форсированных матов и тонких эндшпилей на максимальной скорости.",
      f6_2_t: "Предсказатель AIarch v1",
      f6_2_p: "Нейросеть оценивает, какие ходы вероятнее всего сделает живой соперник.",
      f6_3_t: "Расчёт на ходу соперника",
      f6_3_p: "Модель продолжает анализировать позицию, пока думает оппонент — ответ готов мгновенно.",
      f6_4_t: "Линии MultiPV",
      f6_4_p: "Отображайте до 6 лучших продолжений одновременно для глубокого понимания позиции.",
      f6_5_t: "Тонкие настройки",
      f6_5_p: "Регулируйте глубину поиска, количество потоков Stockfish, лимит времени и размер Hash.",
      f6_6_t: "Телеметрия Rust",
      f6_6_p: "Живая консоль показывает статус движка, узлы в секунду и активную доску без задержек.",
      arch_shot_cap: "Реальный интерфейс панели SKT Arch 0.1 beta с настройками движка и телеметрией Rust.",
      arch_k3: "// три шага",
      arch_t3: "Как начать",
      st_1_t: "Откройте Telegram-канал",
      st_1_p: "Перейдите в @sktlauncher и скачайте актуальную сборку SKT Launcher для Windows.",
      st_2_t: "Выберите сервис",
      st_2_p: "Откройте SKT Launcher и выберите Chess.com или Lichess в карточке SKT Arch v0.1 beta.",
      st_3_t: "Нажмите «Запустить»",
      st_3_p: "Stockfish 19 и нейросеть AIarch v1 запустятся автоматически — всё готово к анализу.",
      arch_cta_t: "Готовы попробовать SKT Arch?",
      arch_cta_s: "Бесплатно на 30 дней в составе SKT Launcher для Windows",

      // Mods Page
      mods_h1: "Модули и возможности",
      mods_sub: "Все модификации и модель анализа SKT Arch доступны бесплатно на 30 дней внутри одного лаунчера",
      badge_platform: "Платформа",
      badge_builtin: "30 дней бесплатно",
      card_mod: "Модификация",
      card_model: "Модель анализа",
      card_1click: "Запуск в 1 клик",
      card_arch_note: "v0.1 beta · бесплатно на 30 дней",
      c1_l1: "Анализ позиций в реальном времени",
      c1_l2: "Предсказатель ходов AIarch v1",
      c1_l3: "Тренировка дебютов и тактики",
      c1_l4: "Полная совместимость с SKT Arch",
      c2_l1: "Движок Stockfish 19 на Rust",
      c2_l2: "Нейросеть AIarch v1 для анализа",
      c2_l3: "До 6 линий MultiPV и Hash",
      c2_l4: "Бесплатный доступ на 30 дней",
      c3_l1: "Прямое подключение к доске",
      c3_l2: "Переключение с Chess.com в 1 клик",
      c3_l3: "Поддержка всех настроек движка",
      c3_l4: "Новые модули в обновлениях",
      ui_h2: "Как это выглядит",
      ui_cap_1: "SKT Launcher — выбор платформы (Chess.com / Lichess), запуск модулей и журнал изменений.",
      ui_cap_2: "SKT Arch 0.1 beta — управление Stockfish 19, нейросеть AIarch v1 и живая телеметрия ядра Rust.",
      pros_h2: "Достоинства",
      pros_1_t: "Нативный Rust",
      pros_1_p: "Никаких тяжёлых веб-обёрток: быстрый старт, минимальное потребление RAM и мгновенный отклик интерфейса.",
      pros_2_t: "Полный контроль",
      pros_2_p: "Вы сами задаёте глубину поиска, число потоков, лимит времени и размер Hash под мощность своего компьютера.",
      pros_3_t: "Модульная система",
      pros_3_p: "Новые шахматные сервисы и улучшения модели добавляются прямо в лаунчер без ручной переустановки.",
      mods_cta_t: "Бесплатно на 30 дней для Windows",
      mods_cta_s: "Модификации Chess.com и Lichess + модель SKT Arch v0.1 beta уже внутри",

      // News Page
      news_h1: "Новости",
      news_sub: "Обновления лаунчера, новые версии SKT Arch и планы развития",
      n1_t: "SKT Arch v0.1 beta — Stockfish 19 + AIarch v1",
      n1_p1: "Вышла первая открытая бета-версия модели шахматного анализа SKT Arch. Связка Stockfish 19 и нейросети AIarch v1 работает прямо на нативном ядре Rust с живой телеметрией, расчётом на ходу соперника и до 6 линий MultiPV.",
      n1_p2: "Модель встроена в лаунчер для Windows и доступна бесплатно на 30 дней (версия для Android — скоро). Скачать сборку можно в нашем Telegram-канале:",
      n2_t: "Релиз SKT Launcher на Rust",
      n2_p: "Обновлённый интерфейс лаунчера с мгновенным запуском на Rust. Добавлено переключение между Chess.com и Lichess в один клик, встроенный Change Log и слоты для будущих модификаций.",
      n3_t: "Мобильная версия для Android и новые модули",
      n3_date: "Скоро",
      n3_p: "Мы готовим мобильную версию SKT Launcher для Android, а также дополнительные модули для других шахматных сервисов и расширенные инструменты разбора партий.",

      // About Page
      about_h1: "О проекте",
      ab1_p: "SKT Launcher — единый быстрый лаунчер для шахматистов, объединяющий модификации для Chess.com, Lichess и будущих платформ. Доступен для Windows (бесплатно на 30 дней), а версия для Android уже готовится к выходу.",
      ab2_t: "Технологии: Rust + SKT Arch",
      ab2_p: "Вся основа лаунчера и телеметрия движка написаны на Rust — благодаря этому приложение открывается мгновенно и экономит ресурсы системы. Внутри доступна модель SKT Arch v0.1 beta (бесплатно на 30 дней), сочетающая Stockfish 19 и нейросеть AIarch v1 для глубокого и быстрого анализа позиций.",
      ab3_t: "Контакты и загрузка",
      ab3_tg: "Telegram-канал и загрузка:",
      ab3_gh: "Репозиторий сайта:",
    },
    en: {
      // Page Titles
      title_home: "SKT Launcher — Next-Gen Chess Launcher in Rust | SKT Arch v0.1 beta",
      title_arch: "SKT Arch v0.1 beta — Hybrid Chess Analysis Engine",
      title_mods: "Modules & Interface — SKT Launcher",
      title_news: "News — SKT Launcher",
      title_about: "About — SKT Launcher",

      // Shared Nav & Footer
      nav_home: "Home",
      nav_mods: "Modules",
      nav_arch: "SKT Arch",
      nav_news: "News",
      nav_about: "About",
      nav_dl: "Download",
      nav_dl_tg: "Download on Telegram",
      dock_cta: "Download · Android soon",
      footer_tg: "Our Telegram (@sktlauncher)",
      footer_info: "Info",
      footer_tg_ch: "Telegram channel",
      footer_product: "Product",
      footer_mods: "Modifications",
      footer_ui: "Interface",
      footer_win_and: "Windows (Android soon)",
      footer_tech: "Technology",
      footer_ai: "AIarch v1 Neural Net",
      footer_rust: "Rust Core",
      footer_copy: "SKT Launcher. All rights reserved.",

      // Platform badges & buttons
      btn_dl_win: "Download for Windows",
      btn_dl_30: "Try free for 30 days",
      btn_dl_short: "Download",
      btn_arch_more: "Explore SKT Arch",
      soon_android: "Coming soon on Android",
      free_30_short: "Free for 30 days",
      free_30_meta: "Free for 30 days · @sktlauncher",

      // Homepage Hero
      home_kicker: "WRITTEN IN RUST · FREE FOR 30 DAYS",
      home_h1: "Next-generation chess launcher",
      home_sub: "Service modifications and SKT Arch analysis powered by Stockfish 19 + AIarch v1 neural net — free for 30 days",
      tab_demo: "Demo",
      tab_live: "Analysis",
      tab_launcher: "Launcher",
      demo_desc: "Deep, fast position analysis, training, and human move prediction on Chess.com and Lichess.",
      preset_blitz: "Blitz",
      preset_std: "Standard",
      preset_deep: "Deep",
      btn_start: "Start",
      btn_stop: "Stop",
      slot_tel: "Rust Telemetry",
      slot_tel_sub: "4 threads · MultiPV 6",
      slot_limit: "Time Limit",
      slot_limit_sub: "Native launch <1s",
      slot_nn: "Neural Net",
      slot_nn_sub: "Search boost & human moves",
      pc_foot_mid: "Free for 30 days · Rust",
      status_active: "Active",
      status_stopped: "Stopped",
      status_ready: "ready to launch",
      status_idle: "Idle",
      stat_depth: "Depth",
      stat_nps: "Nodes/s",
      stat_best: "Best Move",
      stat_best_short: "Best",
      ai_human: "Human",
      ai_alt: "alt.",

      // Homepage Services & Why
      srv_label: "Built for leading chess platforms and analysis engines",
      why_h2: "Why SKT Launcher",
      why_1_t: "Rust Speed",
      why_1_p: "Both the launcher core and engine bridge are written in Rust. Native execution launches instantly, saves RAM, and stays smooth under multi-threaded search.",
      why_2_t: "SKT Arch v0.1",
      why_2_p: "Hybrid analysis model (free for 30 days): Stockfish 19 calculates sharp tactics while the AIarch v1 neural net predicts natural human moves.",
      why_3_t: "All Services Together",
      why_3_p: "Includes modifications for Chess.com, Lichess, and upcoming platforms. Switch services and receive updates from one clean window.",

      // Homepage Bottom CTA
      cta_h2_1: "Ready to experience chess",
      cta_h2_2: "in a new way?",
      cta_sub: "Try free for 30 days — modifications and SKT Arch v0.1 beta are built right in",

      // Arch Page
      arch_sub: "Chess analysis model combining Stockfish 19 and AIarch v1 neural net — free for 30 days",
      scroll_cue: "Scroll",
      arch_k1: "// hybrid analysis",
      arch_t1: "Deeper and faster — powered by AIarch v1",
      arch_p1: "A plain engine wastes cycles exploring hundreds of unnatural lines. SKT Arch pairs Stockfish 19 with the AIarch v1 neural network inside a Rust core — accurate, fast, and human-readable.",
      diag_old_t: "Brute-force search",
      diag_old_c: "thousands of wasted branches · slower response",
      diag_new_c: "Stockfish 19 + AIarch v1 · native Rust pipeline",
      cmp_1_n: "Speed",
      cmp_1_ot: "Browser engines",
      cmp_1_op: "Run inside JS/WASM tabs and bog down during deep calculations.",
      cmp_1_np: "Native Rust core running multi-threaded Stockfish 19 right on your PC.",
      cmp_2_n: "Move logic",
      cmp_2_ot: "Pure engine",
      cmp_2_op: "Outputs computer-only lines that are hard to understand over the board.",
      cmp_2_np: "AIarch v1 neural network highlights natural human moves and probabilities.",
      cmp_3_n: "MultiPV & depth",
      cmp_3_ot: "Capped analysis",
      cmp_3_op: "Single line or capped search depth without paid tiers.",
      cmp_3_np: "Configurable depth, threads, Hash size, and up to 6 parallel MultiPV lines.",
      cmp_4_n: "Integration",
      cmp_4_ot: "Manual FEN copy",
      cmp_4_op: "Requires copying positions manually into external analysis boards.",
      cmp_4_np: "Direct one-click launch for Chess.com and Lichess inside SKT Launcher.",
      cmp_5_n: "Access",
      cmp_5_ot: "Paid tools",
      cmp_5_op: "Charge upfront from day one for deep analysis and extra lines.",
      cmp_5_np: "Free for 30 days — SKT Arch v0.1 beta is already built into SKT Launcher.",
      arch_k2: "// what's inside",
      arch_t2: "Everything for analysis — in one panel",
      f6_1_p: "Razor-sharp calculation of tactics, forced mates, and endgames at full native speed.",
      f6_2_t: "AIarch v1 Predictor",
      f6_2_p: "Neural network estimates the moves a real human opponent is most likely to play.",
      f6_3_t: "Ponder on opponent turn",
      f6_3_p: "Continues analyzing while your opponent thinks so the evaluation is ready instantly.",
      f6_4_t: "MultiPV Lines",
      f6_4_p: "Inspect up to 6 top continuations side by side for deeper positional insight.",
      f6_5_t: "Fine-Grained Controls",
      f6_5_p: "Tune search depth, Stockfish threads, time limit, and Hash memory for your hardware.",
      f6_6_t: "Rust Telemetry",
      f6_6_p: "Live console displaying engine state, nodes per second, and board sync with zero lag.",
      arch_shot_cap: "Actual SKT Arch 0.1 beta control panel with engine settings and real-time Rust telemetry.",
      arch_k3: "// three steps",
      arch_t3: "How to start",
      st_1_t: "Open our Telegram channel",
      st_1_p: "Visit @sktlauncher and download the latest SKT Launcher build for Windows.",
      st_2_t: "Pick your platform",
      st_2_p: "Open SKT Launcher and choose Chess.com or Lichess inside the SKT Arch v0.1 beta card.",
      st_3_t: "Click «Start»",
      st_3_p: "Stockfish 19 and AIarch v1 launch automatically — ready for fast, deep analysis.",
      arch_cta_t: "Ready to try SKT Arch?",
      arch_cta_s: "Free for 30 days inside SKT Launcher for Windows",

      // Mods Page
      mods_h1: "Modules & features",
      mods_sub: "All modifications and the SKT Arch analysis model are free for 30 days inside one launcher",
      badge_platform: "Platform",
      badge_builtin: "30 days free",
      card_mod: "Modification",
      card_model: "Analysis model",
      card_1click: "1-click launch",
      card_arch_note: "v0.1 beta · free for 30 days",
      c1_l1: "Real-time position analysis",
      c1_l2: "AIarch v1 human move predictor",
      c1_l3: "Opening & tactics training",
      c1_l4: "Full SKT Arch integration",
      c2_l1: "Stockfish 19 engine on Rust",
      c2_l2: "AIarch v1 neural net analysis",
      c2_l3: "Up to 6 MultiPV lines & Hash",
      c2_l4: "Free access for 30 days",
      c3_l1: "Direct board connection",
      c3_l2: "1-click switch with Chess.com",
      c3_l3: "All engine tuning controls",
      c3_l4: "New modules via updates",
      ui_h2: "How it looks",
      ui_cap_1: "SKT Launcher — switch between Chess.com & Lichess, launch modules, and check changelogs.",
      ui_cap_2: "SKT Arch 0.1 beta — Stockfish 19 controls, AIarch v1 neural net, and live Rust core telemetry.",
      pros_h2: "Highlights",
      pros_1_t: "Native Rust",
      pros_1_p: "No heavy web wrappers: instant startup, tiny memory footprint, and zero UI stutter.",
      pros_2_t: "Full Control",
      pros_2_p: "Configure search depth, CPU threads, time limits, and Hash table size for your PC.",
      pros_3_t: "Modular Architecture",
      pros_3_p: "New chess platforms and engine upgrades arrive directly inside SKT Launcher.",
      mods_cta_t: "Free for 30 days on Windows",
      mods_cta_s: "Chess.com & Lichess mods + SKT Arch v0.1 beta included inside",

      // News Page
      news_h1: "News",
      news_sub: "Launcher updates, SKT Arch releases, and upcoming roadmap",
      n1_t: "SKT Arch v0.1 beta — Stockfish 19 + AIarch v1",
      n1_p1: "The first public beta of the SKT Arch chess analysis model is out. Combining Stockfish 19 and the AIarch v1 neural network on a native Rust core with live telemetry, opponent-turn pondering, and up to 6 MultiPV lines.",
      n1_p2: "Included in the Windows launcher and free for 30 days (Android version coming soon). Download the build from our Telegram channel:",
      n2_t: "SKT Launcher Release on Rust",
      n2_p: "Refreshed launcher interface with instant native startup in Rust. Added 1-click switching between Chess.com and Lichess, built-in Change Log, and slots for upcoming modules.",
      n3_t: "Android Mobile App & New Modules",
      n3_date: "Soon",
      n3_p: "We are preparing the mobile SKT Launcher version for Android alongside new service modules and expanded game-review tools.",

      // About Page
      about_h1: "About",
      ab1_p: "SKT Launcher is a fast unified launcher for chess players, bringing together modifications for Chess.com, Lichess, and upcoming platforms. Available for Windows (free for 30 days), with an Android version coming soon.",
      ab2_t: "Tech Stack: Rust + SKT Arch",
      ab2_p: "The entire launcher foundation and engine telemetry are written in Rust for instant startup and minimal resource usage. Built in is SKT Arch v0.1 beta (free for 30 days), uniting Stockfish 19 and the AIarch v1 neural network for deep, fast analysis.",
      ab3_t: "Links & Download",
      ab3_tg: "Telegram channel & download:",
      ab3_gh: "Website repository:",
    },
  };

  function getInitialLang() {
    const qp = new URLSearchParams(window.location.search).get("lang");
    if (qp === "en" || qp === "ru") return qp;
    try {
      const saved = localStorage.getItem("skt_lang");
      if (saved === "en" || saved === "ru") return saved;
    } catch (e) {}
    return "ru";
  }

  let current = getInitialLang();
  const listeners = [];

  function t(key) {
    return (DICT[current] && DICT[current][key]) || DICT.ru[key] || key;
  }

  function apply(lang) {
    if (lang !== "ru" && lang !== "en") return;
    current = lang;
    try { localStorage.setItem("skt_lang", lang); } catch (e) {}
    document.documentElement.lang = lang;

    const pageKey = document.body.dataset.titleKey;
    if (pageKey && DICT[lang][pageKey]) document.title = DICT[lang][pageKey];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const val = DICT[lang][key];
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll(".lang-btn").forEach((b) => {
      const active = b.dataset.lang === lang;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    listeners.forEach((fn) => fn(lang));
  }

  window.SKT_I18N = {
    t,
    get: () => current,
    set: apply,
    onChange: (fn) => listeners.push(fn),
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-btn");
    if (btn && btn.dataset.lang) apply(btn.dataset.lang);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => apply(current));
  } else {
    apply(current);
  }
})();
