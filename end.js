const username = document.getElementById("username");
const savescorebtn = document.getElementById("savescorebtn");
const finalscore = document.getElementById("finalScore");
const mostrecentscore = localStorage.getItem("mostrecentscore");

const highscore = JSON.parse(localStorage.getItem("highscore")) || [];
const MAX_HIGH_SCORES = 5;


finalscore.innerText = mostrecentscore; 


username.addEventListener("keyup"  ,()=>{
    savescorebtn.disabled=!username.value;
});

savehighscore = e =>{

    console.log("clicked the save button!!")

    e.preventDefault();

    const score  = {
        score:Math.floor(Math.random() *100),
        name:username.value

    };
    highscore.push(score);

    highscore.sort((a,b) => b.score - a.score);
    highscore.splice(5);

    localStorage.setItem('highscore' , JSON.stringify(highscore));
    window.location.assign('/');
    

} 