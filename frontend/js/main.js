const root = document.documentElement;
const savedTheme = localStorage.getItem("filehub-theme") || "dark";
root.setAttribute("data-theme", savedTheme);

const toggleTheme = document.querySelector('[data-theme-toggle]');
if (toggleTheme) {
  toggleTheme.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("filehub-theme", nextTheme);
    toggleTheme.setAttribute("aria-label", nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    toggleTheme.innerHTML = nextTheme === "dark" ? "☀️" : "🌙";
  });
}

const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("is-open"));
}

const navLinks = document.querySelectorAll(".nav-link");
const currentFile = (window.location.pathname.split("/").pop() || "index.html").replace(".html", "");
navLinks.forEach((link) => {
  const page = link.dataset.page;
  if (page === currentFile || (currentFile === "index" && page === "login")) {
    link.classList.add("is-active");
  }
});

const form = document.querySelector("[data-auth-form]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.createElement("div");
    message.className = "notice";
    message.textContent = form.dataset.mode === "login"
      ? "Signed in successfully. Redirecting to your workspace…"
      : "Account created successfully. Redirecting to the dashboard…";

    const target = form.querySelector(".form-actions");
    if (target) {
      target.insertAdjacentElement("afterend", message);
    }

    const button = form.querySelector("button[type='submit']");
    if (button) button.disabled = true;

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 900);
  });
}

const searchInput = document.querySelector("[data-search]");
const cardItems = document.querySelectorAll("[data-filter-card]");
if (searchInput && cardItems.length) {
  searchInput.addEventListener("input", (event) => {
    const term = event.target.value.trim().toLowerCase();
    cardItems.forEach((card) => {
      const content = card.textContent.toLowerCase();
      card.style.display = content.includes(term) ? "grid" : "none";
    });
  });
}

const skeletons = document.querySelectorAll("[data-skeleton]");
skeletons.forEach((item) => {
  item.classList.add("skeleton");
});

const liveClock = document.querySelector("[data-live-clock]");
if (liveClock) {
  const tick = () => {
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  tick();
  setInterval(tick, 1000);
}
