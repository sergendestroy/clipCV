/* read the page and determine what form builder they are using
    get the html elements by id (look for fieldset container)
    onClick of button, assign form input field value to that of corresponding card field value
*/
console.log("hello world. I'm the content script!");


    document.addEventListener('mouseup', () => {    
        let selection = window.getSelection();
    if(selection.toString().length >0){
        let selectionText = selection.toString();
        console.log(selectionText);
        chrome.runtime.sendMessage(selectionText); 
    }
});


/*
    On select, enable "enhance" button of "expCard"
    On click of "enhance", call openAI API
        API call will pass the prompt: "given this job description, tailor the job experience"

*/

