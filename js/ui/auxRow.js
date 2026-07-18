import { engine } from "../core/engine.js";

let rowEl = null;
let innerEl = null;
let pendingHideCleanup = null;
let isShown = false;

export function setupAuxRow(el) {
    rowEl = el;
    innerEl = el.querySelector("#aux-row-inner");
}

export function renderAuxRow() {
    if (!rowEl || !innerEl) return;

    const aux = engine.showAux ? engine.state.aux : null;

    if (!aux) {
        if (isShown) {
            isShown = false;
            rowEl.classList.remove("visible");

            if (!pendingHideCleanup) {
                const handler = (event) => {
                    if (event.propertyName !== "grid-template-rows") return;

                    rowEl.removeEventListener("transitionend", handler);
                    innerEl.replaceChildren();
                    pendingHideCleanup = null;
                };

                pendingHideCleanup = handler;
                rowEl.addEventListener("transitionend", handler);
            }
        }
        return;
    }

    if (pendingHideCleanup) {
        rowEl.removeEventListener("transitionend", pendingHideCleanup);
        pendingHideCleanup = null;
    }

    innerEl.replaceChildren();

    if (aux.kind === "histogram") renderHistogram(aux);
    else if (aux.kind === "tree") renderTree(aux);
    else renderGroups(aux.groups);

    if (!isShown) {
        isShown = true;

        rowEl.classList.add("visible");
    }
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

            if (
                group.active &&
                group.active.has(idx) &&
                !engine.disableFlashing
            )
                chip.classList.add("active");
            if (group.done && group.done.has(idx)) chip.classList.add("done");

            chipsEl.appendChild(chip);
        });

        groupEl.appendChild(chipsEl);
        innerEl.appendChild(groupEl);
    }
}

const HIST_BAR_AREA_HEIGHT = 40; // must match .aux-hist-bar-slot's height in style.css

function renderHistogram({ entries, active, done }) {
    const maxCount = Math.max(1, ...entries.map((e) => e.count));

    const containerWidth = Math.max(200, innerEl.clientWidth || 600);
    const showLabels = containerWidth / entries.length >= 14;

    const wrap = document.createElement("div");
    wrap.className = "aux-histogram";

    entries.forEach((entry, idx) => {
        const isActive = active && active.has(idx) && !engine.disableFlashing;
        const isDone = done && done.has(idx);

        const col = document.createElement("div");
        col.className = "aux-hist-col";

        if (showLabels) {
            const countEl = document.createElement("span");
            countEl.className = "aux-hist-count";
            countEl.textContent = entry.count > 0 ? String(entry.count) : "";
            if (isActive) countEl.classList.add("active");
            else if (isDone) countEl.classList.add("done");
            col.appendChild(countEl);
        }

        const slot = document.createElement("div");
        slot.className = "aux-hist-bar-slot";

        const bar = document.createElement("div");
        bar.className = "aux-hist-bar";
        bar.style.height = `${(entry.count / maxCount) * HIST_BAR_AREA_HEIGHT}px`;

        if (isActive) bar.classList.add("active");
        else if (isDone) bar.classList.add("done");

        slot.appendChild(bar);
        col.appendChild(slot);

        if (showLabels) {
            const labelEl = document.createElement("span");
            labelEl.className = "aux-hist-label";
            labelEl.textContent = entry.label;
            col.appendChild(labelEl);
        }

        wrap.appendChild(col);
    });

    innerEl.appendChild(wrap);
}

function renderTree(aux) {
    const { tree, leaves, size, n, active, done } = aux;
    const numLevels = Math.log2(size);

    const containerWidth = Math.max(200, innerEl.clientWidth || 600);
    const leafSpacing = Math.max(5, Math.min(28, containerWidth / size));
    const nodeRadius = Math.max(2.5, Math.min(11, leafSpacing / 2.5));
    const showLabels = leafSpacing >= 14;

    const levelHeight = 40;
    const topPad = 20;
    const svgWidth = size * leafSpacing;
    const svgHeight = (numLevels + 1) * levelHeight + topPad * 2;

    const x = new Array(2 * size).fill(0);
    for (let i = 0; i < size; i++) {
        x[size + i] = i * leafSpacing + leafSpacing / 2;
    }
    for (let i = size - 1; i >= 1; i--) {
        x[i] = (x[2 * i] + x[2 * i + 1]) / 2;
    }

    const levelOfNode = (i) =>
        i >= size ? 0 : numLevels - Math.floor(Math.log2(i));
    const yForLevel = (level) =>
        topPad + (numLevels - level) * levelHeight + levelHeight / 2;

    let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">`;

    for (let i = 1; i < size; i++) {
        const y1 = yForLevel(levelOfNode(i));
        for (const child of [2 * i, 2 * i + 1]) {
            const y2 = yForLevel(levelOfNode(child));
            svg += `<line x1="${x[i]}" y1="${y1}" x2="${x[child]}" y2="${y2}" stroke="var(--border)" stroke-width="1"/>`;
        }
    }

    for (let i = 0; i < n; i++) {
        const isDone = done.has(i);
        const val = isDone ? null : leaves[i];
        svg += treeNode(
            x[size + i],
            yForLevel(0),
            nodeRadius,
            val,
            active.has(size + i) && !engine.disableFlashing,
            isDone,
            showLabels,
        );
    }

    for (let i = 1; i < size; i++) {
        const winner = tree[i];
        const val =
            winner < n && leaves[winner] !== Infinity ? leaves[winner] : null;
        svg += treeNode(
            x[i],
            yForLevel(levelOfNode(i)),
            nodeRadius,
            val,
            active.has(i) && !engine.disableFlashing,
            false,
            showLabels,
        );
    }

    svg += "</svg>";

    const wrap = document.createElement("div");
    wrap.className = "aux-tree-wrap";
    wrap.innerHTML = svg;
    innerEl.appendChild(wrap);
}

function treeNode(cx, cy, r, val, isActive, isDone, showLabels) {
    const stroke = isActive ? "var(--bar-compare)" : "var(--border)";
    const strokeWidth = isActive ? 2 : 1;
    const opacity = isDone || val === null ? 0.4 : 1;

    const circle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--bg)" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    if (!showLabels) {
        return `<g>${circle}</g>`;
    }

    const label = val === null ? "\u00b7" : String(val);
    const text = `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="10" font-family="ui-monospace, monospace" fill="var(--text)" opacity="${opacity}">${label}</text>`;

    return `<g>${circle}${text}</g>`;
}
