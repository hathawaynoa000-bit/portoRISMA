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

  // --- Active Nav on Scroll & Load (Scroll Spy) ---
  function updateActiveNav() {
    let currentSection = 'hero'; // Default to hero/Home
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 190;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Sticky Navbar class toggle
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('scroll', () => {
    // Sync active nav item on scroll spy
    updateActiveNav();
  });
  window.addEventListener('hashchange', updateActiveNav);

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

  // --- Hero 3D Interactive Parallax & Tilt Animation ---
  const heroImageContainer = document.querySelector('.hero-photo-container') || document.querySelector('.hero-blob-container-new');
  const heroProfileImg = document.querySelector('.hero-profile-img') || document.querySelector('.hero-blob-card');
  
  if (heroImageContainer && heroProfileImg) {
    heroImageContainer.addEventListener('mousemove', (e) => {
      const rect = heroImageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Gentle tilt rotation of 8 degrees
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      heroProfileImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });
    
    heroImageContainer.addEventListener('mouseleave', () => {
      heroProfileImg.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

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
      heroCursive.textContent = profile.title + " ✨";
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
          <span>${percentage}%</span>
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
    setTimeout(updateActiveNav, 100);
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
      
      card.innerHTML = `
        <div class="project-image-box">
          <img src="${project.image}" alt="${project.title}" class="project-thumbnail" loading="lazy">
          <div class="project-overlay">
            <div class="project-view-icon"><i class="fa-solid fa-expand"></i></div>
          </div>
        </div>
        <div class="project-info-box">
          <div class="project-meta">
            <span class="project-category">${project.category}</span>
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
        const filteredProjects = projectsData.filter(p => p.category === filterValue);
        renderProjects(filteredProjects);
      }
    });
  });

  // --- Lightbox Modal Handlers ---
  function openLightbox(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    lightboxImg.src = project.image;
    lightboxImg.alt = project.title;
    lightboxCategory.textContent = project.category;
    lightboxDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${project.period}`;
    lightboxTitle.textContent = project.title;
    lightboxDesc.textContent = project.description;
    lightboxToolsList.innerHTML = project.tools.map(tool => `<span class="project-tool-tag">${tool}</span>`).join('');

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Lightbox for Certifications
  function openCertLightbox(cert) {
    lightboxImg.src = cert.image;
    lightboxImg.alt = cert.title;
    lightboxCategory.textContent = "Certification Credential";
    lightboxDate.innerHTML = `<i class="fa-regular fa-calendar"></i> Year: ${cert.year}`;
    lightboxTitle.textContent = cert.title;
    lightboxDesc.textContent = cert.description;
    lightboxToolsList.innerHTML = `<span class="project-tool-tag">${cert.issuer}</span>`;

    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 400);
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });

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
