/*https://www.flaticon.com/free-icon/resume-and-cv_5941708 <-Arafat Uddin*/

chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch((error)=> console.log(error));

  
chrome.runtime.onMessage.addListener( (msg) =>{
    if (!msg) return;
    console.log(`message sent: ${msg}`);
    }
)



//initialize an empty data dictionary
/*
chrome.storage.local.get("experiences",(res) =>{
    console.log(res.experiences)
    chrome.storage.local.set({
        experiences: typeof(res.experiences) ==="Array"? res.experiences:[]
    })
})
*/
