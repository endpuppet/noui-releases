// Entry point: the live eye in the hero (plus scroll reveals and nav), then the Get noUI card.
import { config } from "../config.js?v=c573433c";
import { startDemo } from "./demo.js?v=c573433c";
import { initDownload } from "./download.js?v=c573433c";

startDemo();
initDownload(config);
