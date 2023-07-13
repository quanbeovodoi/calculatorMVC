import BTN_INFO from "./unit.js";
let iCalc = 0;
class Model {
  constructor() {
    this.result = "0";
    this.isDone = false;
    iCalc++;
  }
  onButton(value) {
    if(this.isDone === true){
      this._reset();
    }
    if (this.result === "0") {
      this.result = "";
    }
    this.result += value;
    this._commit(this.result);
  }
  onOperator(value) {
    if(this.isDone === true){
      this.isDone = false;
    }
    const arr = this.result.split("");
    const reNumber = /-?\d+(\.\d+)?/g;
    let arrNumb = this.result.toString().match(reNumber);
    console.log(Number(arrNumb[arrNumb.length - 1]));
    if (!Number.isInteger(Number(arrNumb[arrNumb.length - 1])) && value === ".") {
      return 0;
    }
    if (
      arr[arr.length - 1] === "/" ||
      arr[arr.length - 1] === "+" ||
      arr[arr.length - 1] === "-" ||
      arr[arr.length - 1] === "*" ||
      arr[arr.length - 1] === "."
    ) {
      // console.log('đã vào đây rồi');
      arr.splice(-1, 1);
      this.result = arr.join("");
    }

    this.result += value;
    this._commit(this.result);
  }
  onResult() {
    if (this.result != "0") {
      this.result = this.calculatorAct(this.result);
      this._commit(this.result);
      this.isDone = true;
    }
  }
  _reset() {
    this.isDone = false;
    this.result = "0";
    this._commit(this.result);
  }
  calculatorAct(input = "-2+25*2-1+10") {
    const inputArr = input.split("");
    const reNumber = /-?\d+(\.\d+)?/g;
    let arrNumb = input.match(reNumber);
    // console.log(arrNumb)
    if (
      inputArr[0] === "+" ||
      inputArr[0] === "-" ||
      inputArr[0] === "*" ||
      inputArr[0] === "/"
    ) {
      inputArr.splice(0, 1);
      input = inputArr.join("");
    }
    if (
      inputArr[inputArr.length - 1] === "+" ||
      inputArr[inputArr.length - 1] === "-" ||
      inputArr[inputArr.length - 1] === "*" ||
      inputArr[inputArr.length - 1] === "/"
    ) {
      inputArr.splice(-1, 1);
      input = inputArr.join("");
    }
    const reOperator = /\D+/g;
    let arrOperator = input.match(reOperator);
    if(arrNumb === null || arrNumb.length === 1){
      return arrNumb.join('');
    }
    // loại bỏ dấu chấm trong mảng chứa dấu
    if (arrOperator != null) {
      const indexDot = arrOperator.findIndex((e) => e === ".");
      if (indexDot != -1) arrOperator.splice(indexDot, 1);
      // chuyển dấu trừ thành cộng
      arrNumb = arrNumb.map((element) => Number(element));
      arrOperator = arrOperator.map((element) => {
        if (element === "-") {
          element = "+";
        }
        return element;
      });
    }
    //Thực hiện tính toán
    //-------------------------Nhân chia trước------------------------
    const finded = [];
    for (let i = 0; i < arrOperator.length; i++) {
      if (
        arrOperator[i].toString() === "*" ||
        arrOperator[i].toString() === "/"
      ) {
        finded.push(i);
      }
    }
    if (finded.length > 0) {
      let pos = finded.shift();
      let count = 0;
      for (let i = 0; i < arrNumb.length; i++) {
        if (i === pos) {
          //   console.log("Run", i, pos);
          if (arrOperator[i].toString() === "*") arrNumb[i] *= arrNumb[i + 1];
          if (arrOperator[i].toString() === "/") arrNumb[i] /= arrNumb[i + 1];
          arrNumb.splice(i + 1, 1);
          arrOperator.splice(pos, 1);
          count++;
          if (finded.length > 0) {
            pos = finded.shift() - count;
          } else {
            pos = null;
          }
          i = i - 1;
        }
      }
    }
    // console.log(arrNumb)
    //--------------------------Cộng trừ---------------------------
    const resultEnd = arrNumb.reduce((preVal, currVal) => {
      let newVal;
      // Thực hiện phép tính 2 số tương ứng với mỗi phép đã lưu trong mảng
      if (arrOperator.length > 0) {
        let optHead = arrOperator.shift();
        if (optHead.toString() === "+") {
          // console.log(preVal,currVal)
          newVal = Number(preVal) + Number(currVal);
          // console.log("Giá trị mới:",newVal)
        }
      }
      return newVal;
    });
    if (!isFinite(resultEnd)) {
      console.log(resultEnd);
      alert("Ko chia được cho 0!");
      return "0";
    } else {
      arrNumb = [resultEnd];
      return resultEnd.toString();
    }
    // console.log(arrNumb)
  }
  bindShowResult(callback) {
    this.showResultChanged = callback;
  }
  _commit(value) {
    this.showResultChanged(value);
  }
}
class View {
  constructor() {
    this.app = this.getElement("#root");
    this.calcContainer = `<div class="calculator"><h1>Tính toán</h1><div class="calc-area" id="calcArea_${iCalc}"></div></div>`;
    this.app.insertAdjacentHTML("afterbegin", this.calcContainer);
    this.area = this.getElement(`#calcArea_${iCalc}`);
    this.renderButton(BTN_INFO);
    this.idView = iCalc
  }
  createButton(
    classes = "",
    value = null,
    name,
    type = "button",
    disabled = false
  ) {
    if (type === "button") {
      if (name === "Button")
        return `<button class="btn ${classes}" value=${value} id="number-${value}-${iCalc}">${value}</button>`;
      else if (name === "Operator")
        return `<button class="btn ${classes}" value=${value} id="operator-${value}-${iCalc}">${value}</button>`;
      else
        return `<button class="btn ${classes}" value=${value} id="result-${value}-${iCalc}">${value}</button>`;
    } else if (type === "input")
      return `<input type="text" class="input ${classes}" id="input-${iCalc}" ${
        disabled ? `disabled` : ""
      } />`;
    else {
      return `<button class="btn" value="1" onclick="()=>{}">Button</button>`;
    }
  }
  renderButton(arr) {
    const render = [];
    arr.forEach((element) => {
      render.push(
        this.createButton(
          element.classes,
          element.value,
          element.name,
          element.type,
          element.disabled
        )
      );
    });
    this.area.innerHTML = render.join("");
  }
  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }
  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }
  
  showResult(result) {
    console.log('iCalc_',iCalc);
    this.getElement(`#input-${this.idView}`).value = result;
  }
  bindHandleAddNumber = (handler, arr) => {
    arr.forEach((element) => {
      if (
        document.getElementById(`number-${element.value}-${iCalc}`) &&
        element.name != "Input"
      )
        document
          .getElementById(`number-${element.value}-${iCalc}`)
          .addEventListener("click", (event) => handler(element.value));
    });
  };
  bindHandleAddOperator = (handler, arr) => {
    arr.forEach((element) => {
      if (
        document.getElementById("operator-" + element.value +'-'+ iCalc) &&
        element.name != "Input"
      )
        document
          .getElementById("operator-" + element.value +'-'+ iCalc)
          .addEventListener("click", (event) => handler(element.value));
    });
  };
  bindHandleEndResult = (handler) => {
    document.getElementById("result-="+'-'+iCalc).addEventListener("click", (event) => handler());
  };
  bindHandleResetResult = (handler) => {
    document
      .getElementById("result-C"+'-'+ iCalc)
      .addEventListener("click", (event) => handler());
  };
}
class Controller {
  constructor(model, view) {
    this.view = view;
    this.model = model;
    this.model.bindShowResult(this.showResultChanged);
    this.view.bindHandleAddNumber(this.handleAddNumber, BTN_INFO);
    this.view.bindHandleAddOperator(this.handlerAddOperator, BTN_INFO);
    this.view.bindHandleEndResult(this.handleEndResult);
    this.view.bindHandleResetResult(this.handleResetResult);
    this.showResultChanged(this.model.result);
  }
  handleAddNumber = (value) => {
    this.model.onButton(value);
  };
  handlerAddOperator = (value) => {
    this.model.onOperator(value);
  };
  handleEndResult = (value) => {
    this.model.onResult(value);
  };
  handleResetResult = () => {
    this.model._reset();
  };
  showResultChanged = (value) => {
    this.view.showResult(value);
  };
}

const calculatorApp = new Controller(new Model(), new View());
const calculatorApp2 = new Controller(new Model(), new View());
const calculatorApp3 = new Controller(new Model(), new View());

// function calculatorAct(input='-2+25*2-1+10'){
//   const inputArr = input.split('');
//   const reNumber = /-?\d+/g;
//   let arrNumb = input.match(reNumber);
//   if(inputArr[0] === '+' || inputArr[0] === '-' || inputArr[0] === '*' || inputArr[0] === '/'){
//     inputArr.splice(0,1);
//     input = inputArr.join('')
//   }
//   const reOperator = /\D+/g;
//   let arrOperator = input.match(reOperator);
//   arrNumb = arrNumb.map(element => Number(element));
//   arrOperator = arrOperator.map(element => {
//     if(element === '-'){
//       element = '+';
//     }
//     return element;
//   })
//   //Thực hiện tính toán
//   //Nhân chia trước
//   const finded = [];
//   for (let i = 0; i < arrOperator.length; i++) {
//     if (arrOperator[i].toString() === "*" || arrOperator[i].toString() === "/") {
//       finded.push(i);
//     }
//   }
//   if (finded.length > 0) {
//     let pos = finded.shift();
//     let count = 0;
//     for (let i = 0; i < arrNumb.length; i++) {
//       if (i === pos) {
//         //   console.log("Run", i, pos);
//         if (arrOperator[i].toString() === "*") arrNumb[i] *= arrNumb[i + 1]?arrNumb[i + 1]:1;
//         if (arrOperator[i].toString() === "/") arrNumb[i] /= arrNumb[i + 1]?arrNumb[i + 1]:1;
//         arrNumb.splice(i + 1, 1);
//         arrOperator.splice(pos, 1);
//         count++;
//         if (finded.length > 0) {
//           pos = finded.shift() - count;
//         } else {
//           pos = null;
//         }
//         i = i - 1;
//       }
//     }
//   }
//   console.log(arrNumb)
//   //Cộng trừ
//   const resultEnd = arrNumb.reduce((preVal, currVal) => {
//     let newVal;
//     // Thực hiện phép tính 2 số tương ứng với mỗi phép đã lưu trong mảng
//     if (arrOperator.length > 0) {
//       let optHead = arrOperator.shift();
//       if (optHead.toString() === "+") {
//         newVal = Number(preVal) + Number(currVal);
//       }
//     }
//     console.log(preVal,currVal)
//     return newVal;
//   });
//   if(resultEnd.toString() === 'Infinity'){
//     onClear();
//     alert('Ko chia được cho 0!');
//   }else{
//     arrNumb = [resultEnd];
//   }
//   console.log(arrNumb)
// }
// calculatorAct()
