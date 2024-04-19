document.addEventListener("DOMContentLoaded",function (){

    const mainContainer = document.getElementById('main-container');

    const expTemplate = document.getElementById('exp-template');

    const test = document.getElementById('test-div');

    const addMoreBtn = document.getElementById('add-more-btn');
 
    let disableCard = function(cardElmnts){
        //TODO: make the input the elementbyclassname list, so delegate that to the scope where the fcn is called
        let divElms = cardElmnts.getElementsByClassName("edit-field");
        for (let element =0;element<divElms.length;element++){
                divElms[element].disabled = true;    
                test.innerText = divElms[element];  
        }};
    //saving record
    let saveExp = function (event){
        //event.preventDefault();
        //test.innerText = event.target.closest('div')
        //handle edit events: if the saved click came from an existing record, 

        if(!event.target.matches('#save-btn')) return;
        //validate further
        //handle showing disabled form
        //set the data

        const form = event.target.closest('div.exp-container');
        
        let jobTitle = form.querySelector("#job-title");
        let companyName = form.querySelector("#company-name");
        let startDate = form.querySelector("#start-date");
        let endDate = form.querySelector("#end-date");
        let currentJob = form.querySelector("#current-job");
        let location = form.querySelector("#location");
        let projectItem = form.querySelector("#project-item");
        
        chrome.storage.local.get(["experiences"], (res)=>{
            let exps = res.experiences;
    
            let newExp = {
                tester: form,
                expNumber: exps.length,
                disabled:false,
                jobTitle: jobTitle.value,
                companyName: companyName.value,
                startDate: startDate.value,
                endDate: endDate.value || null,
                currentJob: currentJob.value,
                location: location.value,
                projectItem: projectItem.value
            }

            exps.push(newExp);

            disableCard(form);

            chrome.storage.local.set({
                experiences: exps
                
            }, ()=>{
                test.innerText = form.getElementsByClassName("edit-field");
                chrome.storage.local.get(["experiences"], ()=>{
                    chrome.runtime.sendMessage(form);

                })
            })

        })
        
    };
    
    //editing record
    let editExp = function (event){
        if(!event.target.matches('#edit-btn')) return;
        const form = event.target.closest('div.exp-container');
        
        let divElms = form.getElementsByClassName("edit-field");
        for (let element =0;element<divElms.length;element++){
                divElms[element].disabled = false;    
              //make sure that when saving you edit the current record  
        
            }
        
    
    
    };

    //copying record
    let copyExp = function (event) {
        if(!event.target.elements['copy-btn']) return;
        //selects the card info: let's retrieve as a dictionary
        const form = event.target;
        
        let cardNo = form.elements["expNumber"]

        chrome.storage.local.get(["experiences"], (res)=>{
            let copyText = res.experiences[cardNo]
            //finish using the following offscreen sltn https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/functional-samples/cookbook.offscreen-clipboard-write
            //https://stackoverflow.com/questions/71321983/copy-to-clipboard-in-chrome-extension-v3/71336017#71336017
        }) 

    }
    
    //deleting record
    let delExp = function (event) {
        if(!event.target.matches('#delete-btn')) return;
        
        event.target.closest('div.exp-container').remove();
        chrome.runtime.sendMessage(event.target);
        //event.target.closest('div.exp-form').remove();
    };
    
    addMoreBtn.addEventListener("click",  () => {
        const expHTML = expTemplate.content.cloneNode(true);
        mainContainer.appendChild(expHTML);
        
    });

    mainContainer.addEventListener('click', (event) =>{    
        saveExp(event);
        delExp(event);
        editExp(event);
    });


//creates the ExpCard from the template
function createExpCard(jobTitle, companyName, startDate, endDate, currentJob, location, projectItem){
    const cardTemplate = document.getElementById('exp-template');
    const cardHTML = cardTemplate.content.cloneNode(true);
    
    let cardJobTitle = cardHTML.querySelector('#job-title');
    let cardCompanyName = cardHTML.querySelector("#company-name");
    let cardStartDate = cardHTML.querySelector("#start-date");
    let cardEndDate = cardHTML.querySelector("#end-date");
    let cardCurrentJob = cardHTML.querySelector("#current-job");
    let cardLocation = cardHTML.querySelector("#location");
    let cardProjectItem = cardHTML.querySelector("#project-item");

    cardJobTitle.value = jobTitle;
    cardCompanyName.value = companyName;
    cardStartDate.value = startDate;
    cardEndDate.value = endDate;
    cardCurrentJob.value = currentJob;
    cardLocation.value = location;
    cardProjectItem.value = projectItem;

    mainContainer.appendChild(cardHTML);

    disableCard(mainContainer);
}
//renders the card for display: we will use this during initialization when we use the chrome.storage.local.get() when opening the panel

//initializing: if data exists already, retrieve and display 
chrome.storage.local.get(["experiences"], (res)=>{
    let exps=res.experiences
//Add case for array.length ===0
    for(let i=0;i<exps.length;i++){
            
        createExpCard(
            exps[i]["jobTitle"],
            exps[i]["companyName"],
            exps[i]["startDate"],
            exps[i]["endDate"],
            exps[i]["currentJob"],
            exps[i]["location"],
            exps[i]["projectItem"] )
        
    }
    
})

}); 
/*
target:
    workdayjobs
    taleo
    jobvite
    greenhouse
    icims
    gusto



    use event delegation to the "eperience-container-div"
*/
// get local storage data
// check if something exists
// display under template format



    /*
        Structure:
            (x) Adding experience to side panel 
            storing experience  
            Experience is initialized from the stored info
            Injecting javascript to workaday


        project template button adds project item through add-item button
            need to wait when initializing since project template does not exist yet

        addMoreBtn.addEventListener("click", ()=>{
        const expHTML = expTemplate.content.cloneNode(true);
        mainContainer.appendChild(expHTML);

        const proTemplate = expHTML.getElementById('project-template');
        const addProItem = expHTML.getElementById('add-project-item-btn');

        addProItem.addEventListener("click", ()=>{
            const projectHTML = proTemplate.content.cloneNode(true);
            const projectContainer = expHTML.querySelector('#project-container');

            projectContainer.appendChild(projectHTML);
    
        });
         
    });
    */