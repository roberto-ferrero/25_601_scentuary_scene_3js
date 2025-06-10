import gsap from "gsap"
import * as THREE from 'three'

// import MeshUtils from '../../../../core/utils/MeshUtils'

import EasedOutValue from "../../../../core/utils/EasedOutValue"

import vertex from './_shaders/spiral_vertex.glsl'
import fragment from './_shaders/spiral_fragment.glsl'

class Spiral{
    constructor (obj){
        console.log("(Spiral.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario = obj.scenario
        this.parent3D = obj.parent3D
        this.position = obj.position
        this.scentId = obj.scentId
        //-----------------------------
        this.NUM_PARTICLES = 200
        this.ITEMS_REF = []
        this.SHOWING = false
        this.IN_ROLLOVER = false
        this.SHOW_PROGRESS_EASED =  new EasedOutValue(0, 0.1, 0.01, this.app.emitter, "onUpdateRAF")
        //-----------------------------
        this.DEV_ITEM=false
        if(this.scentId == "scent1"){
            this.DEV_ITEM = true
        }
        //-----------------------------

        this.gsap_show = null
        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.position.copy(this.position)
        this.parent3D.add(this.cont3D)
        //-----------------------------
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.NUM_PARTICLES * 3);
        this.angleSeeds  = new Float32Array(this.NUM_PARTICLES);
        this.radiusSeeds  = new Float32Array(this.NUM_PARTICLES);
        this.speedSeeds = new Float32Array(this.NUM_PARTICLES);
        this.randomSeeds  = new Float32Array(this.NUM_PARTICLES*3);
        //--
        for (let i = 0; i < this.NUM_PARTICLES; i++) {
            this.angleSeeds[i] = Math.random() * Math.PI * 2;       // Initial theta
            this.radiusSeeds[i] = 0.1 + Math.random() * 0.02;           // Spiral radius
            this.speedSeeds[i] = 0.01 + Math.random() * 0.01;        // Speed of rotation
            this.randomSeeds[i * 3 + 0] = Math.random();        // Speed of rotation
            this.randomSeeds[i * 3 + 1] = Math.random();        // Speed of rotation
            this.randomSeeds[i * 3 + 2] = Math.random();        // Speed of rotation

            this.positions[i * 3 + 0] = this.radiusSeeds[i] * Math.cos(this.angleSeeds[i]);
            this.positions[i * 3 + 1] = 0;
            this.positions[i * 3 + 2] = this.radiusSeeds[i] * Math.sin(this.angleSeeds[i]);
        }
        //---
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('aAngle', new THREE.BufferAttribute(this.angleSeeds, 1));
        this.geometry.setAttribute('aRadius', new THREE.BufferAttribute(this.radiusSeeds, 1));
        this.geometry.setAttribute('aSpeed', new THREE.BufferAttribute(this.speedSeeds, 1));
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(this.randomSeeds, 3));
        //---
        const texture = this.stage.loader.get_texture('spiral_sparkle');

        // this.material = new THREE.PointsMaterial({
        //     size: 0.03+Math.random()*0.02,
        //     map: texture,
        //     transparent: true,
        //     blending: THREE.AdditiveBlending,
        //     depthWrite: false,
        //     color: new THREE.Color(0xffaaff),
        // });

        this.material = new THREE.ShaderMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
  
            vertexShader: vertex,
            fragmentShader: fragment,

            uniforms: {
                uTime: { value: 0 },
                uTextrure: { value: texture },
                uShowProgress: { value: 0 },
            }
        });

        this.particles = new THREE.Points(this.geometry, this.material);
        this.cont3D.add(this.particles);
        //-----------------------------
        this.app.emitter.on("onScentRollover", (data)=>{    
            if(data.SCENT_ID == this.scentId){
                this.IN_ROLLOVER = true;
            }else{
                this.IN_ROLLOVER = false;
            }
            this._eval_state()
        })
        this.app.emitter.on("onScentRollout", (data)=>{    
            if(data.SCENT_ID == this.scentId){
                this.IN_ROLLOVER = false;
            }
            this._eval_state()
        })
        this.app.emitter.on("onScentSelected", (data)=>{   
            // console.log("onScentSelected", data); 
            if(data.SCENT_ID == this.scentId){
                this.SHOWING = true;
            }else{
                this.SHOWING = false;
            }
            this._eval_state()
        })
        //-----------------------------
        // gsap.delayedCall(0.1, ()=>{
        //     this.show();
        // })
    }
    //----------------------------------------------
    // PUBLIC:
    show(){
        console.log("(Spiral.show): "+this.scentId);
        this.SHOW_PROGRESS_EASED.set(1)
    }
    hide(){
        // console.log("(Spiral.hide): "+this.scentId);
        this.SHOW_PROGRESS_EASED.set(0)
    }
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this._update_uniforms()
        this._update_position()
        if(this.DEV_ITEM){
            // console.log("SHOW_PROsGRESS_EASED: "+this.SHOW_PROGRESS_EASED.get());
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _update_uniforms(){
        this.material.uniforms.uTime.value = this.app.ELAPSED_TIME;
        this.material.uniforms.uShowProgress.value = this.SHOW_PROGRESS_EASED.get();
    }
    _update_position(){
        const pos = this.geometry.attributes.position.array;

        for (let i = 0; i < this.NUM_PARTICLES; i++) {
            this.angleSeeds[i] += this.speedSeeds[i];                   // increase angle
            const y = pos[i * 3 + 1] + 0.5*this.speedSeeds[i];          // move up slowly

            if (y > 1.5) {
                pos[i * 3 + 1] = 0;                     // reset to bottom
                this.angleSeeds[i] = Math.random() * Math.PI * 2;
            } else {
                pos[i * 3 + 1] = y;
            }

            const radius = this.radiusSeeds[i];
            pos[i * 3 + 0] = radius * Math.cos(this.angleSeeds[i]);
            pos[i * 3 + 2] = radius * Math.sin(this.angleSeeds[i]);
        }

        this.geometry.attributes.position.needsUpdate = true;
    }
    _eval_state(){
        if(this.SHOWING){
            this.show();
        }else{
            if(this.IN_ROLLOVER){
                this.show();
            }else{
                this.hide();
            }
        }
    }
    //----------------------------------------------
    // AUX:

  
}
export default Spiral