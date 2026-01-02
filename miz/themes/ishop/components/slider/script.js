class Slider {
    constructor(mainSliderSelector = null) {
        // Store all slider instances
        this.instances = [];
        
        if (mainSliderSelector) {
            // Single slider mode - create one instance
            const container = document.querySelector(mainSliderSelector);
            if (container) {
                this.instances.push(this.createSliderInstance(container));
            }
        } else {
            // Auto mode - find all .slider elements
            const containers = document.querySelectorAll(".slider");
            containers.forEach(container => {
                this.instances.push(this.createSliderInstance(container));
            }); 
        }
        
        // If no instances were created, log error
        if (this.instances.length === 0) {
            console.error('No slider containers found!');
            return;
        }
    }
    
    createSliderInstance(sliderContainer) {
        const instance = {
            // Elements
            container: sliderContainer,
            wrapper: sliderContainer.querySelector(".slider-wrapper"),
            slides: null,
            togglesContainer: null,
            toggles: null,
            sliderContainerInner: null,
            
            // Arrow navigation elements
            arrowsContainer: null,
            nextArrow: null,
            prevArrow: null,
            
            // Configuration
            isLoop: false,
            
            // State
            startX: 0,
            isDragging: false,
            currentIndex: 0,
            slideToggleMap: new Map(),
            
            // Methods
            init: function() {
                // Find elements
                this.slides = Array.from(this.wrapper.querySelectorAll(".slider-content"));
                this.togglesContainer = this.container.querySelector(".slider-toggles");
                this.toggles = this.togglesContainer ? this.togglesContainer.querySelectorAll(".slider-toggle") : [];
                this.sliderContainerInner = this.wrapper.querySelector(".slider-container");
                
                // Find arrow navigation elements
                this.arrowsContainer = this.container.querySelector(".slider-arrows");
                if (this.arrowsContainer) {
                    this.nextArrow = this.arrowsContainer.querySelector(".slider-arrow-next");
                    this.prevArrow = this.arrowsContainer.querySelector(".slider-arrow-prev");
                }
                
                // Configuration
                this.isLoop = this.wrapper.classList.contains("slider-loop");
                
                // State
                this.currentIndex = this.slides.findIndex((s) => s.classList.contains("active"));
                
                // Create slide to toggle mapping
                this.createSlideToggleMap();
                
                // Set initial state
                if (this.currentIndex !== -1) {
                    this.updateSlider(this.currentIndex);
                } else {
                    this.updateSlider(0);
                }
                
                // Bind event listeners
                this.bindEvents();
                
                // Set initial cursor
                this.wrapper.style.cursor = 'grab';
                
                // Update arrow states
                this.updateArrowStates();
            },
            
            createSlideToggleMap: function() {
                this.slideToggleMap.clear();
                
                this.toggles.forEach(toggle => {
                    const slideId = toggle.getAttribute('data-slider-id');
                    const slide = document.getElementById(slideId);
                    if (slide) {
                        this.slideToggleMap.set(toggle, slide);
                        this.slideToggleMap.set(slide, toggle);
                    }
                });
            },
            
            updateSlider: function(index) {
                if (this.isLoop) {
                    if (index < 0) index = this.slides.length - 1;
                    if (index >= this.slides.length) index = 0;
                } else {
                    if (index < 0 || index >= this.slides.length) return;
                }

                this.currentIndex = index;

                this.slides.forEach((slide, i) => {
                    slide.classList.remove("prev", "active", "next");

                    const diff = i - this.currentIndex;
                    slide.style.setProperty("--number", diff);

                    if (diff === 0) slide.classList.add("active");
                    else if (diff < 0) slide.classList.add("prev");
                    else slide.classList.add("next");
                });
                
                // Update toggles based on active slide
                this.updateToggles();
                
                // Update arrow states
                this.updateArrowStates();
            },
            
            updateToggles: function() {
                // Remove active class from all toggles
                this.toggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
                
                // Add active class to current toggle
                const currentSlide = this.slides[this.currentIndex];
                const currentToggle = this.slideToggleMap.get(currentSlide);
                if (currentToggle) {
                    currentToggle.classList.add('active');
                }
            },
            
            updateArrowStates: function() {
                if (!this.nextArrow || !this.prevArrow) return;
                
                // Remove disabled classes
                this.nextArrow.classList.remove('disabled');
                this.prevArrow.classList.remove('disabled');
                
                // Add disabled classes if not looping and at boundaries
                if (!this.isLoop) {
                    if (this.currentIndex === 0) {
                        this.prevArrow.classList.add('disabled');
                    }
                    if (this.currentIndex === this.slides.length - 1) {
                        this.nextArrow.classList.add('disabled');
                    }
                }
            },
            
            bindEvents: function() {
                // Thumbnail clicks - using data-slider-id mapping
                this.toggles.forEach((toggle) => {
                    toggle.addEventListener("click", () => {
                        const slideId = toggle.getAttribute('data-slider-id');
                        const slide = document.getElementById(slideId);
                        if (slide) {
                            const slideIndex = this.slides.indexOf(slide);
                            if (slideIndex !== -1) {
                                this.updateSlider(slideIndex);
                            }
                        }
                    });
                });

                // Arrow navigation clicks
                if (this.nextArrow) {
                    this.nextArrow.addEventListener("click", () => {
                        this.next();
                    });
                }
                
                if (this.prevArrow) {
                    this.prevArrow.addEventListener("click", () => {
                        this.prev();
                    });
                }

                // Touch events
                this.wrapper.addEventListener("touchstart", this.handleTouchStart.bind(this));
                this.wrapper.addEventListener("touchend", this.handleTouchEnd.bind(this));
                this.wrapper.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false });

                // Mouse events
                this.wrapper.addEventListener("mousedown", this.handleMouseDown.bind(this));
                this.wrapper.addEventListener("mousemove", this.handleMouseMove.bind(this));
                this.wrapper.addEventListener("mouseup", this.handleMouseUp.bind(this));
                this.wrapper.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
                
                // Global mouse up
                document.addEventListener("mouseup", this.handleGlobalMouseUp.bind(this));
            },
            
            // Touch handlers
            handleTouchStart: function(e) {
                this.startX = e.touches[0].clientX;
            },
            
            handleTouchEnd: function(e) {
                const endX = e.changedTouches[0].clientX;
                const diffX = this.startX - endX;

                if (Math.abs(diffX) > 50) {
                    diffX > 0 
                        ? this.updateSlider(this.currentIndex + 1) 
                        : this.updateSlider(this.currentIndex - 1);
                }
            },
            
            handleTouchMove: function(e) {
                if (!this.isDragging) return;
                e.preventDefault();
            },
            
            // Mouse handlers
            handleMouseDown: function(e) {
                this.isDragging = true;
                this.startX = e.clientX;
                this.wrapper.style.cursor = "grabbing";
                e.preventDefault();
            },
            
            handleMouseMove: function(e) {
                if (!this.isDragging) return;
                e.preventDefault();

                const currentX = e.clientX;
                const diffX = this.startX - currentX;

                const transform = `translateX(calc(-${this.currentIndex * 100}% - ${diffX}px))`;
                if (this.sliderContainerInner) {
                    this.sliderContainerInner.style.transform = transform;
                }
            },
            
            handleMouseUp: function(e) {
                if (!this.isDragging) return;

                const endX = e.clientX;
                const diffX = this.startX - endX;

                this.resetTransform();

                if (Math.abs(diffX) > 50) {
                    diffX > 0 
                        ? this.updateSlider(this.currentIndex + 1) 
                        : this.updateSlider(this.currentIndex - 1);
                }

                this.isDragging = false;
                this.wrapper.style.cursor = "grab";
            },
            
            handleMouseLeave: function() {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.wrapper.style.cursor = "grab";
                    this.resetTransform();
                }
            },
            
            handleGlobalMouseUp: function() {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.wrapper.style.cursor = "grab";
                    this.resetTransform();
                }
            },
            
            // Utility methods
            resetTransform: function() {
                if (this.sliderContainerInner) {
                    this.sliderContainerInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
                }
            },
            
            // Public methods
            next: function() {
                this.updateSlider(this.currentIndex + 1);
            },
            
            prev: function() {
                this.updateSlider(this.currentIndex - 1);
            },
            
            goTo: function(slideId) {
                // Can accept either slide id or index
                if (typeof slideId === 'string') {
                    const slide = document.getElementById(slideId);
                    if (slide) {
                        const slideIndex = this.slides.indexOf(slide);
                        if (slideIndex !== -1) {
                            this.updateSlider(slideIndex);
                        }
                    }
                } else {
                    this.updateSlider(slideId);
                }
            },
            
            // Get current slide info
            getCurrentSlide: function() {
                return this.slides[this.currentIndex];
            },
            
            getCurrentSlideId: function() {
                const currentSlide = this.getCurrentSlide();
                return currentSlide ? currentSlide.id : null;
            },
            
            // Destroy method for cleanup
            destroy: function() {
                // Remove event listeners
                this.wrapper.removeEventListener("touchstart", this.handleTouchStart);
                this.wrapper.removeEventListener("touchend", this.handleTouchEnd);
                this.wrapper.removeEventListener("touchmove", this.handleTouchMove);
                this.wrapper.removeEventListener("mousedown", this.handleMouseDown);
                this.wrapper.removeEventListener("mousemove", this.handleMouseMove);
                this.wrapper.removeEventListener("mouseup", this.handleMouseUp);
                this.wrapper.removeEventListener("mouseleave", this.handleMouseLeave);
                document.removeEventListener("mouseup", this.handleGlobalMouseUp);
                
                // Remove arrow event listeners
                if (this.nextArrow) {
                    this.nextArrow.removeEventListener("click", this.next);
                }
                if (this.prevArrow) {
                    this.prevArrow.removeEventListener("click", this.prev);
                }
                
                // Reset styles
                this.wrapper.style.cursor = '';
                if (this.sliderContainerInner) {
                    this.sliderContainerInner.style.transform = '';
                }
                
                // Clear map
                this.slideToggleMap.clear();
            }
        };
        
        // Initialize the instance
        instance.init();
        
        return instance;
    }
    
    // Public methods that operate on all instances
    next() {
        this.instances.forEach(instance => instance.next());
    }
    
    prev() {
        this.instances.forEach(instance => instance.prev());
    }
    
    goTo(slideId) {
        this.instances.forEach(instance => instance.goTo(slideId));
    }
    
    // Get specific instance by index
    getInstance(index) {
        return this.instances[index] || null;
    }
    
    // Get all instances
    getAllInstances() {
        return this.instances;
    }
    
    // Destroy all instances
    destroy() {
        this.instances.forEach(instance => instance.destroy());
        this.instances = [];
    }
}

new Slider();