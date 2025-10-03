document.addEventListener("DOMContentLoaded", () => {

  // copy coupon code
    const buttons = document.querySelectorAll(".copy-btn");
    
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const code = button.getAttribute("data-code");
        alert(code);
        // Use clipboard API
        navigator.clipboard.writeText(code).then(() => {
          button.innerText = "Copied!";
          setTimeout(() => {
            button.innerText = "Copy";
          }, 2000);
        }).catch(err => {
          console.error("Failed to copy!", err);
        });
      });
    });
})