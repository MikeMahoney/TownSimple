window.timer = setInterval(TOWN.schedule, clockSpeed);

//Setting up the canvas and engine

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

//Scene creation
var createScene = function () {

	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 2, 4);

	var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 12, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setTarget(new BABYLON.Vector3(-3, 0, 3));
	camera.lowerRadiusLimit = 4;
	camera.upperRadiusLimit = 12;
	camera.lowerBetaLimit = 0.3;
	camera.upperBetaLimit = 1;

	camera.attachControl(canvas, true);

	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

	light.intensity = 0.7;

	var ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 0, scene);
	ground.position = new BABYLON.Vector3(-2.75, -0.25, 2.75);
	var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
	groundMaterial.diffuseColor = new BABYLON.Color3(1, 2, 0.5);
	ground.material = groundMaterial;

	//Creating the cells
	var size = 12, x = 0, z = 0, boxNo = 0;

	var boxes = []

	for (var h = 0; h < size; h++) {

		for (var i = 0; i < size; i++) {

			var box = BABYLON.Mesh.CreateBox("box" + boxNo, 0.5, scene);
			box.position.x = x;
			x -= 0.5;
			box.position.z = z;
			box.position.y = -0.48;

			var materialBox = new BABYLON.StandardMaterial("texture" + boxNo, scene);
			materialBox.alpha = 0.2;
			materialBox.diffuseColor = new BABYLON.Color3(40, 60, 200);
			box.setMaterialByID("texture" + boxNo);

			box.visibility = 0;

			boxes.push(box);

			boxNo++;

		}

		z += 0.5;
		x = 0;

	}

	boxes.forEach(function (b) {
		b.actionManager = new BABYLON.ActionManager(scene);

		b.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (evt) {

			if(buildMode) {

				b.visibility = 1;

			}

		}));

		b.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (evt) {

			if(buildMode) {

				b.visibility = 0;

			}

		}));
	});

	//Event listener to handle the creation of buildings
	window.addEventListener("contextmenu", function (event) {
		
		event.preventDefault();
		
		var pickResult = scene.pick(scene.pointerX, scene.pointerY);
		var pickedMeshId = pickResult.pickedMesh.id;
		var pickedMeshIdNum = parseInt(pickedMeshId.match(/\d/g).join(""))
		var buildingExists = false;
		
		for(var i = 0; i < TOWN.buildings.length; i++) {
			
			if(TOWN.buildings[i].id.indexOf(pickedMeshIdNum) > -1) {
			
				buildingExists = true;
			
			}
			
		}

		if(buildMode && pickedMeshId.indexOf("box") > -1 && !buildingExists) {

			switch(selectedBuilding) {
				case "simpleShop":
							
							TOWN.addBuilding(pickedMeshId, 80000, "shop", 0.53, "commercial", 1000, "day", 3);
							
							break;
							
				case "simpleHouse":
				
							TOWN.addBuilding(pickedMeshId, 50000, "simpleHouse", 0.38, "residential", 0, "day", 2);
							
							break;
				
				case "shack":
				
							TOWN.addBuilding(pickedMeshId, 30000, "shack", 0.38, "residential", 0, "day", 1);
							
							break;
							
				case "factory":
				
							TOWN.addBuilding(pickedMeshId, 150000, "factory", 0.50, "commercial", 10000, "day", 10);

							break;
							
				case "tree":
				
							TOWN.addBuilding(pickedMeshId, 20000, "tree", 0.46, "misc", 0, "day", 0);
				
							break;
							
				case "surgery":
				
							TOWN.addBuilding(pickedMeshId, 100000, "surgery", 0.37, "commercial_service", 500, "day", 2);
				
							break;
							
				case "bar":
				
							TOWN.addBuilding(pickedMeshId, 90000, "bar", 0.53, "commercial_entertainment", 2000, "night", 10);
			
							break;
							
				case "sking":
				
							TOWN.addBuilding(pickedMeshId, 80000, "sking", 0.47, "commercial", 1000, "day", 8);
			
							break;
							
				case "statue":
				
							TOWN.addBuilding(pickedMeshId, 10000000, "statue", 0.40, "misc", 0, "day", 0);
			
							break;
							
				case "road": 
				
							TOWN.addRoad(pickedMeshId);
				
				break;
			}

		} else if(pickedMeshId.indexOf("box") == -1) {
		
			for(var i = 0; i < TOWN.buildings.length; i++) {
				
				var building = TOWN.buildings[i];
				
				if(pickedMeshId == building.id) {
					
					if(building.type.indexOf("commercial") > -1) {
					
						var income = building.income + (building.income * (0.2 * building.people)) + (building.income * TOWN.happiness);
						
						$('#buildingInfo ul').html(
						'<li><strong>Name: </strong>' + building.name + '</li>' +
						'<li><strong>Citizens: </strong>' + building.people + '/' + building.maxPeople + '</li>' +
						'<li><strong>Income: </strong></li>' +
						'<li>' + building.income + ' x (0.2 x ' + building.people + ')</li>' +
						'<li> + (' + building.income + ' x Happiness) =</li>' + 
						'<li><strong>$' + income + '/hr</strong></li>'
						);
					
					} else if (building.type.indexOf("residential") > -1) {
					
						$('#buildingInfo ul').html(
						'<li><strong>Name: </strong>' + building.name + '</li>' +
						'<li><strong>Tenants: </strong>' + building.tenants.length + '</li>'
						);
					
					} else {
					
						$('#buildingInfo ul').html(
						'<li><strong>It\'s just a ' + building.name + '!</strong></li>'
						);
					
					}
					
					$('#buildingInfo').show();
					
				}
				
			}
		
		}
		
		return false;
		
	}, false);

	return scene;

};

var scene = createScene();

TOWN.bankAmount = 5000000;
if(gameLoaded == true) {
	
	TOWN.bankAmount = loadBankAmount;
	
}
TOWN.init();

//Rendering the scene
engine.runRenderLoop(function () {
	scene.render();
});

window.addEventListener("resize", function () {
	engine.resize();
});