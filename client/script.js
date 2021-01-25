var OTP = "";
var isTrue = false;
var lclPassword = "";

// hash function
String.prototype.hashCode = function(){
    var hash = 0;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

// listners
document.getElementById("main-submit").addEventListener('click', (e)=>{
    e.preventDefault();
})

document.getElementById("main-form-container").addEventListener('submit', (e)=>{
    e.preventDefault();
})

// check functions
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkOTP(){
    const indexOTP = document.getElementById("checkOtp").value;
    // console.log(indexOTP.length)
    // console.log(OTP.toString().length)
    if(isTrue){
        isTrue = !isTrue;
        document.getElementById("error-message-otp").className = "error text-danger"
    }
    if(parseInt(indexOTP) === OTP){
        isTrue = true
        console.log("OTP correct")
        document.getElementById("error-message-otp").className = "d-none"
    }else if(indexOTP.length !== OTP.toString().length){
        document.getElementById("error-message-otp").className = "error text-danger"
    }
    else{
        isTrue = false
        console.log("INVALID")
    }
}

function check(){
    const mainPass = document.getElementById("inputPassword").value;
    const subPass = document.getElementById("checkPassword").value;
    // console.log(mainPass)
    // console.log(subPass)
    if(mainPass !== subPass){
        document.getElementById("error-message-password").className = "error text-danger"
    } else {
        document.getElementById("error-message-password").className = "d-none"
    }
}


// toggler functions 

function toggleLoader(condition){
    if(condition){
        document.getElementById("loader").className = "spinner-grow spinner-grow-sm";
    }else{
        document.getElementById("loader").className = "d-none"
    }
}

function toggleSecondPass(){
    if(document.getElementById("inputPassword").value.length === 0){
        document.getElementById("checkPassword").disabled = true;
    }else{
        document.getElementById("checkPassword").disabled = false;
        check()
    }
}

// server functions

function startRegistration(fullname, email, password){
    // var url = "http://localhost:5000/test?name=saran&email=something@g.co&password=somthing";
    return new Promise((resolve, reject)=>{
        try{
            var url = `/register?name=${fullname}&email=${email}&password=${password}`;
            // var url = `http://localhost:5000/register?name=${fullname}&email=${email}&password=${password}`;
            var xhttp = new XMLHttpRequest()
            xhttp.open('POST', url, true)
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhttp.onreadystatechange = ()=>{
                if(xhttp.readyState === 4 && xhttp.status === 201){
                    const result = JSON.parse(xhttp.response)
                    // console.log(result)
                    if(result.success){
                        console.log("returning true")
                        resolve(true);
                    }else{
                        console.log("returning false")
                        resolve(false);
                    }
                }
            }
            xhttp.send()
            xhttp.onerror = (error)=>{
                console.log("in handler")
                resolve(false)
            }
        }catch(error){
            console.log("returning false")
            resolve(false)
        }
    })
}

async function sendOTP(){
    const email = document.getElementById("inputEmail").value;
    // console.log(email)
    if(validateEmail(email)){
    try {
        toggleLoader(true)
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(this.response)
            if(res.success){
                OTP = res.OTP
                // console.log(OTP)
                document.getElementById("checkOtp").disabled = false;
                toggleLoader(false)
            }else{
                console.log("OTP fail")
                throw Error
            }
        }
        };
        xhttp.open("GET", `https://app-authenticator.herokuapp.com/auth/${email}`, true);
        xhttp.send();
    } catch (error) {
        console.log(error.message)
    }
    }
}

async function submitClick(){
    try {
        var btn = document.getElementById("form-validation-btn-click")
        const fullName = document.getElementById("fullName").value;
        const emailID = document.getElementById("inputEmail").value;
        const mainPass = document.getElementById("inputPassword").value;
        const subPass = document.getElementById("checkPassword").value;
        const otpVal = document.getElementById("checkOtp").value
        if(fullName.length >= 3 && validateEmail(emailID) && (mainPass === subPass) && isTrue && mainPass.length > 4){
            console.log("All set")
            toggleLoader(true)
            const hashedPass = mainPass.hashCode();
            const res = await startRegistration(fullName, emailID, hashedPass)
            console.log(res)
            if(res !== undefined && res !== false){
                console.log(res)
                document.getElementById("register-screen").className = "d-none"
                document.getElementById("success-screen").className = "d-flex flex-column success-wrapper"
            }else if(res === false){
                document.getElementById("register-screen").className = "d-none"
                document.getElementById("main-error-screen").className = "d-flex flex-column success-wrapper"
            }
        } else{
            if(fullName.length < 3 || !validateEmail(emailID) || mainPass.length < 5 || otpVal.length < 6){
                if(otpVal.length === 0)btn.click()
            }
    }
    } catch (error) {
        console.log(error.message)
    }
}


