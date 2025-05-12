//import gsap from "gsap"
import * as THREE from 'three'

import NumberUtils from '../../core/utils/NumberUtils';

import test_boxes_vert from "./shaders/test_boxes_vert.glsl";
import test_boxes_frag from "./shaders/test_boxes_frag.glsl";
import panel_vert from "./shaders/panel_vert.glsl";
import panel_frag from "./shaders/panel_frag.glsl";
import MeshUtils from '../../core/utils/MeshUtils';


class BoxMapper{
    constructor (obj){
        //console.log("(BoxMapper.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.anim = obj.anim
        this.parent3D = obj.parent3D
        this.fluids = obj.fluids
        //--
        this.$selectors =["box1","box2","box3","box4","box5","box6","box7","box8"]
        this.MAX_VISIBLE_BOXES = 4
        this.MAX_VISIBLE_COVER_CIRCLES = 1
        this.UNIFORM_BOXES_SLOTS = 4
        this.UNIFORM_COVER_CIRCLES_SLOTS = 1
        this.EMPTY_VEC4 = new Float32Array([0.0, 0.0, 0.0, 0.0]) 
        //--
        this.SHOW_PANELS = false
        //--
        this.boxes = []
        this.cover_circle
        //--
        /*
        this.boxes = []
        for(var i=0; i<this.$selectors.length; i++){
            this.boxes[i] = {
                domItem: document.getElementById(this.$selectors[i]),
                clientRects:{},
                visible:false,
                vec4: new Float32Array([0.0, 0.0, 0.0, 0.0]),
                uv_x1:0,
                uv_y1:0,
                uv_x2:0,
                uv_y2:0
            }
        }
        */
        //-------------
        // EVENTS:
        this.app.emitter.on("onUpdateDOMItems", ()=>{
            //console.log("(BoxMapper.onUpdateDOMItems): ", obj)
            //console.log(this.app.socket.APP_STORE.currentSection.$canvasElements);//this.appStore.currentSection.$canvasElements
            this._create_boxes2(this.app.socket.APP_STORE.currentSection.$canvasElements)
            //this._create_cover_circle()
        })
        
        this.app.emitter.on("onAppScrollUpdate", ()=>{
            //console.log("(BoxMapper.onAppScrollUpdate): ", obj)
            //console.log(this.app.size.CURRENT.width);
            //console.log(this.domItems[0].getClientRects()[0].y);
            const visible_ones = []
            for(var i=0; i<this.boxes.length; i++){
                this._update_box(i)
                if(this.boxes[i].visible && visible_ones.length<this.MAX_VISIBLE_BOXES){
                    visible_ones.push(this.boxes[i])
                }
                //this.panel1.material.uniforms.uBox1.value = this.boxes[0].vec4
            }
            //console.log(visible_ones);
            for(var i=0; i<this.UNIFORM_BOXES_SLOTS; i++){
                if(visible_ones[i]){
                    const box = visible_ones[i]
                    if(this.anim.SHOW_PANELS) this.panel0.material.uniforms["uBox"+Number(i+1)].value = box.vec4
                    this.fluids.output.simulation.externalForce.mouse.material.uniforms["uBox"+Number(i+1)].value = box.vec4
                }else{
                    if(this.anim.SHOW_PANELS) this.panel0.material.uniforms["uBox"+Number(i+1)].value = this.EMPTY_VEC4
                    this.fluids.output.simulation.externalForce.mouse.material.uniforms["uBox"+Number(i+1)].value = this.EMPTY_VEC4
                }
            }

            //--
            //this._update_cover_circle()
            //if(this.anim.SHOW_PANELS) this.panel0.material.uniforms["uCircle1"].value = this.cover_circle.vec4
            //this.fluids.output.simulation.externalForce.mouse.material.uniforms["uCircle1"].value = this.cover_circle.vec4

        })

        //-----------------
        if(this.anim.SHOW_PANELS) {

            this.panel0 = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(2, 2),
                new THREE.ShaderMaterial({
                    transparent:true,
                    wireframe:false,
                    vertexShader: test_boxes_vert,
                    fragmentShader: test_boxes_frag,
                    uniforms: {
                        uBox1: {value:[0,0,0,0]},
                        uBox2: {value:[0,0,0,0]},
                        uBox3: {value:[0,0,0,0]},
                        uBox4: {value:[0,0,0,0]},
                        //projectionMatrix: { value: this.app.render.camera.projectionMatrix },
                        //modelViewMatrix: { value: new THREE.Matrix4()}
                    },
                })
            )
            this.panel0.scale.set(this.app.size.REF.width*0.5*0.2, this.app.size.REF.height*0.5*0.2, 1)
            // this.panel0.position.set(-this.app.size.REF.width*0.33, this.app.size.REF.height*0.32, 100)
            this.panel0.position.set(0, this.app.size.REF.height*0.32, 100)
            //this.panel1.scale.set(this.app.size.REF.width*0.5, this.app.size.REF.height*0.5, 1)
            //this.panel1.position.set(0, 0, 1)
            this.parent3D.add(this.panel0)
            //------------------
            this.panel1 = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(2, 2),
                new THREE.ShaderMaterial({
                    transparent:true,
                    wireframe:false,
                    vertexShader: panel_vert,
                    fragmentShader: panel_frag,
                    uniforms: {
                        // uTexture: {value: this.fluids.output.simulation.fbos.vel_1.texture}, 
                        uTexture: {value: this.fluids.output.simulation.fbos.div.texture}, 
                        projectionMatrix: { value: this.app.render.camera.projectionMatrix },
                        modelViewMatrix: { value: new THREE.Matrix4()}
                    },
                })
            )
            this.panel1.scale.set(this.app.size.REF.width*0.5*0.2*1, this.app.size.REF.height*0.5*0.2*1, 1)
            // this.panel1.position.set(-this.app.size.REF.width*0.33, this.app.size.REF.height*0.10, 100)
            this.panel1.position.set(0, this.app.size.REF.height*0.10, 100)
            this.parent3D.add(this.panel1)

            //---
            this.panel1_frame_helper = MeshUtils.get_plane(this.app.size.REF.width*0.5*0.2*1, this.app.size.REF.height*0.5*0.2*1, 0xff0000)
            this.parent3D.add(this.panel1_frame_helper)
            this.panel1_frame_helper.position.set(this.panel1.position.x, this.panel1.position.y, 120)
        }
    }

    //----------------------------------------------
    // PUBLIC:
    update_RAF(){

    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _create_cover_circle(){
        const node = document.querySelector(".canvas_cover_circles")
        // console.log("(BoxMapper._create_cover_circle): ", node);
        this.cover_circle = {
            domItem: node,
            clientRects:{},
            visible:false,
            vec4: new Float32Array([0.0, 0.0, 0.0, 0.0]),
        }
    }
    _create_boxes2(nodeList){
        //console.log("(BoxMapper._create_boxes2)!")
        this.boxes = []
        for(var i=0; i<nodeList.length; i++){
            this.boxes[i] = {
                domItem: nodeList[i],
                clientRects:{},
                visible:false,
                vec4: new Float32Array([0.0, 0.0, 0.0, 0.0]),
                uv_x1:0,
                uv_y1:0,
                uv_x2:0,
                uv_y2:0
            }
        }
        //console.log("this.boxes: ",this.boxes);
    }
    /*
    _create_boxes(){
        console.log("(BoxMapper._create_boxes)!")
        this.boxes = []
        for(var i=0; i<this.$selectors.length; i++){
            this.boxes[i] = {
                domItem: document.getElementById(this.$selectors[i]),
                clientRects:{},
                visible:false,
                vec4: new Float32Array([0.0, 0.0, 0.0, 0.0]),
                uv_x1:0,
                uv_y1:0,
                uv_x2:0,
                uv_y2:0
            }
        }
    }
    */
    _update_cover_circle(){
        //console.log("(BoxMapper._update_cover_circle): ",this.cover_circle.domItem)
        if(this.cover_circle.domItem){
            const auxArray1 = this.cover_circle.domItem.style.clipPath.split("ellipse(")
            //console.log("auxArray1: ",auxArray1);
            let w_vh = auxArray1[1].split("vh")[0]
            //console.log("w_vh: "+w_vh);
            //--
            const auxArray2 = this.cover_circle.domItem.style.transform.split("translate3d(")
            //console.log("auxArray2: ",auxArray2);
            let posY_vh = 0
            if(auxArray2.length != 1){
                posY_vh = auxArray2[1].split(", ")[1].split("vh")[0]
            }

            const uv_radius = (w_vh*0.5)/100
            //console.log("uv_radius: "+uv_radius);
            this.cover_circle.vec4[2] = uv_radius
            // console.log(this.cover_circle.vec4);
        }
    }
    _update_box(boxNum){
        const box = this.boxes[boxNum]

        //--
        
        const x_inner_margin = 4 // La dimensiones del cuadadro son unos pixeles mas estrachos (4 px por cada lado)
        const scaled_clientRects ={
        }
        scaled_clientRects.x_center = box.clientRects.x + (box.clientRects.width*0.5)
        scaled_clientRects.width = box.clientRects.width-(x_inner_margin*2)
        scaled_clientRects.x =  scaled_clientRects.x_center-(scaled_clientRects.width*0.5)
        
        //--

        //console.log("box("+boxNum+"): ",box);
        // console.log("  scaled_clientRects.x_center: "+scaled_clientRects.x_center);
        // console.log("  scaled_clientRects.width: "+scaled_clientRects.width);
        // console.log("  scaled_clientRects.x: "+scaled_clientRects.x);
        box.clientRects = box.domItem.getClientRects()[0]
        /*
        box.vec4[0] = NumberUtils.clamp(this._coordX_to_uvX(scaled_clientRects.x), 0, 1)
        box.vec4[1] = NumberUtils.clamp(this._coordY_to_uvY(box.clientRects.y+box.clientRects.height), 0, 1)
        box.vec4[2]= NumberUtils.clamp(this._coordX_to_uvX(scaled_clientRects.x+scaled_clientRects.width), 0, 1)
        box.vec4[3] = NumberUtils.clamp(this._coordY_to_uvY(box.clientRects.y), 0, 1)
        */
        
        box.vec4[0] = NumberUtils.clamp(this._coordX_to_uvX(box.clientRects.x), 0, 1)
        box.vec4[1] = NumberUtils.clamp(this._coordY_to_uvY(box.clientRects.y+box.clientRects.height), 0, 1)
        box.vec4[2]= NumberUtils.clamp(this._coordX_to_uvX(box.clientRects.x+box.clientRects.width), 0, 1)
        box.vec4[3] = NumberUtils.clamp(this._coordY_to_uvY(box.clientRects.y), 0, 1)
        
        
        box.visible = true
        if(box.vec4[2] <= 0 || box.vec4[0] >= 1){
            box.visible = false
        }
        if(box.vec4[3] <= 0 || box.vec4[1] >= 1){
            box.visible = false
        }
        if(!box.visible){
            box.vec4[0] = 0
            box.vec4[1] = 0
            box.vec4[2] = 0
            box.vec4[3] = 0
        }

        //console.log(box.visible+"  uv_x1:"+box.vec4[0]+"  uv_y1:"+box.vec4[1]+"  uv_x2:"+box.vec4[2]+"  uv_y2:"+box.vec4[3]);
    }

    _coordX_to_uvX(coordX){
        return coordX/this.app.size.CURRENT.width
    }
    _coordY_to_uvY(coordY){
        return 1-(coordY/this.app.size.CURRENT.height)
    }
    //----------------------------------------------
    // AUX:

  
}
export default BoxMapper