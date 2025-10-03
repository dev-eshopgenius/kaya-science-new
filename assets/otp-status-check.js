// Get the visitorId.
const footprintEle = document.getElementById('sotp-footprint');
const value = window.simplyOtp.generated_hash;
const timeStamp = window.simplyOtp.time_stamp;
const myShopifyDomain = simplyOtp.permanentDomain;

let skipCheckCustomerStatus = getSotpCookie('_skip_check_login_status');

window.addEventListener('message', (event) => {
    if (event.data.type === 'footprint' && event.isTrusted && event.origin === 'https://aws-bucket-808.s3.ap-south-1.amazonaws.com' && event.data.value) {
        window.simplyOtp.footprintID = event.data.value;

        let token = getSotpCookie('_customer_status_check_token');

        if (!token && simplyOtp.otp_widgets.auto_login_enable && window?.simplyOtp?.footprintID && skipCheckCustomerStatus !== 'true') {
            sendCheckCustomerLoginState();
        }
    }
});

if (!window.simplyOtp.footprintID) {
    footprintEle.contentWindow.postMessage({ type: 'sendFootprint' }, '*');
}

/**
*
* @param {*} name Cookie name to delete
*/
function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
* Set browser cookie
* @param {String} name Cookie Name
* @param {any} value  Cookie Value
* @param {number} time TTL (In seconds) Default 1 Day
*/
function setSotpCookie(name, value, time = 30 * 60) {
    const date = new Date();
    date.setTime(date.getTime() + (time * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/`;
}

/**
* Get browser cookie
* @param {String} name
* @returns Cookie
*/
function getSotpCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

const urlSearchParams = new URLSearchParams(window.location.search); //Check url queryString
const params = Object.fromEntries(urlSearchParams.entries()); //params from the url urlSearchParams
let innerUrl = "";

if (params.return_url?.includes('checkCustomerStatus=true')) {
    deleteCookie('_customer_status_check_token')
}

if (params.checkout_url) {
    innerUrl = params.checkout_url; //Inner url from the params
}

if (window.simplyOtp.settings?.pageUrl) {
    innerUrl = window.simplyOtp.settings.pageUrl;
}

function addQueryParam(url, paramName, paramValue) {
    const [baseUrl, query] = url.split('?');
    const updatedQuery = new URLSearchParams(query);
    updatedQuery.set(paramName, paramValue);
    return `${baseUrl}?${updatedQuery.toString()}`;
}

async function sendCheckCustomerLoginState() {

    try {

        let action = "checkLoginStatus";
        let fingerprintHash = "";
        let trans = '';
        let fingerprintData = '';
        if (simplyOtp.otp_widgets.fraud_detection) {
            const fingerprintResult = await window.simplyOtp.fpPromise.then(FingerprintJS => FingerprintJS.load())
                .then(fp => fp.get())
                .then(async result => {
                    delete result.components.canvas;
                    delete result.components.webGlExtensions;
                    result.visitedAt = Date.now();
                    return { result };
                }).catch(error => {
                    console.log(error)
                });

            if (!fingerprintResult) {
                console.log('Failed to obtain fingerprint data.');
            }

            fingerprintResult.result.visitorId = window.simplyOtp.footprintID || fingerprintResult.result.visitorId;
            const uniqueId = `${fingerprintResult.result.visitorId}${value}${myShopifyDomain}`;
            fingerprintHash = await generateHashWithUniqueId(fingerprintResult.result, uniqueId);
            trans = `${value}.${timeStamp}`;
            fingerprintData = JSON.stringify(fingerprintResult.result);
        }

        let data = {
            data: fingerprintData,
            visit: fingerprintHash,
            trans: trans
        }

        data = JSON.stringify(data);

        const appUrl = `https://omqkhavcch.execute-api.ap-south-1.amazonaws.com/simplyotplogin/v6/otp`;
        fetch(appUrl, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                'shop_name': myShopifyDomain,
                'action': action
            },
            body: data,
        })
            .then(response => response.json())
            .then(response => {
                // checkLoginStatus(response); // invoke call-back method
                if (response.status == 200 && response?.data?.redirectURL) {
                    setSotpCookie('_customer_status_check_token', response.data.redirectURL)

                    if (!window.simplyOtp.customer && window.location.pathname == '/account/login' && skipCheckCustomerStatus !== 'true') {
                        checkLoginStatus(response);
                    }
                } else {
                    setSotpCookie('_skip_check_login_status', true)
                    window.simplyOtp?.initializeSimplyOtp();
                }
            })
            .catch((error) => {
                console.log(error);
                window.simplyOtp?.initializeSimplyOtp();
            })
    } catch (e) {
        window.simplyOtp?.initializeSimplyOtp();
    }
}

const checkLoginStatusByCookie = () => {
    const token = getSotpCookie('_customer_status_check_token');
    const response = { data: { redirectURL: token } }
    checkLoginStatus(response);
}

const checkLoginStatus = (response) => {
    if (response?.data?.redirectURL) {
        if (response.data.redirectURL.includes("/account/activate")) {
            performAccountActivateAction(response.data.redirectURL);
        } else {
            performLoginAction(response.data.redirectURL);
        }
    } else {
        window.simplyOtp?.initializeSimplyOtp();
    }
}

const performLoginAction = (url_string) => {

    try {
        let url = new URL(url_string);
        let token = url.searchParams.get("logintoken");

        //split payload from token
        let strBase64Url = token.split('.')[1];
        let base64 = strBase64Url.replace('-', '+').replace('_', '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payloadObject = JSON.parse(jsonPayload);
        document.body.dispatchEvent(new Event("sotp.login"));
        if (payloadObject.jti && payloadObject.iss) {
            let userName = payloadObject.jti;
            let userPassword = payloadObject.iss;
            createLoginFormAndSubmit(userName, userPassword);
        }
        else {
            window.simplyOtp?.initializeSimplyOtp();
        }
    }
    catch (error) {
        console.log(error);
        window.simplyOtp?.initializeSimplyOtp();
    }
}

const createLoginFormAndSubmit = (userName, userPassword) => {
    try {

        if (simplyOtp.settings?.new_popup_design) {
            innerUrl = window.location.pathname
        } else if (!innerUrl) {
            innerUrl = '/account';
        }

        const checkout_url = addQueryParam(innerUrl, 'checkCustomerStatus', true)

        document.getElementById('otp-original-email').value = userName;
        document.getElementById('otp-original-password').value = userPassword;
        if (simplyOtp.settings.goKwik && checkout_url.includes("checkout")) {
            document.getElementById('otp-return_to').value = location.origin + "/account/login#ref=gokwik";
            let elements = document.getElementsByName("checkout_url");
            elements.forEach((function (x) {
                x.remove();
            }));
        } else if (checkout_url != "") {
            let elements = document.getElementsByName('return_url');
            elements.forEach((function (x) {
                x.value = checkout_url;
            }));
            // document.getElementById('otp-return_to').remove();
        }
        else if (document.getElementById('otp-return_to')) {
            document.getElementById('otp-return_to').remove();
        }
        document.getElementById("sotp-form").submit();
    } catch (error) {
        console.log('error in createLoginFormAndSubmit ', error)
    }
}

const performAccountActivateAction = (url_string) => {
    try {
        const url = new URL(url_string);
        const pathVariables = url.pathname.split("/")
        let timeStamp = new Date().getTime().toString();
        let urlencodedBody = new URLSearchParams();
        urlencodedBody.append("form_type", "activate_customer_password");
        urlencodedBody.append("utf8", "✓");
        urlencodedBody.append("customer[password]", timeStamp);
        urlencodedBody.append("customer[password_confirmation]", timeStamp);
        urlencodedBody.append("token", pathVariables.pop());
        urlencodedBody.append("id", pathVariables.pop());

        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencodedBody
        };

        fetch(`${location.origin}/account/activate`, requestOptions)
            .then(response => response.text())
            .then(response => window.location = `${location.origin}/account`)
            .catch(error => {
                console.log('Error while activating customer on shopify', error);
                deleteCookie('_customer_status_check_token')
                window.location = url_string
            });
    } catch (error) {
        console.log(error);
        window.location = url_string;
    }
}

let generateHashWithUniqueId = async (data, uniqueId) => {
    const concatenatedString = JSON.stringify(data) + uniqueId;
    const cryptoObj = window.crypto || window.msCrypto;
    const hasher = cryptoObj.subtle || cryptoObj.webkitSubtle;
    const algorithm = { name: 'SHA-256' };
    const concatenatedData = new TextEncoder().encode(concatenatedString);
    const hash = await hasher.digest(algorithm, concatenatedData);
    const hashHex = Array.from(new Uint8Array(hash)).map(byte => ('0' + byte.toString(16)).slice(-2)).join('');
    return hashHex;
}


let token = getSotpCookie('_customer_status_check_token');
if (!token && simplyOtp.otp_widgets.auto_login_enable && window?.simplyOtp?.footprintID && skipCheckCustomerStatus !== 'true') {
    sendCheckCustomerLoginState();
} else {
    if (!window.simplyOtp.customer && simplyOtp.otp_widgets.auto_login_enable && window.location.pathname == '/account/login' && skipCheckCustomerStatus !== 'true') {
        checkLoginStatusByCookie();
    } else {
      window.simplyOtp?.initializeSimplyOtp();
    }
}
 

const showSuccessBanner = () => {
    let sotp_widget = document.querySelectorAll('.sotp-widget')
    sotp_widget.forEach((parent) => {
        let popup_logo = parent.querySelector('.login-img');
        if (popup_logo) {
            parent.querySelector('.login-img').classList.add('hideBox');
        }
        parent.querySelector('.success-login-container').classList.remove('hideBox');
        parent.querySelector('.login-box').classList.add('hideBox');
        parent.querySelector('.verify-box').classList.add('hideBox');
        parent.querySelector('.update-user-box').classList.add('hideBox');
    })
}


if (simplyOtp.settings.new_popup_design) {
    if (!window.location.href.includes('/account')) {
        document.addEventListener("click", (e) => {
            let target = e.target;
            token = getSotpCookie('_customer_status_check_token');
            skipCheckCustomerStatus = getSotpCookie('_skip_check_login_status');

            if (target.closest('a')) {
                if (target.closest('a').href.includes("account/login") || target.closest('a').classList.contains('show-sotp-popup')) {
                    if (!window.simplyOtp.customer) {
                        window.simplyOtp?.initializeSimplyOtp();
                        if (!token && simplyOtp.otp_widgets.auto_login_enable) {
                            e.preventDefault();
                            simplyOtp.openPopup();
                            // sendCheckCustomerLoginState();
                        } else if (!window.simplyOtp.customer && simplyOtp.otp_widgets.auto_login_enable && skipCheckCustomerStatus !== 'true') {
                            e.preventDefault();
                            simplyOtp.openPopup();
                            showSuccessBanner();
                            checkLoginStatusByCookie();
                            // setTimeout(() => {
                            //     checkLoginStatusByCookie();
                            // }, 1000);
                        } else {
                            e.preventDefault();
                            simplyOtp.openPopup();
                        }
                        // }
                    }
                }
            } else if (target && target?.nodeName == "A") {
                if (target.href.includes("account/login") || target.classList.contains('show-sotp-popup')) {
                    if (!window.simplyOtp.customer) {
                        e.preventDefault();
                        simplyOtp.openPopup();
                    }
                }
            }
        });
    }
}