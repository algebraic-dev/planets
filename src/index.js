import {Instance, Sprite, readShader} from './core/core.js';
import Scene from "./core/scene.js";

async function start(){
    const instance = new Instance();
    
    let vs = await readShader("sprite_vertex.glsl");
    let fs = await readShader("sprite_frag.glsl");

    let sprite = new Sprite(instance.gl, vs, fs)
    let scene = new Scene(instance);

    scene.add(sprite)

    instance.scene = scene;

    function update(){
        instance.update();
        requestAnimationFrame(update)
    }

    update()
    document.body.appendChild(instance.canvas)
}

start()