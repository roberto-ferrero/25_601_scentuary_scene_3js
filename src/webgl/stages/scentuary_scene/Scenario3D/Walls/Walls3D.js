//import gsap from "gsap"
import * as THREE from 'three'

class Walls3D{
    constructor (obj){
        // console.log("(Walls3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        this.itemId = "walls"
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        this.texture = this.stage.loader.get_texture("walls")
        this.texture.flipY = false;
        const marbleMaterial = new THREE.MeshStandardMaterial({
            map: this.texture, // Use the loaded texture
            color: this.scenario.BESE_MARGEL_COLOR, // Ivory base color
            // color: 0xff0000, // Ivory base color
            roughness: 0.4,   // Moderate roughness for a soft shine
            metalness: 0.0,   // Non-metallic
            // emissive: 0xbab4b1, // Ivory base color
            // emissiveIntensity: 0.2, // Soft glow
          });
        this.mesh.material = marbleMaterial
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        // console.log("mesh",this.mesh);
        this.parent3D.add(this.mesh)

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
export default Walls3D