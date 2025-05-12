//import gsap from "gsap"
import * as THREE from 'three'

import vertex from "./_shaders/gradientBg_vertex.glsl"
import fragment from "./_shaders/gradientBg_fragment.glsl"

class GradientBg{
    constructor (obj){
        // console.log("(GradientBg.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.PLANE_POSITION = obj.PLANE_POSITION
        //-----------------------------
        this.PLANE_SIZE = this._get_PLANE_SIZE()
        //-----------------------------
        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                // Static
                uColor0 :{value: new THREE.Color("#ede8de").convertLinearToSRGB()}, // base colorede8de
                // uColor1 :{value: new THREE.Color("#000000")}, // ligheer base
                uColor1 :{value: new THREE.Color("#f3d7f0")}, // ligheer base
                uColor2 :{value: new THREE.Color("#f3d7f0")}, // Pink
                uColor3 :{value: new THREE.Color("#e5d9c0")},
                uColorTouch :{value: new THREE.Color("#ede8de")},
                // Dynamic
                uTime: { value: 0 },
                uAspectRatio: {value: this.app.size.CURRENT.aspect},
                // ??
                uScrollProgress: {value: 0},
                uResponsiveScale: {value: 4000000},
                uFooterProgress: {value: 0},
                uScrollDelta: {value: 0},
                uScrollTotalRange: {value: 0},
                // u_mouse: { value: new THREE.Vector2(0, 0) },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: false,
            depthWrite: false,
            side: THREE.DoubleSide,
            // wireframe:true
        })
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.plane.name = "gradientBg"
        this.plane.position.copy(this.PLANE_POSITION)
        this.plane.scale.set(this.PLANE_SIZE.width, this.PLANE_SIZE.height, 1)
        this.parent3D.add(this.plane)
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.material.uniforms.uTime.value = this.app.clock.getElapsedTime()
        this.material.uniforms.uAspectRatio.value = this.app.size.CURRENT.aspect


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
    //----------------------------------------------
    // AUX:

  
}
export default GradientBg