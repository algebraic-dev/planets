

// Compiles a script into a shader and returns
// the object 
function getShader(gl, script, type){
    var output = gl.createShader(type);
    gl.shaderSource(output, script);
    gl.compileShader(output);
    
    if(!gl.getShaderParameter(output, gl.COMPILE_STATUS)){
        console.error("Shader error: \n:" + gl.getShaderInfoLog(output));
        return null;
    } 
    return output;
}

// Material class contains a program and all the parameters
// of the shaders. 
class Material {
    constructor(gl, vs, fs){
        this.gl = gl;
        
		let vsShader = getShader(this.gl, vs, gl.VERTEX_SHADER);
        let fsShader = getShader(this.gl, fs, gl.FRAGMENT_SHADER);
        
        if(vsShader && fsShader){
			// A program is a entire pipeline that is created when
			// Compiling two shaders together.
			this.program = gl.createProgram();
			gl.attachShader(this.program, vsShader);
			gl.attachShader(this.program, fsShader);
			gl.linkProgram(this.program);
			
			if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
				console.error("Cannot load shader \n"+gl.getProgramInfoLog(this.program));
				return null;
			}
			
			this.gatherParameters();
			console.log(this.parameters);
			// We already have the proram so we dont need the shaders anymore.
			gl.detachShader(this.program, vsShader);
			gl.detachShader(this.program, fsShader);
			gl.deleteShader(vsShader);
			gl.deleteShader(fsShader);
			
			gl.useProgram(null);
		}
    }

	// We have to get all the parameters from the program and all the information
	// about the location of them to send and receive things from the shader.
    gatherParameters(){
		let gl = this.gl;
		let isUniform = 0;
		this.parameters = {};
		while(isUniform < 2){
			let paramType = isUniform ? gl.ACTIVE_UNIFORMS : gl.ACTIVE_ATTRIBUTES;
			let count = gl.getProgramParameter(this.program, paramType);
			for(let i=0; i < count; i++){
				let details;
				let location;
				if(isUniform){
					details = gl.getActiveUniform(this.program, i);
					location = gl.getUniformLocation(this.program, details.name);
				} else {
					details = gl.getActiveAttrib(this.program, i);
					location = gl.getAttribLocation(this.program, details.name);
				}
				
				this.parameters[details.name] = {
					location : location,
					uniform : !!isUniform,
					type : details.type
				}
			}
			isUniform++;
		}
    }
	
	// Here we can set all the parameters in the shaders.. it's used for making it easier
	// In future stages.
	set(name, ...args){
		let gl = this.gl;
		if(name in this.parameters){
			let param = this.parameters[name];
			if(param.uniform){
				
				switch(param.type){
					case gl.FLOAT: gl.uniform1f(param.location, ...args); break;
					case gl.FLOAT_VEC2: gl.uniform2fv(param.location, ...args); break;
					case gl.FLOAT_VEC3: gl.uniform3fv(param.location, ...args); break;
					case gl.FLOAT_VEC4: {
						gl.uniform4fv(param.location, ...args); break;
					}
					case gl.FLOAT_MAT3: gl.uniformMatrix3fv(param.location, false, ...args); break;
					case gl.FLOAT_MAT4: gl.uniformMatrix4fv(param.location, false, ...args); break;
					case gl.SAMPLER_2D: gl.uniform1i(param.location, ...args); break;
				}
			} else {
				gl.enableVertexAttribArray(param.location);
				if(args[0] == undefined) args[0] = gl.FLOAT;
				if(args[1] == undefined) args[1] = false;
				if(args[2] == undefined) args[2] = 0;
				if(args[3] == undefined) args[3] = 0;
				switch(param.type){
					case gl.FLOAT : gl.vertexAttribPointer(param.location, 1, ...args); break;
					case gl.FLOAT_VEC2 : gl.vertexAttribPointer(param.location, 2, ...args); break;
					case gl.FLOAT_VEC3 : gl.vertexAttribPointer(param.location, 3, ...args); break;
					case gl.FLOAT_VEC4 : gl.vertexAttribPointer(param.location, 4, ...args); break;
				}
			}
		}
	}
}

export {Material}