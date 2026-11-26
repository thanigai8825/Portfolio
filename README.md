# Thanigai’s design library

Serve this directory with Python 3.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open localhost on port 8000. The site uses static HTML, CSS, JavaScript and local font files. The email link opens the visitor’s email application.

## Add work

Edit the four category records in `library.js`. Each category has a `slots` array. Add your project fields to a slot, or append another slot. Each category starts with one wide lead slot and three standard slots. The library count, filters and project navigation follow the array.

| Field | Use |
| --- | --- |
| `title`, `brief` | Project name and a short introduction |
| `media` | Ordered images and videos. The first asset supplies the card cover. |
| `aspect` | `landscape`, `portrait` or `wide`. An individual asset can override this field. |
| `layout` | `standard` for a grid item or `wide` to span the grid |
| `context`, `opportunity`, `contribution`, `approach`, `execution` | Optional case-study paragraphs |
| `impact` | An outcome you can verify |

Store media in `assets/`. An image takes `type: "image"`, `src` and descriptive `alt` text. A video takes `type: "video"`, `src`, `alt` and optional `poster` and WebVTT `captions` paths. Visitors play videos inside the project record. Media keeps its natural proportions within each frame.

## Profile and client quotations

Set `profile.portrait` in `library.js` to a local image path to replace the monogram. Add approved quotations to `profile.testimonials` with `text` and `attribution`. The client section appears once both fields are present.

## Design components

The profile rail, mobile navigation, library filters, project cards, media frames, project dialog and enquiry footer are separate elements. Color and typography tokens live at the top of `style.css`. When adapting the layout to Framer, each slot maps to a CMS item and its media frame has landscape, portrait and wide variants. The interactive metallic form is drawn locally by `form.js`.
