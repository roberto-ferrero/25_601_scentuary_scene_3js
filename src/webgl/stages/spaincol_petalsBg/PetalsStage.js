import gsap from "gsap"
import * as THREE from 'three'

import EasedOutValue from "../../core/utils/EasedOutValue"

import StageSuper from '../StageSuper'

import StageCamera from "./StageCamera"
// import StageOrtoCamera from "../_cameras/StageOrtoCamera"
import FallingPetals from "./FallingPetals/FallingPetals"
import GradientBg from "./GradientBg/GradientBg"

import Example from "./Example"


class PetalsStage extends StageSuper{
    // this.app.project.stage
    constructor (obj){
        console.log("(PetalsStage.CONSTRUCTORA): ", obj)
        super(obj)
        //-------------------
        this.START_REQUESTED = true
        this.STARTED = false
        this.PRE_BUILT = false 
        //-------------------
        this.STAGE_SIZE = this.app.size.CURRENT
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
        this.pivotPlane3D = new THREE.Object3D()
        this.pivotPlane3D.name = "pivotPlane3D"
        this.world3D.add(this.pivotPlane3D)
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
        // this.stageCamera = new StageOrtoCamera({
        //     app:this.app,
        //     project:this.project,
        //     stage:this,
        //     parent3D:this.world3D,
        //     size: this.app.size.CURRENT
        // })
        //------------------------
        if(!this.app.USE_RENDER_PLANE){
           this.app.render.set_stageCamera(this.stageCamera.camera)
        }
        //---------------------
        //------------------------------
        // LOADING MANIFEST:
        this.loader.add_gltf("shapes_blender", this.app.loader_pathPrefix+"glbs/shapes.glb", true)
        // this.loader.add_gltf("petal", this.app.loader_pathPrefix+"glbs/petal.glb", true)

        this.loader.add_gltf("petal_0", this.app.loader_pathPrefix+"glbs/petal_0.glb", true)
        this.loader.add_gltf("petal_1", this.app.loader_pathPrefix+"glbs/petal_1.glb", true)
        this.loader.add_gltf("petal_2", this.app.loader_pathPrefix+"glbs/petal_2.glb", true)
        this.loader.add_gltf("petal_3", this.app.loader_pathPrefix+"glbs/petal_3.glb", true)
        // this.loader.add_texture("petals", this.app.loader_pathPrefix+"img/single_petal.png", true)
        // this.loader.add_texture("petals9", this.app.loader_pathPrefix+"img/petals9_white.png", true)

        
        //------------------------------
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            // this.progress.set_GENERAL_PROGRESS(e.scroll.PROGRESS)
        })
    }
    //----------------------------------------------
    // INTERNAL:
    init(){ // Called by ProjectSuper
        // console.log("(PetalsStage.init): "+this.id)
        this.stageCamera.init()
    }
    build(){
        this.GLB_PROJECT = this.loader.get_gltf("shapes_blender")
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


        //------------------- 
        this.gradientBg = new GradientBg({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D,
            PLANE_POSITION: new THREE.Vector3(0, 0, 200),
        })
        this.fallingPetals = new FallingPetals({
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
        // console.log("(PetalsStage.start)! <-----------------------------------------"+this.STARTED);
        this.stageCamera.start()
        // this.stageCamera.animateStateFromTo("camera0", "camera1", 2)
        // this.stageCamera.animateTargetFromTo("target0", "target1", 2)
    }
    //----------------------------------------------
    // PUBLIC API:
    show(sectionId){
        // console.log("(PetalsStage.start)!");
        this.progress.show(sectionId)
    }
    radarProgress(progress){
        this.progress.ANIMATION_PROGRESS = progress
    }
    //----------------------------------------------
    // INTERNAL:
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        if(this.STARTED){
            this.stageCamera?.update_RAF()
            this.gradientBg?.update_RAF()
            this.fallingPetals?.update_RAF()
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _reconfigure_renderer(){

    }
    //----------------------------------------------
    // AUX:


}
export default PetalsStage
