import { engine } from "../core/engine.js";

const FLASH_WARNING_MIN_STEPS_PER_SEC = 3;
const FLASH_WARNING_MAX_N = 16;

const PROBLEMATIC_AUX_ALGS = new Set(["Extrapolate Sort"]);

let bannerEl = null;
let textEl = null;
let isShown = false;
let lastN = null;
let dismissedConfig = null;
let lastMessage = "";

export function setupFlashWarning(banner) {
    bannerEl = banner;
    textEl = banner.querySelector(".flash-warning-text");

    const dismissBtn = banner.querySelector(".flash-warning-dismiss");
    dismissBtn.addEventListener("click", () => {
        dismissedConfig = {
            n: lastN,
            speed: engine.speed,
            algorithm: engine.algoName,
        };
        hide();
    });
}

function theoreticalStepsPerSecond(speed) {
    return 1000 / (100 / speed);
}

export function updateFlashWarning(n) {
    if (!bannerEl) return;

    const causes = [];

    lastN = n;

    const rapidAnimationRisk =
        n <= FLASH_WARNING_MAX_N &&
        theoreticalStepsPerSecond(engine.speed) >=
            FLASH_WARNING_MIN_STEPS_PER_SEC;

    const problematicAuxRisk =
        PROBLEMATIC_AUX_ALGS.has(engine.algoName) &&
        theoreticalStepsPerSecond(engine.speed) >=
            FLASH_WARNING_MIN_STEPS_PER_SEC;

    if (rapidAnimationRisk) causes.push("the bars change colour very rapidly");

    if (problematicAuxRisk)
        causes.push(
            "the auxiliary visualisation contains only a few wide bars that flash over a large area",
        );

    const isRisky = !engine.disableFlashing && causes.length > 0;

    const configChangedSinceDismissal =
        dismissedConfig === null ||
        dismissedConfig.n !== n ||
        dismissedConfig.speed !== engine.speed ||
        dismissedConfig.algorithm !== engine.algoName;

    if (isRisky && configChangedSinceDismissal) {
        show(causes);
    } else {
        hide();
    }
}

function show(causes) {
    const message = `⚠ This configuration may produce rapid flashing that can be uncomfortable for some users or pose a risk to people with photosensitive epilepsy because ${causes.join(" and ")}. Consider a slower speed, more elements, or enabling Disable Flashing.`;

    if (message === lastMessage && isShown) return;

    lastMessage = message;
    isShown = true;
    textEl.textContent = message;
    bannerEl.classList.add("visible");
}

function hide() {
    if (!isShown) return;
    isShown = false;

    bannerEl.classList.remove("visible");
}
