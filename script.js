// ==================== FIXED DATA STORAGE ====================
const GITHUB_CONFIG = {
  token: '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', // Paste your GitHub token here
  gistId: null, // Leave null, auto-creates
  filename: 'portfolio-data.json'
};
const STORAGE_KEY = 'portfoliopro_uet_atd_v4'; // Changed version to force update

// Default data structure
const defaultData = {
    profile: {
        name: 'ATTIQUE UR REHMAN',
        title: 'Computer Science Student',
        regNumber: 'UET-ATD-CS-10-001-2025-01920',
        bio: 'Passionate Computer Science student at UET Abbottabad with expertise in digital literacy, digital marketing, and web development. Dedicated to leveraging technology for innovative solutions and continuous learning in the ever-evolving tech landscape.',
        profileImage: 'photo.png',
        phone: '+92 313 1518232'
    },
    academics: [
        { id: 1, level: 'Primary', institution: 'Fazaia Inter School & College Islamabad', year: '2010-2015', grade: 'A+' },
        { id: 2, level: 'Elementary', institution: 'Fazaia Inter School & College Islamabad', year: '2015-2018', grade: 'A+' },
        { id: 3, level: 'Middle', institution: 'Fazaia Inter School & College Islamabad', year: '2018-2021', grade: 'A+' },
        { id: 4, level: 'Matric', institution: 'Army Public School Abbottabad', year: '2021-2023', grade: 'A+ / 83%' },
        { id: 5, level: 'Intermediate', institution: 'Army Public School Abbottabad', year: '2023-2025', grade: 'A / 75%' },
        { id: 6, level: 'Undergraduate', institution: 'UET Abbottabad', year: '2025-Present', grade: '' }
    ],
    projects: [
        { 
            id: 1, 
            name: 'Digital Literacy Platform', 
            description: 'Comprehensive e-learning platform for teaching digital skills and computer literacy to students of all ages',
            progress: 90,
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'PHP']
        },
        { 
            id: 2, 
            name: 'Digital Marketing Dashboard', 
            description: 'Advanced analytics dashboard for social media marketing campaigns, SEO optimization, and performance tracking',
            progress: 75,
            technologies: ['React', 'Node.js', 'Chart.js', 'Google Analytics API', 'MongoDB']
        },
        { 
            id: 3, 
            name: 'Web Development Portfolio', 
            description: 'Modern, responsive portfolio website with admin panel, dynamic content management, and CV generation system',
            progress: 95,
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage API', 'Responsive Design']
        }
    ],
    gallery: [
        { 
            id: 1, 
            src: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800', 
            title: 'Digital Literacy Workshop', 
            description: 'Teaching digital skills and computer literacy to students' 
        },
        { 
            id: 2, 
            src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 
            title: 'Digital Marketing Analytics', 
            description: 'Analyzing marketing campaign data and SEO performance' 
        },
        { 
            id: 3, 
            src: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800', 
            title: 'Web Development Project', 
            description: 'Building responsive and modern web applications' 
        }
    ],
    emailConfig: {
        validDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'uet.edu.pk'],
        emailNotification: 'yes',
        autoReply: 'Thank you for your message. I will get back to you soon.'
    },
    settings: {
        theme: 'light'
    },
    uploadedCV: null
};

let portfolioData = JSON.parse(JSON.stringify(defaultData)); // Deep clone

let uploadedCVFile = null;
let cvBlobUrl = null;

// FIXED: Save data function
async function saveData() {
  try {
    portfolioData.lastUpdated = new Date().toISOString();
    
    if (GITHUB_CONFIG.token) {
      await saveToGist(portfolioData);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
    console.log('✅ Saved to cloud');
  } catch (e) {
    console.error('❌ Error:', e);
  }
}

// FIXED: Load data function
async function loadData() {
  try {
    if (GITHUB_CONFIG.token) {
      const cloudData = await loadFromGist();
      if (cloudData) {
        portfolioData = cloudData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        console.log('✅ Loaded from cloud');
        return;
      }
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      portfolioData = JSON.parse(saved);
    } else {
      portfolioData = JSON.parse(JSON.stringify(defaultData));
      await saveData();
    }
  } catch (e) {
    console.error('❌ Error:', e);
    portfolioData = JSON.parse(JSON.stringify(defaultData));
  }
}
async function saveToGist(data) {
  const url = GITHUB_CONFIG.gistId 
    ? `https://api.github.com/gists/${GITHUB_CONFIG.gistId}`
    : 'https://api.github.com/gists';
  
  const method = GITHUB_CONFIG.gistId ? 'PATCH' : 'POST';
  
  const response = await fetch(url, {
    method: method,
    headers: {
      'Authorization': `token ${GITHUB_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Portfolio Data',
      public: false,
      files: {
        [GITHUB_CONFIG.filename]: {
          content: JSON.stringify(data, null, 2)
        }
      }
    })
  });
  
  const result = await response.json();
  
  if (!GITHUB_CONFIG.gistId && result.id) {
    GITHUB_CONFIG.gistId = result.id;
    console.log('📝 Gist created! Add this to config: gistId: "' + result.id + '"');
  }
  
  return result;
}

async function loadFromGist() {
  if (!GITHUB_CONFIG.gistId) return null;
  
  const response = await fetch(`https://api.github.com/gists/${GITHUB_CONFIG.gistId}`, {
    headers: {
      'Authorization': `token ${GITHUB_CONFIG.token}`
    }
  });
  
  if (!response.ok) return null;
  
  const gist = await response.json();
  const content = gist.files[GITHUB_CONFIG.filename].content;
  return JSON.parse(content);
}
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Force update academic data if using old version
    if (!portfolioData.academics.some(a => a.institution.includes('Fazaia'))) {
        console.log('📄 Updating to new academic data...');
        portfolioData.academics = JSON.parse(JSON.stringify(defaultData.academics));
        saveData();
    }
    
    initEventListeners();
    renderData();
    setupResponsive();
    applyTheme();
    
    // FORCE REFRESH DATA FROM STORAGE ON EVERY LOAD
    setTimeout(() => {
        renderData();
    }, 100);
});
// FIXED: Restore CV from storage
function restoreCVFromStorage() {
    try {
        fetch(portfolioData.uploadedCV.data)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], portfolioData.uploadedCV.name, {
                    type: portfolioData.uploadedCV.type
                });
                uploadedCVFile = file;
                cvBlobUrl = URL.createObjectURL(blob);
                updateCVPreview(true);
                document.getElementById('viewCVBtn').disabled = false;
                document.getElementById('downloadPDFBtn').disabled = false;
                document.getElementById('downloadWordBtn').disabled = false;
                console.log('✅ CV restored from storage');
            });
    } catch (e) {
        console.error('❌ Error restoring CV:', e);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEventListeners();
    renderData();
    setupResponsive();
    applyTheme();
});

// ==================== RESPONSIVE SETUP ====================
function setupResponsive() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Toggle mobile menu - FIXED VERSION
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                navLinks.classList.add('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
            
            console.log('Mobile menu toggled:', !isActive);
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Rest of the function continues...

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Window resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            adjustLayout();
        }, 250);
    });

    adjustLayout();
}

function adjustLayout() {
    const width = window.innerWidth;
    
    // Adjust table display on mobile
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (width <= 767) {
            table.style.fontSize = '0.85rem';
        } else {
            table.style.fontSize = '';
        }
    });
}

// ==================== THEME MANAGEMENT ====================
const themeToggle = document.getElementById('themeToggle');
let currentTheme = portfolioData.settings.theme;

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    portfolioData.settings.theme = currentTheme;
    saveData();
    
    // Update button text
    themeToggle.innerHTML = currentTheme === 'dark' 
        ? '<i class="fas fa-sun"></i> <span>Light</span>'
        : '<i class="fas fa-moon"></i> <span>Dark</span>';
});

// Apply saved theme on load
function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark' 
        ? '<i class="fas fa-sun"></i> <span>Light</span>'
        : '<i class="fas fa-moon"></i> <span>Dark</span>';
}

// ==================== EMAIL VALIDATION ====================
function checkEmailDomains() {
    // Pre-populate valid domains in admin form
    const domainsTextarea = document.getElementById('validDomains');
    if (domainsTextarea) {
        domainsTextarea.value = portfolioData.emailConfig.validDomains.join(', ');
    }
    
    const notificationSelect = document.getElementById('emailNotification');
    if (notificationSelect) {
        notificationSelect.value = portfolioData.emailConfig.emailNotification;
    }
    
    const autoReply = document.getElementById('autoReply');
    if (autoReply) {
        autoReply.value = portfolioData.emailConfig.autoReply;
    }
}

async function validateEmailExistence(email) {
    const validationDiv = document.getElementById('emailValidation');
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showValidationMessage('Please enter a valid email address', 'invalid');
        return false;
    }

    // Extract domain
    const domain = email.split('@')[1].toLowerCase();
    
    // Check against valid domains
    const validDomains = portfolioData.emailConfig.validDomains;
    const isValidDomain = validDomains.some(validDomain => 
        domain === validDomain.toLowerCase()
    );
    
    if (isValidDomain) {
        showValidationMessage('✓ Valid email domain', 'valid');
        return true;
    }

    // If domain not in list, show error
    showValidationMessage(`✗ Email domain not accepted. Valid domains: ${validDomains.join(', ')}`, 'invalid');
    return false;
}

function showValidationMessage(message, type) {
    const validationDiv = document.getElementById('emailValidation');
    const icon = type === 'valid' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    validationDiv.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    validationDiv.className = `email-validation ${type}`;
    validationDiv.style.display = 'flex';
}

// ==================== CONTACT FORM ====================
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('formLoader');
    const email = document.getElementById('email').value;
    
    // Show loader
    submitBtn.disabled = true;
    loader.classList.add('active');
    
    // Validate email
    const isValid = await validateEmailExistence(email);
    
    if (!isValid) {
        showAlert('errorAlert', 'Please use a valid email address from accepted domains.');
        submitBtn.disabled = false;
        loader.classList.remove('active');
        return;
    }
    
    // Simulate sending email (in real implementation, this would be an API call)
    setTimeout(() => {
        showAlert('successAlert', 'Message sent successfully! You will receive a confirmation email.');
        this.reset();
        document.getElementById('emailValidation').style.display = 'none';
        submitBtn.disabled = false;
        loader.classList.remove('active');
    }, 2000);
});

function showAlert(alertId, message) {
    const alert = document.getElementById(alertId);
    alert.innerHTML = `<i class="fas ${alertId.includes('success') ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    alert.classList.add('active');
    
    setTimeout(() => {
        alert.classList.remove('active');
    }, 5000);
}

// ==================== ADMIN PANEL ====================
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');

adminBtn.addEventListener('click', () => {
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadAdminData();
});

function closeAdminModal() {
    adminModal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.style.display = 'block';
        tabElement.classList.add('active');
    }
    
    // Add active class to the clicked button
    // Find the button that corresponds to this tab
    document.querySelectorAll('.admin-tab').forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if (btnText.includes(tabName.toLowerCase()) || 
            (tabName === 'profile' && btnText.includes('profile')) ||
            (tabName === 'academics' && btnText.includes('academics')) ||
            (tabName === 'projects' && btnText.includes('projects')) ||
            (tabName === 'gallery' && btnText.includes('gallery')) ||
            (tabName === 'email' && btnText.includes('email')) ||
            (tabName === 'backup' && btnText.includes('backup'))) {
            btn.classList.add('active');
        }
    });
    
    console.log('📑 Switched to tab:', tabName);
}

function loadAdminData() {
    // Load profile data into admin form
    const profile = portfolioData.profile;
    document.getElementById('nameInput').value = profile.name || '';
    document.getElementById('titleInput').value = profile.title || '';
    document.getElementById('regInput').value = profile.regNumber || '';
    document.getElementById('phoneInput').value = profile.phone || '';
    document.getElementById('bioInput').value = profile.bio || '';
    document.getElementById('profilePreview').src = profile.profileImage;
    
    // Load email config
    document.getElementById('validDomains').value = portfolioData.emailConfig.validDomains.join(', ');
    document.getElementById('emailNotification').value = portfolioData.emailConfig.emailNotification;
    document.getElementById('autoReply').value = portfolioData.emailConfig.autoReply;
    
    // Render academic records in admin
    renderAcademicRecordsList();
    
    // Render projects in admin
    renderProjectRecordsList();
    
    // Render gallery in admin
    renderGalleryRecordsList();
}

// ==================== PROFILE IMAGE PREVIEW ====================
function previewProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('profilePreview');
            preview.src = e.target.result;
            
            // Update main profile image
            document.getElementById('profileImg').src = e.target.result;
            
            // Save to data
            portfolioData.profile.profileImage = e.target.result;
            saveData();
        };
        reader.readAsDataURL(file);
    }
}

function previewGalleryImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('galleryPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// ==================== RENDER DATA ====================
function renderData() {
    // Render profile
    const profile = portfolioData.profile;
    document.getElementById('userName').textContent = profile.name;
    document.getElementById('userTitle').textContent = profile.title;
    document.getElementById('regNumber').textContent = profile.regNumber;
    document.getElementById('userBio').textContent = profile.bio;
    document.getElementById('profileImg').src = profile.profileImage;
    
    // Render academics table
    renderAcademicsTable();
    
    // Render projects
    renderProjects();
    
    // Render gallery
    renderGallery();
    
    // Check if CV exists
    if (uploadedCVFile || portfolioData.uploadedCV) {
        updateCVPreview(true);
    }
}

function renderAcademicsTable() {
    const tbody = document.getElementById('academicTableBody');
    tbody.innerHTML = '';
    
    portfolioData.academics.forEach(record => {
        const row = document.createElement('tr');
        const gradeDisplay = record.grade && record.grade !== 'N/A' ? 
            `<span style="background: rgba(0, 243, 255, 0.1); color: var(--neon-blue); padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600;">${record.grade}</span>` : 
            '<span style="color: var(--text-secondary);">—</span>';
        
        row.innerHTML = `
            <td><strong>${record.level}</strong></td>
            <td>${record.institution}</td>
            <td>${record.year}</td>
            <td>${gradeDisplay}</td>
            <td><button class="edit-btn" onclick="editAcademicRecord(${record.id})"><i class="fas fa-edit"></i> Edit</button></td>
        `;
        tbody.appendChild(row);
    });
}

function renderAcademicsTable() {
    const tbody = document.getElementById('academicTableBody');
    tbody.innerHTML = '';
    
    if (!portfolioData.academics || portfolioData.academics.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-graduation-cap" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    No academic records found. Add records from the Admin Panel.
                </td>
            </tr>
        `;
        return;
    }
    
    portfolioData.academics.forEach(record => {
        const row = document.createElement('tr');
        const gradeDisplay = record.grade && record.grade !== 'N/A' && record.grade.trim() !== '' ? 
            `<span style="background: rgba(0, 243, 255, 0.1); color: var(--neon-blue); padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600;">${record.grade}</span>` : 
            '<span style="color: var(--text-secondary);">—</span>';
        
        row.innerHTML = `
            <td><strong>${record.level}</strong></td>
            <td>${record.institution}</td>
            <td>${record.year}</td>
            <td>${gradeDisplay}</td>
            <td><button class="edit-btn" onclick="editAcademicRecord(${record.id})"><i class="fas fa-edit"></i> Edit</button></td>
        `;
        tbody.appendChild(row);
    });
}
function renderProjects() {
    const container = document.getElementById('progressContainer');
    container.innerHTML = '';
    
    portfolioData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1;">
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">${project.name}</h3>
                    <p style="color: var(--text-secondary);">${project.description}</p>
                </div>
                <span style="background: var(--gradient-primary); color: var(--dark-space); padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600;">
                    ${project.progress}%
                </span>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
            
            <div style="margin-top: 1rem;">
                ${project.technologies ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                    ${project.technologies.map(tech => `
                        <span style="background: rgba(0, 243, 255, 0.1); color: var(--neon-blue); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <button class="edit-btn" onclick="editProject(${project.id})" style="margin-top: 1rem;">
                <i class="fas fa-edit"></i> Edit Project
            </button>
        `;
        container.appendChild(projectCard);
    });
}

function renderProjectRecordsList() {
    const container = document.getElementById('projectRecordsList');
    container.innerHTML = '';
    
    if (portfolioData.projects.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-code" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No projects found</p>
            </div>
        `;
        return;
    }
    
    portfolioData.projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'card';
        projectElement.style.marginBottom = '1rem';
        projectElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1;">
                    <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">${project.name}</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">${project.description}</p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="color: var(--text-secondary);">
                            <i class="fas fa-chart-line"></i> ${project.progress}% Complete
                        </span>
                        ${project.technologies ? `
                        <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
                            ${project.technologies.slice(0, 3).map(tech => `
                                <span style="background: rgba(0, 243, 255, 0.1); color: var(--neon-blue); padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem;">
                                    ${tech}
                                </span>
                            `).join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProjectAdmin(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(projectElement);
    });
}

function renderGallery() {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '';
    
    portfolioData.gallery.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="gallery-overlay">
                <h3 style="color: white; margin-bottom: 0.5rem;">${image.title}</h3>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">${image.description}</p>
            </div>
        `;
        container.appendChild(galleryItem);
    });
}

function renderGalleryRecordsList() {
    const container = document.getElementById('galleryRecordsList');
    container.innerHTML = '';
    
    if (portfolioData.gallery.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-images" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No gallery images found</p>
            </div>
        `;
        return;
    }
    
    portfolioData.gallery.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.className = 'card';
        imageElement.style.marginBottom = '1rem';
        imageElement.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: start; flex-wrap: wrap;">
                <img src="${image.src}" alt="${image.title}" 
                     style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px;">
                <div style="flex: 1;">
                    <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">${image.title}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">${image.description}</p>
                </div>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editGalleryImageAdmin(${image.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete" onclick="deleteGalleryImage(${image.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        container.appendChild(imageElement);
    });
}

// ==================== FORM HANDLERS ====================
// Profile Form
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    portfolioData.profile = {
        ...portfolioData.profile,
        name: document.getElementById('nameInput').value,
        title: document.getElementById('titleInput').value,
        regNumber: document.getElementById('regInput').value,
        phone: document.getElementById('phoneInput').value,
        bio: document.getElementById('bioInput').value
    };
    
    saveData();
    renderData();
    document.getElementById('profileSuccess').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('profileSuccess').classList.remove('active');
    }, 3000);
});

// Academic Form
document.getElementById('academicForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recordId = document.getElementById('academicId').value;
    const gradeValue = document.getElementById('gradeInput').value.trim();
    
    const record = {
        id: recordId ? parseInt(recordId) : Date.now(),
        level: document.getElementById('levelInput').value,
        institution: document.getElementById('institutionInput').value,
        year: document.getElementById('yearInput').value,
        grade: gradeValue || ''  // Empty string if no grade
    };
    
    if (recordId) {
        // Update existing record
        const index = portfolioData.academics.findIndex(r => r.id === parseInt(recordId));
        if (index !== -1) {
            portfolioData.academics[index] = record;
            console.log('✅ Academic record updated:', record);
        }
        document.getElementById('academicSuccess').innerHTML = '<i class="fas fa-check-circle"></i> Academic record updated successfully!';
        resetAcademicForm();
    } else {
        // Add new record
        portfolioData.academics.push(record);
        console.log('✅ Academic record added:', record);
        document.getElementById('academicSuccess').innerHTML = '<i class="fas fa-check-circle"></i> Academic record added successfully!';
    }
    
    // Save and refresh
    saveData();
    renderData();
    renderAcademicRecordsList();
    
    // Show success message
    document.getElementById('academicSuccess').classList.add('active');
    document.getElementById('academicSuccess').style.display = 'block';
    
    // Reset form
    if (!recordId) {
        this.reset();
    }
    
    setTimeout(() => {
        document.getElementById('academicSuccess').classList.remove('active');
        document.getElementById('academicSuccess').style.display = 'none';
    }, 3000);
});

function resetAcademicForm() {
    document.getElementById('academicId').value = '';
    document.getElementById('academicForm').reset();
    document.getElementById('academicSubmitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Academic Record';
    document.getElementById('academicCancelBtn').style.display = 'none';
    console.log('🔄 Academic form reset');
}

// Project Form
document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const technologies = document.getElementById('projectTechInput').value
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
    
    const project = {
        id: projectId ? parseInt(projectId) : Date.now(),
        name: document.getElementById('projectNameInput').value,
        description: document.getElementById('projectDescInput').value,
        progress: parseInt(document.getElementById('projectProgressInput').value),
        technologies: technologies
    };
    
    if (projectId) {
        // Update existing project
        const index = portfolioData.projects.findIndex(p => p.id === parseInt(projectId));
        if (index !== -1) {
            portfolioData.projects[index] = project;
        }
        document.getElementById('projectSuccess').textContent = 'Project updated successfully!';
        resetProjectForm();
    } else {
        // Add new project
        portfolioData.projects.push(project);
        document.getElementById('projectSuccess').textContent = 'Project added successfully!';
    }
    
    document.getElementById('projectSuccess').classList.add('active');
    saveData();
    renderData();
    renderProjectRecordsList();
    this.reset();
    document.getElementById('progressValue').textContent = '0%';
    
    setTimeout(() => {
        document.getElementById('projectSuccess').classList.remove('active');
    }, 3000);
});

function resetProjectForm() {
    document.getElementById('projectId').value = '';
    document.getElementById('projectForm').reset();
    document.getElementById('projectProgressInput').value = 0;
    document.getElementById('progressValue').textContent = '0%';
    document.getElementById('projectSubmitBtn').innerHTML = '<i class="fas fa-plus"></i> Add Project';
    document.getElementById('projectCancelBtn').style.display = 'none';
    console.log('🔄 Project form reset');
}

// Gallery Form
document.getElementById('galleryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const galleryId = document.getElementById('galleryId').value;
    const preview = document.getElementById('galleryPreview');
    
    if (preview.style.display === 'none' && !galleryId) {
        alert('Please upload an image first!');
        return;
    }
    
    const image = {
        id: galleryId ? parseInt(galleryId) : Date.now(),
        src: galleryId && !preview.src.includes('data:') ? 
            portfolioData.gallery.find(img => img.id === parseInt(galleryId)).src : 
            preview.src,
        title: document.getElementById('galleryTitleInput').value,
        description: document.getElementById('galleryDescInput').value
    };
    
    if (galleryId) {
        // Update existing image
        const index = portfolioData.gallery.findIndex(img => img.id === parseInt(galleryId));
        if (index !== -1) {
            portfolioData.gallery[index] = image;
        }
        document.getElementById('gallerySuccess').textContent = 'Gallery item updated successfully!';
        resetGalleryForm();
    } else {
        // Add new image
        portfolioData.gallery.push(image);
        document.getElementById('gallerySuccess').textContent = 'Gallery item added successfully!';
    }
    
    document.getElementById('gallerySuccess').classList.add('active');
    saveData();
    renderData();
    renderGalleryRecordsList();
    this.reset();
    preview.style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('gallerySuccess').classList.remove('active');
    }, 3000);
});

function resetGalleryForm() {
    document.getElementById('galleryId').value = '';
    document.getElementById('gallerySubmitBtn').innerHTML = '<i class="fas fa-plus"></i> Add to Gallery';
    document.getElementById('galleryCancelBtn').style.display = 'none';
    document.getElementById('galleryForm').reset();
    document.getElementById('galleryPreview').style.display = 'none';
}

// Email Config Form
document.getElementById('emailConfigForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const domains = document.getElementById('validDomains').value
        .split(',')
        .map(d => d.trim())
        .filter(d => d.length > 0);
    
    portfolioData.emailConfig = {
        validDomains: domains,
        emailNotification: document.getElementById('emailNotification').value,
        autoReply: document.getElementById('autoReply').value
    };
    
    saveData();
    document.getElementById('emailSuccess').classList.add('active');
    
    setTimeout(() => {
        document.getElementById('emailSuccess').classList.remove('active');
    }, 3000);
});

// ==================== EDIT FUNCTIONS ====================
function editAcademicRecord(id) {
    const record = portfolioData.academics.find(r => r.id === id);
    if (record) {
        // Open admin modal
        const adminModal = document.getElementById('adminModal');
        adminModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Switch to academics tab
        switchTab('academics');
        
        // Wait a moment for the modal to open, then populate form
        setTimeout(() => {
            document.getElementById('academicId').value = record.id;
            document.getElementById('levelInput').value = record.level;
            document.getElementById('institutionInput').value = record.institution;
            document.getElementById('yearInput').value = record.year;
            document.getElementById('gradeInput').value = record.grade || '';
            
            // Update button text and show cancel button
            document.getElementById('academicSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Record';
            document.getElementById('academicCancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.getElementById('academicForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function editAcademicRecordAdmin(id) {
    const record = portfolioData.academics.find(r => r.id === id);
    if (record) {
        // Populate form fields
        document.getElementById('academicId').value = record.id;
        document.getElementById('levelInput').value = record.level;
        document.getElementById('institutionInput').value = record.institution;
        document.getElementById('yearInput').value = record.year;
        document.getElementById('gradeInput').value = record.grade || '';
        
        // Update button text and show cancel button
        document.getElementById('academicSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Record';
        document.getElementById('academicCancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('academicForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('✏️ Editing academic record:', record);
    }
}

function editProject(id) {
    const project = portfolioData.projects.find(p => p.id === id);
    if (project) {
        // Open admin modal
        const adminModal = document.getElementById('adminModal');
        adminModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Switch to projects tab
        switchTab('projects');
        
        // Wait a moment for the modal to open, then populate form
        setTimeout(() => {
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectNameInput').value = project.name;
            document.getElementById('projectDescInput').value = project.description || '';
            document.getElementById('projectProgressInput').value = project.progress;
            document.getElementById('progressValue').textContent = project.progress + '%';
            document.getElementById('projectTechInput').value = project.technologies ? project.technologies.join(', ') : '';
            
            // Update button text and show cancel button
            document.getElementById('projectSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Project';
            document.getElementById('projectCancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function editProjectAdmin(id) {
    const project = portfolioData.projects.find(p => p.id === id);
    if (project) {
        // Populate form fields
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectNameInput').value = project.name;
        document.getElementById('projectDescInput').value = project.description || '';
        document.getElementById('projectProgressInput').value = project.progress;
        document.getElementById('progressValue').textContent = project.progress + '%';
        document.getElementById('projectTechInput').value = project.technologies ? project.technologies.join(', ') : '';
        
        // Update button text and show cancel button
        document.getElementById('projectSubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Project';
        document.getElementById('projectCancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('projectForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('✏️ Editing project:', project);
    }
}
function editGalleryImageAdmin(id) {
    const image = portfolioData.gallery.find(img => img.id === id);
    if (image) {
        document.getElementById('galleryId').value = image.id;
        document.getElementById('galleryTitleInput').value = image.title;
        document.getElementById('galleryDescInput').value = image.description;
        document.getElementById('gallerySubmitBtn').innerHTML = '<i class="fas fa-save"></i> Update Image';
        document.getElementById('galleryCancelBtn').style.display = 'inline-block';
        
        // Switch to gallery tab
        switchTab('gallery');
    }
}

// ==================== DELETE OPERATIONS ====================
function deleteAcademicRecord(id) {
    if (confirm('Are you sure you want to delete this academic record?')) {
        portfolioData.academics = portfolioData.academics.filter(r => r.id !== id);
        saveData();
        renderData();
        renderAcademicRecordsList();
    }
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
        saveData();
        renderData();
        renderProjectRecordsList();
    }
}

function deleteGalleryImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        portfolioData.gallery = portfolioData.gallery.filter(img => img.id !== id);
        saveData();
        renderData();
        renderGalleryRecordsList();
    }
}

// ==================== CV FUNCTIONS ====================
function handleCVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    uploadedCVFile = file;
    
    // Convert file to base64 for storage
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        
        // Create object URL for the uploaded file
        if (cvBlobUrl) {
            URL.revokeObjectURL(cvBlobUrl);
        }
        cvBlobUrl = URL.createObjectURL(file);
    
    portfolioData.uploadedCV = {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            uploadDate: new Date().toISOString(),
            data: base64Data  // Save the base64 data
        };
        
        saveData();
 updateCVPreview(true);
        
        document.getElementById('uploadStatus').innerHTML = `
            <div class="email-validation valid">
                <i class="fas fa-check-circle"></i> CV uploaded successfully!
            </div>
        `;
        
        // Enable view button
        document.getElementById('viewCVBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

function updateCVPreview(hasCV) {
    const cvPreview = document.getElementById('cvPreview');
    const cvStatus = document.getElementById('cvStatus');
    const downloadPDFBtn = document.getElementById('downloadPDFBtn');
    const downloadWordBtn = document.getElementById('downloadWordBtn');
    const viewCVBtn = document.getElementById('viewCVBtn');
    
    if (hasCV) {
        cvPreview.classList.add('has-cv');
        cvStatus.style.display = 'block';
        downloadPDFBtn.disabled = false;
        downloadWordBtn.disabled = false;
        
        cvPreview.innerHTML = `
            <i class="fas fa-file-pdf" style="font-size: 4rem; color: var(--matrix-green); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">CV Ready</h3>
            <p style="color: var(--text-secondary);">Your CV is ready for viewing and download</p>
            <p id="cvStatus" style="color: var(--matrix-green); margin-top: 1rem; display: block;">
                <i class="fas fa-check-circle"></i> CV Ready
            </p>
        `;
    } else {
        cvPreview.classList.remove('has-cv');
        cvStatus.style.display = 'none';
        downloadPDFBtn.disabled = true;
        downloadWordBtn.disabled = true;
        viewCVBtn.disabled = true;
    }
}

function toggleCVViewer() {
    const cvViewerContainer = document.getElementById('cvViewerContainer');
    const cvViewer = document.getElementById('cvViewer');
    
    if (cvViewerContainer.classList.contains('active')) {
        cvViewerContainer.classList.remove('active');
    } else {
        if (cvBlobUrl) {
            cvViewer.src = cvBlobUrl;
            cvViewerContainer.classList.add('active');
        } else if (portfolioData.uploadedCV) {
            // If we have saved CV data but no blob URL, try to generate one
            alert('Please re-upload your CV file to view it.');
        } else {
            alert('No CV uploaded. Please upload or generate a CV first.');
        }
    }
}

function generateCV() {
    const loader = document.createElement('div');
    loader.className = 'loader active';
    document.getElementById('cvPreview').appendChild(loader);
    
    setTimeout(() => {
        // Create professional CV template matching the uploaded PDF
        const cvHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${portfolioData.profile.name} - CV</title>
    <style>
        @page { margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            color: #333;
        }
        .cv-container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            display: flex;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .left-column {
            background: #2d3748;
            color: white;
            width: 280px;
            padding: 40px 30px;
        }
        .right-column {
            flex: 1;
            padding: 40px;
        }
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: block;
            border: 4px solid #667eea;
        }
        .name {
            font-size: 32px;
            font-weight: bold;
            color: #1a202c;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .title {
            font-size: 16px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin: 25px 0 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 5px;
        }
        .left-column .section-title {
            border-bottom-color: #667eea;
            color: #667eea;
        }
        .contact-item {
            margin-bottom: 15px;
            font-size: 13px;
            line-height: 1.6;
        }
        .contact-item i {
            margin-right: 10px;
            color: #667eea;
        }
        .skill-item {
            background: rgba(102, 126, 234, 0.2);
            padding: 8px 15px;
            margin: 8px 0;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }
        .about-text {
            font-size: 14px;
            line-height: 1.8;
            color: #4a5568;
            margin-bottom: 20px;
        }
        .experience-item, .education-item {
            margin-bottom: 20px;
        }
        .job-title, .degree-title {
            font-size: 16px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 5px;
        }
        .company, .institution {
            font-size: 13px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .date {
            font-size: 12px;
            color: #718096;
            margin-bottom: 8px;
        }
        .description {
            font-size: 13px;
            line-height: 1.6;
            color: #4a5568;
        }
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        .tech-tag {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="cv-container">
        <div class="left-column">
            <img src="${portfolioData.profile.profileImage}" alt="Profile" class="profile-img" onerror="this.style.display='none'">
            
            <div class="section-title">CONTACT</div>
            <div class="contact-item">
                📧 attirehman482@gmail.com
            </div>
            <div class="contact-item">
                📱 ${portfolioData.profile.phone || '+92 313 1518232'}
            </div>
            <div class="contact-item">
                📍 UET Abbottabad, Pakistan
            </div>
            
            <div class="section-title">SKILLS</div>
            ${portfolioData.projects.flatMap(p => p.technologies || [])
                .filter((v, i, a) => a.indexOf(v) === i)
                .slice(0, 8)
                .map(tech => `<div class="skill-item">${tech}</div>`).join('')}
            
            <div class="section-title">REGISTRATION</div>
            <div class="contact-item" style="word-break: break-word;">
                ${portfolioData.profile.regNumber}
            </div>
        </div>
        
        <div class="right-column">
            <div class="name">${portfolioData.profile.name}</div>
            <div class="title">${portfolioData.profile.title}</div>
            
            <div class="section-title">ABOUT ME</div>
            <p class="about-text">${portfolioData.profile.bio}</p>
            
            <div class="section-title">EDUCATION</div>
            ${portfolioData.academics.map(edu => `
                <div class="education-item">
                    <div class="degree-title">${edu.level}</div>
                    <div class="company">${edu.institution}</div>
                    <div class="date">${edu.year}${edu.grade ? ' | Grade: ' + edu.grade : ''}</div>
                </div>
            `).join('')}
            
            <div class="section-title">PROJECTS</div>
            ${portfolioData.projects.map(proj => `
                <div class="experience-item">
                    <div class="job-title">${proj.name}</div>
                    <div class="date">Progress: ${proj.progress}% Complete</div>
                    <p class="description">${proj.description}</p>
                    ${proj.technologies ? `
                        <div class="tech-tags">
                            ${proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
        `;
        
        // Create blob and object URL
        const blob = new Blob([cvHTML], { type: 'text/html' });
        
        // Store as base64
        const reader = new FileReader();
        reader.onload = function(e) {
            portfolioData.uploadedCV = {
                name: `${portfolioData.profile.name.replace(/\s+/g, '_')}_CV.html`,
                generatedDate: new Date().toISOString(),
                type: 'generated',
                data: e.target.result
            };
            
            saveData();
            
            // Create new blob URL for viewing
            if (cvBlobUrl) {
                URL.revokeObjectURL(cvBlobUrl);
            }
            cvBlobUrl = URL.createObjectURL(blob);
            
            updateCVPreview(true);
            document.getElementById('cvSuccess').classList.add('active');
            document.getElementById('viewCVBtn').disabled = false;
            
            // Auto-open CV viewer
            const cvViewer = document.getElementById('cvViewer');
            const cvViewerContainer = document.getElementById('cvViewerContainer');
            cvViewer.src = cvBlobUrl;
            cvViewerContainer.classList.add('active');
            
            setTimeout(() => {
                document.getElementById('cvSuccess').classList.remove('active');
            }, 3000);
        };
        reader.readAsDataURL(blob);
        
        loader.remove();
    }, 1500);
}

function downloadCV(format) {
    if (!portfolioData.uploadedCV && !cvBlobUrl) {
        alert('Please upload or generate a CV first!');
        return;
    }

    const loader = document.createElement('div');
    loader.className = 'loader active';
    document.getElementById('cvPreview').appendChild(loader);

    setTimeout(() => {
        if (format === 'pdf') {
            // Open CV in new window for PDF printing
            const cvViewer = document.getElementById('cvViewer');
            const cvContent = cvViewer.src;
            
            if (cvContent) {
                // Open in new window
                const printWindow = window.open(cvContent, '_blank');
                
                // Wait for content to load, then trigger print dialog
                printWindow.onload = function() {
                    setTimeout(() => {
                        printWindow.print();
                        
                        // Show instructions
                        alert('💡 To save as PDF:\n\n1. In the print dialog, select "Save as PDF" or "Microsoft Print to PDF"\n2. Click "Save"\n3. Choose your destination folder\n\nNote: Make sure to select "Save as PDF" as the printer option!');
                    }, 500);
                };
            } else {
                alert('Please generate or upload a CV first!');
            }
        } else if (format === 'word') {
            // Download as Word document
            generateCVandDownload('word');
        }
        
        loader.remove();
        
    }, 500);
}

// Alternative: Direct PDF download using browser's print-to-PDF
function downloadCVAsPDF() {
    if (!cvBlobUrl && !portfolioData.uploadedCV) {
        alert('Please generate or upload a CV first!');
        return;
    }
    
    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    // Load CV content
    iframe.src = cvBlobUrl || document.getElementById('cvViewer').src;
    
    // Wait for load, then print
    iframe.onload = function() {
        setTimeout(() => {
            try {
                iframe.contentWindow.print();
            } catch (e) {
                alert('Please use Ctrl+P to print and select "Save as PDF"');
            }
        }, 500);
    };
    
    // Clean up after 5 seconds
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 5000);
}
function generateCVandDownload(format) {
    let content, fileName, mimeType;

    if (format === 'pdf') {
        // Create PDF content
        content = `
            <html>
            <head>
                <title>${portfolioData.profile.name} - CV</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    h1 { color: #333; margin-bottom: 10px; }
                    .section { margin-bottom: 20px; }
                    .contact-info { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${portfolioData.profile.name}</h1>
                    <p>${portfolioData.profile.title}</p>
                    <p>${portfolioData.profile.regNumber}</p>
                </div>
                
                <div class="contact-info">
                    <p>Email: ${document.getElementById('email')?.value || 'Not specified'}</p>
                    <p>Phone: ${portfolioData.profile.phone || 'Not specified'}</p>
                </div>
                
                <div class="section">
                    <h2>About Me</h2>
                    <p>${portfolioData.profile.bio}</p>
                </div>
                
                ${portfolioData.academics.length > 0 ? `
                <div class="section">
                    <h2>Education</h2>
                    ${portfolioData.academics.map(record => `
                        <div style="margin-bottom: 15px;">
                            <h3>${record.level} - ${record.institution}</h3>
                            <p><strong>${record.year}</strong> | Grade: ${record.grade}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${portfolioData.projects.length > 0 ? `
                <div class="section">
                    <h2>Projects</h2>
                    ${portfolioData.projects.map(project => `
                        <div style="margin-bottom: 15px;">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <p>Progress: ${project.progress}%</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </body>
            </html>
        `;
        
        fileName = `${portfolioData.profile.name.replace(/\s+/g, '_')}_CV.html`;
        mimeType = 'text/html';
        
    } else if (format === 'word') {
        // Create Word document content
        content = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" 
                  xmlns:w="urn:schemas-microsoft-com:office:word" 
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <title>${portfolioData.profile.name} - CV</title>
            </head>
            <body>
                <h1>${portfolioData.profile.name}</h1>
                <h2>${portfolioData.profile.title}</h2>
                <p><strong>Registration:</strong> ${portfolioData.profile.regNumber}</p>
                <hr>
                
                <h3>Contact Information</h3>
                <p>Phone: ${portfolioData.profile.phone || 'Not specified'}</p>
                
                <h3>About Me</h3>
                <p>${portfolioData.profile.bio}</p>
                
                ${portfolioData.academics.length > 0 ? `
                <h3>Education</h3>
                ${portfolioData.academics.map(record => `
                    <p><strong>${record.level}</strong> - ${record.institution} (${record.year})</p>
                    <p>Grade: ${record.grade}</p>
                `).join('')}
                ` : ''}
                
                ${portfolioData.projects.length > 0 ? `
                <h3>Projects</h3>
                ${portfolioData.projects.map(project => `
                    <p><strong>${project.name}</strong> - ${project.progress}% Complete</p>
                    <p>${project.description}</p>
                `).join('')}
                ` : ''}
            </body>
            </html>
        `;
        
        fileName = `${portfolioData.profile.name.replace(/\s+/g, '_')}_CV.doc`;
        mimeType = 'application/msword';
    }

    // Create and trigger download
    const blob = new Blob(['\ufeff', content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && adminModal.classList.contains('active')) {
            closeAdminModal();
        }
    });

    // Close modal when clicking outside
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            closeAdminModal();
        }
    });
    
    // Cancel buttons
    const academicCancelBtn = document.getElementById('academicCancelBtn');
    if (academicCancelBtn) {
        academicCancelBtn.addEventListener('click', resetAcademicForm);
    }
    
    const projectCancelBtn = document.getElementById('projectCancelBtn');
    if (projectCancelBtn) {
        projectCancelBtn.addEventListener('click', resetProjectForm);
    }
    
    const galleryCancelBtn = document.getElementById('galleryCancelBtn');
    if (galleryCancelBtn) {
        galleryCancelBtn.addEventListener('click', resetGalleryForm);
    }
}

// Auto-save every 30 seconds
setInterval(saveData, 30000);
// Auto-save every 30 seconds
setInterval(saveData, 30000);

// ==================== EXPORT/IMPORT DATA ====================
function exportData() {
    try {
        // Create a complete backup including CV data
        const backup = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: portfolioData
        };
        
        // Convert to JSON
        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Show success message
        const successDiv = document.getElementById('backupSuccess');
        successDiv.textContent = '✓ Backup file downloaded successfully!';
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
        
    } catch (e) {
        console.error('Export error:', e);
        alert('Error exporting data: ' + e.message);
    }
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a backup file first!');
        return;
    }
    
    if (!file.name.endsWith('.json')) {
        alert('Please select a valid JSON backup file!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            // Validate backup structure
            if (!backup.data || !backup.version) {
                throw new Error('Invalid backup file format');
            }
            
            // Confirm before restoring
            if (confirm('This will replace all current data. Are you sure you want to restore from this backup?')) {
                portfolioData = backup.data;
                saveData();
                renderData();
                loadAdminData();
                
                // Restore CV if exists
                if (portfolioData.uploadedCV && portfolioData.uploadedCV.data) {
                    restoreCVFromStorage();
                }
                
                // Show success message
                const successDiv = document.getElementById('backupSuccess');
                successDiv.textContent = '✓ Data restored successfully! Refreshing page...';
                successDiv.style.display = 'block';
                
                // Reload page after 2 seconds
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
            
        } catch (e) {
            console.error('Import error:', e);
            alert('Error importing data: ' + e.message + '\n\nPlease make sure you selected a valid backup file.');
        }
    };
    
    reader.readAsText(file);
}
// Reset to default data
function resetToDefaultData() {
    if (confirm('⚠️ This will reset ALL data to default values. Are you sure?')) {
        if (confirm('This action cannot be undone. Continue?')) {
            portfolioData = JSON.parse(JSON.stringify(defaultData));
            saveData();
            renderData();
            loadAdminData();
            alert('✅ Data has been reset to default values!');
            location.reload();
        }
    }
// Force reload data when window regains focus
window.addEventListener('focus', () => {
    loadData();
    renderData();
});

// Save data before page unload
window.addEventListener('beforeunload', () => {
    saveData();
});
}