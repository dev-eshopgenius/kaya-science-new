document.addEventListener("DOMContentLoaded", () => {
  const dmDone = getModalCookie("disc_modal_done") || null;

  setTimeout(() => {
    if (!dmDone) dModal(1);

    const phonePopupHeight = document.querySelector('.discount-phone-popup__wrap').offsetHeight;
    document.querySelector('.discount-otp-popup-wrap').style.height = `${phonePopupHeight}px`;
    document.querySelector('.discount-wlc-popup-wrap').style.height = `${phonePopupHeight}px`;
  }, 8000);

  document.addEventListener("click", (event) => {
    if (event.target.matches(".close_modal")) dClose();

    if (event.target.matches(".resend_otp")) {
      // Logic for resend OTP
    }

    if (event.target.matches(".accept-terms-wrap")) {
      const termsInput = document.querySelector(".terms_input");
      const availDiscountButton = document.querySelector(".avail_discount");

      if (termsInput && termsInput.checked) {
        availDiscountButton.disabled = false;
      } else {
        availDiscountButton.disabled = true;
      }
    }

    if (event.target.matches(".avail_discount")) {
      document.querySelector(".mobile_validation_mgs").innerHTML = "";
      const mobileNumber = document.querySelector("#mobileNumber").value;
      timerDuration = 60;
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
      document.querySelector(".resend_otp").disabled = true;
      document.querySelector(".otp_number").textContent = mobileNumber;

      if (validateMobileNumber(mobileNumber)) {
        dModal(2);
        fetch("https://kaya-popup-home-ec4153615ea5.herokuapp.com/api/createOTP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: `91${mobileNumber}` }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            localStorage.setItem("otp_response", JSON.stringify(data));
          })
          .catch((error) => {
            console.error("Error sending OTP:", error);
            alert("Oops! Something went wrong with sending the OTP. Please try again.");
            dModal(1);
          });
      } else {
        document.querySelector(".mobile_validation_mgs").innerHTML = "Please enter a valid mobile number.";
      }
    }

    if (event.target.matches(".otp__verify")) {
      document.querySelector(".varify_mgs").innerHTML = "";
      const otpInputs = document.querySelectorAll(".otp-input");
      const mobileNumber = document.querySelector("#mobileNumber").value;
      let otp = "";

      otpInputs.forEach((input) => (otp += input.value));

      if (!otp.length) {
        document.querySelector(".varify_mgs").innerHTML = "Please enter the OTP.";
        return;
      } else if (otp.length < 4) {
        document.querySelector(".varify_mgs").innerHTML = "Please enter a valid OTP.";
        return;
      }

      const requestId = getRequestId();
      if (!requestId) {
        alert("Oops! Something went wrong. Please try resending the OTP.");
        dModal(1);
        return;
      }

      event.target.classList.add("md_loading");

      fetch("https://kaya-popup-home-ec4153615ea5.herokuapp.com/api/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: `91${mobileNumber}`,
          otp,
          requestId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          event.target.classList.remove("md_loading");

          if (data?.data?.type === "success") {
            dModal(3);
          } else {
            console.error("Wrong OTP:", data);
            document.querySelector(".otp__verify").classList.remove("md_loading");
            document.querySelector(".varify_mgs").innerHTML = data?.data?.message;
          }
        })
        .catch((error) => {
          event.target.classList.remove("md_loading");
          console.error("Error verifying OTP:", error);
        });
    }

    if (event.target.matches(".md-coupon-code")) {
      copyCouponCode(".md-coupon-text", event.target);
    }
  });

  document.querySelector("#mobileNumber").addEventListener("input", (event) => {
    document.querySelector(".mobile_validation_mgs").innerHTML = "";
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
  });

  const otpContainer = document.querySelector(".otp-container");
  for (let i = 0; i < 4; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "otp-input";
    input.maxLength = 1;
    otpContainer.appendChild(input);
  }

  document.querySelectorAll(".otp-input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const current = event.target;
      const next = current.nextElementSibling;

      if (current.value.length > 1) {
        next?.focus();
        current.value = current.value[0];
      } else if (current.value.length === 1 && next) {
        next.focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      const current = event.target;
      const prev = current.previousElementSibling;

      if ((event.key === "Backspace" || event.key === "ArrowLeft") && !current.value && prev) {
        prev.focus();
      }
    });

    input.addEventListener("focus", (event) => {
      const current = event.target;
      const prev = current.previousElementSibling;

      if (!current.isEqualNode(otpContainer.firstElementChild) && !prev?.value) {
        prev?.focus();
      }
    });
  });
});

const updateTimer = () => {
  const timer = document.querySelector("#timer");
  const resendButton = document.querySelector(".resend_otp");

  const minutes = Math.floor(timerDuration / 60).toString().padStart(2, "0");
  const seconds = (timerDuration % 60).toString().padStart(2, "0");

  timer.textContent = `${minutes}:${seconds}`;
  timer.style.display = "block";
  resendButton.classList.add("disabled");
  resendButton.textContent = "Resend OTP in";

  if (timerDuration > 0) {
    timerDuration--;
  } else {
    timer.style.display = "none";
    clearInterval(timerInterval);
    resendButton.classList.remove("disabled");
    resendButton.textContent = "Resend OTP";
  }
};

const validateMobileNumber = (number) => /^[6-9]\d{9}$/.test(number);

const dModal = (step) => {
  if (!step) return;

  document.querySelectorAll(".discount--step").forEach((stepEl) => {
    stepEl.style.visibility = "hidden";
    stepEl.style.opacity = "0";
  });

  const currentStep = document.querySelector(`.discount--step.step--${step}`);
  if (currentStep) {
    currentStep.style.visibility = "visible";
    currentStep.style.opacity = "1";
  }

  document.body.classList.add("active_popup");
};

const dClose = () => {
  console.log("dClose function triggered");
  document.querySelectorAll(".discount--step").forEach((stepEl) => {
    stepEl.style.visibility = "hidden";
    stepEl.style.opacity = "0";
  });
  console.log("Before class removal:", document.body.classList);
  document.body.classList.remove("active_popup");
  console.log("After class removal:", document.body.classList);
  setModalCookie("disc_modal_done", true, 365);
};



const setModalCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getModalCookie = (name) => {
  return document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return key === name ? decodeURIComponent(value) : acc;
  }, null);
};

const getRequestId = () => {
  try {
    const parsedResponse = JSON.parse(localStorage.getItem("otp_response"));
    return parsedResponse?.data?.request_id || false;
  } catch {
    return false;
  }
};

const copyCouponCode = (selector, button) => {
  const couponText = document.querySelector(selector)?.innerText;

  if (couponText) {
    navigator.clipboard.writeText(couponText).then(() => {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy Coupon Code";
        dClose();
      }, 1000);
    });
  }
};
