/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.
(function () {
var playersGuess,
    winningNumber;
var guessNum = 5;
var guessArr = [];

/* **** Guessing Game Functions **** */

// Generate the Winning Number
function generateWinningNumber(){
	return Math.ceil(Math.random() * 100);
}
winningNumber = generateWinningNumber();

// Fetch the Players Guess
function playersGuessSubmission(){
	// add code here
	playersGuess = +$("#player-guess").val();
	$("#player-guess").val("");
}

// Determine if the next guess should be a lower or higher number
function lowerOrHigher(){
	if (playersGuess > winningNumber) {
		return "Your number is higher than ";
	}
	else if (playersGuess < winningNumber) {
		return "Your number is lower than ";
	}
}

function guessMessage() {
	var distance = Math.abs(playersGuess - winningNumber);
	var range = 0;
	if (distance <= 5) { 
		range = 5;
	}
	else if (distance <= 45) {
		range = Math.ceil(distance/15) * 15;
	}	
	else {
		if (playersGuess > winningNumber) {
			range = playersGuess;
		}
		else {
			range = 100 - playersGuess;
		}
	}
	return lowerOrHigher() + "and within " + range + " digits of the correct number.";
}

// Changes text of paragraph
function textReplace (text) {
	return $("section").find("p").html(text);
}

// Displays text after the players wins or loses
function winOrLose (text1, text2, class1, image1) {
	return textReplace(text1).fadeOut(2000, function() {
 	    $(this).remove();
 	    $("section").prepend(text2);
 	    $("section").find("p").addClass(class1);
 	    $("img").attr("src", image1);
 	});
}

function gameOver(bool) {
	$("#hint").prop("disabled", bool)
	$("#submit").prop("disabled", bool)
}

// Check if the Player's Guess is the winning number 
function checkGuess(){
	if (playersGuess > 100 || playersGuess < 1) {
		textReplace("Guess a number between 1 and 100");
	}
	else {
		if (guessArr.indexOf(playersGuess) > -1) {
        	textReplace("You already guessed that number. Guess Again!");
		}
		else if (playersGuess === winningNumber) {
			winOrLose("Congratulations!", "<p>You Won!</p>", "winner", "thumbs_up.png");
			$("#thumbs-up").show().delay(5000).fadeOut(1000);
			gameOver(true);
		}
		else {
			guessNum--;
			if (guessNum === 0) {
 	    		winOrLose("Sorry, no more guesses.", "<p>You Lose!</p>", "loser", "thumbs_down.png");
 	    		gameOver(true);
			}
			else {
				textReplace(guessMessage() + "<br/>You have <span>" + guessNum + "</span> guesses left.");
			}
		}
		guessArr.push(playersGuess);
	}
}

// Create a provide hint button that provides additional clues to the "Player"
function provideHint(){
	var distance = Math.abs(playersGuess - winningNumber);
	var hintArr = [winningNumber];
	for (var i = 0 ; i < guessNum ;) {
		var random = Math.ceil(Math.random() * 100);
		if (random >= (winningNumber - distance/2) && random <= (winningNumber + distance/2) && hintArr.indexOf(random) === -1) {
			hintArr.push(random);
			i++;
		}
	}
	textReplace("The correct number is one of the following:<span> " + hintArr.sort(function(a,b) {return a-b}).join(", ") + "</span>");
}

// Removes winner/loser class and inserts new text into p element
function endOfGame(text) {
	$("section").find("p").removeClass().html(text);
	$("img").attr("src", "mark.png");	
}

// Allow the "Player" to Play Again
function playAgain(){
	winningNumber = generateWinningNumber();
	gameOver(false);
	guessNum = 5;
	guessArr = [];
	endOfGame("Let's play again. Guess a new number.")
}

// displays correct number
function showNumber () {
	endOfGame("The correct number is: <span>" + winningNumber + "</span>");
}

/* **** Event Listeners/Handlers ****  */
$(document).ready(function () {
	$(".form-group").on("click", "#submit", function() {
		playersGuessSubmission();
		checkGuess();
	});
	$(".form-group").on("keyup", function(event) {
		if (event.which === 13) {
			$("#submit").trigger("click");
		}
	});
	$(".btn-group").on("click", "#hint", provideHint);
	$(".btn-group").on("click", "#play-again", playAgain);
	$(".btn-group").on("click", "#answer", showNumber);
});

})();
