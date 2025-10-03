if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
       }

      hide() {
        super.hide();
      }

      show(opener) {
        super.show(opener);
        this.showActiveMedia();
      }

      showActiveMedia() {
        this.querySelectorAll(
          `[data-media-id]:not([data-media-id="${this.openedBy.getAttribute('data-media-id')}"])`
        ).forEach((element) => {
          element.classList.remove('active');
        });
        const activeMedia = this.querySelector(`[data-media-id="${this.openedBy.getAttribute('data-media-id')}"]`);
        const activeMediaTemplate = activeMedia.querySelector('template');
        const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        activeMedia.classList.add('active');
        activeMedia.scrollIntoView();

        const container = this.querySelector('[role="document"]');
        container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;

        if (
          activeMedia.nodeName == 'DEFERRED-MEDIA' &&
          activeMediaContent &&
          activeMediaContent.querySelector('.js-youtube')
        )
          activeMedia.loadContent();
      }
    }
  );
}


// function initializePopupSlider() {
//   const mainSlider = new Swiper(".quick-add-modal__content .main-slider", {
//     spaceBetween: 10,
//     slidesPerView: 1,
//     loop: true,
//     pagination: {
//       el: ".swiper-pagination",
//       clickable: true,
//     },
//     navigation: {
//       nextEl: ".main-slider-next",
//       prevEl: ".main-slider-prev",
//     },
//   });

//   const thumbnailSlider = new Swiper(".quick-add-modal__content .custom-thumb-slider", {
//     spaceBetween: 10,
//     slidesPerView: 4,
//     freeMode: false,
//     watchSlidesProgress: true,
//     navigation: {
//       nextEl: ".thumbnail-slider-next",
//       prevEl: ".thumbnail-slider-prev",
//     },
//   });

//   document
//     .querySelectorAll(".quick-add-modal__content .thumbnail-slider .swiper-slide")
//     .forEach((thumbnail, index) => {
//       thumbnail.addEventListener("click", () => {
//         mainSlider.slideTo(index);
//       });
//     });
// }

  