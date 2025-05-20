//import gsap from "gsap"
//import * as THREE from 'three'

class CameraManager{
    constructor (obj){
        // console.log("(CameraManager.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //------------------------
        this.SPOT_POS = 0
        this.CAMERA_SPOTS = ["spot0", "spot1", "spot2", "spot3", "spot4", "spot5", "spot6", "spot7", "spot8"]
        //------------------------
        this.app.dev.gui.add(this, '_dev_nextSpot').name('NEXT CAMERA SPOT')
        this.app.dev.gui.add(this, '_dev_prevSpot').name('PREV CAMERA SPOT')
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _dev_nextSpot(){
        this.SPOT_POS++
        if (this.SPOT_POS >= this.CAMERA_SPOTS.length) {
            this.SPOT_POS = 0
        }
        this.stage.stageCamera.travelToSpot(this.CAMERA_SPOTS[this.SPOT_POS])
    }
    _dev_prevSpot(){
        this.SPOT_POS--
        if (this.SPOT_POS < 0) {
            this.SPOT_POS = this.CAMERA_SPOTS.length - 1
        }
        this.stage.stageCamera.travelToSpot(this.CAMERA_SPOTS[this.SPOT_POS])
    }
    //----------------------------------------------
    // AUX:

  
}
export default CameraManager