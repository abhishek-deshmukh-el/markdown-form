# Markdown → Interactive Form (React + Vite)

Render **real, interactive HTML forms inside Markdown** using `react-markdown`, `remark-gfm`, and a **safe** `rehype-sanitize` schema extended for form tags/attrs.

> Goal: author forms in markdown (docs, checklists, reviews) and let users fill and submit them right in the UI.

---

## ✨ Features

- ✅ Markdown with GFM (tables, checklists, etc.)
- ✅ **Real `<form>` inputs**: `<input>`, `<select>`, `<textarea>`, `<button>`, `<fieldset>`, `<legend>`
- ✅ Custom **sanitization schema** to allow safe form attributes
- ✅ Event handling: capture `onSubmit` and input changes from markdown-rendered forms
- 🔒 Security-first rendering via `rehype-sanitize`

---

## 📦 Tech Stack

- React + Vite
- [`react-markdown`](https://github.com/remarkjs/react-markdown)
- [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
- [`rehype-raw`](https://github.com/rehypejs/rehype-raw) (for raw HTML in markdown)
- [`rehype-sanitize`](https://github.com/rehypejs/rehype-sanitize) with **custom schema** for form elements

---

## 🚀 Quick Start

```bash
# install
yarn

# dev
yarn dev

# build
yarn build

# preview production build
yarn preview
