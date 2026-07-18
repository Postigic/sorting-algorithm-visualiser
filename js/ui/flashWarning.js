import { engine } from "../core/engine.js";

const FLASH_WARNING_MIN_STEPS_PER_SEC = 3;
const FLASH_WARNING_MAX_N = 16;

let bannerEl = null;
let textEl = null;
let isShown = false;
let lastN = null;
let dismissedConfig = null;

export function setupFlashWarning(banner) {
    bannerEl = banner;
    textEl = banner.querySelector(".flash-warning-text");

    const dismissBtn = banner.querySelector(".flash-warning-dismiss");
    dismissBtn.addEventListener("click", () => {
        dismissedConfig = { n: lastN, speed: engine.speed };
        hide();
    });
}

function theoreticalStepsPerSecond(speed) {
    return 1000 / (100 / speed);
}

export function updateFlashWarning(n) {
    if (!bannerEl) return;

    lastN = n;

    const isRisky =
        !engine.disableFlashing &&
        n <= FLASH_WARNING_MAX_N &&
        theoreticalStepsPerSecond(engine.speed) >=
            FLASH_WARNING_MIN_STEPS_PER_SEC;

    const configChangedSinceDismissal =
        dismissedConfig === null ||
        dismissedConfig.n !== n ||
        dismissedConfig.speed !== engine.speed;

    if (isRisky && configChangedSinceDismissal) {
        show();
    } else {
        hide();
    }
}

function show() {
    if (isShown) return;
    isShown = true;

    textEl.textContent =
        "⚠ This configuration may produce rapid flashing that can be uncomfortable for some users or pose a risk to people with photosensitive epilepsy. Consider a slower speed, more elements, or enabling Disable Flashing.";
    bannerEl.classList.add("visible");
}

function hide() {
    if (!isShown) return;
    isShown = false;

    bannerEl.classList.remove("visible");
}
