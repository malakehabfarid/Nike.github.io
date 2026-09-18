function changeMainColor(colorName) {
  let html = document.querySelector("html"),
    newColor = getComputedStyle(html).getPropertyValue(`--${colorName}-color`);
  html.style.setProperty("--main-color", newColor);
}

function updateImg(imgName, imgEle, commonName) {
    let currentSrc = imgEle.src || imgEle.href,
        currentSrcArr = currentSrc.split("/");
    currentSrcArr[currentSrcArr.length - 1] = `${imgName}-${commonName}.png`;
    let newSrc = currentSrcArr.join("/");
    if (imgEle.tagName.toLowerCase() === 'link') {
        imgEle.setAttribute("href", newSrc);
    }else{
        imgEle.setAttribute("src", newSrc);
    }
}

function checkScrolledNavbar() {
  if (window.scrollY > 10) {
    navbarEle.classList.add("scrolled");
  } else {
    navbarEle.classList.remove("scrolled");
  }
}

function updateActiveLink(sectionId) {
  let section = document.querySelector(`#${sectionId}`),
    sectionTop = section.offsetTop - navbarEle.clientHeight,
    sectionHeight = section.clientHeight,
    sectionBottom = sectionTop + sectionHeight;
  if (window.scrollY > sectionTop && window.scrollY < sectionBottom) {
    let SectionId = section.getAttribute("id"),
      navLinkOfSection = document.querySelector(`a[href="#${SectionId}"]`),
      currentNavLink = navbarEle.querySelector(".nav-link.active");
    currentNavLink.classList.remove("active");
    navLinkOfSection.classList.add("active");
  }
}

function prepareImagesList(imagesList, isProduct = false) {
  let liEle = "";

  imagesList.forEach(function (image) {
    liEle += `
            <li class="${isProduct ? "" : "mainBorder"}"><img class="img-fluid p-2" src="./images/products/${image}" onclick="changeSelectedImg('${image}', this)" alt="Latest"></li>
        `;
  });
  return liEle;
}

function preparePrice(price, discount) {
  return `
        <p class="mb-0">
            <span class="text-decoration-line-through me-1 mainColor ${discount == 0 ? "d-none" : ""}"> ${price} <sup>$</sup></span>
            <span> ${(price * (1 - discount)).toFixed(1)} <sup>$</sup></span>
        </p>    
    `;
}

function prepareSizesList(sizesList, isProductIntoCart = null) {
  let liEle = "";

  sizesList.forEach(function (size, index) {
    if (isProductIntoCart == null) {
      liEle += `<li class="mainBorder rounded-1 ${index == 0 ? "active" : ""}" onclick="changeActive(this); updateSize('${size}', this);">${size}</li>`;
    } else {
      liEle += `<li class="mainBorder rounded-1 ${isProductIntoCart.size == size ? "active" : ""}" onclick="changeActive(this); updateSize('${size}', this);">${size}</li>`;
    }
  });
  return liEle;
}

function prepareColorsList(colorsList, isProductIntoCart = null) {
  let liEle = "";

  colorsList.forEach(function (color, index) {
    if (isProductIntoCart == null) {
      liEle += `<li class="rounded-circle ${index == 0 ? "active" : ""}" onclick="changeActive(this); updateColor('${color}', this); " style="background-color: ${color};"></li>`;
    } else {
      liEle += `<li class="rounded-circle ${isProductIntoCart.color == color ? "active" : ""}" onclick="changeActive(this); updateColor('${color}', this); " style="background-color: ${color};"></li>`;
    }
  });
  return liEle;
}

function prepareLiList(imagesList) {
  let liEle = "";

  imagesList.forEach(function (image, index) {
    liEle += `
            <li class="mainBorder rounded-circle ${index == 0 ? "active" : ""}" onclick="changeSelectedImg('${image}', this); changeActive(this);"></li>
        `;
  });
  return liEle;
}

function changeSelectedImg(imgName, that) {
  let selectedImg = that.closest(".product").querySelector(".selectedImg img"),
    srcArray = selectedImg.src.split("/");
  srcArray[srcArray.length - 1] = imgName;
  selectedImg.setAttribute("src", srcArray.join("/"));
}

function changeActive(that) {
  let currentActive = that.parentElement.querySelector(".active");
  currentActive.classList.remove("active");
  that.classList.add("active");
}

function openPopup(popupName) {
  let popupEle = document.querySelector(
    `.popup[data-popup-name="${popupName}"]`,
  );
  popupEle.classList.add("active");
  setTimeout(function () {
    popupEle.classList.add("show");
  }, 10);
  document.querySelector('body').classList.add('no-scroll');
}

function closePopup() {
  let popupEle = document.querySelector(".popup.active");
  popupEle.classList.remove("show");
  setTimeout(function () {
    popupEle.classList.remove("active");
  }, 1000);
  document.querySelector('body').classList.remove('no-scroll');
}

function getProduct(productId) {
  return products.filter((product) => product.id == productId)[0];
}

function showProduct(productId) {
    let product = getProduct(productId),
        popupProduct = document.querySelector(
        `.popup[data-popup-name="product"] .box .body`,
        ),
        isProductIntoCart = checkProductIntoCart(product.id);

    popupProduct.innerHTML = `
            <div class="row product" data-selected-size="${isProductIntoCart?.size ?? product.sizes[0]}" data-selected-color="${isProductIntoCart?.color ?? product.colors[0]}">
                <div class="col-md-6">
                    <div class="item">
                        <div class="selectedImg">
                            <img class="img-fluid" src="./images/products/${product.images[0]}" alt="product">
                        </div>
                        <ul class="d-flex list-unstyled mb-0" >
                            ${prepareImagesList(product.images, true)}
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="item">
                        <h3>${product.name}</h3>
                        ${preparePrice(product.price, product.discount)}
                        <hr>
                        <p>${product.description}</p>
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
                        <div class="color d-flex mb-3">
                            <div class="label me-3">
                                <strong>Color :</strong>
                            </div>
                            <div class="value">
                                <ul class="list-unstyled d-flex mb-0 column-gap-2">
                                    ${prepareColorsList(product.colors, isProductIntoCart)}
                                </ul>
                            </div>
                        </div>
                        ${
                        isProductIntoCart == null
                            ? `<button class="mainButton btn" onclick="addToCart(${product.id}, this);addToCartAlert();">Add To Cart</button>`
                            : `<button class="mainButton btn remove" onclick="removeFromCart(${product.id}, this);removeFromCartAlert();">Remove From Cart</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    openPopup("product");
}

function addToCart(productId, that) {
  let productEle = that.closest(".product"),
    newOrder = {
      id: productId,
      size: productEle.dataset.selectedSize,
      color: productEle.dataset.selectedColor,
    };

  cartProducts.push(newOrder);
  updateLocalStorage();
  toggleOrderBtn(that, "remove");
  that.setAttribute("onclick", `removeFromCart(${productId}, this)`);
}

function removeFromCart(productId, that) {
    cartProducts = cartProducts.filter((product) => product.id != productId);
    updateLocalStorage();
    if (that != null) {
        toggleOrderBtn(that, "add");
        that.setAttribute("onclick", `addToCart(${productId}, this)`);
    }
}

function toggleOrderBtn(btn, status) {
    if (status == "add") {
        btn.classList.remove("remove");
        btn.textContent = "Add To Cart";
    } else if (status == "remove") {
        btn.classList.add("remove");
        btn.textContent = "Remove From Cart";
    }
}

function updateSize(size, that) {
    let productEle = that.closest(".product");

    productEle.dataset.selectedSize = size;
}

function updateColor(color, that) {
    let productEle = that.closest(".product");

    productEle.dataset.selectedColor = color;
}

function updateLocalStorage() {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

function checkProductIntoCart(productId) {
    let result = cartProducts.filter((product) => product.id == productId);
    return result.length == 1 ? result[0] : null;
}

function showCart() {
    let showContent = document.querySelector(
        `.popup[data-popup-name="shop"] .row`,
    ),
        buyBtn = document.querySelector(".popup .box .body .buy");
    
    if (cartProducts.length == 0) {
        showContent.innerHTML = `<p class="alert alert-warning text-center">There are no products</p>`;
        buyBtn.classList.add('d-none');
    }else{
        showContent.innerHTML = "";
        cartProducts.forEach(function (cartProduct) {
            let product = getProduct(cartProduct.id);
            showContent.innerHTML += `
                <div class="col-md-4 mb-3">
                    <div class="item">
                        <div class="product bg-light p-3 rounded-3" data-product-id="${product.id}">
                            <img src="./images/products/${product.images[0]}" alt="Cart" class="img-fluid">
                            <h5>${product.name.slice(0, 15)}...</h5>
                            <div class="price d-flex ">
                                <div class="label me-3 mb-2">
                                    <strong>Price :</strong>
                                </div>
                                <div class="value mb-2">
                                    ${preparePrice(product.price, product.discount)}
                                </div>
                            </div>
                            <div class="size d-flex ">
                                <div class="label me-3">
                                    <strong>Size :</strong>
                                </div>
                                <div class="value">
                                    <ul class="list-unstyled d-flex column-gap-2">
                                        ${prepareSizesList([cartProduct.size])} 
                                    </ul>
                                </div>
                            </div>
                            <div class="color d-flex ">
                                <div class="label me-3">
                                    <strong>Color :</strong>
                                </div>
                                <div class="value">
                                    <ul class="list-unstyled d-flex mb-0 column-gap-2">
                                        ${prepareColorsList([cartProduct.color])}
                                    </ul>
                                </div>
                            </div>
                            <button class="btn btn-danger w-100 mt-3" onclick="removeFromShop(${product.id}); removeFromCartAlert(); ">Remove</button>
                        </div>
                    </div>
                </div>
                `;
        });
        buyBtn.classList.remove('d-none');
    }
    openPopup("shop");
}

function removeFromShop(productId) {
    let productWantRemove = document.querySelector(`.popup[data-popup-name="shop"] .row .product[data-product-id="${productId}"]`);   
    productWantRemove.parentElement.parentElement.remove();
    latestButton = document.querySelector(`#Latest .product[data-product-id="${productId}"] button`);

    removeFromCart(productId, latestButton); 
    showCart();
}

function addToCartAlert(){
    let addAlertMessage1 = document.querySelector(".cartAlert1");
    addAlertMessage1.classList.add("active");
    setTimeout(function () {
        addAlertMessage1.classList.add("show");
    }, 1);
    setTimeout(function () {
        addAlertMessage1.classList.remove("show");
        addAlertMessage1.classList.remove("active");
    }, 1000);
}

function removeFromCartAlert(){
    let removeAlertMessage2 = document.querySelector(".cartAlert2");
    removeAlertMessage2.classList.add("active");
    setTimeout(function () {
        removeAlertMessage2.classList.add("show");
    }, 1);
    setTimeout(function () {
        removeAlertMessage2.classList.remove("show");
        removeAlertMessage2.classList.remove("active");
    }, 1000);
}