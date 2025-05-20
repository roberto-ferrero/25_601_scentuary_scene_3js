//import gsap from "gsap"
import * as THREE from 'three'

import Sun from "./Sun"
import PilarsGroup from "./Pilars/PilarsGroup"
import Walls3D from './Walls/Walls3D'
import Floor3D from './Floor/Floor3D'
import Stairs3D from './Stairs/Stairs3D'
import PointLight3D from './PointLight3D'

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
        //---------------------------
        // LIGHTS:
        const dev_ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
        this.parent3D.add(dev_ambientLight);
        //---
        this.dev_pointLight = new PointLight3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D,
        })
        //---------------------------
        // ITEMS:
        this.floor = new Floor3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D
        })
        this.stairs = new Stairs3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D
        })
        this.pilars = new PilarsGroup({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D
        })
        this.walls = new Walls3D({
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