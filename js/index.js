let carousel = document.querySelector("#M-carousel"),
    nextCarousel = document.querySelector("#M-carousel .next"),
    prevCarousel = document.querySelector("#M-carousel .prev"),
    logoImg = document.querySelector("#Logo"),
    correctImg = document.querySelectorAll(".title img"),
    navbarEle = document.querySelector("nav.navbar"),
    navLinks = navbarEle.querySelectorAll(".nav-link")
    sections = document.querySelectorAll("section"),
    loadingPage = document.querySelector(".loadingPage"),
    latestContent = document.querySelector("#Latest .content"),
    featuredContent = document.querySelector("#Featured .content .row"),
    popupBoxes = document.querySelectorAll('.popup .box'),
    cartProducts = [],
    logo = document.querySelector('link[rel="icon"]');

// Keep data into localStorage  
if (localStorage.getItem('cartProducts') == null) {
    updateLocalStorage();
}else{
    cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
}   

checkScrolledNavbar();

nextCarousel.addEventListener("click", function () {
    let currentSlide = carousel.querySelector(".M-carousel-item.active"),
        newSlide = currentSlide.nextElementSibling ?? carousel.querySelector(".M-carousel-item:first-child"),
        currentName = newSlide.dataset.colorName;

    currentSlide.classList.remove("active");    
    newSlide.classList.add("active");
    changeMainColor(currentName);
    updateImg(currentName , logoImg , 'logo');
    correctImg.forEach(function (correctImg) {
        updateImg(currentName , correctImg , 'correct');
    });
    updateImg(currentName , logo , 'logo');
});

prevCarousel.addEventListener("click", function () {
    let currentSlide = carousel.querySelector(".M-carousel-item.active"),
        newSlide = currentSlide.previousElementSibling ?? carousel.querySelector(".M-carousel-item:last-child"),
        currentName = newSlide.dataset.colorName;

    currentSlide.classList.remove("active");    
    newSlide.classList.add("active");
    changeMainColor(currentName);
    updateImg(currentName , logoImg , 'logo');
    correctImg.forEach(function (correctImg) {
        updateImg(currentName , correctImg , 'correct');
    });
    updateImg(currentName , logo , 'logo');
});

window.addEventListener("scroll", function(){
    // Remove Navbar's Transparency When Scrolling
    checkScrolledNavbar();
    // Moving Active Class
    sections.forEach(function(section){
        updateActiveLink (section.id);
    });
});

// Scroll To Top Of Section 
navLinks.forEach(function(navLink){
    navLink.addEventListener('click', function(e){
        e.preventDefault();
        let currentNavLink = navbarEle.querySelector(".nav-link.active"),
            currentId = navLink.getAttribute('href'),
            currentSection = document.querySelector(currentId),
            topOfSection = currentSection.offsetTop;

        currentNavLink.classList.remove('active');
        navLink.classList.add('active');

        window.scrollTo(0 , topOfSection - navbarEle.clientHeight);
    });
});

window.addEventListener("DOMContentLoaded", function(){
    loadingPage.classList.add("hide");
    setTimeout(function() {
        loadingPage.classList.add("d-none");
    }, 1500);
});

latest.forEach(function (product) {
    let isProductIntoCart = checkProductIntoCart(product.id);

    latestContent.innerHTML += `
        <div class="product mainBorder bg-light" data-product-id="${product.id}" data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}" data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}">
            <div class="row p-4">
                <div class="col-lg-6 part1">
                    <div class="item">
                        <div class="row">
                            <div class="col-md-2 col-lg-3 col-xl-2 box1">
                                <div class="item">
                                    <ul class="list-unstyled d-flex flex-md-column row-gap-2 column-gap-2 mb-0">
                                        ${prepareImagesList(product.images)}
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-10 col-lg-9 col-xl-10 box2">
                                <div class="item">
                                    <div class="selectedImg">
                                        <img class="img-fluid" src="./images/products/${product.images[0]}" alt="Latest">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 part2">
                    <div class="item">
                        <h2 class="mainColor">${product.name}</h2>
                        <p class="paragraph">${product.description}</p>
                        <div class="price d-flex">
                            <div class="label me-3 mb-2">
                                <strong>Price :</strong>
                            </div>
                            <div class="value mb-2">
                                ${preparePrice(product.price, product.discount)}
                            </div>
                        </div>
                        <div class="size d-flex">
                            <div class="label me-3">
                                <strong>Size :</strong>
                            </div>
                            <div class="value">
                                <ul class="list-unstyled d-flex column-gap-2">
                                    ${prepareSizesList(product.sizes, isProductIntoCart)}
                                </ul>
                            </div>
                        </div>
                        ${
                            (isProductIntoCart == null)? 
                            `<button class="mainButton btn" onclick="addToCart(${product.id}, this);addToCartAlert()">Add To Cart</button>`:
                            `<button class="mainButton btn remove" onclick="removeFromCart(${product.id}, this);removeFromCartAlert()">Remove From Cart</button>`
                        }  
                    </div>
                </div>
            </div>
        </div>
    `;
});

features.forEach(function (product) {
    featuredContent.innerHTML += `
        <div class="col-lg-3 col-sm-6">
            <div class="item">
                <div class="product bg-light text-center p-3 rounded-3">
                    <p class="discount ${(product.discount == 0)? 'd-none': ''}">-${product.discount * 100}%</p>
                    <div class="head text-center">
                        <div class="selectedImg">
                            <img class="img-fluid" src="./images/products/${product.images[0]}" alt="Featured">
                        </div>
                        <i class="fa-solid fa-magnifying-glass rounded-circle" onclick="showProduct(${product.id})"></i>
                        <ul class="list-unstyled d-flex column-gap-2 justify-content-center mb-0">
                            ${prepareLiList(product.images)}
                        </ul>
                    </div>
                    <div class="body">
                        <h6>${product.name}</h6>
                        ${preparePrice(product.price, product.discount)}
                    </div>
                </div>
            </div>
        </div>
    `;
});

popupBoxes.forEach(function(box){
    box.addEventListener('click', function(e){
        e.stopPropagation();
    });
});