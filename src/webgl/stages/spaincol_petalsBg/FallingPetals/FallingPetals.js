//import gsap from "gsap"
import * as THREE from 'three'

import FakeMouse from './FakeMouse'
import Petal3D from './Petal3D'

import sim_vertex from "./_shaders/basic_vertex.glsl"
import sim_fragment from "./_shaders/sim_fragment.glsl"
import PetalPlane from './PetalPlane'

class FallingPetals{  // instanciado en: this.app.project.stage
    constructor (obj){
        console.log("(FallingPetals.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //-----------
        this.BUFFER_SIZE = {
            width: 10,
            height: 10,
        }
        this.GRAVITY = new THREE.Vector3(0, -0.01, 0)
        this.WIND = new THREE.Vector3(-0.04, -0.02, 0)
        //--
        this.NUM_PARTICLES = this.BUFFER_SIZE.width * this.BUFFER_SIZE.height
        this.DOTS_NUM = this.BUFFER_SIZE.width * this.BUFFER_SIZE.height
        // this.STAGE_SIZE = this._get_STAGE_SIZE()
        this.STAGE_SIZE = this.stage.STAGE_SIZE

        this.MOUSE_INTERSECT_POSITION = new THREE.Vector3(0, 0, 0)
        this.CAM_POSITION = this.stage.stageCamera.get_POSITION()
        this.PLANES = []
        //---------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.name = "FallingPetals3D"
        this.stage.world3D.add(this.cont3D);
        this.raycasterCont3D= new THREE.Object3D()
        this.cont3D.add(this.raycasterCont3D);
        //---------------------
        // RAYCASTER:
        this.RAYCASTER_OBJECTS = []
        this.raycaster = new THREE.Raycaster();
        const raycaster_geometry = new THREE.PlaneGeometry(1, 1);
        const raycaster_material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            // transparent: true,
            wireframe: true,
            // opacity: 0

        });
        this.raycaster_plane = new THREE.Mesh(raycaster_geometry, raycaster_material);
        this.raycaster_plane.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI*0.5);
        this.raycaster_plane.name = "raycaster_plane"
        this.app.register_helper(this.raycaster_plane)
        this.raycasterCont3D.add(this.raycaster_plane);
        //-----------
        this.ray_line_geo = new THREE.BufferGeometry().setFromPoints([this.CAM_POSITION, this.MOUSE_INTERSECT_POSITION]);
        const ray_line_mat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.ray_line = new THREE.Line(this.ray_line_geo, ray_line_mat);
        this.ray_line.name = "ray_line"
        this.app.register_helper(this.ray_line)
        this.cont3D.add(this.ray_line);
        //-----------

        //------------
        // FAKE MOUSE:
        // this.fakeMouse = new FakeMouse({
        //     app: this.app,
        //     project: this.project,
        //     stage: this.stage,
        // })
        //-----------

        //-----------
        // DOTS:
        // this._createPoints() // THIS
        // this._createPetals() // OR THIS
        this.far_plane = new PetalPlane({
            app: this.app,
            project: this.project,
            stage: this.stage,
            fallinPetals: this,
            parent3D: this.cont3D,
            raycasterCont3D: this.raycasterCont3D,
            ID: "far_plane",
            NUM_ITEMS: 50,
            COLOR: 0xf1ede5,
            PLANE_POSITION: new THREE.Vector3(0, 0, 100),
            REF_PLANE: null,
            IS_INTERACTIVE: false,
        })
        //--
        this.interactive_plane = new PetalPlane({
            app: this.app,
            project: this.project,
            stage: this.stage,
            fallinPetals: this,
            parent3D: this.cont3D,
            raycasterCont3D: this.raycasterCont3D,
            ID: "interactive_plane",
            NUM_ITEMS: 70,
            COLOR: 0xf3f0ea,
            PLANE_POSITION: new THREE.Vector3(0, 0, 0),
            REF_PLANE: this.far_plane,
            IS_INTERACTIVE: true,
        })
        this.INTERACTIVE_PLANE = this.interactive_plane
        //--
        this.close_plane = new PetalPlane({
            app: this.app,
            project: this.project,
            stage: this.stage,
            fallinPetals: this,
            parent3D: this.cont3D,
            raycasterCont3D: this.raycasterCont3D,
            ID: "close_plane",
            COLOR: 0xf6f4ef,
            NUM_ITEMS: 20,
            PLANE_POSITION: new THREE.Vector3(0, 0, -100),
            REF_PLANE: this.far_plane,
            IS_INTERACTIVE: false,
        })
        
    }
    //----------------------------------------------
    // PUBLIC:
    get_GRAVITY(){
        return this.GRAVITY
    }
    get_WIND(){
        return this.WIND
    }
    get_MOUSE_INTERSECT_SPEED(){
        // const speed = this.fakeMouse.get_SPEED()
        const speed = this.app.mouse.INERTIA
        return speed
    }
    get_MOUSE_INTERSECT_POSITION(){
        // console.log("this.MOUSE_INTERSECT_POSITION: ", this.MOUSE_INTERSECT_POSITION);
        //const position = this.fakeMouse.get_POSITION()
        const position = this.MOUSE_INTERSECT_POSITION
        return position
    }
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this._update_raycaster()
        this._update_ray_line()
        //--
        this.far_plane.update_RAF()
        this.interactive_plane.update_RAF()
        this.close_plane.update_RAF()
    }
    _update_raycaster(){
        const fov = this.stage.stageCamera.camera.fov * (Math.PI / 180); // Convert FOV to radians
        const aspect = this.app.size.CURRENT.aspect;
        const distanceFar = Math.abs(this.stage.stageCamera.holder.position.z); // Distance from camera to plane
        const heightFar = 2 * distanceFar * Math.tan(fov / 2);
        const widthFar = heightFar * aspect;
        this.raycaster_plane.scale.set(heightFar*1.2, widthFar*1.2, 1);
        //--
        this.raycaster.setFromCamera(this.app.mouse.POSITION_NORM, this.app.render.get_activeCamera())
        const intersects = this.raycaster.intersectObject(this.raycasterCont3D, true );
        // const intersects = this.raycaster.intersectObjects(this.RAYCASTER_OBJECTS, true );
        // console.log("intersects: ", intersects);
        if (intersects.length > 0) {
            // console.log("this.RAYCASTER_OBJECTS: ", this.RAYCASTER_OBJECTS);
            intersects.map((item)=>{
                if(item.object.name == "raycaster_plane"){
                    this.MOUSE_INTERSECT_POSITION.x = item.point.x
                    this.MOUSE_INTERSECT_POSITION.y = item.point.y
                    // console.log("this.MOUSE_INTERSECT_POSITION: ", this.MOUSE_INTERSECT_POSITION);
                }
            })
        }
    }
    _update_ray_line(){
        this.ray_line.geometry.setFromPoints([this.CAM_POSITION, this.MOUSE_INTERSECT_POSITION]);
        this.ray_line.geometry.attributes.position.needsUpdate = true; // Mark the geometry as needing an update
    }
    //----------------------------------------------
    // PRIVATE:

    _createPetals(){
        this.APPROACH = "planes"
        for (let i = 0; i < this.NUM_PARTICLES ; i++) {
            const item = new Petal3D({
                app: this.app,
                project: this.project,
                stage: this.stage,
                particles: this,
                parent3D: this.cont3D,
                pos: i
            })
            this.PLANES.push(item)
        }
    }



    _create_panel(panelId, size, panelPosition, rangeArray){
        const geometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1);
        const material = new THREE.ShaderMaterial({
            // wireframe: true,
            vertexShader: sim_vertex,
            fragmentShader: sim_fragment,
            uniforms: {
                uTime: { value: 0.0 },
                uTexture: { value: null },
                uValueRange: { value: rangeArray },
                // size
            },
        });
        
        this["panel_"+panelId] = new THREE.Mesh(geometry, material);
        // this["panel_"+panelId].rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);
        this["panel_"+panelId].position.copy(panelPosition);
        this.cont3D.add(this["panel_"+panelId]);
    }
    _get_STAGE_SIZE(){
        const fov = this.stage.stageCamera.camera.fov * (Math.PI / 180); // Convert FOV to radians
        const aspect = this.app.size.CURRENT.aspect;
        const distanceFar = Math.abs(this.stage.stageCamera.holder.position.z)+0; // Distance from camera to plane
        const height = 2 * distanceFar * Math.tan(fov / 2);
        const widthFar = height * aspect;
        return {
            width: widthFar,
            height: height,
        }
    }
    //----------------------------------------------
    // AUX:

  
}
export default FallingPetals