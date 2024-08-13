import { createElement, saveData } from "../common.js";

class Goals {
    static insertGoal(text) {
        const goals = document.getElementById("goal-list");

        const item = createElement("md-list-item", goals, [["className", "goal-item"]]);

        createElement("span", item, [["innerText", text]]);

        const delButton = createElement("button", item);

        delButton.style.display = "none";
        delButton.innerText = "Delete";
        delButton.className = "delete-button";
        delButton.addEventListener("click", () => {
            item.parentElement.removeChild(item);
            saveData();
        });
    }

    static addGoalFromInput() {
        const goal = document.getElementById("input-goal");
        Goals.insertGoal(goal.value);
        goal.value = "";
        saveData();
    }

    static onLoad() {
        // add goal button
        document.getElementById("button-goal-enter").addEventListener("click", Goals.addGoalFromInput);
        document.getElementById("input-goal").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                Goals.addGoalFromInput();
            }
        });

        // delete goals button: show/hide delete buttons on all goals
        const goalDeleteButton = document.getElementById("button-goal-delete");
        goalDeleteButton.addEventListener("click", () => {
            const show = goalDeleteButton.innerText === "Delete Goals";
            goalDeleteButton.innerText = show ? "Done" : "Delete Goals";

            const goalButtons = document.querySelectorAll("#goal-list .delete-button");
            for (let i = 0; i < goalButtons.length; i++) {
                goalButtons[i].style.display = show ? "inline-block" : "none";
            }
        });
    }
}

export default Goals;
