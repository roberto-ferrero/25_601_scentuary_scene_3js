//import gsap from "gsap"
import * as THREE from 'three'

class Pilar3D{
    constructor (obj){
        // console.log("(Pilar3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.itemId = obj.itemId
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        //--
        this.texture = this.stage.loader.get_texture("pilars")
        this.texture.flipY = false;
        //--
        this.texture_ao = this.stage.loader.get_texture("pilars_ao")
        this.texture_ao.flipY = false;
        //--
        const marbleMaterial = new THREE.MeshStandardMaterial({
            map: this.texture, // Use the loaded texture
            aoMap: this.texture_ao,
            aoMapIntensity: 0.5,
            // color: 0xF6F1E7, // Ivory base color
            roughness: 0.4,   // Moderate roughness for a soft shine
            metalness: 0.0,   // Non-metallic
            // emissive: 0xbab4b1, // Ivory base color
            // emissiveIntensity: 0.1, // Soft glow
          });
        this.mesh.material = marbleMaterial
        // console.log("mesh"s,this.mesh);
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
export default Pilar3D