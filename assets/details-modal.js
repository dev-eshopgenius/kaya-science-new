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
document.querySelectorAll(".main-link-item").forEach(item => {
const childMenu = item.querySelector(".child-mega-menu__content");
const childLiWrap = item.querySelector(".child-linklist");

if (childMenu) {
  item.addEventListener("mouseover", () => {
    childMenu.style.display = "block";
    item.classList.add("active");
    childLiWrap.classList.add("active-wrap");
    item.classList.add("active-li");

    childMenu.querySelectorAll(".child-link-item .mega-menu__link").forEach(link => {
      link.addEventListener("mouseover", () => {
          const imageUrl = link.getAttribute("data-image-url");
          const img = link.closest(".child-link-item").querySelector(".menu-img");
          console.log(img,"img<><><>",imageUrl);
        img.setAttribute("src", imageUrl);
      


        const grandchildMenu = link.closest(".child-link-item").querySelector(".grandchild-mega-menu__content");
        if (grandchildMenu) {
          link.closest(".child-link-item").classList.add("has_grandChild_menu");

          grandchildMenu.querySelectorAll(".grandchild-link-item .mega-menu__link").forEach(grandLink => {
            grandLink.addEventListener("mouseover", () => {
              const grandImageUrl = grandLink.getAttribute("data-image-url");
              const grandImg = grandLink.closest(".grandchild-link-item").querySelector(".menu-img");

              if (grandImageUrl && grandImg) {
                grandImg.setAttribute("src", grandImageUrl);
              }
            });

            grandLink.addEventListener("mouseleave", () => {
              const grandImg = grandLink.closest(".grandchild-link-item").querySelector(".menu-img");
              if (grandImg) {
                grandImg.setAttribute("src", "");
              }
            });
          });
        }
      });

      link.addEventListener("mouseleave", () => {
        const img = link.closest(".child-link-item").querySelector(".menu-img");
        if (img) {
          img.setAttribute("src", "");
        }

        const grandchildMenu = link.closest(".child-link-item").querySelector(".grandchild-mega-menu__content");
        if (grandchildMenu) {
        }
      });
    });
  });

  item.addEventListener("mouseleave", () => {
    childMenu.style.display = "none";
    item.classList.remove("active");
    item.classList.remove("active-li");
    childLiWrap.classList.remove("active-wrap");
  });
}
});


