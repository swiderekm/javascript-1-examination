const questionField = document.querySelector('#question');
const nextBtn = document.querySelector('button#start');
const modeBtn = document.querySelector('button#color-mode');
const scoreOutput = document.querySelector('.score');
const wrongAnswersList = document.querySelector('.wrong-answers');
const questionDisplay = document.querySelector('#out-of');

const questions = [
    {
        type: 'trueOrFalse',
        text: 'Vatten kokar vid 100°C vid normalt lufttryck.',
        choices: ['Sant', 'Falskt'],
        correct: 'Sant',
    },
    {
        type: 'trueOrFalse',
        text: 'Den mänskliga hjärnan består av mer än 70% vatten.',
        choices: ['Sant', 'Falskt'],
        correct: 'Sant',
    },
    {
        type: 'trueOrFalse',
        text: 'Australia ligger i norra hemisfären.',
        choices: ['Sant', 'Falskt'],
        correct: 'Falskt',
    },
    {
        type: 'trueOrFalse',
        text: 'Fotosyntes sker bara under natten.',
        choices: ['Sant', 'Falskt'],
        correct: 'Falskt',
    },
    {
        type: 'trueOrFalse',
        text: 'Vulkaner kan bildas där tektoniska plattor möts.',
        choices: ['Sant', 'Falskt'],
        correct: 'Sant',
    },
    {
        type: 'multipleChoice',
        text: 'Vilket är världens största hav?',
        choices: ['Atlanten', 'Indiska oceanen', 'Stilla havet', 'Norra ishavet'],
        correct: 'Stilla havet',
    },
    {
        type: 'multipleChoice',
        text: 'Vilket språk har flest modersmålstalare?',
        choices: ['Engelska', 'Mandarin', 'Hindi', 'Spanska'],
        correct: 'Mandarin',
    },
    {
        type: 'multipleChoice',
        text: 'Vad kallas läran om stjärnor och rymden?',
        choices: ['Biologi', 'Geologi', 'Astronomi', 'Ekologi'],
        correct: 'Astronomi',
    },
    {
        type: 'multipleChoice',
        text: 'Vilket av följande djur är en reptil?',
        choices: ['Groda', 'Sköldpadda', 'Salamander', 'Haj'],
        correct: 'Sköldpadda',
    },
    {
        type: 'multipleChoice',
        text: 'Vilket ämne i luften är vi mest beroende av för att kunna andas?',
        choices: ['Koldioxid', 'Syre', 'Helium', 'Kväve'],
        correct: 'Syre',
    },
    {
        type: 'checkboxQues',
        text: 'Vilka av följande är kontinenter?',
        choices: ['Europa', 'Asien', 'Arktis', 'Afrika'],
        correct: ['Europa', 'Asien', 'Afrika'],
    },
    {
        type: 'checkboxQues',
        text: 'Vilka enheter är mått på längd?',
        choices: ['Meter', 'Liter', 'Centimeter', 'Kelvin'],
        correct: ['Meter', 'Centimeter'],
    },
    {
        type: 'checkboxQues',
        text: 'Vilka av dessa är webbläsare?',
        choices: ['Google Chrome', 'Safari', 'Android', 'Firefox'],
        correct: ['Google Chrome', 'Safari', 'Firefox']
    },
    {
        type: 'checkboxQues',
        text: 'Vilka länder ingår i Norden?',
        choices: ['Sverige', 'Tyskland', 'Norge', 'Danmark'],
        correct: ['Sverige', 'Norge', 'Danmark']
    },
    {
        type: 'checkboxQues',
        text: 'Vilka av följande är grundämnen?',
        choices: ['Syre', 'Vatten', 'Guld', 'Magnesium'],
        correct: ['Syre', 'Guld', 'Magnesium']
    },
    // {
    //     type: 'checkboxQues',
    //     text: 'test extra question',
    //     choices: ['opt1', 'opt2', 'opt3'],
    //     correct: ['opt1', 'opt3']
    // }
];

const questionsOriginalLength = questions.length;
let points = [];
let userAnswers = [];
let askedQuestions = [];
let currentQuestion = null;
let selectedCheckboxes = [];
let wrongAnswers = [];

modeBtn.addEventListener('click', () => {
    document.body.classList.toggle("darkMode");
    let allBtn = document.querySelectorAll('button');

    if (document.body.classList.contains('darkMode')) {
        modeBtn.innerHTML = 'LIGHT MODE';
    } else {
      modeBtn.innerHTML = 'DARK MODE';  
    }
    
    allBtn.forEach(element => {
        element.classList.toggle('btnDarkMode');
    })
});

const newBtnDetector = new MutationObserver(mutations => {
    mutations.forEach(element => {
        element.addedNodes.forEach(node => {
            if (node.tagName === "BUTTON" &&
                document.body.classList.contains("darkMode")) {
                node.classList.add("btnDarkMode");
            }
        });
    });
});

newBtnDetector.observe(document.body, {childList: true, subtree: true });

function printScore() {
    const total = points.reduce((sum, value) => sum + value, 0);
    
    if (total < (askedQuestions.length * 0.5)) 
    {
        scoreOutput.style.color = 'red';
        scoreOutput.innerHTML = `POINTS: ${total}/${askedQuestions.length} <br><strong>Underkänd!</strong>`
    } 
    else if (total >= (askedQuestions.length * 0.5) && total <= (askedQuestions.length * 0.75)) 
    {
        scoreOutput.style.color = 'orange';
        scoreOutput.innerHTML = `POINTS: ${total}/${askedQuestions.length} <br><strong>Godkänd!</strong>`
    } 
    else if (total > (askedQuestions.length * 0.75)) 
    {
        scoreOutput.style.color = 'green';
        scoreOutput.innerHTML = `POINTS: ${total}/${askedQuestions.length} <br><strong>Godkänd med högsta betyg!</strong>`
    };
}

function answerChecker(answer, question) {
    let correct = question.correct;
    let isCorrect;

    if (Array.isArray(correct)) {
        const sortedUser = [...answer].sort();
        const sortedCorrect = [...correct].sort();
        isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
    } else {
        isCorrect = (answer === correct);
    }

    points.push(isCorrect ? 1 : 0);
    userAnswers.push(answer);
    
    if (!isCorrect) {
        wrongAnswers.push({
            questionText: question.text,
            userAnswer: answer,
            correctAnswer: question.correct
        });
    }
}

nextBtn.addEventListener('click', () => {
    nextBtn.innerText = 'NEXT QUESTION';
    questionDisplay.innerHTML = `${askedQuestions.length + 1}/${questionsOriginalLength}`;

    if (currentQuestion && currentQuestion.type === 'checkboxQues') {
        answerChecker(selectedCheckboxes, currentQuestion);
    }

    questionField.innerHTML = "";
    selectedCheckboxes = [];

    if (questions.length === 0) {
        questionField.innerText = "Quiz Done!";
        nextBtn.style.display = 'none';
        questionDisplay.style.display = 'none'
;        printScore();

        wrongAnswers.forEach(item => {
            const wrong = document.createElement('div');
            wrong.style.borderTop = '1px solid black';

            wrong.innerHTML = `
                <p><strong>Fråga:</strong> ${item.questionText}</p>
                <p><strong>Dina svar:</strong><p class='green-p'>${item.userAnswer}</p></p>
                <p><strong>Korrekta svaret:</strong><p class='red-p'>${item.correctAnswer}</p></p>
            `;

            wrongAnswersList.append(wrong);
        });
        return;
    }


    let currentIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[currentIndex];

    askedQuestions.push(currentQuestion);
    questions.splice(currentIndex, 1);

    const qText = document.createElement("p");
    qText.innerText = currentQuestion.text;
    questionField.append(qText);

    if (currentQuestion.type === 'multipleChoice' || currentQuestion.type === 'trueOrFalse') {
        currentQuestion.choices.forEach(option => {
            const answerNextBtn = document.createElement('button');
            answerNextBtn.innerText = option;

            answerNextBtn.addEventListener('click', () => {
                answerChecker(option, currentQuestion);
                nextBtn.click();
            });

            questionField.append(answerNextBtn);
        });
    }
    else if (currentQuestion.type === 'checkboxQues') {
        currentQuestion.choices.forEach(option => {
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.value = option;
            checkbox.classList.add('checkbox-design')

            checkbox.addEventListener("change", () => {
                if (checkbox.checked) selectedCheckboxes.push(option);
                else selectedCheckboxes.splice(selectedCheckboxes.indexOf(option), 1);
            });

            const label = document.createElement('label');
            label.innerText = option;

            const wrapper = document.createElement('div');
            wrapper.append(label);
            label.prepend(checkbox);
            questionField.append(wrapper);
        });
    }
});