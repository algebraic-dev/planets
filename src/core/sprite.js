import {Material} from "./material.js"
import {ref} from "./core.js"

/* 

Angle between two objects: 
y-yo=m(x-xo)
m = tan(x)

Force between two objects and the acceleration introduced to them
F = G * (m*M)/d²
F = m*a
m*a = G * (m*M)/d²
a = G*M/d²

*/

const GRAVITACIONAL_CONSTANT = 1;

class PhysicsObj{
	constructor(mass,x,y){
		this.mass = mass;
		this.x = x;
		this.y = y;
		this.vel = [0,0];
	}

	distance(other){
		return Math.sqrt((other.x - this.x)**2 + (other.y - this.y)**2);
	}

	introduceForce(other){
		let angle = Math.atan2(this.y-other.y, this.x-other.x);
		let acc = (GRAVITACIONAL_CONSTANT * other.mass)/(this.distance(other)**2)
		let forceX = Math.cos(angle) * acc;
		let forceY = Math.sin(angle) * acc;
		this.vel[0] -= forceX/10;
		this.vel[1] -= forceY/10;
	}

	moveAround(){
		this.x += this.vel[0];
		this.y += this.vel[1];
	}
}


function fromPhyArr(x, ratio){
	return x.reduce(function(acc, c){
		acc.push(c.x, c.y*ratio)
		return acc
	},[])
}

let objs = [new PhysicsObj(40, 25., 25.), new PhysicsObj(1, 7., 25.), new PhysicsObj(1, 43., 25.)];

objs[1].vel[1] = 0.5;

objs[2].vel[1] = -0.5;

function update(){
	for(let i = 0; i < objs.length; i++){
		for(let j = 0; j < objs.length; j++){
			if(i == j)continue
			objs[i].introduceForce(objs[j])
		}	
	}
	for(let j = 0; j < objs.length; j++){
		objs[j].moveAround()
	}
	requestAnimationFrame(update)
}

requestAnimationFrame(update);

// The referencial for screen size. 
// It's the used for Chiyoku's screen but can be changed.

// Creates the vertex array of a rectangle
// From two triangles.
function createRectArray(x=0, y=0, w=1, h=1){
    return new Float32Array([
        x, y,
        x+w, y,
        x, y+h,
        x, y+h,
        x+w, y,
        x+w, y+h
    ]);
}

// Reusable class that contains an image, the material and 
// some info about the image renderization.
// But in this case it's useless... i just reused
class Sprite{
	constructor(gl, vs, fs, options = {}){
		this.gl = gl;
		this.isLoaded = false;
		this.material = new Material(gl,vs,fs);
		this.setup()
	}
    
    // Setup some basic info about the sprite.
	setup(){
		let gl = this.gl;
		
		gl.useProgram(this.material.program);
		this.gl_tex = gl.createTexture();
		
		// Some parameters to the texture_2d. these settings are required to use
		// Some images from a big size.
		gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		this.tex_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
		gl.bufferData(gl.ARRAY_BUFFER, createRectArray(), gl.STATIC_DRAW);
		
		this.geo_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);

		let size = createRectArray(-1, -1, 2, 2);

		gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);

		gl.useProgram(null);
		this.isLoaded = true;		
    }
    
    render(_, ratio){
		if(this.isLoaded){
			let gl = this.gl;
			
			gl.useProgram(this.material.program);
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
			this.material.set("u_image", 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
			this.material.set("a_texCoord");
			
            gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
            this.material.set('a_position');

			this.material.set('stars[0]', fromPhyArr(objs, ratio));
			this.material.set('colors[0]', [1. , 1. , 1. , 1. , 1., 1. , 1. , 1. , 1. , 1. , 1. , 1. , 1. , 1. , 1. , 1.]);

            this.material.set('time', performance.now());

            this.material.set('resolution',ratio);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
			
			gl.useProgram(null);
		}
	}
}

export {Sprite, createRectArray}