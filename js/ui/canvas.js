import { engine } from "../core/engine.js";
import { renderAuxRow } from "./auxRow.js";

let ctx = null;
let canvasEl = null;
let depthBadgeEl = null;
let cachedColors = null;

const MIN_ACTIVE_REFRESH_MS = 80;
let lastActiveRefresh = 0;
let cachedActive = new Set();
let cachedActiveType = null;
let cachedSelfSwap = false;

function cssVar(name) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
}

function computeColors() {
    return {
        default: cssVar("--bar-default"),
        highlight: cssVar("--bar-highlight"),
        compare: cssVar("--bar-compare"),
        swap: cssVar("--bar-swap"),
        selfSwap: cssVar("--bar-self-swap"),
        write: cssVar("--bar-write"),
        sorted: cssVar("--bar-sorted"),
        pivot: cssVar("--bar-pivot"),
    };
}

export function setupCanvas(canvas, depthBadge) {
    canvasEl = canvas;
    ctx = canvas.getContext("2d");
    depthBadgeEl = depthBadge;
    cachedColors = computeColors();

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

    const { arr, sorted, pivot, n } = engine.state;
    const len = arr.length;

    const now = performance.now();
    const shouldRefreshActive =
        now - lastActiveRefresh >= MIN_ACTIVE_REFRESH_MS;
    if (shouldRefreshActive) {
        cachedActive = new Set(engine.state.active);
        cachedActiveType = engine.state.activeType;
        cachedSelfSwap = engine.state.selfSwap;
        lastActiveRefresh = now;
    }

    if (len > 0) {
        const dpr = window.devicePixelRatio || 1;
        const w = canvasEl.width / dpr;
        const h = canvasEl.height / dpr;

        ctx.clearRect(0, 0, w, h);

        const {
            default: colDefault,
            highlight: colHighlight,
            sorted: colSorted,
            pivot: colPivot,
            compare: colCompare,
            swap: colSwap,
            selfSwap: colSelfSwap,
            write: colWrite,
        } = cachedColors;
        const activeColor =
            { compare: colCompare, swap: colSwap, write: colWrite }[
                cachedActiveType
            ] || colHighlight;

        const barW = w / len;

        for (let i = 0; i < len; i++) {
            const val = arr[i];
            const barH = (val / n) * h;
            const x0 = i * barW;
            const y0 = h - barH;

            let color = colDefault;
            if (pivot.has(i)) color = colPivot;
            else if (cachedActive.has(i)) color = activeColor;
            else if (sorted.has(i)) color = colSorted;

            ctx.fillStyle = color;
            ctx.fillRect(x0, y0, Math.max(1, barW - 1), barH);

            if (
                cachedActiveType === "swap" &&
                cachedSelfSwap &&
                cachedActive.has(i)
            ) {
                ctx.save();
                ctx.strokeStyle = colSelfSwap;
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 3]);
                ctx.strokeRect(
                    x0 + 1,
                    y0 + 1,
                    Math.max(1, barW - 1) - 2,
                    Math.max(1, barH - 2),
                );
                ctx.restore();
            }
        }
    }

    updateDepthBadge();

    if (shouldRefreshActive) {
        renderAuxRow();
    }
}

export function forceRefresh() {
    lastActiveRefresh = 0;
    drawBars();
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
