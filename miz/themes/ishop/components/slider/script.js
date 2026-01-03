// class Slider {
//     constructor(selector = ".slider") {
//         this.instances = [];
//         document.querySelectorAll(selector).forEach(slider => {
//             this.instances.push(this.createInstance(slider));
//         });
//     }

//     createInstance(slider) {
//         const instance = {
//             container: slider,
//             wrapper: slider.querySelector(".slider-wrapper"),
//             track: slider.querySelector(".slider-container"),
//             slides: Array.from(slider.querySelectorAll(".slider-content")),
//             toggles: slider.querySelectorAll(".slider-toggle"),
//             nextArrow: slider.querySelector(".slider-arrow-next"),
//             prevArrow: slider.querySelector(".slider-arrow-prev"),

//             current: 0,
//             startX: 0,
//             isDragging: false,
//             autoplayTimer: null,

//             isVertical: false,
//             isLoop: false,
//             isRTL: false,
//             autoplayDelay: null,

//             init() {
//                 this.isVertical = this.wrapper.classList.contains("slider-column");
//                 this.isLoop = this.wrapper.classList.contains("slider-loop");
//                 this.isRTL = getComputedStyle(this.container).direction === "rtl";

//                 this.autoplayDelay = this.container.dataset.sliderTimer
//                     ? parseInt(this.container.dataset.sliderTimer)
//                     : null;

//                 const activeIndex = this.slides.findIndex(s => s.classList.contains("active"));
//                 this.current = activeIndex >= 0 ? activeIndex : 0;

//                 this.bindEvents();
//                 this.update();
//                 this.initAutoplay();
//             },

//             /* ---------- core ---------- */

//             update() {
//                 let value = this.current * 100;
//                 if (!this.isVertical && this.isRTL) value *= -1;

//                 this.track.style.transform = this.isVertical
//                     ? `translateY(-${value}%)`
//                     : `translateX(-${value}%)`;

//                 this.slides.forEach(s => s.classList.remove("active"));
//                 this.slides[this.current].classList.add("active");

//                 this.toggles.forEach(t => t.classList.remove("active"));
//                 const t = this.container.querySelector(
//                     `.slider-toggle[data-slider-id="${this.slides[this.current].id}"]`
//                 );
//                 t?.classList.add("active");

//                 this.updateArrows();
//             },

//             updateArrows() {
//                 if (!this.prevArrow || !this.nextArrow || this.isLoop) return;

//                 this.prevArrow.classList.toggle("disabled", this.current === 0);
//                 this.nextArrow.classList.toggle(
//                     "disabled",
//                     this.current === this.slides.length - 1
//                 );
//             },

//             next() {
//                 if (this.current < this.slides.length - 1) this.current++;
//                 else if (this.isLoop) this.current = 0;
//                 this.update();
//             },

//             prev() {
//                 if (this.current > 0) this.current--;
//                 else if (this.isLoop) this.current = this.slides.length - 1;
//                 this.update();
//             },

//             goTo(target) {
//                 if (typeof target === "number") {
//                     this.current = target;
//                 } else {
//                     const slide = document.getElementById(target);
//                     this.current = this.slides.indexOf(slide);
//                 }
//                 this.update();
//             },

//             /* ---------- drag / touch ---------- */
//             onStart(x) {
//                 this.isDragging = true;
//                 this.startX = x;
//                 this.track.style.transition = "none";
//                 this.wrapper.style.cursor = "grabbing";

//                 this.slides.forEach(s => {
//                     s.style.pointerEvents = "none";
//                     s.style.userSelect = "none";
//                     s.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));
//                 });

//                 this.stopAutoplay();
//             },

//             onMove(x) {
//                 if (!this.isDragging) return;
//                 const diff = this.startX - x;
//                 const sign = this.isRTL && !this.isVertical ? -1 : 1;

//                 this.track.style.transform = this.isVertical
//                     ? `translateY(calc(-${this.current * 100}% - ${diff}px))`
//                     : `translateX(calc(-${this.current * 100}% - ${diff * sign}px))`;
//             },

//             onEnd(x) {
//                 if (!this.isDragging) return;
//                 const diff = this.startX - x;

//                 this.track.style.transition = "";
//                 this.wrapper.style.cursor = "grab";
//                 this.isDragging = false;
//                 this.slides.forEach(s => {
//                     s.style.pointerEvents = "all";
//                     s.style.userSelect = "auto";
//                     s.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "true"));
//                 });

//                 if (Math.abs(diff) > 50) {
//                     diff > 0 ? this.next() : this.prev();
//                 } else {
//                     this.update();
//                 }

//                 this.initAutoplay();
//             },

//             /* ---------- autoplay ---------- */

//             initAutoplay() {
//                 if (!this.autoplayDelay) return;
//                 this.autoplayTimer = setInterval(() => this.next(), this.autoplayDelay);
//             },

//             stopAutoplay() {
//                 if (this.autoplayTimer) clearInterval(this.autoplayTimer);
//             },

//             /* ---------- events ---------- */

//             bindEvents() {
//                 this.wrapper.style.cursor = "grab";

//                 this.nextArrow?.addEventListener("click", () => this.next());
//                 this.prevArrow?.addEventListener("click", () => this.prev());

//                 this.toggles.forEach(toggle => {
//                     toggle.addEventListener("click", () =>
//                         this.goTo(toggle.dataset.sliderId)
//                     );
//                 });

//                 // mouse
//                 this.wrapper.addEventListener("mousedown", e => this.onStart(e.clientX));
//                 window.addEventListener("mousemove", e => this.onMove(e.clientX));
//                 window.addEventListener("mouseup", e => this.onEnd(e.clientX));

//                 // touch
//                 this.wrapper.addEventListener("touchstart", e =>
//                     this.onStart(e.touches[0].clientX)
//                 );
//                 this.wrapper.addEventListener("touchmove", e =>
//                     this.onMove(e.touches[0].clientX)
//                 );
//                 this.wrapper.addEventListener("touchend", e =>
//                     this.onEnd(e.changedTouches[0].clientX)
//                 );

//                 // keyboard
//                 window.addEventListener("keydown", e => {
//                     if (e.key === "ArrowRight") this.isRTL ? this.prev() : this.next();
//                     if (e.key === "ArrowLeft") this.isRTL ? this.next() : this.prev();
//                 });
//             },

//             /* ---------- public api ---------- */

//             getCurrentIndex() {
//                 return this.current;
//             },

//             getCurrentSlide() {
//                 return this.slides[this.current];
//             },

//             destroy() {
//                 this.stopAutoplay();
//                 this.track.style.transform = "";
//             }
//         };

//         instance.init();
//         return instance;
//     }

//     /* global api */
//     next() {
//         this.instances.forEach(i => i.next());
//     }
//     prev() {
//         this.instances.forEach(i => i.prev());
//     }
//     goTo(v) {
//         this.instances.forEach(i => i.goTo(v));
//     }
// }

// new Slider();

class Slider {
    constructor(selector = ".slider") {
        this.instances = [];
        document.querySelectorAll(selector).forEach(slider => {
            this.instances.push(this.createInstance(slider));
        });
    }

    createInstance(slider) {
        const instance = {
            container: slider,
            wrapper: slider.querySelector(".slider-wrapper"),
            track: slider.querySelector(".slider-container"),
            slides: Array.from(slider.querySelectorAll(".slider-content")),
            toggles: slider.querySelectorAll(".slider-toggle"),
            nextArrow: slider.querySelector(".slider-arrow-next"),
            prevArrow: slider.querySelector(".slider-arrow-prev"),

            current: 0,
            startX: 0,
            startY: 0,
            isDragging: false,
            autoplayTimer: null,

            isVertical: false,
            isLoop: false,
            isRTL: false,
            autoplayDelay: null,

            init() {
                this.isVertical = this.wrapper.classList.contains("slider-column");
                this.isLoop = this.wrapper.classList.contains("slider-loop");
                this.isRTL = getComputedStyle(this.container).direction === "rtl";

                this.autoplayDelay = this.container.dataset.sliderTimer
                    ? parseInt(this.container.dataset.sliderTimer)
                    : null;

                const activeIndex = this.slides.findIndex(s => s.classList.contains("active"));
                this.current = activeIndex >= 0 ? activeIndex : 0;

                this.bindEvents();
                this.update();
                this.initAutoplay();
            },

            /* ---------- core ---------- */
            update() {
                let value = this.current * 100;
                if (!this.isVertical && this.isRTL) value *= -1;

                this.track.style.transform = this.isVertical
                    ? `translateY(-${value}%)`
                    : `translateX(-${value}%)`;

                this.slides.forEach(s => s.classList.remove("active"));
                this.slides[this.current].classList.add("active");

                this.toggles.forEach(t => t.classList.remove("active"));
                const t = this.container.querySelector(
                    `.slider-toggle[data-slider-id="${this.slides[this.current].id}"]`
                );
                t?.classList.add("active");

                this.updateArrows();
            },

            updateArrows() {
                if (!this.prevArrow || !this.nextArrow || this.isLoop) return;

                this.prevArrow.classList.toggle("disabled", this.current === 0);
                this.nextArrow.classList.toggle(
                    "disabled",
                    this.current === this.slides.length - 1
                );
            },

            next() {
                if (this.current < this.slides.length - 1) this.current++;
                else if (this.isLoop) this.current = 0;
                this.update();
            },

            prev() {
                if (this.current > 0) this.current--;
                else if (this.isLoop) this.current = this.slides.length - 1;
                this.update();
            },

            goTo(target) {
                if (typeof target === "number") {
                    this.current = target;
                } else {
                    const slide = document.getElementById(target);
                    this.current = this.slides.indexOf(slide);
                }
                this.update();
            },

            /* ---------- drag / touch ---------- */
            onStart(x, y) {
                this.isDragging = true;
                this.startX = x;
                this.startY = y;
                this.track.style.transition = "none";

                this.wrapper.classList.add("dragging");

                this.slides.forEach(s => {
                    s.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));
                });

                this.stopAutoplay();
            },

            onMove(x, y) {
                if (!this.isDragging) return;

                let diff;
                if (this.isVertical) {
                    diff = this.startY - y;
                    this.track.style.transform = `translateY(calc(-${this.current * 100}% - ${diff}px))`;
                } else {
                    diff = this.startX - x;
                    const sign = this.isRTL ? -1 : 1;
                    this.track.style.transform = `translateX(calc(-${this.current * 100}% - ${diff * sign}px))`;
                }
            },

            onEnd(x, y) {
                if (!this.isDragging) return;

                let diff;
                if (this.isVertical) {
                    diff = this.startY - y;
                } else {
                    diff = this.startX - x;
                }

                this.track.style.transition = "";
                this.isDragging = false;

                this.wrapper.classList.remove("dragging");

                this.slides.forEach(s => {
                    s.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));
                });

                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                } else {
                    this.update();
                }

                this.initAutoplay();
            },

            /* ---------- autoplay ---------- */
            initAutoplay() {
                if (!this.autoplayDelay) return;
                this.autoplayTimer = setInterval(() => this.next(), this.autoplayDelay);
            },

            stopAutoplay() {
                if (this.autoplayTimer) clearInterval(this.autoplayTimer);
            },

            /* ---------- events ---------- */
            bindEvents() {
                this.nextArrow?.addEventListener("click", () => this.next());
                this.prevArrow?.addEventListener("click", () => this.prev());

                this.toggles.forEach(toggle => {
                    toggle.addEventListener("click", () =>
                        this.goTo(toggle.dataset.sliderId)
                    );
                });

                // mouse
                this.wrapper.addEventListener("mousedown", e => this.onStart(e.clientX, e.clientY));
                window.addEventListener("mousemove", e => this.onMove(e.clientX, e.clientY));
                window.addEventListener("mouseup", e => this.onEnd(e.clientX, e.clientY));

                // touch
                this.wrapper.addEventListener("touchstart", e =>
                    this.onStart(e.touches[0].clientX, e.touches[0].clientY)
                );
                this.wrapper.addEventListener("touchmove", e =>
                    this.onMove(e.touches[0].clientX, e.touches[0].clientY)
                );
                this.wrapper.addEventListener("touchend", e =>
                    this.onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
                );

                // keyboard
                window.addEventListener("keydown", e => {
                    if (e.key === "ArrowRight") this.isRTL ? this.prev() : this.next();
                    if (e.key === "ArrowLeft") this.isRTL ? this.next() : this.prev();
                });
            },

            /* ---------- public api ---------- */
            getCurrentIndex() {
                return this.current;
            },

            getCurrentSlide() {
                return this.slides[this.current];
            },

            destroy() {
                this.stopAutoplay();
                this.track.style.transform = "";
            }
        };

        instance.init();
        return instance;
    }

    /* global api */
    next() {
        this.instances.forEach(i => i.next());
    }
    prev() {
        this.instances.forEach(i => i.prev());
    }
    goTo(v) {
        this.instances.forEach(i => i.goTo(v));
    }
}

new Slider();