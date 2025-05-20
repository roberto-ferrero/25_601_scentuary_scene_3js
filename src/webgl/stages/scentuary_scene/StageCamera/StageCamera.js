import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../../core/utils/MeshUtils'

import CameraSpots from "./CameraSpots"

// import LensFlare from './LensFlare/LensFlare'

class StageCamera{
    constructor (obj){ 
        console.log("------------------- (StageCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.initialSpot = "spot0"
        //-----------------------------
        this.INITIALIZED = false
        this.BUILT = false
        //-----------------------------
        this.STATES ={}
        this.STATES.CURRENT ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            target_position: new THREE.Vector3(),
        }
        this.STATES.INITIAL ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            target_position: new THREE.Vector3(),
        }
        this.STATES.FINAL ={
            camera_position: new THREE.Vector3(),
            camera_fov: 0,
            target_position: new THREE.Vector3(),
        }
        this.CAMERA_PROGRESS = 0
        this.TARGET_PROGRESS = 0
        this.TRAVELLING = false
        //-----------------------------
        this.AZIMUTH_ARCH = [-0.01, 0.01]
        this.ELEVATION_ARCH = [-0.01, 0.02]
        //-----------------------------
        this.SPOTS = new CameraSpots({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.parent3D
        })
        //-----------------------------
        this.STATE_FROM = "camera0"
        this.STATE_TO = "camera0"
        // this.CAMERA_PROGRESS = 0
        this.TARGET_FROM = "target0"
        this.TARGET_TO = "target0"
        this.gsap_params = {
            control:0,
            fov_base: 20,
            fov_factor: 2,
            panX: 5,
            panY: 5,
            pan_azimuth_arch: [0, 0],
            pan_elevation_arch: [0, 0],
        }

        // this.TARGET_PROGRESS = 0
        this.HOLDER_REF_POSITION = new THREE.Vector3()
        this.LENSFLARE_DISTANCE = 100
        this.CURRENT_PAN_AZIMUTH = 0
        this.CURRENT_PAN_ELEVATION = 0
        //-----------------------------
        this.raycaster = new THREE.Raycaster();
        this.mouseV2 = new THREE.Vector2();
        //-----------------------------
        this.camera = new THREE.PerspectiveCamera(22, this.app.size.CURRENT.aspect, 0.1, 100);
        this.camera.name = "main_camera"
        this._create_structure()
        //-----------------------------
        // HEPLPERS:
        this.camera_helper = new THREE.CameraHelper( this.camera );
        this.parent3D.add( this.camera_helper );
        this.app.register_helper(this.camera_helper)
        //--
        
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        //console.log("(StageCamera.init)!")
        this.INITIALIZED = true
    }
    build(GLB_PROJECT){
        //console.log("(StageCamera.build)!")
        this.SPOTS.build(GLB_PROJECT)
        this.placeInSpot(this.initialSpot)
        //------------
        // this.pos_helper = MeshUtils.get_sphere(10, 10, 10, 0xff00ff)
        // this.pos_helper.position.set(0, 0, -100)
        // this.camera.add(this.pos_helper)
        //------------
        // if(this.stage.USE_LENSFLARE){
        //     this.lensFlare = new LensFlare({
        //         app:this.app,
        //         project:this.project,
        //         stage:this.stage,
        //         parent3D:this.camera,
        //         stageCamera:this,
        //         width: this.app.size.REF.width,
        //         height: this.app.size.REF.height,
        //         progress: 0,
        //         USE_MOUSE: false,
        //         X_RANGE: [-2, 2], 
        //         Y_RANGE: [0.0, -0.4], 
        //     })
        //     //--
        //     this.app.emitter.on("onAppSizeUpdate", ()=>{
        //         this._update_lensflareScale()
        //     })
        // }
        //------------
        //--
        this.BUILT = true

       
    }
    start(){

    }
    //----------------------------------------------
    get_POSITION(){
        return this.holder.position
    }
    //----------------------------------------------
    placeInSpot(spotId){
        console.log("(StageCamera.placeInSpot) spotId: ", spotId);
        this.cameraAnim?.kill()
        this.targetAnim?.kill()
        //--
        const spot = this.SPOTS.get_spot(spotId)
        this.STATES.CURRENT.camera_position.copy(spot.camera_position)
        this.STATES.CURRENT.target_position.copy(spot.target_position)
        this.STATES.CURRENT.camera_fov = spot.camera_fov
        //--
        console.log("this.STATES: ", this.STATES);
        this._drawSTATE()
    }
    travelToSpot(spotId, secs = 3, ease="power2.inOut"){
        const spot = this.SPOTS.get_spot(spotId)
        //--
        this.STATES.INITIAL.camera_position.copy(this.STATES.CURRENT.camera_position)
        this.STATES.INITIAL.target_position.copy(this.STATES.CURRENT.target_position)
        this.STATES.INITIAL.camera_fov = this.camera.fov
        //--
        this.STATES.FINAL.camera_position.copy(spot.camera_position)
        this.STATES.FINAL.target_position.copy(spot.target_position)
        this.STATES.FINAL.camera_fov = spot.camera_fov
        //--
        this.cameraAnim?.kill()
        this.CAMERA_PROGRESS = 0
        this.TRAVELLING = true
        this.cameraAnim = gsap.to(this, {
            CAMERA_PROGRESS:1,
            duration:secs,
            ease:ease,
            onUpdate:()=>{
                // this._drawSTATE()
            },
            onComplete:()=>{
                this.TRAVELLING = false
            },
        })
        // //--
        // this.targetAnim?.kill()
        // this.TARGET_PROGRESS = 0
        // this.targetAnim = gsap.to(this, {
        //     TARGET_PROGRESS:1,
        //     duration:secs*1,
        //     ease:ease,
        //     onUpdate:()=>{
        //         //this._drawSTATE()
        //     },
        // })
    }
    _drawSTATE(){
        // console.log("this.CAMERA_PROGRESS: ", this.CAMERA_PROGRESS);
        if(this.TRAVELLING){
            this.STATES.CURRENT.camera_position.lerpVectors(this.STATES.INITIAL.camera_position, this.STATES.FINAL.camera_position, this.CAMERA_PROGRESS) 
            this.STATES.CURRENT.target_position.lerpVectors(this.STATES.INITIAL.target_position, this.STATES.FINAL.target_position, this.CAMERA_PROGRESS)
            this.STATES.CURRENT.camera_fov = THREE.MathUtils.lerp(this.STATES.INITIAL.camera_fov, this.STATES.FINAL.camera_fov, this.CAMERA_PROGRESS)
        }
        const PANNED_POSITION = this._update_pan(this.STATES.CURRENT.camera_position)
        this.holder.position.copy(PANNED_POSITION)

        // this.holder.position.copy(this.STATES.CURRENT.camera_position)
        this.target.position.copy(this.STATES.CURRENT.target_position)
        this.camera.fov = this.STATES.CURRENT.camera_fov
        //--
        this._update_camera_data()
    }
    
    //----------------------------------------------

    get_position(){
        return this.holder.position
    }
    get_targetPosition(){
        return this.target.position
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        this._drawSTATE()
        // console.log("this.holder.position: ", this.holder.position);
        // this._update_positions()
        // this._update_pan()
        // this._update_camera_data()
        // if(this.lensFlare) this._update_lensFlare()
        // if(this.lensFlare) this._update_lensflareScale()
        // if(this.bgPlane) this._update_bgPlane()
        //--
        this.camera.updateProjectionMatrix();
    }
    // _update_lensflareScale(){
    //     const dimensions = this._get_planeSizeAtDistance(this.camera, this.LENSFLARE_DISTANCE)
    //     // console.log("dimensions: ", dimensions);
    //     const xscale = dimensions.width/this.app.size.REF.width
    //     const yscale = dimensions.height/this.app.size.REF.height
    //     // console.log("xscale: ", xscale, " yscale: ", yscale);
    //     this.lensFlare.cont3D.scale.set(xscale, yscale, 1)
    // }
    // _update_lensFlare(){
    //     // const distance = 1;
    //     // const cameraWorldPosition = new THREE.Vector3();
    //     // this.camera.getWorldPosition(cameraWorldPosition);
    //     // const cameraDirection = new THREE.Vector3();
    //     // this.camera.getWorldDirection(cameraDirection);

    //     // // Step 2: Calculate the new position for cont3D
    //     // const lensFlarePosition = new THREE.Vector3();
    //     // lensFlarePosition.copy(cameraWorldPosition).add(cameraDirection.multiplyScalar(distance));

    //     // // Step 3: Update cont3D's position and make it look at the camera
    //     // this.lensFlare.cont3D.position.copy(lensFlarePosition);
    //     // this.lensFlare.cont3D.lookAt(cameraWorldPosition);
    //     this.lensFlare.cont3D.position.set(0, 0, -this.LENSFLARE_DISTANCE)
    //     const lensScale = 1;
    //     this.lensFlare.cont3D.scale.set(lensScale, lensScale, lensScale);
    //     //--
    //     this.lensFlare.update_RAF()
    //     this.lensFlare.update_progress(this.CAMERA_PROGRESS)
    // }

    _update_pan(REF_POSITION){
        // console.log("this.stage.MOUSE_PAN_FACTOR_EASED.get()", this.stage.MOUSE_PAN_FACTOR_EASED.get());
        const rad180 = Math.PI*0.5

        const pan_azimuth_range = this.AZIMUTH_ARCH[1]-this.AZIMUTH_ARCH[0]
        const pan_azimuth_half = this.AZIMUTH_ARCH[0]+(pan_azimuth_range*0.5)
        const pan_azimuth_incr = (this.app.mouse.POSITION_EASED.x.get()*pan_azimuth_range)
        const pan_azimuth = pan_azimuth_half + (pan_azimuth_incr)
        this.CURRENT_PAN_AZIMUTH = pan_azimuth
        // const pan_azimuth_half = this.AZIMUTH_ARCH[1]-this.AZIMUTH_ARCH[0]
        // const pan_azimuth = this.AZIMUTH_ARCH[0] + (this.app.mouse.POSITION2_EASED.x.get()*(this.AZIMUTH_ARCH[1] - this.AZIMUTH_ARCH[0])*this.stage.MOUSE_PAN_FACTOR_EASED.get() )
        
        const pan_elevation_range = this.ELEVATION_ARCH[1]-this.ELEVATION_ARCH[0]
        const pan_elevation_half  =this.ELEVATION_ARCH[0]+(pan_elevation_range*0.5)
        // const pan_elevation_incr = (this.app.mouse.POSITION_EASED.y.get()*pan_elevation_range*this.stage.MOUSE_PAN_FACTOR_EASED.get())
        const pan_elevation_incr = (this.app.mouse.POSITION_EASED.y.get()*pan_elevation_range*1)
        const pan_elevation = pan_elevation_half + (pan_elevation_incr)
        this.CURRENT_PAN_ELEVATION = pan_elevation

        const distance = REF_POSITION.distanceTo(this.target.position)
        const holder_azimuth = -this._get_azimuth( this.target.position, REF_POSITION)
        const holder_elevation = this._get_elevation(this.target.position, REF_POSITION)
        //--
        const PANNED_POSITION = this._get_star(this.target.position, holder_azimuth+rad180+pan_azimuth, holder_elevation+pan_elevation, distance)
        return PANNED_POSITION
        // console.log("PANNED_POSITION: ", PANNED_POSITION);
        //this.holder.position.copy(this._get_star(this.target.position, holder_azimuth+rad180+pan_azimuth, holder_elevation+pan_elevation, distance))
        // console.log("this.holder.position: ", this.holder.position);
    }

    _update_bgPlane(){
        // const fov = this.camera.fov * (Math.PI / 180); // Convert FOV to radians
        // const distance = Math.abs(this.bgPlane.position.z); // Distance from camera to plane
        // const aspect = this.app.size.CURRENT.aspect;
        
        // const height = 2 * distance * Math.tan(fov / 2);
        // const width = height * aspect;
        // this.bgPlane.scale.set(height, width, 1);
        // //--
        // const cameraWorldPosition = new THREE.Vector3();
        // this.camera.getWorldPosition(cameraWorldPosition);
        // console.log("cameraWorldPosition: ", cameraWorldPosition);
        // //--
        // this.mouseV2.x = this.app.mouse.POSITION_NORM.x
        // this.mouseV2.y = this.app.mouse.POSITION_NORM.y
        // this.raycaster.setFromCamera(this.mouseV2, this.camera)
        // this.intersects = this.raycaster.intersectObjects(this.holder);
        // console.log("intersects: ", this.intersects);
    }
    //----------------------------------------------
    // PRIVATE:
    _create_structure(){
        this.holder = new THREE.Object3D()
        this.parent3D.add(this.holder)
        this.holder.add(this.camera)
        //---------
        this.holder_helper = MeshUtils.get_box(0.2, 0.2, 0.2, 0xffff00)
        this.holder_helper.name = "holder_helper"
        this.app.register_helper(this.holder_helper)
        this.holder.add(this.holder_helper)


        // this.holder.position.set(0, 20, 300)
        //this.holder.position.set(-87, 126, -392)
        // x: -87.54139709472656, y: 126.45600128173828, z: -392.69500732421875
        // this.parent3D.add(this.holder)
        // //--
        // this.looker = new THREE.Object3D()
        // this.holder.add(this.looker)
        // //--
        // this.panX = new THREE.Object3D()
        // this.looker.add(this.panX)
        // //--
        // this.panY = new THREE.Object3D()
        // this.panX.add(this.panY)
        // //--
        // this.panY.add(this.camera)
        //----------
        //----------
        // this.planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        // this.planeMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x0000ff,
        //     wireframe: true,
        //     side: THREE.DoubleSide
        // });
        // this.bgPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        // this.bgPlane.position.set(0, 0, -250)
        // this.bgPlane.rotation.z = Math.PI / 2; // Rotate to make it vertical
        // this.camera.add(this.bgPlane);
        //----------
        //----------
        this.target = new THREE.Object3D()
        this.parent3D.add(this.target)
        //---------
        this.target_helper = MeshUtils.get_box(0.2, 0.2, 0.2, 0xffff00)
        this.target_helper.name = "target_helper"
        this.app.register_helper(this.target_helper)
        this.target.add(this.target_helper)

        

        // if(this.app.dev_helpers){
        //     this.holder_test = MeshUtils.get_sphere(0.5, 10, 10, 0xffff00)
        //     this.holder.add(this.holder_test)
        //     this.app.dev.register_helper(this.holder_test)
        //     //--
        //     this.camera_helper = new THREE.CameraHelper( this.camera );
        //     this.parent3D.add( this.camera_helper );
        //     this.app.dev.register_helper(this.camera_helper)
        //     //--
        //     // --
        //     // --
        //     this.holder_helper = MeshUtils.get_box(2, 2, 2, 0xff0000)
        //     this.holder.add(this.holder_helper)
        //     this.app.dev.register_helper(this.holder_helper)
        //     // --
        //     this.panX_helper = MeshUtils.get_box(1, 2, 1, 0xff0000)
        //     this.panX.add(this.panX_helper)
        //     this.app.dev.register_helper(this.panX_helper)
        //     // --
        //     this.panY_helper = MeshUtils.get_box(1, 1, 1, 0xff0000)
        //     this.panY.add(this.panY_helper)
        //     this.app.dev.register_helper(this.panY_helper)
        //     // --
        //     this.target_helper = MeshUtils.get_box(1, 1, 1, 0x0000ff)
        //     this.target.add(this.target_helper)
        //     this.app.dev.register_helper(this.target_helper)
            
        // }
        this._update_camera_data()
    }
    _update_camera_data(){
        ////console.log("this.camera.rotation: ", this.camera.rotation);
        this.camera.lookAt(this.target.position)
        this.camera.aspect = (this.app.size.CURRENT.width)/this.app.size.CURRENT.height
        this.camera.updateProjectionMatrix();
        if(this.camera_helper) this.camera_helper.update()
    }

    _get_star(_observer, _azimuthX, _elevationY, _distance) {
        /**
         * Calculates the position of a star given an observer's position, azimuth, elevation, and distance.
         * 
         * @param {THREE.Vector3} _observer - The position of the observer.
         * @param {number} _azimuthX - Azimuth angle in radians (rotation around the Y-axis).
         * @param {number} _elevationY - Elevation angle in radians (angle above the XZ-plane).
         * @param {number} _distance - Distance to the star.
         * @returns {THREE.Vector3} The position of the star as a THREE.Vector3.
         */
        // Calculate the position of the star relative to the origin
        const x = _distance * Math.cos(_elevationY) * Math.sin(_azimuthX);
        const y = _distance * Math.sin(_elevationY);
        const z = _distance * Math.cos(_elevationY) * Math.cos(_azimuthX);

        // Create a Vector3 for the star's position relative to the observer
        const starPosition = new THREE.Vector3(x, y, z);

        // Add the observer's position to the star's relative position
        return starPosition.add(_observer);
    }

    _get_azimuth(_center, _position) {
        /**
         * Calculate the azimuth angle (in radians) between a center point and a position in 3D space
         * relative to the x-z reference plane.
         * 
         * @param {THREE.Vector3} _center - The center point in 3D space (THREE.Vector3).
         * @param {THREE.Vector3} _position - The position point in 3D space (THREE.Vector3).
         * @returns {number} - The azimuth angle in radians.
         */
        // Calculate the vector from the center to the position
        const direction = new THREE.Vector3().subVectors(_position, _center);
        
        // Project the direction vector onto the x-z plane
        direction.y = 0;

        // Normalize the direction vector
        direction.normalize();

        // Calculate the azimuth angle
        // atan2 gives the angle in the range [-π, π]
        const azimuth = Math.atan2(direction.z, direction.x);

        // Return the azimuth angle in radians
        return azimuth;
    }
    _get_elevation(_center, _position) {
        /**
         * Calculate the elevation angle (in radians) between a center point and a position in 3D space
         * relative to the x-z reference plane.
         * 
         * @param {THREE.Vector3} _center - The center point in 3D space (THREE.Vector3).
         * @param {THREE.Vector3} _position - The position point in 3D space (THREE.Vector3).
         * @returns {number} - The elevation angle in radians.
         */
        // Calculate the vector from the center to the position
        const direction = new THREE.Vector3().subVectors(_position, _center);
        
        // Calculate the magnitude of the projection onto the x-z plane
        const projectedLength = Math.sqrt(direction.x ** 2 + direction.z ** 2);
        
        // Calculate the elevation angle
        // atan2 gives the angle in the range [-π/2, π/2]
        const elevation = Math.atan2(direction.y, projectedLength);

        // Return the elevation angle in radians
        return elevation;
    }
    _get_planeSizeAtDistance(camera, distance) {
        // Vertical field of view in radians
        const vFov = THREE.MathUtils.degToRad(camera.fov);
    
        // Height of the viewport at the given distance
        const height = 2 * Math.tan(vFov / 2) * distance;
    
        // Width is determined by the aspect ratio
        const width = height * camera.aspect;
    
        return { width, height };
    }
    //----------------------------------------------
    // AUX:

  
}
export default StageCamera