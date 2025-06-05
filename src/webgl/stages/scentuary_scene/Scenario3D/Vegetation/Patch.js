//import gsap from "gsap"
import * as THREE from 'three'

import Flower3D from "./Flower3D"
import MeshUtils from '../../../../core/utils/MeshUtils'
import Leaf3D from './Leaf3D'

class Patch{
    constructor (obj){
        // console.log("(Patch.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        this.position = obj.position
        //-----------------------------
        this.NUM_LEAVES = 20
        this.ITEMS_REF = []
        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.position.copy(this.position)
        this.parent3D.add(this.cont3D)
        //-----------------------------
        this.cir_helper = MeshUtils.get_sphere(0.1, 8, 8, 0x00ff00, true)
        this.cont3D.add(this.cir_helper)
        this.app.register_helper(this.cir_helper)
        //-----------------------------

        for(let i = 0; i < this.NUM_LEAVES; i++){
            const angle = ((i / this.NUM_LEAVES) * Math.PI * 2); // Full circle
            console.log("angle", angle);
            const radius = 0.15*Math.random(); // Radius of the circle
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const leaf = new Leaf3D({
                app:this.app,
                project:this.project,
                stage:this.stage,
                scenario:this.scenario,
                parent3D:this.cont3D,
                position: new THREE.Vector3(x, 0, z), // Position in a circle
                angle: angle // Pass the angle to the leaf
            })
            this.ITEMS_REF.push(leaf)
        }

        // this.leaf_1 = new Leaf3D({
        //     app:this.app,
        //     project:this.project,
        //     stage:this.stage,
        //     scenario:this.scenario,
        //     parent3D:this.cont3D,
        //     position: new THREE.Vector3(0, 0, 0), // Default position
        // })
        // this.ITEMS_REF.push(this.leaf_1)
        //-----------------------------
        this.flower =  new Flower3D({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario:this.scenario,
            parent3D:this.cont3D,
            position: new THREE.Vector3(0, 0, 0), // Default position
        })
        this.ITEMS_REF.push(this.flower)
        //-----------------------------
        
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.ITEMS_REF.forEach((item)=>{
            item.update_RAF()
        })
    }
    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Patch