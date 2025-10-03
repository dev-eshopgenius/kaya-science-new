window.collectionDisplayNames = {
  {% for collection in collections %}
    "{{ collection.handle }}": "{{ collection.title | escape }}"{% unless forloop.last %},{% endunless %}
  {% endfor %}
};

window.collectionsProductsMetafields = {
  {%- for collection in collections -%}
    "{{ collection.handle }}": [
      {%- for product in collection.products -%}
        {
          id: "{{ product.id }}",
          title: "{{ product.title | escape }}",
          metafield: {{ product.metafields.custom.concern_filter.value | json }},
          tags: {{ product.tags | json }}
        }{%- unless forloop.last -%},{%- endunless -%}
      {%- endfor -%}
    ]{%- unless forloop.last -%},{%- endunless -%}
  {%- endfor -%}
};

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

window.initSkinQuiz = function () {
  const wrapper = document.querySelector('.skin-quiz__section-wrapper');
  if (!wrapper || wrapper.dataset.quizInitialized === 'true') return;
  wrapper.dataset.quizInitialized = 'true';

  const skinTypeSelect = document.querySelector(".js_col_label");
  const productTypeSelect = document.querySelector(".js_col_list");
  const concernSelect = document.getElementById("product-concern-select");
  const searchButton = document.querySelector('.js-search-products');

  const skin_dropdownHeading = document.querySelector('.skin-type__content-wrapp .dropdown-heading');
  const product_dropdownHeading = document.querySelector('.product-type__content-wrapp .dropdown-heading');
  const concern_dropdownHeading = document.querySelector('.concern-type__content-wrapp .dropdown-heading');

  let selectedMainCategory = getCookie('main_category') || "";
  let selectedProductFilter = getCookie('product_filter') || "";
  let selectedConcern = getCookie('concern_type') || "";

  const CATEGORY_MAP = {
    {% for i in (1..5) %}
      {% capture col_trigger_key %}col_trigger{{ i }}{% endcapture %}
      {% assign mainCategoryTrigger = settings[col_trigger_key] %}
      {% assign main_category_handle = mainCategoryTrigger | handle %}

      {% if main_category_handle != blank %}
        "{{ main_category_handle }}": {
          subTags: [
            {% capture tags_list_key %}col_tags{{ i }}{% endcapture %}
            {% assign tags_arrayList = settings[tags_list_key] %}
            {% assign tags_array = tags_arrayList | split: ',' | compact %}
            {% for tag in tags_array %}
              "{{ tag | strip | handle }}"{% unless forloop.last %},{% endunless %}
            {% endfor %}
          ],
          collections: [
            {% capture col_listing_key %}col_list{{ i }}{% endcapture %}
            {% for collection in settings[col_listing_key] %}
              "{{ collection.handle }}"{% unless forloop.last %},{% endunless %}
            {% endfor %}
          ]
        }{% unless forloop.last %},{% endunless %}
      {% endif %}
    {% endfor %}
  };

  function filterProductTypeList() {
    const allProductTypeLis = productTypeSelect.querySelectorAll('li');
    let anyProductFound = false;

    allProductTypeLis.forEach(li => {
      const group = li.getAttribute('data-group');
      const value = li.getAttribute('value');

      if (value === 'any-product') {
        li.style.display = 'block';
        anyProductFound = true;
      } else if (selectedMainCategory && group === selectedMainCategory) {
        const currentCollectionHandle = value;
        const productsInSelectedMainCategoryCollections = [];
        if (CATEGORY_MAP[selectedMainCategory] && CATEGORY_MAP[selectedMainCategory].collections) {
          CATEGORY_MAP[selectedMainCategory].collections.forEach(colHandle => {
            if (window.collectionsProductsMetafields[colHandle]) {
              productsInSelectedMainCategoryCollections.push(...window.collectionsProductsMetafields[colHandle]);
            }
          });
        }

        const productsInCurrentCollection = window.collectionsProductsMetafields[currentCollectionHandle] || [];
        const hasRelevantProducts = productsInCurrentCollection.some(currentColProd =>
          productsInSelectedMainCategoryCollections.some(mainCatProd => mainCatProd.id === currentColProd.id)
        );

        li.style.display = hasRelevantProducts ? 'block' : 'none';
      } else {
        li.style.display = 'none';
      }
    });

    const currentProductLi = productTypeSelect.querySelector(`li[value="${selectedProductFilter}"]`);
    if (!currentProductLi || currentProductLi.style.display === 'none') {
      selectedProductFilter = 'any-product';
      setCookie('product_filter', selectedProductFilter, 1);
      product_dropdownHeading.innerText = 'Any Product';
      allProductTypeLis.forEach(li => li.classList.remove('active'));
      productTypeSelect.querySelector('li[value="any-product"]').classList.add('active');
    } else {
      product_dropdownHeading.innerText = currentProductLi.innerText;
      allProductTypeLis.forEach(li => li.classList.remove('active'));
      currentProductLi.classList.add('active');
    }
  }

  function populateConcernTypes() {
    concernSelect.innerHTML = '';
    const concernsSet = new Set(['any-concern']);
    let productsToConsider = [];

    const productsInSelectedMainCategoryCollections = [];
    if (selectedMainCategory && CATEGORY_MAP[selectedMainCategory]) {
      CATEGORY_MAP[selectedMainCategory].collections.forEach(colHandle => {
        if (window.collectionsProductsMetafields[colHandle]) {
          productsInSelectedMainCategoryCollections.push(...window.collectionsProductsMetafields[colHandle]);
        }
      });
    } else {
      Object.values(window.collectionsProductsMetafields).forEach(colProducts => {
        productsInSelectedMainCategoryCollections.push(...colProducts);
      });
    }

    if (selectedProductFilter && selectedProductFilter !== 'any-product') {
      const productsInSelectedProductTypeCollection = window.collectionsProductsMetafields[selectedProductFilter] || [];
      productsToConsider = productsInSelectedMainCategoryCollections.filter(mainCatProd =>
        productsInSelectedProductTypeCollection.some(prodInCol => prodInCol.id === mainCatProd.id)
      );
    } else {
      productsToConsider = productsInSelectedMainCategoryCollections;
    }

    productsToConsider.forEach(prod => {
      const meta = prod.metafield;
      if (Array.isArray(meta)) meta.forEach(val => concernsSet.add(val.trim()));
      else if (typeof meta === "string") concernsSet.add(meta.trim());
      else if (typeof meta === "object" && meta !== null) Object.values(meta).forEach(val => concernsSet.add(val.trim()));
    });

    const sortedConcerns = Array.from(concernsSet).sort((a, b) => {
      if (a === 'any-concern') return -1;
      if (b === 'any-concern') return 1;
      return a.localeCompare(b);
    });

    sortedConcerns.forEach(concern => {
      const li = document.createElement("li");
      li.setAttribute("value", concern);
      li.textContent = (concern === 'any-concern') ? 'Any Concern' : concern.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      concernSelect.appendChild(li);
    });

    if (!selectedConcern || !concernsSet.has(selectedConcern)) {
      selectedConcern = 'any-concern';
    }

    const currentLi = concernSelect.querySelector(`li[value="${selectedConcern}"]`);
    if (currentLi) {
      currentLi.classList.add('active');
      concern_dropdownHeading.innerText = currentLi.innerText;
      setCookie('concern_type', selectedConcern, 1);
    }
  }

  function handleDropdown(selector) {
    const heading = document.querySelector(selector);
    if (!heading) return;

    heading.addEventListener('click', e => {
      e.stopPropagation();
      const dropdown = heading.nextElementSibling;
      if (!dropdown) return;

      document.querySelectorAll('.type-data-content').forEach(el => {
        if (el !== dropdown) {
          el.classList.remove('active');
          el.style.display = 'none';
        }
      });

      const isActive = dropdown.classList.toggle('active');
      dropdown.style.display = isActive ? 'block' : 'none';

      document.body.classList.toggle('dropdown-open', isActive);
    });
  }

  // Setup dropdown toggles
  handleDropdown('.skin-type__content-wrapp .dropdown-heading');
  handleDropdown('.product-type__content-wrapp .dropdown-heading');
  handleDropdown('.concern-type__content-wrapp .dropdown-heading');

  // Close dropdown when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.main-data-wrapper')) {
      document.body.classList.remove('dropdown-open');
      document.querySelectorAll('.type-data-content').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
      });
    }
  });

  skinTypeSelect.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      const clickedValue = e.target.getAttribute("data-value");
      const clickedText = e.target.innerText;
      selectedMainCategory = clickedValue;
      setCookie('main_category', selectedMainCategory, 1);

      this.querySelectorAll("li").forEach(li => li.classList.remove("active"));
      e.target.classList.add("active");
      skin_dropdownHeading.innerText = clickedText;

      selectedProductFilter = 'any-product';
      selectedConcern = 'any-concern';
      setCookie('product_filter', selectedProductFilter, 1);
      setCookie('concern_type', selectedConcern, 1);

      filterProductTypeList();
      populateConcernTypes();
    }
  });

  productTypeSelect.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      selectedProductFilter = e.target.getAttribute("value");
      setCookie('product_filter', selectedProductFilter, 1);

      this.querySelectorAll("li").forEach(li => li.classList.remove("active"));
      e.target.classList.add("active");
      product_dropdownHeading.innerText = e.target.innerText;

      selectedConcern = 'any-concern';
      setCookie('concern_type', selectedConcern, 1);
      populateConcernTypes();
    }
  });

  concernSelect.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      selectedConcern = e.target.getAttribute("value");
      setCookie('concern_type', selectedConcern, 1);

      this.querySelectorAll("li").forEach(li => li.classList.remove("active"));
      e.target.classList.add("active");
      concern_dropdownHeading.innerText = e.target.innerText;
    }
  });

  searchButton.addEventListener('click', () => {
    let baseUrl = '/search';
    let queryParams = [];
    let query = '';
    let view = '&view=quiz-products';

    if (selectedConcern && selectedConcern !== "any-concern") {
      query = selectedMainCategory || 'products';
      queryParams.push(`q=${encodeURIComponent(query)}`);
      queryParams.push('type=product');
      queryParams.push(`filter.p.m.custom.concern_filter=${encodeURIComponent(selectedConcern)}`);
    } else if (selectedProductFilter && selectedProductFilter !== 'any-product') {
      query = selectedProductFilter;
      queryParams.push(`q=${encodeURIComponent(query)}`);
      queryParams.push('type=product');
    } else if (selectedMainCategory && selectedMainCategory !== 'any-product') {
      query = selectedMainCategory;
      queryParams.push(`q=${encodeURIComponent(query)}`);
      queryParams.push('type=product');
    }

    if (queryParams.length > 0) {
      window.location.href = `${baseUrl}?${queryParams.join('&')}${view}`;
    } else {
      window.location.href = '/collections/all';
    }
  });

  // Initial selection
  const initialMainCategoryLi = skinTypeSelect.querySelector(`li[data-value="${selectedMainCategory}"]`);
  if (initialMainCategoryLi) {
    skin_dropdownHeading.innerText = initialMainCategoryLi.innerText;
    skinTypeSelect.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    initialMainCategoryLi.classList.add('active');
  }

  filterProductTypeList();
  populateConcernTypes();
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const quizEl = document.querySelector('.skin-quiz__section-wrapper');
  if (quizEl && !quizEl.dataset.quizInitialized) {
    window.initSkinQuiz();
  }
});

// Handle reloading after sorting / section rendering
document.addEventListener('shopify:section:load', function (e) {
  const quizEl = e.target.querySelector('.skin-quiz__section-wrapper');
  if (quizEl && !quizEl.dataset.quizInitialized) {
    window.initSkinQuiz();
  }
});

// MutationObserver for sorting or DOM change
const observer = new MutationObserver(() => {
  const quizEl = document.querySelector('.skin-quiz__section-wrapper');
  if (quizEl && !quizEl.dataset.quizInitialized) {
    window.initSkinQuiz();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
