//import gsap from "gsap"
import * as THREE from 'three'

import Sun from "./Sun"
import PilarsGroup from "./Pilars/PilarsGroup"

class Scene3D{
    constructor (obj){
        // console.log("(Scene3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.name = "scene3D"
        this.parent3D.add(this.cont3D)
        //-----------------------------
        this.sun = new Sun({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D,
            mesh:this.stage.get_mesh_from_GLB_PROJECT("sun")
        })
        //---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft white light
        this.parent3D.add(ambientLight);
        //---
        this.pilars = new PilarsGroup({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D
        })


    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Scene3D