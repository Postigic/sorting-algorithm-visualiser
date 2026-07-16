import { engine } from "../core/engine.js";
import { ALGO_INFO } from "../core/constants.js";

let els = {};

export function setupInfoPanel(container) {
    els = {
        desc: container.querySelector("#info-desc"),
        worst: container.querySelector("#info-worst"),
        avg: container.querySelector("#info-avg"),
        best: container.querySelector("#info-best"),
        aux: container.querySelector("#info-aux"),
        stable: container.querySelector("#info-stable"),
        inplace: container.querySelector("#info-inplace"),
        compares: container.querySelector("#stat-compares"),
        swaps: container.querySelector("#stat-swaps"),
        writes: container.querySelector("#stat-writes"),
    };
}

function metricEnabled(info, key) {
    if (!info.metrics) return true;
    if (!(key in info.metrics)) return true;
    return info.metrics[key];
}

export function updateInfoPanel() {
    const info = ALGO_INFO[engine.algoName];
    if (!info) return;

    els.desc.textContent = info.desc || "";
    els.worst.textContent = info.time_worst;
    els.avg.textContent = info.time_avg;
    els.best.textContent = info.time_best;
    els.aux.textContent = info.aux;
    els.stable.textContent =
        info.stable === null ? "N/A" : info.stable ? "Yes" : "No";
    els.inplace.textContent = info.inplace ? "Yes" : "No";

    updateStats(info);
}

export function updateStats(info) {
    const activeInfo = info || ALGO_INFO[engine.algoName];
    const { compares, swaps, writes } = engine.stats;

    els.compares.textContent = metricEnabled(activeInfo, "compares")
        ? compares
        : "N/A";
    els.swaps.textContent = metricEnabled(activeInfo, "swaps") ? swaps : "N/A";
    els.writes.textContent = metricEnabled(activeInfo, "writes")
        ? writes
        : "N/A";
}
