/* ==========================================================================
   GSAP, SCROLLTRIGGER & INTERACTIVE MOTION ENGINE
   Owner: Keithlyn Joy Mendoza
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Split Hero Name into individual letter spans for cinematic entrance
  const heroName = document.getElementById('heroName');
  if (heroName) {
    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split('').forEach((char) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char === ' ' ? ' ' : char;
          frag.appendChild(span);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(processNode);
      }
    };
    Array.from(heroName.childNodes).forEach(processNode);
  }

  // 2. Cinematic Black-Screen Preloader + Entrance Sequence
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const preloaderName = document.getElementById('preloaderName');

  const masterTl = gsap.timeline({
    onComplete: () => {
      if (preloader) preloader.style.display = 'none';
      startFloatingPortrait();
    }
  });

  masterTl
    .fromTo(preloaderName, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .to(preloaderBar, { width: '100%', duration: 0.95, ease: 'power2.inOut' }, '-=0.2')
    .to(preloader, { opacity: 0, duration: 0.65, ease: 'power2.inOut' })
    .from('.hero-name .char', {
      opacity: 0,
      y: 36,
      rotateX: -45,
      stagger: 0.025,
      duration: 0.75,
      ease: 'power3.out'
    }, '-=0.25')
    .from('#portraitStage', {
      opacity: 0,
      scale: 0.92,
      y: 28,
      duration: 0.95,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.reveal-hero', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power2.out'
    }, '-=0.65');

  // 3. Continuous Subtle Floating Profile Animation
  function startFloatingPortrait() {
    gsap.to('#portraitStage', {
      y: -10,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  // 4. Typing Effect for Roles
  const typingTarget = document.getElementById('typingText');
  const phrases = [
    'BSIT Student',
    'Aspiring Web Developer',
    'Future Software Developer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function runTypingEffect() {
    if (!typingTarget) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typingTarget.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      typingTarget.textContent = currentPhrase.substring(0, charIndex);
    }

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1700;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(runTypingEffect, delay);
  }
  runTypingEffect();

  // 5. Scroll-Triggered Reveals
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 34,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true
      }
    });
  });

  // 6. Smooth Parallax Background Orbs
  gsap.utils.toArray('.ambient-orb').forEach((orb) => {
    const speed = parseFloat(orb.dataset.speed || '0.15');
    gsap.to(orb, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  });

  // 7. Subtle Cursor-Following Glow
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.45,
        ease: 'power2.out'
      });
    });
  }

  // 8. 3D Hover Tilt Effect on Project Cards
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 900,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    });
  });

  // 9. Project Case Study Modal
  const projectCaseStudies = {
    portfolio: {
      category: '01 // WEB DESIGN & DEVELOPMENT',
      title: 'Personal & Peer Portfolio Websites',
      desc: 'Built responsive, custom-styled web portfolios from scratch in Visual Studio Code. Focused on visual hierarchy, clean CSS architecture, and responsive layouts across desktop and mobile screens.',
      highlights: ['Semantic HTML5', 'External CSS3', 'Responsive Grids', 'Interactive UI']
    },
    roboflow: {
      category: '02 // COMPUTER VISION MODELING',
      title: 'Roboflow Dog & Cat Image Classifier',
      desc: 'Organized and labeled a custom image dataset using a 70-20-10 train/validation/test split in Roboflow, generated dataset versions, and verified prediction confidence across test samples.',
      highlights: ['Roboflow Pipeline', '70-20-10 Split', 'Dataset Versioning', 'Model Testing']
    },
    algorithms: {
      category: '03 // ALGORITHMIC PROGRAMMING',
      title: 'C, C++ & C# Programming Labs',
      desc: 'Completed structured university coding exercises covering conditional logic, loops, functions, IPO charts, and pseudocode flowcharts for clean problem-solving.',
      highlights: ['C++ & C', 'C# Fundamentals', 'IPO & Flowcharts', 'Debugging']
    }
  };

  const modal = document.getElementById('projectModal');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  document.querySelectorAll('.project-link-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const data = projectCaseStudies[btn.dataset.project];
      if (!data) return;
      modalCategory.textContent = data.category;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalHighlights.innerHTML = '';
      data.highlights.forEach((item) => {
        const tag = document.createElement('span');
        tag.textContent = item;
        modalHighlights.appendChild(tag);
      });
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  modalCloseBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });

  // 10. Copy Email & Contact Form Mailto Launch
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  copyEmailBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('kjmendoza0120@gmail.com');
      copyEmailBtn.textContent = 'Copied';
      setTimeout(() => { copyEmailBtn.textContent = 'Copy'; }, 2000);
    } catch {
      copyEmailBtn.textContent = 'Ready';
    }
  });

  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const msg = document.getElementById('senderMessage').value.trim();
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}
Email: ${email}

${msg}`);
    formFeedback.textContent = 'Opening your email client to send message...';
    window.location.href = `mailto:kjmendoza0120@gmail.com?subject=${subject}&body=${body}`;
  });

  // 11. Active Nav Link Spy & Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  mobileToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 150) {
        current = sec.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
});
