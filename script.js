// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selection ---
  const navbar = document.getElementById("navbar");
  const toggleBtn = document.querySelector(".toggle-btn");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const liveClock = document.getElementById("live-clock");
  const serviceCards = document.querySelectorAll(".service-card");
  const portfolioTrack = document.querySelector(".portfolio-track");
  const contactForm = document.getElementById("contactForm");
  const adminLink = document.getElementById("admin-link");
  const adminLoginSection = document.getElementById("admin-login-section");
  const responseViewSection = document.getElementById("response-view-section");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const responseContainer = document.getElementById("response-container");
  const allSections = document.querySelectorAll("section");

  // --- CUSTOM CURSOR LOGIC ---
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);

  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .service-card, .portfolio-item, .gallery-item, .icon-item, .timeline-item"
  );
  const textElements = document.querySelectorAll("h1, h2, h3, h4, p, span, li");

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("pointer"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("pointer"));
  });

  textElements.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("text"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("text"));
  });

  // --- NAVBAR FUNCTIONALITY ---

  // Add scrolled class to navbar on scroll for glassmorphism effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveNavLink();
  });

  // Toggle mobile navigation menu
  toggleBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = toggleBtn.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  });

  // Close mobile menu when a navigation link is clicked
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        toggleBtn.querySelector("i").classList.add("fa-bars");
        toggleBtn.querySelector("i").classList.remove("fa-times");
      }
    });
  });

  // Update the active navigation link based on scroll position
  function updateActiveNavLink() {
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  }

  // --- THEME TOGGLE FUNCTIONALITY ---

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDarkMode = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateThemeIcon(isDarkMode);
  });

  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      updateThemeIcon(true);
    } else {
      document.body.classList.remove("dark-theme");
      updateThemeIcon(false);
    }
  }

  function updateThemeIcon(isDarkMode) {
    const icon = themeToggleBtn.querySelector("i");
    icon.classList.toggle("fa-moon", !isDarkMode);
    icon.classList.toggle("fa-sun", isDarkMode);
  }

  loadTheme();

  // --- LIVE CLOCK & DATE IN NAVBAR ---
  function updateClock() {
    if (liveClock) {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      liveClock.innerHTML = `${timeString}<br>${dateString}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- 3D INTERACTIVE CARDS (SERVICES SECTION) ---
  serviceCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const mouseX =
        (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const mouseY =
        (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      const rotateX = mouseY * -15;
      const rotateY = mouseX * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
  });

  // --- AUTO-SCROLLING PORTFOLIO MARQUEE ---
  if (portfolioTrack) {
    const items = Array.from(portfolioTrack.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      portfolioTrack.appendChild(clone);
    });
  }

  // --- CONTACT FORM & LOCALSTORAGE LOGIC ---
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    const newResponse = {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    };

    let responses = JSON.parse(localStorage.getItem("formResponses")) || [];
    responses.push(newResponse);
    localStorage.setItem("formResponses", JSON.stringify(responses));

    const submitBtn = this.querySelector(".submit-btn");
    submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check-circle"></i>';
    submitBtn.disabled = true;

    this.reset();

    setTimeout(() => {
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      submitBtn.disabled = false;
    }, 3000);
  });

  // --- ADMIN PANEL LOGIC ---
  adminLink.addEventListener("click", (e) => {
    e.preventDefault();
    allSections.forEach((sec) => {
      if (!sec.classList.contains("admin-section")) {
        sec.style.display = "none";
      }
    });
    adminLoginSection.style.display = "block";
    adminLoginSection.scrollIntoView();
  });

  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("admin-password").value;

    if (password === "admin2025") {
      adminLoginSection.style.display = "none";
      responseViewSection.style.display = "block";
      displayResponses();
    } else {
      alert("Incorrect Password!");
    }
    adminLoginForm.reset();
  });

  function displayResponses() {
    let responses = JSON.parse(localStorage.getItem("formResponses")) || [];
    responseContainer.innerHTML = "";

    if (responses.length === 0) {
      responseContainer.innerHTML = "<p>No responses yet.</p>";
      return;
    }

    responses.reverse().forEach((res) => {
      const card = document.createElement("div");
      card.className = "response-card";
      const formattedDate = new Date(res.timestamp).toLocaleString();

      card.innerHTML = `
                <p><strong>From:</strong> ${res.name} (&lt;${res.email}&gt;)</p>
                <p><strong>Subject:</strong> ${res.subject || "N/A"}</p>
                <p><strong>Message:</strong> ${res.message}</p>
                <p class="timestamp">${formattedDate}</p>
            `;
      responseContainer.appendChild(card);
    });
  }
});
