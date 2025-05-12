import gsap from "gsap"
import * as THREE from 'three'

import MeshUtils from "../../../core/utils/MeshUtils"

class FakeMouse{
    constructor (obj){
        // console.log("(FakeMouse.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //-------
        this.ORIGIN = new THREE.Vector3(0, 0, 0)
        this.OFF_POSITION = new THREE.Vector3(500, 500, 0)
        this.POSITION = new THREE.Vector3(0, 0, 0)
        this.PREV_POSITION = new THREE.Vector3(0, 0, 0)
        this.DELTA_X = 0
        this.DELTA_Y = 0
        this.ARRAY_SPEED = [0, 0, 0, 0, 0]
        this.ARRAY_SPEED_POS = 0
        this.ARRAY_SPEED_LENGHT = 5
        this.SPEED = 0
        this.RESET_DISTANCE = 100
        this.REF_TIME = 0
        this.FILTRED_TIME = 0
        this.ACTIVE = false
        this.RESTART_PROGRESS = 0
        //-------
        this.LIFE_TIME = 0
        this.FAKE_SPEED = 0
        //-------
        this.sphere_dev = MeshUtils.get_sphere(2, 10, 10, 0x00ff00)
        this.app.register_helper(this.sphere_dev)
        this.stage.pivotPlane3D.add(this.sphere_dev)
        ///------------------
        // this.speed_gui_dev = this.app.dev.gui.add(this, 'FAKE_SPEED', 0, 2, 0.01).name('SPEED');
        //-------------------
        this.app.emitter.on("onIntroProgressComplete", ()=>{
            this.REF_TIME = this.app.ELAPSED_TIME  // Reset the elapsed time
            this.ACTIVE = true
        })

    }
    //----------------------------------------------
    // PUBLIC:
    get_SPEED(){
        // console.log("this.SPEED: ", this.SPEED);
        return this.FAKE_SPEED
    }
    get_POSITION(){
        // console.log("this.POSITION: ", this.POSITION);
        this.ACTIVE = true
        return this.POSITION
    }
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        if(this.ACTIVE){
            this.FILTRED_TIME = (this.app.ELAPSED_TIME - this.REF_TIME)*0.6
            const newPosition = this._getSpiralPosition(this.FILTRED_TIME, 1, 10, 2)
            const distanceToOrigin = this.ORIGIN.distanceTo(newPosition)
            // console.log("distanceToOrigin", distanceToOrigin);
            // console.log("this.FILTRED_TIME", this.FILTRED_TIME);
            if (distanceToOrigin > this.RESET_DISTANCE) {
                console.log("--------------------------------------");
                if(this.ACTIVE){
                    // this.POSITION.copy(this.OFF_POSITION)
                    this.ACTIVE = false
                    // this.FAKE_SPEED = 0
                    // this.POSITION = new THREE.Vector3(0, 0, 0)
                    // this.ARRAY_SPEED = [0, 0, 0, 0, 0]
                    // this.REF_TIME = this.app.ELAPSED_TIME  // Reset the elapsed time
                    // //--
                    gsap.delayedCall(2, () => {
                        this._restart2()
                    })
                }
            }else{
                this.POSITION.copy(newPosition)
            }
            //--
            this.DELTA_X = this.POSITION.x - this.PREV_POSITION.x
            this.DELTA_Y = this.POSITION.y - this.PREV_POSITION.y

            this.LIFE_TIME = this.app.ELAPSED_TIME - this.REF_TIME
            this.LIFE_TIME_FACTOR = this.LIFE_TIME/10
            // console.log("this.LIFE_TIME_FACTOR", this.LIFE_TIME_FACTOR);


            let newSpeedValue = this.POSITION.distanceTo(this.PREV_POSITION)
            if(newSpeedValue > 10){
                newSpeedValue = 0
             }else if(newSpeedValue> 1){
                newSpeedValue = 1
             }
            
            this.ARRAY_SPEED[this.ARRAY_SPEED_POS] = newSpeedValue
            this.ARRAY_SPEED_POS++
            if(this.ARRAY_SPEED_POS >= this.ARRAY_SPEED_LENGHT){
                this.ARRAY_SPEED_POS = 0
            }
            this.SPEED = this.__calculateAverage(this.ARRAY_SPEED)

            if(this.FAKE_SPEED <0.45){
                this.FAKE_SPEED += 0.001
            }

            // console.log("this.ARRAY_SPEED", this.ARRAY_SPEED);

            this.PREV_POSITION.copy(this.POSITION)
            // console.log("this.SPEED", this.SPEED);
            // console.log("this.POSITION", this.POSITION);
            this.sphere_dev.position.copy(this.POSITION)
        }
        // this.app.dev.gui.updateDisplay();
    }

    //----------------------------------------------
    // PRIVATE:
    _restart2(){
        console.log("(FakeMouse._restart2)!!");
        this.app.emitter.emit("onFakeMouseRestart", {})
        gsap.to(this, {
            duration: 2,
            RESTART_PROGRESS: 1,
            onComplete: () => {
                this.app.emitter.emit("onFakeMouseRestartEnd", {})
                this._restart()
            }
        })
    }
    _restart(){
        console.log("restart!");
        this.RESTART_PROGRESS = 0
        this.FAKE_SPEED = 0
        this.ARRAY_SPEED = [0, 0, 0, 0, 0]
        this.ACTIVE = true
        this.REF_TIME = this.app.ELAPSED_TIME  // Reset the elapsed time
        
        
    }
    
    // _getSpiralPosition(elapsedTime, a = 0, b = 1, angleMultiplier = 1) {
    //     // Damping constants — tweak for your needs
    //     const dampingRadius = 0.2;      // slows down outward movement
    //     const dampingAngle = 0.05;      // slows down rotation speed
        
    //     // Radius grows but flattens over time
    //     const radius = a + b * (1 - Math.exp(-dampingRadius * elapsedTime));

    //     // Angle increases more slowly over time
    //     const dampedTime = (1 - Math.exp(-dampingAngle * elapsedTime)) * elapsedTime;
    //     const angle = angleMultiplier * dampedTime;
        
    //     const x = radius * Math.cos(angle);
    //     const y = radius * Math.sin(angle);
        
    //     return new THREE.Vector3(x, y, 0);
    // }
    
    _getSpiralPosition(elapsedTime, a = 0, b = 1, angleMultiplier = 1) {
        // Calculate the angle using elapsedTime.
        // Adjust the multiplier to speed up or slow down the spiral rotation.
        const maxRadius = 200

        const theta = angleMultiplier * elapsedTime;
        
        // Calculate the radius.
        const radius = a + b * elapsedTime;
        
        // Convert polar coordinates (radius, theta) to Cartesian coordinates (x, y).
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        
        return new THREE.Vector3(x, y, 0);
      }
    //----------------------------------------------
    // AUX:
    __calculateAverage(array) {
        if (array.length === 0) return 0; // Avoid division by zero
        const sum = array.reduce((acc, num) => acc + num, 0);
        return sum / array.length;
    }

  
}
export default FakeMouse