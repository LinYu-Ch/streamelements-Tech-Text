//Widget by @AverageCaret 
//Created 01/23/2023



//set up initial variables
let userLocale = "en-US",
    includeFollowers = true,
    includeRaids = true,
    minRaid = 0,
    includeSubs = true,
    includeTips = true,
    minTip = 0,
    includeCheers = true,
    minCheer = 0;

let userCurrency;



//listen for new events
window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    const listener = obj.detail.listener.split("-")[0];
	const event = obj.detail.event;
//I changed the params addEvent() takes in so it takes in (initial message, name of sender, thank you message)
    if (listener === 'follower') {
        if (includeFollowers) {
            addEvent('followed', event.name, msgFollow);
        }
      return;
    } 
 //there are multiple subscriber events so you have to sort through each one of them from most
 //easily identifiable to least easily identifiable 
  	if (listener === 'subscriber') {
        if (includeSubs) {
          
          	if (event.isCommunityGift) return;
          
             if (event.bulkGifted) {
                addEvent(`gifted ${event.amount} subs`, event.name, msgBulkGiftSub);
            } else if (event.gifted) {
                addEvent(`gifted a sub`, event.name, msgGiftSub);
            } else if (event.amount > 1) {
            	addEvent(`resubscribed for ${event.amount} months`, event.name, msgReSub);
            } else {
            	addEvent(`subscribed`, event.name, msgSub);
            }
        }
      return;
    } 
  
  	if (listener === 'cheer') {
        if (includeCheers && minCheer <= event.amount) {
            addEvent(`has cheer'd with ${event.amount.toLocaleString()} Bits`, event.name, msgCheer);
        }
      return;
    } 
  
  	if (listener === 'tip') {
        if (includeTips && minTip <= event.amount) {
            if (event.amount === parseInt(event.amount)) {
                addEvent(`has donated ${event.amount.toLocaleString(userLocale, {
                    style: 'currency',
                    minimumFractionDigits: 0,
                    currency: userCurrency.code
                })}`, event.name, msgTip);
            } else {
                addEvent(`has donated ${event.amount.toLocaleString(userLocale, {
                    style: 'currency',
                    currency: userCurrency.code
                })}`, event.name, msgTip);
            }
        }
      return;
    } 
  
  	if (listener === 'raid') {
        if (includeRaids && minRaid <= event.amount) {
            addEvent(`raided`, event.name, msgRaidWelcome);
        }
      return;
    }
});

// sets up inital widget load
window.addEventListener('onWidgetLoad', function (obj) {
    userCurrency = obj.detail.currency;
    const fieldData = obj.detail.fieldData;
    includeFollowers = (fieldData.includeFollowers === "yes");
    includeRaids = (fieldData.includeRaids === "yes");
    minRaid = fieldData.minRaid;
    includeSubs = (fieldData.includeSubs === "yes");
    includeTips = (fieldData.includeTips === "yes");
    minTip = fieldData.minTip;
    includeCheers = (fieldData.includeCheers === "yes");
    minCheer = fieldData.minCheer;
  	scrambleWords = fieldData.scrambleWords;
  	msgGiftSub = fieldData.msgGiftSub;
  	msgBulkGiftSub = fieldData.msgBulkGiftSub;
  	msgReSub = fieldData.msgReSub;
  	msgSub = fieldData.msgSub;
  	msgCheer = fieldData.msgCheer;
  	msgTip = fieldData.msgTip;
  	msgRaidWelcome = fieldData.msgRaidWelcome;
  	msgFollow = fieldData.msgFollow;
  	scrambleDuration = fieldData.scrambleDuration;

});

//creates the event that is show in the textbox
//and then clears it
let isRunning = false;

//text: event description
//username: event sender
//remarks: final message (already set to be modified from SE fields)
function addEvent(text, username, remarks) {
  if (isRunning) return;
  isRunning = true;

  let displayText = `${username} has ${text}! ${remarks}`;

  let minTime = Number(displayText.length * 20 + 2000);
  
  let element = `
  <div data-name="${displayText.toUpperCase()}" class="event-container" id="event-tracker"> </div>`;

  $('.textBox').show().append(element);
	
    typer(scrambleWords,document.querySelector(".event-container"));

  	setTimeout(() => {
    
    $("#event-tracker").remove();
    
    isRunning = false;   
  }, minTime);
}
//type writer effect function. takes in 2 arguments, the text that will be displayed and the
//queryselector of the element it will be put in
//Adapted from Hyperflexed at https://codepen.io/Hyperplexed/full/rNrJgrd
typer(input, textBox);


function typer(_string, _target) {
  let count = 0;


  itteration = setInterval(() => {

    // separates the text, randomises them and then stitches them back together
    _target.innerText = _target.dataset.name.split("")
    .map((letter, index) => {
      if (index < count) {
        return _target.dataset.name[index];
      }

   return _string[Math.floor(Math.random() * _string.length)]})
    .join("");

    if (count >= _target.dataset.name.length) {
      clearInterval(itteration);
    }
      count += scrambleDuration;
  }, 20);
}