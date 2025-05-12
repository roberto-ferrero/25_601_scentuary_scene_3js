import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger';
//import * as THREE from 'three'

import WebGLApp from './webgl/core/app/WebGLApp';
import ScentuaryProject from "./webgl/projects/ScentuaryProject/ScentuaryProject";

gsap.registerPlugin(ScrollTrigger);

class Platform{
    constructor (obj){
        console.log("(Platform.CONSTRUCTORA): ", obj)
        //--
        const $webglContainer = document.querySelector('#webgl_app')
        const $mouseEvents = document.querySelector('#webgl_app')

        this.webglApp = new WebGLApp({
            id:"lighthouse_app",
            $container: $webglContainer,
            $mouseEvents: $mouseEvents,
            loader_pathPrefix:"./",
            //--
            project: new ScentuaryProject({id:"strategy_project"}),  
            data: this.__get_init_data(),


            render_background_alpha: 1,
            render_background_color: 0xede8de,
            // render_useWebGL2:true,

            // size_overwrite_REF: false,
            // size_use_window_inner: false, // USEFUL WHEN CONTAINES IS HIDDEN AND W AND H RETURNS 0
            // size_internal_event: false,   // Indicates if app creates it own window.resize event.

            // scroll_1_active:true,
            // scroll_2_active:false,

            mouse_active: true,

            // socket_active: false,
            // socket_component:null,

            dev_active: true,        // Indicates if AppDev is instantiated
            dev_gui: true,             // Indicates if dat.gui is created (only if dev_active=true)
            dev_helpers: true,      // Indicates if helpers are instantiated  (only if dev_active=true) (false in prod)

            auto_active: true,
            // auto_init: true

            scrolls: ["scroll_main"],
            stand_alone: true, // If component is not part of a final repo
            use_render_plane: false, // Indicates if a render plane in project class is used. If false it render using app.render.renderer and app.scene

        })
        gsap.delayedCall(1, ()=>{
            this.init_scrollTriger()
        })

    }
    //----------------------------------------------
    // PUBLIC:
    init_scrollTriger(){
        console.log("(Platform.init_scrollTriger)!");
        //--
        this.scroll_main = ScrollTrigger.create({
            trigger: document.querySelector('#content'),
            start: 'top top',
            end: 'bottom bottom',
            markers: false,
            onUpdate: (self) => {   
                // console.log("+");
                const progress = self.progress
                const offesetY = (self.end - self.start) * self.progress
                this.webglApp.update_scrollProgress("scroll_main", progress, offesetY);
            }
        });
        
        window.addEventListener('resize', ()=>{ 
            this.webglApp.resize(this.__get_resize_data())
        })

        window.addEventListener('wheel', ()=>{
            // Your logic here
            // You can use event.deltaY to determine the scroll direction and speed
        
            // Example: Trigger some GSAP animation based on the wheel movement
            if(event.deltaY > 0) {
                // Scrolling down
                this.webglApp.emitter.emit("onMouseWheelDown")
                // this.webglApp.emitter.emit("onMouseWheel_down")
            } else {
                // Scrolling up
                this.webglApp.emitter.emit("onMouseWheelUp")
                // this.webglApp.emitter.emit("onMouseWheel_up")
            }
        });
        
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
    
    __get_init_data(){
        const obj = {
            mobileMode:this.__get_mobileMode(),
            iOS:this.__get_iOS(),
            items:[

            ]
        }
        return obj
    }

    __get_resize_data(){
        const obj = {
            mobileMode:this.__get_mobileMode(),
            iOS:this.__get_iOS(),
            items:[

            ]
        }
        return obj
    }

    __get_mobileMode(){
        const width = document.querySelector('#webgl_app').offsetWidth
        const breakpoint = 750
        let mobileMode = false
        if(width <= breakpoint){
            mobileMode = true
        }
        return mobileMode
    }

    __get_iOS() {
        return [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      }
  
}
export default Platform