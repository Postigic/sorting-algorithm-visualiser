import { engine } from "./core/engine.js";
import { setupToolbar } from "./ui/toolbar.js";
import { setupCanvas, drawBars, forceRefresh } from "./ui/canvas.js";
import { setupAuxRow } from "./ui/auxRow.js";
import {
    setupInfoPanel,
    updateInfoPanel,
    updateStats,
} from "./ui/infoPanel.js";

function renderLoop(now) {
    requestAnimationFrame(renderLoop);

    if (engine.running) {
        engine.tick(now);
        drawBars();
        updateStats();

        if (!engine.running) {
            document.querySelector("#run-btn").textContent = "Run";
            document.querySelector("#step-btn").disabled = false;
            forceRefresh();
        }
    }
}

function main() {
    setupToolbar(document.querySelector("#toolbar"));
    setupCanvas(
        document.querySelector("#bars-canvas"),
        document.querySelector("#depth-badge"),
    );
    setupAuxRow(document.querySelector("#aux-row"));
    setupInfoPanel(document.querySelector("#panels"));

    drawBars();
    updateInfoPanel();

    requestAnimationFrame(renderLoop);
}

main();
