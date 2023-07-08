const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questioncount = document.getElementById('progress-text');
const scored = document.getElementById('score');
const bar = document.getElementById('progress-bar-full');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentquestion = {};
let acceptinganswers = true;
let score=0;
let questioncounter=0;
let availablequestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then((res) =>{
        return res.json();
    })
    .then((loadedquestions) =>{
        // console.log(loadedquestions.results);
        questions = loadedquestions.results.map( (loadedquestions) =>{
            const formattedquestion = {
                question : loadedquestions.question,
            };

            const answerchoices = [...loadedquestions.incorrect_answers];
            formattedquestion.answer = Math.floor(Math.random() * 4) +1;
            answerchoices.splice(formattedquestion.answer -1 , 0 ,
                loadedquestions.correct_answer);

            answerchoices.forEach((choice , index) =>{
                formattedquestion["choice" + (index +1)] = choice;
            });

            return formattedquestion;
        });
        // questions = loadedquestions;
       
        startgame();
    })
    .catch((err) =>{
        console.error(err);
    });

//constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;



startgame = ()=>{
    questioncounter=0;
    score=0;
    availablequestions = [...questions];
    // console.log(availablequestions);
    getnewquestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getnewquestion = ()=>{
    if(availablequestions.length==0 || questioncounter>= MAX_QUESTIONS){
        //go to the end page
        localStorage.setItem("mostrecentscore" , score);
        return window.location.assign('./end.html');
    }
    questioncounter++;
    questioncount.innerText =`Question${questioncounter}/${MAX_QUESTIONS}`;


    //update the progress bar
    bar.style.width = `${(questioncounter/MAX_QUESTIONS)*100}%`;


    const questionindex = Math.floor(Math.random()* availablequestions.length);
    currentquestion = availablequestions[questionindex];
    question.innerText = currentquestion.question;

    choices.forEach(choice =>{
        const number = choice.dataset["number"];
        choice.innerText = currentquestion["choice"+number];
    });
    availablequestions.splice(questionindex,1);
    acceptinganswers=true;

};



choices.forEach(choice =>{
    choice.addEventListener("click" , e=>{
        if (!acceptinganswers){
            return;
        }
        acceptinganswers = false;
        const selectedchoice = e.target;
        const selectedanswer = selectedchoice.dataset['number'];

        let classToapply = 'incorrect';
        if (selectedanswer==currentquestion.answer){
            classToapply = 'correct';
        }

        if (classToapply=='correct'){
            incrementscore(CORRECT_BONUS);
        }
        selectedchoice.parentElement.classList.add(classToapply);
        setTimeout(()=>{
            selectedchoice.parentElement.classList.remove(classToapply);
            getnewquestion();

        } , 1000);
        
    });
});

incrementscore = (num)=>{
    score+=num;
    scored.innerText = score;

}

