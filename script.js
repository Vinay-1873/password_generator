const generatedPass = document.querySelector("[data-passwordDisplay]");
const copyIcon = document.querySelector(".icon");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const passSize = document.querySelector(".length");
const uppercaseCheck = document.querySelector("#p1");
const lowercaseCheck = document.querySelector("#p2");
const numbersCheck = document.querySelector("#p3");
const symbolsCheck = document.querySelector("#p4");
const strength = document.querySelector(".indicator");
const generateBtn = document.querySelector("#baton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const rndSymbol = '~!#$%^&*(?>$<$)_$&+\*&$\/,:"$%/$-';

let password = "";
let passwordLength = 12;
let checkCount = 0;

function handleSlider() {
    inputSlider.value = passwordLength;
    passSize.innerText = passwordLength;
}

function setIndicator(color) {
    strength.style.backgroundColor = color;
}

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return generateRandomInt(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(generateRandomInt(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(generateRandomInt(65, 91));
}

function generateSymbol() {
    const rndNum = generateRandomInt(0, rndSymbol.length);
    return rndSymbol.charAt(rndNum);
}

function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#ffff00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(generatedPass.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000); // Show for 2 seconds
}

copyIcon.addEventListener('click', () => {
    if (generatedPass.value) {
        copyContent();
    }
});


function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});



function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

generateBtn.addEventListener('click', () => {
    if (checkCount == 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funArr = [];
    if (uppercaseCheck.checked) funArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funArr.push(generateLowerCase);
    if (numbersCheck.checked) funArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funArr.push(generateSymbol);

    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let rndIndex = generateRandomInt(0, funArr.length);
        password += funArr[rndIndex]();
    }

    password = shufflePassword(Array.from(password));

    generatedPass.value = password;

    calcStrength();
});


 