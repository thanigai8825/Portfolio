// Add a local portrait path and approved client quotations when available.
const profile = { portrait: "", testimonials: [] };

// Each slot accepts a title, a brief, media, and optional case-study notes.
// For video use {type: 'video', src: 'assets/film.mp4', alt: '...', poster: '...', captions: 'assets/captions.vtt'}.
// Use layout: 'wide' for a full-row feature, or aspect: 'portrait' for vertical work.
function projectSlot(number) {
  return {
    number,
    title: "",
    brief: "",
    aspect: "landscape",
    layout: "standard",
    media: [],
    context: "",
    opportunity: "",
    contribution: "",
    approach: "",
    execution: "",
    impact: "",
  };
}
const library = [
  {
    name: "Product & UI/UX Design",
    short: "Product",
    code: "P",
    slots: [{ layout: "wide" }, {}, {}, {}],
    color: "#dce2d4",
    summary:
      "Digital products, SaaS platforms, AI-powered applications, dashboards and mobile experiences.",
    service:
      "For a product that needs to be easier to understand or use. I map the core journey, prototype the interactions and design the screens and states that hold it together.",
  },
  {
    name: "Website Design & Development",
    short: "Website",
    code: "W",
    slots: [{ layout: "wide" }, {}, {}, {}],
    color: "#dce2e7",
    summary:
      "Premium websites, startup landing pages, responsive interfaces and Framer development.",
    service:
      "For a business with a story to tell online. I shape the information, design across breakpoints and translate the system into a responsive website or Framer build.",
  },
  {
    name: "Branding & Visual Design",
    short: "Branding",
    code: "B",
    slots: [{ layout: "wide" }, {}, {}, {}],
    color: "#e9dfd5",
    summary:
      "Visual identities, brand systems, marketing materials and investor pitch decks.",
    service:
      "For a business finding its voice or preparing for a new audience. I connect identity, typography, visual language and pitch materials around one clear idea.",
  },
  {
    name: "Motion & Creative Design",
    short: "Motion",
    code: "M",
    slots: [{ layout: "wide" }, {}, {}, {}],
    color: "#e1dce8",
    summary:
      "Motion graphics, promotional videos, product showcases and visual storytelling.",
    service:
      "For an idea that needs time and movement to make sense. I work from story and style frames through timing, transitions and final delivery.",
  },
].map((group) => ({
  ...group,
  projects: group.slots.map((slot, index) => ({
    ...projectSlot(index + 1),
    ...slot,
  })),
}));
