class Quantity {
    constructor(selector, options = {}) {
      this.container = document.querySelector(selector);
      if (!this.container) return;
  
      this.plusBtn = this.container.querySelector('.qty-plus');
      this.minusBtn = this.container.querySelector('.qty-minus');
      this.valueEl = this.container.querySelector('.qty-value');
  
      this.min = options.min ?? 1;
      this.max = options.max ?? Infinity;
      this.value = parseInt(this.valueEl.textContent) || this.min;
  
      this.init();
    }
  
    init() {
      this.update();
  
      this.plusBtn.addEventListener('click', () => this.increment());
      this.minusBtn.addEventListener('click', () => this.decrement());
    }
  
    increment() {
      if (this.value < this.max) {
        this.value++;
        this.update();
      }
    }
  
    decrement() {
      if (this.value > this.min) {
        this.value--;
        this.update();
      }
    }
  
    update() {
      this.valueEl.textContent = this.value;
  
      // کلاس‌های وضعیت
      this.container.classList.toggle('is-min', this.value === this.min);
      this.container.classList.toggle('is-max', this.value === this.max);
    }
  
    getValue() {
      return this.value;
    }
  }

  new Quantity('.qty', {
    min: 1,
    max: 50
  });  