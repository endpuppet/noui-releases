// Entry point: the live eye in the hero (plus scroll reveals and nav), then the Get noUI card.
import { config } from "../config.js?v=2ae45a49";
import { startDemo } from "./demo.js?v=2ae45a49";
import { initDownload } from "./download.js?v=2ae45a49";

startDemo();
initDownload(config);
