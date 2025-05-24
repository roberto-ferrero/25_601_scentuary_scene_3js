//import gsap from "gsap"
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water2.js'

class Sea3D{
    constructor (obj){
        // console.log("(Sea3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.sunPosition = obj.sunPosition
        this.sunColor = obj.sunColor
        this.parent3D = obj.parent3D
        //-----------------------------
        this.itemId = "sea"
        //-----------------------------
        const params = {
            color: '#ffffff',
            scale: 4,
            flowX: 1,
            flowY: 1
        };
        //-----------------------------
        this.mesh = this.stage.get_mesh_from_GLB_PROJECT(this.itemId)
        //---
        const seaGeometry = new THREE.PlaneGeometry(40, 40, 100, 100) // Replace size if needed

        this.mesh = new Water(seaGeometry, {
            // color: 0x001e0f,
            // scale: 4,
            // flowDirection: new THREE.Vector2(1, 1),
            // textureWidth: 1024,
            // textureHeight: 1024
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load(
                'https://threejs.org/examples/textures/waternormals.jpg',
                texture => texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            ),
            normalMap0: this.stage.loader.get_texture("normalMap0"),
            normalMap1: this.stage.loader.get_texture("normalMap1"),
            sunDirection: this.sunPosition,
            sunColor: this.sunColor,
            waterColor: 0x00377a,
            distortionScale: 3.7,
            fog: this.app.scene.fog !== undefined
        })

        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.position.set(-24.0, 0.2, 0)
        // this.mesh.rotation.z = -Math.PI / 2
        this.parent3D.add(this.mesh)

    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){
        // if (this.mesh.material && this.mesh.material.uniforms) {
        // console.log("this.mesh.material.uniforms: ", this.mesh.material.uniforms);
        // this.mesh.material.uniforms['time'].value += 1.0 / 60.0;s
        //     this.mesh.material.uniforms['time'].value += 1.0 / 60.0
        // }
    }

    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Sea3D