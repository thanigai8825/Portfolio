const $ = (selector) => document.querySelector(selector);
const number = (value) => String(value).padStart(2, "0");
const entries = library.flatMap((group, index) =>
  group.projects.map((project) => ({ ...project, group, shelf: index + 1 })),
);
let selected = "All work";
let current;
let opener;
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function visible() {
  return selected === "All work"
    ? entries
    : entries.filter((p) => p.group.short === selected);
}
function plate(project, asset, full = false) {
  const frame = el("span", "plate");
  const aspect = asset?.aspect || project.aspect;
  frame.classList.toggle("portrait-format", aspect === "portrait");
  frame.classList.toggle(
    "wide-format",
    aspect === "wide" || (project.layout === "wide" && aspect !== "portrait"),
  );
  if (!asset?.src) {
    frame.setAttribute("aria-hidden", "true");
    return frame;
  }
  frame.classList.add("has-media");
  if (asset.type === "video") {
    const video = el("video");
    video.preload = "metadata";
    video.playsInline = true;
    video.controls = full;
    if (asset.poster) video.poster = asset.poster;
    video.src = asset.src;
    video.setAttribute("aria-label", asset.alt || "Project video");
    if (asset.captions) {
      const track = el("track");
      Object.assign(track, {
        kind: "captions",
        label: "English",
        srclang: "en",
        src: asset.captions,
        default: true,
      });
      video.append(track);
    }
    frame.append(video);
  } else {
    const img = el("img");
    Object.assign(img, {
      src: asset.src,
      alt: asset.alt || "",
      loading: "lazy",
      decoding: "async",
    });
    frame.append(img);
  }
  return frame;
}
function title(p) {
  return p.title || "Project " + number(p.number);
}
const detail = $("#detail");
function openProject(p) {
  current = p;
  const info = el("div", "detail-info");
  const name = el("h2", "", title(p));
  name.id = "detail-title";
  info.append(
    el(
      "p",
      "detail-label",
      p.group.name + " / " + p.group.code + "–" + number(p.number),
    ),
    name,
  );
  if (p.brief) info.append(el("p", "", p.brief));
  const notes = el("dl");
  const fields = [
    ["context", "Business context"],
    ["opportunity", "Opportunity"],
    ["contribution", "My contribution"],
    ["approach", "Design approach"],
    ["execution", "Final execution"],
    ["impact", "Business impact"],
  ];
  for (const [key, label] of fields)
    if (p[key]) notes.append(el("dt", "", label), el("dd", "", p[key]));
  if (notes.children.length) info.append(notes);
  const gallery = el("div", "detail-gallery");
  gallery.style.setProperty("--tile", p.group.color);
  for (const asset of p.media.length ? p.media : [null])
    gallery.append(plate(p, asset, true));
  $("#detail-body").replaceChildren(info, gallery);
  if (!detail.open) {
    detail.showModal();
    $(".close").focus();
  }
  detail.scrollTop = 0;
}
function render() {
  const projects = $("#projects");
  const fragment = document.createDocumentFragment();
  for (const [index, group] of library.entries()) {
    if (selected !== "All work" && selected !== group.short) continue;
    const section = el("section", "group");
    section.style.setProperty("--tile", group.color);
    const head = el("div", "group-head");
    head.append(
      el("span", "group-code", number(index + 1) + " /"),
      el("h3", "", group.name),
    );
    const cards = el("div", "cards");
    for (const p of entries.filter((project) => project.group === group)) {
      const card = el("button", "card");
      card.type = "button";
      card.classList.toggle("wide", p.layout === "wide");
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute(
        "aria-label",
        "Open " + p.group.short + " · " + title(p),
      );
      const foot = el("span", "card-foot");
      const label = el("span");
      label.append(
        el("span", "code", p.group.code + "–" + number(p.number)),
        el("span", "card-title", title(p)),
      );
      const arrow = el("span", "arrow");
      arrow.setAttribute("aria-hidden", "true");
      foot.append(label, arrow);
      card.append(plate(p, p.media[0]), foot);
      card.addEventListener("click", () => {
        opener = card;
        openProject(p);
      });
      cards.append(card);
    }
    section.append(head, cards);
    fragment.append(section);
  }
  projects.replaceChildren(fragment);
  for (const button of $(".filters").children)
    button.setAttribute(
      "aria-pressed",
      String(button.textContent === selected),
    );
  $("#result-count").textContent = visible().length + " project slots shown";
}
for (const label of ["All work", ...library.map((g) => g.short)]) {
  const btn = el("button", "", label);
  btn.addEventListener("click", () => {
    selected = label;
    render();
  });
  $(".filters").append(btn);
}
$(".section-head sup").textContent = entries.length;
$(".section-nav a span").textContent = entries.length;
document.querySelectorAll("[data-view]").forEach((btn) =>
  btn.addEventListener("click", () => {
    $("#projects").classList.toggle("list", btn.dataset.view === "list");
    document
      .querySelectorAll("[data-view]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
  }),
);
$(".close").addEventListener("click", () => detail.close());
detail.addEventListener("close", () => {
  $("#detail-body").replaceChildren();
  opener?.focus({ preventScroll: true });
});
detail.addEventListener("click", (e) => {
  const box = detail.getBoundingClientRect();
  if (
    e.target === detail &&
    (e.clientX < box.left ||
      e.clientX > box.right ||
      e.clientY < box.top ||
      e.clientY > box.bottom)
  )
    detail.close();
});
function step(direction) {
  const list = visible();
  openProject(
    list[(list.indexOf(current) + direction + list.length) % list.length],
  );
}
$("#previous").addEventListener("click", () => step(-1));
$("#next").addEventListener("click", () => step(1));
render();

for (const group of library) {
  const item = el("details");
  item.style.setProperty("--tile", group.color);
  item.append(
    el("summary", "", group.name),
    el("p", "", group.summary),
    el("p", "", group.service),
  );
  $("#capabilities").append(item);
}
if (profile.portrait) {
  const image = el("img");
  image.alt = "Thanigaivel V";
  image.src = profile.portrait;
  $("#portrait").removeAttribute("aria-hidden");
  $("#portrait").replaceChildren(image);
}
for (const quote of profile.testimonials) {
  if (!quote.text || !quote.attribution) continue;
  const block = el("blockquote", "", quote.text);
  block.append(el("cite", "", quote.attribution));
  $("#quotes").append(block);
  $("#testimonials").hidden = false;
}

const rail = $(".rail"),
  menu = $(".menu");
function closeMenu(restoreFocus = false) {
  if (!rail.classList.contains("open")) return;
  rail.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  if (restoreFocus) menu.focus();
}
menu.addEventListener("click", () => {
  const opened = rail.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(opened));
});
rail
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu(true);
});
document.addEventListener("click", (e) => {
  if (!rail.contains(e.target)) closeMenu();
});
matchMedia("(min-width:851px)").addEventListener("change", () => closeMenu());
const links = [...document.querySelectorAll(".section-nav a")];
const sections = links.map((link) => document.querySelector(link.hash));
let scheduled = false;
function updateLocation() {
  scheduled = false;
  const threshold = window.innerHeight * 0.36;
  let index = 0;
  sections.forEach((section, i) => {
    if (section.getBoundingClientRect().top <= threshold) index = i;
  });
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 3
  )
    index = sections.length - 1;
  links.forEach((link, i) => {
    if (i === index) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
window.addEventListener(
  "scroll",
  () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateLocation);
    }
  },
  { passive: true },
);
updateLocation();
const observer = new IntersectionObserver((items) => {
  for (const item of items)
    if (item.isIntersecting) {
      item.target.classList.add("revealed");
      observer.unobserve(item.target);
    }
});
document
  .querySelectorAll(".editorial")
  .forEach((section) => observer.observe(section));
$("#copy").addEventListener("click", async () => {
  const address = "thanigaivel8825@gmail.com";
  try {
    await navigator.clipboard.writeText(address);
    $("#copy-status").textContent = "Email copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents($(".email-row a"));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    $("#copy-status").textContent = "Email selected. Use your copy command.";
  }
});
