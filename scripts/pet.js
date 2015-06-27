var timeSince;
var end;
var start;

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
                
                reactionCheck();
                break;
                
            case "Disapointed and Suprised":
                if(chance.bool() == true || getLevel() >= 5){
                    setMood(moods.neutral);
                }else{
                    setMood(moods.tired);
                }
                
                reactionCheck();
                break;
            
            case "Angry":
                setMood(moods.sad);
                
                reactionCheck();
                break;
           
            case "Sad":
                setMood(moods.tired);
                
                reactionCheck();
                break;
                
            case "Happy":
                if(chance.bool() == true){
                    setMood(moods.veryhappy);
                }else{
                    setMood(moods.neutral);
                }
                break;
            
            case "Neutral":
                if(chance.bool() == true){
                    setMood(moods.happy);
                }else{
                    setMood(moods.disapointedandsuprised);
                }
                break;
            
            
            default:
                setMood(moods.tired);
                break;
        }
        
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

var moods = {
    tired: new mood("Tired", "images/tired.png", 0),
    disapointedandsuprised: new mood("Disapointed and Suprised", "images/disapointedandsuprised.png", 100),
    happy: new mood("Happy", "images/happy.png", 300),
    angry: new mood("Angry", "images/angry.png", -250),
    sad: new mood("Sad", "images/sad.png", -100),
    veryhappy: new mood("Very Happy", "images/veryhappy.png", 500),
    doge: new mood("Doge", "images/doge.png", 2000),
    neutral: new mood("Neutral", "images/neutral.png", 0)
};

var moodSounds = buzzGroup([


]);


function setMood(m){
    vm.moodImg(m.image);
    vm.moodName(m.name);
    
 
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
        return 0;
    }
    
    //Pet too hard
    
    if(timeSince < 80){
        setMood(moods.angry);
        return 0;
    }
    
    //doge
    
    if(getLevel() > 5 && chance.bool() == true && vm.moodName() == "Very Happy"){
        setMood(moods.doge);
        return 0;
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
