document.addEventListener("DOMContentLoaded", () => {

  const item = document.querySelector('.main-cart-item-wrapper');
        const footer = document.querySelector('.cart__footer-wrapper');
      
        if (item && footer) {
          // Create the wrapper div
          const wrapper = document.createElement('div');
          wrapper.className = 'custom-cart-wrapper';
      
          // Insert the wrapper before the first element
          item.parentNode.insertBefore(wrapper, item);
      
          // Move both elements into the wrapper
          wrapper.appendChild(item);
          wrapper.appendChild(footer);
        }

   initSimpleFadeSlider();
  window.cartFreeProduct("refresh");
  window.checkGiftLogic("refresh");
  window.gift_for_all_product("refresh");
  setTimeout(function () {
    try {
      document
        .querySelector(".template-page_bundle")
        .classList.remove("loading_content");
    } catch (error) {}
  }, 4500);
  setInterval(() => {
    document.querySelectorAll(".SI_trigger").forEach((el) => {
      if (el.innerHTML.trim() !== "Notify me") {
        el.innerHTML = "Notify me";
      }
    });
  }, 100);
  let deviceClass = "desktop";
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipod/.test(userAgent)) {
    deviceClass = "iphone";
  } else if (/ipad/.test(userAgent)) {
    deviceClass = "ipad";
  } else if (/android/.test(userAgent)) {
    deviceClass = "android";
  } else if (/windows phone/.test(userAgent)) {
    deviceClass = "windows-phone";
  } else if (/macintosh|mac os x/.test(userAgent) && "ontouchend" in document) {
    deviceClass = "ipad";
  } else if (/tablet|playbook|silk/.test(userAgent)) {
    deviceClass = "tablet";
  }
  document.body.classList.add(deviceClass);
  document.addEventListener("click", function (event) {
    const btn = event.target.closest(".readmore_btn");
    if (!btn) return;
    const wrap = btn.closest(".read_more_wrap");
    const content = wrap.querySelector(".readmoretxt");
    if (!content) return;
    if (content.style.display === "none" || !content.style.display) {
      content.style.display = "block";
      wrap.classList.add("active");
      btn.innerHTML = "Read less";
    } else {
      content.style.display = "none";
      wrap.classList.remove("active");
      btn.innerHTML = "Read more";
    }
  });
  document.addEventListener("click", async (event) => {
    const opener = event.target.closest(".qv_opener");
    if (!opener) return;
    const handle = opener.getAttribute("data-handle");
    if (!handle) return;
    document.querySelectorAll(".qv_opener").forEach((el) => {
      el.classList.remove("loader");
    });
    opener.classList.add("loader");
    try {
      const response = await fetch(`/products/${handle}?view=qv`);
      const html = await response.text();
      const modalBody = document.querySelector(".qv_modal__body");
      if (!modalBody) {
        console.error("Modal body not found!");
        return;
      }
      modalBody.innerHTML = html;
      const modalWrapper = document.querySelector(".qv_modal__wrapper");
      if (modalWrapper) {
        modalWrapper.classList.add("open");
        document.querySelector("body").classList.add("overflow-hidden");
        document.querySelector("html").classList.add("overflow-hidden");
      }
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (
            document.querySelector(".qv_thumb_media") &&
            document.querySelector(".qv_main_media")
          ) {
            initSwipers();
          } else {
            // console.warn("Swiper elements not found!");
          }
          _swat.initializeActionButtons("body");
        }, 100);
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  });
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".qv_addtocart");
    if (!btn) return;
    btn.classList.add("loader");
    // console.log("quick_view >>");
    const productId = btn.getAttribute("data-id");
    const bp2get1 = btn.getAttribute("data-bp2get1");
    if (!productId) {
      console.error("Product ID not found!");
      return;
    }
    const properties = bp2get1 ? { __bp2get1: "yes" } : null;
    const data = [{ id: productId, quantity: 1, properties }];
    multipleATC(data, !0);
  });
  document.addEventListener("click", function (event) {
    const codeElement = event.target.closest(".copytext");
    if (!codeElement) return;
    document.querySelectorAll(".copytext").forEach((el) => {
      el.innerText = "Copy";
    });
    codeElement.innerText = "Copied!";
    const closestWrap = codeElement.closest(".content-wrapp");
    const textToCopy = closestWrap?.querySelector(".textToCopy")?.innerText;
    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setTimeout(() => {
            codeElement.innerText = "Copy";
          }, 1500);
        })
        .catch((err) => {
          console.error("Copy failed:", err);
        });
    }
  });
  const updateElements = () => {
    const isDesktop = window.innerWidth > 990;
    const input = document.getElementById(
      isDesktop ? "Search-In-Modal-1" : "Search-In-Modal"
    );
    const searchBox = document.getElementById(
      isDesktop ? "search-box" : "mob-search-box"
    );
    if (!input || !searchBox) return;
    const enableAndFocusInput = () => {
      if (
        input.style.display !== "none" &&
        getComputedStyle(input).display !== "none"
      ) {
        input.removeAttribute("readonly");
        input.click();
        requestAnimationFrame(() => input.focus());
        // console.log("Input is focused");
        document.querySelector("html").classList.add("search_popup-open");
      } else {
        // console.log("Input is not visible yet");
      }
    };
    const observer = new MutationObserver(() => {
      if (
        input.offsetParent !== null ||
        getComputedStyle(input).display !== "none"
      ) {
        enableAndFocusInput();
        observer.disconnect();
      }
    });
    observer.observe(input, {
      attributes: !0,
      attributeFilter: ["style", "class"],
    });
    searchBox.addEventListener("focus", enableAndFocusInput);
    searchBox.addEventListener("click", enableAndFocusInput);
  };
  updateElements();
  window.addEventListener("resize", updateElements);
  var checkSwatInterval = setInterval(function () {
    try {
      if (_swat) {
        clearInterval(checkSwatInterval);
        console.log("_swat is loaded, initializing action buttons...");
        _swat.initializeActionButtons("body");
      }
    } catch (error) {}
  }, 100);
  document.addEventListener("click", async function (event) {
    window.bp2g1gift_product();
    init_cc_slide();
    // console.log("test-click");
    const button = event.target.closest(".sp_btn");
    if (button) {
      if (document.querySelector(".sp_btn.loading")) return;
      button.classList.add("loading");
      const allRemoveButtons = document.querySelectorAll(".sp_btn.to_remove");
      const rmvdata = [];
      const data = [];
      allRemoveButtons.forEach((removeBtn) => {
        const key = removeBtn.getAttribute("data-cart-key");
        if (key) {
          rmvdata.push(`${key}|0`);
        }
      });
      const id = button.getAttribute("data-id");
      const mgs = button.getAttribute("data-message");
      if (!button.classList.contains("to_remove")) {
        data.push({
          id: id,
          quantity: 1,
          properties: {
            __source: "sample_product",
            __freeproduct: "gift",
            Note: mgs,
          },
        });
      }
      // console.log({ rmvdata, data });
      if (rmvdata.length) {
        await removeItems(rmvdata);
      }
      if (data.length) {
        await multipleATC(data);
      }
      window.refreshCart();
    }
    const newbutton = event.target.closest(".new_sp_btn");
    if (newbutton) {
      if (document.querySelector(".new_sp_btn.loading")) return;
      newbutton.classList.add("loading");
      const allRemoveButtons1 = document.querySelectorAll(
        ".new_sp_btn.to_remove"
      );
      const rmvdata1 = [];
      const data1 = [];
      allRemoveButtons1.forEach((removeBtn) => {
        const key1 = removeBtn.getAttribute("data-cart-key");
        if (key1) {
          rmvdata1.push(`${key1}|0`);
        }
      });
      // console.log(allRemoveButtons1);
      const id = newbutton.getAttribute("data-id");
      const mgs = newbutton.getAttribute("data-message");
      if (!newbutton.classList.contains("to_remove")) {
        data1.push({
          id: id,
          quantity: 1,
          properties: { __source: "sample_product", __newfreeproduct: "gift" },
        });
      }
      // console.log({ rmvdata1, data1 }, "tttttt----");
      if (rmvdata1.length) {
        await removeItems(rmvdata1);
      }
      if (data1.length) {
        // console.log("(data1.length", data1.length);
        await multipleATC(data1);
      }
      window.refreshCart();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.closest(".freegixtcheckbox")) {
      const wrap = event.target.closest(".sample_products_wrap");
      const sampleProducts = wrap.querySelector(".sample_products");
      if (event.target.checked && sampleProducts) {
        sampleProducts.style.display = "flex";
      } else {
        sampleProducts.style.display = "none";
      }
    }
  });
  init_cc_slide();
  document.querySelectorAll(".pack_radio").forEach((radio) => {
    radio.addEventListener("change", function () {
      document
        .querySelectorAll(".product_pack")
        .forEach((pack) => pack.classList.remove("active"));
      this.closest(".product_pack").classList.add("active");
      const pack = this.value;
      const variantId = this.getAttribute("data-variant-id");
      document.querySelector(
        ".product__info-wrapper .product-form .product-variant-id"
      ).value = variantId;
      // console.log(variantId);
      // console.log(pack);
    });
  });
  window.b2g1gift_product = async () => {
    try {
      document
        .querySelector(".cart__checkout-button.button")
        .classList.add("checking");
      let cartData = await fetch("/cart.js");
      let cartData_json = await cartData.json();
      let totalAmount = 0;
      let hasB2G1Product = !1;
      let productgift = !1;
      cartData_json.items.forEach((item) => {
        if (item.properties && item.properties._b2g1_product) {
          totalAmount += item.original_line_price;
          hasB2G1Product = !0;
        }
        if (item.final_line_price == 0 && !item.properties._GiftWrap) {
          productgift = !0;
        }
      });
      var b2g1_cart_total = totalAmount / 100;
      var b2g1_max_amount = window.b2g1_max_amount;
      let b2g1_gift_product = window.b2g1_gift_product;
      let gift_product_cart = cartData_json.items.some(
        (item) => item.id === b2g1_gift_product
      );
      if (gift_product_cart == !1) {
        if (
          b2g1_cart_total > b2g1_max_amount &&
          hasB2G1Product == !0 &&
          productgift == !0
        ) {
          // document.querySelector(".cart__checkout-button.button").disabled = !0;
          window.checkout_btn_loading();
          addgiftProduct(b2g1_gift_product);
        } else {
        }
      }
      if (productgift == !1) {
        // document.querySelector(".cart__checkout-button.button").disabled = !0;
        window.checkout_btn_loading();
        remove_gift_product(b2g1_gift_product);
      }
      document
        .querySelector(".cart__checkout-button.button")
        .classList.remove("checking");
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  document.querySelectorAll(".highlights-points li").forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("data-id");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({ top: targetElement.offsetTop, behavior: "smooth" });
      }
    });
  });
});
function cartAddMultipleProducts(free_buy1product2, free_buy2product2) {
  let products = [
    {
      id: free_buy1product2,
      quantity: 1,
      properties: { _GiftWrap: "b2g1gift_product" },
    },
    {
      id: free_buy2product2,
      quantity: 1,
      properties: { _GiftWrap: "b2g1gift_product" },
    },
  ];
  console.log(products, "Adding multiple products >>>>>");
  setTimeout(function () {
    // document.querySelector(".cart__checkout-button.button").disabled = !0;
    window.checkout_btn_loading();
  }, 500);
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: JSON.stringify({ items: products }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      // console.log("Added products mullti >>>>>>", data);
      var cartItems = data.items;
      const giftProductIds = cartItems
        .filter(
          (item) =>
            item.properties && item.properties._GiftWrap === "b2g1gift_product"
        )
        .map((item) => item.id);
      // console.log(giftProductIds);
      if (cartItems[0].quantity == 2) {
        removeMultipleGiftProducts(giftProductIds, 1);
      }
      if ($(".template__cart").length) {
        window.cart_refresh(); //window.location.href="/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    },
    error: function (error) {
      console.error("Error adding products:", error);
    },
  });
}
function cartaddgiftProduct(variant_id, cartVariantIds = []) {
  const isInCart = cartVariantIds.includes(variant_id.toString()); // Replace with actual variant ID
  // console.log(cartVariantIds,"---cartVariantIds",isInCart,variant_id);

  if (isInCart) {
    managed_gift_product(variant_id, "cartaddgiftProduct");
    // console.log("Variant is already in the cart.");
    return false;
  }
  // console.log(variant_id, "variant_id>>>>>");
  setTimeout(function () {
    // document.querySelector(".cart__checkout-button.button").disabled = !0;
    window.checkout_btn_loading();
  }, 50);
  fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: variant_id,
      quantity: 1,
      properties: { _GiftWrap: "b2g1gift_product" },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.quantity >= 1) {
        managed_gift_product(data.id, "cartaddgiftProduct inner");
        return false;
      }
      // console.log("added>>>>>>>>", data);
      if (document.querySelector(".template__cart")) {
        window.cart_refresh(); //window.location.href="/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    })
    .catch((error) => console.error("Error adding gift product:", error));
}
function removeMultipleGiftProducts(giftProductIds, qty) {
  // console.log("Removing gift products:", giftProductIds);
  setTimeout(function () {
    // document.querySelector(".cart__checkout-button.button").disabled = !0;
    window.checkout_btn_loading();
  }, 500);
  if (!Array.isArray(giftProductIds) || giftProductIds.length === 0) {
    // console.error("Invalid giftProductIds format");
    return;
  }
  let removalRequests = giftProductIds.map((giftProductId) => {
    return { id: giftProductId.toString(), quantity: qty };
  });
  $.ajax({
    type: "POST",
    url: "/cart/update.js",
    data: JSON.stringify({
      updates: Object.fromEntries(
        removalRequests.map((item) => [item.id, item.quantity])
      ),
    }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      // console.log("Removed products >>>>>>", data);
      if ($(".template__cart").length) {
        window.cart_refresh(); //window.location.href="/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    },
    error: function (error) {
      console.error("Error removing gift products:", error);
    },
  });
}
function addgiftProduct(variant_id) {
  // console.log(variant_id, "variant_id>>>>>");
  setTimeout(function () {
    // document.querySelector(".cart__checkout-button.button").disabled = !0;
    window.checkout_btn_loading();
  }, 500);
  fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: variant_id,
      quantity: 1,
      properties: { _GiftWrap: "b2g1gift_product" },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.quantity == 2) {
        managed_gift_product(data.id, "addgiftProduct");
      }
      if (document.querySelector(".template__cart")) {
        window.cart_refresh(); //window.location.href="/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    })
    .catch((error) => console.error("Error adding gift product:", error));
}

function remove_gift_product(giftLineItemKey) {
  // console.log("🗑 Removing gift with key:", giftLineItemKey);

  if (!giftLineItemKey || typeof giftLineItemKey !== "string") {
    console.error("❌ Invalid giftProductId format:", giftLineItemKey);
    return;
  }

  fetch("/cart/change.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: giftLineItemKey, quantity: 0 }),
  })
    .then((res) => res.json())
    .then(() => {
      // console.log("✅ Gift removed");
      if (typeof window.refreshCart === "function") {
        window.refreshCart();
      }

      if (document.querySelector(".template__cart")) {
        window.cart_refresh(); //window.location.href="/cart";
      }
    })
    .catch((err) => console.error("❌ Error removing gift:", err));
}

function managed_gift_product(giftProductId, source = "") {
  console.log("giftProductId>>>>", giftProductId, source);
  setTimeout(function () {
    // document.querySelector(".cart__checkout-button.button").disabled = !0;
    window.checkout_btn_loading();
  }, 500);
  if (typeof giftProductId !== "string" && !Number.isInteger(giftProductId)) {
    console.error("Invalid giftProductId format");
    return;
  }
  const formattedId =
    typeof giftProductId === "number"
      ? giftProductId.toString()
      : giftProductId;
  fetch("/cart/change.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: formattedId, quantity: 1 }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (document.querySelector(".template__cart")) {
        window.cart_refresh(); //window.location.href="/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    })
    .catch((error) => console.error("Error adding gift product:", error));
}
function closeQuickView() {
  const modalWrapper = document.querySelector("#qv_modal__wrapper");
  if (modalWrapper) {
    modalWrapper.classList.remove("open");
    document.querySelectorAll(".qv_opener").forEach((el) => {
      el.classList.remove("loader");
    });
    document.querySelector(".qv_addtocart").classList.add("loader");
    document.querySelector("body").classList.remove("overflow-hidden");
    document.querySelector("html").classList.remove("overflow-hidden");
  } else {
    console.warn("Modal wrapper not found!");
  }
}
// console.log("quick add >>");

function initSwipers() {
  const thumbSwiper = new Swiper(".qv_thumb_media", {
    loop: !0,
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: !0,
    watchSlidesProgress: !0,
  });
  new Swiper(".qv_main_media", {
    loop: !0,
    spaceBetween: 0,
    slidesPerView: 1,
    navigation: {
      nextEl: ".qv-swiper-button-next",
      prevEl: ".qv-swiper-button-prev",
    },
    scrollbar: { el: ".qv-swiper-scrollbar", hide: !1 },
    thumbs: { swiper: thumbSwiper },
  });
}
async function multipleATC(data, r_c = !1) {
  try {
    const items = data.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      properties: item.properties,
    }));
    const formData = { items };
    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const result = await response.json();
      setTimeout(() => {
        if (r_c) {
          closeQuickView();
          window.refreshCart();
        }
        document.querySelector("#cart-icon-bubble").click();
      }, 0);
      window.refreshCart();
      if (document.querySelector(".template__cart")) {
        window.cart_refresh(); //window.location.href="/cart";
      }
    } else {
      console.error("Failed to add items:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding items:", error);
  }
}
async function removeItems(productIDS) {
  try {
    // console.log("Removing items:", productIDS);
    if (productIDS.length) {
      const formData = { updates: {} };
      productIDS.forEach((product) => {
        const [id, qty] = product.split("|");
        formData.updates[parseInt(id, 10)] = parseInt(qty, 10);
      });
      // console.log("FormData:", formData);
      const response = await fetch("/cart/update.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const cart = await response.json();
        if (document.querySelector(".template__cart")) {
          window.cart_refresh(); //window.location.href="/cart";
        }
        // console.log("Updated cart:", cart);
      } else {
        console.error("Failed to update cart:", response.statusText);
      }
    }
  } catch (error) {
    console.error("Error removing items:", error);
  }
}
window.refreshCart = () => {
  fetch(`${routes.cart_url}?section_id=cart-drawer`)
    .then((response) => response.text())
    .then((responseText) => {
      const html = new DOMParser().parseFromString(responseText, "text/html");
      // console.log("html:", html);
      const count = parseInt(
        html.querySelector("cart-drawer-items")?.getAttribute("item_count") ||
          "0",
        10
      );
      // console.log("count:", count);
      const selectors = [
        ".drawer__inner",
        "cart-drawer-items",
        ".cart-drawer__footer",
        ".sample_products_wrap",
        ".pdp__sample_snippets",
      ];
      //document.querySelector(".cart__checkout-button.button").disabled = !1;
      const checkoutButton = document.querySelector(
        "button.cart__checkout-button"
      );
      setTimeout(function () {
        document.querySelector(".add-load").classList.remove("loader-cls");
        document
          .querySelector(".drawer__inner")
          .classList.remove("loader-wrap-cls");
      }, 1000);
      if (checkoutButton) {
        checkoutButton.disabled = !1;
      }
      const cartDrawer = document.querySelector("cart-drawer");
      if (cartDrawer) {
        if (count > 0) {
          cartDrawer.classList.remove("is-empty");
          document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
            bubble.classList.remove("hidden");
          });
        } else {
          cartDrawer.classList.add("is-empty");
          document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
            bubble.classList.add("hidden");
          });
        }
      }
      for (const selector of selectors) {
        const targetElement = document.querySelector(selector);
        const sourceElement = html.querySelector(selector);
        // console.log({ targetElement, sourceElement, selector }, "<<<sourceElement");
        if (selector == ".pdp__sample_snippets") {
          window.samplePDPRefresh();
        } else {
          if (targetElement && sourceElement) {
            targetElement.replaceWith(sourceElement);
          }
        }
      }
      document
        .querySelectorAll(".cart-count-bubble span:first-child")
        .forEach((bubble) => {
          bubble.textContent = count;
        });
      const totalItemElement = document.querySelector(".ttl_item");
      if (totalItemElement) {
        totalItemElement.textContent = count;
      }
      // console.log("Cart drawer refreshed");
      $(".cart-item").each(function () {
        var has_class = $(this).hasClass("item__pre-order");
        var parentContainer = $(this).closest("cart-drawer-items");
        var preorderHeading = parentContainer.find(".pincode-heading p");
        var preorderInput = parentContainer.find(".input-group");
        // console.log(has_class);
        if (has_class) {
          $(".cart-pre-order").show();
          preorderHeading.hide();
          preorderInput.hide();
        }
      });
      init_cc_slide();
      _swat && _swat.initializeActionButtons("body");
      if (typeof window.initlizeTimer === "function") {
        window.initlizeTimer();
      }
      setTimeout(function () {
        if (document.querySelectorAll(".to_remove").length) {
          document.querySelectorAll(".freegixtcheckbox").forEach((checkbox) => {
            checkbox.checked = !0;
          });
          document.querySelectorAll(".sample_products").forEach((element) => {
            element.style.display = "flex";
          });
        }
      }, 100);
      try {
      } catch (err) {
        console.error("Error updating widgets:", err);
      }
    })
    .catch((error) => {
      console.error("Error refreshing cart:", error);
    });
  window.bp2g1gift_product();
  window.cartFreeProduct();
  window.gift_for_all_product();
  const checkoutButtons = document.querySelectorAll(
    ".cart__checkout-button.button"
  );
  checkoutButtons.forEach((button) => {
    button.classList.add("checking");
    button.disabled = true;
  });
  const qtyButtons = document.querySelectorAll(".quantity__button");
  const removeButton = document.querySelectorAll(".cart-remove-button");
  qtyButtons.forEach((qbutton) => {
    qbutton.disabled = true;
  });
  removeButton.forEach((rbutton) => {
    rbutton.disabled = true;
  });
  setTimeout(function () {
    const qtyButtons = document.querySelectorAll(".quantity__button");
    const removeButton = document.querySelectorAll(".cart-remove-button");
    qtyButtons.forEach((qbutton) => {
      qbutton.disabled = false;
    });
    removeButton.forEach((rbutton) => {
      rbutton.disabled = false;
    });
    const checkoutButtons = document.querySelectorAll(
      ".cart__checkout-button.button"
    );
    checkoutButtons.forEach((button) => {
      button.classList.add("checking");
      //button.disabled = false;
    });
  }, 1500);
};

window.samplePDPRefresh = () => {
  fetch(`${routes.cart_url}?section_id=cart-drawer`)
    .then((response) => response.text())
    .then((responseText) => {
      const html = new DOMParser().parseFromString(responseText, "text/html");
      const cartDrawerItems = html.querySelector("cart-drawer-items");
      const count = cartDrawerItems
        ? parseInt(cartDrawerItems.getAttribute("item_count")) || 0
        : 0;
      const sESample = html.querySelector(".sample_products_wrap");
      const sESamplCon = document.querySelector(
        ".pdp__sample_snippets .sample_products_wrap"
      );
      const selectors = [".pdp__sample_snippets"];
      // console.log(count + "---count");
      if (count > 0) {
        document.querySelector("cart-drawer")?.classList.remove("is-empty");
        document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
          bubble.classList.remove("hidden");
        });
      } else {
        document.querySelector("cart-drawer")?.classList.add("is-empty");
        document.querySelectorAll(".cart-count-bubble").forEach((bubble) => {
          bubble.classList.add("hidden");
        });
      }
      for (const selector of selectors) {
        try {
          const targetElement = document.querySelector(selector);
          const sourceElement = html.querySelector(selector);
          if (targetElement && sourceElement) {
            targetElement.replaceWith(sourceElement);
          }
          if (selector === ".pdp__sample_snippets") {
            setTimeout(function () {
              const targetElement_s = document.querySelectorAll(
                ".pdp__sample_snippets"
              );
              if (targetElement_s && sourceElement) {
                targetElement_s.forEach((el) => {
                  // console.log(el, sourceElement, "<<<<el");
                  el.replaceWith(sourceElement);
                  el.style.display = "block";
                });
              }
            }, 300);
          }
        } catch (error) {
          console.error(
            `Error replacing elements for selector: ${selector}`,
            error
          );
        }
      }
      document
        .querySelectorAll(".cart-count-bubble span:first-child")
        .forEach((bubble) => {
          bubble.innerHTML = count;
        });
      const cartBubble = document.querySelector(".cart-count-bubble");
      if (cartBubble) cartBubble.innerHTML = count;
      setTimeout(() => {
        if (document.querySelectorAll(".to_remove").length) {
          document.querySelectorAll(".freegixtcheckbox").forEach((checkbox) => {
            checkbox.checked = !0;
          });
          document.querySelectorAll(".sample_products").forEach((element) => {
            element.style.display = "flex";
          });
        }
      }, 1);
      // console.log("Cart drawer refreshed samplePDPRefresh");
      init_cc_slide();
      _swat && _swat.initializeActionButtons("body");
    })
    .catch((e) => {
      console.error("Error refreshing cart drawer:", e);
    });
};
function init_cc_slide() {
  // console.log("Checking if Swiper is initialized...");
  var sliderElement = document.querySelector(".cart-collection-slider");
  if (!sliderElement) return console.warn("Slider element not found!");
  if (sliderElement.swiper) {
    window.initFadeTextSlider();
    // console.log("Swiper is already initialized.");
    return;
  }
  // console.log("Initializing Swiper...");
  new Swiper(sliderElement, {
    loop: true,
    spaceBetween: 10,
    autoplay: { delay: 3000, disableOnInteraction: false },
    direction: "horizontal",
    breakpoints: { 0: { slidesPerView: 2 }, 768: { slidesPerView: 3 } },
  });
  setTimeout(function () {
    console.log("wislissss load");
    try {
      _swat.initializeActionButtons("body");
    } catch (error) {}
  }, 100);
}
setInterval(function () {
  if (document.querySelector(".shopify-section-header-sticky")) {
    document.querySelector(".search-modal.modal__content").style.top = "0";
  } else {
  }
}, 100);
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".blog_filter-link");
  const blogPosts = document.querySelectorAll(".blog-articles__article");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-handle");
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      blogPosts.forEach((post) => {
        const postTags = post.getAttribute("data-tags").split(",");
        if (filter === "all" || postTags.includes(filter)) {
          post.style.display = "block";
        } else {
          post.style.display = "none";
        }
      });
    });
  });
});
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/";
}
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [key, val] = cookies[i].split("=");
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

$(document).ready(function () {
  setTimeout(function () {
    $(".account__tooltip-wrap").hide();
  }, 5000);
  $(".link-list-menu__item").on("click", function () {
    $(this).parents("#menu-drawer").addClass("over-flow-hidden");
    $(this).parents("#menu-drawer").css("overflow", "hidden");
  });
  $(".linkmenu-drawer__close-button").on("click", function () {
    $(this).parents("#menu-drawer").removeClass("over-flow-hidden");
    $(this).parents("#menu-drawer").css("overflow", "auto");
  });

  //  $(document).on('click', '.on_click-menu', function() {
  //    setTimeout(function() {
  //       var drawer_height = $('.menu-drawer__navigation-container').height(),
  //           submenu_height = $('.menu-drawer__inner-submenu').height(),
  //           total_height = drawer_height + submenu_height;
  //       if ($('.submenu-open details').attr('open')) {
  //         $('.menu-drawer__inner-container').height(total_height + 20);
  //       } else {
  //         $('.menu-drawer__inner-container').height(drawer_height);
  //       }
  //    },500)
  // });
  // $(document).on('click','.header__ham--summary',function() {
  //   console.log('clickedd___burger');
  //   if($('body').hasClass('overflow-hidden-tablet')){
  //     $(this).parents('html').addClass('overflow-hidden-tablet');
  //   }else{
  //      $(this).parents('html').removeClass('overflow-hidden-tablet');
  //   }
  // })
  //$(".header__icon--cart").addClass("disable-cart");
});

$(window).on("load", function () {
  setTimeout(function () {
    $(".header__icon--cart").removeClass("disable-cart");
  }, 1000);
});

function getRecentSearches() {
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
}
// recently searched productsdocument.addEventListener("DOMContentLoaded", function () {
document.addEventListener("DOMContentLoaded", function () {
  $(".search-collection-wrapper .card__information .full-unstyled-link").each(
    function () {
      var maxLength = 35; // adjust as needed
      var text = $(this).text();
      if (text.length > maxLength) {
        $(this).text(text.substring(0, maxLength) + "...");
      }
    }
  );

  const forms = document.querySelectorAll(".search-modal__form");
  const MAX_RECENT = 5;

  function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  }

  function saveSearch(term) {
    let searches = getRecentSearches();
    searches = [term, ...searches.filter((s) => s !== term)].slice(
      0,
      MAX_RECENT
    );
    localStorage.setItem("recentSearches", JSON.stringify(searches));
  }

  function filterCategories(searchValue, categoryItems) {
    categoryItems.forEach((item) => {
      const title = item.getAttribute("data-title").toLowerCase();
      item.style.display = title.includes(searchValue) ? "list-item" : "none";
    });
  }

  function appendPredictiveResults(form) {
    setTimeout(() => {
      if (!form) return;
      const productWrapper = form.querySelector(
        ".predictive-search-products-wrap"
      );
      const targetProduct = form.querySelector(".product__search-result");
      if (productWrapper && targetProduct) {
        targetProduct.innerHTML = productWrapper.innerHTML;
      }

      const pageWrapper = form.querySelector(
        ".predictive-search__pages-wrapper"
      );
      const targetPage = form.querySelector(".page__search-result");
      if (pageWrapper && targetPage) {
        targetPage.innerHTML = pageWrapper.innerHTML;
      }
    }, 5000);
  }

  forms.forEach((form) => {
    const searchInput = form.querySelector(
      'input[type="search"].search__input'
    );
    const recentSearchesList = form.querySelectorAll(".recentSearches");
    const recentWrappers = form.querySelectorAll(".recent-search-wrapper");
    const categoryItems = form.querySelectorAll(".category_search--nav li");

    function showRecentSearches() {
      const searches = getRecentSearches();

      recentSearchesList.forEach((list) => (list.innerHTML = ""));

      if (searches.length === 0) {
        recentSearchesList.forEach((list) => (list.style.display = "none"));
        recentWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
      } else {
        searches.forEach((term) => {
          recentSearchesList.forEach((list) => {
            const li = document.createElement("li");
            li.textContent = term;
            li.style.cursor = "pointer";
            li.addEventListener("click", () => {
              searchInput.value = term;
              searchInput.form.submit();
            });
            list.appendChild(li);
          });
        });

        const itemCount =
          recentSearchesList[0]?.querySelectorAll("li").length || 0;

        if (itemCount >= 4) {
          recentSearchesList.forEach((list) => (list.style.display = "flex"));
          recentWrappers.forEach(
            (wrapper) => (wrapper.style.display = "block")
          );
        } else {
          recentSearchesList.forEach((list) => (list.style.display = "none"));
          recentWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
        }
      }

      filterCategories(searchInput.value.toLowerCase().trim(), categoryItems);
    }

    searchInput.addEventListener("focus", showRecentSearches);

    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase().trim();
      console.log("searchValue", searchValue);
      toggleCategoryWrapperDisplay();

      const popularCollection = form.querySelector(
        ".search-collection-wrap.popular-search-collection"
      );
      if (popularCollection)
        popularCollection.style.display = searchValue ? "none" : "block";

      const productResult = form.querySelector(".product__search-result");
      if (productResult)
        productResult.style.display = searchValue ? "block" : "none";

      const banner_image = form.querySelector(".wiz-banner-image-2");
      if (banner_image)
        banner_image.style.display = searchValue ? "block" : "none";

      const pageResult = form.querySelector(".page__search-result");
      if (pageResult) pageResult.style.display = searchValue ? "block" : "none";

      const firstPart = form.querySelector(".search-collection-first-part");
      if (firstPart) firstPart.style.display = searchValue ? "none" : "block";

      filterCategories(searchValue, categoryItems);
      appendPredictiveResults(form);

      const searches = getRecentSearches();

      recentWrappers.forEach((wrapper) => {
        wrapper.style.display = searchValue
          ? "none"
          : searches.length > 0
          ? "block"
          : "none";
      });

      recentSearchesList.forEach((list) => {
        list.style.display = searchValue
          ? "none"
          : searches.length > 0
          ? "flex"
          : "none";
      });
    });

    form.addEventListener("submit", () => {
      const term = searchInput.value.trim();
      if (term) saveSearch(term);
    });

    const resetButton = form.querySelector(".reset__button");

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        const selectorsToHide = [
          ".categories-search-wrapper",
          ".product__search-result",
          ".page__search-result",
          ".wiz-banner-image-2",
        ];

        selectorsToHide.forEach((selector) => {
          const element = form.querySelector(selector);
          if (element) {
            element.style.display = "none";
          }
        });

        const popularCollection = form.querySelector(
          ".search-collection-wrap.popular-search-collection"
        );
        if (popularCollection) {
          popularCollection.style.display = "block";
        }

        const searchfirstCollection = form.querySelector(
          ".search-collection-first-part"
        );
        if (searchfirstCollection) {
          searchfirstCollection.style.display = "block";
        }
      });
    }

    window.addEventListener("DOMContentLoaded", () => {
      const searchValue = searchInput?.value.toLowerCase().trim();
      if (searchValue) {
        const productResult = form.querySelector(".product__search-result");
        if (productResult && productResult.innerHTML.trim() !== "") {
          productResult.style.display = "block";
        }

        const pageResult = form.querySelector(".page__search-result");
        if (pageResult && pageResult.innerHTML.trim() !== "") {
          pageResult.style.display = "block";
        }

        const wrapper = form.querySelectorAll(".categories-search-wrapper");
        wrapper.forEach(w => {
            w.style.display = "block";
        });


        const popularCollection = form.querySelector(
          ".search-collection-wrap.popular-search-collection"
        );
        if (popularCollection) popularCollection.style.display = "none";

        const banner_image = form.querySelector(".wiz-banner-image-2");
        if (banner_image) banner_image.style.display = "block";

        const firstPart = form.querySelector(".search-collection-first-part");
        if (firstPart) firstPart.style.display = "none";

        recentWrappers.forEach((wrapper) => (wrapper.style.display = "none"));
        recentSearchesList.forEach((list) => (list.style.display = "none"));

        filterCategories(searchValue, categoryItems);
        appendPredictiveResults();
      }
    });
  });
});

function toggleCategoryWrapperDisplay() {
  const wrappers = document.querySelectorAll(".categories-search-wrapper");
  const searchInputs = document.querySelectorAll('input[type="search"].search__input');
  if (!wrappers.length || !searchInputs.length) return;
  searchInputs.forEach((input, index) => {
    const searchValue = input.value.trim().toLowerCase();
    const wrapper = wrappers[index];
    if (!wrapper) return;
    if (searchValue === "") {
      wrapper.style.display = "none";
      return;
    }
    const visibleLiExists = Array.from(wrapper.querySelectorAll("li")).some(
      (li) => window.getComputedStyle(li).display !== "none"
    );
    wrapper.style.display = visibleLiExists ? "block" : "none";
  });
}


setInterval(() => {
  $(".recent-search-wrapper").each(function () {
    const $r = $(this),
      count = $r.find("li").length;
    if (count >= 4) {
      $r.show().removeClass("hidden-wrapper");
    } else {
      $r.hide().addClass("hidden-wrapper");
    }
  });
}, 300);

window.cart_refresh = () => {
  window.checkout_btn_loading(true);
  fetch(`${routes.cart_url}`)
    .then((response) => response.text())
    .then((responseText) => {
      const html = new DOMParser().parseFromString(responseText, "text/html");
      const count = parseInt(
        html.querySelector("cart-drawer-items")?.getAttribute("item_count") ||
          "0",
        10
      );
      const selectors = [
        ".cart-page-progress",
        "cart-items",
        ".cart-top-wrapper .saving_ammount",
        "#main-cart-footer",
      ];
      // const checkoutButton = document.querySelector("button.cart__checkout-button");
      // if (checkoutButton) {
      //   checkoutButton.disabled = !1;
      // }
      for (const selector of selectors) {
        const targetElement = document.querySelector(selector);
        const sourceElement = html.querySelector(selector);
        console.log(
          { targetElement, sourceElement, selector },
          "<<<sourceElement"
        );
        if (targetElement && sourceElement) {
          targetElement.replaceWith(sourceElement);
        }
      }
      document
        .querySelectorAll(".cart-count-bubble span:first-child")
        .forEach((bubble) => {
          bubble.textContent = count;
        });
      const totalItemElement = document.querySelector(".ttl_item");
      if (totalItemElement) {
        totalItemElement.textContent = count;
      }
      console.log("Cart Page refreshed");
    })
    .catch((error) => {
      console.error("Error refreshing cart:", error);
    })
    .finally(() => {
      window.checkout_btn_loading(false);
      window.cartFreeProduct();

      try {
        document
          .querySelectorAll(".empty-cartPage-slider")
          .forEach(function (sliderElement) {
            if (sliderElement.swiper) return;

            new Swiper(sliderElement, {
              slidesPerView: 2,
              spaceBetween: 16,
              navigation: {
                nextEl: sliderElement.querySelector(".swiper-button-next"),
                prevEl: sliderElement.querySelector(".swiper-button-prev"),
              },
              breakpoints: {
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 5,
                },
              },
            });

            console.log("Swiper initialized for:", sliderElement);
          });
      } catch (error) {
        console.warn(error);
      }
    });
};

window.checkout_btn_loading = (flag = true) => {
  if (flag) {
    document
      .querySelectorAll(".cart__checkout-button.button")
      .forEach((el) => (el.disabled = true));
    document
      .querySelectorAll(".magic-cart-btn__parent")
      .forEach((el) => el.classList.add("btn-disabled"));
  } else {
    document
      .querySelectorAll(".cart__checkout-button.button")
      .forEach((el) => (el.disabled = false));
    document
      .querySelectorAll(".magic-cart-btn__parent")
      .forEach((el) => el.classList.remove("btn-disabled"));
  }
};


/// fadeIn FadeOut Product Tag
function initSimpleFadeSlider({
  wrapperSelector = '.fade-text-wrapper',
  tagSelector = '.fade-tag',
  intervalTime = 2500,
} = {}) {
  document.querySelectorAll(wrapperSelector).forEach((wrapper) => {
    const tags = wrapper.querySelectorAll(tagSelector);
    if (tags.length <= 1) return;

    let current = 0;

    function showTag(index) {
      tags.forEach((tag, i) => {
        tag.classList.toggle('active', i === index);
      });
    }

    showTag(current);
    setInterval(() => {
      current = (current + 1) % tags.length;
      showTag(current);
    }, intervalTime);
  });
}
// end fadeIn FadeOut Product Tag

// cart drawer and cart page threshold bar
window.cartFreeProduct = async (type = "ajax") => {
  try {
    // Disable checkout buttons
    const checkoutButtons = document.querySelectorAll(".cart__checkout-button.button");
    checkoutButtons.forEach((button) => {
      button.classList.add("checking");
      button.disabled = true;
    });

    // Enable quantity/remove buttons after slight delay
    setTimeout(() => {
      document.querySelectorAll('.quantity__button, .cart-remove-button').forEach(btn => {
        btn.disabled = false;
      });
    }, 500);

    // Fetch cart data
    const cartRes = await fetch("/cart.js");
    const cartData = await cartRes.json();
    const cartTotal = cartData.items_subtotal_price / 100;
    const cartVariantIds = cartData.items.map((item) => item.variant_id.toString());

    // Remove all products if cart is empty
    if (cartTotal === 0 && cartData.items.length > 0) {
      remove_gift_product(window.all_free_product);
    }

    // Get variant threshold data
    const thresholdProducts = Array.from(document.querySelectorAll(".threshold_products")).map((el) => ({
      threshold: parseInt(el.dataset.threshold, 10),
      variantId: el.dataset.variantid
    }));

    // Determine which variants to add based on cart total
    let variantIndexesToAdd = [];
    if (cartTotal >= 3999) {
      variantIndexesToAdd = [0, 1, 3];
    } else if (cartTotal >= 1999) {
      variantIndexesToAdd = [0, 1, 2];
    } else if (cartTotal >= 1499) {
      variantIndexesToAdd = [0, 1];
    } else if (cartTotal >= 999) {
      variantIndexesToAdd = [0];
    }

    console.log(cartTotal,"---cartTotal---");

    const eligibleVariants = variantIndexesToAdd.map(i => thresholdProducts[i]?.variantId).filter(Boolean);
    const allThresholdVariantIds = thresholdProducts.map(p => p.variantId);

    console.log("eligibleVariants--",eligibleVariants);

    // Check product tags to restrict free gifts
    const relevantTags = [
      "__b2g1_product2", "Affiliate", "B2G1+Freegift", "b2g1_product", "B2G2",
      "B3G2", "bundle_FPH", "Buy3", "buy3at799", "offer 2"
    ];
    const mdayloyalTags = ["Mdayloyal"];

    // const hasRestrictedTag = cartData.items.some((item) =>
    //   window.products?.[item.product_id]?.tags?.some(tag => relevantTags.includes(tag))
    // );
    const hasRestrictedTag = cartData.items.some((item) =>
      item.properties && Object.values(item.properties).some((propValue) =>
        relevantTags.includes(propValue)
      )
    );
    const hasMdayLoyalTag = cartData.items.some((item) =>
      window.products?.[item.product_id]?.tags?.some(tag => mdayloyalTags.includes(tag))
    );

    const promises = [];

    // Remove ineligible threshold gifts
    for (const item of cartData.items) {
      const variantIdStr = item.variant_id.toString();
      if (allThresholdVariantIds.includes(variantIdStr) && !eligibleVariants.includes(variantIdStr)) {
        console.log("--remove_product");
        try {
          await remove_gift_product(variantIdStr);
        } catch (err) {
          console.error(`❌ Failed to remove gift ${variantIdStr}:`, err);
        }
      }
    }
     if(!hasRestrictedTag){
    // Add or update eligible gift variants
    for (const variantId of eligibleVariants) {
      const existingItem = cartData.items.find(item => item.variant_id.toString() === variantId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          try {
            await updateCartQuantity(existingItem.key, 1); // Reduce quantity to 1 if >1
          } catch (err) {
            console.error(`❌ Failed to update quantity for ${variantId}:`, err);
          } finally {
            if (document.querySelector(".template__cart")) {
        window.cart_refresh();
      }
          }
        }
      } else {
        try {
          await cartaddgiftProduct(variantId); // Add with quantity = 1
        } catch (err) {
          console.error(`❌ Failed to add gift ${variantId}:`, err);
        }
      }
    }
     }
    // If tag rules are violated, remove all gifts
    if (hasRestrictedTag || hasMdayLoyalTag) {
      for (const item of cartData.items) {
        if (allThresholdVariantIds.includes(item.variant_id.toString())) {
          promises.push(remove_gift_product(item.variant_id.toString()));
        }
      }
    }

    await Promise.all(promises);

    // Re-enable checkout buttons
    setTimeout(() => {
      document.querySelectorAll(".cart__checkout-button.button").forEach((button) => {
        button.classList.remove("checking");
        button.disabled = false;
      });
    }, 3000);

  } catch (error) {
    console.error("❌ Error in cartFreeProduct:", error);
  }
};
// end code cart drawer and cart page threshold bar

// add one gift to any product 
window.gift_for_all_product = () => {
  if (!window.enable_all_free_product) return;

  const giftVariantId = window.all_free_product;
  const bp2g1GiftId = window.showergel_gift;
  console.log(giftVariantId,"--freegiftVariantId");

  fetch("/cart.js")
    .then(res => res.json())
    .then(async (cart) => {
      const cartTotal = cart.total_price > 0;

      const hasBP2G1Gift = cart.items.some(item => item.id === bp2g1GiftId);
      const giftItem = cart.items.find(item => item.variant_id === giftVariantId);
      const giftInCart = !!giftItem;

      if (cartTotal && !giftInCart) {
        await cartaddgiftProduct(giftVariantId);
      }
    else if (giftInCart && giftItem.quantity > 1) {
        console.log("🔁 Updating B2G1 gift quantity to 1");
        await updateCartQuantity(giftItem.key, 1);

      if (document.querySelector(".template__cart")) {
        window.cart_refresh();
      }
      }
      
      else if (!cartTotal && giftInCart) {
        // console.log(" Removing all-free gift");
       await remove_gift_product(giftItem.key);
      } else {
        console.log(" All-gift logic: No action needed");
      }
    });
};
// end add one gift to any product 


// 🔧 Helper: update quantity
async function updateCartQuantity(itemKey, newQty) {
  return fetch("/cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: itemKey, quantity: newQty })
  });
}
// buy 2 get 1 gift product
 window.bp2g1gift_product = () => {
  fetch("/cart.js")
    .then(res => res.json())
    .then(async (cart) => {
      const bp2g1GiftVariantId = window.showergel_gift;
      let totalQty = 0;
      let hasQualified = false;

      cart.items.forEach(item => {
        if (item.properties?.__bp2get1) {
          totalQty += item.quantity;
          hasQualified = true;
        }
      });

      const giftItem = cart.items.find(item => item.variant_id === bp2g1GiftVariantId);
      const giftInCart = !!giftItem;

      
      if (hasQualified && totalQty >= 2 && !giftInCart) {
        console.log("🎁 Adding B2G1 gift");
        await cartaddgiftProduct(bp2g1GiftVariantId); // adds with quantity 1
      }

    
      else if ((!hasQualified || totalQty < 2) && giftInCart) {
        console.log("🗑 Removing B2G1 gift");
        await remove_gift_product(giftItem.key);
      }

     
      else if (giftInCart && giftItem.quantity > 1) {
        console.log("🔁 Updating B2G1 gift quantity to 1");
        await updateCartQuantity(giftItem.key, 1);
        if (document.querySelector(".template__cart")) {
        window.cart_refresh();
      }
      }

      // Else → No change needed
    })
    .catch(err => {
      console.error("Error in bp2g1gift_product:", err);
    });
};
// end buy 2 get 1 gift product
 window.checkGiftLogic = () => {
console.log("Running gift logic checks...");
if (typeof window.bp2g1gift_product === "function") window.bp2g1gift_product();
};