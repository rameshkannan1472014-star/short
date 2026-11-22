(() => {
  "use strict";
  const display = document.getElementById("display");
  const expression = document.getElementById("expression");
  let current = "0";
  let previous = null;
  let operator = null;
  let resetNext = false;
  let justCalculated = false;

  const format = value => {
    if (!Number.isFinite(value)) return "Error";
    if (Math.abs(value) > 999999999999 || (Math.abs(value) > 0 && Math.abs(value) < 0.0000001)) {
      return value.toExponential(6).replace(/\.0+e/, "e");
    }
    return String(Number(value.toPrecision(12)));
  };
  const update = () => { display.textContent = current; };
  const clear = () => {
    current = "0"; previous = null; operator = null; resetNext = false; justCalculated = false;
    expression.textContent = "0"; update();
  };
  const inputDigit = digit => {
    if (current === "Error" || resetNext || justCalculated) {
      current = digit; resetNext = false; justCalculated = false;
    } else if (current === "0") current = digit;
    else if (current.replace("-", "").length < 16) current += digit;
    update();
  };
  const decimal = () => {
    if (current === "Error" || resetNext || justCalculated) {
      current = "0."; resetNext = false; justCalculated = false;
    } else if (!current.includes(".")) current += ".";
    update();
  };
  const chooseOperator = next => {
    if (current === "Error") return;
    const value = Number(current);
    if (operator && !resetNext) {
      const result = calculate(previous, value, operator);
      current = format(result);
      if (current === "Error") { previous = null; operator = null; update(); return; }
    } else previous = value;
    operator = next;
    resetNext = true;
    justCalculated = false;
    expression.textContent = current + " " + next;
    update();
  };
  const calculate = (a,b,op) => {
    if (a === null || !Number.isFinite(a) || !Number.isFinite(b)) return NaN;
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b === 0 ? NaN : a / b;
    return b;
  };
  const equals = () => {
    if (!operator || previous === null || current === "Error") return;
    const right = Number(current);
    const result = calculate(previous, right, operator);
    expression.textContent = format(previous) + " " + operator + " " + format(right) + " =";
    current = format(result);
    previous = null; operator = null; resetNext = true; justCalculated = true;
    update();
  };
  const sign = () => {
    if (current === "0" || current === "Error") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    update();
  };
  const percent = () => {
    if (current === "Error") return;
    current = format(Number(current) / 100);
    update();
  };
  const backspace = () => {
    if (resetNext || justCalculated || current === "Error") { current = "0"; resetNext = false; justCalculated = false; }
    else if (current.length <= 1 || (current.length === 2 && current.startsWith("-"))) current = "0";
    else current = current.slice(0, -1);
    update();
  };
  document.querySelector(".keys").addEventListener("click", event => {
    const key = event.target.closest("button");
    if (!key) return;
    if (key.dataset.digit !== undefined) inputDigit(key.dataset.digit);
    else if (key.dataset.op) chooseOperator(key.dataset.op);
    else {
      const action = key.dataset.action;
      if (action === "clear") clear();
      if (action === "decimal") decimal();
      if (action === "equals") equals();
      if (action === "sign") sign();
      if (action === "percent") percent();
      if (action === "backspace") backspace();
    }
  });
  document.addEventListener("keydown", event => {
    if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
    else if (event.key === ".") decimal();
    else if (event.key === "+") chooseOperator("+");
    else if (event.key === "-") chooseOperator("−");
    else if (event.key === "*") chooseOperator("×");
    else if (event.key === "/") { event.preventDefault(); chooseOperator("÷"); }
    else if (event.key === "Enter" || event.key === "=") equals();
    else if (event.key === "Backspace") backspace();
    else if (event.key === "Escape") clear();
    else if (event.key === "%") percent();
  });
  update();
})();
