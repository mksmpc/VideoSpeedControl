// ==UserScript==
// @name         Video Speed Control
// @namespace    https://github.com/mksmpc/VideoSpeedControl
// @version      0.4
// @description  Change speed on any video by 'CTRL + <' and 'CTRL + >'
// @author       makesomepeace
// @match        *://*/*
// @icon         none
// @grant        none
// ==/UserScript==


var minSpeed = 0.5;
var maxSpeed = 3;
var speedStep = 0.25;

var rewindStep = 5;


let lastUrl = location.href;


new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        onUrlChange();
    }
}).observe(document, {subtree: true, childList: true});


var videoElements = undefined;
var currentVideoElement = undefined;


function onUrlChange() {
    assignVideoElements();
}


function assignVideoElements() {
    videoElements = getVideoElements();
    subscribeOnPlayEvents(videoElements);
}


function getVideoElements(){
    let result = Array.from(document.getElementsByTagName("video"));
    let ozon_result = document.getElementsByTagName("video-player")[0]?.shadowRoot.querySelectorAll('video');
    console.log('getVideoElements ozon_result', ozon_result);
    if (ozon_result?.length) {
        result = result.concat(Array.from(ozon_result));
    }
    // let yandex_video = document.getElementsByTagName("yaplayertag");
    console.log('getVideoElements ', result);
    return result;
}


function subscribeOnPlayEvents(elements) {
    for (const element of elements) {
        if (element.paused == false) {
            setCurrentVideoElement(element);
        }
        //        console.log('subscribeOnPlayEvents ', element);
        element.onplaying = () => {
            //           console.log('invoke onplay event from: ', element);
            setCurrentVideoElement(element)
        };
    }
}


function setCurrentVideoElement(newVideoElement) {
    currentVideoElement = newVideoElement;
}

function getCurrentVideoElement() {
    if(!videoElements?.length) {
        assignVideoElements();
    }
    return currentVideoElement;
}


function changeSpeed(speedOffset) {
    let v = getCurrentVideoElement();
    let newSpeed = Math.max(minSpeed, Math.min(v.playbackRate + speedOffset, maxSpeed));
    v.playbackRate = newSpeed;
        console.log("speed changed at: ", newSpeed, v);
}

function resetSpeed() {
    let v = getCurrentVideoElement();
    v.playbackRate = 1;
    console.log("speed resetted at: ", 1, v);
}

function rewindVideo(rewindOffset) {
    let v = getCurrentVideoElement();

    v.currentTime += rewindOffset;
}
rewindVideo


function addKeyEvent(func, keyCode, isWithShift = false) {
    document.addEventListener('keydown', function(event){
        if ((event.ctrlKey || event.metaKey) && (isWithShift == event.shiftKey) && event.code == keyCode ) {
            func();
            event.preventDefault();
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
    addKeyEvent(() => changeSpeed(speedStep), 'ArrowUp');

    // addKeyEvent(() => changeSpeed(-speedStep), 'Period', true);
    addKeyEvent(() => changeSpeed(-speedStep), 'Comma');
    addKeyEvent(() => changeSpeed(-speedStep), 'ArrowDown');

    addKeyEvent(() => rewindVideo(rewindStep), 'ArrowRight');
    addKeyEvent(() => rewindVideo(-rewindStep), 'ArrowLeft');

    addKeyEvent(resetSpeed, 'Slash');

}
         );
