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
        this.SPOT_LINKS ={
            "spot1": "scent1",
            "spot2": "scent2",
            "spot3": "scent3",
            "spot4": "scent4",
            "spot5": "scent5",
            "spot6": "scent6",
            "spot7": "scent7",
            "spot8": "scent8",
        }
        //------------------------
        this.app.emitter.on("onScentSelected", (data)=>{
            console.log("(CameraManager.onScentSelected): ", data.SCENT_ID);
            const spotId = this._get_SPOT(data.SCENT_ID)
            this.SPOT_POS = this.CAMERA_SPOTS.indexOf(spotId)
            this.stage.stageCamera.travelToSpot(spotId)
        })  
        //------------------------
        this.app.dev.gui.add(this, '_dev_nextSpot').name('NEXT CAMERA SPOT')
        this.app.dev.gui.add(this, '_dev_prevSpot').name('PREV CAMERA SPOT')
    }
    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    _get_SCENT(spotId){
        // PUBLIC:
        // Returns the SCENT_ID for a given camera spot
        if (this.SPOT_LINKS[spotId]) {
            return this.SPOT_LINKS[spotId];
        } else {
            //console.warn(`No SCENT_ID found for spot: ${spotId}`);
            return null;
        }   
    }
    _get_SPOT(scentId){
        // PUBLIC:
        // Returns the camera spot for a given SCENT_ID
        const spot = this.CAMERA_SPOTS.find(spot => this._get_SCENT(spot) === scentId);
        if (spot) {
            return spot;
        } else {
            //console.warn(`No camera spot found for SCENT_ID: ${scentId}`);
            return null;
        }
    }
    //----------------------------------------------
    _dev_nextSpot(){
        // PRIVATE:
        console.log("(CameraManager._dev_nextSpot): ", this.SPOT_POS);
        const nextSpot = this.SPOT_POS+1
        if (nextSpot >= this.CAMERA_SPOTS.length) {
            nextSpot = 0
        }
        const scentId = this._get_SCENT(this.CAMERA_SPOTS[nextSpot])
        this.stage.selectScent(scentId)
    }
    _dev_prevSpot(){
        const nextSpot = this.SPOT_POS-1
        if (nextSpot >= this.CAMERA_SPOTS.length) {
            nextSpot = 0
        }
        const scentId = this._get_SCENT(this.CAMERA_SPOTS[nextSpot])
        this.stage.selectScent(scentId)
    }
    //----------------------------------------------
    // AUX:

  
}
export default CameraManager