// The "Get noUI" card. Locked is decided here, from the one flag in config.js, and fails closed:
// anything other than `downloadLocked === false` keeps the card locked, makes no network request and
// never creates a download link. index.html only links to the public Releases page.
export async function initDownload(config) {
  const card = document.getElementById("get-card");
  if (!card) return;
  if (config.downloadLocked !== false) {
    card.dataset.state = "locked";
    return;
  }

  const acts = document.getElementById("get-acts");
  const releasesLink = acts.lastElementChild; // keep "Releases on GitHub" at the end
  const safe = (u) => { try { const x = new URL(u); return x.protocol === "https:" ? x.href : ""; } catch { return ""; } };
  const button = (label, href, primary) => {
    const a = document.createElement("a");
    a.className = primary ? "btn btn-primary" : "btn btn-ghost";
    a.href = href;
    a.rel = "noopener";
    a.textContent = label;
    return a;
  };
  const show = (title, text, ver, links) => {
    document.getElementById("get-title").textContent = title;
    document.getElementById("get-text").textContent = text;
    document.getElementById("get-ver").textContent = ver;
    card.dataset.state = links.length ? "ready" : "empty";
    document.getElementById("get-icon").querySelector("use").setAttribute("href", links.length ? "#i-down" : "#i-lock");
    acts.replaceChildren(...links, releasesLink);
  };

  const links = [];
  const web = safe(config.webAppUrl);
  if (web) links.push(button("Open the web app", web, true));

  try {
    const r = await fetch(`https://api.github.com/repos/${config.releasesRepo}/releases?per_page=10`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!r.ok) throw new Error(String(r.status));
    const rel = (await r.json()).find((x) => !x.draft);
    const assets = rel?.assets ?? [];
    const pick = (re) => assets.find((a) => re.test(a.name));
    const builds = [
      ["Windows", pick(/setup.*\.exe$/i) ?? pick(/\.(exe|msi)$/i)],
      ["Android", pick(/\.apk$/i)],
      ["Web build (.zip)", pick(/web.*\.zip$/i)],
    ];
    for (const [label, asset] of builds) {
      const href = safe(asset?.browser_download_url ?? "");
      if (href) links.push(button(label, href, links.length === 0));
    }
    if (!links.length) throw new Error("no builds");
    show(`noUI ${rel?.tag_name ?? ""}`.trim(), "Pick your platform. Everything stays on your device.", rel ? `Released ${new Date(rel.published_at).toLocaleDateString()}` : "", links);
  } catch {
    if (links.length) show("Try noUI", "Runs in your browser. Everything stays on your device.", "", links);
    else show("No public build yet", "The releases repository has no published build at the moment. Check back soon.", "", []);
  }
}
