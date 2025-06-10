//import gsap from "gsap"
import * as THREE from 'three'

import Hitbox3D from "./Hitbox3D"

class MouseInteractions{
    constructor (obj){
        console.log("(MouseInteractions.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        //-----------------------------
        this.hits3D = new THREE.Object3D()
        this.hits3D.name = "hits3D"
        this.stage.scene.add(this.hits3D)
        //-----------------------------
        this.ITEM_MANIFEST = ["hit1", "hit2", "hit3", "hit4", "hit5", "hit6", "hit7", "hit8"]
        //-----------------------------
        this.CURRENT_ROLLOVER_SCENT_ID = null
        this.CURRENT_SELECTED_SCENT_ID = null
        //-----------------------------
        this.ITEMS_REF = []
        this.HITBOXES = []
        this.ITEM_MANIFEST.map((itemId)=>{
            const item = new Hitbox3D({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                mouseInteractions:this,
                parent3D:this.hits3D,
                itemId:itemId,
                itemIndex: this.ITEM_MANIFEST.indexOf(itemId),
                HITBOXES_ref:this.HITBOXES,
            })
            this.ITEMS_REF.push(item)
        })
        //-----------------------------
        this.raycaster = new THREE.Raycaster();
        //-----------------------------

        // window.addEventListener('click', ()=>{
            
        // }, false);

        //-----------------------------
        this.app.emitter.on("onAppMouseMove", (data)=>{
            this._update_rollover()
        })
        this.app.emitter.on("onAppMouseClick", (data)=>{
            console.log("onAppMouseClick", data);
            const SCENT_ID = this._get_raycaster_object();
            console.log("data.SCENT_ID", data.SCENT_ID);
            if(SCENT_ID != this.CURRENT_SELECTED_SCENT_ID){
                this.CURRENT_SELECTED_SCENT_ID = data.SCENT_ID;
                //this.stage.cameraManager.travelToScent(SCENT_ID)
                this.app.emitter.emit("onScentSelected", {
                    SCENT_ID: SCENT_ID, 
                })
            }
        })
        this.app.emitter.on("onScentSelected", (data)=>{
            console.log("onScentSelected", data);
            this.CURRENT_SELECTED_SCENT_ID = data.SCENT_ID;
        })
    }
    //----------------------------------------------
    // PUBLIC:
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        // console.log("this.mouse", this.mouse);
        // console.log("this.app.mouse.POSITION_NORM_V2", this.app.mouse.POSITION_NORM_V2);
        //this._get_raycaster_object()
        //this._update_rollover()
    }
    //----------------------------------------------
    // PRIVATE:
    _update_rollover(){
        const SCENT_ID = this._get_raycaster_object();
        // console.log("SCENT_ID", SCENT_ID);
        if(this.CURRENT_ROLLOVER_SCENT_ID != SCENT_ID){
            // console.log("*1");
            if(SCENT_ID == null){
                const tempId = this.CURRENT_ROLLOVER_SCENT_ID;
                this.CURRENT_ROLLOVER_SCENT_ID = null;
                this.app.emitter.emit("onScentRollout", {
                    SCENT_ID: tempId, 
                })
            }else{
                this.CURRENT_ROLLOVER_SCENT_ID = SCENT_ID;
                this.app.emitter.emit("onScentRollover", {
                    SCENT_ID: this.CURRENT_ROLLOVER_SCENT_ID, 
                })
            }

        }
    }
    _get_raycaster_object(){
        let SCENT_ID = null
        this.raycaster.setFromCamera(this.app.mouse.POSITION_NORM_V2, this.app.render.get_activeCamera());
        const intersects = this.raycaster.intersectObjects(this.HITBOXES);
        if(intersects.length > 0){
            const intersectedObject = intersects[0].object;
            SCENT_ID = intersectedObject.name
        }
        return SCENT_ID
    }
    //----------------------------------------------
    // AUX:

  
}
export default MouseInteractions