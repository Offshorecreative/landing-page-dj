const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const track = (event, detail = {}) =>
  (window.dataLayer = window.dataLayer || []).push({ event, ...detail });

const menu = $("#nav"),
  burger = $("#burger");

function toggleMenu(open) {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

burger.onclick = () => toggleMenu(!menu.classList.contains("open"));
menu.onclick = () => toggleMenu(false);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleMenu(false);
});

document
  .querySelectorAll('a[href="#contact"],a[href="#work"]')
  .forEach((a) =>
    a.addEventListener("click", () =>
      track("cta_click", {
        destination: a.hash,
        label: a.textContent.trim(),
      }),
    ),
  );

// Hero videos
const videoId = "OzXU9lG3Jxo";

const pause = $("#pauseFilm"),
  trackElement = $(".heroTrack");

const frameBtns = [
  ...document.querySelectorAll(".slideControls button[aria-pressed]"),
];

const heroVideos = [...trackElement.querySelectorAll("video")];

let current = 0;

function playClip(clip) {
  if (!clip.hasAttribute("src")) clip.src = clip.dataset.src;
  clip.play().catch(() => {});
}

function updatePause() {
  const paused = heroVideos[current].paused;

  pause.textContent = paused ? "▷" : "Ⅱ";
  pause.setAttribute(
    "aria-label",
    paused ? "Resume background video" : "Pause background video",
  );
}

function showSlide(i, play = true) {
  current = i;

  trackElement.style.transform = "translateY(" + -100 * i + "%)";

  heroVideos.forEach((clip, index) => {
    if (index !== i) clip.pause();
    else if (play) playClip(clip);
  });

  frameBtns.forEach((button, index) =>
    button.setAttribute("aria-pressed", String(i === index)),
  );

  $("#frame").textContent = "0" + (i + 1) + " / 03";
  pause.hidden = false;

  updatePause();
}

heroVideos.forEach((clip) =>
  ["playing", "pause", "error"].forEach((event) =>
    clip.addEventListener(event, updatePause),
  ),
);

frameBtns.forEach((button, index) => {
  button.onclick = () => showSlide(index);
});

pause.onclick = () => {
  const clip = heroVideos[current];

  if (clip.paused) playClip(clip);
  else clip.pause();
};

showSlide(0, !reduced && !navigator.connection?.saveData);

// Portfolio popup
const viewer = $("#viewer"),
  holder = $("#videoHolder");

const soundButton = viewer.querySelector(".sound");

function syncSound(video) {
  soundButton.textContent = video.muted ? "Sound on" : "Mute";

  soundButton.setAttribute(
    "aria-label",
    video.muted ? "Turn sound on" : "Mute sound",
  );
}

function watchSound(video) {
  soundButton.hidden = false;
  syncSound(video);

  video.addEventListener("volumechange", () => syncSound(video));
}

// Play card previews while visible
const previewObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const clip = entry.target;

    if (entry.isIntersecting) playClip(clip);
    else clip.pause();
  }
});

document
  .querySelectorAll(".works video")
  .forEach((clip) => previewObserver.observe(clip));

// Open selected project
document.querySelectorAll(".works button.card").forEach((card, i) => {
  card.onclick = () => {
    holder.replaceChildren();
    $("#fullPhoto").hidden = true;
    soundButton.hidden = true;

    const title = card.querySelector("strong").textContent;
    const category = card.querySelector("small").textContent;

    $("#projectTitle").textContent = title;
    $("#category").textContent = category;

    const link = viewer.querySelector("a");

    link.href =
      i === 0
        ? "https://www.youtube.com/watch?v=" + videoId
        : "https://offshorecreative.co/projects";

    link.textContent =
      i === 0 ? "Watch on YouTube" : "Project portfolio";

    viewer.showModal();

    if (i === 0) {
      // ONYX BALI: load YouTube only after the card is clicked.
      const iframe = document.createElement("iframe");

      iframe.src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`;

      iframe.title = title;
      iframe.allow =
        "autoplay; encrypted-media; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      holder.replaceChildren(iframe);
    } else {
      // Other cards: retain their existing video playback.
      const preview = card.querySelector("video");

      if (preview) {
        const expanded = preview.cloneNode(false);

        expanded.removeAttribute("aria-hidden");

        if (card.hasAttribute("data-sound")) {
          expanded.removeAttribute("muted");
          expanded.muted = false;
        }

        expanded.controls = true;

        watchSound(expanded);
        holder.append(expanded);
        playClip(expanded);
      }
    }

    track("portfolio_open", { project: title });
  };
});

// Sound control for regular videos.
// YouTube uses its own player sound controls.
soundButton.onclick = (event) => {
  event.stopPropagation();

  const video = holder.querySelector("video");
  if (!video) return;

  video.muted = !video.muted;

  if (!video.muted && video.paused) {
    video.play().catch(() => {});
  }

  syncSound(video);
};

// Close popup
viewer.querySelector(".close").onclick = (event) => {
  event.stopPropagation();
  viewer.close();
};

// Close when clicking outside the popup
viewer.onclick = (event) => {
  if (event.target !== viewer) return;

  const bounds = viewer.getBoundingClientRect();

  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  ) {
    viewer.close();
  }
};

// Remove the player so playback stops when the popup closes.
viewer.onclose = () => {
  holder.replaceChildren();
  soundButton.hidden = true;
};

// Photography gallery
function revealGallery() {
  const active = document.getElementById(location.hash.slice(1));

  if (!active?.classList.contains("photoPanel")) return;

  document
    .querySelectorAll(".photoPanel")
    .forEach((panel) => (panel.hidden = panel !== active));

  active.focus({ preventScroll: true });

  active.scrollIntoView({
    behavior: reduced ? "instant" : "smooth",
    block: "start",
  });
}

document.querySelectorAll(".photoCard").forEach((link) =>
  link.addEventListener("click", (event) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (location.hash !== link.hash) {
      history.pushState(null, "", link.hash);
    }

    revealGallery();
  }),
);

window.addEventListener("hashchange", revealGallery);
revealGallery();

// WhatsApp inquiry form
const form = $("#inquiry");

function inquiryMessage(data) {
  const services = data.getAll("service").join(", ");

  const rows = [
    ["Name", data.get("name")],
    ["Artist / Company", data.get("artist")],
    ["Instagram / Website", data.get("profile")],
    ["Services", services],
    ["Preferred Date", data.get("date")],
    ["Project Details", data.get("details")],
  ];

  return [
    "Hi Offshore Creative! 👋",
    "I'm interested in your creative services for my project.",
    ...rows
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => "*" + k + ":* " + v.trim()),
    "I'd love to discuss this project further. Looking forward to hearing from you!",
  ].join("\n\n");
}

form.elements.name.oninput = () => {
  form.elements.name.setCustomValidity("");
};

form.onsubmit = (e) => {
  e.preventDefault();

  if (!form.elements.name.value.trim()) {
    form.elements.name.setCustomValidity("Please enter your name.");
    form.reportValidity();
    return;
  }

  const message = inquiryMessage(new FormData(form));

  window.open(
    "https://wa.me/628113935959?text=" + encodeURIComponent(message),
    "_blank",
    "noopener,noreferrer",
  );

  track("whatsapp_inquiry_open");
};

// Scroll animations
if (!reduced && window.gsap) {
  const io = new IntersectionObserver((entries) =>
    entries
      .filter((e) => e.isIntersecting)
      .forEach((e) => {
        gsap.from(e.target, {
          y: 16,
          opacity: 0.75,
          duration: 0.55,
        });

        io.unobserve(e.target);
      }),
  );

  document
    .querySelectorAll(".works,.services,.flowImage,.proof blockquote")
    .forEach((el) => io.observe(el));
}
