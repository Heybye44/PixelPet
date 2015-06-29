var timeSince;
var end;
var start;

window.onload = function(){
    if(localStorage.getItem("exp") == "NaN"){
        if(confirm("Looks like you haven't played before (or your score got corrupted =[), so the page will reset after somethings are setup. To play pet the adorable pixelated blob cat on the screen. Don't pet too hard or it will hurt him. It not okay to punch cute things. I also recommend playing in the latest version of Firefox, it seems to work the best.")){
            resetGame();
        }
    }
}

var vm = {
    moodImg: ko.observable("images/tired.png"),
    moodName: ko.observable("Tired"),
    level: ko.observable(getLevel()),
    exp: ko.observable(getExp()),
    interact: function(){
                
        //
        //Timing Conitued
        //

        
        end = window.performance.now();
        timeSince = end - start;
        
        console.info("The pet was " + timeSince + " milliseconds ago");
        
        //Reset timer
        start = 0;
        end = 0;
        
        
        //
        //Mood Changing
        //
        
        switch (vm.moodName()) {
            case "Tired":
                setMood(moods.disapointedandsuprised);
                
               reactionCheck(); break;
                
            case "Disapointed and Suprised":
                if(chance.bool() == true || getLevel() >= 5){
                    setMood(moods.neutral);
                }else{
                    setMood(moods.tired);
                }
                
               reactionCheck(); break;
            
            case "Angry":
                setMood(moods.sad);

               reactionCheck(); break;
           
            case "Sad":
                setMood(moods.tired);
                
               reactionCheck(); break;
                
            case "Happy":
                if(chance.bool() == true){
                    setMood(moods.veryhappy);
                }else{
                    setMood(moods.neutral);
                }
               reactionCheck(); break;
            
            case "Neutral":
                if(chance.bool() == true){
                    setMood(moods.happy);
                }else{
                    setMood(moods.disapointedandsuprised);
                }
               reactionCheck(); break;
            
            case "Doge":
                if(chance.bool() && chance.bool() && chance.bool()){
                    setMood(moods.veryhappy);
                }else{
                    setMood(moods.happy);
                }
                
               reactionCheck(); break;
            
            default:
                setMood(moods.tired);
               reactionCheck(); break;
        }
        
        reactionCheck();
        
        //Timing Continued
        start = window.performance.now();
        
        //
        //Level Changing
        //
        
        if(getExp() < 0){
            levelDown();
            return 0;
        }
        
        
        if(getExp() >= (getLevel() * 100)){
            levelUp();
            
            return 0;
        }

    }
};

ko.applyBindings(vm);

//
//Mood
//

function mood(n, img, a, s){
    this.name = n;
    this.image = img;
    this.affect = a;
    this.sound = s;
}

var moodSounds = {
    happy: new buzz.sound("sounds/happy.wav"),
    angry: new buzz.sound("sounds/angry.wav"),
    default: new buzz.sound("sounds/default.wav")
};

var moods = {
    tired: new mood("Tired", "images/tired.png", 0),
    disapointedandsuprised: new mood("Disapointed and Suprised", "images/disapointedandsuprised.png", 100),
    happy: new mood("Happy", "images/happy.png", 300, moodSounds.happy),
    angry: new mood("Angry", "images/angry.png", -250, moodSounds.angry),
    sad: new mood("Sad", "images/sad.png", -100),
    veryhappy: new mood("Very Happy", "images/veryhappy.png", 500, moodSounds.happy),
    doge: new mood("Doge", "images/doge.png", 2000),
    neutral: new mood("Neutral", "images/neutral.png", 0)
};


function setMood(m){
    buzz.all().stop();
    vm.moodImg(m.image);
    vm.moodName(m.name);
    
    
    if(m.sound != null){
        m.sound.play();
    }else{
        moodSounds.default.play();   
    }
    setExp(m.affect);
    
}

//
// EXP
//

var exp = getExp();

function setExp(a, newLevel){
    if(newLevel == true){
        exp = 0;
        localStorage.setItem("exp", 0);
        
        //Relays it
        vm.exp(getExp());
    }
    
    
    exp = getExp();
    
    //Saves it
    localStorage.setItem("exp", exp + a);
    
    //Relays it
    vm.exp(getExp());
    
    console.info("LS: " + localStorage.getItem("exp") + " VAR: " + exp + " GETEXP: " + getExp());
}

function getExp() {
    return parseInt(localStorage.getItem("exp"));
}

//
//Levels
//

var level;

function levelUp(){
    level = getLevel() + 1;
    
    //Saves it
    localStorage.setItem("level", level);
    
    //Relays it
    vm.level(getLevel());
    
    //Resets exp
    setExp(0, true);
    
    console.log("Leveled Up: " + getLevel());
}

function levelDown(){
    level = getLevel() - 1;
    
    //Saves it
    localStorage.setItem("level", level);
    
    //Relays it
    vm.level(getLevel());
    
    //Resets exp
    setExp(0, true);
    
    console.log("Leveled Down: " + getLevel());
}



function getLevel(){
    return parseInt(localStorage.getItem("level"));
}

//
//Complex Reactions & Memes
//

function reactionCheck() {
    //Reactions
    
    
    
    //Left For Too Long
    if(timeSince >= 30000){
        
        setMood(moods.sad);
        console.log("Lonely")
        return 0;
    }
    
    //Pet too hard
    
    if(timeSince < 200){
        setMood(moods.angry);
        alert("Your petting to hard! Slow down, this isn't Cookie Clicker.");
        return 0;
    }
    //Makes memes 2x easier to get
    
    for(var i = 0; i <= 2; i++){
        //Stops all sounds to prevent overlaping
        buzz.all().stop();
        
        //doge

        if(getLevel() > 5 && chance.bool() == true && vm.moodName() == "Very Happy"){
            setMood(moods.doge);
            console.log("Dogified");
            return 0;
        }
    }
}

//
//Game Reset
//

function resetGame(){
    localStorage.setItem("exp", 0);
    localStorage.setItem("level", 0);
    window.location.reload();
}
