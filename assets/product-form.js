if (!customElements.get('product-form')) {
customElements.define(
  'product-form',
  class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.variantIdInput.disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      this.submitButtonText = this.submitButton.querySelector('span');

      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

      this.hideErrors = this.dataset.hideErrors === 'true';
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append(
          'sections',
          this.cart.getSectionsToRender().map((section) => section.id)
        );
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            publish(PUB_SUB_EVENTS.cartError, {
              source: 'product-form',
              productVariantId: formData.get('id'),
              errors: response.errors || response.description,
              message: response.message,
            });
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButtonText.classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          if (!this.error)
            publish(PUB_SUB_EVENTS.cartUpdate, {
              source: 'product-form',
              productVariantId: formData.get('id'),
              cartData: response,
            });
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener(
              'modalClosed',
              () => {
                setTimeout(() => {
                  this.cart.renderContents(response);
                });
              },
              { once: true }
            );
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      if (this.hideErrors) return;

      this.errorMessageWrapper =
        this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }

    toggleSubmitButton(disable = true, text) {
      if (disable) {
        this.submitButton.setAttribute('disabled', 'disabled');
        if (text) this.submitButtonText.textContent = text;
      } else {
        this.submitButton.removeAttribute('disabled');
        this.submitButtonText.textContent = window.variantStrings.addToCart;
      }
    }

    get variantIdInput() {
      return this.form.querySelector('[name=id]');
    }
  }
);
}


document.addEventListener('DOMContentLoaded', function () {
  const discountCodes = document.querySelectorAll('.copytext');

  discountCodes.forEach(codeElement => {
    codeElement.addEventListener('click', function () {
      discountCodes.forEach(el => el.classList.remove('active'));
      codeElement.classList.add('active');

      const closetWrap = codeElement.closest('.content-wrapp');
      const textToCopy = closetWrap.querySelector('.textToCopy').innerText;
      const tempTextArea = document.createElement('textarea');

      tempTextArea.value = textToCopy;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);

      setTimeout(() => {
        codeElement.classList.remove('active');
      }, 1000);
    });
  });
});

// START:- estiated pincode delivery

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("check-delivery");
  const input = document.getElementById("pincode-input");
  const result = document.getElementById("delivery-result");

    async function fetchCsvData() {
        try {
            const response = await fetch("https://cdn.shopify.com/s/files/1/0891/9413/5854/files/pincode-delivery.csv?v=1734760493");
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV. Status: ${response.status}`);
            }
            const text = await response.text();
            const rows = text.split("\n").slice(1); 
            const data = {};

            rows.forEach(row => {
                const [pincode, minDays, maxDays] = row.split(",");
                data[pincode.trim()] = { 
                    minDays: parseInt(minDays), 
                    maxDays: parseInt(maxDays) 
                };
            });

            return data;
        } catch (error) {
            console.error("Error fetching CSV data:", error.message);
            document.getElementById("delivery-result").textContent = "Error loading delivery data.";
            throw error; 
        }
    }
    function calculateDeliveryDate(minDays, maxDays) {
          const currentDate = new Date();
          const minDate = new Date(currentDate);
          const maxDate = new Date(currentDate);

          minDate.setDate(minDate.getDate() + minDays);
          maxDate.setDate(maxDate.getDate() + maxDays);

          const options = { day: "numeric", month: "long", year: "numeric" };
          return `Delivery between ${minDate.toLocaleDateString(undefined, options)} to ${maxDate.toLocaleDateString(undefined, options)}`;
    }
    button.addEventListener("click", async () => {
          const pincode = input.value.trim();
          if (!pincode) {
              result.textContent = "Please enter a valid pincode.";
              return;
          }

          const data = await fetchCsvData();
          if (!data) {
              result.textContent = "Error loading delivery information. Please try again.";
              return;
          }

          if (data[pincode]) {
              const { minDays, maxDays } = data[pincode];
              result.textContent = calculateDeliveryDate(minDays, maxDays);
          } else {
              result.textContent = "Delivery information not available for this pincode.";
          }
      });
});

// END:- estiated pincode delivery