var num = 0;
class Input {
    constructor(parent) {
        this.parent = parent;
        this.canvas = parent.renderer.canvas;
        this.camera = parent.camera;

        this.num = (num++);

        this.mousePos = new Vector(0,0);
        this.prevMousePos = new Vector(0,0);
        this.worldMousePos = new Vector(0,0);

        this.mouseDown = false;
        this.mouseDownPos = undefined;

        this.z = 0;

        this.shiftKeyDown = false;
        this.modiferKeyDown = false;

        this.isDragging = false;
        this.startTapTime = undefined;
        this.setup();
    }
    setup() {
        var canvas = this.parent.renderer.canvas;
        window.addEventListener('keydown', e => {if (this === getCurrentContext().getInput())this.onKeyDown(e);}, false);
        window.addEventListener('keyup', e => {if (this === getCurrentContext().getInput())this.onKeyUp(e);}, false);
        canvas.addEventListener('click', e => this.onClick(e), false);
        canvas.addEventListener('dblclick', e => this.onDoubleClick(e), false);
        // if (browser.name !== "Firefox")
            canvas.addEventListener('wheel', e => this.onWheel(e), false);
        // else
        //     canvas.addEventListener('DOMMouseScroll', e => this.onWheel(e), false);
        canvas.addEventListener('mousedown', e => this.onMouseDown(e), false);
        canvas.addEventListener('mouseup', e => this.onMouseUp(e), false);
        canvas.addEventListener('mousemove', e => this.onMouseMove(e), false);
    }
    onKeyDown(e) {
        var code = e.keyCode;

        if (code === SHIFT_KEY)
            this.shiftKeyDown = true;
        else if (code === CONTROL_KEY || code === COMMAND_KEY)
            this.modiferKeyDown = true;

        this.parent.history.onKeyDown(code, this);
        clipboard.onKeyDown(code, this);
        currentTool.onKeyDown(code, this);
    }
    onKeyUp(e) {
        var code = e.keyCode;

        if (code === SHIFT_KEY)
            this.shiftKeyDown = false;
        else if (code === CONTROL_KEY || code === COMMAND_KEY)
            this.modiferKeyDown = false;

        currentTool.onKeyUp(code, this);
    }
    onDoubleClick(e) {
    }
    onWheel(e) {
        var delta = -e.deltaY / 120.0;

        var factor = 0.95;
        if (delta < 0)
            factor = 1 / factor;

        var worldMousePos = this.camera.getWorldPos(this.mousePos);
        this.camera.zoom *= factor;
        var newMousePos = this.camera.getScreenPos(this.worldMousePos);
        var dx = (this.mousePos.x - newMousePos.x) * this.camera.zoom;
        var dy = (this.mousePos.y - newMousePos.y) * this.camera.zoom;

        this.camera.pos.x -= dx;
        this.camera.pos.y -= dy;

        popup.onWheel();

        render();
    }
    onMouseDown(e) {
        var rect = this.canvas.getBoundingClientRect();
        this.isDragging = false;
        this.startTapTime = Date.now();
        this.mouseDown = true;
        this.mouseDownPos = new Vector(e.clientX - rect.left, e.clientY - rect.top);

        var shouldRender = false;
        shouldRender = currentTool.onMouseDown(this);
        shouldRender = icdesigner.onMouseDown(this) || shouldRender;
        if (shouldRender)
            render();
    }
    onMouseMove(e) {
        var rect = this.canvas.getBoundingClientRect();

        this.prevMousePos.x = this.mousePos.x;
        this.prevMousePos.y = this.mousePos.y;

        this.mousePos = new Vector(e.clientX - rect.left, e.clientY - rect.top);
        this.worldMousePos = this.camera.getWorldPos(this.mousePos);

        this.isDragging = (this.mouseDown && (Date.now() - this.startTapTime > 50));

        var shouldRender = false;
        shouldRender = currentTool.onMouseMove(this);
        shouldRender = icdesigner.onMouseMove(this) || shouldRender;
        if (shouldRender)
            render();
    }
    onMouseUp(e) {
        this.mouseDown = false;

        var shouldRender = false;
        shouldRender = currentTool.onMouseUp(this);
        shouldRender = icdesigner.onMouseUp(this) || shouldRender;
        if (shouldRender)
            render();
    }
    onClick(e) {
        if (this.isDragging)
            return;

        if (currentTool.onClick(this))
            render();
    }
}

var isSidebarOpen = false;

var panTool = new PanTool();
var wiringTool = new WiringTool();
var itemTool = new ItemTool();
var selectionTool = new SelectionTool();

var clipboard = new Clipboard();

var currentTool = selectionTool;


sidebar();
function sidebar() {
    isSidebarOpen = !isSidebarOpen;

    if (isSidebarOpen) {
        document.getElementById("items").style.width = "200px";
        document.getElementById("openItemsTab").style.marginLeft = "145px";
        document.getElementById("openItemsTab").style.borderColor = "rgba(153, 153, 153, 0.0)";
        document.getElementById("openItemsTab").style.backgroundColor = "rgba(200, 200, 200, 0.0)";
        document.getElementById("openItemsTab").style.fontSize = "2.5em";
        document.getElementById("openItemsTab").innerHTML = "&times;";
    } else {
        document.getElementById("items").style.width = "0";
        document.getElementById("openItemsTab").style.marginLeft = "0";
        document.getElementById("openItemsTab").style.borderColor = "rgba(153, 153, 153, 0.7)";
        document.getElementById("openItemsTab").style.backgroundColor = "rgba(200, 200, 200, 0.7)";
        document.getElementById("openItemsTab").style.fontSize = "2em";
        document.getElementById("openItemsTab").innerHTML = "&#9776;";
    }
}

var justDragged = false;

function placeItem(item, not) {
    if (not)
        item.not = not;
    itemTool.activate(item, getCurrentContext());
    if (justDragged) {
        getCurrentContext().getInput().onMouseMove(event);
        itemTool.onMouseMove(getCurrentContext().getInput())
        itemTool.onClick();
    }
    justDragged = false;
}

function onDragEnd(event) {
    justDragged = true;
    event.srcElement.parentElement.onclick();
}
