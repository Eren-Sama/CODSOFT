// NextFlix AI - Optimized Main JavaScript File

class NextFlixApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7; // Updated to 7 steps
        this.preferences = {};
        this.recommendations = [];
        
        this.initializeEventListeners();
        this.createPosterBackground();
    }

    initializeEventListeners() {
        // Start button
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showRecommendationForm();
            });
        }

        // Form navigation
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const form = document.getElementById('preferences-form');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextStep();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevStep();
            });
        }

        // Form submission
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitPreferences();
            });
        }

        // Surprise me button
        const surpriseBtn = document.getElementById('surprise-btn');
        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => {
                this.getSurpriseRecommendations();
            });
        }

        // Back to form button
        const backToFormBtn = document.getElementById('back-to-form');
        if (backToFormBtn) {
            backToFormBtn.addEventListener('click', () => {
                this.showRecommendationForm();
                this.resetForm();
            });
        }

        // Get more recommendations button
        const getMoreBtn = document.getElementById('get-more-btn');
        if (getMoreBtn) {
            getMoreBtn.addEventListener('click', () => {
                this.getSurpriseRecommendations();
            });
        }

        // Content type selection handlers
        this.initializeContentTypeHandlers();
        this.initializeGenreHandlers();
        this.initializeLanguageHandlers();
        this.initializeTimeHandlers();
        this.initializeContextHandlers();

        // Close modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.id === 'detail-modal') {
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    initializeContentTypeHandlers() {
        const contentTypeInputs = document.querySelectorAll('input[name="content_type"]');
        contentTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Remove active class from all cards
                document.querySelectorAll('.content-type-card').forEach(card => {
                    card.classList.remove('active');
                });
                // Add active class to selected card
                if (input.checked) {
                    input.parentElement.querySelector('.content-type-card').classList.add('active');
                }
            });
        });
    }

    initializeGenreHandlers() {
        const genreInputs = document.querySelectorAll('input[name="genres"]');
        genreInputs.forEach(input => {
            input.addEventListener('change', () => {
                const tag = input.parentElement.querySelector('.genre-tag');
                if (input.checked) {
                    tag.classList.add('active');
                } else {
                    tag.classList.remove('active');
                }
            });
        });
    }

    initializeLanguageHandlers() {
        const languageInputs = document.querySelectorAll('input[name="languages"]');
        languageInputs.forEach(input => {
            input.addEventListener('change', () => {
                const tag = input.parentElement.querySelector('.language-tag');
                if (input.checked) {
                    tag.classList.add('active');
                } else {
                    tag.classList.remove('active');
                }
            });
        });
    }

    initializeTimeHandlers() {
        const timeInputs = document.querySelectorAll('input[name="time_availability"]');
        timeInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Remove active class from all cards
                document.querySelectorAll('.time-card').forEach(card => {
                    card.classList.remove('active');
                });
                // Add active class to selected card
                if (input.checked) {
                    input.parentElement.querySelector('.time-card').classList.add('active');
                }
            });
        });
    }

    initializeContextHandlers() {
        const contextInputs = document.querySelectorAll('input[name="viewing_context"]');
        contextInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Remove active class from all tags
                document.querySelectorAll('.context-tag').forEach(tag => {
                    tag.classList.remove('active');
                });
                // Add active class to selected tag
                if (input.checked) {
                    input.parentElement.querySelector('.context-tag').classList.add('active');
                }
            });
        });
    }

    createPosterBackground() {
        // Create modern gradient-based animated background instead of missing images
        const rows = document.querySelectorAll('.poster-row');
        const gradients = [
            'linear-gradient(135deg, #FFD700, #FFA500)',
            'linear-gradient(135deg, #FF8C00, #FFD700)', 
            'linear-gradient(135deg, #FFA500, #FF7F50)',
            'linear-gradient(135deg, #FFD700, #DAA520)',
            'linear-gradient(135deg, #FF6347, #FFD700)',
            'linear-gradient(135deg, #FF4500, #FFA500)',
            'linear-gradient(135deg, #FFB6C1, #FFD700)',
            'linear-gradient(135deg, #DDA0DD, #FFA500)'
        ];

        rows.forEach((row, rowIndex) => {
            for (let i = 0; i < 15; i++) {
                const poster = document.createElement('div');
                poster.className = 'poster-item';
                
                // Use gradient backgrounds instead of missing images
                const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
                poster.style.background = randomGradient;
                poster.style.animationDelay = `${Math.random() * 20}s`;
                
                // Add subtle pattern overlay
                poster.style.backgroundSize = '200% 200%';
                poster.style.animation = `gradientShift 8s ease-in-out infinite, scrollPosters 60s linear infinite`;
                poster.style.animationDelay = `${Math.random() * 8}s, ${Math.random() * 20}s`;
                
                row.appendChild(poster);
            }
        });
    }

    showRecommendationForm() {
        document.getElementById('home').style.display = 'none';
        document.getElementById('recommendation-form').classList.remove('hidden');
        document.getElementById('results').classList.add('hidden');
        
        // Scroll to form
        document.getElementById('recommendation-form').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.hideStep(this.currentStep);
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.updateButtons();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateButtons();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        
        switch (this.currentStep) {
            case 1: // Content Type
                const contentType = currentStepElement.querySelector('input[name="content_type"]:checked');
                if (!contentType) {
                    this.showNotification('Please select what you want to watch', 'error');
                    return false;
                }
                break;
            
            case 2: // Genres
                const genres = currentStepElement.querySelectorAll('input[name="genres"]:checked');
                if (genres.length === 0) {
                    this.showNotification('Please select at least one genre', 'error');
                    return false;
                }
                break;
            
            case 3: // Languages
                const languages = currentStepElement.querySelectorAll('input[name="languages"]:checked');
                if (languages.length === 0) {
                    this.showNotification('Please select at least one language preference', 'error');
                    return false;
                }
                break;
            
            case 4: // Time
                const time = currentStepElement.querySelector('input[name="time_availability"]:checked');
                if (!time) {
                    this.showNotification('Please select your time availability', 'error');
                    return false;
                }
                break;
            
            case 5: // Context
                const context = currentStepElement.querySelector('input[name="viewing_context"]:checked');
                if (!context) {
                    this.showNotification('Please select your viewing context', 'error');
                    return false;
                }
                break;
        }
        
        return true;
    }

    hideStep(stepNumber) {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        if (step) {
            step.classList.remove('active');
            step.style.display = 'none';
        }
    }

    showStep(stepNumber) {
        const step = document.querySelector(`[data-step="${stepNumber}"]`);
        if (step) {
            step.style.display = 'block';
            setTimeout(() => {
                step.classList.add('active');
            }, 50);
        }
    }

    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const currentStepSpan = document.getElementById('current-step');
        
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (currentStepSpan) {
            currentStepSpan.textContent = this.currentStep;
        }
    }

    updateButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentStep === 1;
        }

        if (this.currentStep === this.totalSteps) {
            if (nextBtn) nextBtn.classList.add('hidden');
            if (submitBtn) submitBtn.classList.remove('hidden');
        } else {
            if (nextBtn) nextBtn.classList.remove('hidden');
            if (submitBtn) submitBtn.classList.add('hidden');
        }
    }

    collectFormData() {
        const formData = {};

        // Content Type
        const contentType = document.querySelector('input[name="content_type"]:checked');
        if (contentType) formData.content_type = contentType.value;

        // Genres
        const selectedGenres = Array.from(document.querySelectorAll('input[name="genres"]:checked'))
            .map(input => input.value);
        if (selectedGenres.length > 0) formData.genres = selectedGenres;

        // Languages
        const selectedLanguages = Array.from(document.querySelectorAll('input[name="languages"]:checked'))
            .map(input => input.value);
        if (selectedLanguages.length > 0) formData.languages = selectedLanguages;

        // Time Availability
        const timeAvailability = document.querySelector('input[name="time_availability"]:checked');
        if (timeAvailability) formData.time_availability = timeAvailability.value;

        // Viewing Context
        const viewingContext = document.querySelector('input[name="viewing_context"]:checked');
        if (viewingContext) formData.viewing_context = viewingContext.value;

        // Rating Filter
        const minRating = document.querySelector('select[name="min_rating"]');
        if (minRating && minRating.value !== '0') formData.min_rating = parseFloat(minRating.value);

        // Release Period
        const releasePeriod = document.querySelector('select[name="release_period"]');
        if (releasePeriod && releasePeriod.value !== 'any') formData.release_period = releasePeriod.value;

        // Favorite Movies/Shows
        const favoriteMovies = document.querySelector('input[name="favorite_movies"]');
        if (favoriteMovies && favoriteMovies.value.trim()) {
            formData.favorite_movies = favoriteMovies.value.trim();
        }

        return formData;
    }

    async submitPreferences() {
        try {
            this.preferences = this.collectFormData();
            
            this.showLoadingModal();
            
            const response = await fetch('/get_recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.preferences)
            });

            const data = await response.json();
            
            this.hideLoadingModal();

            if (data.success) {
                this.recommendations = data.recommendations;
                this.displayResults();
            } else {
                this.showNotification('Error getting recommendations: ' + data.error, 'error');
            }
        } catch (error) {
            this.hideLoadingModal();
            this.showNotification('Network error. Please try again.', 'error');
            console.error('Error:', error);
        }
    }

    async getSurpriseRecommendations() {
        try {
            this.showLoadingModal('Getting surprise recommendations...');
            
            const response = await fetch('/surprise_me');
            const data = await response.json();
            
            this.hideLoadingModal();

            if (data.success) {
                this.recommendations = data.recommendations;
                this.displayResults();
            } else {
                this.showNotification('Error getting surprise recommendations: ' + data.error, 'error');
            }
        } catch (error) {
            this.hideLoadingModal();
            this.showNotification('Network error. Please try again.', 'error');
            console.error('Error:', error);
        }
    }

    displayResults() {
        // Hide form and show results
        document.getElementById('recommendation-form').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');
        
        // Separate movies and series
        const movies = this.recommendations.filter(item => item.content_type === 'movie');
        const series = this.recommendations.filter(item => item.content_type === 'series');
        
        // Display movies
        const moviesGrid = document.getElementById('movies-grid');
        const moviesSection = document.getElementById('movies-section');
        
        if (movies.length > 0) {
            moviesSection.style.display = 'block';
            moviesGrid.innerHTML = movies.map(movie => this.createItemCard(movie)).join('');
        } else {
            moviesSection.style.display = 'none';
        }
        
        // Display series
        const seriesGrid = document.getElementById('series-grid');
        const seriesSection = document.getElementById('series-section');
        
        if (series.length > 0) {
            seriesSection.style.display = 'block';
            seriesGrid.innerHTML = series.map(show => this.createItemCard(show)).join('');
        } else {
            seriesSection.style.display = 'none';
        }
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        // Add click handlers to cards
        this.addCardClickHandlers();
    }

    createItemCard(item) {
        const posterUrl = item.poster_path || '/static/images/no-poster.jpg';
        const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
        const year = item.year || 'Unknown';
        const genres = Array.isArray(item.genres) ? item.genres.join(', ') : item.genres || 'Unknown';
        
        let additionalInfo = '';
        if (item.content_type === 'series' && item.seasons) {
            additionalInfo = `<p class="text-sm text-gray-400">${item.seasons} Season${item.seasons !== 1 ? 's' : ''}</p>`;
        }
        
        return `
            <div class="recommendation-card" data-id="${item.id}" data-type="${item.content_type}">
                <div class="card-poster">
                    <img src="${posterUrl}" alt="${item.title}" onerror="this.src='/static/images/no-poster.jpg'">
                    <div class="card-overlay">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        <span class="rating">⭐ ${rating}</span>
                        <span class="year">${year}</span>
                    </div>
                    <p class="card-genres">${genres}</p>
                    ${additionalInfo}
                    ${item.reason ? `<p class="recommendation-reason">${item.reason}</p>` : ''}
                </div>
            </div>
        `;
    }

    addCardClickHandlers() {
        const cards = document.querySelectorAll('.recommendation-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const type = card.dataset.type;
                const item = this.recommendations.find(r => r.id == id && r.content_type === type);
                if (item) {
                    this.showItemDetails(item);
                }
            });
        });
    }

    showItemDetails(item) {
        const modalContent = document.getElementById('modal-content');
        const posterUrl = item.poster_path || '/static/images/no-poster.jpg';
        const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
        const genres = Array.isArray(item.genres) ? item.genres.join(', ') : item.genres || 'Unknown';
        
        let additionalInfo = '';
        if (item.content_type === 'series') {
            if (item.seasons) additionalInfo += `<p><strong>Seasons:</strong> ${item.seasons}</p>`;
            if (item.episodes) additionalInfo += `<p><strong>Episodes:</strong> ${item.episodes}</p>`;
        }
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2 class="text-2xl font-bold text-nextflix-yellow">${item.title}</h2>
                <button onclick="nextflixApp.closeModal()" class="text-white hover:text-nextflix-yellow">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div class="modal-body p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-1">
                        <img src="${posterUrl}" alt="${item.title}" class="w-full rounded-lg" onerror="this.src='/static/images/no-poster.jpg'">
                    </div>
                    <div class="md:col-span-2">
                        <div class="space-y-4">
                            <div class="flex items-center space-x-4">
                                <span class="bg-nextflix-yellow text-black px-3 py-1 rounded-full font-bold">⭐ ${rating}</span>
                                <span class="text-gray-300">${item.year || 'Unknown'}</span>
                                <span class="text-gray-300 capitalize">${item.content_type}</span>
                            </div>
                            <p class="text-gray-300"><strong>Genres:</strong> ${genres}</p>
                            ${additionalInfo}
                            ${item.reason ? `<p class="text-nextflix-yellow"><strong>Why we recommend this:</strong> ${item.reason}</p>` : ''}
                            <p class="text-gray-300">${item.overview || 'No description available.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('detail-modal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('detail-modal').classList.add('hidden');
    }

    showLoadingModal(text = 'Analyzing your preferences...') {
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = text;
        }
        document.getElementById('loading-modal').classList.remove('hidden');
    }

    hideLoadingModal() {
        document.getElementById('loading-modal').classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                ${message}
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    resetForm() {
        this.currentStep = 1;
        this.preferences = {};
        
        // Reset form inputs
        document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
            input.checked = false;
        });
        
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });
        
        // Reset active states
        document.querySelectorAll('.genre-tag, .language-tag, .context-tag, .content-type-card, .time-card').forEach(element => {
            element.classList.remove('active');
        });
        
        // Reset steps
        document.querySelectorAll('.form-step').forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        });
        
        this.updateProgress();
        this.updateButtons();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.nextflixApp = new NextFlixApp();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
