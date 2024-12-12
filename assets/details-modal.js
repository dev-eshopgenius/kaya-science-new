class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');

    this.detailsContainer.addEventListener('keyup', (event) => event.code.toUpperCase() === 'ESCAPE' && this.close());
    this.summaryToggle.addEventListener('click', this.onSummaryClick.bind(this));
    this.querySelector('button[type="button"]').addEventListener('click', this.close.bind(this));

    this.summaryToggle.setAttribute('role', 'button');
  }

  isOpen() {
    return this.detailsContainer.hasAttribute('open');
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest('details').hasAttribute('open') ? this.close() : this.open(event);
  }

  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false);
  }

  open(event) {
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest('details').setAttribute('open', true);
    document.body.addEventListener('click', this.onBodyClickEvent);
    document.body.classList.add('overflow-hidden');

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute('open');
    document.body.removeEventListener('click', this.onBodyClickEvent);
    document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('details-modal', DetailsModal);


// menu shows on hover js start
let items = document.querySelector(".header__inline-menu").querySelectorAll("details");
let grand_items = document.querySelector(".childlink--menu-wrap").querySelectorAll(".child-linklist");
let child_items = document.querySelector(".main-link-wrapp").querySelectorAll(".main-link-item");
  items.forEach(item => {
    item.addEventListener("mouseover", () => {
      item.setAttribute("open", true);
      item.querySelector("ul").addEventListener("mouseleave", () => {
        item.removeAttribute("open");
      });
    item.addEventListener("mouseleave", () => {
      item.removeAttribute("open");
    });
  });
});

child_items.forEach(item => {
  item.addEventListener("mouseover", () => {
    const menu = item.querySelector("ul");
    if (menu) {
      menu.style.display = "block"; 
      menu.addEventListener("mouseleave", () => {
        menu.style.display = "none"; 
      });
    }
  });

  item.addEventListener("mouseleave", () => {
    const menu = item.querySelector("ul");
    if (menu) {
      menu.style.display = "none";
    }
  });
});


grand_items.forEach(item => {
  item.addEventListener("mouseover", () => {
    const menu = item.querySelector("ul");
    if (menu) {
      menu.style.display = "block"; 
      menu.addEventListener("mouseleave", () => {
        menu.style.display = "none"; 
      });
    }
  });

  item.addEventListener("mouseleave", () => {
    const menu = item.querySelector("ul");
    if (menu) {
      menu.style.display = "none";
    }
  });
});

// menu shows on hover js end
 


// megamenu hover image 
document.querySelectorAll(".mega-menu__link[data-image-url]").forEach(item => {
  item.addEventListener("mouseover", () => {
    const imageUrl = item.getAttribute("data-image-url"),
         img = document.querySelector(".menu-img"),
         image_wrp = document.querySelector(".linklist_image");

    if (img) {
      img.setAttribute("src", imageUrl);
      img.setAttribute("srcset", imageUrl);
      image_wrp.style.display = "block"; 
    }
  });
  item.addEventListener("mouseleave",() => {
     const img = document.querySelector(".menu-img"),
           image_wrp = document.querySelector(".linklist_image");

      if (img) {
      img.setAttribute("src", '');
      img.setAttribute("srcset", '');
      image_wrp.style.display = "none"; 
      }
  });
});

// Automatically trigger hover for the first menu item to set default image
// const firstItem = document.querySelector(".mega-menu__link[data-image-url]");
// if (firstItem) {
//   firstItem.dispatchEvent(new MouseEvent("mouseenter"));
// }
