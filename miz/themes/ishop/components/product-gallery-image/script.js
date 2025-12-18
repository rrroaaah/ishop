class ProductHover {
    constructor(selector = '.product-gallery .slider-content') {
      this.items = document.querySelectorAll(selector);
      this.init();
    }
  
    init() {
      this.items.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return;
  
        wrapper.addEventListener('mousemove', e => {
          this.onMove(e, wrapper, img);
        });
  
        wrapper.addEventListener('mouseleave', () => {
          this.onLeave(img);
        });
      });
    }
  
    onMove(e, wrapper, img) {
      const rect = wrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
  
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = 'scale(2)';
    }
  
    onLeave(img) {
      img.style.transformOrigin = 'center';
      img.style.transform = 'scale(1)';
    }
}

new ProductHover();