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

        //handle noarray event
        if(!event.target.matches('#save-btn')) return;

            let form = event.target.closest('div.exp-container');
            
            let jobTitle = form.querySelector("#job-title");
            let companyName = form.querySelector("#company-name");
            let startDate = form.querySelector("#start-date");
            let endDate = form.querySelector("#end-date");
            let currentJob = form.querySelector("#current-job");
            let location = form.querySelector("#location");
            let projectItem = form.querySelector("#project-item");

            chrome.storage.local.get(["experiences"], (res)=>{ // experiences is  [{a: 1, b:2, c:3},{{a:3, b:5, c:6},{}]
                let exps = res.experiences;
                let newExp = {
                    tester: form,
                    disabled:false,
                    expId: form.dataset.index? form.dataset.index : exps?.length,
                    jobTitle: jobTitle.value,
                    companyName: companyName.value,
                    startDate: startDate.value,
                    endDate: endDate.value || null,
                    currentJob: currentJob.value,
                    location: location.value,
                    projectItem: projectItem.value
                    }

                if(!form.dataset.index){ //no index? then push and set --> event.target.dataset.index is empty
                                    
                    exps.push(newExp);  
                    disableCard(form);

                    chrome.storage.local.set({
                        experiences: exps    
                        }, ()=>{
                        test.innerText = form.getElementsByClassName("edit-field");
                        chrome.storage.local.get(["experiences"], ()=>{
                        chrome.runtime.sendMessage(newExp.expId);
                            })
                        });

                }else{ //yes index? then just set; next step, make sure that you save it with the same num
                    let indexNum = form.dataset.index;
                    
                    exps[indexNum] = newExp;
                    disableCard(form);

                    chrome.storage.local.set({
                        experiences: exps
                    }, ()=>{
                        test.innerText = form.getElementsByClassName("edit-field");
                        
                        chrome.storage.local.get(["experiences"], ()=>{
                        chrome.runtime.sendMessage({indexNum, newExp});
                        })
                    });

                };

        });
          
    };
    
    //editing record -> Done
    let editExp = function (event){
        if(!event.target.matches('#edit-btn')) return;
        let form = event.target.closest('div.exp-container');
        
        let divElms = form.getElementsByClassName("edit-field");
        for (let element =0;element<divElms.length;element++){
                divElms[element].disabled = false;    
        
            } 
    
    };

    //copying record -> wait on this one, might not be needed
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
        
        let form = event.target.closest('div.exp-container');

        //if parent container has index, then proceed with delete, else, return
        if(!form.dataset.index) {
            event.target.closest('div.exp-container').remove();


        }else{

        

        //retrieve data index of parent container of element clicked
        let currIndex = form.dataset.index;
        //use getter to retrieve data from storage.local
        chrome.storage.local.get(["experiences"], (res) =>{
            let exps = res.experiences;
        
            let cleanExps = exps.filter((e) => e.expId != currIndex);
        //reassign index numbers from 0 to n-total
            cleanExps.forEach((exp)=> exp.expId = cleanExps.indexOf(exp));

        //delete in place the element of index data-index in the array
            chrome.storage.local.set({
                experiences: cleanExps
            });
            
            
            chrome.runtime.sendMessage({exps, currIndex}); 
        });

        //do event.target.closest('div.exp-container').remove()
        event.target.closest('div.exp-container').remove();
        }

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
function createExpCard(exps){


    for(let i=0;i<exps.length;i++){
        const cardTemplate = document.getElementById('exp-template');
        const cardHTML = cardTemplate.content.cloneNode(true);
        
        let cardID = cardHTML.querySelector('#exp-container')
        let cardJobTitle = cardHTML.querySelector('#job-title');
        let cardCompanyName = cardHTML.querySelector("#company-name");
        let cardStartDate = cardHTML.querySelector("#start-date");
        let cardEndDate = cardHTML.querySelector("#end-date");
        let cardCurrentJob = cardHTML.querySelector("#current-job");
        let cardLocation = cardHTML.querySelector("#location");
        let cardProjectItem = cardHTML.querySelector("#project-item");

        cardID.dataset.index = i; 
        cardJobTitle.value = exps[i]["jobTitle"];
        cardCompanyName.value = exps[i]["companyName"];
        cardStartDate.value = exps[i]["startDate"];
        cardEndDate.value = exps[i]["endDate"];
        cardCurrentJob.value = exps[i]["currentJob"];
        cardLocation.value = exps[i]["location"];
        cardProjectItem.value = exps[i]["projectItem"];
        
        mainContainer.appendChild(cardHTML);
   
    }




    disableCard(mainContainer);
}
//renders the card for display: we will use this during initialization when we use the chrome.storage.local.get() when opening the panel

//initializing: if data exists already, retrieve and display 
chrome.storage.local.get(["experiences"], (res)=>{
    let exps=res.experiences
//Add case for array.length ===0
    
    if(!exps){
        chrome.storage.local.set({
            experiences: []
        });
    } else{
        createExpCard(exps);
    }
    
})

}); 
/*

Next: 
    1. Add content script to inject data onto forms
    2. Add "enhance with AI" -> it either creates or uses the prompt "use data A and data B to create a new card"
    3. Make sure that logic accounts for "current" checkbox

target:
    workdayjobs
    taleo
    jobvite
    greenhouse
    icims
    gusto

    make sure current job disables end-date -> listener?
*/
// get local storage data
// check if something exists
// display under template format



    /*
        Structure:
            (X) Adding experience to side panel 
            storing experience  
            (X) Experience is initialized from the stored info
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