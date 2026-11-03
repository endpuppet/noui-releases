// Entry point: page chrome, the live stages, the roadmap, then the Get noUI card.
import { config } from "../config.js?v=63fb71e3";
import { initDownload } from "./download.js?v=63fb71e3";
import { initPage } from "./page.js?v=63fb71e3";
import { initRoadmap } from "./roadmap.js?v=63fb71e3";
import { initStages } from "./stages.js?v=63fb71e3";

initPage();
initStages();
initRoadmap();
initDownload(config);
