// validation of uploaded files format and saving to local storage logic and send to backend


let validationForm = document.getElementById('fileUploader');


function Validate(){
    let isExcel = file.type.match('xlsx.*');
    let isPdf = file.type.match('pdf.*');
    if(!isExcel||!isPdf){
        alert('Please upload files in correct file formats');;
        return;
    }
    else{

        // func();
    }

}