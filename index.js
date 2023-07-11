const btnInfo = [
  {
    classes: "",
    value: 0,
    name: `Button`,
    type: "input",
    disabled: true,
  },
  {
    classes: "clear-btn",
    value: "C",
    name: `Clear`,
    type: "button",
  },
  {
    classes: "",
    value: 1,
    name: `Button`,
    type: "button",
  },
  {
    classes: "",
    value: 2,
    name: `Button`,
    type: "button",
  },
  ,
  {
    classes: "",
    value: 3,
    name: `Button`,
    type: "button",
  },
  ,
  {
    classes: "increase-btn",
    value: "+",
    name: `Operator`,
    type: "button",
  },
  {
    classes: "",
    value: 4,
    name: `Button`,
    type: "button",
  },
  {
    classes: "",
    value: 5,
    name: `Button`,
    type: "button",
  },
  {
    classes: "",
    value: 6,
    name: `Button`,
    type: "button",
  },
  {
    classes: "decrease-btn",
    value: "-",
    name: `Operator`,
    type: "button",
  },
  {
    classes: "",
    value: 7,
    name: `Button`,
    type: "button",
  },
  {
    classes: "",
    value: 8,
    name: `Button`,
    type: "button",
  },
  {
    classes: "",
    value: 9,
    name: `Button`,
    type: "button",
  },
  {
    classes: "multiplication-btn",
    value: "*",
    name: `Operator`,
    type: "button",
  },
  {
    classes: "divide",
    value: "/",
    name: `Operator`,
    type: "button",
  },
  {
    classes: "",
    value: 0,
    name: `Button`,
    type: "button",
  },
  {
    classes: "",
    value: ".",
    name: `Operator`,
    type: "button",
  },
  {
    classes: "result",
    value: "=",
    name: `Result`,
    type: "button",
  },
];
class Model{
  constructor(){
    this.result = '0';
  }
  onButton(value){
    if(value != 0 && this.result === '0'){
      this.result = ''
    }
    console.log('run')
    this.result += value;
    this._commit(this.result);
  }
  onOperator(value){
    this.result += value;
    this._commit(this.result)
  }
  bindShowResult(callback){
    this.showResultChanged = callback;
  }
  _commit(value){
    this.showResultChanged(value);
  }
}
class View{
  constructor(){
    this.app = this.getElement('#root');
    this.calcContainer = `<div class="calculator">
                  <h1>Tính toán</h1>
                  <div class="calc-area" id="calcArea"></div>
                </div>`;
    this.app.innerHTML = this.calcContainer;
    this.area = this.getElement('#calcArea')
    this.renderButton(btnInfo)
  }
  createButton(classes = '',value=null,name,type = 'button',disabled = false){
    if(type === 'button')
    {
      if(name === 'Button')
      return `<button class="btn ${classes}" value=${value} id="number-${value}">${value}</button>`
      else if(name === 'Operator')
      return `<button class="btn ${classes}" value=${value} id="operator-${value}">${value}</button>`
      else
      return `<button class="btn ${classes}" value=${value} id="result-${value}">${value}</button>`
    }
    else if(type === 'input')
      return `<input type="text" class="input ${classes}" id="input" ${disabled?`disabled`:''} />`
    else{
      return `<button class="btn" value="1" onclick="()=>{}">Button</button>`
    }
  }
  renderButton(arr){
    const render = []
    arr.forEach((element)=>{
      render.push(
        this.createButton(element.classes,element.value,element.name,element.type,element.disabled)
      );
     }
    )
    this.area.innerHTML = render.join('');
  }
  createElement(tag,className){
    const element = document.createElement(tag);
    if(className) element.classList.add(className);
    return element;
  }
  getElement(selector){
    const element = document.querySelector(selector);
    return element;
  }
  showResult(result){
    this.getElement("input").value = result;
  }
  bindHandleAddNumber = (handler,arr) => {
    arr.forEach((element)=>{
      if(document.getElementById("number-"+element.value))
      document.getElementById("number-"+element.value).addEventListener('click',event =>
        handler(element.value)
      )
    })
  }
  bindHandleAddOperator = (handler,arr)=>{
    arr.forEach()
  }
}
class Controller{
  constructor(model,view){
    this.view = view;
    this.model = model;
    this.model.bindShowResult(this.showResultChanged)
    this.view.bindHandleAddNumber(this.handleAddNumber,btnInfo);
    this.showResultChanged(this.model.result)
  }
  handleAddNumber = (value)=>{
    this.model.onButton(value);
  }
  showResultChanged =(value)=>{
    this.view.showResult(value);
  }
}

const calculatorApp = new Controller(new Model(),new View());