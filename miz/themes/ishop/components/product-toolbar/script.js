document.addEventListener('DOMContentLoaded', () => {
    const toolbar = document.querySelector('.product-toolbar');
    if (!toolbar) return;
  
    const likeBtn = toolbar.querySelector('.label.like');
    if (!likeBtn) return;
  
    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('is-active');
    });
  });
