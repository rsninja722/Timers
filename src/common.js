import Presets from './components/presets.js';
import Timers from './components/timers.js';
import Logs from './components/logs.js';
import Goals from './components/goals.js';

let common = {
    intervals: {},
    alarm: null,
    activePreset: "default" 
};

function changeFaviconActive(src) {
    const iconActiveBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAB7UlEQVQ4jYWTP2zTUBCHv/eeXUdpE4tGBgsqORFDJVrRDpVQp0wwwsLGxsYCExKV6NaBBlGJqYvLgMTGhFSGog4Z2enQgZJapAMSEiQlcoLtxxCbBifALe/Pffe7d3d6ggl2/PjGAlADTgENlIBP3sbeQZ4VE4It4Bg4rzUDACGYAr4Anrex1x/lZV4g/BkbgAMIIbCEwEoTOamPfwrMb+7XokSPlRUlmvnN/dr/BC4BW1qZnTyY3m2lzF8FlJSyIh2vN5bJ8XpSygqg8gJ/NFJKia6tDMZeUFsZSDlWsZAMx5SZq7U2Em85zJOJtxxqrQ3AHdUdlVwEGqZpqmLFtYfaZ3mKFdc2TVMBjZT9XQLAkhBizff93SAIBq7rOsbsWSJj1sV1XScIgoHv+7tCiDVgibT+C8DzarX6utlsPjEM43Icx8iwS/xuGwB1/R5JoYRSiiiKPtbr9UetVus28CBr4CLw1LKsuXK5XNRayzAMp8ulmT5Ap3tqFQqFH0KIpNPp9Pr9/mfgIfAhe6ViOF8PuAis2rZ9dLizHh/urMe2bR8Bq6nPS1mVBZJOogt8T1f97NbV+wvq64zxrS3mzk1Hbw9OGsDJKDPaxLy1r1SmXmaHdN+eBOZ/Y3bWgHpz99odgJsv3r8C4pwfgF8Cz5pqqHU/WwAAAABJRU5ErkJggg==`;
    var link = document.createElement('link'),
    oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = iconActiveBase64;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

function changeFaviconDefault(src) {
    const iconBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAB0klEQVQ4jaWTu2obURCGv3NZjrLZSGAX69yQII0LgWu7UbGvkPdIY0Fad8FpFNXbussT2LjQC6wxbOkYE5wL6iSUICGdnRRaiUVIIZAfhmHOXJiZfw78J9SOdwMclBrAAz9L/U9oa62vrLW31tpbrfUV0N4WqLclO+fO+v3+dZ7nd3me3/X7/Wvn3NmuIlW8BC57vd6piOQi8lhK3uv1ToHLMmYNu1HAaK33kyQ5AV6LSACglHqWJMmJ1nq/KAqzWUABsp5Ja5xzTeBJZUTrnGtqrSmKopqvdDUZOBARq5RyLBnQpRillBMRy5KdFaS6xDZwHgSBCcNwDyiqEobhXhAEBjhnyzKPlFIXaZp2h8Nh5r2fi4gXkUUp3ns/Hw6HWZqmXaXUBXBEOX8MfGq1Wp8Hg8EHa+0b7z1aa7xf3o0xhqIoMMawWCy+dDqd9w8PD2+Bd6tLbAMfnXOv6vV6KCJ6Op0+jaJoBjCZTFytVvullCrG4/Hv2Wz2CHSBfE0fS36bwAvguNFo3GdZNs+ybN5oNO6B49LXLGPNikZY3vi3Kj1RFI2MMU2AKIpGo9HoK/B9c3l/w2EcxzdxHN8Ah7uCNn/jypayxeel/aPssuoH4A9sn663qZH+QgAAAABJRU5ErkJggg==`;
    var link = document.createElement('link'),
    oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = iconBase64;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

// create an element with the given attributes in the form [ [name, value], [name, value] ]
// and append it to the provided parent
function createElement(element,parent=null,attributes=[]) {
    var e = document.createElement(element);
    for(var i of attributes) {
        e[i[0]] = i[1];
    }
    if(parent) {
        parent.appendChild(e);
    }
    return e;
}

function getData() {
    const data = localStorage.getItem("timerData") || `{"active":"default","presets": {"default":[]}, "logs": []}`;

    return JSON.parse(data);
}

function saveData() {
    let data = getData();

    data.active = common.activePreset;
    data.presets[data.active] = [];

    const timers = document.getElementById("timer-list");
    for(let i=0; i<timers.children.length; i++) {
        const e = timers.children[i];
        if(e.tagName !== "MD-LIST-ITEM") {
            continue;
        }

        const label = e.querySelector(".timer-label");
        const time = e.querySelector(".timer-time");
        const max = e.querySelector(".timer-max");
        const div = e.querySelector(".card");

        data.presets[data.active].push({
            label: label.textContent,
            time: time.textContent,
            max: max.textContent,
            color: div.style.backgroundColor
        });
    }

    data.logs = [];

    const logs = document.getElementById("log-list");
    for(let i=0; i<logs.children.length; i++) {
        const e = logs.children[i];
        if(e.className !== "log-item") {
            continue;
        }

        const span = e.querySelector("span");

        data.logs.push(span.textContent);
    }

    data.goals = [];
    const goals = document.getElementById("goal-list");
    for(let i=0; i<goals.children.length; i++) {
        const e = goals.children[i];
        if(e.tagName !== "MD-LIST-ITEM") {
            continue;
        }

        const span = e.querySelector("span");

        data.goals.push(span.textContent);
    }

    localStorage.setItem("timerData", JSON.stringify(data));
}

function loadTimers(data) {
    for(let i=0; i<data.presets[data.active].length; i++) {
        const t = data.presets[data.active][i];
        Timers.insertTimer(t.label,t.color,t.max,t.time);
    }
}


function reloadFromSave() {
    document.getElementById("timer-list").innerHTML = "";
    document.getElementById("log-list").innerHTML = "";
    document.getElementById("goal-list").innerHTML = "";
    document.getElementById("preset-list").innerHTML = "";

    let data = getData();

    common.activePreset = data.active;

    document.getElementById("active-preset").innerText = common.activePreset;

    // load goals
    data.goals = data.goals || [];
    data.goals.forEach(goal => Goals.insertGoal(goal));
    
    // load logs from end of array since insertLog puts new logs at the top of the list
    let logs = data.logs;
    for(let i=logs.length-1; i>-1; i--) {
        Logs.insertLog(logs[i]);
    }

    // load timers
    loadTimers(data);

    // load presets
    Object.keys(data.presets).forEach(preset => Presets.insertPreset(preset));
}

export { common, changeFaviconActive, changeFaviconDefault, createElement, getData, saveData, loadTimers, reloadFromSave };