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

        //-----------------------------
        this.itemId = "walls"
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        this.texture = this.stage.loader.get_texture("walls")
        this.texture.flipY = false;
        //--
        this.texture_ao = this.stage.loader.get_texture("walls_ao")
        this.texture_ao.flipY = false;
        //--
        const marbleMaterial = new THREE.MeshStandardMaterial({
            map: this.texture, // Use the loaded texture
            color: this.scenario.BESE_MARGEL_COLOR, // Ivory base color
            // color: 0xff0000, // Ivory base color
            aoMap: this.texture_ao,
            aoMapIntensity: 0.5,
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
        //-----------------------------

        //-----------------------------
        this.item2Id = "goldenframe"
        this.mesh2 = this.stage.get_mesh_from_GLB_PROJECT(this.item2Id)
        this.texture2 = this.stage.loader.get_texture("goldenframe")
        this.texture2.flipY = false;
        const goldenMaterial = new THREE.MeshStandardMaterial({
            map: this.texture2, // Use the loaded texture
            metalness: 1.0,               // Fully metallic
            roughness: 0.2,               // A bit of roughness for realism
            emissive: new THREE.Color(0xaf8140), // Rich gold color (hex for gold)
            emissiveIntensity: 0.5,       // Soft glow
            color: new THREE.Color(0xaf8140) // Rich gold color (hex for gold)
            // color: new THREE.Color(0xFFD700) // Rich gold color (hex for gold)
        });
        this.mesh2.material = goldenMaterial
        this.mesh2.castShadow = true;
        this.mesh2.receiveShadow = true;
        // console.log("mesh",this.mesh);
        this.parent3D.add(this.mesh2)
        //-----------------------------

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