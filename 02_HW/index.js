document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

let txt1;
let txt2;
let ddlOp;
let btnCalc;
let lblRes;
let output;
let btn2;

function pageLoaded() {
    txt1 = document.getElementById('txt1');
    txt2 = document.getElementById('txt2');
    ddlOp = document.getElementById('ddlOp');
    btnCalc = document.getElementById('btnCalc');
    lblRes = document.getElementById('lblRes');
    output = document.getElementById('output');
    btn2 = document.getElementById('btn2');

    // כפתור =
    btnCalc.addEventListener('click', calculate);

    // כפתור Register Click From Code
    btn2.addEventListener('click', () => {
        print("Button 2 was clicked (registered from code).", true);
    });

    // ולידציה בזמן הקלדה – סימון is-valid / is-invalid
    txt1.addEventListener('input', validateInput);
    txt2.addEventListener('input', validateInput);
}

// בודק אם הערך מספרי
function isNumeric(value) {
    const trimmed = value.trim();
    if (trimmed === "") return false;
    return !isNaN(trimmed);
}

// סעיף 5 – עדכון מחלקות is-valid / is-invalid
function validateInput(event) {
    const el = event.target;
    const value = el.value;

    if (value.trim() === "") {
        el.classList.remove('is-valid', 'is-invalid');
        return;
    }

    if (isNumeric(value)) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
    } else {
        el.classList.remove('is-valid');
        el.classList.add('is-invalid');
    }
}

function calculate() {
    const val1 = txt1.value.trim();
    const val2 = txt2.value.trim();
    const op = ddlOp.value;

    const valid1 = isNumeric(val1);
    const valid2 = isNumeric(val2);

    // לעדכן צבעים גם בלחיצה
    validateInput({ target: txt1 });
    validateInput({ target: txt2 });

    if (!valid1 || !valid2) {
        lblRes.textContent = "Please enter numeric values only";
        print("Error: invalid input.", true);
        return;
    }

    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    let result;

    if (op === '/' && num2 === 0) {
        lblRes.textContent = "Cannot divide by zero";
        const line = `${num1} / ${num2} – ERROR (divide by zero)`;
        print(line, true);
        return;
    }

    switch (op) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2; // double
            break;
        default:
            result = NaN;
    }

    lblRes.textContent = result;

    // סעיף 2 – לכתוב כל פעולה ללוג:
    const logLine = `${num1} ${op} ${num2} = ${result}`;
    print(logLine, true);
}

// סעיף 2 – פונקציית print עם פרמטר בוליאני append
// append = false  -> מחליף את התוכן
// append = true   -> מוסיף שורה חדשה ללוג
function print(text, append) {
    if (!output) return;

    if (!append || output.value === "") {
        output.value = text;
    } else {
        output.value += "\n" + text;
    }

    // גלילה לשורה האחרונה
    output.scrollTop = output.scrollHeight;
}

// דוגמה לפונקציה demoNative (אפשר להשאיר/להתאים)
function demoNative() {
    let out = "";

    out += "[Number] typeof 5 = " + typeof 5;
    out += "\n[String] typeof 'hello' = " + typeof "hello";
    out += "\n[Boolean] typeof true = " + typeof true;
    out += "\n[Null] typeof null = " + typeof null;
    out += "\n[Undefined] typeof undefined = " + typeof undefined;
    out += "\n[Object] typeof {} = " + typeof {};

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) {
        return fn(a, b);
    }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    // כאן אנחנו לא מוסיפים, אלא מחליפים את הטקסט בלוג
    print(out, false);
}
