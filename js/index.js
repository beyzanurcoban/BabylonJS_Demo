/// <reference path="babylon.d.ts" />

/* COORDINATES (USED)
    x values -> x values
    y values -> z values
    z values -> y values
*/ 

async function loadData(){
    const response = await fetch("./37369.json");
    const data = await response.json();
    return data;
}

var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas,true);

function createScene(){

    // SCENE
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.Black();
  
    // CAMERA
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 200, -20));
    camera.attachControl(canvas, true);
    camera.setTarget(BABYLON.Vector3.Zero());
   
    // LIGHT
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,30,0), scene);
    light.intensity = 0.7;
  
    // SPACE AXIS
    var showAxis = function(size) {
        var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
            var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            return plane;
        };
        
        var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);
        var xChar = makeTextPlane("X", "red", size / 10);
         xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);
        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    };  
    showAxis(5);
  
    // CREATING MESH OBJECTS

    // create cars
    var bodyMaterial1 = new BABYLON.StandardMaterial("body_material", scene);
    bodyMaterial1.alpha = 1;
    bodyMaterial1.diffuseColor = new BABYLON.Color3(1.0,0.2,0.7);
    bodyMaterial1.backFaceCulling = false;

    var car1 = BABYLON.MeshBuilder.CreateBox("car1", {width: 0.8, height: 0.8, depth: 2},scene);
    var car2 = BABYLON.MeshBuilder.CreateBox("car2", {width: 0.8, height: 0.8, depth: 2},scene);
    car1.material = bodyMaterial1;
    car2.material = bodyMaterial1;
    

    // LOADING DATA
    document.addEventListener("DOMContentLoaded", async () => {
        let data = [[]];
    
        try {
            data = await loadData();
        } catch (e) {
            console.log("Error!");
            console.log(e);
        }
    
        console.log(data.length);
        console.log(data[1][0][1]);
        
        // ANIMATION
        car1.position = new BABYLON.Vector3(data[1][0][0], 0, data[1][1][0]);
        car1.rotation.y = -(data[1][2][0] - Math.PI/2);

        car2.position = new BABYLON.Vector3(data[1][0][1], 0, data[1][1][1]);
        car2.rotation.y = -(data[1][2][1] - Math.PI/2);
        var d = 2;

        scene.registerAfterRender(function(){
            if(d<data.length){

                car1.position = new BABYLON.Vector3(data[d][0][0],0,data[d][1][0]);
                car1.rotation.y = -(data[d][2][0] - Math.PI/2);

                car2.position = new BABYLON.Vector3(data[d][0][1],0,data[d][1][1]);
                car2.rotation.y = -(data[d][2][1] - Math.PI/2);
                
                console.log(d);
                d+=8;
            }
        });

    });

    return scene;

}
  
const mainScene = createScene();
  
engine.runRenderLoop(() => {
    mainScene.render();
});
  