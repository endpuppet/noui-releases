// The roadmap is data: edit data/roadmap.json (one line per phase) and reload. If that file can't be
// fetched (offline, opened from disk), the copy inlined in index.html is shown instead.
import { observeReveals } from "./page.js?v=63fb71e3";

const LABELS = { done: "Done", next: "Next", planned: "Planned", later: "Later" };

function valid(data) {
  return (
    data &&
    Array.isArray(data.items) &&
    data.items.length > 0 &&
    data.items.every((i) => i && typeof i.title === "string" && typeof i.text === "string" && i.status in LABELS)
  );
}

function render(data) {
  const list = document.getElementById("roadmap-list");
  const items = data.items.map((item) => {
    const li = document.createElement("li");
    li.className = `reveal is-${item.status}`;
    const dot = document.createElement("span");
    dot.className = "t-dot";
    const body = document.createElement("div");
    const tag = document.createElement("span");
    tag.className = `tag tag-${item.status}`;
    tag.textContent = LABELS[item.status];
    const title = document.createElement("h3");
    title.textContent = item.title;
    const text = document.createElement("p");
    text.textContent = item.text;
    body.append(tag, title, text);
    li.append(dot, body);
    return li;
  });
  list.replaceChildren(...items);
  document.getElementById("roadmap-summary").textContent = typeof data.summary === "string" ? data.summary : "";
  const when = Date.parse(data.updated ?? "");
  document.getElementById("roadmap-updated").textContent = Number.isNaN(when)
    ? ""
    : `Updated ${new Date(when).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}.`;
  observeReveals(list);
}

export async function initRoadmap() {
  try {
    const fallback = JSON.parse(document.getElementById("roadmap-fallback").textContent);
    if (valid(fallback)) render(fallback);
  } catch {
    /* no usable fallback: wait for the file */
  }
  try {
    const res = await fetch("data/roadmap.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (valid(data)) render(data);
  } catch {
    /* keep whatever is already shown */
  }
}
