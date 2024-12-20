document.addEventListener("DOMContentLoaded", function () {
    const dm_done = getModalCookie("disc_modal_done") || null;
  
    setTimeout(function () {
      if (!dm_done) d_modal(1);
    }, 8000);
  
    document.addEventListener("click", function (event) {
      if (event.target.matches(".close_modal")) {
        d_close();
      }
  
      if (event.target.matches(".avail_discount")) {
        document.querySelector(".mobile_validation_mgs").textContent = "";
        const mobileNumber = document.getElementById("mobileNumber").value;
        let timerDuration = 60;
  
        startTimer(timerDuration);
        document.querySelector(".resend_otp").disabled = true;
        document.querySelector(".otp_number").textContent = mobileNumber;
  
        if (validateMobileNumber(mobileNumber)) {
          d_modal(2);
          fetch("https://kaya-popup-home-ec4153615ea5.herokuapp.com/api/createOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile: "91" + mobileNumber }),
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              localStorage.setItem("otp_response", JSON.stringify(data));
            })
            .catch(error => {
              localStorage.setItem("otp_response", JSON.stringify("{}"));
              console.error(error);
              alert(
                "Oops! Something went wrong with sending the OTP. Please try again."
              );
              d_modal(1);
            });
        } else {
          document.querySelector(".mobile_validation_mgs").textContent =
            "Please enter a valid mobile number.";
        }
      }
  
      if (event.target.matches(".otp__verify")) {
        document.querySelector(".varify_mgs").textContent = "";
        const otpInputs = document.querySelectorAll(".otp-input");
        const mobileNumber = document.getElementById("mobileNumber").value;
        let otp = "";
  
        otpInputs.forEach(input => {
          otp += input.value;
        });
  
        const request_id = getRequestId();
  
        if (!otp) {
          document.querySelector(".varify_mgs").textContent =
            "Please enter the OTP.";
          return;
        } else if (otp.length < 4) {
          document.querySelector(".varify_mgs").textContent =
            "Please enter a valid OTP.";
          return;
        }
  
        if (!request_id) {
          alert("Oops! Something went wrong. Please try resending the OTP.");
          d_modal(1);
          return;
        }
  
        event.target.classList.add("md_loading");
  
        fetch("https://kaya-popup-home-ec4153615ea5.herokuapp.com/api/verifyOTP", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: "91" + mobileNumber,
            otp: otp,
            requestId: request_id,
          }),
        })
          .then(response => response.json())
          .then(data => {
            event.target.classList.remove("md_loading");
            if (data?.data?.type === "success") {
              d_modal(3);
            } else {
              console.error("Wrong OTP");
              document.querySelector(".otp__verify").classList.remove("md_loading");
              document.querySelector(".varify_mgs").textContent =
                data?.data?.message;
            }
          })
          .catch(error => {
            event.target.classList.remove("md_loading");
            localStorage.setItem("otp_response", JSON.stringify("{}"));
            console.error("Error verifying OTP:", error);
          });
      }
  
      if (event.target.matches(".md-coupon-code")) {
        copyCouponCode(".md-coupon-text", event.target);
      }
    });
  
    document.addEventListener("input", function (event) {
      if (event.target.matches("#mobileNumber")) {
        document.querySelector(".mobile_validation_mgs").textContent = "";
        event.target.value = event.target.value.replace(/[^0-9]/g, "");
      }
  
      if (event.target.matches(".otp-input")) {
        document.querySelector(".varify_mgs").textContent = "";
        const input = event.target;
        const inputValue = input.value.replace(/\D/g, "");
  
        if (inputValue.length > 1 && !input.classList.contains("otp-input-main")) {
          populateNext(input, inputValue);
        } else if (
          inputValue.length === 1 &&
          input.nextElementSibling?.classList.contains("otp-input") &&
          !input.classList.contains("otp-input-main")
        ) {
          input.nextElementSibling.focus();
        }
      }
    });
  
    document.addEventListener("keydown", function (event) {
      if (
        (event.key === "Backspace" || event.key === "ArrowLeft") &&
        event.target.matches(".otp-input") &&
        event.target.value === "" &&
        event.target.previousElementSibling?.classList.contains("otp-input")
      ) {
        event.target.previousElementSibling.focus();
      }
    });
  
    const digitCount = 4;
    const container = document.getElementById("otp-container");
    for (let i = 0; i < digitCount; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.classList.add("otp-input");
      input.maxLength = 1;
      container.appendChild(input);
    }
  });
  
  function startTimer(duration) {
    const timerElement = document.getElementById("timer");
    const resendButton = document.querySelector(".resend_otp");
    let timerDuration = duration;
  
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timerDuration / 60);
      const seconds = timerDuration % 60;
      timerElement.textContent = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      resendButton.textContent = "Resend OTP in";
  
      if (timerDuration > 0) {
        timerDuration--;
      } else {
        timerElement.style.display = "none";
        clearInterval(timerInterval);
        resendButton.disabled = false;
        resendButton.textContent = "Resend OTP";
      }
    }, 1000);
  }
  
  function validateMobileNumber(number) {
    return /^[6-9]\d{9}$/.test(number);
  }
  
  function d_modal(step) {
    if (!step) return;
  
    const steps = document.querySelectorAll(".discount--steps .discount--step");
    steps.forEach(stepEl => {
      stepEl.style.visibility = "hidden";
      stepEl.style.opacity = "0";
    });
  
    const currentStep = document.querySelector(
      `.discount--steps .discount--step.step--${step}`
    );
    currentStep.style.visibility = "visible";
    currentStep.style.opacity = "1";
  
    document.body.classList.add("active_popup");
  }
  
  function d_close() {
    const steps = document.querySelectorAll(".discount--steps .discount--step");
    steps.forEach(stepEl => {
      stepEl.style.visibility = "hidden";
      stepEl.style.opacity = "0";
    });
    document.body.classList.remove("active_popup");
    setModalCookie("disc_modal_done", true, 365);
  }
  
  function setModalCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
  
  function getModalCookie(name) {
    return document.cookie
      .split("; ")
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        return key === name ? decodeURIComponent(value) : acc;
      }, null);
  }
  
  function getRequestId() {
    try {
      const parsedResponse = JSON.parse(localStorage.getItem("otp_response"));
      return parsedResponse?.data?.request_id || false;
    } catch {
      return false;
    }
  }
  
  function copyCouponCode(selector, button) {
    const couponText = document.querySelector(selector).innerText;
    navigator.clipboard.writeText(couponText).then(() => {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy Coupon Code";
        d_close();
      }, 1000);
    });
  }
  
function populateNext(input, data) {
    if (data && data.length > 0) {
      input.value = data[0];
      data = data.substring(1);
      const nextInput = input.nextElementSibling;
      if (nextInput && nextInput.classList.contains("otp-input") && data.length) {
        populateNext(nextInput, data);
      }
    }
}
  