import { engine } from "./core/engine.js";
import { setupToolbar } from "./ui/toolbar.js";
import { setupCanvas, drawBars } from "./ui/canvas.js";
import { setupAuxRow } from "./ui/auxRow.js";
import { setupFlashWarning } from "./ui/flashWarning.js";
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
        }
    }
}

function main() {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    );
    engine.disableFlashing = prefersReducedMotion.matches;

    setupToolbar(document.querySelector("#toolbar"));
    setupCanvas(
        document.querySelector("#bars-canvas"),
        document.querySelector("#depth-badge"),
    );
    setupAuxRow(document.querySelector("#aux-row"));
    setupFlashWarning(document.querySelector("#flash-warning-banner"));
    setupInfoPanel(document.querySelector("#panels"));

    prefersReducedMotion.addEventListener("change", (e) => {
        engine.disableFlashing = e.matches;
        const checkbox = document.querySelector("#disable-flashing-checkbox");
        if (checkbox) checkbox.checked = e.matches;
    });

    drawBars();
    updateInfoPanel();

    requestAnimationFrame(renderLoop);
}

main();
