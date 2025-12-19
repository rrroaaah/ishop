class SectionScroller {
    constructor(options) {
        this.upArrow = document.querySelector(options.upArrowSelector);
        this.downArrow = document.querySelector(options.downArrowSelector);
        this.titles = document.querySelectorAll(options.titleSelector);
        this.sections = options.sectionIds.map(id => document.getElementById(id));
        this.currentIndex = 0;

        this.init();
    }

    init() {
        this.updateTitle(this.currentIndex);
        this.bindEvents();
    }

    bindEvents() {
        this.upArrow.addEventListener("click", () => this.scrollToSection(this.currentIndex - 1));
        this.downArrow.addEventListener("click", () => this.scrollToSection(this.currentIndex + 1));

        window.addEventListener("scroll", () => this.onScroll());
    }

    updateTitle(index) {
        this.titles.forEach((h3, i) => h3.classList.toggle("active", i === index));
    }

    scrollToSection(index) {
        if (index < 0) index = 0;
        if (index >= this.sections.length) index = this.sections.length - 1;

        this.sections[index].scrollIntoView({ behavior: "smooth" });
        this.currentIndex = index;
        this.updateTitle(this.currentIndex);
    }

    onScroll() {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        this.sections.forEach((section, idx) => {
            if (section.offsetTop <= scrollPos) {
                this.currentIndex = idx;
                this.updateTitle(this.currentIndex);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const scroller = new SectionScroller({
        upArrowSelector: ".arrow-controls .fa-angle-up",
        downArrowSelector: ".arrow-controls .fa-angle-down",
        titleSelector: ".slider-frame h3",
        sectionIds: ["description-link", "description-completed", "comented-link", "question-link"]
    });
});
