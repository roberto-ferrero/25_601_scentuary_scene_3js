//import gsap from "gsap"
import * as THREE from 'three'

// import vertex from "./_shaders/petal_vertex.glsl"
// import fragment from "./_shaders/petal_fragment.glsl"

class Petal3D{ // instanciado en: this.app.project.stage.FallingPetals
    constructor (obj){
        // console.log("(Petal3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.fallinPetals = obj.fallinPetals
        this.petalPlane = obj.petalPlane
        this.parent3D = obj.parent3D
        this.ID = obj.ID
        this.IS_INTERACTIVE = obj.IS_INTERACTIVE
        //---------------------
        this.VELOCITY = new THREE.Vector3(0, 0, 0)
        this.REPULSE_FORCE = new THREE.Vector3(0, 0, 0)
        //---------------------
        this.WRAP_LIMIT = { }
        this.WRAP_LIMIT.x = (this.petalPlane.PLANE_SIZE.width*0.5)*1.2;
        this.WRAP_LIMIT.y = (this.petalPlane.PLANE_SIZE.height*0.5)*1.2;

        this.RESPAWN_POS = { }
        this.RESPAWN_POS.x = (this.petalPlane.PLANE_SIZE.width*0.5)*1.1;
        this.RESPAWN_POS.y = (this.petalPlane.PLANE_SIZE.height*0.5)*1.1;
        //---------------------
        this.INC_ROT_X = 0.04 * (Math.random() - 0.5)
        this.INC_ROT_Y = 0.04 * (Math.random() - 0.5)
        this.INC_ROT_Z = 0.01 * (Math.random() - 0.5)
        //---------------------
        const dice = this.__dice(4)-1
        // console.log("dice: ", dice);
        this.geometry = this.stage.loader.get_gltf("petal_"+dice).children[0].geometry
        this.material = new THREE.MeshBasicMaterial({
            color: this.petalPlane.COLOR,
            transparent:false,
            depthWrite:true,
            side: THREE.DoubleSide,
            // wireframe:true,
        });
        //---------------------
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = "p_"+this.pos
        let scale = 0.5 + Math.random()*0.5
        scale = 0.6
        this.mesh.scale.set(scale, scale, scale)
        const initialX = this.RESPAWN_POS.x*2*(Math.random() - 0.5)
        const initialY = this.RESPAWN_POS.y*2*(Math.random() - 0.5)
        this.mesh.position.set(initialX, initialY, 0)
        this.parent3D.add(this.mesh)
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this._applay_gravity()
        this._applay_wind()
        this._applay_drag()
        //--
        //if(this.IS_INTERACTIVE){
            this._apply_mouse_interaction()
        //}
        //--
        this._update_postion()
        this._update_rotation()
        //--
        this._eval_wrap()

    }   
    //----------------------------------------------
    // PRIVATE:
    _apply_mouse_interaction() {
        // PARAMETERS (you can adjust or even move them outside the function if you want them configurable)
        const maxDistance = 20.0; // example value
        const minDistance = 0.1; // example value
        const maxStrength = 1.0; // example value
        const maxStrengthPoint = 0.2; // 0..1
        
        const mousePos = this.petalPlane.get_INFLUENCE_POINT(); // THREE.Vector3
        const petalPos = this.mesh.position;
    
        const dir = new THREE.Vector3().subVectors(petalPos, mousePos);
        const distance = dir.length();
    
        if (distance > maxDistance || distance < minDistance) {
            this.REPULSE_FORCE.set(0, 0, 0);
            return;
        }
    
        // Normalize direction
        dir.normalize();
    
        // Map distance to force
        let t = (distance - minDistance) / (maxDistance - minDistance); // normalize distance to 0-1
        let strength = 0;
    
        if (t < maxStrengthPoint) {
            strength = maxStrength * (t / maxStrengthPoint); // rising phase
        } else {
            strength = maxStrength * (1 - (t - maxStrengthPoint) / (1 - maxStrengthPoint)); // falling phase
        }
    
        // Final force
        this.REPULSE_FORCE.copy(dir.multiplyScalar(strength));
    }
    // _apply_mouse_interaction2() {
    //     // const direction = this.mesh.position.clone().sub(this.fallinPetals.MOUSE_INTERSECT_POSITION) // from mouse to particle
    //     const direction = this.mesh.position.clone().sub(this.petalPlane.get_INFLUENCE_POINT()) // from mouse to particle
    //     const distance = direction.length()
    
    //     if (distance < 2.0) { // apply repulsion only within certain distance
    //         direction.normalize()
    
    //         // Repulsion strength can be scaled based on distance (e.g., inverse square law)
    //         const strength = 1 / (distance * distance + 0.1) // avoid division by zero
    //         direction.multiplyScalar(strength * 0.5) // tweak multiplier to control overall force
    
    //         this.REPULSE_FORCE.add(direction)
    //         this.REPULSE_FORCE.multiplyScalar(0.4)
    //     }
    // }
    
    _applay_gravity() {
        this.VELOCITY.add(this.fallinPetals.GRAVITY)
    }
    _applay_wind() {
        this.VELOCITY.add(this.fallinPetals.WIND)
    }
    _applay_drag() {
        // const drag = this.VELOCITY.clone()
        // drag.multiplyScalar(-0.2)
        // this.VELOCITY.add(drag)
        this.VELOCITY.multiplyScalar(0.8)
    }
    _update_postion() {
        this.mesh.position.add(this.VELOCITY)
        this.mesh.position.add(this.REPULSE_FORCE)
    }
    _update_rotation() {
        this.mesh.rotation.x += this.INC_ROT_X
        this.mesh.rotation.y += this.INC_ROT_Y
        this.mesh.rotation.z += this.INC_ROT_Z
    }

    _eval_wrap() {
        

        if (this.mesh.position.x < -this.WRAP_LIMIT.x) {
            this.mesh.position.x = this.RESPAWN_POS.x;
            this._reset_VELOCITY()
            this.VELOCITY = new THREE.Vector3(0, 0, 0)
        } else if (this.mesh.position.x > this.WRAP_LIMIT.x) {
            this._reset_VELOCITY()
            this.mesh.position.x = -this.RESPAWN_POS.x;
        }
        
        if (this.mesh.position.y < -this.WRAP_LIMIT.y) {
            this.mesh.position.y = this.RESPAWN_POS.y;
            this._reset_VELOCITY()
        } else if (this.mesh.position.y > this.WRAP_LIMIT.y) {
            this.mesh.position.y = -this.RESPAWN_POS.y;
            this._reset_VELOCITY()
        }
      }
      _reset_VELOCITY(){
        this.VELOCITY = new THREE.Vector3(0, 0, 0)
        this.REPULSE_FORCE = new THREE.Vector3(0, 0, 0)
      }
    //----------------------------------------------
    // AUX:
    __dice(numFaces) { // Simula un dado 0 a numFaces-1
        return Math.floor(Math.random() * numFaces) + 1;
    }
  
}
export default Petal3D