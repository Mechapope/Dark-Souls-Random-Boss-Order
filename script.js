var shuff;

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

window.onload = function () {
    //Get URL from page and put it in share URL box
    var shareURL = window.location.href;
    document.getElementById("txtShareURL").value = shareURL;

    //Check option checkboxes based on options passsed from query string
    if (getParameterByName("os") == "1") {
        document.getElementById("chkOandS").checked = true;
    }

    if (getParameterByName("fe") == "1") {
        document.getElementById("chkFiresageElevatorClip").checked = true;
    }

    if (getParameterByName("cs") == "1") {
        document.getElementById("chkCeaselessSkip").checked = true;
    }

    if (getParameterByName("fs") == "1") {
        document.getElementById("chkFiresageSkip").checked = true;
    }

    if (getParameterByName("sgs") == "1") {
        document.getElementById("chkSensSkip").checked = true;
        document.getElementById("reverseSensSkip").style.display = "block";
    }

    if (getParameterByName("rsgs") == "1") {
        document.getElementById("chkReverseSensSkip").checked = true;
    }

    if (getParameterByName("as") == "1") {
        document.getElementById("chkAsylumSkip").checked = true;
    }

    if (getParameterByName("ps") == "1") {
        document.getElementById("chkPinwheelSkip").checked = true;
    }

    if (getParameterByName("cas") == "1") {
        document.getElementById("chkCapraSkip").checked = true;
    }

    if (getParameterByName("ars") == "1") {
        document.getElementById("chkArtoriasSkip").checked = true;
    }

    if (getParameterByName("qs") == "1") {
        document.getElementById("chkQuelaagSkip").checked = true;
    }

    if (getParameterByName("oh") == "1") {
        document.getElementById("chkOfferHumanities").checked = true;
    }

    if (getParameterByName("dfs") == "1") {
        document.getElementById("chkDeathcamFiresageSkip").checked = true;
    }

    if (getParameterByName("sn") == 1) {
        document.getElementById("chkSplitNumbers").checked = true;
    }

	if (getParameterByName("hide") == "1") {
        document.getElementById("chkHideSplits").checked = true;
    }
	
    //Check for seed in URL query string only on page load
	if (getParameterByName("seed") != "") {
	    document.getElementById("txtSeed").value = getParameterByName("seed");

        //if one was passed, generate random order using seed in URL
        generateRandomOrder(true);
    }
}

function generateRandomOrder(useQueryString) {

    shuff = new Array();
    //Clear any existing random order shown onpage
    document.getElementById("order").innerHTML = "";

    //List of bosses
    var bosses = ["Asylum Demon","Taurus Demon","Gargoyles","Quelaag","Iron Golem","Ornstein","Pinwheel","Nito","Four Kings","Sif","Priscilla","Stray Demon","Demon Firesage","Centipede Demon","Bed of Chaos", "Seath", "Capra Demon", "Gaping Dragon", "Ceaseless Discharge", "Gwyndolin", "Moonlight Butterfly", "Sanctuary Guardian", "Artorias", "Manus", "Kalameet", "Gwyn"];

    //Seed used to generate random order
    var seed = "";

    //Use query string seed only on first load
    if (useQueryString) {
        seed = getParameterByName("seed");
    }
    else {
        var seedTextValue = document.getElementById("txtSeed").value;

        //Check for entered seed
        if (seedTextValue != "") {
            seed = seedTextValue;
        }
        else {
            //Generate random seed by picking random digit X number of times
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 15; i++) {
                seed += possible.charAt(Math.floor(Math.random() * possible.length));
            }           
        }
       
        document.getElementById("txtShareURL").value = GenerateShareURL(seed);
    }

    var bossCount = bosses.length;

    for (var i = 0; i < bossCount; i++) {

        //Get a list of valid bosses for the current position
        var validBosses = GenerateValidBosses(bosses, shuff);

        //Shuffle list of valid bosses
        validBosses = SeededShuffle.shuffle(validBosses, seed, true);

        //Pick a random boss from the list and add it to shuffled list
        Math.seedrandom(seed + i);
        var randomIndex = Math.floor(Math.random() * validBosses.length);
        var temp = validBosses[randomIndex];

        shuff.push(temp);

        //Remove boss from list of unshuffled bosses
        bosses.splice(bosses.indexOf(temp), 1);
    }

    if (document.getElementById("chkOandS").checked) {
        //Randomly choose value of 0 or 1 to decide if Smough goes before or after Ornstein
        if(Math.random() < 0.5) {
            shuff[shuff.indexOf("Ornstein")] = "Smough and Super Ornstein";
        }
        else {
            shuff[shuff.indexOf("Ornstein")] = "Ornstein and Super Smough";
        }
    }
    else {
        //If not randomizing O/S order, just change the split name to include Smough too
        shuff[shuff.indexOf("Ornstein")] = "Ornstein and Smough";
    }

    var bossListText = document.getElementById("order");
	bossListText.innerHTML = ("Seed: " + seed + "<br /><br/>");

    //Append boss list to page
    for(var i = 0; i < shuff.length; i++) {

        if(document.getElementById("chkSplitNumbers").checked) {
            bossListText.innerHTML += "<div style='padding-bottom: 5px;'>#" + (i+1) + " " + shuff[i] + "<div>";
        }
        else {
            bossListText.innerHTML += "<div style='padding-bottom: 5px;'>" + shuff[i] + "</div>";
        }        
    }

    //Hide splits if checked
    var hideSplitsCheckbox = document.getElementById("chkHideSplits");
	if (hideSplitsCheckbox.checked) {
	    var bossList = document.getElementById('order');
	    bossList.style.display = 'none';
	    document.getElementById('lblSplitsHidden').innerHTML = 'Splits hidden';
	}
	
	var btnDownload = document.getElementById("downloadSection");	
	btnDownload.removeAttribute('style');

	document.getElementById("txtAltDownload").value = generateXML(shuff);
};

function GenerateValidBosses(options, shuffled) {

    //Get skip options 
    var firesageElevatorClip = document.getElementById("chkFiresageElevatorClip").checked;
    var ceaselessSkip = document.getElementById("chkCeaselessSkip").checked;
    var firesageSkip = document.getElementById("chkFiresageSkip").checked;
    var sensGateSkip = document.getElementById("chkSensSkip").checked;
    var reverseSensSkip = document.getElementById("chkReverseSensSkip").checked;
    var asylumDemonSkip = document.getElementById("chkAsylumSkip").checked;
    var pinwheelSkip = document.getElementById("chkPinwheelSkip").checked;
    var capraDemonSkip = document.getElementById("chkCapraSkip").checked;
    var artoriasSkip = document.getElementById("chkArtoriasSkip").checked;
    var quelaagSkip = document.getElementById("chkQuelaagSkip").checked;
    var offerHumanities = document.getElementById("chkOfferHumanities").checked;
    var deathcamFiresageSkip = document.getElementById("chkDeathcamFiresageSkip").checked;

    var lordvesselPlaced = false;
    var sensGateOpen = false;

    if (shuffled.indexOf("Ornstein") > -1 && ((shuffled.indexOf("Quelaag") > -1 && shuffled.indexOf("Gargoyles") > -1) || shuffled.indexOf("Four Kings") > -1)) {
        lordvesselPlaced = true;
    }

    if (shuffled.indexOf("Quelaag") > -1 && shuffled.indexOf("Gargoyles") > -1) {
        sensGateOpen = true;
    }

    var validBosses = new Array();

    //Boss order logic goes here
    for (var i = 0; i < options.length; i++) {

        //Check requirements of boss. Only add to list if requirements met
        if (options[i] == "Asylum Demon") {
            //asylum demon always first if not doing asylum skip
            if (shuffled.length == 0 && !asylumDemonSkip) {
                validBosses.push(options[i]);
                break;
            }
            else {
                validBosses.push(options[i]);
            }
        }        
        else if (options[i] == "Gwyn") {
            //Gwyn always last
            if (shuffled.length == 25) {
                validBosses.push(options[i]);
                break;
            }
        }
        else if (options[i] == "Gaping Dragon") {
            if (capraDemonSkip || shuffled.indexOf("Capra Demon") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Stray Demon") {
            //check asylum demon is dead, otherwise he might jump down to stray and get himself killed
            if (shuffled.indexOf("Asylum Demon") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Iron Golem") {
            if (sensGateSkip || sensGateOpen) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Ornstein") {
            if (shuffled.indexOf("Iron Golem") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Gwyndolin") {
            //if doing reverse sgs or sens gate is open, only req is after IG
            if ((reverseSensSkip || sensGateOpen) && shuffled.indexOf("Iron Golem") > -1) {
                validBosses.push(options[i]);
            }
            //player has no way to exit sens, has to come after lordvessel
            else if (shuffled.indexOf("Iron Golem") > -1 && shuffled.indexOf("Ornstein") > -1) {                    
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Priscilla") {
            //if doing reverse sgs or sens gate is open, only req is after IG
            if ((reverseSensSkip || sensGateOpen) && shuffled.indexOf("Iron Golem") > -1) {
                validBosses.push(options[i]);
            }
            //player has no way to exit sens, has to come after lordvessel
            else if (shuffled.indexOf("Iron Golem") > -1 && shuffled.indexOf("Ornstein") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Nito") {
            if (lordvesselPlaced) {
                if (pinwheelSkip || shuffled.indexOf("Pinwheel") > -1) {
                    validBosses.push(options[i]);
                }
            }
        }
        else if (options[i] == "Seath") {
            if (lordvesselPlaced) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Four Kings") {
            if (shuffled.indexOf("Sif") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Ceaseless Discharge") {
            if (quelaagSkip || shuffled.indexOf("Quelaag") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Demon Firesage") {
            //doing elevator clip and past quelaag
            if (firesageElevatorClip && (quelaagSkip || shuffled.indexOf("Quelaag") > -1)) {
                validBosses.push(options[i]);
            }
            else if (firesageSkip && (quelaagSkip || shuffled.indexOf("Quelaag") > -1) && (ceaselessSkip || shuffled.indexOf("Ceaseless Discharge") > -1)) {
                validBosses.push(options[i]);
            }
            //need lordvessel, past quelaag, past ceaseless
            else if (lordvesselPlaced && (quelaagSkip || shuffled.indexOf("Quelaag") > -1) && (ceaselessSkip || shuffled.indexOf("Ceaseless Discharge") > -1)) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Centipede Demon") {
            //doing firesage skip, or doing elevator clip and firesage is dead. past quelaag
            if (firesageSkip || (firesageElevatorClip && shuffled.indexOf("Demon Firesage") > -1) && (quelaagSkip || shuffled.indexOf("Quelaag") > -1)) {
                validBosses.push(options[i]);
            }
            else if (shuffled.indexOf("Demon Firesage") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Bed of Chaos") {
            //past quelaag, and doing firesage skip OR elevator clip w/ demon dead OR placed lordvessel and past ceaseless
            if (offerHumanities && (quelaagSkip || shuffled.indexOf("Quelaag") > -1) && ((firesageSkip || (firesageElevatorClip && shuffled.indexOf("Demon Firesage") > -1)) || (lordvesselPlaced && (ceaselessSkip || shuffled.indexOf("Ceaseless Discharge") > -1)))) {
                validBosses.push(options[i]);
            }
            //past quelaag, and either a) LV is placed w/ firesage alive and past ceaseless, or b) LV NOT placed w/ ceaseless alive and ceaseless skipping
            else if (deathcamFiresageSkip && (quelaagSkip || shuffled.indexOf("Quelaag") > -1) && (lordvesselPlaced && shuffled.indexOf("Demon Firesage") == -1 && (ceaselessSkip || shuffled.indexOf("Ceaseless Discharge") > -1)) || (!lordvesselPlaced && ceaselessSkip && shuffled.indexOf("Ceaseless Discharge") == -1)) {
                validBosses.push(options[i]);
            }
            else {
                if (shuffled.indexOf("Centipede Demon") > -1) {
                    validBosses.push(options[i]);
                }
            }                
        }
        else if (options[i] == "Sanctuary Guardian") {
            if (lordvesselPlaced) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Artorias") {
            if (shuffled.indexOf("Sanctuary Guardian") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Manus") {
            if ((artoriasSkip || shuffled.indexOf("Artorias") > -1) && shuffled.indexOf("Sanctuary Guardian") > -1) {
                validBosses.push(options[i]);
            }
        }
        else if (options[i] == "Kalameet") {
            if (shuffled.indexOf("Artorias") > -1) {
                validBosses.push(options[i]);
            }
        }
        else {
            validBosses.push(options[i]);
        }
    }

    return validBosses;
}


function GenerateShareURL(seed) {
    var shareURL = [location.protocol, '//', location.host, location.pathname].join('');

    shareURL += "?seed=" + seed;

    if(document.getElementById("chkOandS").checked) {
        shareURL += "&os=1";
    }

    if(document.getElementById("chkFiresageElevatorClip").checked) {
        shareURL += "&fe=1";
    }

    if(document.getElementById("chkCeaselessSkip").checked) {
        shareURL += "&cs=1";
    }

    if(document.getElementById("chkFiresageSkip").checked) {
        shareURL += "&fs=1";
    }

    if(document.getElementById("chkSensSkip").checked) {
        shareURL += "&sgs=1";
    }

    if(document.getElementById("chkReverseSensSkip").checked) {
        shareURL += "&rsgs=1";
    }

    if(document.getElementById("chkAsylumSkip").checked) {
        shareURL += "&as=1";
    }

    if(document.getElementById("chkPinwheelSkip").checked) {
        shareURL += "&ps=1";
    }

    if(document.getElementById("chkCapraSkip").checked) {
        shareURL += "&cas=1";
    }

    if(document.getElementById("chkArtoriasSkip").checked) {
        shareURL += "&ars=1";
    }

    if(document.getElementById("chkQuelaagSkip").checked) {
        shareURL += "&qs=1";
    }

    if (document.getElementById("chkOfferHumanities").checked) {
        shareURL += "&oh=1";
    }

    if (document.getElementById("chkDeathcamFiresageSkip").checked) {
        shareURL += "&dfs=1";
    }

    if(document.getElementById("chkSplitNumbers").checked) {
        shareURL += "&sn=1";
    }

    if(document.getElementById("chkHideSplits").checked) {
        shareURL += "&hide=1";
    }

    return shareURL;
}

//Hide/Show results
function ToggleResults() {
	
    var bossList = document.getElementById('order');
    
    if (bossList.style.display != 'none') {
		bossList.style.display = 'none';
		document.getElementById('lblSplitsHidden').innerHTML = 'Splits hidden';
	}
	else {
		bossList.style.display = 'initial';
		document.getElementById('lblSplitsHidden').innerHTML = '';
	}
}

function ToggleReverseSensSkip() {
	
    var checkboxDiv = document.getElementById("reverseSensSkip");

	if (document.getElementById("chkSensSkip").checked) {
	    checkboxDiv.style.display = "block";
	}
	else {
	    checkboxDiv.style.display = "none";
	    document.getElementById("chkReverseSensSkip").checked = false;
	}	
}

//Generates XML then downloads
function DownloadSplits() {	
	var xml = generateXML(shuff);
	downloadFile("Dark Souls - RBO.lss", xml);
}

//Swaps the position of two elements in the array
function Swap(array, index1, index2) {	
    var temp = array[index2];
    array[index2] = array[index1];
    array[index1] = temp;

    return array;
}

//Gets URL parameters
function getParameterByName(name) {
    var regexS = "[\\?&]"+name+"=([^&#]*)", 
    regex = new RegExp(regexS),
    results = regex.exec(window.location.search);
    if( results == null ) {
        return "";
    }
    else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

//Creates a live split XML file from the randomized boss order
function generateXML(bosses) {
    var XMLstring = '';
	
	XMLstring += '<?xml version="1.0" encoding="UTF-8"?> \n';
	XMLstring += '<Run version="1.6.0"> \n';
	XMLstring += '<GameIcon /> \n';
	XMLstring += '<GameName>Dark Souls</GameName> \n';
	XMLstring += '<CategoryName>Random Boss Order</CategoryName> \n';
	XMLstring += '<Metadata> \n';
	XMLstring += '<Run id="" /> \n';
	XMLstring += '<Platform usesEmulator="False"></Platform> \n';
	XMLstring += '<Region></Region> \n';
	XMLstring += '<Variables /> \n';
	XMLstring += '</Metadata> \n';
	XMLstring += '<Offset>00:00:00</Offset> \n';
	XMLstring += '<AttemptCount>0</AttemptCount> \n';
	XMLstring += '<AttemptHistory /> \n';
    XMLstring += '<Segments> \n';
	
	for (var i = 0; i < bosses.length; i++) {
        XMLstring += '<Segment> \n';

        if (document.getElementById("chkSplitNumbers").checked) {
            XMLstring += '<Name>#' + (i+1) + ' ' + bosses[i] +'</Name> \n';
        }
        else {
            XMLstring += '<Name>' + bosses[i] +'</Name> \n';
        }
		
		XMLstring += '<Icon /> \n';
		XMLstring += '<SplitTimes> \n';
		XMLstring += '<SplitTime name="Personal Best" /> \n';
		XMLstring += '</SplitTimes> \n';
		XMLstring += '<BestSegmentTime /> \n';
		XMLstring += '<SegmentHistory /> \n';
		XMLstring += '</Segment> \n';  		
	}
	  
    XMLstring += '</Segments> \n';
	XMLstring += '<AutoSplitterSettings /> \n';
	XMLstring += '</Run> \n';		
	
    return XMLstring;
}

//Downloads the livesplit file
function downloadFile (filename, data) {
    var blob = new Blob([data], {type: 'XML Document'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}
