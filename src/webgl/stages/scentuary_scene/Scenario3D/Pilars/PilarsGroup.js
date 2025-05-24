//import gsap from "gsap"
//import * as THREE from 'three'

import Pilar3D from "./Pilar3D"

class PilarsGroup{
    constructor (obj){
        // console.log("(PilarsGroup.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        this.ITEM_MANIFEST = ["pilar1", "pilar2", "pilar3", "pilar4", "pilar5", "pilar6", "pilar7", "pilar8"]
        this.ITEMS_REF = []
        this.ITEM_MANIFEST.map((itemId)=>{
            const item = new Pilar3D({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                parent3D:this.parent3D,
                itemId:itemId,
                itemIndex: this.ITEM_MANIFEST.indexOf(itemId),
            })
            this.ITEMS_REF.push(item)
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
export default PilarsGroup