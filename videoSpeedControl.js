// ==UserScript==
// @name         Video Speed Control
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change speed on any video by 'CTRL + <' and 'CTRL + >'
// @author       makesomepeace
// @include      /^http(s)?://.*
// @icon         none
// @grant        none
// ==/UserScript==


var minSpeed = 0.5;
var maxSpeed = 3;
var speedStep = 0.25;


let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        onUrlChange();
    }
}).observe(document, {subtree: true, childList: true});


function onUrlChange() {
    getVideoElement(true);
}


var videoEl = null;
var currentSpeed = null;

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


function getVideoElement(force = false){
    if (videoEl == null || force) {
        videoEl = document.getElementsByTagName("video")[0];
        console.log(force, videoEl);
    }
    currentSpeed = videoEl.playbackRate;
    return videoEl;
}


function changeSpeed(speed) {
    var v = getVideoElement();
    currentSpeed += speed;
    currentSpeed = Math.max(minSpeed, Math.min(currentSpeed, maxSpeed));
    v.playbackRate = currentSpeed;
    console.log("speed changed at:", currentSpeed);
}


function addKeyEvent(func, ...keyCode) {
    document.addEventListener('keydown', function(event){
        if ((event.ctrlKey || event.metaKey) && event.code == keyCode ) {
            func();
        }
    });
}


function readyHead(fn) {
    if (document.body) { // если есть body, значит head готов
        fn();
    } else if (document.documentElement) {
        const observer = new MutationObserver(() => {
            if (document.body) {
                observer.disconnect();
                fn();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    } else {
        // рекурсивное ожидание появления DOM
        setTimeout(() => readyHead(fn), 16);
    }
}

readyHead(() => {

    addKeyEvent(() => changeSpeed(speedStep), 'Period');
    addKeyEvent(() => changeSpeed(-speedStep), 'Comma');
}
         );
