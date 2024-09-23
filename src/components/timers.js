import { common, changeFaviconActive, changeFaviconDefault, createElement, saveData } from "../common.js";

class Timers {
    static parseTime(text) {
        if(!text) {
            return [0, 0];
        }
        
        let minutes = text.split(" ")[0];
        minutes = parseInt(minutes.slice(0, minutes.length - 1));

        let seconds = text.split(" ")[1];
        seconds = parseInt(seconds.slice(0, seconds.length - 1));
        return [minutes, seconds];
    }

    static insertTimer(labelName, color, max, current) {
        const timerList = document.getElementById("timer-list");

        const mdListItem = createElement("md-list-item", timerList);

        const div = createElement("div", mdListItem, [
            ["className", "card level1 flexy"],
            ["style", `background-color: ${color};`]
        ]);
        if (max === current) {
            div.style.opacity = "0.25";
            div.style.cursor = "not-allowed";
        }

        const start = createElement("md-elevated-button", div, [["innerText", "Start"]]);
        if (max === current) {
            start.innerText = "Time's Up!";
        }

        const label = createElement("label", div, [
            ["className", "timer-label"],
            ["innerText", labelName]
        ]);

        const delButton = createElement("button", div);
        delButton.style.display = "none";
        delButton.textContent = "Delete";
        delButton.className = "delete-button";
        delButton.addEventListener("click", () => {
            mdListItem.parentElement.removeChild(mdListItem);
            saveData();
        });

        createElement("br", div);

        const currentSpan = createElement("span", div, [
            ["className", "timer-time"],
            ["innerText", current]
        ]);

        createElement("span", div, [["innerText", "/"]]);

        const maxSpan = createElement("span", div, [
            ["className", "timer-max"],
            ["innerText", max]
        ]);

        const bar = createElement("md-linear-progress", div);

        let [curMins, curSecs] = this.parseTime(current);
        let [maxMins, maxSecs] = this.parseTime(max);
        bar.value = ((curMins * 60 + curSecs) / (maxMins * 60 + maxSecs)).toPrecision(4).toString();

        // turn on and off timer
        start.addEventListener("click", (e) => {
            const labelText = label.innerText;

            if (start.innerText === "Time's Up!") {
                return;
            }

            if (start.innerText === "Start") {
                start.innerText = "Stop";

                common.intervals[labelText] = setInterval(() => {
                    let [curMins, curSecs] = this.parseTime(currentSpan.innerText);

                    let autoSave = false;

                    // advance minutes/seconds
                    if (++curSecs > 59) {
                        curSecs = 0;
                        ++curMins;

                        autoSave = true;
                    }

                    let [maxMins, maxSecs] = this.parseTime(maxSpan.innerText);

                    // update title with current timer progress
                    document.querySelector("title").innerText = `${curMins.toString().padStart(1, "0")}:${curSecs.toString().padStart(2, "0")}/${maxMins}:00 | ${labelName}`;

                    if (curMins === maxMins && curSecs === maxSecs) {
                        common.alarm.play();

                        clearInterval(common.intervals[labelText]);

                        // animate favicon
                        for (let i = 0; i < 12; i++) {
                            setTimeout(() => {
                                changeFaviconActive();
                                document.querySelector("title").innerText = "Time";
                            }, i * 500);
                            setTimeout(() => {
                                changeFaviconDefault();
                                document.querySelector("title").innerText = "Up";
                            }, i * 500 + 250);
                        }

                        // set favicon and title back to normal after animation
                        setTimeout(() => {
                            changeFaviconDefault();
                            document.querySelector("title").innerText = "Timers";
                        }, 12 * 500 + 500);

                        // fade out timer and change pointer type
                        div.style.opacity = "0.25";
                        div.style.cursor = "not-allowed";

                        start.innerText = "Time's Up!";

                        autoSave = true;
                    }

                    // update timer text
                    currentSpan.innerText = `${curMins.toString().padStart(3, "0")}m ${curSecs.toString().padStart(2, "0")}s`;

                    // advance progress bar
                    bar.value = ((curMins * 60 + curSecs) / (maxMins * 60 + maxSecs)).toPrecision(4).toString();

                    if (autoSave) {
                        saveData();
                    }
                }, 1000);
            } else {
                start.innerText = "Start";

                clearInterval(common.intervals[labelText]);

                saveData();
            }
        });
    }

    static addTimerFromInput() {
        const label = document.getElementById("input-label");
        const max = document.getElementById("input-time");
        const color = document.getElementById("input-color");

        Timers.insertTimer(label.value, color.value, `${max.value.padStart(3, "0")}m 00s`, "000m 00s");

        label.value = "";
        max.value = "";

        saveData();
    }

    static onLoad() {
        // add timer button
        document.getElementById("button-timer-add").addEventListener("click", Timers.addTimerFromInput);
        document.getElementById("input-time").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                Timers.addTimerFromInput();
            }
        });

        // delete timers button: show/hide delete buttons on all timers
        const timerDeleteButton = document.getElementById("button-timer-delete");
        timerDeleteButton.addEventListener("click", () => {
            const show = timerDeleteButton.innerText === "Delete Timers";
            timerDeleteButton.innerText = show ? "Done" : "Delete Timers";

            const timerButtons = document.querySelectorAll("#timer-list .delete-button");
            for (let i = 0; i < timerButtons.length; i++) {
                timerButtons[i].style.display = show ? "inline-block" : "none";
            }
        });
    }
}

export default Timers;
