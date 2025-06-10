//import gsap from "gsap"
//import * as THREE from 'three'
import Spiral from "./Spiral"


class SpiralFx{
    constructor (obj){
        console.log("(SpiralFx.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.ITEMS_REF = []
        // this.SPOTsS_ARRAY = ["pilartop1"]
        this.SPOTS_ARRAY = ["pilartop1", "pilartop2", "pilartop3", "pilartop4", "pilartop5", "pilartop6", "pilartop7", "pilartop8"]
        this.SCENT_ARRAY = this.stage.SCENT_ARRAY
        console.log("this.SCENTS_ARRAY:", this.SCENT_ARRAY);
        //-----------------------------
        for(let i = 0; i < this.SPOTS_ARRAY.length; i++){
            const spotId = this.SPOTS_ARRAY[i]
            const patch = new Spiral({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                parent3D:this.parent3D,
                position: this.stage.spots.get_spot(spotId),
                scentId: this.SCENT_ARRAY[i],
            })
            this.ITEMS_REF.push(patch)
        }
    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){
        this.ITEMS_REF.forEach((item)=>{
            item.update_RAF()
        })
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default SpiralFx