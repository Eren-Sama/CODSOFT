// NextFlix AI - Ultra Modern JavaScript (Performance Optimized)

// Performance-optimized app state with better memory management
class NextFlixApp {
    constructor() {
        this.state = {
            currentStep: 1,
            totalSteps: 7,
            contentType: '',
            selectedGenres: new Set(),
            preferences: new Map(),
            isLoading: false,
            cache: new Map()
        };
        
        this.elements = {};
        this.observers = [];
        this.debounceTimers = new Map();
        
        this.init();
    }

    // Initialize application
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.updateUI();
        
        console.log('NextFlix AI Ultra Modern - Initialized');
    }

    // Cache DOM elements for better performance
    cacheElements() {
        const selectors = {
            startBtn: '#startBtn',
            recommendationSection: '#recommendation-section',
            form: '#recommendationForm',
            prevBtn: '#prevBtn',
            nextBtn: '#nextBtn',
            submitBtn: '#submitBtn',
            progressFill: '#progressFill',
            progressText: '#progressText',
            resultsSection: '#resultsSection',
            loadingContainer: '#loadingContainer',
            resultsGrid: '#resultsGrid',
            tryAgainBtn: '#tryAgainBtn',
            notification: '#notification',
            notificationText: '#notificationText',
            genreContainer: '#genreContainer',
            minRating: '#minRating',
            ratingValue: '#ratingValue',
            resultCount: '#resultCount'
        };

        Object.entries(selectors).forEach(([key, selector]) => {
            this.elements[key] = document.querySelector(selector);
        });
    }

    // Bind events with performance optimization
    bindEvents() {
        // Start button
        this.addEventListenerSafe('startBtn', 'click', () => this.showRecommendationSection());

        // Navigation
        this.addEventListenerSafe('prevBtn', 'click', () => this.navigateStep(-1));
        this.addEventListenerSafe('nextBtn', 'click', () => this.navigateStep(1));
        this.addEventListenerSafe('submitBtn', 'click', () => this.handleSubmit());
        this.addEventListenerSafe('tryAgainBtn', 'click', () => this.resetForm());

        // Content type selection (delegated event)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.content-type-card')) {
                const type = e.target.closest('.content-type-card').dataset.type;
                this.selectContentType(type);
            }
        });

        // Generic tag selection (delegated event)
        document.addEventListener('click', (e) => {
            const tag = e.target.closest('.premium-tag');
            if (tag) {
                this.handleTagSelection(tag);
            }
        });

        // Rating slider with debouncing
        this.addEventListenerSafe('minRating', 'input', 
            this.debounce((e) => this.updateRatingDisplay(e.target.value), 100)
        );

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Optimize scrolling
        this.addScrollOptimization();
    }

    // Safe event listener addition
    addEventListenerSafe(elementKey, event, handler) {
        if (this.elements[elementKey]) {
            this.elements[elementKey].addEventListener(event, handler);
        }
    }

    // Debounce utility for performance
    debounce(func, wait) {
        return (...args) => {
            const key = func.toString();
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(() => func.apply(this, args), wait));
        };
    }

    // Show recommendation section with smooth animation
    showRecommendationSection() {
        this.elements.recommendationSection.style.display = 'block';
        requestAnimationFrame(() => {
            this.elements.recommendationSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Content type selection with auto-advance
    selectContentType(type) {
        this.state.contentType = type;
        
        // Update UI efficiently
        this.updateContentTypeCards(type);
        this.generateGenreOptions(type);
        
        // Auto-advance with slight delay for UX
        setTimeout(() => this.navigateStep(1), 600);
    }

    // Update content type cards efficiently
    updateContentTypeCards(selectedType) {
        const cards = document.querySelectorAll('.content-type-card');
        cards.forEach(card => {
            const isSelected = card.dataset.type === selectedType;
            card.classList.toggle('active', isSelected);
        });
    }

    // Generate genre options with virtual DOM approach
    generateGenreOptions(contentType) {
        const genres = this.getGenresForContentType(contentType);
        const container = this.elements.genreContainer;
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        genres.forEach(genre => {
            const tag = document.createElement('div');
            tag.className = 'premium-tag';
            tag.dataset.genre = genre;
            tag.textContent = genre;
            fragment.appendChild(tag);
        });
        
        // Replace content in one operation
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    // Get genres based on content type
    getGenresForContentType(contentType) {
        const genreMappings = {
            movie: [
                'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
                'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music',
                'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
            ],
            tv: [
                'Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
                'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality', 
                'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western'
            ]
        };
        
        return genreMappings[contentType] || genreMappings.movie;
    }

    // Handle tag selection with smart logic
    handleTagSelection(tag) {
        if (tag.dataset.genre) {
            this.toggleGenre(tag);
        } else {
            this.selectSingleOption(tag);
        }
    }

    // Toggle genre selection (multiple)
    toggleGenre(tag) {
        const genre = tag.dataset.genre;
        const isSelected = this.state.selectedGenres.has(genre);
        
        if (isSelected) {
            this.state.selectedGenres.delete(genre);
            tag.classList.remove('active');
        } else if (this.state.selectedGenres.size < 5) {
            this.state.selectedGenres.add(genre);
            tag.classList.add('active');
        } else {
            this.showNotification('You can select up to 5 genres only', 'error');
            return;
        }
    }

    // Select single option
    selectSingleOption(tag) {
        const dataType = this.getDataType(tag);
        if (!dataType) return;
        
        // Remove active from siblings efficiently
        const siblings = tag.parentElement.querySelectorAll('.premium-tag');
        siblings.forEach(sibling => sibling.classList.remove('active'));
        
        // Add active to selected
        tag.classList.add('active');
        
        // Store preference
        this.state.preferences.set(dataType.type, dataType.value);
    }

    // Get data type from tag attributes
    getDataType(tag) {
        const dataTypes = ['mood', 'time', 'rating', 'era'];
        for (const type of dataTypes) {
            if (tag.dataset[type]) {
                return { type, value: tag.dataset[type] };
            }
        }
        return null;
    }

    // Navigation with validation
    navigateStep(direction) {
        const newStep = this.state.currentStep + direction;
        
        if (newStep < 1 || newStep > this.state.totalSteps) return;
        
        // Validate if moving forward
        if (direction > 0 && !this.validateCurrentStep()) return;
        
        this.performStepTransition(newStep);
    }

    // Perform smooth step transition
    performStepTransition(newStep) {
        const currentStepEl = document.getElementById(`step${this.state.currentStep}`);
        const newStepEl = document.getElementById(`step${newStep}`);
        
        // Hide current step
        currentStepEl.classList.remove('active');
        
        // Update state
        this.state.currentStep = newStep;
        
        // Show new step with delay for smooth transition
        requestAnimationFrame(() => {
            setTimeout(() => {
                newStepEl.classList.add('active');
            }, 150);
        });
        
        this.updateUI();
    }

    // Comprehensive validation
    validateCurrentStep() {
        const validations = {
            1: () => this.state.contentType ? null : 'Please select a content type',
            2: () => this.state.selectedGenres.size > 0 ? null : 'Please select at least one genre',
            3: () => this.state.preferences.has('mood') ? null : 'Please select your current mood',
            4: () => this.state.preferences.has('time') ? null : 'Please select your time preference',
            5: () => this.state.preferences.has('rating') ? null : 'Please select a rating preference',
            6: () => this.state.preferences.has('era') ? null : 'Please select an era preference'
        };
        
        const validator = validations[this.state.currentStep];
        if (validator) {
            const error = validator();
            if (error) {
                this.showNotification(error, 'error');
                return false;
            }
        }
        
        return true;
    }

    // Update UI elements
    updateUI() {
        this.updateProgress();
        this.updateNavigationButtons();
    }

    // Update progress bar with animation
    updateProgress() {
        const percentage = (this.state.currentStep / this.state.totalSteps) * 100;
        
        requestAnimationFrame(() => {
            this.elements.progressFill.style.width = `${percentage}%`;
            this.elements.progressText.textContent = `Step ${this.state.currentStep} of ${this.state.totalSteps}`;
        });
    }

    // Update navigation buttons
    updateNavigationButtons() {
        const showPrev = this.state.currentStep > 1;
        const showNext = this.state.currentStep < this.state.totalSteps;
        const showSubmit = this.state.currentStep === this.state.totalSteps;
        
        this.elements.prevBtn.style.display = showPrev ? 'block' : 'none';
        this.elements.nextBtn.style.display = showNext ? 'block' : 'none';
        this.elements.submitBtn.style.display = showSubmit ? 'block' : 'none';
    }

    // Update rating display
    updateRatingDisplay(value) {
        this.elements.ratingValue.textContent = value;
    }

    // Handle form submission with error handling
    async handleSubmit() {
        if (!this.validateCurrentStep() || this.state.isLoading) return;
        
        this.state.isLoading = true;
        this.showResultsSection();
        
        try {
            const recommendations = await this.fetchRecommendations();
            this.displayResults(recommendations);
            this.showNotification('Recommendations generated successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showNotification(`Error: ${error.message}`, 'error');
            this.elements.tryAgainBtn.style.display = 'block';
        } finally {
            this.state.isLoading = false;
            this.elements.loadingContainer.style.display = 'none';
        }
    }

    // Show results section
    showResultsSection() {
        this.elements.resultsSection.style.display = 'block';
        this.elements.loadingContainer.style.display = 'block';
        this.elements.resultsGrid.style.display = 'none';
        this.elements.tryAgainBtn.style.display = 'none';
        
        requestAnimationFrame(() => {
            this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Fetch recommendations with retry logic
    async fetchRecommendations() {
        const formData = this.buildFormData();
        
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data.recommendations;
    }

    // Build form data from state
    buildFormData() {
        return {
            content_type: this.state.contentType,
            genres: Array.from(this.state.selectedGenres),
            mood: this.state.preferences.get('mood'),
            time_preference: this.state.preferences.get('time'),
            rating_preference: this.state.preferences.get('rating'),
            era_preference: this.state.preferences.get('era'),
            min_rating: parseFloat(this.elements.minRating.value),
            result_count: parseInt(this.elements.resultCount.value)
        };
    }

    // Display results with optimization
    displayResults(recommendations) {
        if (!recommendations || recommendations.length === 0) {
            this.showEmptyResults();
            return;
        }
        
        this.renderRecommendations(recommendations);
        this.elements.resultsGrid.style.display = 'grid';
        this.elements.tryAgainBtn.style.display = 'block';
        
        // Trigger animations
        setTimeout(() => this.observeAnimations(), 100);
    }

    // Show empty results
    showEmptyResults() {
        this.elements.resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-search text-6xl text-gray-600 mb-4"></i>
                <h3 class="text-2xl font-semibold mb-2">No recommendations found</h3>
                <p class="text-gray-400">Try adjusting your preferences</p>
            </div>
        `;
        this.elements.resultsGrid.style.display = 'block';
        this.elements.tryAgainBtn.style.display = 'block';
    }

    // Render recommendations efficiently
    renderRecommendations(recommendations) {
        const fragment = document.createDocumentFragment();
        
        recommendations.forEach(item => {
            const card = this.createRecommendationCard(item);
            fragment.appendChild(card);
        });
        
        this.elements.resultsGrid.innerHTML = '';
        this.elements.resultsGrid.appendChild(fragment);
    }

    // Create recommendation card element
    createRecommendationCard(item) {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        const posterUrl = item.poster_path 
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : '/static/images/placeholder.jpg';
        
        card.innerHTML = `
            <div class="card-poster">
                <img src="${posterUrl}" alt="${this.escapeHtml(item.title)}" 
                     onerror="this.src='/static/images/placeholder.jpg'; this.onerror=null;"
                     loading="lazy">
                <div class="card-overlay">
                    <button class="play-btn" onclick="window.open('https://www.themoviedb.org/${this.state.contentType}/${item.id}', '_blank')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${this.escapeHtml(item.title)}</h3>
                <div class="card-meta">
                    <span class="rating">⭐ ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                    <span class="text-gray-400">${item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}</span>
                </div>
                <p class="text-gray-400 text-sm line-clamp-3">${this.escapeHtml(item.overview || 'No description available.')}</p>
            </div>
        `;
        
        return card;
    }

    // Escape HTML for security
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Reset form to initial state
    resetForm() {
        // Reset state
        this.state.currentStep = 1;
        this.state.contentType = '';
        this.state.selectedGenres.clear();
        this.state.preferences.clear();
        this.state.isLoading = false;
        
        // Reset UI
        this.resetUIElements();
        this.updateUI();
        
        // Hide results and scroll to form
        this.elements.resultsSection.style.display = 'none';
        requestAnimationFrame(() => {
            this.elements.recommendationSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Reset UI elements
    resetUIElements() {
        // Reset form steps
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        
        // Reset active states
        document.querySelectorAll('.content-type-card, .premium-tag').forEach(el => {
            el.classList.remove('active');
        });
        
        // Reset form inputs
        this.elements.minRating.value = 6;
        this.elements.ratingValue.textContent = 6;
        this.elements.resultCount.value = 10;
    }

    // Handle keyboard shortcuts
    handleKeyboard(e) {
        if (e.key === 'Enter' && !this.state.isLoading) {
            e.preventDefault();
            if (this.state.currentStep < this.state.totalSteps) {
                this.navigateStep(1);
            } else {
                this.handleSubmit();
            }
        }
        
        if (e.key === 'Escape') {
            e.preventDefault();
            this.resetForm();
        }
        
        if (e.key === 'ArrowLeft' && this.state.currentStep > 1) {
            e.preventDefault();
            this.navigateStep(-1);
        }
        
        if (e.key === 'ArrowRight' && this.state.currentStep < this.state.totalSteps) {
            e.preventDefault();
            this.navigateStep(1);
        }
    }

    // Enhanced notification system
    showNotification(message, type = 'info') {
        this.elements.notificationText.textContent = message;
        this.elements.notification.className = `notification ${type}`;
        this.elements.notification.classList.add('show');
        
        // Auto-hide with cleanup
        setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 4000);
    }

    // Setup intersection observer for animations
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '20px'
        });
    }

    // Observe animations for cards
    observeAnimations() {
        const cards = document.querySelectorAll('.recommendation-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            this.intersectionObserver.observe(card);
        });
    }

    // Add scroll optimization
    addScrollOptimization() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        }, { passive: true });
    }

    // Cleanup method for memory management
    cleanup() {
        // Clear timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        
        // Disconnect observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Clear cache
        this.state.cache.clear();
        
        console.log('NextFlix AI - Cleaned up resources');
    }
}

// Initialize app when DOM is ready
let nextFlixApp;

document.addEventListener('DOMContentLoaded', () => {
    nextFlixApp = new NextFlixApp();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (nextFlixApp) {
        nextFlixApp.cleanup();
    }
});

// Add CSS for scroll optimization
const scrollOptimizationCSS = `
    .scrolling * {
        pointer-events: none;
    }
    
    .scrolling .poster-item::before {
        animation-play-state: paused;
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = scrollOptimizationCSS;
document.head.appendChild(style);
