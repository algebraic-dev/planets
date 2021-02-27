class Layer{
    constructor(instance, buffer, objects = []){
        this.instance = instance;
        this.buffer = buffer;
        this.objects = objects;
    }

    add(object){
        this.objects.push(object);
    }

    remove(id){
        this.objects.splice(id,1);
    }

    render(render,ratio){
        this.instance.useBuffer(this.buffer);

        for(let i = 0; i < this.objects.length; i++){
            this.objects[i].render(render,ratio)
        } 
        if(this.buffer){
            this.instance.useBuffer(render);
            this.buffer.render(render, ratio)
        }
    }
}

export default Layer