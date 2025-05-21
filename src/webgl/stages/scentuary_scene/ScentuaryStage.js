import gsap from "gsap"
import * as THREE from 'three'

import EasedOutValue from "../../core/utils/EasedOutValue"

import StageSuper from '../StageSuper'

import StageCamera from "./StageCamera/StageCamera"
import Scene3D from "./Scene3D/Scene3D"
import CameraManager from "./CameraManager"


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
        this.loader.add_gltf("scene", this.app.loader_pathPrefix+"glbs/scentuary_scene.glb", true)
        // this.loader.add_texture("petals", this.app.loader_pathPrefix+"img/single_petal.png", true)
        this.loader.add_texture("pilars", this.app.loader_pathPrefix+"img/bakings/pilars_4k.jpg", true)
        this.loader.add_texture("pilars_ao", this.app.loader_pathPrefix+"img/bakings/pilars_ao_4k.jpg", true)

        this.loader.add_texture("stairs", this.app.loader_pathPrefix+"img/bakings/stairs_1k.jpg", true)
        this.loader.add_texture("floor", this.app.loader_pathPrefix+"img/bakings/floor_1k.jpg", true)
        this.loader.add_texture("floor_ao", this.app.loader_pathPrefix+"img/bakings/floor_ao_1k.jpg", true)
        this.loader.add_texture("floor_shadow", this.app.loader_pathPrefix+"img/bakings/floor_shadow_1k.jpg", true)
        this.loader.add_texture("walls", this.app.loader_pathPrefix+"img/bakings/walls_4k.jpg", true)
        this.loader.add_hdr("sky", this.app.loader_pathPrefix+"hdr/sky_4k.hdr", true)
        
        //------------------------------
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            // this.progress.set_GENERAL_PROGRESS(e.scroll.PROGRESS)
        })
    }
    //----------------------------------------------
    // INTERNAL:
    init(){ // Called by ProjectSuper
        // console.log("(ScentuaryStage.init): "+this.id)
        this.stageCamera.init()
    }
    build(){
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

        // this.app.scene.environment = envMap;
        this.app.scene.background = envMap; // this makes it your skybox

        //------------------- 
        this.scentuaryScene = new Scene3D({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D
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
    get_mesh_from_GLB_PROJECT(meshId){
        // console.log("_extract_mesh_from_GLB_PROJECT: ", meshId);
        const mesh = this.GLB_PROJECT.children.find((mesh)=>{
            const result = mesh.name == meshId
            return result
        })
        // console.log("PROJECT mesh: ", mesh);
        // if(mesh){
            if(mesh?.type == "Group"){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
                const position = mesh.position
                // console.log("!!!");
                // console.log("   mesh: ", mesh);
                const itemMesh = mesh.children[0]
                itemMesh.position.set(position.x, position.y, position.z)
                return itemMesh
            }
        // }
        return mesh
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        if(this.STARTED){
            this.stageCamera?.update_RAF()
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
