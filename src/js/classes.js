function Road(id) {

	this.id = id;

}

function Building(mesh, name, type, price, yPos, income, openTime) {

	this.mesh = mesh;
	this.id = mesh.id;
	this.idInt = parseInt(this.id.match(/\d/g).join(""));
	this.name = name;
	this.type = type;
	this.price = price;
	this.yPos = yPos;
	this.income = income;
	this.openTime = openTime;
	this.x = this.idInt % 12;
	this.y = Math.ceil(this.idInt / 12) - 1;
	this.tenants = [];
	this.people = 0;
	this.maxPeople;

}

function Person(id, home) {

	this.home = home;
	this.mesh;
	this.id;
	this.hasWork = false;
	this.findWork = function (time) {

		while (this.hasWork == false) {

			if (TOWN.buildings.length > 0) {

				for (var i = 0; i < TOWN.buildings.length; i++) {

					var currentPlace = TOWN.buildings[i];

					if (currentPlace.openTime == time && currentPlace.type.indexOf("commercial") > -1 && currentPlace.people < currentPlace.maxPeople) {

						currentPlace.people++;
						this.hasWork = true;
						return currentPlace;

					}

				}

			} else {

				alert("There's not enough places for the citizens to work!");

			}

			break;

		}

	};
	this.findEntertainment = function () {

		while (this.hasWork == false) {

			if (TOWN.buildings.length > 0) {

				for (var i = 0; i < TOWN.buildings.length; i++) {

					var currentPlace = TOWN.buildings[i];

					if (currentPlace.type.indexOf("entertainment") > -1 && currentPlace.people < currentPlace.maxPeople) {

						currentPlace.people++;
						this.hasWork = true;
						return currentPlace;

					}

				}

			} else {

				alert("There's not enough entertainment for your citizens!");

			}

			break;

		}

	};
	this.currentLocation;
	this.animation = new BABYLON.Animation(this.id + "Animation", "position", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
	this.calculatePath = function (startX, startY, endX, endY) {

		easystar.setGrid(TOWN.grid);
		easystar.setAcceptableTiles([0]);
		easystar.enableSync();
		easystar.findPath(startX, startY, endX, endY, function (path) {

			if (path === null) {

				//alert("Path was not found.");

			} else {

				$.each(path, function (index, value) {
					pathArray.push(JSON.parse(JSON.stringify(value)));
				});

			}

		});

		easystar.calculate();

	}
	this.animate = function () {

		var destination;

		if (this.currentLocation == this.home && (TOWN.timeHours == 9)) {

			destination = this.findWork("day");

		} else if (this.currentLocation != this.home && (TOWN.timeHours == 12)) {

			this.currentLocation.people = 0;
			destination = this.home;
			this.hasWork = false;

		} else if (this.currentLocation == this.home && (TOWN.timeHours == 13)) {

			destination = this.findWork("day");

		} else if (this.currentLocation != this.home && (TOWN.timeHours == 17)) {

			this.currentLocation.people = 0;
			destination = this.home;
			this.hasWork = false;

		} else if (this.currentLocation == this.home && (TOWN.timeHours == 20)) {

			destination = this.findEntertainment();

		} else if (this.currentLocation != this.home && (TOWN.timeHours == 11)) {

			this.currentLocation.people = 0;
			destination = this.home;
			this.hasWork = false;

		} else {

			return;

		}

		//Making sure there is a free space on the grid next to the start and end points
		var startX;
		var startY;
		var endX;
		var endY;

		if (TOWN.grid[this.currentLocation.y + 1]) {

			if (TOWN.grid[this.currentLocation.y + 1][this.currentLocation.x] == 0) {

				startX = this.currentLocation.x;
				startY = this.currentLocation.y + 1;

			}

		} else if (TOWN.grid[this.currentLocation.y - 1]) {

			if (TOWN.grid[this.currentLocation.y - 1][this.currentLocation.x] == 0) {

				startX = this.currentLocation.x;
				startY = this.currentLocation.y - 1;

			}

		} else if (TOWN.grid[this.currentLocation.y][this.currentLocation.x + 1]) {

			if (TOWN.grid[this.currentLocation.y][this.currentLocation.x + 1] == 0) {

				startX = this.currentLocation.x + 1;
				startY = this.currentLocation.y;

			}

		} else if (TOWN.grid[this.currentLocation.y][this.currentLocation.x - 1]) {

			if (TOWN.grid[this.currentLocation.y][this.currentLocation.x - 1]) {

				startX = this.currentLocation.x - 1;
				startY = this.currentLocation.y;

			}

		} else {

			alert("Citizen current position is blocked");

		}

		if (TOWN.grid[destination.y + 1]) {

			if (TOWN.grid[destination.y + 1][destination.x] == 0) {

				endX = destination.x;
				endY = destination.y + 1;

			}

		} else if (TOWN.grid[destination.y - 1]) {

			if (TOWN.grid[destination.y - 1][destination.x] == 0) {

				endX = destination.x;
				endY = destination.y - 1;

			}

		} else if (TOWN.grid[destination.y][destination.x + 1]) {

			if (TOWN.grid[destination.y][destination.x + 1] == 0) {

				endX = destination.x + 1;
				endY = destination.y;

			}

		} else if (TOWN.grid[destination.y][destination.x - 1]) {

			if (TOWN.grid[destination.y][destination.x - 1] == 0) {

				endX = destination.x - 1;
				endY = destination.y;

			}

		} else {

			alert("Citizen destination is blocked");

		}

		//-------

		this.calculatePath(startX, startY, endX, endY);

		var keys = [];

		var framesTotal = 0;

		var citizenSpeed = Math.floor(Math.random() * 40) + 20;

		if (spedUp == true) {

			citizenSpeed = 5;

		}

		keys.push({
			frame: framesTotal,
			value: new BABYLON.Vector3(this.currentLocation.mesh.position.x, this.mesh.position.y, this.currentLocation.mesh.position.z)
		});

		framesTotal += citizenSpeed;

		for (var i = 0; i < pathArray.length; i++) {

			var currentBox = scene.getMeshByID("box" + (((pathArray[i].y * 12)) + pathArray[i].x));

			keys.push({
				frame: framesTotal,
				value: new BABYLON.Vector3(currentBox.position.x, this.mesh.position.y, currentBox.position.z)
			});

			framesTotal += citizenSpeed;

		}

		keys.push({
			frame: framesTotal,
			value: new BABYLON.Vector3(destination.mesh.position.x, this.mesh.position.y, destination.mesh.position.z)
		});

		framesTotal += citizenSpeed;

		this.animation.setKeys(keys);

		this.mesh.animations.push(this.animation);

		scene.beginAnimation(this.mesh, 0, framesTotal, true);

		this.currentLocation = destination;
		pathArray = [];

	}

}

var TOWN = {

	happiness: 0.0,
	population: 0,
	bankAmount: 99999999999,
	buildings: [],
	roads: [],
	grid: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
	updateGrid: function (building) {

		var y = building.y;
		var x = building.x;

		if (destroyMode) {

			var idInt = parseInt(building.match(/\d/g).join(""));
			x = idInt % 12;
			y = Math.ceil(idInt / 12) - 1;
			this.grid[y][x] = 0;

		} else {

			this.grid[y][x] = 1;

		}

	},
	addBuilding: function (pickedMeshId, price, meshName, yPos, type, income, openTime, maxPeople) {

		var pickedMesh = scene.getMeshByID(pickedMeshId);

		if (TOWN.bankAmount >= price) {

			BABYLON.SceneLoader.ImportMesh("Model", "babylon_files/", meshName + ".babylon", scene, function (meshes) {

				var m = meshes[0];
				m.id = "building" + parseInt(pickedMesh.id.match(/\d/g).join(""));
				m.position.x = pickedMesh.position.x;
				m.position.z = pickedMesh.position.z;
				m.position.y = pickedMesh.position.y + yPos;

				TOWN.updateMoney(price);
				var newBuilding = new Building(m, meshName, type, price, yPos, income, openTime);
				newBuilding.maxPeople = maxPeople;

				if (type == "residential") {

					//Add people to the house

					for (var j = 0; j < maxPeople; j++) {
						BABYLON.SceneLoader.ImportMesh("Model", "babylon_files/", "person.babylon", scene, function (personMesh) {

							var person = new Person(m.id + "person" + j, newBuilding);
							person.mesh = personMesh[0];
							person.mesh.position.x = m.position.x;
							person.mesh.position.z = m.position.z;
							person.mesh.position.y = m.position.y - 0.04;
							person.currentLocation = person.home;
							person.id = person.home.tenants.length;

							newBuilding.tenants.push(person);

							TOWN.updatePopulation();

						});
					}

				}

				TOWN.buildings.push(newBuilding);
				TOWN.updateGrid(newBuilding);

				m.actionManager = new BABYLON.ActionManager(scene);

				//Deleting and Rotating Action Added Here
				m.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {

					if (rotateMode) {

						m.rotation.y += 1.57;

					}

					if (destroyMode) {

						for (var i = 0; i < TOWN.buildings.length; i++) {

							var currentBuilding = TOWN.buildings[i];

							if (currentBuilding.id == m.id) {

								if (currentBuilding.type == "residential") {

									for (var h = 0; h < currentBuilding.tenants.length; h++) {

										currentBuilding.tenants[h].mesh.dispose();
										currentBuilding.tenants.splice(h, h);
										TOWN.updatePopulation();

									}

								}

								TOWN.buildings.splice(i, 1);

							}

						}

						TOWN.updateGrid(m.id);
						m.dispose();

					}

				}));

			});

			this.updateTotalIncome();

		} else {

			alert(errorMessage);

		}

	},
	addRoad: function (pickedMeshId) {

		if (this.bankAmount > 1000) {

			var pickedMesh = scene.getMeshByID(pickedMeshId);

			var road = BABYLON.Mesh.CreateBox("road" + parseInt(pickedMeshId.match(/\d/g).join("")), 0.5, scene);
			road.position.x = pickedMesh.position.x;
			road.position.z = pickedMesh.position.z;
			road.position.y = pickedMesh.position.y + 0.005;

			TOWN.updateMoney(1000);

			this.roads.push(new Road(road.id));

			road.actionManager = new BABYLON.ActionManager(scene);

			road.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (evt) {

				if (destroyMode) {

					road.dispose();

				}

			}));

		} else {

			alert(errorMessage);

		}

	},
	updateHappiness: function () {

		this.happiness = 0;

		var workSpaces = 0;
		var serviceSpaces = 0;
		var entertainmentSpaces = 0;
		var misc = 0;

		for (var i = 0; i < this.buildings.length; i++) {

			var building = this.buildings[i];

			if (building.type == "commercial") {

				workSpaces += building.maxPeople;

			}

			if (building.type.indexOf("service") > -1) {

				serviceSpaces += building.maxPeople;

			}

			if (building.type.indexOf("entertainment") > -1) {

				entertainmentSpaces += building.maxPeople;

			}

			if (building.type == "misc") {

				this.happiness += 0.02;

			}

		}

		if (this.population < workSpaces) {

			this.happiness += 0.5;

		}

		if (this.population < serviceSpaces) {

			this.happiness += 0.2;

		}

		if (this.population < entertainmentSpaces) {

			this.happiness += 0.1;

		}

		$('#happiness > p').text(this.happiness.toFixed(2));

	},
	totalIncome: 0,
	updateTotalIncome: function () {

		this.totalIncome = 0;

		for (var i = 0; i < this.buildings.length; i++) {

			var building = this.buildings[i];

			if (building.type.indexOf("commercial") > -1 && building.people > 0) {

				//The basic income gets a multiplier based on how many people are in it and the TOWN's happiness
				this.totalIncome += building.income + (building.income * (0.2 * building.people)) + (building.income * this.happiness);

			}

		}

		$('#income > p').text("$" + this.totalIncome);

	},
	updateBankAmount: function () {

		this.bankAmount += this.totalIncome;
		this.init();

	},
	updateMoney: function (amount, profit) {

		if (profit) {

			TOWN.bankAmount += amount;
			$('#money').text("$" + TOWN.bankAmount);

		} else {

			TOWN.bankAmount -= amount;
			$('#money').text("$" + TOWN.bankAmount);

		}

	},
	updatePopulation: function () {

		if (destroyMode) {

			this.population--;
			$('#population > p').text(this.population);

		} else {

			this.population++;
			$('#population > p').text(this.population);

		}

	},
	init: function () {

		$('#money').text("$" + this.bankAmount);

	},
	timeHours: 8,
	timeMinutes: 30,
	updateTime: function () {

		if (this.timeMinutes < 59) {

			this.timeMinutes++;

		} else {

			this.timeMinutes = 0;

			if (this.timeHours < 23) {

				this.timeHours++;

			} else {

				this.timeHours = 0;

			}

		}

		if (this.timeMinutes < 10) {

			$('#time').text(this.timeHours + ":0" + this.timeMinutes);

		} else {

			$('#time').text(this.timeHours + ":" + this.timeMinutes);

		}

	},
	save: function () {

		saveData.bankAmount = this.bankAmount;

		var buildings = this.buildings;
		var buildingsToSave = [];

		for (var i = 0; i < buildings.length; i++) {

			var building = buildings[i];
			var buildingJSON = {}

			buildingJSON.pickedMeshId = "box" + building.id.match(/\d/g).join("");
			buildingJSON.price = building.price;
			buildingJSON.name = building.name;
			buildingJSON.yPos = building.yPos;
			buildingJSON.type = building.type;
			buildingJSON.income = building.income;
			buildingJSON.openTime = building.openTime;
			buildingJSON.maxPeople = building.maxPeople;

			buildingsToSave.push(buildingJSON);

		}

		saveData.buildings = buildingsToSave;

		var roads = this.roads;
		var roadsToSave = [];

		for (var i = 0; i < roads.length; i++) {

			var road = roads[i];
			var roadJSON = {}

			roadJSON.pickedMeshId = "box" + road.id.match(/\d/g).join("");

			roadsToSave.push(roadJSON);

		}

		saveData.roads = roadsToSave;

		if (typeof (Storage) !== "undefined") {

			localStorage.TOWNSaveData = JSON.stringify(saveData);
			alert("Game Saved!");

		} else {

			alert("Your browser does not support localStorage!\n Your game can't be saved.");

		}

	},
	load: function () {

		var loadData = {};

		if (typeof (Storage) !== "undefined") {

			if (localStorage.TOWNSaveData) {

				loadData = JSON.parse(localStorage.TOWNSaveData);

				var buildings = loadData.buildings;

				for (var i = 0; i < buildings.length; i++) {

					var building = buildings[i];

					this.addBuilding(building.pickedMeshId, building.price, building.name, building.yPos, building.type, building.income, building.openTime, building.maxPeople);

				}

				var roads = loadData.roads;

				for (var i = 0; i < roads.length; i++) {

					var road = roads[i];

					this.addRoad(road.pickedMeshId);

				}

				loadBankAmount = loadData.bankAmount;

				gameLoaded = true;
				alert("Game Loaded!");

			}

		} else {

			alert("Your browser does not support localStorage!\n Your game can't be saved.");

		}

	},
	schedule: function () {

		TOWN.updateTime();

		if (TOWN.timeMinutes == 59) {

			TOWN.updateHappiness();
			TOWN.updateTotalIncome();
			TOWN.updateBankAmount();

		}

		if (TOWN.timeHours == 9 || TOWN.timeHours == 12 || TOWN.timeHours == 13 || TOWN.timeHours == 17 || TOWN.timeHours == 20 && TOWN.timeMinutes == 00) {

			for (var i = 0; i < TOWN.buildings.length; i++) {

				var building = TOWN.buildings[i];

				if (building.type == "residential") {

					for (var j = 0; j < building.tenants.length; j++) {

						building.tenants[j].animate();

					}

				}

			}

		}

		if (TOWN.timeHours >= 18 && TOWN.timeMinutes >= 0) {

			scene.getLightByID("light1").intensity = 0.4;

		} else if (TOWN.timeHours < 6 && TOWN.timeMinutes >= 0) {

			scene.getLightByID("light1").intensity = 0.4;

		} else if (TOWN.timeHours > 6 && TOWN.timeMinutes >= 0) {

			scene.getLightByID("light1").intensity = 0.7;

		}

	}

}