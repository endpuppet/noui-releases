// Entry point: the live eye in the hero (plus scroll reveals and nav), then the Get noUI card.
import { config } from "../config.js?v=3dcd0edb";
import { startDemo } from "./demo.js?v=3dcd0edb";
import { initDownload } from "./download.js?v=3dcd0edb";

startDemo();
initDownload(config);
