import { engine } from "./core/engine.js";
import { setupToolbar } from "./ui/toolbar.js";
import { setupCanvas, drawBars } from "./ui/canvas.js";
import {
    setupInfoPanel,
    updateInfoPanel,
    updateStats,
} from "./ui/infoPanel.js";

let frameCount = 0;

function renderLoop() {
    requestAnimationFrame(renderLoop);

    frameCount++;

    if (engine.running) {
        engine.tick(frameCount);
        drawBars();
        updateStats();

        if (!engine.running) {
            document.querySelector("#run-btn").textContent = "Run";
            document.querySelector("#step-btn").disabled = false;
        }
    }
}

function main() {
    setupToolbar(document.querySelector("#toolbar"));
    setupCanvas(
        document.querySelector("#bars-canvas"),
        document.querySelector("#depth-badge"),
    );
    setupInfoPanel(document.querySelector("#panels"));

    drawBars();
    updateInfoPanel();

    requestAnimationFrame(renderLoop);
}

main();
