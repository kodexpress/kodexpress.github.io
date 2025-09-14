// Mobile Menu Toggle
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-links") && !e.target.closest(".menu-btn")) {
    navLinks.classList.remove("active");
  }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    const offset = 70;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const scrollToPosition = targetPosition - offset;

    window.scrollTo({
      top: scrollToPosition,
      behavior: "smooth",
    });
    // Close mobile menu after clicking a link
    navLinks.classList.remove("active");
  });
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all service cards
document.querySelectorAll(".service-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "all 0.6s ease-out";
  observer.observe(card);
});

// // Adding Logos
// const injectLogos = async () => {
//   const response = await fetch("../assets/js/partners.json");
//   const data = await response.json();
//   const partnersDiv = document.querySelector("#partners");
//   const logos = data.logos;

//   // Loop through logos to create img elements
//   logos.forEach((logo, index) => {
//     const img = document.createElement("img");
//     img.src = logo.path;
//     img.loading = "lazy";
//     img.alt = logo.description;
//     img.className = "partner-logo";

//     // Add the logo to the parent container
//     partnersDiv.appendChild(img);
//   });
//   const scrollers = document.querySelectorAll(".scroller");
//   scrollers.forEach((scroller) => {
//     scroller.setAttribute("data-animated", true);
//     const scrollerInner = scroller.querySelector(".scroller-inner");
//     scrollerInner.addEventListener("mouseenter", () => {
//       scrollerInner.style.animationPlayState = "paused"; // Pause the animation
//     });
//     scrollerInner.addEventListener("mouseleave", () => {
//       scrollerInner.style.animationPlayState = "running"; // Resume the animation
//     });
//     const scrollerContent = Array.from(scrollerInner.children);
//     // Clone the logo and add it to create a looping effect
//     scrollerContent.forEach((img) => {
//       const duplicatedImg = img.cloneNode(true);
//       duplicatedImg.setAttribute("aria-hidden", true);
//       scrollerInner.appendChild(duplicatedImg);
//     });
//   });
// };

const ctaButton = document.querySelector("#ctaButton");
ctaButton.addEventListener("click", () => {
  const target = document.querySelector("#contact");
  const offset = 70;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
  const scrollToPosition = targetPosition - offset;

  window.scrollTo({
    top: scrollToPosition,
    behavior: "smooth",
  });
});

// Add smooth scrolling
document.documentElement.style.scrollBehavior = "smooth";
// window.addEventListener("DOMContentLoaded", injectLogos);

// Check if user already chose a language
const savedLang = localStorage.getItem("preferredLang"); // "fr", "ar", etc.

// Detect browser language
const userLang = navigator.language || navigator.userLanguage; // e.g. "en-US"

// Function to redirect safely
function redirectTo(lang) {
  // Avoid redirect loop
  if (!window.location.pathname.startsWith(`/${lang}`) && lang !== "en") {
    window.location.href = lang === "en" ? "/" : `/${lang}/`;
  }
}

// Respect user preference first
if (savedLang) {
  redirectTo(savedLang);
} else {
  // Use browser language only if no saved preference
  if (userLang.startsWith("fr")) redirectTo("fr");
  else if (userLang.startsWith("ar")) redirectTo("ar");
  // else English → do nothing
}

// Save user choice when they click a language link
document.querySelectorAll("[data-lang]").forEach((link) => {
  link.addEventListener("click", (e) => {
    const lang = e.currentTarget.dataset.lang;
    localStorage.setItem("preferredLang", lang);
  });
});

// Form Submission
const contactForm = document.getElementById("contact-form");
const formResult = document.getElementById("form-result");
const submitBtn = document.getElementById("submit-btn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get language from hidden field
  const lang = contactForm.querySelector('input[name="page"]').value;

  // Texts per language
  const texts = {
    en: {
      wait: "Please wait...",
      success: "Sent! Thank you, we'll contact you soon 😊",
    },
    fr: {
      wait: "Veuillez patienter...",
      success: "Envoyé ! Merci, nous vous contacterons bientôt 😊",
    },
    ar: {
      wait: "الرجاء الانتظار...",
      success: "تم الإرسال! شكراً، سنتواصل معك قريباً 😊",
    },
  };

  const { wait, success } = texts[lang] || texts.en;

  // Disable button and show waiting text
  submitBtn.disabled = true;
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = wait;

  // Prepare data
  const formData = new FormData(contactForm);
  formData.append("access_key", "dd5bd7af-1951-40fe-b272-b0a6026e1a6f");
  const payload = Object.fromEntries(formData);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    if (response.ok) {
      formResult.style.color = "green";
      formResult.textContent = success;
      contactForm.reset();
    } else {
      formResult.style.color = "red";
      formResult.textContent = json.message || "Error sending the message.";
      console.error(json);
    }
  } catch (err) {
    formResult.style.color = "red";
    formResult.textContent = "Something went wrong!";
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;

    setTimeout(() => {
      formResult.style.display = "none";
    }, 5000);
  }
});
