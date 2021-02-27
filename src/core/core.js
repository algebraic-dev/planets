import {Material} from "./material.js"
import {Sprite} from "./sprite.js"

let ref = [1366/2,680/2]

// This contains the canvas, context of the canvas and all the things
// required to a good abstraction of webgl2
function readShader(shader){
    return new Promise((response, reject) => {
        fetch('./shaders/' + shader)
        .then((res) => res.text())
        .then((res) => response(res))
        .catch(reject)
    })
}

class Instance {
    constructor(resize = true){
        this.canvas = document.createElement("canvas");
        this.gl = this.canvas.getContext("webgl2");
        this.toResize = []
        this.scene = undefined;

        if (resize){    
            window.addEventListener("resize", () => {this.resize()})
            this.resize();
        }    
    }

    useBuffer(buffer){
        let gl = this.gl;
        gl.viewport(0,0, this.canvas.width, this.canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    resize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ratio = window.innerHeight/window.innerWidth;
        for(let i = 0; i < this.toResize.length; i++){
            this.toResize[i].resize(this.canvas.width, this.canvas.height);
        }
    }

    update(){
        this.gl.viewport(0,0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.7,0.9,1.0,1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        if(this.scene)this.scene.render(null,this.ratio);
        this.gl.flush();
    }
}

export {Instance, Material, Sprite, readShader, ref};