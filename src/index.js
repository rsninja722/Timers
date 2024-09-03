// import { Button } from '@material/mwc-button';
import '@material/web/all.js';
import '@material/web/elevation/elevation.js'

import { common, changeFaviconDefault, getData, reloadFromSave } from './common.js';
import Presets from './components/presets.js';
import Settings from './components/settings.js';
import Timers from './components/timers.js';
import Logs from './components/logs.js';
import Goals from './components/goals.js';
import Bar from './components/bar.js';

// initalize alarm sound once page has been clicked once
document.addEventListener("click", () => {
    if(common.alarm) {
       return;
    }
    
    common.alarm = new Audio();
    common.alarm.src = "./assets/alarm.wav";   
});

document.addEventListener("DOMContentLoaded", () => {

    changeFaviconDefault();

    reloadFromSave();
    
    // next day button: remove opacity/cursor css and reset time for all timers
    document.getElementById("next-day").addEventListener("click", () => {
        if(!confirm("Reset all timer progress?")) {
            return;
        }

        const timers = document.querySelectorAll("#timer-list .card");
        for(let i=0;i<timers.length;i++) {
            let t = timers[i];
            
            t.style.opacity = "1";
            t.style.cursor = "auto";
            
            t.querySelector(".timer-time").innerText = "000m 00s";
            t.querySelector("md-linear-progress").value = "0";
            t.querySelector("md-elevated-button").innerText = "Start";
        }

        let data = getData();
        // go through all presets and reset timers

        let keys = Object.keys(data.presets);
        for(let i=0; i<keys.length; i++) {
            for(let j=0; j<data.presets[keys[i]].length; j++) {
                data.presets[keys[i]][j].time = "000m 00s";
            }
        }
        
        localStorage.setItem("timerData", JSON.stringify(data));
    });

    Presets.onLoad();
    Settings.onLoad();
    Timers.onLoad();
    Logs.onLoad();
    Goals.onLoad();
    Bar.onLoad();
});
