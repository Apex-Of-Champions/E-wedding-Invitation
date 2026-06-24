const openingLoader = document.getElementById("opening-loader");
    const siteNav = document.querySelector(".site-nav");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const weddingMusic = document.getElementById("wedding-music");
    const musicToggle = document.getElementById("music-toggle");
    const musicVolume = document.getElementById("music-volume");

    if (navToggle && siteNav) {
      navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      });

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          siteNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "Open navigation menu");
        });
      });
    }

    function updateNavScrollState() {
      if (!siteNav) {
        return;
      }

      siteNav.classList.toggle("is-scrolled", window.scrollY > 18);
    }

    updateNavScrollState();
    window.addEventListener("scroll", updateNavScrollState, { passive: true });

    function updateMusicButton() {
      if (!weddingMusic || !musicToggle) {
        return;
      }

      const isPlaying = !weddingMusic.paused;
      musicToggle.textContent = isPlaying ? "Pause" : "Play";
      musicToggle.classList.toggle("is-playing", isPlaying);
      musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    }

    async function playWeddingMusic() {
      if (!weddingMusic) {
        return;
      }

      try {
        await weddingMusic.play();
      } catch (error) {
        updateMusicButton();
      }
    }

    function playMusicOnFirstInteraction(event) {
      if (event.target.closest(".music-panel")) {
        document.removeEventListener("pointerdown", playMusicOnFirstInteraction);
        document.removeEventListener("keydown", playMusicOnFirstInteraction);
        return;
      }

      if (weddingMusic && weddingMusic.paused) {
        playWeddingMusic();
      }

      document.removeEventListener("pointerdown", playMusicOnFirstInteraction);
      document.removeEventListener("keydown", playMusicOnFirstInteraction);
    }

    if (weddingMusic && musicToggle && musicVolume) {
      weddingMusic.volume = 0.5;
      playWeddingMusic();

      document.addEventListener("pointerdown", playMusicOnFirstInteraction);
      document.addEventListener("keydown", playMusicOnFirstInteraction);

      musicToggle.addEventListener("click", () => {
        if (weddingMusic.paused) {
          playWeddingMusic();
        } else {
          weddingMusic.pause();
          updateMusicButton();
        }
      });

      weddingMusic.addEventListener("play", updateMusicButton);
      weddingMusic.addEventListener("pause", updateMusicButton);

      musicVolume.addEventListener("input", () => {
        weddingMusic.volume = Number(musicVolume.value) / 100;
      });

      updateMusicButton();
    }

    const revealItems = document.querySelectorAll(
      "section, .welcome-card, .details-panel, .entourage-item, .dress-card, .gift-card, .unplugged-card, .share-card, .gallery-carousel, .gallery-thumb, .rsvp-form, .site-footer"
    );

    revealItems.forEach((item) => item.classList.add("scroll-reveal"));

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      });

      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    window.addEventListener("load", () => {
      setTimeout(() => {
        document.body.classList.remove("is-loading");

        if (openingLoader) {
          openingLoader.classList.add("is-hidden");
        }

        playWeddingMusic();
      }, 2000);
    });

    const weddingDate = new Date("2026-10-03T10:45:00+08:00").getTime();
    const countdownElements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    function updateCountdown() {
      const now = Date.now();
      const remaining = Math.max(weddingDate - now, 0);

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      countdownElements.days.textContent = String(days).padStart(3, "0");
      countdownElements.hours.textContent = String(hours).padStart(2, "0");
      countdownElements.minutes.textContent = String(minutes).padStart(2, "0");
      countdownElements.seconds.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    const entourageTriggers = document.querySelectorAll(".entourage-trigger");

    entourageTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        entourageTriggers.forEach((otherTrigger) => {
          const otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
          otherTrigger.setAttribute("aria-expanded", "false");
          otherPanel.classList.remove("is-open");
        });

        if (!isOpen) {
          trigger.setAttribute("aria-expanded", "true");
          panel.classList.add("is-open");

          window.setTimeout(() => {
            trigger.closest(".entourage-item").scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }, 80);
        }
      });
    });

    const copyHashtagButton = document.getElementById("copy-hashtag");
    const copyStatus = document.getElementById("copy-status");
    let copyStatusTimer;

    function showCopyStatus(message) {
      copyStatus.textContent = message;
      copyStatus.classList.add("is-visible");
      clearTimeout(copyStatusTimer);
      copyStatusTimer = setTimeout(() => {
        copyStatus.classList.remove("is-visible");
      }, 1800);
    }

    function copyTextFallback(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "-999px";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      return copied;
    }

    copyHashtagButton.addEventListener("click", async () => {
      const hashtag = copyHashtagButton.dataset.hashtag;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(hashtag);
        } else if (!copyTextFallback(hashtag)) {
          throw new Error("Copy command failed");
        }

        showCopyStatus("Hashtag copied!");
      } catch (error) {
        showCopyStatus("Please copy the hashtag manually.");
      }
    });

    const galleryCarousel = document.querySelector(".gallery-carousel");

    if (galleryCarousel) {
      const gallerySlides = Array.from(galleryCarousel.querySelectorAll(".gallery-slide"));
      const galleryPrev = galleryCarousel.querySelector(".gallery-control.prev");
      const galleryNext = galleryCarousel.querySelector(".gallery-control.next");
      let galleryIndex = 0;
      let galleryTimer;

      function setGallerySlide(nextIndex) {
        galleryIndex = (nextIndex + gallerySlides.length) % gallerySlides.length;

        gallerySlides.forEach((slide, index) => {
          slide.classList.toggle("is-active", index === galleryIndex);
          slide.setAttribute("aria-hidden", index === galleryIndex ? "false" : "true");
        });
      }

      function startGalleryAutoplay() {
        clearInterval(galleryTimer);
        galleryTimer = setInterval(() => {
          setGallerySlide(galleryIndex + 1);
        }, 4200);
      }

      gallerySlides.forEach((slide, index) => {
        slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");
      });

      galleryPrev.addEventListener("click", () => {
        setGallerySlide(galleryIndex - 1);
        startGalleryAutoplay();
      });

      galleryNext.addEventListener("click", () => {
        setGallerySlide(galleryIndex + 1);
        startGalleryAutoplay();
      });

      galleryCarousel.addEventListener("mouseenter", () => clearInterval(galleryTimer));
      galleryCarousel.addEventListener("mouseleave", startGalleryAutoplay);
      galleryCarousel.addEventListener("focusin", () => clearInterval(galleryTimer));
      galleryCarousel.addEventListener("focusout", startGalleryAutoplay);

      setGallerySlide(0);
      startGalleryAutoplay();
    }

    const customRsvpForm = document.getElementById("custom-rsvp-form");
    const rsvpSubmitStatus = document.getElementById("rsvp-submit-status");
    let rsvpStatusTimer;

    customRsvpForm.addEventListener("submit", () => {
      rsvpSubmitStatus.textContent = "Submitting your RSVP...";
      rsvpSubmitStatus.classList.add("is-visible");

      clearTimeout(rsvpStatusTimer);
      rsvpStatusTimer = setTimeout(() => {
        rsvpSubmitStatus.textContent = "Thank you! Your RSVP has been submitted.";
        customRsvpForm.reset();
      }, 1400);
    });

