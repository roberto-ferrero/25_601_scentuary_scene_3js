//import gsap from "gsap"
import * as THREE from 'three'

class Leaf3D{
    constructor (obj){
        console.log("(Leaf3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.position = obj.position
        this.angle = obj.angle 
        //-------------------
        this.RND_WIDE_SCALE = 0.5+ Math.random() * 1; // Random scale between 0.5 and 1.0
        this.RND_TALL_SCALE = 0.2+ Math.random() * 0.8; // Random scale between 0.5 and 1.0
        this.RND_BEND_SCALE = 0.5+ Math.random() * 0.5; // Random scale between 0.5 and 1.0
        // this.RND_SCALE = 0.5+ Math.random() * 0.5; // Random scale between 0.5 and 1.0
        //-------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.position.copy(this.position)
        this.cont3D.rotation.y = -this.angle; // Set the rotation if provided
        this.parent3D.add(this.cont3D)
        // this.cont3D.position.set(3.1403, 0.46, -0.509)
        // this.cont3D.position.set(-4, 0.34, 1.69)
        //-------------------
        // this.stem_texture = this.stage.loader.get_texture("stem")
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT("leaf1", this.stage.VEGETATION_GLB_PROJECT) 
        // this.mesh.material = new THREE.MeshStandardMaterial({
        this.mesh.material = new THREE.MeshBasicMaterial({
            // color: 0x024b07, // 
            color: this._varyColor(0x043407, 20), // 
            // transparent: true,
            // map: this.stem_texture, // Use the loaded texture
            side: THREE.DoubleSide, // Render both sides
            // wireframe: true, // Enable wireframe mode
            // depthWrite: true, // Enable depth testing
        });
        this.mesh.scale.set(this.RND_BEND_SCALE, this.RND_TALL_SCALE, this.RND_WIDE_SCALE); // Apply random scale
        this.cont3D.add(this.mesh)
        //------------------
        //-------------------
    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){
        // this._updatePlaneRotationY(this.stem_mesh);
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _updatePlaneRotationY(plane) {
        const cameraPos = new THREE.Vector3();
        this.app.render.get_activeCamera().getWorldPosition(cameraPos);

        const planePos = new THREE.Vector3();
        plane.getWorldPosition(planePos);

        // Get direction vector from plane to camera
        const dir = new THREE.Vector3().subVectors(cameraPos, planePos);

        // Project onto XZ plane (ignore Y)
        dir.y = 0;
        dir.normalize();

        // Calculate the angle around the Y axis
        const angle = Math.atan2(dir.x, dir.z);

        // Set plane rotation
        plane.rotation.y = angle;
    }

    _varyColor(colorIn, randomness = 10) {
        let r = (colorIn >> 16) & 0xff;
        let g = (colorIn >> 8) & 0xff;
        let b = colorIn & 0xff;

        // Apply random variation within the given range
        const vary = (channel) => {
            let variation = Math.floor((Math.random() - 0.5) * 2 * randomness);
            return Math.min(255, Math.max(0, channel + variation));
        };

        r = vary(r);
        g = vary(g);
        b = vary(b);

        // Convert back to hex
        const newColor = (r << 16) | (g << 8) | b;
        return newColor;
        }
    //----------------------------------------------
    // AUX:

  
}
export default Leaf3D