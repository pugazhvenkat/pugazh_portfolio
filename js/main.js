/**
 * PUGAZHENDHI V - PORTFOLIO INTERACTIVITY SCRIPT
 * High Performance, Zero Dependencies (Vanilla JS + Bootstrap 5)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleCanvas();
  initTypingEffect();
  initStatsCounter();
  initProjectFilters();
  initProjectModals();
  initContactForm();
  initScrollBehaviors();
  initSkillBars();
});

/* --------------------------------------------------------------------------
   THEME TOGGLE (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const toggleBtnMobile = document.getElementById('themeToggleBtnMobile');

  const currentTheme = localStorage.getItem('pv_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  function handleToggle() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pv_theme', newTheme);
    updateThemeIcons(newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
  }

  if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener('click', handleToggle);
}

function updateThemeIcons(theme) {
  const buttons = [document.getElementById('themeToggleBtn'), document.getElementById('themeToggleBtnMobile')];
  buttons.forEach(btn => {
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'light') {
      icon.className = 'bi bi-moon-stars-fill';
      btn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      icon.className = 'bi bi-sun-fill';
      btn.setAttribute('title', 'Switch to Light Mode');
    }
  });
}

/* --------------------------------------------------------------------------
   HERO INTERACTIVE PARTICLE CANVAS
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 65);
  const mouse = { x: null, y: null, maxDist: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.maxDist) {
          const force = (mouse.maxDist - distance) / mouse.maxDist;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.7)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 110) * 0.22;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   HERO TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typedText');
  if (!target) return;

  const phrases = [
    'Senior Full Stack Developer',
    'ASP.NET Core & Angular Specialist',
    'FinTech & Banking API Architect',
    'Microservices & RabbitMQ Engineer',
    'Enterprise Cloud & SQL Server Expert'
  ];

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let typeSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, letterIndex - 1);
      letterIndex--;
      typeSpeed = 40;
    } else {
      target.textContent = currentPhrase.substring(0, letterIndex + 1);
      letterIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && letterIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before new phrase
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 800);
}

/* --------------------------------------------------------------------------
   ANIMATED STATS COUNTER
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.counter-val');
  if (!statElements.length) return;

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        statElements.forEach((el) => {
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let count = 0;
          const duration = 1600;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              el.textContent = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
              clearInterval(timer);
            } else {
              el.textContent = (isDecimal ? count.toFixed(1) : Math.floor(count)) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('heroStats');
  if (statsSection) observer.observe(statsSection);
}

/* --------------------------------------------------------------------------
   SKILL BARS ON SCROLL
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  if (!skillFills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  skillFills.forEach((fill) => observer.observe(fill));
}

/* --------------------------------------------------------------------------
   PROJECT FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-grid-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   PROJECT DETAILED MODAL DATA & HANDLER
   -------------------------------------------------------------------------- */
const PROJECT_DATABASE = {
  'planning-beats': {
    title: 'Planning Beats - Multi-User Event Management System',
    client: 'Planning Beats (Europe)',
    role: 'Senior Software Engineer',
    company: 'Tender Software India Private Limited',
    period: 'Feb 2026 - Apr 2026',
    teamSize: '6 Engineers',
    technologies: ['.NET Core Web API', 'Angular', 'SQL Server', 'RabbitMQ', 'Visual Studio', 'GitHub', 'SSMS', 'JIRA', 'RBAC'],
    overview: 'A high-concurrency, web-based multi-user event registration and planning management platform engineered for European entertainment and corporate event coordination.',
    keyFeatures: [
      'Multi-Role Hierarchical Architecture: Distinct interfaces and permissions for Clients, DJ (Admin), Staff members, and Service Providers.',
      'Event Booking & Lifecycle Management: Real-time reservation workflow with date/venue collision detection and service package selection.',
      'Real-Time Asynchronous Task Assignment: Integrated RabbitMQ event broker for instant task distribution, notification fanout, and schedule adjustments.',
      'Fine-Grained Role-Based Access Control (RBAC): Strict security boundaries ensuring clients only see booking specs while DJs and staff manage execution.',
      'Staff Live Tracking & Service Allocation: Instant progress updates allowing DJs to monitor staff check-ins and stage milestones in real time.'
    ],
    architecture: 'Clean Architecture with ASP.NET Core Web API at the core, CQRS-style handlers for event commands, RabbitMQ message queues for async event dispatching, and Angular SPA frontend providing reactive dashboards.'
  },
  'remittance': {
    title: 'Transend Multi-User Remittance Tracking Engine',
    client: 'Transend PTE LTD (Singapore)',
    role: 'Software Engineer',
    company: 'DigitalTechz',
    period: 'Oct 2021 - Jan 2026',
    teamSize: '4 Engineers',
    technologies: ['.NET Core Web API', 'Microservices', 'Angular', 'SQL Server', 'RabbitMQ', 'Bankers Accuity AML', 'SSMS', 'JIRA'],
    overview: 'An institutional-grade, multi-tier remittance tracking platform built for international financial retailers, licensed remittance agents, and compliance officers under Monetary Authority of Singapore (MAS) regulatory standards.',
    keyFeatures: [
      'End-to-End Remittance Lifecycle: Sender onboarding, beneficiary validation, payment collection, FX rate locking, and payout execution.',
      'Automated AML/PEP Screening: Integrated Bankers Accuity screening engines to cross-reference global sanctions lists, PEP databases, and adverse media before transaction authorization.',
      'Regulatory CDD/ECDD Workflows: Automated Customer Due Diligence (CDD) and Enhanced Due Diligence (ECDD) flows for high-risk or threshold-exceeding transactions.',
      'MAS Compliance & Audit Reporting: Automated generation of statutory compliance filings, suspicious transaction reporting (STR) readiness, and daily financial reconciliation.',
      'Microservices Architecture: Decoupled transaction processing, screening worker services, and notification microservices interconnected via RabbitMQ.'
    ],
    architecture: 'Distributed Microservices Architecture utilizing ASP.NET Core Web API, RabbitMQ message bus for asynchronous screening jobs, SQL Server with resilient distributed transactions, and Angular for high-density agent dashboards.'
  },
  'money-changer': {
    title: 'MoneyChanger - Global FX & International Remittance Platform',
    client: 'In-House FinTech Product',
    role: 'Software Engineer',
    company: 'DigitalTechz',
    period: 'Oct 2021 - Jan 2026',
    teamSize: '5 Engineers',
    technologies: ['.NET Core Web API', 'Angular', 'MySQL', 'MyInfo Singapore API', 'Visual Studio', 'GitHub', 'Workbench', 'JIRA'],
    overview: 'A digital-first foreign exchange (FX) and currency trading web application simplifying cross-border financial transactions for private individuals and corporate enterprises at institutional rates.',
    keyFeatures: [
      'Singapore MyInfo Government ID Integration: One-click digital customer verification and instant onboarding adhering to KYC protocols without manual paper review.',
      'Real-Time Currency Exchange Engine: Live FX ticker updates, dynamic spread calculation, and locked-in quote execution.',
      'Integrated Anti-Money Laundering (AML) Module: Automated transactional velocity tracking and risk-scoring algorithms.',
      'Financial Reporting & Daily Settlement: Comprehensive management reports detailing currency turnover, gross margins, and regulatory liquidity reserves.'
    ],
    architecture: 'ASP.NET Core Web API backend paired with MySQL relational storage for optimized transaction ledgers, authenticated via OAuth2/JWT with secure RESTful communication to Angular Single Page Application.'
  },
  'dbs-virtual-account': {
    title: 'Transend HK - DBS Virtual Account (VA) Integration Portal',
    client: 'Transend PTE LTD (Hong Kong / DBS Bank)',
    role: 'Software Engineer',
    company: 'DigitalTechz',
    period: 'Oct 2021 - Jan 2026',
    teamSize: '2 Engineers',
    technologies: ['.NET Core Web API', 'Angular', 'SQL Server', 'DBS Bank API Integration', 'Visual Studio', 'SSMS', 'JIRA'],
    overview: 'A specialized enterprise payment gateway portal bridging corporate clients with DBS Bank Hong Kong Virtual Accounts to streamline automated collection, source tracking, and treasury routing.',
    keyFeatures: [
      'Dynamic Virtual Account Generation: Uniquely generates and binds custom virtual account numbers to individual corporate clients and invoices.',
      'Automated Master Account Sweeping: Real-time inbound payment notifications from DBS auto-route funds to the enterprise master account while preserving customer audit trails.',
      'Instant Source Reconciliation: Eliminates manual unallocated payments by matching 100% of receipts with client records in real time.',
      'Currency Booking & FX Hedging: Allows clients to lock FX rates for multi-currency settlement and generates real-time treasury ledger reports.'
    ],
    architecture: 'Secure Webhook and REST API pipeline between DBS Bank Hong Kong and .NET Core backend, processing incoming payment webhooks idempotently with SQL Server transaction snapshots and Angular management portal.'
  },
  'crm-erp': {
    title: 'Enterprise ERP & CRM Management Suite',
    client: 'Proprietary Enterprise Product',
    role: 'Software Developer',
    company: 'Abi Tech Software Solutions',
    period: 'Aug 2020 - Jan 2021',
    teamSize: '4 Engineers',
    technologies: ['ASP.NET MVC', 'Entity Framework', 'SQL Server', 'Visual Studio', 'GitHub', 'SSMS', 'JIRA'],
    overview: 'A full-scale Enterprise Resource Planning (ERP) and Customer Relationship Management system designed to digitize human resources, attendance recording, payroll processing, and executive reporting.',
    keyFeatures: [
      'Automated Attendance & Leave Tracking: Configurable shifts, biometric integration readiness, and dynamic leave balance accounting.',
      'Complex Payroll Calculation Engine: Automatically computes statutory deductions, tax allowances, overtime compensation, and generates downloadable pay slips.',
      'Executive BI & Management Insights: Configurable tabular and graphical reports offering real-time visibility into operational expenses and employee productivity.',
      'Role-Based Authorization & Auditing: Segregated permissions for HR personnel, department heads, and general employees with full change log histories.'
    ],
    architecture: 'MVC Architecture powered by ASP.NET MVC and Entity Framework ORM, backed by SQL Server normalized schemas with stored procedures for batch payroll computation.'
  },
  'warehouse-management': {
    title: 'Intelligent Warehouse Management & Sales Ordering System',
    client: 'International Enterprise Client (China)',
    role: 'Junior Software Developer',
    company: 'AAHA Software Solutions Pvt Ltd',
    period: 'Apr 2019 - Jun 2020',
    teamSize: '3 Engineers',
    technologies: ['ASP.NET MVC', 'Entity Framework', 'SQL Server', 'Visual Studio', 'GitHub', 'SSMS', 'i18n Multi-Language'],
    overview: 'A comprehensive web-based supply chain and inventory management platform tailored for high-volume warehouse operations across multi-tiered regional distribution centers.',
    keyFeatures: [
      'Real-Time Stock Inventory Tracking: Barcode-ready item logging, automatic stock level alerts, and safety stock threshold notifications.',
      'Multi-Level Product Hierarchies: Complex product taxonomy support (Categories, Subcategories, Variants, SKUs, and Batches).',
      'Sales Ordering & Dispatch Pipeline: Seamless sales order booking, picking list generation, invoice printing, and dispatch validation.',
      'Multi-Language Internationalization (i18n): Full bilingual support (English & Simplified Chinese) enabling multinational teams to collaborate without language barriers.'
    ],
    architecture: 'ASP.NET MVC with Entity Framework Code-First data access, localized resource files (.resx) for instant language switching, and SQL Server indexing for ultra-fast product catalog searching.'
  }
};

function initProjectModals() {
  const modalEl = document.getElementById('projectDetailsModal');
  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  const detailButtons = document.querySelectorAll('[data-project-id]');

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-id');
      const data = PROJECT_DATABASE[projId];
      if (!data) return;

      document.getElementById('modalProjectTitle').textContent = data.title;
      document.getElementById('modalProjectClient').innerHTML = `<i class="bi bi-geo-alt-fill text-info me-1"></i> ${data.client}`;
      document.getElementById('modalProjectRole').textContent = `${data.role} • ${data.company}`;
      document.getElementById('modalProjectPeriod').textContent = data.period;
      document.getElementById('modalProjectTeam').textContent = data.teamSize;
      document.getElementById('modalProjectOverview').textContent = data.overview;
      document.getElementById('modalProjectArchitecture').textContent = data.architecture;

      // Populate Tech Badges
      const techContainer = document.getElementById('modalProjectTech');
      techContainer.innerHTML = '';
      data.technologies.forEach((tech) => {
        const badge = document.createElement('span');
        badge.className = 'tech-tag-sm bg-dark border text-light px-2 py-1';
        badge.textContent = tech;
        techContainer.appendChild(badge);
      });

      // Populate Key Features
      const featContainer = document.getElementById('modalProjectFeatures');
      featContainer.innerHTML = '';
      data.keyFeatures.forEach((feat) => {
        const li = document.createElement('li');
        li.className = 'mb-2 text-secondary';
        li.innerHTML = `<i class="bi bi-check-circle-fill text-cyan me-2"></i> ${feat}`;
        featContainer.appendChild(li);
      });

      modal.show();
    });
  });
}

/* --------------------------------------------------------------------------
   CONTACT FORM HANDLER & UTILITIES
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim();
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Dispatching...';

    // Simulate reliable dispatch
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Message Sent!';
      submitBtn.classList.replace('btn-primary-gradient', 'btn-success');

      showToast(`Thank you ${name}! Pugazhendhi has received your message.`);
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.classList.replace('btn-success', 'btn-primary-gradient');
      }, 4000);
    }, 1200);
  });
}

/* Copy to Clipboard Helper */
window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`${label} copied to clipboard!`);
  }).catch(() => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`${label} copied to clipboard!`);
  });
};

/* Toast Notification Utility */
function showToast(message, type = 'info') {
  let toastEl = document.getElementById('globalCustomToast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'globalCustomToast';
    toastEl.className = 'custom-toast';
    document.body.appendChild(toastEl);
  }

  const iconMap = {
    info: 'bi-info-circle-fill text-info',
    success: 'bi-check-circle-fill text-success',
    warning: 'bi-exclamation-triangle-fill text-warning'
  };

  toastEl.innerHTML = `
    <i class="bi ${iconMap[type] || iconMap.info} fs-5"></i>
    <span class="fw-semibold text-light">${message}</span>
  `;

  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3500);
}

/* --------------------------------------------------------------------------
   SCROLL BEHAVIORS (Navbar Blur, Back to Top, Active Nav Link)
   -------------------------------------------------------------------------- */
function initScrollBehaviors() {
  const navbar = document.getElementById('mainNavbar');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link-custom');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar shrink & background blur adjustment
    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Scrollspy active highlighting
    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Auto-close mobile navbar on click
  const navbarCollapse = document.getElementById('navbarContent');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   CERTIFICATION MODAL VIEWER
   -------------------------------------------------------------------------- */
window.openCertModal = function(title, iframeUrl, certId, score) {
  const modalEl = document.getElementById('certViewerModal');
  if (!modalEl || typeof bootstrap === 'undefined') return;

  const titleEl = document.getElementById('certModalTitle');
  const idEl = document.getElementById('certModalId');
  const scoreEl = document.getElementById('certModalScore');
  const iframeEl = document.getElementById('certIframe');
  const externalLinkEl = document.getElementById('certExternalLink');

  if (titleEl) titleEl.textContent = title;
  if (idEl) idEl.textContent = `Credential: ${certId}`;
  if (scoreEl) scoreEl.textContent = `Score: ${score}`;
  if (iframeEl) iframeEl.src = iframeUrl;
  if (externalLinkEl) externalLinkEl.href = iframeUrl;

  const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  modal.show();
};

// Reset iframe on modal close to release memory
document.addEventListener('DOMContentLoaded', () => {
  const certModalEl = document.getElementById('certViewerModal');
  if (certModalEl) {
    certModalEl.addEventListener('hidden.bs.modal', () => {
      const iframe = document.getElementById('certIframe');
      if (iframe) iframe.src = '';
    });
  }
});

/* --------------------------------------------------------------------------
   DEDICATED CV PRINT / SAVE AS PDF FUNCTION
   Uses an isolated hidden print iframe ensuring ONLY the formatted CV sheet
   is rendered and printed, without website headers, footers, or blank pages.
   -------------------------------------------------------------------------- */
window.printResume = function() {
  const resumeSheet = document.querySelector('.resume-modal-sheet');
  if (!resumeSheet) {
    window.print();
    return;
  }

  // Remove existing print iframe if present
  let oldFrame = document.getElementById('resumePrintFrame');
  if (oldFrame) oldFrame.remove();

  const printFrame = document.createElement('iframe');
  printFrame.id = 'resumePrintFrame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  printFrame.style.visibility = 'hidden';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pugazhendhi_V_Resume</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #ffffff !important;
      color: #1e293b !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.45;
      padding: 0;
      margin: 0;
    }
    .resume-modal-sheet {
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    .resume-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .resume-name {
      font-size: 24pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .resume-section-heading {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 14px 0 8px 0;
      break-after: avoid;
      page-break-after: avoid;
    }
    .text-muted { color: #64748b !important; }
    .text-dark { color: #1e293b !important; }
    .text-primary { color: #0284c7 !important; }
    .fw-bold { font-weight: 700; }
    .fw-semibold { font-weight: 600; }
    .small { font-size: 8.8pt; }
    a { color: #0284c7; text-decoration: none; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 9pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 8px;
      text-align: left;
    }
    th.bg-light {
      background-color: #f1f5f9 !important;
      font-weight: 600;
      width: 25%;
    }
    
    ul {
      padding-left: 20px;
      margin-bottom: 8px;
    }
    li {
      margin-bottom: 4px;
    }
    p {
      margin-bottom: 6px;
    }
    .mb-3 {
      margin-bottom: 12px;
    }
    .mb-2 {
      margin-bottom: 8px;
    }
    .mb-1 {
      margin-bottom: 4px;
    }
    .mb-0 {
      margin-bottom: 0;
    }
    
    .resume-header,
    .resume-section-heading + *,
    .mb-3 > div {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="resume-modal-sheet">
    ${resumeSheet.innerHTML}
  </div>
</body>
</html>`);
  frameDoc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (e) {
      console.error('Print frame error, falling back to window.print():', e);
      window.print();
    }
    setTimeout(() => {
      printFrame.remove();
    }, 2000);
  }, 250);
};
