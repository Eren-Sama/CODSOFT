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

        // Enhanced surprise button
        const surpriseBtn = document.getElementById('surprise-btn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSurpriseEffect();
            });
        }

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

    showRecommendationForm() {
        const form = document.getElementById('recommendation-form');
        const hero = document.getElementById('home');
        
        if (form && hero) {
            // Show content type selection first
            this.showContentTypeSelection();
        }
    }

    showContentTypeSelection() {
        const hero = document.getElementById('home');
        
        // Create content type selection overlay
        const overlay = document.createElement('div');
        overlay.id = 'content-type-overlay';
        overlay.className = 'fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center';
        
        overlay.innerHTML = `
            <div class="glass-morphism rounded-3xl p-12 max-w-2xl mx-8 border border-ultra-gold/20 ultra-shadow">
                <div class="text-center mb-8">
                    <div class="text-5xl mb-4">🎬</div>
                    <h2 class="text-3xl font-bold text-white mb-4">What would you like to discover?</h2>
                    <p class="text-gray-400 text-lg">Choose your entertainment preference</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <button class="content-type-btn group bg-ultra-gradient text-black p-8 rounded-2xl hover:scale-105 transition-all duration-300" data-type="movie">
                        <div class="text-4xl mb-3">🎥</div>
                        <div class="text-xl font-bold mb-2">Movies</div>
                        <div class="text-sm opacity-80">Epic stories, blockbusters, classics</div>
                    </button>
                    
                    <button class="content-type-btn group glass-morphism text-white p-8 rounded-2xl border border-gray-600 hover:border-ultra-gold hover:scale-105 transition-all duration-300" data-type="tv">
                        <div class="text-4xl mb-3">📺</div>
                        <div class="text-xl font-bold mb-2">TV Series</div>
                        <div class="text-sm opacity-80">Binge-worthy shows, episodes</div>
                    </button>
                </div>
                
                <button class="content-type-btn w-full glass-morphism text-white p-6 rounded-2xl border border-gray-600 hover:border-ultra-gold hover:scale-102 transition-all duration-300" data-type="both">
                    <div class="text-2xl mb-2">🎭</div>
                    <div class="text-lg font-bold mb-1">Surprise Me!</div>
                    <div class="text-sm opacity-80">Mix of movies and series</div>
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners
        overlay.querySelectorAll('.content-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contentType = e.currentTarget.dataset.type;
                this.preferences.content_type = contentType === 'both' ? 'movie' : contentType;
                
                if (contentType === 'both') {
                    // Go straight to surprise recommendations
                    this.generateSurpriseRecommendations();
                } else {
                    // Continue to form
                    this.continueToForm();
                }
                
                document.body.removeChild(overlay);
            });
        });
    }

    continueToForm() {
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

    showUltraLoadingScreen() {
        const loading = document.getElementById('loading');
        const form = document.getElementById('recommendation-form');
        
        if (loading && form) {
            form.style.opacity = '0';
            form.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                form.classList.add('hidden');
                loading.classList.remove('hidden');
                
                setTimeout(() => {
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
                    stepEl.style.color = '#FFD700';
                    const indicator = stepEl.querySelector('.w-4');
                    if (indicator) {
                        indicator.style.background = '#FFD700';
                    }
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
            : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iMzc1IiBmaWxsPSIjRkZENzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iSW50ZXIiPk5vIFBvc3RlcjwvdGV4dD4KPC9zdmc+';
            
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

    showMovieDetails(movieId) {
        const movie = this.recommendations.find(m => m.id === movieId);
        if (!movie) return;

        const modal = document.getElementById('content-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalContent) {
            const posterUrl = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzgwIiBoZWlnaHQ9IjExNzAiIHZpZXdCb3g9IjAgMCA3ODAgMTE3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijc4MCIgaGVpZ2h0PSIxMTcwIiBmaWxsPSIjMUExQTFBIi8+Cjx0ZXh0IHg9IjM5MCIgeT0iNTg1IiBmaWxsPSIjRkZENzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjM2IiBmb250LWZhbWlseT0iSW50ZXIiPk5vIFBvc3RlcjwvdGV4dD4KPC9zdmc+';
                
            modalContent.innerHTML = `
                <div class="flex flex-col lg:flex-row gap-8">
                    <div class="lg:w-1/3">
                        <img src="${posterUrl}" alt="${movie.title}" class="w-full rounded-2xl ultra-shadow">
                    </div>
                    <div class="lg:w-2/3">
                        <h2 class="text-4xl font-bold text-white mb-4">${movie.title}</h2>
                        <div class="flex items-center space-x-6 mb-6">
                            <div class="flex items-center text-ultra-gold">
                                <i class="fas fa-star mr-2"></i>
                                <span class="text-xl font-bold">${movie.vote_average || 'N/A'}</span>
                            </div>
                            <div class="text-gray-300">
                                <i class="fas fa-calendar mr-2"></i>
                                ${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
                            </div>
                        </div>
                        <p class="text-gray-300 text-lg leading-relaxed mb-8">${movie.overview || 'No description available.'}</p>
                        <div class="flex gap-4">
                            <button class="btn-primary px-8 py-4 text-lg">
                                <i class="fas fa-play mr-2"></i>Watch Now
                            </button>
                            <button class="btn-secondary px-8 py-4 text-lg" onclick="app.addToWatchlist(${movie.id})">
                                <i class="fas fa-bookmark mr-2"></i>Add to Watchlist
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.transition = 'opacity 0.3s ease';
                modal.style.opacity = '1';
            }, 50);
        }
    }

    addToWatchlist(movieId) {
        console.log(`Added movie ${movieId} to watchlist`);
        this.showNotification('Added to watchlist!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 glass-morphism px-6 py-4 rounded-2xl border ${
            type === 'success' ? 'border-green-500' : 'border-ultra-gold'
        } ultra-shadow transition-all duration-300`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas ${type === 'success' ? 'fa-check' : 'fa-info'} ${
                    type === 'success' ? 'text-green-400' : 'text-ultra-gold'
                }"></i>
                <span class="text-white font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
                <div class="h-full flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-6xl mb-6">⚠️</div>
                        <h2 class="text-3xl font-bold text-white mb-4">Oops! Something went wrong</h2>
                        <p class="text-xl text-gray-400 mb-8">Please try again in a moment</p>
                        <button onclick="location.reload()" class="bg-ultra-gradient text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                            Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    }

    generateSurpriseRecommendations() {
        // Set random preferences for surprise mode
        this.preferences = {
            content_type: Math.random() > 0.5 ? 'movie' : 'tv',
            genres: ['action', 'comedy', 'drama'][Math.floor(Math.random() * 3)],
            mood: 'adventurous'
        };
        
        this.showUltraLoadingScreen();
        
        // Call the surprise_me endpoint
        fetch('/surprise_me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.recommendations = data.recommendations || [];
                setTimeout(() => {
                    this.showUltraRecommendations();
                }, 2000);
            } else {
                console.error('Surprise recommendations failed:', data.error);
                this.showErrorState();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showErrorState();
        });
    }
}

// Initialize the ultra modern app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new UltraModernNextFlix();
});

// Export for global access
window.NextFlixApp = UltraModernNextFlix;
