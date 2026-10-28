document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const navbar = document.getElementById('navbar');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenuWrapper = document.getElementById('navMenuWrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Theme Toggle Elements
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  // Hero Elements
  const heroBio = document.querySelector('.hero-bio');
  const heroCursive = document.querySelector('.hero-cursive');
  const heroImgSrc = document.getElementById('heroImgSrc');
  
  // About Elements
  const aboutBioText = document.getElementById('aboutBioText');
  const languageText = document.getElementById('languageText');
  const aboutEmail = document.getElementById('aboutEmail');
  const aboutInstagram = document.getElementById('aboutInstagram');
  
  // Timelines Elements
  const educationTimeline = document.getElementById('educationTimeline');
  const trainingTimeline = document.getElementById('trainingTimeline');
  const experienceTimeline = document.getElementById('experienceTimeline');
  const organizationTimeline = document.getElementById('organizationTimeline');
  
  // Skills Elements
  const hardSkillsList = document.getElementById('hardSkillsList');
  const softwareToolsList = document.getElementById('softwareToolsList');
  const softSkillsList = document.getElementById('softSkillsList');
  
  // Certifications Element
  const certificationsGrid = document.getElementById('certificationsGrid');
  
  // Projects Elements
  const projectsGrid = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Contact Elements
  const contactEmailVal = document.getElementById('contactEmailVal');
  const contactPhoneVal = document.getElementById('contactPhoneVal');
  const contactForm = document.getElementById('contactForm');
  
  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDate = document.getElementById('lightboxDate');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxToolsList = document.getElementById('lightboxToolsList');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxImageContainer = document.getElementById('lightboxImageContainer');

  // Lightbox Gallery State
  let currentGallery = [];
  let currentSlideIndex = 0;
  let currentProjectDesc = '';
  
  // Database store
  let projectsData = [];

  // --- Theme Toggle Logic ---
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-theme');
    themeIcon.className = 'fa-regular fa-moon';
  } else {
    document.body.classList.remove('dark-theme');
    themeIcon.className = 'fa-regular fa-sun';
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.className = isDark ? 'fa-regular fa-moon' : 'fa-regular fa-sun';
  });

  // --- High Performance Scroll Handler (rAF Throttling + Passive Listener) ---
  let isScrollTicking = false;
  function handleScroll() {
    const scrollY = window.scrollY;

    // Sticky Navbar toggle
    if (scrollY > 50) {
      if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
    } else {
      if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
    }

    // Active Section Scroll Spy
    let currentSection = 'hero';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 190;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    isScrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(handleScroll);
      isScrollTicking = true;
    }
  }, { passive: true });

  window.addEventListener('hashchange', handleScroll);

  // --- Mobile Menu Toggle ---
  mobileNavToggle.addEventListener('click', () => {
    mobileNavToggle.classList.toggle('open');
    navMenuWrapper.classList.toggle('active');
  });

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.classList.remove('open');
      navMenuWrapper.classList.remove('active');
    });
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !navMenuWrapper.contains(e.target)) {
      mobileNavToggle.classList.remove('open');
      navMenuWrapper.classList.remove('active');
    }
  });

  // --- Load Portfolio Data (Direct from Local Variable to Bypass CORS) ---
  function loadPortfolioData() {
    try {
      if (typeof portfolioData !== 'undefined') {
        populatePortfolio(portfolioData);
      } else {
        throw new Error("Data portofolio (portfolioData) tidak ditemukan. Periksa pemuatan file portfolio-data.js.");
      }
    } catch (error) {
      console.error('Gagal memuat data portfolio:', error);
      if (aboutBioText) {
        aboutBioText.innerText = "Error loading data: " + error.message;
      }
    }
  }

  // --- Populate Portfolio Site ---
  function populatePortfolio(data) {
    const { profile, education, experience, organization, training, skills, certifications, projects } = data;
    projectsData = projects;

    // 1. Profile / Hero Section
    heroBio.textContent = profile.bio;
    if (heroCursive) {
      heroCursive.textContent = profile.title;
    }
    if (heroImgSrc) {
      heroImgSrc.src = profile.profile_image;
    }

    // 2. About Me Section
    if (aboutBioText) aboutBioText.textContent = profile.about_bio;
    if (languageText) languageText.textContent = profile.languages || '';
    if (aboutEmail) aboutEmail.textContent = profile.contact.email;
    if (aboutInstagram) aboutInstagram.textContent = profile.contact.instagram;

    // Experience Timeline (Work & Organization Experience from CV)
    if (experienceTimeline) {
      experienceTimeline.innerHTML = '';
      experience.forEach(exp => {
        const expItem = document.createElement('div');
        expItem.className = 'timeline-item';
        expItem.innerHTML = `
          <span class="timeline-period">${exp.period}</span>
          <h4 class="timeline-title">${exp.role}</h4>
          <h5 class="timeline-subtitle">${exp.title} ${exp.location ? `• ${exp.location}` : ''}</h5>
          <p class="timeline-desc">${exp.description || ''}</p>
        `;
        experienceTimeline.appendChild(expItem);
      });
    }

    // Education Timeline
    if (educationTimeline) {
      educationTimeline.innerHTML = '';
      education.forEach(edu => {
        const eduItem = document.createElement('div');
        eduItem.className = 'timeline-item';
        eduItem.innerHTML = `
          <span class="timeline-period">${edu.period}</span>
          <h4 class="timeline-title">${edu.major}</h4>
          <h5 class="timeline-subtitle">${edu.school} ${edu.location ? `• ${edu.location}` : ''}</h5>
          <p class="timeline-desc">${edu.description || ''}</p>
        `;
        educationTimeline.appendChild(eduItem);
      });
    }

    // Training & Certifications Timeline
    if (trainingTimeline) {
      trainingTimeline.innerHTML = '';
      training.forEach(train => {
        const trainItem = document.createElement('div');
        trainItem.className = 'timeline-item';
        trainItem.innerHTML = `
          <span class="timeline-period">${train.period}</span>
          <h4 class="timeline-title">${train.title}</h4>
          <h5 class="timeline-subtitle">${train.program}</h5>
          <p class="timeline-desc">${train.description || ''}</p>
        `;
        trainingTimeline.appendChild(trainItem);
      });
    }

    // Optional legacy timeline containers if present
    if (organizationTimeline && data.organization) {
      organizationTimeline.innerHTML = '';
      data.organization.forEach(org => {
        const orgItem = document.createElement('div');
        orgItem.className = 'timeline-item';
        orgItem.innerHTML = `
          <span class="timeline-period">${org.period}</span>
          <h4 class="timeline-title">${org.role}</h4>
          <h5 class="timeline-subtitle">${org.name}</h5>
          <p class="timeline-desc">${org.description || ''}</p>
        `;
        organizationTimeline.appendChild(orgItem);
      });
    }

    // 3. Skills Section
    // Hard Skills
    hardSkillsList.innerHTML = '';
    skills.hard_skills.forEach(skill => {
      const percentage = skill.level * 20;
      const skillItem = document.createElement('div');
      skillItem.className = 'skill-item';
      skillItem.innerHTML = `
        <div class="skill-info">
          <span>${skill.name}</span>
        </div>
        <div class="skill-bar-wrapper">
          <div class="skill-bar" data-width="${percentage}%"></div>
        </div>
      `;
      hardSkillsList.appendChild(skillItem);
    });

    // Software & Tools (with star rating)
    softwareToolsList.innerHTML = '';
    skills.software_tools.forEach(tool => {
      const toolItem = document.createElement('div');
      toolItem.className = 'skill-item';
      
      let starsHTML = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= tool.level) {
          starsHTML += '<i class="fa-solid fa-star star-icon filled"></i>';
        } else {
          starsHTML += '<i class="fa-regular fa-star star-icon"></i>';
        }
      }
      
      toolItem.innerHTML = `
        <div class="skill-info">
          <span>${tool.name}</span>
          <div class="stars-container">${starsHTML}</div>
        </div>
      `;
      softwareToolsList.appendChild(toolItem);
    });

    // Soft Skills Tags
    softSkillsList.innerHTML = '';
    skills.soft_skills.forEach(softSkill => {
      const tag = document.createElement('span');
      tag.className = 'soft-skill-tag';
      tag.textContent = softSkill;
      softSkillsList.appendChild(tag);
    });

    // Animate skill bars
    animateSkillBars();

    // 4. Certifications Section with Pictures
    certificationsGrid.innerHTML = '';
    certifications.forEach(cert => {
      const certCard = document.createElement('article');
      certCard.className = 'cert-card glass-card scroll-reveal';
      
      certCard.innerHTML = `
        <div class="cert-image-box">
          <img src="${cert.image}" alt="${cert.title}" class="cert-thumbnail" loading="lazy">
          <div class="cert-overlay">
            <div class="cert-view-icon"><i class="fa-solid fa-expand"></i></div>
          </div>
        </div>
        <div class="cert-info-box">
          <span class="cert-year">${cert.year}</span>
          <h3 class="cert-title">${cert.title}</h3>
          <h4 class="cert-issuer">${cert.issuer}</h4>
          <p class="cert-desc">${cert.description}</p>
          <a class="cert-read-more">View Credential <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
      `;
      
      certCard.addEventListener('click', () => openCertLightbox(cert));
      certificationsGrid.appendChild(certCard);
    });

    // 5. Projects Section
    renderProjects(projects);

    // 6. Contact Section Info Settings
    if (contactEmailVal) {
      contactEmailVal.textContent = profile.contact.email;
    }
    if (contactPhoneVal) {
      contactPhoneVal.textContent = profile.contact.phone;
    }

    // Capture contact form submit to trigger email client redirection
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;
        
        const mailtoUrl = `mailto:${profile.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`
        )}`;
        
        window.location.href = mailtoUrl;
      });
    }

    // 7. Init Scroll Reveal observers & Spy
    initScrollReveal();
    setTimeout(handleScroll, 100);
  }

  // --- Render Projects Grid ---
  function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
      projectsGrid.innerHTML = `<p class="text-center" style="grid-column: 1/-1;">No projects found in this category.</p>`;
      return;
    }

    projects.forEach(project => {
      const card = document.createElement('article');
      card.className = 'project-card glass-card';
      card.dataset.id = project.id;
      
      const toolsHTML = project.tools.map(tool => `<span class="project-tool-tag">${tool}</span>`).join('');
      const galleryBadgeHTML = (project.gallery && project.gallery.length > 1)
        ? `<span class="project-gallery-badge"><i class="fa-solid fa-layer-group"></i> ${project.gallery.length} Slides</span>`
        : '';
      
      const categories = Array.isArray(project.category) ? project.category : [project.category];
      const categoriesHTML = categories.map(cat => `<span class="project-category">${cat}</span>`).join(' ');

      card.innerHTML = `
        <div class="project-image-box">
          <img src="${project.image}" alt="${project.title}" class="project-thumbnail" loading="lazy">
          ${galleryBadgeHTML}
          <div class="project-overlay">
            <div class="project-view-icon"><i class="fa-solid fa-expand"></i></div>
          </div>
        </div>
        <div class="project-info-box">
          <div class="project-meta">
            <div class="project-categories-wrap">${categoriesHTML}</div>
            <span class="project-period">${project.period}</span>
          </div>
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-desc-excerpt">${project.description}</p>
          <div class="project-tools-list">${toolsHTML}</div>
          <a class="project-read-more">View Details <i class="fa-solid fa-arrow-right-long"></i></a>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(project.id));
      projectsGrid.appendChild(card);
    });
  }

  // --- Project Category Filter ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      if (filterValue === 'all') {
        renderProjects(projectsData);
      } else {
        const filteredProjects = projectsData.filter(p => {
          if (Array.isArray(p.category)) {
            return p.category.includes(filterValue);
          }
          return p.category === filterValue;
        });
        renderProjects(filteredProjects);
      }
    });
  });

  // --- Lightbox Slide Navigation ---
  function updateLightboxSlide(index, direction = 'next') {
    if (!currentGallery || currentGallery.length === 0) return;

    currentSlideIndex = (index + currentGallery.length) % currentGallery.length;

    const currentItem = currentGallery[currentSlideIndex];
    const imgSrc = typeof currentItem === 'string' ? currentItem : currentItem.src;
    const slideTitle = typeof currentItem === 'object' ? currentItem.title : '';
    const slideDesc = typeof currentItem === 'object' ? currentItem.caption : '';

    // Apply tactile horizontal slide animation
    lightboxImg.classList.remove('slide-in-right', 'slide-in-left');
    void lightboxImg.offsetWidth; // Force reflow to retrigger animation
    lightboxImg.classList.add(direction === 'prev' ? 'slide-in-left' : 'slide-in-right');

    lightboxImg.src = imgSrc;

    // Preload adjacent slides immediately for instant next/prev response
    if (currentGallery.length > 1) {
      const nextIdx = (currentSlideIndex + 1) % currentGallery.length;
      const prevIdx = (currentSlideIndex - 1 + currentGallery.length) % currentGallery.length;
      [nextIdx, prevIdx].forEach(idx => {
        const item = currentGallery[idx];
        const url = typeof item === 'string' ? item : item.src;
        if (url) {
          const pre = new Image();
          pre.src = url;
        }
      });
    }

    // Update slide specific subtitle badge in details
    const lightboxSlideSubtitle = document.getElementById('lightboxSlideSubtitle');
    if (lightboxSlideSubtitle) {
      if (slideTitle && currentGallery.length > 1) {
        lightboxSlideSubtitle.style.display = 'block';
        lightboxSlideSubtitle.innerHTML = `<span class="slide-badge"><i class="fa-solid fa-layer-group"></i> Slide ${currentSlideIndex + 1}: ${slideTitle}</span>`;
      } else {
        lightboxSlideSubtitle.style.display = 'none';
        lightboxSlideSubtitle.innerHTML = '';
      }
    }

    // Update description with slide specific caption
    if (slideDesc && currentGallery.length > 1) {
      lightboxDesc.innerHTML = `<span class="slide-highlight-caption">${slideDesc}</span><span class="slide-global-desc">${currentProjectDesc}</span>`;
    } else {
      lightboxDesc.textContent = currentProjectDesc;
    }

    // Update Counter & Dots
    const bottomBar = document.getElementById('lightboxBottomBar');
    if (currentGallery.length > 1) {
      if (lightboxPrev) lightboxPrev.classList.remove('hidden');
      if (lightboxNext) lightboxNext.classList.remove('hidden');
      if (bottomBar) bottomBar.classList.remove('hidden');
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentSlideIndex + 1} / ${currentGallery.length}`;
      }
      renderLightboxDots();
    } else {
      if (lightboxPrev) lightboxPrev.classList.add('hidden');
      if (lightboxNext) lightboxNext.classList.add('hidden');
      if (bottomBar) bottomBar.classList.add('hidden');
    }
  }

  function renderLightboxDots() {
    const dotsContainer = document.getElementById('lightboxDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    currentGallery.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `lightbox-dot ${idx === currentSlideIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const dir = idx >= currentSlideIndex ? 'next' : 'prev';
        updateLightboxSlide(idx, dir);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function nextSlide() {
    if (currentGallery && currentGallery.length > 1) {
      updateLightboxSlide(currentSlideIndex + 1, 'next');
    }
  }

  function prevSlide() {
    if (currentGallery && currentGallery.length > 1) {
      updateLightboxSlide(currentSlideIndex - 1, 'prev');
    }
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  // --- Lightbox Modal Handlers ---
  function openLightbox(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    currentGallery = (project.gallery && project.gallery.length > 0) ? project.gallery : [project.image];
    currentSlideIndex = 0;
    currentProjectDesc = project.description;

    // Eagerly preload all images in gallery so switching slides is instant
    currentGallery.forEach(item => {
      const url = typeof item === 'string' ? item : item.src;
      if (url) {
        const pre = new Image();
        pre.src = url;
      }
    });

    lightboxImg.alt = project.title;
    lightboxCategory.textContent = Array.isArray(project.category) ? project.category.join(' • ') : project.category;
    lightboxDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${project.period}`;
    lightboxTitle.textContent = project.title;
    lightboxToolsList.innerHTML = project.tools.map(tool => `<span class="project-tool-tag">${tool}</span>`).join('');

    updateLightboxSlide(0, 'next');

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Lightbox for Certifications
  function openCertLightbox(cert) {
    currentGallery = [cert.image];
    currentSlideIndex = 0;
    currentProjectDesc = cert.description;

    lightboxImg.alt = cert.title;
    lightboxCategory.textContent = "Certification Credential";
    lightboxDate.innerHTML = `<i class="fa-regular fa-calendar"></i> Year: ${cert.year}`;
    lightboxTitle.textContent = cert.title;
    lightboxToolsList.innerHTML = `<span class="project-tool-tag">${cert.issuer}</span>`;

    updateLightboxSlide(0, 'next');

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentGallery = [];
    currentSlideIndex = 0;
    setTimeout(() => {
      lightboxImg.src = '';
    }, 350);
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation: Escape, Left Arrow, Right Arrow
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // Touch Swipe & Tap for Mobile Gallery in Lightbox
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwiping = false;

  if (lightboxImageContainer) {
    lightboxImageContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isSwiping = false;
    }, { passive: true });

    lightboxImageContainer.addEventListener('touchmove', (e) => {
      const moveX = Math.abs(e.changedTouches[0].screenX - touchStartX);
      const moveY = Math.abs(e.changedTouches[0].screenY - touchStartY);
      if (moveX > 10 || moveY > 10) {
        isSwiping = true;
      }
    }, { passive: true });

    lightboxImageContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = touchEndY - touchStartY;
      
      // Horizontal swipe threshold: at least 35px, and predominantly horizontal
      if (Math.abs(swipeDistanceX) > 35 && Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) * 1.3) {
        if (swipeDistanceX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });

    // Tap on image left/right half to advance/rewind slides (like story navigation)
    lightboxImageContainer.addEventListener('click', (e) => {
      if (isSwiping) return;
      if (e.target.closest('.lightbox-nav-btn') || e.target.closest('.lightbox-bottom-bar')) {
        return;
      }
      if (!currentGallery || currentGallery.length <= 1) return;

      const rect = lightboxImageContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX > rect.width * 0.65) {
        nextSlide();
      } else if (clickX < rect.width * 0.35) {
        prevSlide();
      }
    });
  }

  // --- Skill Bar Animation ---
  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
      bars.forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
      });
      return;
    }

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.getAttribute('data-width');
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });

    bars.forEach(bar => {
      barObserver.observe(bar);
    });

    // Safety fallback
    setTimeout(() => {
      bars.forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
      });
    }, 1500);
  }

  // --- Intersection Observer for Scroll Reveal ---
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    // On mobile screens or if IntersectionObserver is not supported, reveal immediately
    if (window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('active'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '100px 0px 100px 0px'
    });

    reveals.forEach(el => {
      revealObserver.observe(el);
    });

    // Mobile & slow connection fallback: ensure everything is visible after 1.2s
    setTimeout(() => {
      reveals.forEach(el => el.classList.add('active'));
    }, 1200);
  }

  // --- Start App ---
  loadPortfolioData();
});
