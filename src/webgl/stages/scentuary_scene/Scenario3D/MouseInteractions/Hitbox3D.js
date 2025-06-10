//import gsap from "gsap"
import * as THREE from 'three'

class HitBox3D{
    constructor (obj){
        console.log("(HitBox3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D //
        this.mouseInteractions = obj.mouseInteractions
        this.itemId = obj.itemId,
        this.itemIndex = obj.itemIndex // Position of the item in the 3D space
        this.HITBOXES_ref = obj.HITBOXES_ref // Reference to the HITBOXES array
        //-----------------------------
        this.SCENT_ID  = this.stage.SCENT_ARRAY[this.itemIndex]
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        //--
        const material = new THREE.MeshStandardMaterial({
            transparent: true,
            //wireframe:true,
            opacity: 0, // Fully opaque
            depthWrite: false, // Disable depth writing
            color: this.scenario.BESE_MARGEL_COLOR, // Ivory base color
          });
        this.mesh.name = this.SCENT_ID
        this.mesh.material = material
        this.mesh.castShadow = false;
        // console.log("mesh"s,this.mesh);
        this.parent3D.add(this.mesh)
        this.HITBOXES_ref.push(this.mesh)

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
export default HitBox3D