import './supabase-config.js';
import { fetchProjects, fetchTestimonials } from './scripts.js';

document.addEventListener('DOMContentLoaded', async function () {
    // Navbar Toggler
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function () {
            navbarCollapse.classList.toggle('active');
        });
    }

    // Slider functionality (from existing code)
    const slides = document.querySelectorAll('.hero-slider .slide');
    const prevBtn = document.querySelector('.hero-slider .prev');
    const nextBtn = document.querySelector('.hero-slider .next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) { // Check if slider elements exist
        showSlide(currentSlide); // Show the first slide initially
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        // Optional: Auto-play slider
        // setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Cost Calculator Functionality (from existing code)
    const areaSqftInput = document.getElementById('area-sqft');
    const planTypeCalculatorSelect = document.getElementById('plan-type-calculator');
    const calculateCostBtn = document.getElementById('calculate-cost-btn');
    const estimatedCostResultDiv = document.getElementById('estimated-cost-result');

    if (calculateCostBtn && areaSqftInput && planTypeCalculatorSelect && estimatedCostResultDiv) {
        calculateCostBtn.addEventListener('click', function() {
            const area = parseFloat(areaSqftInput.value);
            const ratePerSqft = parseFloat(planTypeCalculatorSelect.value);

            if (isNaN(area) || area <= 0) {
                estimatedCostResultDiv.textContent = 'Please enter a valid area.';
                estimatedCostResultDiv.style.color = 'red';
                return;
            }

            if (isNaN(ratePerSqft)) {
                estimatedCostResultDiv.textContent = 'Please select a valid plan.';
                estimatedCostResultDiv.style.color = 'red';
                return;
            }

            const totalCost = area * ratePerSqft;
            estimatedCostResultDiv.textContent = `Estimated Cost: ₹${totalCost.toLocaleString('en-IN')}`;
            estimatedCostResultDiv.style.color = '#333'; // Reset color
        });
    }

    // Detailed Plan Page - Update Title from URL Fragment
    const planTitleElement = document.getElementById('plan-title'); // This is the H1 element itself
    const planNamePlaceholder = document.querySelector('#plan-title .plan-name-placeholder'); // More specific selector

    if (window.location.pathname.includes('detailed-plan.html') && planNamePlaceholder) {
        const hash = window.location.hash; // Get #basic, #standard etc.
        let planName = "[Select a Plan]"; // Default text for the span

        if (hash) {
            let extractedName = hash.substring(1); // Remove #
            // Capitalize first letter
            extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1).toLowerCase();
            planName = extractedName;
        }
        planNamePlaceholder.textContent = planName;
    }

    // --- Modern Project & Testimonial Slider Logic ---
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Autoplay functionality
    function createAutoplay(sliderType, nextFunction, intervalMs = 3500) {
        if (prefersReducedMotion) {
            return { start: () => {}, stop: () => {}, reset: () => {} };
        }
        
        let autoplayTimer = null;
        let isPaused = false;
        
        const start = () => {
            if (!isPaused) {
                autoplayTimer = setInterval(nextFunction, intervalMs);
            }
        };
        
        const stop = () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };
        
        const reset = () => {
            stop();
            start();
        };
        
        const pause = () => {
            isPaused = true;
            stop();
        };
        
        const resume = () => {
            isPaused = false;
            start();
        };
        
        return { start, stop, reset, pause, resume };
    }
    
    // --- Project Slider ---
    const projectSlider = document.querySelector('.project-slider');
    let projectData = [];
    if (projectSlider) {
        projectSlider.innerHTML = '<div style="padding:2rem;">Loading projects...</div>';
        try {
            const { data, error } = await fetchProjects();
            if (error) throw error;
            projectData = data || [];
            if (projectData.length === 0) {
                projectSlider.innerHTML = '<div style="padding:2rem;">No projects found.</div>';
            } else {
                projectSlider.innerHTML = projectData.map(p => `
                    <div class="project-card">
                        <img src="${p.image_url || 'images/unsplash-1465101046530-73398c7f28ca-600.jpg'}" alt="${p.project_name} logo" class="project-logo"/>
                        <div class="project-title">${p.project_name}</div>
                        <div class="project-desc">${p.description || ''}</div>
                    </div>
                `).join('');
            }
        } catch (err) {
            projectSlider.innerHTML = '<div style="color:red;padding:2rem;">Failed to load projects.</div>';
        }
    }
    let projectIndex = 0;
    const projectCards = () => document.querySelectorAll('.project-card');
    const showProjectCards = () => {
        const cards = projectCards();
        cards.forEach((card, i) => {
            card.style.display = (i >= projectIndex && i < projectIndex + 3) ? 'flex' : 'none';
        });
    };
    
    const nextProject = () => {
        projectIndex = (projectIndex + 1) % projectCards().length;
        showProjectCards();
    };
    
    const prevProject = () => {
        projectIndex = (projectIndex - 1 + projectCards().length) % projectCards().length;
        showProjectCards();
    };
    
    // Create autoplay for projects
    const projectAutoplay = createAutoplay('project', nextProject);
    
    setTimeout(() => {
        showProjectCards();
        // Start autoplay after DOM update
        if (projectCards().length > 3) {
            projectAutoplay.start();
        }
    }, 100);
    
    const projectLeftArrow = document.querySelector('.project-arrow.left');
    const projectRightArrow = document.querySelector('.project-arrow.right');
    const projectSliderWrapper = document.querySelector('.project-slider-wrapper');
    
    if (projectLeftArrow) {
        projectLeftArrow.onclick = () => {
            prevProject();
            projectAutoplay.reset(); // Reset autoplay timer on manual interaction
        };
    }
    
    if (projectRightArrow) {
        projectRightArrow.onclick = () => {
            nextProject();
            projectAutoplay.reset(); // Reset autoplay timer on manual interaction
        };
    }
    
    // Add hover/focus pause functionality for projects
    if (projectSliderWrapper) {
        projectSliderWrapper.addEventListener('mouseenter', projectAutoplay.pause);
        projectSliderWrapper.addEventListener('mouseleave', projectAutoplay.resume);
        projectSliderWrapper.addEventListener('focusin', projectAutoplay.pause);
        projectSliderWrapper.addEventListener('focusout', projectAutoplay.resume);
        
        // Add keyboard navigation support
        projectSliderWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevProject();
                projectAutoplay.reset();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextProject();
                projectAutoplay.reset();
            }
        });
    }
    
    window.addEventListener('resize', showProjectCards);

    // --- Testimonial Slider ---
    const testimonialSlider = document.querySelector('.testimonial-slider');
    let testimonialData = [];
    if (testimonialSlider) {
        testimonialSlider.innerHTML = '<div style="padding:2rem;">Loading testimonials...</div>';
        try {
            const { data, error } = await fetchTestimonials();
            if (error) throw error;
            testimonialData = data || [];
            if (testimonialData.length === 0) {
                testimonialSlider.innerHTML = '<div style="padding:2rem;">No testimonials found.</div>';
            } else {
                testimonialSlider.innerHTML = testimonialData.map(t => `
                    <div class="testimonial-card">
                        <img src="${t.user_image_url || 'images/unsplash-1465101046530-73398c7f28ca-600.jpg'}" alt="${t.user_name} logo" class="testimonial-logo"/>
                        <div class="testimonial-quote">"${t.testimonial_text || ''}"</div>
                        <div class="testimonial-stars">${'★'.repeat(5)}</div>
                        <div class="testimonial-user">
                            <img src="${t.user_image_url || 'images/unsplash-1503387762-5927c29adf34.jpg'}" alt="${t.user_name} avatar" class="testimonial-avatar"/>
                            <div class="testimonial-user-info">
                                <div class="testimonial-user-name">${t.user_name}</div>
                                <div class="testimonial-user-title">${t.company || ''}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (err) {
            testimonialSlider.innerHTML = '<div style="color:red;padding:2rem;">Failed to load testimonials.</div>';
        }
    }
    let testimonialIndex = 0;
    const testimonialCards = () => document.querySelectorAll('.testimonial-card');
    const showTestimonialCards = () => {
        const cards = testimonialCards();
        cards.forEach((card, i) => {
            card.style.display = (i >= testimonialIndex && i < testimonialIndex + 3) ? 'flex' : 'none';
        });
    };
        
    const nextTestimonial = () => {
        testimonialIndex = (testimonialIndex + 1) % testimonialCards().length;
        showTestimonialCards();
    };
        
    const prevTestimonial = () => {
        testimonialIndex = (testimonialIndex - 1 + testimonialCards().length) % testimonialCards().length;
        showTestimonialCards();
    };
        
    // Create autoplay for testimonials
    const testimonialAutoplay = createAutoplay('testimonial', nextTestimonial);
        
    setTimeout(() => {
        showTestimonialCards();
        // Start autoplay after DOM update
        if (testimonialCards().length > 3) {
            testimonialAutoplay.start();
        }
    }, 100);
        
    const testimonialLeftArrow = document.querySelector('.testimonial-arrow.left');
    const testimonialRightArrow = document.querySelector('.testimonial-arrow.right');
    const testimonialSliderWrapper = document.querySelector('.testimonial-slider-wrapper');
        
    if (testimonialLeftArrow) {
        testimonialLeftArrow.onclick = () => {
            prevTestimonial();
            testimonialAutoplay.reset(); // Reset autoplay timer on manual interaction
        };
    }
        
    if (testimonialRightArrow) {
        testimonialRightArrow.onclick = () => {
            nextTestimonial();
            testimonialAutoplay.reset(); // Reset autoplay timer on manual interaction
        };
    }
        
    // Add hover/focus pause functionality for testimonials
    if (testimonialSliderWrapper) {
        testimonialSliderWrapper.addEventListener('mouseenter', testimonialAutoplay.pause);
        testimonialSliderWrapper.addEventListener('mouseleave', testimonialAutoplay.resume);
        testimonialSliderWrapper.addEventListener('focusin', testimonialAutoplay.pause);
        testimonialSliderWrapper.addEventListener('focusout', testimonialAutoplay.resume);
        
        // Add keyboard navigation support
        testimonialSliderWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevTestimonial();
                testimonialAutoplay.reset();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextTestimonial();
                testimonialAutoplay.reset();
            }
        });
    }
        
    window.addEventListener('resize', showTestimonialCards);
});

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Core Values Animation
document.addEventListener('DOMContentLoaded', function() {
    const coreValueCards = document.querySelectorAll('.core-value-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    coreValueCards.forEach(card => {
        observer.observe(card);
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Social Media Icons Animation
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'translateX(-5px)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'translateX(0)';
    });
});

// Fetch Contact Messages
async function fetchContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// Fetch Quotes
async function fetchQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}
