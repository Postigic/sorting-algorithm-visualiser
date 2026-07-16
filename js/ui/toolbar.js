import { engine } from "../core/engine.js";
import { drawBars } from "./canvas.js";
import { updateInfoPanel } from "./infoPanel.js";
import { DATASET_NAMES, ALGO_NAMES, SIZES } from "../core/constants.js";
import { unlockAudioContext } from "../audio/audio.js";

const SPEEDS = {
    Glacial: 0.1,
    Slow: 0.2,
    Normal: 1.0,
    Fast: 5.0,
    Turbo: 15.0,
    Ludicrous: 50.0,
};

let els = {};

function resetControls() {
    els.runBtn.textContent = "Run";
    els.stepBtn.disabled = false;
}

function populateSelect(select, options, selected) {
    select.innerHTML = "";
    for (const opt of options) {
        const el = document.createElement("option");
        el.value = opt;
        el.textContent = opt;
        if (opt === selected) el.selected = true;
        select.appendChild(el);
    }
}

function onDatasetChange(e) {
    engine.setDataset(e.target.value);
    drawBars();
    updateInfoPanel();
    resetControls();
}

function onAlgoChange(e) {
    engine.setAlgo(e.target.value);
    drawBars();
    updateInfoPanel();
    resetControls();
}

function onShuffle() {
    engine.shuffle();
    drawBars();
    updateInfoPanel();
    resetControls();
}

function onRun() {
    unlockAudioContext();
    const nowRunning = engine.run();

    if (nowRunning) {
        els.stepBtn.disabled = true;
        els.runBtn.textContent = "Stop";
    } else {
        els.stepBtn.disabled = false;
        els.runBtn.textContent = "Run";
    }
}

function onStep() {
    unlockAudioContext();
    if (els.stepBtn.disabled) return;

    const alive = engine.step();
    drawBars();
    updateInfoPanel();

    if (!alive) els.runBtn.textContent = "Run";
}

function onSizeChange(e) {
    engine.setSize(Number(e.target.value));
    drawBars();
    updateInfoPanel();
    resetControls();
}

function onSpeedChange(e) {
    engine.speed = SPEEDS[e.target.value];
}

function onMute(e) {
    engine.muted = e.target.checked;
}

export function setupToolbar(container) {
    els = {
        algoSelect: container.querySelector("#algo-select"),
        datasetSelect: container.querySelector("#dataset-select"),
        sizeSelect: container.querySelector("#size-select"),
        speedSelect: container.querySelector("#speed-select"),
        muteCheckbox: container.querySelector("#mute-checkbox"),
        shuffleBtn: container.querySelector("#shuffle-btn"),
        stepBtn: container.querySelector("#step-btn"),
        runBtn: container.querySelector("#run-btn"),
    };

    populateSelect(els.algoSelect, ALGO_NAMES, engine.algoName);
    populateSelect(els.datasetSelect, DATASET_NAMES, "Random");
    populateSelect(els.sizeSelect, SIZES, String(engine.state.n));
    populateSelect(els.speedSelect, Object.keys(SPEEDS), "Normal");
    els.muteCheckbox.checked = engine.muted;

    els.algoSelect.addEventListener("change", onAlgoChange);
    els.datasetSelect.addEventListener("change", onDatasetChange);
    els.sizeSelect.addEventListener("change", onSizeChange);
    els.speedSelect.addEventListener("change", onSpeedChange);
    els.muteCheckbox.addEventListener("change", onMute);

    els.shuffleBtn.addEventListener("click", onShuffle);
    els.stepBtn.addEventListener("click", onStep);
    els.runBtn.addEventListener("click", onRun);

    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "SELECT" || e.target.tagName === "INPUT")
            return;

        if (e.code === "Space") {
            e.preventDefault();
            onRun();
        } else if (e.code === "ArrowRight") {
            onStep();
        } else if (e.code === "F5") {
            e.preventDefault();
            onShuffle();
        }
    });
}
