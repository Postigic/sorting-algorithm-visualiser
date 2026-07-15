import { engine } from "../core/engine.js";

let ctx = null;
let canvasEl = null;
let depthBadgeEl = null;

function cssVar(name) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
}

export function setupCanvas(canvas, depthBadge) {
    canvasEl = canvas;
    ctx = canvas.getContext("2d");
    depthBadgeEl = depthBadge;

    resizeCanvas();
    window.addEventListener("resize", () => {
        resizeCanvas();
        drawBars();
    });
}

function resizeCanvas() {
    const rect = canvasEl.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
    canvasEl.style.width = `${rect.width}px`;
    canvasEl.style.height = `${rect.height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function drawBars() {
    if (!ctx) return;

    const { arr, active, sorted, pivot, n } = engine.state;
    const len = arr.length;
    if (len === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvasEl.width / dpr;
    const h = canvasEl.height / dpr;

    ctx.clearRect(0, 0, w, h);

    const colDefault = cssVar("--bar-default");
    const colActive = cssVar("--bar-active");
    const colSorted = cssVar("--bar-sorted");
    const colPivot = cssVar("--bar-pivot");

    const barW = w / len;

    for (let i = 0; i < len; i++) {
        const val = arr[i];
        const barH = (val / n) * h;
        const x0 = i * barW;
        const y0 = h - barH;

        let color = colDefault;
        if (pivot.has(i)) color = colPivot;
        else if (active.has(i)) color = colActive;
        else if (sorted.has(i)) color = colSorted;

        ctx.fillStyle = color;
        ctx.fillRect(x0, y0, Math.max(1, barW - 1), barH);
    }

    updateDepthBadge();
}

function updateDepthBadge() {
    if (!depthBadgeEl) return;

    const depth = engine.state.depth;
    if (depth > 0) {
        depthBadgeEl.textContent = `depth: ${depth}`;
        depthBadgeEl.classList.add("visible");
    } else {
        depthBadgeEl.classList.remove("visible");
    }
}
