//import gsap from "gsap"
import * as THREE from 'three'

import MeshUtils from "../../../core/utils/MeshUtils"
import Petal3D from './Petal3D'

class PetalPlane{
    constructor (obj){
        // console.log("(PetalPlane.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.fallinPetals = obj.fallinPetals
        this.parent3D = obj.parent3D
        this.raycasterCont3D = obj.raycasterCont3D
        //-----------
        this.ID = obj.ID
        this.COLOR = obj.COLOR
        this.NUM_ITEMS = obj.NUM_ITEMS
        this.PLANE_POSITION = obj.PLANE_POSITION
        this.REF_PLANE = obj.REF_PLANE
        this.IS_INTERACTIVE = obj.IS_INTERACTIVE

        //-----------
        if(this.REF_PLANE == null){
            this.PLANE_SIZE = this._get_PLANE_SIZE()
        }else{
            this.PLANE_SIZE = this.REF_PLANE.PLANE_SIZE
        }
        this.INFLUENCE_POINT = new THREE.Vector3(0, 0, 0)
        this.PLANE_NORMAL = new THREE.Vector3(0, 0, 1)
        //-----------
        this.cont3D = new THREE.Group()
        this.cont3D.name = this.ID
        this.cont3D.position.copy(this.PLANE_POSITION)
        this.parent3D.add(this.cont3D)
        //--
        this.plane_dev = MeshUtils.get_plane(1, 1, 0x00ffff, true)
        this.plane_dev.name = this.ID
        this.plane_dev.scale.set(this.PLANE_SIZE.width, this.PLANE_SIZE.height, 1)
        // this.plane_dev.position.copy(this.PLANE_POSITION)
        this.cont3D.add(this.plane_dev)
        this.app.register_helper(this.plane_dev)
        // this.fallinPetals.RAYCASTER_OBJECTS.push(this.plane_dev)
        //--
        this.PETALS = []
        for(var i=0; i<this.NUM_ITEMS; i++){
            const petal = new Petal3D({
                app: this.app,
                project: this.project,
                stage: this.stage,
                fallinPetals: this.fallinPetals,
                petalPlane: this,
                parent3D: this.cont3D,
                ID: "petal_" + i,
                IS_INTERACTIVE: this.IS_INTERACTIVE,
            })
            this.PETALS.push(petal)
        }
        //------------------------
        this.dev_mouse = new THREE.Mesh(
            new THREE.SphereGeometry(2, 8, 8),
            new THREE.MeshBasicMaterial({
                color:0x00ff00
            }
        ))
        this.dev_mouse.name = "dev_mouse"
        this.app.register_helper(this.dev_mouse)
        this.cont3D.add(this.dev_mouse)

    }
    //----------------------------------------------
    // PUBLIC:
    get_INFLUENCE_POINT(){
        return this.INFLUENCE_POINT
    }
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        
        if(this.IS_INTERACTIVE){
            this.INFLUENCE_POINT = this.fallinPetals.get_MOUSE_INTERSECT_POSITION()
        }else{
            // this.INFLUENCE_POINT = this._getOffsetPoint(this.stage.stageCamera.get_POSITION(), this.fallinPetals.get_MOUSE_INTERSECT_POSITION(), this.PLANE_POSITION.z)
            this.INFLUENCE_POINT = this._rayIntersectPlane(this.stage.stageCamera.get_POSITION(), this.fallinPetals.get_MOUSE_INTERSECT_POSITION(), this.PLANE_POSITION, this.PLANE_NORMAL)
        }
        //-----------
        this.PETALS.forEach((petal, i) => {
            petal.update_RAF()
        })
        //-----------
        this.dev_mouse.position.copy(this.INFLUENCE_POINT)
  
    }

    //----------------------------------------------
    // PRIVATE:
    _get_PLANE_SIZE(){
        const fov = this.stage.stageCamera.camera.fov * (Math.PI / 180); // Convert FOV to radians
        const aspect = this.app.size.CURRENT.aspect;
        // const distance = Math.abs(this.stage.stageCamera.holder.position.z)+0; // Distance from camera to plane
        const cameraPosition = this.stage.stageCamera.get_POSITION()
        // console.log("this.PLANE_POSITION: ", this.PLANE_POSITION);
        const distance = this.PLANE_POSITION.distanceTo(cameraPosition)+20
        const height = 2 * distance * Math.tan(fov / 2);
        const widthFar = height * aspect;
        return {
            width: widthFar,
            height: height,
        }
    }
    _getOffsetPoint(P1, P2, offset) {
        // Create a direction vector from P2 to P1 (so that negative offset moves toward P1)
        const direction = new THREE.Vector3().subVectors(P1, P2).normalize();
        
        // Scale direction vector by offset
        const offsetVector = direction.multiplyScalar(offset);
        
        // Compute P3 = P2 + offsetVector
        const P3 = new THREE.Vector3().addVectors(P2, offsetVector);
        P3.sub(this.PLANE_POSITION)
        
        return P3;
    }
    _rayIntersectPlane(P1, P2, P_PLANE, NORMAL) {
        const rayDir = new THREE.Vector3().subVectors(P2, P1).normalize();
        const denom = NORMAL.dot(rayDir);
      
        // Check if ray is parallel to the plane
        if (Math.abs(denom) < 1e-6) return null;
      
        const t = NORMAL.dot(new THREE.Vector3().subVectors(P_PLANE, P1)) / denom;
      
        // Check if the intersection is in the direction of the ray
        if (t < 0) return null;

        const intersectionPoint = new THREE.Vector3().copy(P1).add(rayDir.multiplyScalar(t));
        intersectionPoint.sub(this.PLANE_POSITION)
      
        return intersectionPoint;
      }
    //----------------------------------------------
    // AUX:

  
}
export default PetalPlane