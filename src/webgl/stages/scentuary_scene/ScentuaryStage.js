import gsap from "gsap"
import * as THREE from 'three'

import EasedOutValue from "../../core/utils/EasedOutValue"

import StageSuper from '../StageSuper'

import StageCamera from "./StageCamera/StageCamera"
import Scenario3D from "./Scenario3D/Scenario3D"
import CameraManager from "./CameraManager"
import SpotsLib from "./Scenario3D/SpotsLib"

//https://github.com/mrdoob/three.js/blob/e32c522ec5086d8c7c12b7cb4b029a222d534225/examples/jsm/objects/Water2.js#L49-L50

class ScentuaryStage extends StageSuper{
    // this.app.project.stage
    constructor (obj){
        console.log("(ScentuaryStage.CONSTRUCTORA): ", obj)
        super(obj)
        //-------------------
        this.START_REQUESTED = true
        this.STARTED = false
        this.PRE_BUILT = false 
        //-------------------
        this.CURRENT_SELECTED_SCENT_ID = null
        this.CURRENT_ROLLOVER_SCENT_ID = null
        //-------------------
        this.STAGE_SIZE = this.app.size.CURRENT
        this.SCENT_ARRAY = ["scent1", "scent2", "scent3", "scent4", "scent5", "scent6", "scent7", "scent8"]
        //-------------------
        this.MOUSE_PAN_FACTOR_EASED = new EasedOutValue(1, 0.05, 0.005, this.app.emitter, "onUpdateRAF")
        //--------------------
        //this.background_color = [ 246, 246, 246, 1 ]
        //const newColor = new THREE.Color(this.background_color[0]/255, this.background_color[1]/255, this.background_color[2]/255)
        //this.app.render.renderer.setClearColor(newColor, 1)
        //---------------------
        // BASIC STRUCTURE:
        this.world3D = new THREE.Object3D()
        this.world3D.name = "world3D"
        // this.world3D.rotation.set(0, Math.PI*0.2, 0) //
        this.scene.name = "stage_scene"
        this.scene.add(this.world3D)
        //------------------------
        // CAMERA:
        this.stageCamera = new StageCamera({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D
        })
        //------------------------
        if(!this.app.USE_RENDER_PLANE){
           this.app.render.set_stageCamera(this.stageCamera.camera)
        }
        //---------------------
        // LOADING MANIFEST:
        this.loader.add_gltf("vegetation", this.app.loader_pathPrefix+"glbs/flower.glb", true)
        this.loader.add_texture("stem", this.app.loader_pathPrefix+"img/vegetation/stem.png", true)
        this.loader.add_texture("flower", this.app.loader_pathPrefix+"img/vegetation/flower.png", true)



        //--------------

        this.loader.add_gltf("scene", this.app.loader_pathPrefix+"glbs/scentuary_scene.glb", true)

        this.loader.add_texture("normalMap0", this.app.loader_pathPrefix+"img/Water_1_M_Normal.jpg", true)
        this.loader.add_texture("normalMap1", this.app.loader_pathPrefix+"img/Water_2_M_Normal.jpg", true)

        // this.loader.add_texture("pilars", this.app.loader_pathPrefix+"img/bakings/pilars_4k.jpg", true)
        this.loader.add_texture("pilar1", this.app.loader_pathPrefix+"img/bakings/pilar1_1k.jpg", true)
        this.loader.add_texture("pilar1_ao", this.app.loader_pathPrefix+"img/bakings/pilar1_ao_05k.jpg", true)

        this.loader.add_texture("pilar2", this.app.loader_pathPrefix+"img/bakings/pilar2_1k.jpg", true)
        this.loader.add_texture("pilar2_ao", this.app.loader_pathPrefix+"img/bakings/pilar2_ao_05k.jpg", true)

        this.loader.add_texture("pilar3", this.app.loader_pathPrefix+"img/bakings/pilar3_1k.jpg", true)
        this.loader.add_texture("pilar3_ao", this.app.loader_pathPrefix+"img/bakings/pilar3_ao_05k.jpg", true)

        this.loader.add_texture("pilar4", this.app.loader_pathPrefix+"img/bakings/pilar4_1k.jpg", true)
        this.loader.add_texture("pilar4_ao", this.app.loader_pathPrefix+"img/bakings/pilar4_ao_05k.jpg", true)

        this.loader.add_texture("pilar5", this.app.loader_pathPrefix+"img/bakings/pilar5_1k.jpg", true)
        this.loader.add_texture("pilar5_ao", this.app.loader_pathPrefix+"img/bakings/pilar5_ao_05k.jpg", true)

        this.loader.add_texture("pilar6", this.app.loader_pathPrefix+"img/bakings/pilar6_1k.jpg", true)
        this.loader.add_texture("pilar6_ao", this.app.loader_pathPrefix+"img/bakings/pilar6_ao_05k.jpg", true)

        this.loader.add_texture("pilar7", this.app.loader_pathPrefix+"img/bakings/pilar7_1k.jpg", true)
        this.loader.add_texture("pilar7_ao", this.app.loader_pathPrefix+"img/bakings/pilar7_ao_05k.jpg", true)

        this.loader.add_texture("pilar8", this.app.loader_pathPrefix+"img/bakings/pilar8_1k.jpg", true)
        this.loader.add_texture("pilar8_ao", this.app.loader_pathPrefix+"img/bakings/pilar8_ao_05k.jpg", true)

        this.loader.add_texture("pilars_ao", this.app.loader_pathPrefix+"img/bakings/pilars_ao_4k.jpg", true)

        this.loader.add_texture("stairs", this.app.loader_pathPrefix+"img/bakings/stairs_1k.jpg", true)
        // this.loader.add_texture("floor", this.app.loader_pathPrefix+"img/bakings/floor_no_pilars_2k.jpg", true)

        this.loader.add_texture("floor", this.app.loader_pathPrefix+"img/bakings/floor_2k.jpg", true)
        this.loader.add_texture("floor_ao", this.app.loader_pathPrefix+"img/bakings/floor_ao_2k.jpg", true)

        // this.loader.add_texture("floor_shadow", this.app.loader_pathPrefix+"img/bakings/floor_shadow_1k.jpg", true)
        this.loader.add_texture("walls", this.app.loader_pathPrefix+"img/bakings/walls_4k.jpg", true)
        this.loader.add_texture("walls_ao", this.app.loader_pathPrefix+"img/bakings/walls_ao_4k.jpg", true)
        this.loader.add_texture("goldenframe", this.app.loader_pathPrefix+"img/bakings/goldenframe_2k.jpg", true)

        this.loader.add_texture("spiral_sparkle", this.app.loader_pathPrefix+"img/sparkle.png", true)

        // this.loader.add_hdr("sky", this.app.loader_pathPrefix+"hdr/sunset_2K_2367bd73-c1f3-420b-8ccc-93b4edf3f246.hdr", true)
        // this.loader.add_hdr("sky", this.app.loader_pathPrefix+"hdr/syferfontein-1d-clear-pure-sky_2K_b7844629-ae4f-40d3-a4ca-c6a75946629c.hdr", true)
        // this.loader.add_hdr("sky", this.app.loader_pathPrefix+"hdr/tranquil-shorizon-sunset_4K_18d64fa0-51da-4ec1-9441-da453cfd3590.hdr", true)
        this.loader.add_hdr("sky", this.app.loader_pathPrefix+"hdr/tranquil-horizon-sunset_4K_18d64fa0-51da-4ec1-9441-da453cfd3590_centered.hdr", true)
        // this.loader.add_hdr("sky", this.app.loader_pathPrefix+"hdr/sunset2_2K.hdr", true)
        
        //------------------------------
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            // this.progress.set_GENERAL_PROGRESS(e.scroll.PROGRESS)
        })
        this.app.emitter.on("onScentSelected",(e)=>{
            this.CURRENT_SELECTED_SCENT_ID = e.SCENT_ID
        })
        this.app.emitter.on("onScentRollover",(e)=>{
            this.CURRENT_ROLLOVER_SCENT_ID = e.SCENT_ID
            // console.log("(ScentuaryStage.onScentRollover): ", e.SCENT_ID);
        })
        this.app.emitter.on("onScentRollout",(e)=>{
            this.CURRENT_ROLLOVER_SCENT_ID = e.SCENT_ID
            // console.log("(ScentuaryStage.onScentRollout): ", e.SCENT_ID);
        })
    }
    //----------------------------------------------
    // PUBLIC API:
    selectScent(scentId){
        // console.log("(ScentuaryStage.selectScent): ", scentId);
        if(this.CURRENT_SELECTED_SCENT_ID != scentId){
            this.CURRENT_SELECTED_SCENT_ID = scentId
            this.app.emitter.emit("onScentSelected", {
                SCENT_ID: scentId, 
            })
        }
    }
    //----------------------------------------------
    // INTERNAL:
    init(){ // Called by ProjectSuper
        // console.log("(ScentuaryStage.init): "+this.id)
        this.stageCamera.init()
    }
    build(){
        this.VEGETATION_GLB_PROJECT = this.loader.get_gltf("vegetation")
        console.log("this.VEGETATION_GLB_PROJECT: ", this.VEGETATION_GLB_PROJECT);
        //----
        this.GLB_PROJECT = this.loader.get_gltf("scene")
        console.log("this.GLB_PROJECT: ", this.GLB_PROJECT);
        this.stageCamera.build(this.GLB_PROJECT)
        //-------------------   
        this.axis_helper = new THREE.AxesHelper( 100 )
        this.scene.add(this.axis_helper)
        this.app.register_helper(this.axis_helper)
        //--
        this.gridHelper = new THREE.GridHelper( 100, 10 );
        this.scene.add( this.gridHelper );
        this.app.register_helper(this.gridHelper)
        //------------------- 
        const pmremGenerator = new THREE.PMREMGenerator(this.app.render.renderer);
        pmremGenerator.compileEquirectangularShader();
        const hdrTexture = this.loader.get_hdr("sky")
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

        this.app.scene.environment = envMap;
        this.app.scene.background = envMap; // this makes it your skybox
        // this.app.scene.backgroundIntensity = .2

        // const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
        // const materialArray = [/* create materials using CubeTexture */];
        // const skybox = new THREE.Mesh(geometry, materialArray);
        // skybox.geometry.scale(1, 1, -1); // Invert the cube
        // scene.add(skybox);

        //------------------- 
        this.spots = new SpotsLib({
            app:this.app,
            project:this.project,
            stage:this,
        })
        this.scentuaryScene = new Scenario3D({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D,
            
        })
        this.cameraManager = new CameraManager({
            app:this.app,
            project:this.project,
            stage:this,
        })

        //------------------- 


        //------------------- 
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            if(e.id == "scroll_main"){
                // this.stageCamera.set_PROGRESS(e.scroll.PROGRESS)
            }
        })
        //-------------------   
        this.BUILT2 = true
        //-------------------  
        // this.selectScent(null) 
        //-------------------   
        this.eval_start()
    }

    request_start(){ // Called from app
        this.START_REQUESTED = true
        this.eval_start()
    }
    eval_start(){
        if(this.BUILT && this.START_REQUESTED && !this.STARTED){
            this.STARTED = true
            this.start()
        }
    }
    start(){
        // console.log("(ScentuaryStage.start)! <-----------------------------------------"+this.STARTED);
        this.stageCamera.start()
        // this.stageCamera.animateStateFromTo("camera0", "camera1", 2)
        // this.stageCamera.animateTargetFromTo("target0", "target1", 2)
    }
    //----------------------------------------------
    // PUBLIC API:
    show(sectionId){
        // console.log("(ScentuaryStage.start)!");
        this.progress.show(sectionId)
    }
    //----------------------------------------------
    // INTERNAL:
    // get_mesh_from_GLB_PROJECT(meshId){
    //     // console.log("_extract_mesh_from_GLB_PROJECT: ", meshId);
    //     const mesh = this.GLB_PROJECT.children.find((mesh)=>{
    //         const result = mesh.name == meshId
    //         return result
    //     })
    //     // console.log("PROJECT mesh: ", mesh);
    //     // if(mesh){
    //         if(mesh?.type == "Group"){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
    //             const position = mesh.position
    //             // console.log("!!!");
    //             // console.log("   mesh: ", mesh);
    //             const itemMesh = mesh.children[0]
    //             itemMesh.position.set(position.x, position.y, position.z)
    //             return itemMesh
    //         }
    //     // }
    //     return mesh
    // }
    get_mesh_from_GLB_PROJECT(meshId, PROJECT = this.GLB_PROJECT){
        // console.log("_extract_mesh_from_GLB_PROJECT: ", meshId);
        const mesh = PROJECT.children.find((mesh)=>{
            const result = mesh.name == meshId
            return result
        })
        // console.log("PROJECT mesh: ", mesh);
        // if(mesh){
            if(mesh?.type == "Group"){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
                const position = mesh.position
                console.log("Group!!");
                // console.log("   mesh: ", mesh);
                const itemMesh = mesh.children[0]
                itemMesh.position.set(position.x, position.y, position.z)
                return itemMesh
            }
        // }
        console.log("mesh: ", mesh);
        return mesh.clone()
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        if(this.STARTED){
            this.stageCamera?.update_RAF()
            this.scentuaryScene?.update_RAF()
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _reconfigure_renderer(){

    }
    //----------------------------------------------
    // AUX:


}
export default ScentuaryStage
