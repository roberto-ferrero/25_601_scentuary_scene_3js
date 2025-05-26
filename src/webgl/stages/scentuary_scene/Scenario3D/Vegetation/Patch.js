//import gsap from "gsap"
//import * as THREE from 'three'

import Flower3D from "./Flower3D"

class Patch{
    constructor (obj){
        // console.log("(Patch.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        this.ITEMS_REF = []
        //-----------------------------

        this.flower =  new Flower3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario:this.scenario,
            parent3D:this.parent3D,
            position: new THREE.Vector3(0, 0, 0), // Default position
        })
        this.ITEMS_REF.push(this.flower)
        
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.ITEMS_REF.forEach((item)=>{
            item.update_RAF()
        })
    }
    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Patch