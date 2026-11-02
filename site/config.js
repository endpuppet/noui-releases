// The one switch for the "Get noUI" card. Locked is enforced in js/download.js: while
// `downloadLocked` is anything other than the boolean `false`, no release lookup is made and no
// download link is ever created. Unlock only when you are ready to hand builds out.
export const config = Object.freeze({
  downloadLocked: true,
  releasesRepo: "endpuppet/noui-releases",
  // Optional https link to a hosted copy of the web app; shown as the main button when unlocked.
  webAppUrl: "",
});

export default config;
