class CopyAddress {
    constructor(selector = '.copy-address') {
      this.items = document.querySelectorAll(selector);
      this.init();
    }
  
    init() {
      this.items.forEach(wrapper => {
        const copyBtn = wrapper.querySelector('.copy-item');
        const urlEl = wrapper.querySelector('.site-url');
  
        if (!copyBtn || !urlEl) return;
  
        const url = window.location.href;
  
        urlEl.textContent = url;
  
        copyBtn.addEventListener('click', () => {
          this.copyToClipboard(url, copyBtn);
        });
      });
    }
  
    copyToClipboard(text, button) {
      navigator.clipboard.writeText(text).then(() => {
        this.onSuccess(button);
      }).catch(() => {
        this.onError(button);
      });
    }
  
  }
  
new CopyAddress();