import { getData, reloadFromSave } from "../common.js";

class Settings {
    static onLoad() {
        // settings button
        document.getElementById("button-settings").addEventListener("click", () => {
            document.getElementById("settings").style.display = "flex";
            document.getElementById("settings-export").value = "";
        });

        // close settings button
        document.getElementById("button-settings-close").addEventListener("click", () => {
            document.getElementById("settings").style.display = "none";
        });

        // export button
        document.getElementById("button-export").addEventListener("click", () => {
            document.getElementById("settings-export").value = btoa(localStorage.getItem("timerData"));
        });

        // import button
        document.getElementById("button-import").addEventListener("click", () => {
            const data = document.getElementById("settings-import").value;
            localStorage.setItem("timerData", atob(data));
            reloadFromSave();
            document.getElementById("settings").style.display = "none";
        });

        // merge buttons
        document.getElementById("button-merge-goals").addEventListener("click", () => {
            const data = getData();

            const mergeData = JSON.parse(atob(document.getElementById("settings-merge").value));

            data.goals = data.goals.concat(mergeData.goals);

            localStorage.setItem("timerData", JSON.stringify(data));
            reloadFromSave();
            document.getElementById("settings").style.display = "none";
        });
        document.getElementById("button-merge-logs").addEventListener("click", () => {
            const data = getData();

            const mergeData = JSON.parse(atob(document.getElementById("settings-merge").value));

            // maintain order of logs
            let logs = [];
            let a = [...data.logs];
            let b = [...mergeData.logs];

            while (a.length > 0 || b.length > 0) {
                // always add most recent log
                if (a.length === 0) {
                    logs.push(b.shift());
                } else if (b.length === 0) {
                    logs.push(a.shift());
                } else {
                    let dateAString = a[0].split(" | ")[0];
                    let dateBString = b[0].split(" | ")[0];

                    let dateA = new Date();
                    dateA.setFullYear(dateAString.split(".")[0]);
                    dateA.setMonth(dateAString.split(".")[1] - 1);
                    dateA.setDate(dateAString.split(".")[2]);

                    let dateB = new Date();
                    dateB.setFullYear(dateBString.split(".")[0]);
                    dateB.setMonth(dateBString.split(".")[1] - 1);
                    dateB.setDate(dateBString.split(".")[2]);

                    if (dateA > dateB) {
                        logs.push(a.shift());
                    } else {
                        logs.push(b.shift());
                    }
                }
            }

            data.logs = logs;

            localStorage.setItem("timerData", JSON.stringify(data));
            reloadFromSave();
            document.getElementById("settings").style.display = "none";
        });
    }
}

export default Settings;