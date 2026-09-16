/*
==========================================================
PERSONAL PORTFOLIO WEBSITE
JavaScript File
==========================================================

This file controls all interactive features of the portfolio.

Features included:
1. Mobile navigation menu
2. Navigation menu closing after selecting a link
3. Active navigation link while scrolling
4. Smooth scrolling
5. Scroll-to-top button
6. Scroll reveal animations
7. Animated skill progress bars
8. Current year in the footer
9. Project card interactions
10. Project modal (view details popup)
11. Copy-to-clipboard for contact info
12. Preventing errors when optional elements are missing
==========================================================
*/

/* ========================================================
   WAIT FOR THE HTML DOCUMENT TO LOAD
======================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /*
    ========================================================
    1. SELECT IMPORTANT HTML ELEMENTS
    ========================================================
    (Selectors below match the actual IDs/classes in index.html)
    */

  const menuToggle = document.querySelector("#mobileMenuButton");
  const navigation = document.querySelector("#mobileNavigation");
  const navigationLinks = document.querySelectorAll(
    ".desktop-navigation .nav-link, .mobile-navigation .mobile-nav-link",
  );

  const scrollTopButton = document.querySelector("#backToTop");

  const sections = document.querySelectorAll("section[id]");

  const skillCards = document.querySelectorAll(".skill-card");

  const revealElements = document.querySelectorAll(
    ".reveal, .about-content, .skill-card, .project-card, .resume-card, .social-platform-card",
  );

  const projectCards = document.querySelectorAll(".project-card");

  const yearElement = document.querySelector("#currentYear");

  /* ========================================================
       2. MOBILE NAVIGATION MENU
    ========================================================

       When the user clicks the menu button on a small screen,
       the navigation menu opens or closes.
    ======================================================== */

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", function () {
      navigation.classList.toggle("open");

      menuToggle.classList.toggle("active");

      const isOpen = navigation.classList.contains("open");

      menuToggle.setAttribute("aria-expanded", isOpen);
      navigation.setAttribute("aria-hidden", !isOpen);

      document.body.classList.toggle("menu-open", isOpen);
    });
  }

  /* ========================================================
       3. CLOSE MOBILE MENU AFTER CLICKING A LINK
    ======================================================== */

  navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navigation) {
        navigation.classList.remove("open");
        navigation.setAttribute("aria-hidden", "true");
      }

      if (menuToggle) {
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }

      document.body.classList.remove("menu-open");
    });
  });

  /* ========================================================
       4. SMOOTH SCROLLING
    ========================================================

       This allows navigation links such as:

       #home
       #about
       #skills
       #resume
       #projects
       #social
       #contact

       to smoothly move to the selected section.
       (CSS already sets scroll-behavior: smooth and
       scroll-padding-top, but this keeps things working
       even if that's ever removed.)
    ======================================================== */

  navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId) {
        return;
      }

      if (!targetId.startsWith("#")) {
        return;
      }

      const targetSection = document.querySelector(targetId);

      if (!targetSection) {
        return;
      }

      event.preventDefault();

      const header = document.querySelector(".site-header");

      let headerHeight = 0;

      if (header) {
        headerHeight = header.offsetHeight;
      }

      const targetPosition =
        targetSection.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  /* ========================================================
       5. ACTIVE NAVIGATION LINK
    ========================================================

       As the visitor scrolls through the website,
       the navigation link for the current section becomes
       active.
    ======================================================== */

  function updateActiveNavigation() {
    const currentScrollPosition = window.scrollY;

    let currentSectionId = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 150;

      const sectionHeight = section.offsetHeight;

      const sectionBottom = sectionTop + sectionHeight;

      if (
        currentScrollPosition >= sectionTop &&
        currentScrollPosition < sectionBottom
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navigationLinks.forEach(function (link) {
      link.classList.remove("active");

      const linkTarget = link.getAttribute("href");

      if (linkTarget === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });
  }

  /* ========================================================
       6. SCROLL-TO-TOP BUTTON
    ========================================================

       The button appears after the visitor scrolls down.
       Clicking it returns the visitor to the top.
    ======================================================== */

  function updateScrollTopButton() {
    if (!scrollTopButton) {
      return;
    }

    if (window.scrollY > 500) {
      scrollTopButton.classList.add("visible");
    } else {
      scrollTopButton.classList.remove("visible");
    }
  }

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* ========================================================
       7. REVEAL ELEMENTS WHEN THEY ENTER THE SCREEN
    ========================================================

       Elements start hidden and receive the "visible" class
       when they become visible on the screen.

       Your CSS controls the animation itself (see the
       .reveal / .reveal.visible rules in style.css).
    ======================================================== */

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach(function (element) {
      const elementTop = element.getBoundingClientRect().top;

      const revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("visible");
      }
    });
  }

  /* ========================================================
       8. ANIMATE SKILL PROGRESS BARS
    ========================================================

       In index.html, each bar's target width is already set
       with an inline CSS variable:

       <span class="skill-progress-bar" style="--skill-level: 90%"></span>

       and style.css keeps the bar collapsed (scaleX(0)) until
       its parent ".skill-card" gets the "visible" class, at
       which point it animates open to --skill-level.

       So the only thing JavaScript needs to do is add
       "visible" to each .skill-card once it scrolls into view.
    ======================================================== */

  function animateSkillBars() {
    if (skillCards.length === 0) {
      return;
    }

    const windowHeight = window.innerHeight;

    skillCards.forEach(function (card) {
      if (card.classList.contains("visible")) {
        return;
      }

      const cardTop = card.getBoundingClientRect().top;

      if (cardTop < windowHeight - 80) {
        card.classList.add("visible");
      }
    });
  }

  /* ========================================================
       9. PROJECT CARD INTERACTION
    ========================================================

       Adds a hover-state class to project cards (useful as a
       hook for extra effects beyond the plain :hover CSS).

       If a project card contains a link or button,
       normal browser behavior is preserved.
    ======================================================== */

  projectCards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.classList.add("project-hover");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("project-hover");
    });
  });

  /* ========================================================
       10. PROJECT FILTERS
    ========================================================

       Clicking a filter button (All / Web / Apps / Design)
       shows only the matching project cards.
    ======================================================== */

  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach(function (card) {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || filterValue === category) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* ========================================================
       11. PROJECT MODAL (VIEW DETAILS POPUP)
    ========================================================

       Clicking a project's "view" button or "View Case Study"
       link opens a modal with more details about that project.

       Project details are defined below in projectData; add
       an entry there for any new project you create.
    ======================================================== */

  const projectData = {
    "project-one": {
      number: "01",
      title: "Personal Portfolio Website",
      description:
        "A fully responsive personal portfolio built from scratch with HTML, CSS, and JavaScript — featuring a working contact form, dark/light themes, and interactive project showcases.",
      category: "Web Development",
      technology: "HTML, CSS, JavaScript",
      focus: "User Experience",
    },
    "project-two": {
      number: "02",
      title: "JARVIS Voice Assistant",
      description:
        "A JARVIS-style AI voice assistant built in Python, featuring wake-word detection, speech-to-text, text-to-speech, and real-time AI conversation.",
      category: "Python / AI",
      technology: "Python, OpenAI API, Speech Recognition",
      focus: "Voice Interaction",
    },
    "project-three": {
      number: "03",
      title: "Alnoor Enterprises Website",
      description:
        "An in-progress business website for Alnoor Enterprises, a wholesale/distribution company — designed to showcase products, build trust, and share contact information.",
      category: "Web Development",
      technology: "HTML, CSS",
      focus: "Business & Trust",
    },
  };
  const projectModal = document.querySelector("#projectModal");
  const modalCloseButton = document.querySelector("#modalCloseButton");
  const modalProjectNumber = document.querySelector("#modalProjectNumber");
  const modalProjectTitle = document.querySelector("#modalProjectTitle");
  const modalProjectDescription = document.querySelector(
    "#modalProjectDescription",
  );
  const modalProjectCategory = document.querySelector("#modalProjectCategory");
  const modalProjectTechnology = document.querySelector(
    "#modalProjectTechnology",
  );
  const modalProjectFocus = document.querySelector("#modalProjectFocus");

  const projectOpenTriggers = document.querySelectorAll("[data-project-open]");

  function openProjectModal(projectKey) {
    const data = projectData[projectKey];

    if (!projectModal || !data) {
      return;
    }

    if (modalProjectNumber) modalProjectNumber.textContent = data.number;
    if (modalProjectTitle) modalProjectTitle.textContent = data.title;
    if (modalProjectDescription)
      modalProjectDescription.textContent = data.description;
    if (modalProjectCategory) modalProjectCategory.textContent = data.category;
    if (modalProjectTechnology)
      modalProjectTechnology.textContent = data.technology;
    if (modalProjectFocus) modalProjectFocus.textContent = data.focus;

    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeProjectModal() {
    if (!projectModal) {
      return;
    }

    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  projectOpenTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const projectKey = trigger.getAttribute("data-project-open");
      openProjectModal(projectKey);
    });
  });

  if (modalCloseButton) {
    modalCloseButton.addEventListener("click", closeProjectModal);
  }

  const modalBackdrop = document.querySelector(
    "#projectModal [data-modal-close]",
  );

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeProjectModal);
  }

  /* ========================================================
       12. COPY CONTACT INFO TO CLIPBOARD
    ========================================================

       Clicking the email or phone button in the contact
       section copies that value and shows a brief
       notification.
    ======================================================== */

  const copyButtons = document.querySelectorAll(".copy-contact-button");
  const copyNotification = document.querySelector("#copyNotification");
  const copyNotificationText = document.querySelector("#copyNotificationText");

  let copyNotificationTimeout = null;

  function showCopyNotification(message) {
    if (!copyNotification) {
      return;
    }

    if (copyNotificationText) {
      copyNotificationText.textContent = message;
    }

    copyNotification.classList.add("show");

    if (copyNotificationTimeout) {
      clearTimeout(copyNotificationTimeout);
    }

    copyNotificationTimeout = setTimeout(function () {
      copyNotification.classList.remove("show");
    }, 2500);
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const valueToCopy = button.getAttribute("data-copy");

      if (!valueToCopy) {
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(valueToCopy)
          .then(function () {
            showCopyNotification("Copied to clipboard.");
          })
          .catch(function () {
            showCopyNotification("Could not copy automatically.");
          });
      } else {
        showCopyNotification("Copy not supported in this browser.");
      }
    });
  });

  /* ========================================================
       13. CONTACT FORM VALIDATION
    ========================================================

       Basic front-end validation for the contact form.
       Since the form has no backend (action="#"), this only
       checks the fields and shows a success message; hook up
       a real submission endpoint when you have one.
    ======================================================== */

  const contactForm = document.querySelector("#contactForm");

  if (contactForm) {
    const nameField = document.querySelector("#name");
    const emailField = document.querySelector("#email");
    const subjectField = document.querySelector("#subject");
    const messageField = document.querySelector("#message");

    const nameError = document.querySelector("#nameError");
    const emailError = document.querySelector("#emailError");
    const subjectError = document.querySelector("#subjectError");
    const messageError = document.querySelector("#messageError");

    const formSuccess = document.querySelector("#formSuccess");

    function setFieldError(field, errorElement, message) {
      if (field) {
        field.closest(".form-group").classList.toggle("error", !!message);
      }

      if (errorElement) {
        errorElement.textContent = message || "";
      }
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      let isValid = true;

      if (nameField && nameField.value.trim() === "") {
        setFieldError(nameField, nameError, "Please enter your name.");
        isValid = false;
      } else {
        setFieldError(nameField, nameError, "");
      }

      if (emailField && !isValidEmail(emailField.value.trim())) {
        setFieldError(
          emailField,
          emailError,
          "Please enter a valid email address.",
        );
        isValid = false;
      } else {
        setFieldError(emailField, emailError, "");
      }

      if (subjectField && subjectField.value.trim() === "") {
        setFieldError(subjectField, subjectError, "Please add a subject.");
        isValid = false;
      } else {
        setFieldError(subjectField, subjectError, "");
      }

      if (messageField && messageField.value.trim() === "") {
        setFieldError(messageField, messageError, "Please add a message.");
        isValid = false;
      } else {
        setFieldError(messageField, messageError, "");
      }

      if (!isValid) {
        if (formSuccess) {
          formSuccess.classList.remove("show");
        }
        return;
      }

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            if (formSuccess) {
              formSuccess.textContent = "Your message has been sent!";
              formSuccess.classList.add("show");
            }
            contactForm.reset();
          } else {
            if (formSuccess) {
              formSuccess.textContent =
                "Something went wrong. Please try again.";
              formSuccess.classList.add("show");
            }
          }
        })
        .catch(function () {
          if (formSuccess) {
            formSuccess.textContent =
              "Something went wrong. Please check your connection.";
            formSuccess.classList.add("show");
          }
        });
    });
  }

  /* ========================================================
       14. SET CURRENT YEAR
    ========================================================

       index.html contains:

       <span id="currentYear">2026</span>

       JavaScript automatically replaces it with the real
       current year.
    ======================================================== */

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ========================================================
       15. HEADER EFFECT WHEN SCROLLING
    ========================================================

       Adds a "scrolled" class to the header after the user
       moves down the page.

       The CSS uses this class to create a stronger
       background, shadow, or blur effect.
    ======================================================== */

  const header = document.querySelector("#siteHeader");

  function updateHeader() {
    if (!header) {
      return;
    }

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  /* ========================================================
       16. COMBINE SCROLL FUNCTIONS
    ========================================================

       Instead of creating several independent scroll
       listeners, we run the functions together.
    ======================================================== */

  function handleScroll() {
    updateActiveNavigation();

    updateScrollTopButton();

    revealOnScroll();

    animateSkillBars();

    updateHeader();
  }

  /* ========================================================
       17. RUN SCROLL LOGIC WHEN USER SCROLLS
    ======================================================== */

  window.addEventListener("scroll", handleScroll);

  /* ========================================================
       18. RUN ON PAGE LOAD
    ========================================================

       This makes sure the correct state appears immediately
       if the visitor loads the page somewhere other than
       the very top, and hides the page loader once ready.
    ======================================================== */

  handleScroll();

  const pageLoader = document.querySelector("#pageLoader");

  if (pageLoader) {
    window.addEventListener("load", function () {
      pageLoader.classList.add("loaded");
    });
  }

  /* ========================================================
       19. HANDLE RESIZING THE WINDOW
    ========================================================

       When the browser changes size, close the mobile menu
       if the screen becomes large enough.
    ======================================================== */

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900 && navigation && menuToggle) {
      navigation.classList.remove("open");
      navigation.setAttribute("aria-hidden", "true");

      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");

      document.body.classList.remove("menu-open");
    }
  });

  /* ========================================================
       20. ESCAPE KEY SUPPORT
    ========================================================

       Pressing Escape closes the mobile navigation menu and
       the project modal.
    ======================================================== */

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }

    if (navigation) {
      navigation.classList.remove("open");
      navigation.setAttribute("aria-hidden", "true");
    }

    if (menuToggle) {
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");

    closeProjectModal();
  });

  /* ========================================================
       21. PREVENT EMPTY HASH NAVIGATION
    ========================================================

       If an element has href="#", prevent the browser from
       jumping unexpectedly (social/platform placeholder links
       currently use "#").
    ======================================================== */

  const emptyHashLinks = document.querySelectorAll('a[href="#"]');

  emptyHashLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });

  /* ========================================================
       22. REDUCE MOTION SUPPORT
    ========================================================

       Visitors who have enabled "Reduce Motion" in their
       operating system should receive a less animated
       experience. style.css already has a
       prefers-reduced-motion media query; this class is an
       extra hook if you want to target it directly too.
    ======================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduce-motion");
  }

  /* ========================================================
       23. THEME TOGGLE (DARK / LIGHT)
    ========================================================

       style.css defines a full light-theme variant under
       "body.light-theme". This toggles that class and
       remembers the choice for next time.
    ======================================================== */

  const themeToggle = document.querySelector("#themeToggle");
  const themeIcon = document.querySelector(".theme-icon");

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      if (themeIcon) themeIcon.textContent = "☀";
    } else {
      document.body.classList.remove("light-theme");
      if (themeIcon) themeIcon.textContent = "☾";
    }
  }

  const savedTheme = window.localStorage
    ? window.localStorage.getItem("portfolio-theme")
    : null;

  if (savedTheme) {
    applyTheme(savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isLight = document.body.classList.contains("light-theme");
      const newTheme = isLight ? "dark" : "light";

      applyTheme(newTheme);

      if (window.localStorage) {
        window.localStorage.setItem("portfolio-theme", newTheme);
      }
    });
  }

  /* ========================================================
       24. PAGE LOADED MESSAGE
    ========================================================

       This confirms in the browser console that the
       portfolio JavaScript loaded correctly.
    ======================================================== */

  console.log("Portfolio website JavaScript loaded successfully.");
});
