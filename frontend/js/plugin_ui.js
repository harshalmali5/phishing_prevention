var background = chrome.extension.getBackgroundPage();
var colors = {
    "-1":"#58bc8a",
    "0":"#ffeb3c",
    "1":"#ff8b66"
};
var featureList = document.getElementById("features");
const gaugeElement = document.querySelector(".gauge");
function setGaugeValue(gauge, value) {
    if (value < 0 || value > 1) {
      
    }
  
    gauge.querySelector(".gauge__fill").style.transform = `rotate(${
      value / 2
    }turn)`;
    gauge.querySelector(".gauge__cover").textContent = `${Math.round(
      value * 100
    )}%`;
  }
  function getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
var perc = getRandomNumberBetween(10,50);
chrome.tabs.query({ currentWindow: true, active: true }, function(tabs){
    var result = background.results[tabs[0].id];
    
    var isPhish = background.isPhish[tabs[0].id];
    var legitimatePercent = background.legitimatePercents[tabs[0].id];

    for(var key in result){
        var newFeature = document.createElement("li");
        //console.log(key);
        newFeature.textContent = key;
        //newFeature.className = "rounded";
        newFeature.style.backgroundColor=colors[result[key]];
        featureList.appendChild(newFeature);
    }
    setGaugeValue(gaugeElement, legitimatePercent/100);

    $("#site_score").text(parseInt(legitimatePercent)+"%");
    if(isPhish) {
        $(".gauge__fill").css("background", "#ff6347");
       $("#site_msg").text("Malicious URL Suspected..");
        $("#site_score").text(parseInt(legitimatePercent)-20+"%");
        setGaugeValue(gaugeElement, (perc/100));
    }
});
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url1 = tabs[0].url;
  var xhr = new XMLHttpRequest();
  
  xhr.open("POST", "https://checkurl.phishtank.com/checkurl/index.php?url="+url1, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    url: url1,
    format: JSON
  }));
  var xmlres = xhr.responseXML;
  var item = xmlres.getElementsByTagName("in_database")[0]; 
  item = item.childNodes.length ? item.childNodes[0].nodeValue : "" ;
  $("#phis").text("Phishtank Database :: " + item);
});



