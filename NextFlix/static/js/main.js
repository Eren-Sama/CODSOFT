// NextFlix AI - Ultra Modern JavaScript

class UltraModernNextFlix {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 9;
        this.preferences = {};
        this.recommendations = [];
        this.loadingSteps = [
            "Processing your preferences",
            "Analyzing 10M+ titles", 
            "Crafting perfect matches"
        ];
        this.currentLoadingStep = 0;
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeAnimations();
        this.setupUltraModernEffects();
    }

    initializeEventListeners() {
        // Ultra modern start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerHeroTransition();
                setTimeout(() => this.showRecommendationForm(), 600);
            });
        }

        // Form navigation with ultra smooth transitions
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const form = document.getElementById('preferences-form');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStepWithAnimation();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStepWithAnimation();
            });
        }

        // Ultra modern form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitWithUltraEffects();
            });
        }

        // Enhanced surprise button
        const surpriseBtn = document.getElementById('surprise-btn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSurpriseEffect();
            });
        }

        // Genre selection with ultra effects
        document.addEventListener('change', (e) => {
            if (e.target.name === 'genres') {
                this.triggerGenreSelectionEffect(e.target);
            }
        });

        // Modal handlers
        this.setupModalHandlers();
        
        // Smooth scroll for navigation
        this.setupSmoothNavigation();
    }

    triggerHeroTransition() {
        const hero = document.getElementById('home');
        if (hero) {
            hero.style.transform = 'scale(0.95)';
            hero.style.opacity = '0.7';
            hero.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }

    initializeAnimations() {
        // Staggered fade-in animations for hero elements
        const animatedElements = document.querySelectorAll('.animate-fade-in');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    setupUltraModernEffects() {
        // Parallax scrolling effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.animate-float');
            
            parallaxElements.forEach(el => {
                const speed = 0.5;
                el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.01}deg)`;
            });
        });

        // Enhanced hover effects for cards
        this.setupCardHoverEffects();
    }

    setupCardHoverEffects() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.movie-card')) {
                const card = e.target.closest('.movie-card');
                this.triggerCardGlow(card);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.movie-card')) {
                const card = e.target.closest('.movie-card');
                this.removeCardGlow(card);
            }
        }, true);
    }

    triggerCardGlow(card) {
        card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)';
        card.style.transform = 'translateY(-12px) scale(1.02)';
    }

    removeCardGlow(card) {
        card.style.boxShadow = '';
        card.style.transform = '';
    }

    triggerSurpriseEffect() {
        const btn = document.getElementById('surprise-btn');
        
        // Ultra modern button effect
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.style.transform = '';
                this.generateSurpriseRecommendations();
            }, 150);
        }, 150);
    }

    triggerGenreSelectionEffect(input) {
        const tag = input.nextElementSibling;
        if (input.checked) {
            tag.style.transform = 'scale(1.1)';
            setTimeout(() => {
                tag.style.transform = 'scale(1.05)';
            }, 200);
        }
    }

    showRecommendationForm() {
        const form = document.getElementById('recommendation-form');
        const hero = document.getElementById('home');
        
        if (form && hero) {
            // Ultra smooth transition
            hero.style.opacity = '0';
            hero.style.transform = 'translateY(-50px)';
            
            setTimeout(() => {
                hero.classList.add('hidden');
                form.classList.remove('hidden');
                form.style.opacity = '0';
                form.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    form.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    form.style.opacity = '1';
                    form.style.transform = 'translateY(0)';
                }, 50);
            }, 400);
        }
    }

    nextStepWithAnimation() {
        if (this.currentStep < this.totalSteps) {
            const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            const nextStepEl = document.querySelector(`.form-step[data-step="${this.currentStep + 1}"]`);
            
            if (currentStepEl && nextStepEl) {
                // Ultra smooth slide transition
                currentStepEl.style.transform = 'translateX(-100%)';
                currentStepEl.style.opacity = '0';
                
                setTimeout(() => {
                    currentStepEl.classList.remove('active');
                    nextStepEl.classList.add('active');
                    nextStepEl.style.transform = 'translateX(100%)';
                    nextStepEl.style.opacity = '0';
                    
                    setTimeout(() => {
                        nextStepEl.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        nextStepEl.style.transform = 'translateX(0)';
                        nextStepEl.style.opacity = '1';
                    }, 50);
                }, 300);
                
                this.currentStep++;
                this.updateProgress();
            }
        }
    }

    prevStepWithAnimation() {
        if (this.currentStep > 1) {
            const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            const prevStepEl = document.querySelector(`.form-step[data-step="${this.currentStep - 1}"]`);
            
            if (currentStepEl && prevStepEl) {
                // Ultra smooth slide transition
                currentStepEl.style.transform = 'translateX(100%)';
                currentStepEl.style.opacity = '0';
                
                setTimeout(() => {
                    currentStepEl.classList.remove('active');
                    prevStepEl.classList.add('active');
                    prevStepEl.style.transform = 'translateX(-100%)';
                    prevStepEl.style.opacity = '0';
                    
                    setTimeout(() => {
                        prevStepEl.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        prevStepEl.style.transform = 'translateX(0)';
                        prevStepEl.style.opacity = '1';
                    }, 50);
                }, 300);
                
                this.currentStep--;
                this.updateProgress();
            }
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const currentStepEl = document.getElementById('current-step');
        
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (currentStepEl) {
            currentStepEl.textContent = this.currentStep;
        }
    }

    submitWithUltraEffects() {
        this.collectPreferences();
        this.showUltraLoadingScreen();
        this.generateRecommendations();
    }

    showUltraLoadingScreen() {
        const loading = document.getElementById('loading');
        const form = document.getElementById('recommendation-form');
        
        if (loading && form) {
            form.style.opacity = '0';
            form.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                form.classList.add('hidden');
                loading.classList.remove('hidden');
                loading.style.opacity = '0';
                
                setTimeout(() => {
                    loading.style.transition = 'opacity 0.8s ease';
                    loading.style.opacity = '1';
                    this.animateLoadingSteps();
                }, 50);
            }, 400);
        }
    }

    animateLoadingSteps() {
        this.currentLoadingStep = 0;
        
        const animateStep = () => {
            if (this.currentLoadingStep < this.loadingSteps.length) {
                const stepEl = document.getElementById(`step-${this.currentLoadingStep + 1}`);
                if (stepEl) {
                    stepEl.classList.add('loading-step', 'active');
                    stepEl.style.color = '#FFD700';
                    stepEl.querySelector('.w-4').style.background = '#FFD700';
                }
                
                this.currentLoadingStep++;
                setTimeout(animateStep, 1500);
            }
        };
        
        animateStep();
    }

    async generateRecommendations() {
        try {
            const response = await fetch('/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.preferences)
            });

            if (response.ok) {
                const data = await response.json();
                this.recommendations = data.recommendations || [];
                
                setTimeout(() => {
                    this.showUltraRecommendations();
                }, 3000);
            } else {
                console.error('Failed to get recommendations');
                this.showErrorState();
            }
        } catch (error) {
            console.error('Error:', error);
            this.showErrorState();
        }
    }

    showUltraRecommendations() {
        const loading = document.getElementById('loading');
        const recommendations = document.getElementById('recommendations');
        
        if (loading && recommendations) {
            loading.style.opacity = '0';
            
            setTimeout(() => {
                loading.classList.add('hidden');
                recommendations.classList.remove('hidden');
                recommendations.style.opacity = '0';
                recommendations.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    recommendations.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    recommendations.style.opacity = '1';
                    recommendations.style.transform = 'translateY(0)';
                    
                    this.renderUltraRecommendations();
                }, 50);
            }, 500);
        }
    }

    renderUltraRecommendations() {
        const grid = document.getElementById('recommendations-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.recommendations.forEach((movie, index) => {
            const card = this.createUltraMovieCard(movie);
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            grid.appendChild(card);
            
            // Staggered animation
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createUltraMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card ultra-shadow';
        
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/static/images/no-poster.jpg';
            
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-overview">${movie.overview || 'No description available.'}</p>
                <div class="movie-meta">
                    <div class="movie-rating">
                        <i class="fas fa-star mr-1"></i>
                        ${movie.vote_average || 'N/A'}
                    </div>
                    <div class="movie-year">${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</div>
                </div>
                <div class="movie-actions">
                    <button class="btn-primary" onclick="app.showMovieDetails(${movie.id})">
                        <i class="fas fa-info-circle mr-2"></i>Details
                    </button>
                    <button class="btn-secondary" onclick="app.addToWatchlist(${movie.id})">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    collectPreferences() {
        const form = document.getElementById('preferences-form');
        if (!form) return;

        const formData = new FormData(form);
        this.preferences = {};

        // Collect all form data
        for (let [key, value] of formData.entries()) {
            if (this.preferences[key]) {
                if (Array.isArray(this.preferences[key])) {
                    this.preferences[key].push(value);
                } else {
                    this.preferences[key] = [this.preferences[key], value];
                }
            } else {
                this.preferences[key] = value;
            }
        }
    }

    setupModalHandlers() {
        const modal = document.getElementById('content-modal');
        const closeBtn = document.getElementById('close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    closeModal() {
        const modal = document.getElementById('content-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }

    setupSmoothNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    showErrorState() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="text-center">
                    <div class="text-6xl mb-6">⚠️</div>
                    <h2 class="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h2>
                    <p class="text-xl text-gray-400 mb-8">Please try again in a moment</p>
                    <button onclick="location.reload()" class="bg-ultra-gradient text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    generateSurpriseRecommendations() {
        // Generate random preferences for surprise mode
        this.preferences = {
            genres: ['action', 'comedy', 'drama'][Math.floor(Math.random() * 3)],
            mood: 'adventurous',
            content_type: 'movie'
        };
        
        this.showUltraLoadingScreen();
        this.generateRecommendations();
    }
}

// Initialize the ultra modern app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new UltraModernNextFlix();
});

// Export for global access
window.NextFlixApp = UltraModernNextFlix;
            surpriseBtn.addEventListener('click', () => {
                this.getSurpriseRecommendations();
            });
        }

        // Get more recommendations button
        const getMoreBtn = document.getElementById('get-more-btn');
        if (getMoreBtn) {
            getMoreBtn.addEventListener('click', () => {
                this.getMoreRecommendations();
            });
        }

        // Modal close
        const closeModal = document.getElementById('close-modal');
        const modal = document.getElementById('content-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    createPosterBackground() {
        // Create poster elements for the animated background
        const posterRows = document.querySelectorAll('.poster-row');
        const posterImages = this.generatePosterUrls();

        posterRows.forEach((row, rowIndex) => {
            for (let i = 0; i < 20; i++) {
                const poster = document.createElement('div');
                poster.className = 'poster-item';
                poster.style.cssText = `
                    width: 150px;
                    height: 200px;
                    margin-right: 20px;
                    background: linear-gradient(45deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
                    border-radius: 8px;
                    flex-shrink: 0;
                    opacity: 0.3;
                    border: 1px solid rgba(255, 215, 0, 0.2);
                `;
                row.appendChild(poster);
            }
        });
    }

    generatePosterUrls() {
        // Generate placeholder poster URLs
        const posters = [];
        for (let i = 1; i <= 100; i++) {
            posters.push(`/static/posters/poster_${i}.jpg`);
        }
        return this.shuffleArray(posters);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showRecommendationForm() {
        const heroSection = document.querySelector('#home');
        const formSection = document.getElementById('recommendation-form');
        
        if (heroSection && formSection) {
            heroSection.style.transform = 'translateY(-100px)';
            heroSection.style.opacity = '0';
            
            setTimeout(() => {
                heroSection.style.display = 'none';
                formSection.classList.remove('hidden');
                formSection.style.animation = 'fadeInUp 0.6s ease-out';
            }, 300);
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.hideCurrentStep();
            this.currentStep++;
            this.showCurrentStep();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.hideCurrentStep();
            this.currentStep--;
            this.showCurrentStep();
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }

    hideCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
        }
    }

    showCurrentStep() {
        const nextStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (nextStepElement) {
            setTimeout(() => {
                nextStepElement.classList.add('active');
            }, 150);
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const currentStepSpan = document.getElementById('current-step');
        
        if (progressFill) {
            const progressPercent = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (currentStepSpan) {
            currentStepSpan.textContent = this.currentStep;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) {
            if (this.currentStep === 1) {
                prevBtn.classList.add('hidden');
            } else {
                prevBtn.classList.remove('hidden');
            }
        }

        if (nextBtn && submitBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.classList.add('hidden');
                submitBtn.classList.remove('hidden');
            } else {
                nextBtn.classList.remove('hidden');
                submitBtn.classList.add('hidden');
            }
        }
    }

    collectFormData() {
        const formData = new FormData(document.getElementById('preferences-form'));
        const preferences = {};

        // Collect multiple selections (genres, content filters)
        const genres = [];
        const contentFilters = [];

        formData.forEach((value, key) => {
            if (key === 'genres') {
                genres.push(value);
            } else if (key === 'content_filters') {
                contentFilters.push(value);
            } else {
                preferences[key] = value;
            }
        });

        preferences.genres = genres;
        preferences.content_filters = contentFilters;

        return preferences;
    }

    async submitPreferences() {
        this.preferences = this.collectFormData();
        this.showLoading();
        
        try {
            const response = await fetch('/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.preferences)
            });

            const data = await response.json();

            if (data.success) {
                this.recommendations = data.recommendations;
                this.showRecommendations();
            } else {
                this.showError('Failed to get recommendations: ' + data.error);
            }
        } catch (error) {
            this.showError('Network error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    async getSurpriseRecommendations() {
        this.showLoading();
        
        try {
            const response = await fetch('/surprise_me');
            const data = await response.json();

            if (data.success) {
                this.recommendations = data.recommendations;
                this.showRecommendations();
            } else {
                this.showError('Failed to get surprise recommendations');
            }
        } catch (error) {
            this.showError('Network error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    async getMoreRecommendations() {
        if (Object.keys(this.preferences).length === 0) {
            // If no preferences set, get surprise recommendations
            this.getSurpriseRecommendations();
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch('/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.preferences)
            });

            const data = await response.json();

            if (data.success) {
                // Add new recommendations to existing ones
                this.recommendations = [...this.recommendations, ...data.recommendations];
                this.displayRecommendations();
                this.hideLoading();
            } else {
                this.showError('Failed to get more recommendations');
            }
        } catch (error) {
            this.showError('Network error occurred. Please try again.');
            console.error('Error:', error);
        }
    }

    showLoading() {
        const formSection = document.getElementById('recommendation-form');
        const loadingSection = document.getElementById('loading-section');
        const recommendationsSection = document.getElementById('recommendations');

        if (formSection) {
            formSection.classList.add('hidden');
        }
        if (recommendationsSection) {
            recommendationsSection.classList.add('hidden');
        }
        if (loadingSection) {
            loadingSection.classList.remove('hidden');
            this.animateLoadingText();
        }
    }

    hideLoading() {
        const loadingSection = document.getElementById('loading-section');
        if (loadingSection) {
            loadingSection.classList.add('hidden');
        }
    }

    animateLoadingText() {
        const loadingTexts = [
            "Processing your movie tastes with advanced algorithms...",
            "Analyzing thousands of movies and series...",
            "Finding your perfect matches...",
            "Calculating compatibility scores...",
            "Almost ready with your personalized recommendations..."
        ];

        const loadingTextElement = document.getElementById('loading-text');
        let textIndex = 0;

        const textInterval = setInterval(() => {
            if (loadingTextElement && !document.getElementById('loading-section').classList.contains('hidden')) {
                loadingTextElement.style.opacity = '0';
                setTimeout(() => {
                    loadingTextElement.textContent = loadingTexts[textIndex];
                    loadingTextElement.style.opacity = '1';
                    textIndex = (textIndex + 1) % loadingTexts.length;
                }, 300);
            } else {
                clearInterval(textInterval);
            }
        }, 2000);
    }

    showRecommendations() {
        this.hideLoading();
        const recommendationsSection = document.getElementById('recommendations');
        
        if (recommendationsSection) {
            recommendationsSection.classList.remove('hidden');
            this.displayRecommendations();
            
            // Scroll to recommendations
            setTimeout(() => {
                recommendationsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }

    displayRecommendations() {
        const grid = document.getElementById('recommendations-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.recommendations.forEach((item, index) => {
            const card = this.createRecommendationCard(item, index);
            grid.appendChild(card);
        });

        // Add stagger animation
        setTimeout(() => {
            document.querySelectorAll('.recommendation-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    createRecommendationCard(item, index) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.style.cssText = 'opacity: 0; transform: translateY(20px); transition: all 0.5s ease;';

        const posterUrl = item.poster_path ? 
            `https://image.tmdb.org/t/p/w500${item.poster_path}` : 
            '/static/images/placeholder-poster.jpg';

        card.innerHTML = `
            <div class="card-poster">
                <img src="${posterUrl}" 
                     alt="${item.title}" 
                     onerror="this.src='/static/images/placeholder-poster.jpg'">
                <div class="card-overlay">
                    <button class="bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300 w-full">
                        <i class="fas fa-info-circle mr-2"></i>More Info
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-info">
                    <div class="card-rating">
                        <i class="fas fa-star"></i>
                        <span>${item.vote_average.toFixed(1)}</span>
                    </div>
                    <span>${item.year || 'N/A'}</span>
                    <span class="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        ${item.content_type.toUpperCase()}
                    </span>
                </div>
                <p class="card-description">${item.overview}</p>
                <div class="card-genres">
                    ${item.genres.split(',').slice(0, 3).map(genre => 
                        `<span class="genre-pill">${genre.trim()}</span>`
                    ).join('')}
                </div>
                <div class="card-reason">${item.reason}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.showModal(item);
        });

        return card;
    }

    showModal(item) {
        const modal = document.getElementById('content-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (!modal || !modalContent) return;

        const posterUrl = item.poster_path ? 
            `https://image.tmdb.org/t/p/w500${item.poster_path}` : 
            '/static/images/placeholder-poster.jpg';

        modalContent.innerHTML = `
            <div class="relative">
                <div class="aspect-video bg-gradient-to-r from-nextflix-dark to-gray-900 rounded-t-2xl overflow-hidden relative">
                    <img src="${posterUrl}" 
                         alt="${item.title}" 
                         class="w-full h-full object-cover opacity-30">
                    <div class="absolute inset-0 bg-gradient-to-t from-nextflix-dark via-transparent to-transparent"></div>
                    <div class="absolute bottom-8 left-8 right-8">
                        <h2 class="text-4xl font-bold mb-4 text-white">${item.title}</h2>
                        <div class="flex items-center space-x-4 text-gray-300 flex-wrap">
                            <div class="flex items-center">
                                <i class="fas fa-star text-yellow-400 mr-1"></i>
                                <span>${item.vote_average.toFixed(1)}/10</span>
                            </div>
                            ${item.year ? `<span>${item.year}</span>` : ''}
                            ${item.runtime ? `<span>${item.runtime} min</span>` : ''}
                            ${item.seasons ? `<span>${item.seasons} season${item.seasons > 1 ? 's' : ''}</span>` : ''}
                            <span class="bg-nextflix-yellow text-black px-3 py-1 rounded-full text-sm font-bold">
                                ${item.content_type.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="p-8">
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="md:col-span-2">
                            <h3 class="text-xl font-bold mb-3 text-nextflix-yellow">Overview</h3>
                            <p class="text-gray-300 leading-relaxed mb-6">${item.overview}</p>
                            
                            <h4 class="text-lg font-semibold mb-3 text-nextflix-yellow">Why We Recommend This</h4>
                            <p class="text-gray-300 italic">${item.reason}</p>
                            
                            <div class="mt-6">
                                <h4 class="text-lg font-semibold mb-3 text-nextflix-yellow">Genres</h4>
                                <div class="flex flex-wrap gap-2">
                                    ${item.genres.split(',').map(genre => 
                                        `<span class="bg-nextflix-yellow text-black px-3 py-1 rounded-full text-sm font-semibold">${genre.trim()}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-bold mb-3 text-nextflix-yellow">Details</h3>
                            <div class="space-y-3 text-gray-300">
                                <div><strong class="text-white">Type:</strong> ${item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}</div>
                                <div><strong class="text-white">Rating:</strong> ${item.vote_average.toFixed(1)}/10</div>
                                ${item.year ? `<div><strong class="text-white">Year:</strong> ${item.year}</div>` : ''}
                                ${item.runtime ? `<div><strong class="text-white">Runtime:</strong> ${item.runtime} minutes</div>` : ''}
                                ${item.seasons ? `<div><strong class="text-white">Seasons:</strong> ${item.seasons}</div>` : ''}
                                ${item.episodes ? `<div><strong class="text-white">Episodes:</strong> ${item.episodes}</div>` : ''}
                            </div>
                            
                            <div class="mt-6 space-y-3">
                                <button class="w-full bg-nextflix-yellow text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300">
                                    <i class="fas fa-play mr-2"></i>Watch Now
                                </button>
                                <button class="w-full bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-300">
                                    <i class="fas fa-plus mr-2"></i>Add to Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('content-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = 'auto';
        }
    }

    showError(message) {
        this.hideLoading();
        
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-3"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nextFlixApp = new NextFlixApp();
});

// Utility functions for smooth animations
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.opacity = Math.min(progress / duration, 1);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        element.style.opacity = Math.max(1 - (progress / duration), 0);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Add loading states for better UX
function showLoadingState(element) {
    element.classList.add('skeleton');
    element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
    element.classList.remove('skeleton');
    element.style.pointerEvents = 'auto';
}
