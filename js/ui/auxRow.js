import { engine } from "../core/engine.js";

let rowEl = null;
let innerEl = null;

export function setupAuxRow(el) {
    rowEl = el;
    innerEl = el.querySelector("#aux-row-inner");
}

export function renderAuxRow() {
    if (!rowEl || !innerEl) return;

    const aux = engine.state.aux;

    if (!aux) {
        rowEl.classList.remove("visible");

        rowEl.addEventListener(
            "transitionend",
            () => innerEl.replaceChildren(),
            { once: true },
        );

        return;
    }

    rowEl.classList.add("visible");
    innerEl.replaceChildren();

    if (aux.kind === "histogram") renderHistogram(aux);
    else renderGroups(aux.groups);
}

function renderGroups(groups) {
    for (const group of groups) {
        const groupEl = document.createElement("div");
        groupEl.className = "aux-group";

        if (group.label !== null && group.label !== undefined) {
            const labelEl = document.createElement("span");
            labelEl.className = "aux-group-label";
            labelEl.textContent = group.label;
            groupEl.appendChild(labelEl);
        }

        const chipsEl = document.createElement("div");
        chipsEl.className = "aux-chips";

        group.values.forEach((val, idx) => {
            const chip = document.createElement("span");
            chip.className = "aux-chip";

            if (val === null || val === undefined) {
                chip.classList.add("empty");
                chip.textContent = "\u00b7";
            } else {
                chip.textContent = String(val);
            }

            if (group.active && group.active.has(idx))
                chip.classList.add("active");
            if (group.done && group.done.has(idx)) chip.classList.add("done");

            chipsEl.appendChild(chip);
        });

        groupEl.appendChild(chipsEl);
        innerEl.appendChild(groupEl);
    }
}

function renderHistogram({ counts, active, done }) {
    const maxCount = Math.max(1, ...counts);

    const wrap = document.createElement("div");
    wrap.className = "aux-histogram";

    counts.forEach((count, val) => {
        const bar = document.createElement("div");
        bar.className = "aux-hist-bar";
        bar.style.height = `${(count / maxCount) * 100}%`;

        if (active && active.has(val)) bar.classList.add("active");
        else if (done && done.has(val)) bar.classList.add("done");

        wrap.appendChild(bar);
    });

    innerEl.appendChild(wrap);
}
