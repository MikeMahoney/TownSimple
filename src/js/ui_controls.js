//Variables
var spedUp = false;
var clockSpeed = 1000;
var loadBankAmount = 0;
var gameLoaded = false;

var buildMode = false;
var rotateMode = false;
var destroyMode = false;
var tabOpen = false;
var selectedBuilding = "simpleHouse";

var errorMessage = "You don't have enough money to build that!";


var easystar = new EasyStar.js();
var pathArray = [];

var saveData = {
	
		"bankAmount" : "0",
		"buildings" : [],
		"roads": []
	
	};

	
//UI Controls
	
$('#simpleHouse').css('border', '1px solid red');

$("document").ready(function(){

	if(localStorage.TOWNSaveData) {
		
		var localStorageData = JSON.parse(localStorage.TOWNSaveData);
		
		$('#currentGameInfo p').html(
			'<strong>Money: $</strong>' + localStorageData.bankAmount + '<br />' +
			'<strong>Buildings: </strong>' + localStorageData.buildings.length);
		
	} else {
	
		$('#continueButton').css('background-color', 'grey');
	
	}

	$('#startButton').click(function () {
		
		TOWN.timeHours = 8;
		TOWN.timeMinutes = 30;
		$('#titleScreen').css('z-index', '-1');
		
	});
	
	$('#continueButton').click(function () {
		
		if(localStorage.TOWNSaveData) {
		
			TOWN.load();
			$('#titleScreen').css('z-index', '-1');
		
		} else {
			
			alert("No save data exists!");
			
		}
		
	});

	$('#speedup').click(function () {
	
		if(spedUp == false) {
			
			clockSpeed = 150;
			$(this).css('color', 'green');
			spedUp = true;
			clearInterval(window.timer);
			window.timer = setInterval(TOWN.schedule, clockSpeed);
			
		} else {
		
			clockSpeed = 1000;
			$(this).css('color', 'black');
			spedUp = false;
			clearInterval(window.timer);
			window.timer = setInterval(TOWN.schedule, clockSpeed);
			
		}
	
	});

	$('.buildList').hide();

	$('.toolButton').click(function () {

		$('.buildList').hide();
		$('.editButton').css('border', '2px solid black');
		rotateMode = false;
		destroyMode = false;

		if(!tabOpen) {

			switch($(this).attr('id')) {
				case "settings":
							$('#settingsList').show();
							tabOpen = true;
							break;
				case "houses":
							$('#houseList').show();
							buildMode = true;
							tabOpen = true;
							break;
				case "commercial":
							$('#commercialList').show();
							buildMode = true;
							tabOpen = true;
							break;
				case "services":
							$('#serviceList').show();
							buildMode = true;
							tabOpen = true;
							break;
				case "misc":
							$('#miscList').show();
							buildMode = true;
							tabOpen = true;
							break;
			}

		} else {

			$('.buildList').hide();
			buildMode = false;
			tabOpen = false;

		}

	});

	$('.close').click(function () {

		$('.buildList').hide();
		buildMode = false;

	});

	$('.listedBuilding').click(function () {

		$('.listedBuilding').css('border', '1px solid grey');
		$(this).css('border', '1px solid red');

		selectedBuilding = $(this).attr('id');

	});

	$('.editButton').click(function () {

		$('.buildList').hide();
		buildMode = false;

		switch($(this).attr('id')) {
			case "rotate":
						if(!rotateMode){

							rotateMode = true;
							destroyMode = false;
							$('.editButton').css('border', '2px solid black');
							$(this).css('border', '2px solid red');

						} else {

							rotateMode = false;
							$(this).css('border', '2px solid black');

						}
						break;
			case "destroy":
						if(!destroyMode){

							destroyMode = true;
							rotateMode = false;
							$('.editButton').css('border', '2px solid black');
							$(this).css('border', '2px solid red');

						} else {

							destroyMode = false;
							$(this).css('border', '2px solid black');

						}
						break;
		}

	});
	
	$('#save').click(function() {
	
		TOWN.save();
	
	});
	
	$('#deleteSave').click(function() {
	
		if(localStorage.TOWNSaveData){
			
			var deleteGame = confirm("Are you sure you want to delete this town?");
			
			if (deleteGame == true) {
			
				localStorage.removeItem("TOWNSaveData");
				alert("Game save deleted!");
				location.reload();
				
			}
			
		}
	
	});
	
	$('#guide').click(function() {
	
		$('.buildList').hide();
		$('#gameGuide').show();
	
	});

});