// disable enable buttons
// json  download
const cords = [
   
];

(function(arrOfCords) {

    var choosenId;
    var bodyObj = {};
            
    let canv = document.getElementById('the-canvas');
    ctx = canv.getContext('2d');
    
    const objOfCords = arrOfCords.reduce((acc,cord) => {
        acc[cord._id] = cord;
        return acc;
    },{});

    // UI interactive Elements
    const listContainer = document.querySelector('.cords-list-section .cords-list');
    const form = document.forms['addCord'];
    const inputTitle = form.elements['title'];
    const inputBody = form.elements['body'];
    const saveButton = form.elements['save'];   
    const addButton = form.elements['add'];   
    const downloadButton = document.querySelector('#downloadJson');
    const workspace = document.querySelector('#test');

    // event listeners

    
    renderAllCords(objOfCords);
    form.addEventListener('submit',onFormSubmithandler);
    listContainer.addEventListener('click',onDeleteHandler );
    listContainer.addEventListener('click',onEditHandler );
    workspace.addEventListener('dblclick',clickingWorkspacehandler );
    workspace.addEventListener('deleting',function(){

    });
    saveButton.addEventListener('click',saveNewCord );
    downloadButton.addEventListener('click',downloadFunction);
    $(window).on('scroll',function(){
        $('p').css('font-size',(($(this).scrollTop()*.05)+14)+'px');
    });
   
    // Events

    class InputHolder {
        constructor(x,y){
            this.x = x;
            this.y = y;
            this.id = `${Math.floor(Math.random()*100000)}`;
            this.inpText = '';
            this.canva = document.createElement('canvas');
            this.ctx = this.canva.getContext('2d');
            this.coursor = new Coursor(this.x,this.y,this.id);
            this.editable = true;
            this.fontSize = 15;
            this.onKeyPress = function(e) {
                if(this.editable == false) {
                    return;
                }
                if(e.key =='Backspace') {
                    this.inpText = this.inpText.slice(0, -1);                 
                }
                else if (e.key == 'Enter') {
                    if(this.inpText ==""|| this.inpText ==" "){
                        this.editable = false;
                        this.delete();
                    }
                    else{
                        this.editable = false;
                        this.coursor.editable = false;
                        this.save();
                    }
                }
                else {
                    this.inpText += `${e.key}`;
                }
                this.render();
            }.bind(this);

            this.onDelete = function(e) {
                if(!this.editable){
                    this.delete();      
                }
                else{
                    this.editable = false;
                    this.coursor.editable = false;
                    this.delete();      

                   
                }
                       
            }.bind(this);

            this.onEdit = function(e) {
                this.editable = true;
                this.coursor.editable = true;
                this.render()
                this.save();
            }.bind(this);
        }
        
        create() {           
            // this.fontPicker();
            let fontFamily = 'Arial';                
            let id = this.id;
            this.canva.setAttribute('id','input_'+id);
            this.canva.setAttribute('tab-index','0');
            this.canva.focus();
            this.canva.setAttribute('data-editable','true');
            this.canva.width = 70;
            this.canva.height = Number(this.fontSize)+2;
            this.canva.style.position = "absolute";
            this.ctx.font = this.fontSize +"px "+fontFamily;
            this.ctx.fillStyle = 'white';
            // this.ctx.strokeStyle = 'black';        
            this.ctx.rect(0, 0, 70, this.canva.height);
            this.ctx.fillRect(0,0,70, this.canva.height);
            // this.ctx.stroke();
            this.ctx.fillStyle = 'black';
            let container = document.querySelector('#test');
            container.appendChild(this.canva);
            this.coursor.create();
            this.coursor.editable = true;
            document.addEventListener("keyup", this.onKeyPress);            
            this.canva.addEventListener('contextmenu',this.onDelete);       
            this.canva.addEventListener('click',this.onEdit);          
            this.render();
        }
        save(){
            sendCords(this.x,this.y);
            const newCord = {
                _id:this.id,
                title:this.inpText,
                body:bodyObj
            };
            objOfCords[newCord._id]= newCord ;   
            console.log(objOfCords);
            return {...newCord};
        }
      
        render(){
            this.canva.style.left = this.x+"px";
            this.canva.style.top = this.y- Number(this.fontSize)+"px";
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0,0,this.canva.width, this.canva.height);
            // this.ctx.stroke();
            this.ctx.fillStyle = 'black';
            let width =  Math.ceil(this.ctx.measureText(this.inpText).width);
            if(width > this.canva.width){
                this.canva.width = width;  
                this.ctx.canvas.width = width;
                this.ctx.font = this.fontSize +"px Arial";
                this.ctx.rect(0, 0, this.canva.width, this.canva.height);
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(0, 0, this.canva.width, this.canva.height);
                this.ctx.fillStyle = 'black';
            }
            else if(width != this.canva.width && 70 < this.canva.width){
                this.canva.width = width;  
                this.ctx.canvas.width = width;
                this.ctx.font = this.fontSize +"px Arial";
                this.ctx.rect(0, 0, this.canva.width, this.canva.height);
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(0, 0, this.canva.width, this.canva.height);
                this.ctx.fillStyle = 'black';
            }
            
            this.ctx.fillText(`${this.inpText}`,0,Number(this.fontSize),width);
            this.coursor.x = this.x + width;
        }

        delete() {
            delete(objOfCords[this.id]);
            this.canva.remove();
            let cour = document.querySelector('#coursor_'+this.id);
            cour.remove();
            console.log("deleted ")
        }
    }
    
    class Coursor{
        constructor(x,y,id){      
            this.editable = false;
            this.x = x;
            this.y = y;
            this.id = id;
            this.display = true;
            this.coursor = null;
        }
        create(){
            let id = this.id;
            this.editable = true;
            let container = document.querySelector('#test');
            this.coursor = document.createElement('canvas');
            this.coursor.setAttribute('id','coursor_'+id);
            let ctx = this.coursor.getContext('2d');
            this.coursor.width = 1.5;
            this.coursor.height = 17;
            this.coursor.style.position = "absolute";
            ctx.fillStyle = 'black';
            ctx.rect(0, 0, 2, 14);
            ctx.fillRect(0,0,2,14);
            container.appendChild(this.coursor);
            let fn =this.render.bind(this);
            setInterval(fn, 500);
        }
        render(){
            this.display = !this.display;
            this.coursor.style.left = this.x+"px";
            this.coursor.style.top = this.y-13+"px";
            this.coursor.style.position = "absolute";
            if(this.editable && this.display){
                this.coursor.style.display = 'block';
            }else{
                this.coursor.style.display = 'none';
            }
        }
    }   

    function renderAllCords(CordsList){
        if (!CordsList) {
            console.error('Empty list!');
            return;
        }
        const fragment = document.createDocumentFragment();
        Object.values(CordsList).forEach(cord => {
            const li = listItemTemplate(cord);
            fragment.appendChild(li);
        });
        listContainer.appendChild(fragment);
    }

    function listItemTemplate({_id,title,body} = {}) {
        const li = document.createElement("li");
        li.classList.add('coords-list-item');
        li.setAttribute('data-cord-id',_id);

        const span = document.createElement("span");
        span.textContent = title;
        span.style.fontWeight = "bold";

        const article = document.createElement('input');
        article.value = `x:${body.x}, y: ${body.y}`;
        article.classList.add('coordinates');

        const editBtn = document.createElement('button');
        editBtn.textContent = "Edit";
        editBtn.classList.add('edit-btn');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add('delete-btn');

        li.appendChild(span);
        li.appendChild(article);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }    

    function clickingWorkspacehandler(event){
        event = event || window.event;
        var x = event.offsetX;
        var y = event.offsetY;
        sendCords(x,y);
        var coords = "X: " + x + ", Y: " + y;
        inputBody.value = coords;
        displayOnCanva(x,y);
    }

    // Actions after clicking submit button
    function onFormSubmithandler(event) {
        event.preventDefault()
        const titleVal = inputTitle.value;
        const bodyVal = inputBody.value;
        if(!titleVal || !bodyVal) {
            alert("Enter title and tap to coordinates!");
            return;
        }
        
        const cord = createNewCord(titleVal,bodyObj)
        const listitem = listItemTemplate(cord);
        listContainer.insertAdjacentElement("afterbegin",listitem);
        form.reset();
    }

    // saving edited coordinata
    function saveNewCord(event){
        event.preventDefault;
        const titleVal = inputTitle.value;
        const bodyVal = inputBody.value;
        if(!titleVal || !bodyVal) {
            alert("Enter title and tap to coordinates!");
            return;
        }
        const cord = refreshCord(choosenId,titleVal,bodyObj);
        editInFragment(choosenId,titleVal,bodyObj);
        editMark(choosenId,titleVal,bodyObj);
        form.reset();
        addButton.disabled = false;
        saveButton.disabled = true;
    }

    // refreshing data in Object
    function refreshCord(_id,newtitle,newbody){
        const editedCord ={
            _id: _id,
            title: newtitle,
            body: newbody,
        }
        objOfCords[_id] = editedCord;
        return {...editedCord};
    }

    // creating new coordinata in object 
    function createNewCord(title,body) {
        const newCord = {
            _id:`coord-${Math.floor(Math.random()*100000)}`,
            title,
            body,
        };
        objOfCords[newCord._id]= newCord ;
        displayOnCanva(newCord._id,newCord.title,newCord.body);
        return {...newCord};
    }

    // DELETE coordinata functionality--------------------------------------
    // Confirms the deletion, if true deleting from object
    function deleteCord(id){
        const isConfirm = confirm('are you sure?');
        if(!isConfirm) return;
        delete objOfCords[id];
        return isConfirm;
    }

    // Checks for the right location of pressed delete button, and calls for the functions of deleting in the DOM and in the OBJECT
    function onDeleteHandler({ target }) {
        if(target.classList.contains('delete-btn'))  {
            const parent = target.closest('[data-cord-id]');
            const id = parent.dataset.cordId;
            console.log(id);
            const confirmed = deleteCord(id); //deleting by uniq id of fragment
            deleteMarkFromWorkspace(confirmed,id)
            deleteCordFromHtml(confirmed, parent);
        }
    }

    // saving new values after editing in DOM
    function editInFragment(_id,inputTitle,inputBody){
        let li = document.querySelector(`[data-cord-id ="${_id}"]`);
        let inp =li.querySelector('input');
        let tit = li.querySelector('span');
        inp.value = `x:${inputBody.x}, y: ${inputBody.y}`;
        tit.textContent = inputTitle;
    }

    function editMark(id,title,body){
        var x = body.x;
        var y = body.y;
        let mark = document.getElementById(`canva-${id}`);
        let mctx = mark.getContext('2d');
        mark.style.left = x+"px";
        mark.style.top = y-10+"px";
        mark.style.position = "absolute";
        mctx.clearRect(0, 0, mark.width, mark.height);
        mctx.strokeStyle = 'black';
        mctx.rect(0, 0, 50, 10);
        mctx.fillStyle = 'white';
        mctx.fillRect(0,0,50,10)
        mctx.stroke();
        mctx.fillStyle = 'black';
        mctx.fillText(title,0,10);
    }

    function onEditHandler({ target }){
        if(target.classList.contains('edit-btn'))  {
            addButton.disabled = true;
            saveButton.disabled = false;
            const choosenEl = target.closest('[data-cord-id]');
            choosenId = choosenEl.dataset.cordId;
            editCord(choosenId);
        }
    } 

    function displayOnCanva(x,y){
        let input = document.querySelector("#font-scroller");
        let fontsizee = input.value;
        let inputHolder = new InputHolder(x , y);
        inputHolder.fontSize = fontsizee;
        inputHolder.create();
    }
      
    function sendCords(x,y){
        bodyObj = {
            x:x,
            y:y,
        }
        return bodyObj;
    }  
    
    function downloadFunction(){
        var dataStr = "data:text/json;charset=utf-8,"+ encodeURIComponent(JSON.stringify(objOfCords));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",dataStr);
        dlAnchorElem.setAttribute("download", "coordinates.json");
        dlAnchorElem.click();
    }

})(cords);

function clearFunction(){
    const form = document.forms['addCord'];
    const saveButton = form.elements['save'];   
    const addButton = form.elements['add'];   
    saveButton.disabled = true;
    addButton.disabled = false;
    form.reset();
}