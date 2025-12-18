class Slider {
    // Configuration constants
    static THRESHOLD = 50;
    static TRANSITION_DURATION = 300;
    
    constructor(mainSliderSelector = null) {
        this.instances = [];
        this.initSliders(mainSliderSelector);
    }
    
    initSliders(selector) {
        const containers = selector 
            ? [document.querySelector(selector)].filter(Boolean)
            : Array.from(document.querySelectorAll(".slider"));
            
        containers.forEach(container => {
            this.instances.push(new SliderInstance(container));
        });
        
        if (this.instances.length === 0) {
            console.warn('No slider containers found!');
        }
    }
    
    // Public API methods
    next() { this.instances.forEach(instance => instance.next()); }
    prev() { this.instances.forEach(instance => instance.prev()); }
    goTo(slideId) { this.instances.forEach(instance => instance.goTo(slideId)); }
    getInstance(index) { return this.instances[index] || null; }
    getAllInstances() { return [...this.instances]; }
    destroy() { 
        this.instances.forEach(instance => instance.destroy());
        this.instances = [];
    }
}

class SliderInstance {
    constructor(container) {
        // Core elements
        this.container = container;
        this.wrapper = container.querySelector(".slider-wrapper");
        this.sliderContainer = this.wrapper?.querySelector(".slider-content");
        
        // Configuration
        this.config = this.getConfig();
        
        // State
        this.state = {
            currentIndex: 0,
            isDragging: false,
            startPos: { x: 0, y: 0 },
            currentPos: { x: 0, y: 0 }
        };
        
        // Elements collections
        this.elements = this.getElements();
        
        // Initialize
        this.init();
    }
    
    getConfig() {
        return {
            isLoop: this.wrapper?.classList.contains("slider-loop") || false,
            isVertical: this.wrapper?.classList.contains("slider-column") || false,
            axis: this.wrapper?.classList.contains("slider-column") ? 'y' : 'x'
        };
    }
    
    getElements() {
        return {
            slides: Array.from(this.wrapper?.querySelectorAll(".slider-content") || []),
            toggles: Array.from(this.container?.querySelectorAll(".slider-toggle") || []),
            arrows: {
                next: this.container?.querySelector(".slider-arrow-next"),
                prev: this.container?.querySelector(".slider-arrow-prev")
            }
        };
    }
    
    init() {
        if (!this.wrapper || !this.sliderContainer || this.elements.slides.length === 0) {
            console.error('Invalid slider structure');
            return;
        }
        
        this.setupInitialState();
        this.setupEventListeners();
        this.updateUI();
    }
    
    setupInitialState() {
        // Find initial active slide
        const activeIndex = this.elements.slides.findIndex(slide => 
            slide.classList.contains("active")
        );
        this.state.currentIndex = activeIndex !== -1 ? activeIndex : 0;
        
        // Setup cursor
        this.wrapper.style.cursor = 'grab';
        
        // Setup slide-toggle mapping
        this.createSlideToggleMap();
    }
    
    createSlideToggleMap() {
        this.slideToggleMap = new Map();
        
        this.elements.toggles.forEach(toggle => {
            const slideId = toggle.dataset.sliderId;
            const slide = document.getElementById(slideId);
            if (slide) {
                this.slideToggleMap.set(toggle, slide);
                this.slideToggleMap.set(slide, toggle);
            }
        });
    }
    
    setupEventListeners() {
        // Touch events
        this.wrapper.addEventListener("touchstart", this.handleStart.bind(this));
        this.wrapper.addEventListener("touchend", this.handleEnd.bind(this));
        this.wrapper.addEventListener("touchmove", this.handleMove.bind(this), { passive: false });
        
        // Mouse events
        this.wrapper.addEventListener("mousedown", this.handleStart.bind(this));
        this.wrapper.addEventListener("mousemove", this.handleMove.bind(this));
        this.wrapper.addEventListener("mouseup", this.handleEnd.bind(this));
        this.wrapper.addEventListener("mouseleave", this.handleLeave.bind(this));
        
        // Global events
        document.addEventListener("mouseup", this.handleGlobalEnd.bind(this));
        
        // Navigation events
        this.setupNavigationEvents();
    }
    
    setupNavigationEvents() {
        // Toggle clicks
        this.elements.toggles.forEach(toggle => {
            toggle.addEventListener("click", () => {
                const slideId = toggle.dataset.sliderId;
                const slide = document.getElementById(slideId);
                if (slide) {
                    const index = this.elements.slides.indexOf(slide);
                    this.goToSlide(index);
                }
            });
        });
        
        // Arrow clicks
        this.elements.arrows.next?.addEventListener("click", () => this.next());
        this.elements.arrows.prev?.addEventListener("click", () => this.prev());
    }
    
    // Unified event handlers
    handleStart(e) {
        this.state.isDragging = true;
        this.state.startPos = this.getPosition(e);
        this.wrapper.style.cursor = "grabbing";
        e.preventDefault();
    }
    
    handleMove(e) {
        if (!this.state.isDragging) return;
        e.preventDefault();
        
        this.state.currentPos = this.getPosition(e);
        this.updateDragTransform();
    }
    
    handleEnd(e) {
        if (!this.state.isDragging) return;
        
        const diff = this.calculateDragDistance();
        this.resetTransform();
        
        if (Math.abs(diff) > Slider.THRESHOLD) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
        
        this.state.isDragging = false;
        this.wrapper.style.cursor = "grab";
    }
    
    handleLeave() {
        if (this.state.isDragging) {
            this.state.isDragging = false;
            this.wrapper.style.cursor = "grab";
            this.resetTransform();
        }
    }
    
    handleGlobalEnd() {
        if (this.state.isDragging) {
            this.state.isDragging = false;
            this.wrapper.style.cursor = "grab";
            this.resetTransform();
        }
    }
    
    // Position utilities
    getPosition(e) {
        if (e.touches) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
    
    calculateDragDistance() {
        const { startPos, currentPos } = this.state;
        return this.config.isVertical 
            ? startPos.y - currentPos.y
            : startPos.x - currentPos.x;
    }
    
    // Transform methods
    updateDragTransform() {
        const diff = this.calculateDragDistance();
        const baseTransform = this.getBaseTransform();
        const dragTransform = this.config.isVertical 
            ? `translateY(${-diff}px)`
            : `translateX(${-diff}px)`;
            
        this.sliderContainer.style.transform = `${baseTransform} ${dragTransform}`;
    }
    
    resetTransform() {
        this.sliderContainer.style.transform = this.getBaseTransform();
    }
    
    getBaseTransform() {
        const { currentIndex } = this.state;
        return this.config.isVertical 
            ? `translateY(-${currentIndex * 100}%)`
            : `translateX(-${currentIndex * 100}%)`;
    }
    
    // Navigation methods
    next() {
        this.goToSlide(this.state.currentIndex + 1);
    }
    
    prev() {
        this.goToSlide(this.state.currentIndex - 1);
    }
    
    goTo(slideId) {
        if (typeof slideId === 'string') {
            const slide = document.getElementById(slideId);
            if (slide) {
                const index = this.elements.slides.indexOf(slide);
                this.goToSlide(index);
            }
        } else {
            this.goToSlide(slideId);
        }
    }
    
    goToSlide(index) {
        const slidesLength = this.elements.slides.length;
        let targetIndex = index;
        
        // Handle loop boundaries
        if (this.config.isLoop) {
            if (index < 0) targetIndex = slidesLength - 1;
            if (index >= slidesLength) targetIndex = 0;
        } else {
            if (index < 0 || index >= slidesLength) return;
        }
        
        this.state.currentIndex = targetIndex;
        this.updateUI();
    }
    
    // UI updates
    updateUI() {
        this.updateSlides();
        this.updateToggles();
        this.updateArrows();
        this.resetTransform();
    }
    
    updateSlides() {
        this.elements.slides.forEach((slide, index) => {
            slide.classList.remove("prev", "active", "next");
            
            const diff = index - this.state.currentIndex;
            slide.style.setProperty("--number", diff);
            
            if (diff === 0) {
                slide.classList.add("active");
            } else if (diff < 0) {
                slide.classList.add("prev");
            } else {
                slide.classList.add("next");
            }
        });
    }
    
    updateToggles() {
        this.elements.toggles.forEach(toggle => {
            toggle.classList.remove('active');
        });
        
        const currentSlide = this.elements.slides[this.state.currentIndex];
        const currentToggle = this.slideToggleMap?.get(currentSlide);
        if (currentToggle) {
            currentToggle.classList.add('active');
        }
    }
    
    updateArrows() {
        const { next, prev } = this.elements.arrows;
        if (!next || !prev) return;
        
        next.classList.remove('disabled');
        prev.classList.remove('disabled');
        
        if (!this.config.isLoop) {
            if (this.state.currentIndex === 0) {
                prev.classList.add('disabled');
            }
            if (this.state.currentIndex === this.elements.slides.length - 1) {
                next.classList.add('disabled');
            }
        }
    }
    
    // Public methods
    getCurrentSlide() {
        return this.elements.slides[this.state.currentIndex];
    }
    
    getCurrentSlideId() {
        const slide = this.getCurrentSlide();
        return slide?.id || null;
    }
    
    // Cleanup
    destroy() {
        // Remove all event listeners
        this.wrapper.removeEventListener("touchstart", this.handleStart);
        this.wrapper.removeEventListener("touchend", this.handleEnd);
        this.wrapper.removeEventListener("touchmove", this.handleMove);
        this.wrapper.removeEventListener("mousedown", this.handleStart);
        this.wrapper.removeEventListener("mousemove", this.handleMove);
        this.wrapper.removeEventListener("mouseup", this.handleEnd);
        this.wrapper.removeEventListener("mouseleave", this.handleLeave);
        document.removeEventListener("mouseup", this.handleGlobalEnd);
        
        // Remove navigation listeners
        this.elements.toggles.forEach(toggle => {
            toggle.removeEventListener("click", this.handleToggleClick);
        });
        this.elements.arrows.next?.removeEventListener("click", this.next);
        this.elements.arrows.prev?.removeEventListener("click", this.prev);
        
        // Reset styles
        this.wrapper.style.cursor = '';
        this.sliderContainer.style.transform = '';
        
        // Clear references
        this.slideToggleMap?.clear();
    }
}

// Auto-initialize
// document.addEventListener('DOMContentLoaded', () => {
    // window.slider = 
    new Slider();
// });