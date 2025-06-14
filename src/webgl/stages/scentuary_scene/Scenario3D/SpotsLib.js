//import gsap from "gsap"
import * as THREE from 'three'
import Datos from '../../../core/utils/Datos'

class SpotsLib{
    constructor (obj){
        // console.log("(SpotsLib.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        //-----------------------------
        this.DATA = new Datos()
        //-----------------------------
        //console.log("this.stage.GLB_PROJECT: ", this.stage.GLB_PROJECT);
        this.stage.GLB_PROJECT.children.map((item)=>{
            if(item.name.includes("_spot")){
                const spotId = item.name.split("_")[0]
                this.DATA.nuevoItem(spotId, item)
            }
        })

    }
    //----------------------------------------------
    // PUBLIC:
    get_spot(spotId){
        console.log("(SpotsLib.get_spot): ", spotId);
        return this.DATA.getItem(spotId).position.clone();
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default SpotsLib