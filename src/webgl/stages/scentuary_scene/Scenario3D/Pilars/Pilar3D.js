//import gsap from "gsap"
import * as THREE from 'three'
import Coin3D from './Coin3D'

class Pilar3D{
    constructor (obj){
        // console.log("(Pilar3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        this.itemId = obj.itemId
        this.itemIndex = obj.itemIndex // Position of the item in the 3D space
        //-----------------------------
        this.SCENT_ID = this.stage.SCENT_ARRAY[this.itemIndex]
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        //--
        this.texture = this.stage.loader.get_texture(this.itemId)
        this.texture.flipY = false;
        //--
        this.texture_ao = this.stage.loader.get_texture(this.itemId+"_ao")
        this.texture_ao.flipY = false;
        //--
        const marbleMaterial = new THREE.MeshStandardMaterial({
            map: this.texture, // Use the loaded texture
            aoMap: this.texture_ao,
            aoMapIntensity: 0.5,
            color: this.scenario.BESE_MARGEL_COLOR, // Ivory base color
            // color: new THREE.Color(0xaf8140), // Ivory base color
            roughness: 0.4,   // Moderate roughness for a soft shine
            metalness: 0.0,   // Non-metallic
            emissive: 0xbab4b1, // Ivory base color
            emissiveIntensity: 0.1, // Soft glow
        });
        this.mesh.material = marbleMaterial
        this.mesh.castShadow = true;
        //-----------------------------
        this.parent3D.add(this.mesh)
        //-----------------------------


        //-----------------------------
        // COIN:
        const meshId = "coin"+this.itemId.split("pilar")[1]
        const spotId = "pilartop"+this.itemId.split("pilar")[1]
        this.coin = new Coin3D({
            app: this.app,
            project: this.project,
            stage: this.stage,
            scenario: this.scenario,
            parent3D: this.parent3D,
            pilar: this,
            meshId: meshId,
            spotId: spotId,
            SCENT_ID: this.SCENT_ID,
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
export default Pilar3D