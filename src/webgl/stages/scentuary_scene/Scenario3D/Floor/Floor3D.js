//import gsap from "gsap"
import * as THREE from 'three'

class Floor3D{
    constructor (obj){
        // console.log("(Floor3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        //-----------------------------
        this.itemId = "floor"
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        this.texture = this.stage.loader.get_texture("floor")
        this.texture.flipY = false;
        this.texture_ao = this.stage.loader.get_texture("floor_ao")
        this.texture_ao.flipY = false;
        // this.texture_light = this.stage.loader.get_texture("floor_shadow")
        // this.texture_light.flipY = false;
        const marbleMaterial = new THREE.MeshStandardMaterial({
            map: this.texture, // Use the loaded texture
            aoMap: this.texture_ao,
            aoMapIntensity: 1.0,
            // lightMap: this.texture_light,
            // lightMapIntensity: 0.5,
            color: this.scenario.BESE_MARGEL_COLOR, // Ivory base color
            roughness: 0.45,   // Moderate roughness for a soft shine
            metalness: 0.0,   // Non-metallic
            
          });
        this.mesh.material = marbleMaterial
        this.mesh.receiveShadow = true;
        // console.log("mesh",this.mesh);
        this.parent3D.add(this.mesh)

    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:a

    //----------------------------------------------
    // AUX:

  
}
export default Floor3D