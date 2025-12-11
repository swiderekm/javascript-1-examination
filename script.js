const questionField = document.querySelector('#question');
const nextBtn = document.querySelector('button#start');
const modeBtn = document.querySelector('button#color-mode');
const scoreOutput = document.querySelector('.score');
const wrongAnswersList = document.querySelector('.wrong-answers');
const questionDisplay = document.querySelector('#out-of');

const questions = [
    {
        type: 'trueOrFalse',
        text: 'Woda wrze w temperaturze 100°C przy normalnym ciśnieniu atmosferycznym.',
        choices: ['Prawda', 'Fałsz'],
        correct: 'Prawda',
    },
    {
        type: 'trueOrFalse',
        text: 'Ludzki mózg składa się w ponad 70% z wody.',
        choices: ['Prawda', 'Fałsz'],
        correct: 'Prawda',
    },
    {
        type: 'trueOrFalse',
        text: 'Australia leży na półkuli północnej.',
        choices: ['Prawda', 'Fałsz'],
        correct: 'Fałsz',
    },
    {
        type: 'trueOrFalse',
        text: 'Fotosynteza zachodzi tylko w nocy.',
        choices: ['Prawda', 'Fałsz'],
        correct: 'Fałsz',
    },
    {
        type: 'trueOrFalse',
        text: 'Wulkany mogą powstawać w miejscach styku płyt tektonicznych.',
        choices: ['Prawda', 'Fałsz'],
        correct: 'Prawda',
    },
    {
        type: 'multipleChoice',
        text: 'Który ocean jest największy na świecie?',
        choices: ['Ocean Atlantycki', 'Ocean Indyjski', 'Ocean Spokojny (Pacyfik)', 'Ocean Arktyczny'],
        correct: 'Ocean Spokojny (Pacyfik)',
    },
    {
        type: 'multipleChoice',
        text: 'Który język ma najwięcej rodzimych użytkowników?',
        choices: ['Angielski', 'Mandaryński', 'Hindi', 'Hiszpański'],
        correct: 'Mandaryński',
    },
    {
        type: 'multipleChoice',
        text: 'Jak nazywa się nauka o gwiazdach i kosmosie?',
        choices: ['Biologia', 'Geologia', 'Astronomia', 'Ekologia'],
        correct: 'Astronomia',
    },
    {
        type: 'multipleChoice',
        text: 'Które z poniższych zwierząt jest gadem?',
        choices: ['Żaba', 'Żółw', 'Salamandra', 'Rekin'],
        correct: 'Żółw',
    },
    {
        type: 'multipleChoice',
        text: 'Którego składnika powietrza najbardziej potrzebujemy do oddychania?',
        choices: ['Dwutlenek węgla', 'Tlen', 'Hel', 'Azot'],
        correct: 'Tlen',
    },
    {
        type: 'checkboxQues',
        text: 'Które z poniższych są kontynentami?',
        choices: ['Europa', 'Azja', 'Arktyka', 'Afryka'],
        correct: ['Europa', 'Azja', 'Afryka'],
    },
    {
        type: 'checkboxQues',
        text: 'Które jednostki są miarami długości?',
        choices: ['Metr', 'Litr', 'Centymetr', 'Kelwin'],
        correct: ['Metr', 'Centymetr'],
    },
    {
        type: 'checkboxQues',
        text: 'Które z poniższych to przeglądarki internetowe?',
        choices: ['Google Chrome', 'Safari', 'Android', 'Firefox'],
        correct: ['Google Chrome', 'Safari', 'Firefox']
    },
    {
        type: 'checkboxQues',
        text: 'Które kraje należą do krajów nordyckich w Europie?',
        choices: ['Szwecja', 'Niemcy', 'Norwegia', 'Dania'],
        correct: ['Szwecja', 'Norwegia', 'Dania']
    },
    {
        type: 'checkboxQues',
        text: 'Które z poniższych są pierwiastkami chemicznymi?',
        choices: ['Tlen', 'Woda', 'Złoto', 'Magnez'],
        correct: ['Tlen', 'Złoto', 'Magnez']
    },
];


const questionsOriginalLength = questions.length;
let points = [];
let askedQuestions = [];
let currentQuestion = null;
let selectedCheckboxes = [];
let wrongAnswers = [];

modeBtn.addEventListener('click', () => {
    document.body.classList.toggle("darkMode");
    let allBtn = document.querySelectorAll('button');

    if (document.body.classList.contains('darkMode')) {
        modeBtn.innerHTML = 'TRYB JASNY';
    } else {
      modeBtn.innerHTML = 'TRYB CIEMNY';  
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
        scoreOutput.innerHTML = `PUNKTY: ${total}/${askedQuestions.length} <br><strong>Zawalony!</strong>`
    } 
    else if (total >= (askedQuestions.length * 0.5) && total <= (askedQuestions.length * 0.75)) 
    {
        scoreOutput.style.color = 'orange';
        scoreOutput.innerHTML = `PUNKTY: ${total}/${askedQuestions.length} <br><strong>Zaliczony!</strong>`
    } 
    else if (total > (askedQuestions.length * 0.75)) 
    {
        scoreOutput.style.color = 'green';
        scoreOutput.innerHTML = `PUNKTY: ${total}/${askedQuestions.length} <br><strong>Zaliczony z wyróżnieniem!</strong>`
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
    
    if (!isCorrect) {
        wrongAnswers.push({
            questionText: question.text,
            userAnswer: answer,
            correctAnswer: question.correct
        });
    }
}

nextBtn.addEventListener('click', () => {
    nextBtn.innerText = 'NASTĘPNE PYTANIE';
    questionDisplay.innerHTML = `${askedQuestions.length + 1}/${questionsOriginalLength}`;

    if (currentQuestion && currentQuestion.type === 'checkboxQues') {
        answerChecker(selectedCheckboxes, currentQuestion);
    }

    questionField.innerHTML = "";
    selectedCheckboxes = [];

    if (questions.length === 0) {
        questionField.innerText = "Quiz Zakończony!";
        nextBtn.style.display = 'none';
        questionDisplay.style.display = 'none'
;        printScore();

        wrongAnswers.forEach(item => {
            const wrong = document.createElement('div');
            wrong.style.borderTop = '1px solid black';

            wrong.innerHTML = `
                <p><strong>Pytanie:</strong> ${item.questionText}</p>
                <p><strong>Twoje odpowiedzi:</strong><p class='green-p'>${item.userAnswer}</p></p>
                <p><strong>Poprawne odpowiedzi:</strong><p class='red-p'>${item.correctAnswer}</p></p>
            `;

            wrongAnswersList.append(wrong);
        });
        return;
    }

    let currentIndex = Math.floor(Math.random() * questions.length);
    currentQuestion =  questions[currentIndex];

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
    } else if (currentQuestion.type === 'checkboxQues')  {
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