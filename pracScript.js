const button = document.querySelectorAll('.button');
const display = document.querySelector('p');
const numBtn = document.querySelectorAll('.num-button');

let initialVal = "0" // 화면에 보이는 값
let firstOperand = null; // 첫번째 피연산자
let secondOperand = null; // 두번째 피연산자
let operator = null; // 연산자
const maxLength = 15; // 결과값 길이 제한



numBtn.forEach ((btn) => { //숫자버튼 함수
    btn.addEventListener('click', (e) => {
        const clickedNum = e.target.textContent;

        if (initialVal === '0') {
            initialVal = clickedNum;
        } else {
            if (initialVal.replace('.', '').length < 10) {
                initialVal += clickedNum;
            }
        }
        display.textContent = initialVal;
    })
})

//버튼을 순회하며 클릭 이벤트 할당
button.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        const clickedBtn = e.target.textContent;

        if (clickedBtn === 'AC') { //ac버튼 누를때 초기화
            initialVal = '0';
            firstOperand = null;
            operator = null;
            display.textContent = initialVal;
        } else if (clickedBtn === '.') {//.을 눌렀을 때
            if (!initialVal.includes('.')) { //.포함이 안되어있을때
                initialVal += '.' // .을 더하기 할당
                display.textContent = initialVal //더하기 할당 한 것을 표시
            }
        } else if (clickedBtn === '±' && initialVal !== '0') {
                initialVal = initialVal * -1; //0이 아닐때 -1을 곱해 음수,양수 만들기
                display.textContent = initialVal
        } else if (clickedBtn === '%') { // %누르면 소수점(백분율)로 변환
            initialVal = initialVal * 1/100;
            let resultStr = initialVal.toString();

            if (resultStr.length > maxLength) {
                if (resultStr.includes('.')) {
                    const integerPartLength = resultStr.split('.')[0].length;
                    const decimalsAllowed = maxLength - integerPartLength - 1;
                    resultStr = Number(initialVal).toFixed(decimalsAllowed > 0 ? decimalsAllowed : 0);
                    // 자르고도 길면 OVERFLOW 처리
                    if (resultStr.length > maxLength) {
                        resultStr = 'OVERFLOW';
                    }
                } else {
                    resultStr = 'OVERFLOW';
                }
            }
            initialVal = resultStr;
            display.textContent = initialVal
        } else if (clickedBtn === 'D E L E T E') {
            if (initialVal === 'OVERFLOW') {
                initialVal = '0';
                firstOperand = null;
                operator = null;
                display.textContent = initialVal;
            } else if (initialVal.length >= 2) {
                initialVal = initialVal.slice(0,-1);
            } else {
                initialVal = '0';
            }
            display.textContent = initialVal;
        }

        else if (clickedBtn === '=') { // = 을 입력했을때 
            if (operator && firstOperand !== null)
            // 첫번째 피연산자와 연산자가 입력이 되었을 때
                secondOperand = initialVal; // 두번째 피연산자 값 표시
                console.log (`second operand : ${secondOperand}`);
                // 두번째 피연산자 콘솔 출력
                const result = calculate(firstOperand , operator, secondOperand);
                //결과 변수명에 계산기 함수를 할당 후 (매개변수)
                
                let resultStr = result.toString();

                if (resultStr.length > maxLength) {
                    if (resultStr.includes('.')) {
                        resultStr = Number(result).toFixed(decimalsAllowed > 0 ? decimalsAllowed : 0);
                    } else {
                        resultStr = 'OVERFLOW';
                    }
                }
                initialVal = resultStr;
                display.textContent = initialVal; //계산 결과를 디스플레이에 출력
                console.log (`result : ${result}`);
                firstOperand = null;
                operator = null;
        
            } else if (['+','-','X','/'].includes(clickedBtn)) {
            //버튼 클릭에 연산자가 포함 되었을때
            firstOperand = initialVal; //첫 피연산자가 2자 이상일때 출력하기 위함
            operator = clickedBtn; // 클린된 연산자는 변수에 저장

            if (firstOperand !== null && operator !== null) {
                console.log (`First Operand : ${firstOperand}
operator : ${operator}`) //첫번째 피연산자와 연산자가 입력 되었을때 콘솔에 출력
            initialVal = '' // 두번째 피연산자를 받기위해 빈 문자열로 초기와
            }
        }
    })
})



//calculate func
const calculate = (num1, oper, num2) => {
    num1 = Number(num1)
    num2 = Number(num2) // 문자열을 숫자열로 변환

    switch (oper) {
        case '+':
            return num1 + num2
        case '-':
            return num1 - num2
        case 'X':
            return num1 * num2
        case '/':
            return num2 !== 0 ? num1 / num2 : 'ERROR'
            // 두번째 피연산자가 0일때 에러
        default :
            console.log (`ERROR`);
    }
}

function openNotepad() {
    const note = localStorage.getItem("memo") || "";
    document.getElementById("noteContent").value = note;
    document.getElementById("notepad").style.display = "block";
}

function closeNotepad() {
    document.getElementById("notepad").style.display = "none";
}

function saveNotepad() {
    const content = document.getElementById("noteContent").value;
    localStorage.setItem("memo", content);
    alert("저장했습니다.");
}

let isDragging = false;
let offsetX, offsetY;

function startDrag(e) {
    isDragging = true;
    const notepad = document.getElementById("notepad");
    offsetX = e.clientX - notepad.offsetLeft;
    offsetY = e.clientY - notepad.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
    if (isDragging) {
    const notepad = document.getElementById("notepad");
    notepad.style.left = e.clientX - offsetX + "px";
    notepad.style.top = e.clientY - offsetY + "px";
    }
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
}