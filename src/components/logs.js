import { createElement, saveData } from "../common.js";

class Logs {
    static insertLog(text) {
        const logs = document.getElementById("log-list");

        const first = logs.children[0];

        let newDay = false;

        // determine if a divider should be inserted if this is a new day
        if (first) {
            if (first.className !== "divider") {
                const date = first.querySelector("span").textContent.split(" | ")[0];
                newDay = date !== text.split(" | ")[0];
            }
        }

        const item = createElement("div", null, [["className", "log-item"]]);

        createElement("span", item, [["innerText", text]]);

        const delButton = createElement("button", item);
        delButton.style.display = "none";
        delButton.innerText = "Delete";
        delButton.className = "delete-button";
        delButton.addEventListener("click", () => {
            item.parentElement.removeChild(item);
            saveData();
        });

        if (first) {
            // insert divider below this log
            if (newDay) {
                const divider = createElement("div", null, [["className", "divider"]]);
                logs.insertBefore(divider, logs.children[0]);
            }

            logs.insertBefore(item, logs.children[0]);
        } else {
            logs.appendChild(item);
        }
    }

    static addLogFromInput() {
        const log = document.getElementById("input-log");

        const date = new Date();

        const today = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;

        Logs.insertLog(today + " | " + log.value);

        log.value = "";

        saveData();
    }

    static onLoad() {
        // add log button
        document.getElementById("button-log-enter").addEventListener("click", Logs.addLogFromInput);
        document.getElementById("input-log").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                Logs.addLogFromInput();
            }
        });

        // delete logs button: show/hide delete buttons next to all logs
        const logDeleteButton = document.getElementById("button-log-delete");
        logDeleteButton.addEventListener("click", () => {
            const show = logDeleteButton.innerText === "Delete Logs";
            logDeleteButton.innerText = show ? "Done" : "Delete Logs";

            const delButtons = document.querySelectorAll("#log-list .delete-button");
            for (let i = 0; i < delButtons.length; i++) {
                delButtons[i].style.display = show ? "inline-block" : "none";
            }
        });
    }
}

export default Logs;
