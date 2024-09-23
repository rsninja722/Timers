import { common, changeFaviconActive, changeFaviconDefault } from "../common.js";

class Pomodoro {
    static get PHASES() {return {WORK: 'work', BREAK: 'break' }; }
    static interval = null;
    static workMins = 25;
    static breakMins = 5;

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

    static start() {
        Pomodoro.interval = setInterval(Pomodoro.updateTime, 1000);
    }

    static pause() {
        clearInterval(Pomodoro.interval);
    }

    static newSession() {
        Pomodoro.pause();
        Pomodoro.updateMaxes();
        document.getElementById("pomodoro-timer-phase").innerText = Pomodoro.PHASES.WORK;
        document.getElementById("pomodoro-time").innerText = "0m 00s";
        document.getElementById("pomodoro-max").innerText = `${Pomodoro.workMins}m 00s`;
        document.getElementById("pomodoro-plan").value = "";
        document.getElementById("pomodoro-reflection").value = "";
        document.getElementById("pomodoro-progress").value = "0";
    }

    static updateMaxes() {
        Pomodoro.workMins = parseInt(document.getElementById("input-pomodoro-work-mins").value);
        Pomodoro.breakMins = parseInt(document.getElementById("input-pomodoro-break-mins").value);
    }

    static switchAlert() {
        common.tone.play();

        // animate favicon
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                changeFaviconActive();
                document.querySelector("title").innerText = "Phase";
            }, i * 500);
            setTimeout(() => {
                changeFaviconDefault();
                document.querySelector("title").innerText = "Over";
            }, i * 500 + 250);
        }

        // set favicon and title back to normal after animation
        setTimeout(() => {
            changeFaviconDefault();
            document.querySelector("title").innerText = "Timers";
        }, 6 * 500 + 500);
    }

    static updateTime() {
        Pomodoro.updateMaxes();
        let curSpan = document.getElementById("pomodoro-time");
        let [curMins, curSecs] = Pomodoro.parseTime(curSpan.innerText);

        let curPhase = document.getElementById("pomodoro-timer-phase").innerText ?? Pomodoro.PHASES.WORK;

        if (++curSecs > 59) {
            curSecs = 0;
            ++curMins;
        }

        // switch phases time limits
        switch (curPhase) {
            case Pomodoro.PHASES.WORK:
                if(curMins >= Pomodoro.workMins) {
                    curPhase = Pomodoro.PHASES.BREAK;
                    document.getElementById("pomodoro-timer-phase").innerText = curPhase;
                    Pomodoro.switchAlert();
                    curMins = 0;
                    curSecs = 0;
                }

                break;
            case Pomodoro.PHASES.BREAK:
                if(curMins >= Pomodoro.breakMins) {
                    curPhase = Pomodoro.PHASES.WORK;
                    document.getElementById("pomodoro-timer-phase").innerText = curPhase;
                    Pomodoro.switchAlert();
                    curMins = 0;
                    curSecs = 0;
                }
                break;
        }

        document.getElementById("pomodoro-progress").value = ((curMins * 60 + curSecs) / ((curPhase === Pomodoro.PHASES.WORK ? Pomodoro.workMins : Pomodoro.breakMins) * 60)).toPrecision(4).toString();

        // update title
        document.querySelector("title").innerText = `${curMins.toString().padStart(2, "0")}:${curSecs.toString().padStart(2, "0")}/${curPhase === Pomodoro.PHASES.WORK ? Pomodoro.workMins : Pomodoro.breakMins}:00 | ${curPhase}`;

        // update timer text
        curSpan.innerText = `${curMins.toString().padStart(2, "0")}m ${curSecs.toString().padStart(2, "0")}s`;
        document.getElementById("pomodoro-max").innerText = `${curPhase === Pomodoro.PHASES.WORK ? Pomodoro.workMins : Pomodoro.breakMins}m 00s`;
    }

    static onLoad() {
        document.getElementById("button-pomodoro-start").addEventListener("click", () => {
            Pomodoro.start();
            document.getElementById("button-pomodoro-start").disabled = true;
            document.getElementById("button-pomodoro-pause").disabled = false;
        });

        document.getElementById("button-pomodoro-pause").addEventListener("click", () => {
            Pomodoro.pause();
            document.getElementById("button-pomodoro-start").disabled = false;
            document.getElementById("button-pomodoro-pause").disabled = true;
        });

        document.getElementById("button-pomodoro-new").addEventListener("click", () => {
            Pomodoro.newSession();
        });
    }
}

export default Pomodoro;