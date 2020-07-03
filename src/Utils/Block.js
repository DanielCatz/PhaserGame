class Block {
    constructor() {
        //init private variables
        this._x = 0;
        this._y = 0;
        //
        //
        //keep track of this block's previous position
        this._oldX = 0;
        this._oldY = 0;
        //
        //
        this._visible = true;
        //
        //
        //needs to be set by developer
        this._displayWidth = 0;
        this._displayHeight = 0;
        //
        //
        //an array of the children
        this.children = [];
        //current child count
        //used for indexing
        this.childIndex = -1;
        //
        //used to identify this as a Block to another Block
        this.isPosBlock = true;
    }
    set x(val) {
        //record the current x into oldX
        this._oldX = this._x;
        //
        //update the value
        this._x = val;
        //
        //update the children
        this.updatePositions();
    }
    set y(val) {
        //record the current y into oldY
        this._oldY = this._y;
        //
        //update the value
        this._y = val;
        //update the children
        this.updatePositions();
    }
    //getters
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    //add a child
    add(child) {
        //up the index
        this.childIndex++;
        //make a note of the index inside the child
        child.childIndex = this.childIndex;
        //add to the array
        this.children.push(child);
        //build the linked list
        this.buildList();
    }
    removeChild(child) {
        //take the child off the array based on index
        this.children.splice(child.childIndex, 1);
        //
        //rebuild the linked list
        this.buildList();
        //rebuild the indexes
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            this.children[i].childIndex = i;
        }
        //set the childIndex to the length of the array
        this.childIndex = len;
    }
    buildList() {
        var len = this.children.length;
        if (len > 1) {
            for (var i = 1; i < len; i++) {
                //set the current child to the previous child's nextChild property
                this.children[i - 1].nextChild = this.children[i];
            }
        }
        this.children[len - 1].nextChild = null;
    }
    get displayWidth() {
        return this._displayWidth;
    }
    get displayHeight() {
        return this._displayHeight;
    }
    setSize(w, h) {
        this._displayWidth = w;
        this._displayHeight = h;
    }
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.updatePositions();
    }
    set visible(val) {
        if (this._visible != val) {
            this._visible = val;
            if (this.children.length > 0) {
                //send the first child to the updateChildVisible function
                this.updateChildVisible(this.children[0], val);
            }
        }
    }
    get visible() {
        return this._visible;
    }
    updateChildVisible(child, vis) {
        child.visible = vis;
        if (child.isPosBlock == true) {
            child.visible = vis;
        }
        if (child.nextChild != null) {
            //if the child has a nextChild call this function recursively 
            this.updateChildVisible(child.nextChild, vis);
        }
    }
    updateChildPos(child) {
        child.y = child.y - this._oldY + this._y;
        child.x = child.x - this._oldX + this._x;
        if (child.isPosBlock == true) {
            child.updatePositions();
        }
        if (child.nextChild != null) {
            //if the child has a nextChild call this function recursively 
            this.updateChildPos(child.nextChild);
        }
        //set the old values to the new
        this._oldX = this._x;
        this._oldY = this._y;
    }
    updatePositions() {
        if (this.children.length > 0) {
            //send the first child to the updateChildPos function
            this.updateChildPos(this.children[0]);
        }
    }
    getRelPos(child) {
        return {
            x: child.x - this.x,
            y: child.y - this.y
        }
    }
     
}