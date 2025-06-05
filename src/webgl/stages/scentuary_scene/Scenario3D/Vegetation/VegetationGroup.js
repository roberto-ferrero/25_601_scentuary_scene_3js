//import gsap from "gsap"
//import * as THREE from 'three'

import Flower3D from "./Flower3D"
import Patch from "./Patch"

class VegetationGroup{
    constructor (obj){
        // console.log("(VegetationGroup.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        this.VEG_SPOTS = [
            "veg1", "veg2", "veg3", "veg4", "veg5", "veg6", "veg7", "veg8", "veg9", "veg10", "veg11", "veg12", "veg13", "veg14", "veg15", "veg16", "veg17", "veg18", "veg19", "veg20",
            "veg31", "veg32", "veg33", "veg34", "veg35", "veg36", "veg37", "veg38", "veg39", "veg310", "veg311", "veg312", "veg313", "veg314", "veg315", "veg316", "veg317", "veg318", "veg319", "veg320",
        ]
        //-----------------------------
        this.ITEMS_REF = []
        //-----------------------------
        this.test_patch = new Patch({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario:this.scenario,
            parent3D:this.parent3D,
            position: this.stage.spots.get_spot("veg0")
        })
        this.ITEMS_REF.push(this.test_patch)
        //-----------------------------
        for(let i = 0; i < this.VEG_SPOTS.length; i++){
            const patch = new Patch({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                parent3D:this.parent3D,
                position: this.stage.spots.get_spot(this.VEG_SPOTS[i])
            })
            this.ITEMS_REF.push(patch)
        }

        // this.flower =  new Flower3D({
        //     app:this.app,
        //     project:this.project,
        //     stage:this.stage,
        //     scenario:this.scenario,
        //     parent3D:this.parent3D,
        // })
        
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
export default VegetationGroup