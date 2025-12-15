const productsCategory = document.querySelectorAll(".product-category");

productsCategory.forEach(category => {
    category.addEventListener("click" , () => {
        productsCategory.forEach(active => active.classList.remove("active"));

        category.classList.add("active");
    });
});