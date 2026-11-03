// Entry point: the live eye in the hero (plus scroll reveals and nav), then the Get noUI card.
import { config } from "../config.js?v=a25ac2e4";
import { startDemo } from "./demo.js?v=a25ac2e4";
import { initDownload } from "./download.js?v=a25ac2e4";

startDemo();
initDownload(config);
