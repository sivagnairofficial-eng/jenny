function goTo(url) {
  window.location.href = url;
}

function showStatus(note, message) {
  if (!note) return;
  note.textContent = message;
  note.classList.add("visible");
}

function clearExistingConfetti() {
  document.querySelectorAll(".confetti").forEach((piece) => piece.remove());
}

function launchConfetti() {
  const colors = ["#ff7ad9", "#8ff3ff", "#ffd166", "#ffffff", "#8a82ff"];
  const pieces = 80;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.6 + Math.random() * 2.4}s`;
    piece.style.animationDelay = `${Math.random() * 0.9}s`;
    piece.style.width = `${6 + Math.random() * 8}px`;
    piece.style.height = `${10 + Math.random() * 10}px`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 6000);
  }
}

function launchAmbientComets() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const colors = [
    "rgba(255, 122, 217, 0.95)",
    "rgba(143, 243, 255, 0.95)",
    "rgba(255, 209, 102, 0.92)",
    "rgba(138, 130, 255, 0.92)",
  ];

  const spawnComets = () => {
    for (let i = 0; i < 2; i += 1) {
      const comet = document.createElement("span");
      comet.className = "ambient-comet";

      const size = 6 + Math.random() * 8;
      comet.style.left = `${Math.random() * 100}vw`;
      comet.style.top = `${-12 - Math.random() * 18}vh`;
      comet.style.width = `${size}px`;
      comet.style.height = `${size}px`;
      comet.style.color = colors[Math.floor(Math.random() * colors.length)];
      comet.style.setProperty("--dx", `${-10 + Math.random() * 20}vw`);
      comet.style.setProperty("--dy", `${114 + Math.random() * 18}vh`);
      comet.style.animationDuration = `${8 + Math.random() * 4}s`;
      comet.style.animationDelay = `${Math.random() * 0.8}s`;

      document.body.appendChild(comet);
      window.setTimeout(() => comet.remove(), 13500);
    }
  };

  spawnComets();
  window.setInterval(spawnComets, 1800);
}

function shuffleArray(values) {
  const items = [...values];

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function createFallbackArt(seed) {
  const palettes = [
    ["#ff7ad9", "#8a82ff", "#ffd166"],
    ["#8ff3ff", "#5b7cfa", "#ff85b3"],
    ["#ffd166", "#ff7ad9", "#7c5cff"],
    ["#8a82ff", "#2ee6a6", "#ffb703"],
  ];
  const [a, b, c] = palettes[(seed - 1) % palettes.length];
  const bgId = `bg-${seed}`;
  const glowId = `glow-${seed}`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="Birthday placeholder art">
      <defs>
        <linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${a}" />
          <stop offset="100%" stop-color="${b}" />
        </linearGradient>
        <radialGradient id="${glowId}" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".42" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#${bgId})" />
      <circle cx="220" cy="180" r="170" fill="${c}" fill-opacity=".22" />
      <circle cx="940" cy="180" r="220" fill="#ffffff" fill-opacity=".14" />
      <circle cx="870" cy="640" r="300" fill="#000000" fill-opacity=".08" />
      <ellipse cx="600" cy="520" rx="330" ry="230" fill="url(#${glowId})" />
      <path d="M120 720 C250 560 420 840 580 650 S900 560 1080 730 L1080 900 L120 900 Z" fill="#ffffff" fill-opacity=".18" />
      <path d="M0 770 C160 660 320 800 500 720 S860 650 1200 780 L1200 900 L0 900 Z" fill="#000000" fill-opacity=".08" />
      <g opacity=".78">
        <circle cx="180" cy="630" r="34" fill="#fff" />
        <circle cx="230" cy="600" r="18" fill="#fff" />
        <circle cx="300" cy="660" r="24" fill="#fff" />
        <circle cx="870" cy="620" r="28" fill="#fff" />
        <circle cx="930" cy="575" r="16" fill="#fff" />
        <circle cx="990" cy="650" r="22" fill="#fff" />
      </g>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  const dots = document.querySelector("[data-carousel-dots]");
  const prevButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");

  if (!track || !dots || !prevButton || !nextButton) {
    return;
  }

  const photoFiles = shuffleArray(
    Array.from({ length: 3 }, (_, index) => `photos/img${index + 1}.jpg`)
  );

  let currentIndex = 0;
  let autoplayTimer = null;
  const indicators = [];

  const updateSlide = (index) => {
    const total = photoFiles.length;
    currentIndex = (index + total) % total;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    indicators.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
      dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
    });
  };

  photoFiles.forEach((file, index) => {
    const slide = document.createElement("figure");
    slide.className = "carousel-slide";

    const image = document.createElement("img");
    image.alt = `Jennifer photo ${index + 1}`;
    image.src = file;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied === "1") return;
      image.dataset.fallbackApplied = "1";
      image.onerror = null;
      image.src = createFallbackArt(index + 1);
    });

    slide.appendChild(image);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.addEventListener("click", () => {
      updateSlide(index);
      restartAutoplay();
    });
    dots.appendChild(dot);
    indicators.push(dot);
  });

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const restartAutoplay = () => {
    stopAutoplay();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplayTimer = window.setInterval(() => {
        updateSlide(currentIndex + 1);
      }, 3800);
    }
  };

  prevButton.addEventListener("click", () => {
    updateSlide(currentIndex - 1);
    restartAutoplay();
  });

  nextButton.addEventListener("click", () => {
    updateSlide(currentIndex + 1);
    restartAutoplay();
  });

  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", restartAutoplay);
  track.addEventListener("focusin", stopAutoplay);
  track.addEventListener("focusout", restartAutoplay);

  updateSlide(0);
  restartAutoplay();
}

function setupBirthdayMusic() {
  const audio = document.querySelector("[data-birthday-music]");
  const toggle = document.querySelector("[data-music-toggle]");
  const status = document.querySelector("[data-music-status]");

  if (!audio || !toggle) {
    return null;
  }

  audio.volume = 0.78;
  let resumeAfterLetter = false;

  const syncUi = (isPlaying, message) => {
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.textContent = isPlaying ? "Pause music" : "Play music";
    if (status && message) {
      status.textContent = message;
    }
  };

  const startMusic = async (messageOnSuccess = "Music is playing.") => {
    try {
      await audio.play();
      syncUi(true, messageOnSuccess);
      return true;
    } catch (error) {
      syncUi(false, "Autoplay blocked. Tap play to start the music.");
      return false;
    }
  };

  const pauseForLetter = () => {
    resumeAfterLetter = !audio.paused;
    if (resumeAfterLetter) {
      audio.pause();
    }
  };

  const resumeAfterLetterPopup = () => {
    if (!resumeAfterLetter) {
      return;
    }

    resumeAfterLetter = false;
    void startMusic("Music is playing.");
  };

  toggle.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await startMusic();
      } else {
        audio.pause();
        syncUi(false, "Music is paused.");
      }
    } catch (error) {
      syncUi(false, "Tap play again to start the music.");
    }
  });

  audio.addEventListener("play", () => {
    syncUi(true, "Music is playing.");
  });

  audio.addEventListener("pause", () => {
    syncUi(false, "Music is paused.");
  });

  syncUi(false, "Music starts automatically.");
  window.setTimeout(() => {
    startMusic("Music is playing.");
  }, 0);

  return {
    pauseForLetter,
    resumeAfterLetter: resumeAfterLetterPopup,
  };
}

function setupLetterPopup(musicController) {
  const overlay = document.querySelector("[data-letter-overlay]");
  const openButton = document.querySelector("[data-open-letter]");
  const closeButton = document.querySelector("[data-close-letter]");
  const letterAudio = document.querySelector("[data-letter-music]");

  if (!overlay || !openButton || !closeButton) {
    return;
  }

  let lastFocusedElement = null;

  const resetLetterAudio = () => {
    if (!letterAudio) {
      return;
    }

    letterAudio.pause();
    try {
      letterAudio.currentTime = 0;
    } catch (error) {
      // Ignore seek errors when the audio has not loaded yet.
    }
  };

  const playLetterAudio = () => {
    if (!letterAudio) {
      return;
    }

    resetLetterAudio();
    void letterAudio.play().catch(() => {});
  };

  const openLetter = () => {
    lastFocusedElement = document.activeElement;
    if (musicController) {
      musicController.pauseForLetter();
    }
    overlay.hidden = false;
    document.body.classList.add("modal-open");
    playLetterAudio();
    window.setTimeout(() => {
      closeButton.focus();
    }, 0);
  };

  const closeLetter = () => {
    resetLetterAudio();
    overlay.hidden = true;
    document.body.classList.remove("modal-open");
    if (musicController) {
      musicController.resumeAfterLetter();
    }
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    } else {
      openButton.focus();
    }
  };

  openButton.addEventListener("click", openLetter);
  closeButton.addEventListener("click", closeLetter);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeLetter();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.hidden && event.key === "Escape") {
      closeLetter();
    }
  });
}

function setupScrollHelper() {
  const helper = document.querySelector("[data-scroll-to-letter]");
  const openButton = document.querySelector("[data-open-letter]");

  if (!helper || !openButton) {
    return;
  }

  const updateVisibility = () => {
    const buttonRect = openButton.getBoundingClientRect();
    const fullyVisible = buttonRect.top >= 12 && buttonRect.bottom <= window.innerHeight - 12;
    helper.hidden = fullyVisible;
  };

  const scrollToLetter = () => {
    openButton.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  helper.addEventListener("click", scrollToLetter);
  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  updateVisibility();
}

function typeText(element) {
  const text = element.dataset.typewriter
    ? element.dataset.typewriter.trim()
    : element.textContent.trim();
  element.textContent = "";
  let index = 0;

  const tick = () => {
    element.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      window.setTimeout(tick, 26);
    }
  };

  tick();
}

document.addEventListener("DOMContentLoaded", () => {
  const giftButton = document.querySelector("[data-gift]");
  if (giftButton) {
    const openGift = () => goTo("friend.html");
    giftButton.addEventListener("click", openGift);
    giftButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGift();
      }
    });
  }

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const note = document.querySelector("[data-note]");
      const message = button.dataset.message || "Loading the next surprise...";

      showStatus(note, message);

      window.clearTimeout(window.__birthdayNavTimer);
      window.__birthdayNavTimer = window.setTimeout(() => {
        goTo(button.dataset.next);
      }, 850);
    });
  });

  if (document.body.classList.contains("page-surprise")) {
    buildCarousel();
    const birthdayMusic = setupBirthdayMusic();
    setupLetterPopup(birthdayMusic);
    setupScrollHelper();
    clearExistingConfetti();
    launchConfetti();
    launchAmbientComets();

    const text = document.querySelector("[data-typewriter]");
    if (text) {
      typeText(text);
    }

    window.setTimeout(launchConfetti, 1800);
  }
});
