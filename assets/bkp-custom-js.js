document.addEventListener("DOMContentLoaded", () => {
  window.bp2g1gift_product("refresh");
  window.cartFreeProduct("refresh");
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
            console.warn("Swiper elements not found!");
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
    console.log("quick_view >>");
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
        console.log("Input is focused");
      } else {
        console.log("Input is not visible yet");
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
    console.log("test-click");
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
      console.log({ rmvdata, data });
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
      console.log(allRemoveButtons1);
      const id = newbutton.getAttribute("data-id");
      const mgs = newbutton.getAttribute("data-message");
      if (!newbutton.classList.contains("to_remove")) {
        data1.push({
          id: id,
          quantity: 1,
          properties: { __source: "sample_product", __newfreeproduct: "gift" },
        });
      }
      console.log({ rmvdata1, data1 }, "tttttt----");
      if (rmvdata1.length) {
        await removeItems(rmvdata1);
      }
      if (data1.length) {
        console.log("(data1.length", data1.length);
        await multipleATC(data1);
      }
      window.refreshCart();
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.classList.contains("freegixtcheckbox")) {
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
      console.log(variantId);
      console.log(pack);
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
          document.querySelector(".cart__checkout-button.button").disabled = !0;
          addgiftProduct(b2g1_gift_product);
        } else {
        }
      }
      if (productgift == !1) {
        document.querySelector(".cart__checkout-button.button").disabled = !0;
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
    document.querySelector(".cart__checkout-button.button").disabled = !0;
  }, 500);
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: JSON.stringify({ items: products }),
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      console.log("Added products mullti >>>>>>", data);
      var cartItems = data.items;
      const giftProductIds = cartItems
        .filter(
          (item) =>
            item.properties && item.properties._GiftWrap === "b2g1gift_product"
        )
        .map((item) => item.id);
      console.log(giftProductIds);
      if (cartItems[0].quantity == 2) {
        removeMultipleGiftProducts(giftProductIds, 1);
      }
      if ($(".template__cart").length) {
        window.location.href = "/cart";
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
function cartaddgiftProduct(variant_id) {
  console.log(variant_id, "variant_id>>>>>");
  setTimeout(function () {
    document.querySelector(".cart__checkout-button.button").disabled = true;
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
        managed_gift_product(data.id);
      }
      console.log("added>>>>>>>>", data);
      if (document.querySelector(".template__cart")) {
        window.location.href = "/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    })
    .catch((error) => console.error("Error adding gift product:", error));
}
function removeMultipleGiftProducts(giftProductIds, qty) {
  console.log("Removing gift products:", giftProductIds);
  setTimeout(function () {
    document.querySelector(".cart__checkout-button.button").disabled = !0;
  }, 500);
  if (!Array.isArray(giftProductIds) || giftProductIds.length === 0) {
    console.error("Invalid giftProductIds format");
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
      console.log("Removed products >>>>>>", data);
      if ($(".template__cart").length) {
        window.location.href = "/cart";
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
  console.log(variant_id, "variant_id>>>>>");
  setTimeout(function () {
    document.querySelector(".cart__checkout-button.button").disabled = !0;
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
        managed_gift_product(data.id);
      }
      if (document.querySelector(".template__cart")) {
        window.location.href = "/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    })
    .catch((error) => console.error("Error adding gift product:", error));
}
function remove_gift_product(giftProductId) {
  console.log("giftProductId", giftProductId);
  setTimeout(function () {
    document.querySelector(".cart__checkout-button.button").disabled = !0;
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
    body: JSON.stringify({ id: formattedId, quantity: 0 }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (document.querySelector(".template__cart")) {
        window.location.href = "/cart";
      } else {
        window.refreshCart();
      }
      init_cc_slide();
    })
    .catch((error) => console.error("Error adding gift product:", error));
}
function managed_gift_product(giftProductId) {
  console.log("giftProductId", giftProductId);
  setTimeout(function () {
    document.querySelector(".cart__checkout-button.button").disabled = !0;
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
        window.location.href = "/cart";
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
console.log("quick add >>");
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
    } else {
      console.error("Failed to add items:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding items:", error);
  }
}
async function removeItems(productIDS) {
  try {
    console.log("Removing items:", productIDS);
    if (productIDS.length) {
      const formData = { updates: {} };
      productIDS.forEach((product) => {
        const [id, qty] = product.split("|");
        formData.updates[parseInt(id, 10)] = parseInt(qty, 10);
      });
      console.log("FormData:", formData);
      const response = await fetch("/cart/update.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const cart = await response.json();
        console.log("Updated cart:", cart);
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
      console.log("html:", html);
      const count = parseInt(
        html.querySelector("cart-drawer-items")?.getAttribute("item_count") ||
          "0",
        10
      );
      console.log("count:", count);
      const selectors = [
        ".drawer__inner",
        "cart-drawer-items",
        ".cart-drawer__footer",
        ".sample_products_wrap",
        ".pdp__sample_snippets",
      ];
      document.querySelector(".cart__checkout-button.button").disabled = !1;
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
        console.log(
          { targetElement, sourceElement, selector },
          "<<<sourceElement"
        );
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
      console.log("Cart drawer refreshed");
      $(".cart-item").each(function () {
        var has_class = $(this).hasClass("item__pre-order");
        var parentContainer = $(this).closest("cart-drawer-items");

        // Within this container, find the elements to manipulate
        var preorderHeading = parentContainer.find(".pincode-heading p");
        var preorderInput = parentContainer.find(".input-group");
        console.log(has_class);
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

  // window.gift_for_all_product();
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
      console.log(count + "---count");
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
                  console.log(el, sourceElement, "<<<<el");
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
      console.log("Cart drawer refreshed samplePDPRefresh");
      init_cc_slide();
      _swat && _swat.initializeActionButtons("body");
    })
    .catch((e) => {
      console.error("Error refreshing cart drawer:", e);
    });
};
function init_cc_slide() {
  console.log("Checking if Swiper is initialized...");
  var sliderElement = document.querySelector(".cart-collection-slider");
  if (!sliderElement) return console.warn("Slider element not found!");
  if (sliderElement.swiper) {
    console.log("Swiper is already initialized.");
    return;
  }
  console.log("Initializing Swiper...");
  new Swiper(sliderElement, {
    loop: !0,
    spaceBetween: 10,
    slidesPerView: 2,
    autoplay: { delay: 3000, disableOnInteraction: !1 },
    direction: "horizontal",
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
    // document.querySelector(".search-modal.modal__content").style.top = "35px";
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

// Cookie helper functions
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
  setTimeout(function() {
    $('.account__tooltip-wrap').hide();
  },5000);
});
