import { common, createElement, getData, saveData, loadTimers } from "../common.js";

class Presets {
    static insertPreset(presetName) {
        const presets = document.querySelector("#preset-list");

        const listItem = createElement("md-list-item", presets);

        const div = createElement("div", listItem, [["className", "card level1 flexy"]]);

        const activateButton = createElement("md-elevated-button", div, [["innerText", presetName]]);
        activateButton.addEventListener("click", (e) => {
            // clear all active intervals
            const keys = Object.keys(common.intervals);
            for (let i = 0; i < keys.length; i++) {
                clearInterval(common.intervals[keys[i]]);
            }

            saveData();

            // clear current timers
            document.getElementById("timer-list").innerHTML = "";

            let data = getData();

            common.activePreset = e.target.innerText;

            data.active = common.activePreset;

            document.getElementById("active-preset").innerText = common.activePreset;

            // insert timers from new preset
            loadTimers(data);
        });

        const deleteButton = createElement("button", div, [
            ["innerText", "Delete"],
            ["className", "delete-button"]
        ]);
        deleteButton.addEventListener("click", () => {
            if (confirm(`delete preset "${presetName}"?`)) {
                listItem.parentElement.removeChild(listItem);

                let data = getData();

                delete data.presets[presetName];

                data.active = Object.keys(data.presets)[0];

                localStorage.setItem("timerData", JSON.stringify(data));

                document.getElementById("timer-list").innerHTML = "";

                loadTimers(data);
            }
        });
    }

    static onLoad() {
        // add preset button
        document.getElementById("button-preset-add").addEventListener("click", () => {
            const presetNameElem = document.querySelector("#input-preset-name");

            Presets.insertPreset(presetNameElem.value);

            // register new preset in local storage
            let data = getData();
            data.active = presetNameElem.value;
            data.presets[data.active] = [];
            localStorage.setItem("timerData", JSON.stringify(data));

            presetNameElem.value = "";
        });
    }
}

export default Presets;
