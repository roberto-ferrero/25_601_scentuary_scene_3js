//import gsap from "gsap"
import * as THREE from 'three'

class Flower3D{
    constructor (obj){
        // console.log("(Flower3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-------------------
        this.cont3D = new THREE.Object3D()
        this.parent3D.add(this.cont3D)
        // this.cont3D.position.set(3.1403, 0.46, -0.509)
        // this.cont3D.position.set(-4, 0.34, 1.69)
        //-------------------
        // this.stem_texture = this.stage.loader.get_texture("stem")
        this.stem_mesh = this.stage.get_mesh_from_GLB_PROJECT("stem1", this.stage.VEGETATION_GLB_PROJECT) 
        this.stem_mesh.material = new THREE.MeshStandardMaterial({
            color: 0x024b07, // 
            transparent: true,
            // map: this.stem_texture, // Use the loaded texture
            side: THREE.DoubleSide, // Render both sides
            // wireframe: true, // Enable wireframe mode
            // depthWrite: true, // Enable depth testing
        });
        this.cont3D.add(this.stem_mesh)
        //--------------------
        this.flower_texture = this.stage.loader.get_texture("flower")
        this.flower_mesh = this.stage.get_mesh_from_GLB_PROJECT("flower", this.stage.VEGETATION_GLB_PROJECT)
        this.flower_mesh.material = new THREE.MeshStandardMaterial({
            //color: 0xe9c66f, // 
            transparent: true,
            map: this.flower_texture, // Use the loaded texture
            emissiveMap: this.flower_texture, // Use the same texture for emissive effect
            emissiveIntensity: 1.5, // Adjust the intensity of the emissive effect
            emissive: 0xe9c66f, // Emissive color
            side: THREE.DoubleSide, // Render both sides
            // wireframe: true, // Enable wireframe mode
            depthWrite: false

        });
        this.flower_mesh.rotation.set(2.3, 0, 0.7); // Rotate the flower mesh
        this.cont3D.rotation.set(-0.2, 0.0, 0.0); // Scale the flower mesh
        this.cont3D.scale.set(0.7, 0.7, 0.7); // Scale the flower mesh
        this.cont3D.add(this.flower_mesh)
        //-------------------
    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){
        this._updatePlaneRotationY(this.stem_mesh);
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
    //----------------------------------------------
    // AUX:

  
}
export default Flower3D