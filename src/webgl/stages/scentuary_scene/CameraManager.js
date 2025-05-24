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
        this.SCENT_ARRAY = this.stage.SCENT_ARRAY
        //------------------------
        this.app.dev.gui.add(this, '_dev_nextSpot').name('NEXT CAMERA SPOT')
        this.app.dev.gui.add(this, '_dev_prevSpot').name('PREV CAMERA SPOT')
    }
    //----------------------------------------------
    // PUBLIC:
    travelToScent(scentId){
        this.SPOT_POS = this.SCENT_ARRAY.indexOf(scentId)+1
        const spotId = this.CAMERA_SPOTS[this.SPOT_POS]
        this.stage.stageCamera.travelToSpot(spotId)
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    _dev_nextSpot(){
        // PRIVATE:
        this.SPOT_POS++
        if (this.SPOT_POS >= this.CAMERA_SPOTS.length) {
            this.SPOT_POS = 0
        }
        const spotId = this.CAMERA_SPOTS[this.SPOT_POS]
        this.stage.stageCamera.travelToSpot(spotId)
    }
    _dev_prevSpot(){
        this.SPOT_POS--
        if (this.SPOT_POS < 0) {
            this.SPOT_POS = this.CAMERA_SPOTS.length - 1
        }
        const spotId = this.CAMERA_SPOTS[this.SPOT_POS]
        this.stage.stageCamera.travelToSpot(spotId)
    }
    //----------------------------------------------
    // AUX:

  
}
export default CameraManager