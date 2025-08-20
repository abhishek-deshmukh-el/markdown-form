// App.jsx
import React, { useMemo, useRef, useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function App() {
  const [data, setData] = useState(null);
  const containerRef = useRef(null);

  // Your Markdown with an actual <form> inside
  const markdown = `
## Rendered from Markdown

<form data-form="feedback">
  <label>Name<br/><input type="text" name="name" placeholder="Jane Doe" required /></label><br/>
  <label>Email<br/><input type="email" name="email" placeholder="jane@example.com" required /></label><br/>
  <label>Phone<br/><input type="text" name="phone" placeholder="123-456-7890" /></label><br/>

  <label>Rating<br/>
    <select name="rating" required>
      <option value="">Pick one</option>
      <option value="1">1 - Meh</option>
      <option value="3">3 - OK</option>
      <option value="5">5 - Great</option>
    </select>
  </label><br/>

  <label>Favorite Feature<br/>
    <input type="checkbox" name="feature" value="UI" /> UI
    <input type="checkbox" name="feature" value="Performance" /> Performance
    <input type="checkbox" name="feature" value="Support" /> Support
  </label><br/>

  <label>Comments<br/><textarea name="comment" rows="3"></textarea></label><br/>

  <button type="submit">Send</button>
</form>
`.trim();

  // Convert MD -> HTML and sanitize (explicitly allow form controls)
  const sanitizedHtml = useMemo(() => {
    const raw = marked.parse(markdown);
    return DOMPurify.sanitize(raw, {
      ADD_TAGS: [
        "form",
        "input",
        "label",
        "select",
        "option",
        "textarea",
        "button",
        "fieldset",
        "legend",
        "br",
      ],
      ADD_ATTR: [
        "type",
        "name",
        "value",
        "placeholder",
        "required",
        "checked",
        "min",
        "max",
        "step",
        "pattern",
        "id",
        "class",
        "className",
        "autocomplete",
        "novalidate",
        "data-form",
        "rows",
        "cols",
        "multiple",
        "size",
      ],
    });
  }, [markdown]);

  // Native event delegation to capture <form> submit inside the HTML
  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    function onSubmit(e) {
      // Only handle real form submits
      if (!(e.target instanceof HTMLFormElement)) return;
      e.preventDefault();
      const fd = new FormData(e.target);
      // NOTE: for checkboxes with same name, only the last will appear in Object.fromEntries.
      // If you want ALL values, handle separately below.
      const obj = Object.fromEntries(fd.entries());

      // Collect multi-valued fields (e.g., checkboxes named "feature")
      const multi = {};
      for (const [k, v] of fd.entries()) {
        if (multi[k]) {
          if (Array.isArray(multi[k])) multi[k].push(v);
          else multi[k] = [multi[k], v];
        } else {
          multi[k] = v;
        }
      }

      setData({ ...obj, ...multi });
    }

    host.addEventListener("submit", onSubmit, true);
    return () => host.removeEventListener("submit", onSubmit, true);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        .form-container {
          border: 1px solid #ddd;
          padding: 24px;
          border-radius: 12px;
          background: #fafbfc;
          max-width: 520px;
          margin: 24px auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .form-container form label {
          display: block;
          margin-bottom: 16px;
          font-weight: 500;
          color: #222;
        }
        .form-container input[type="text"],
        .form-container input[type="email"],
        .form-container textarea,
        .form-container select {
          width: 100%;
          padding: 8px 10px;
          margin-top: 4px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
          background: #fff;
          transition: border 0.2s;
        }
        .form-container input[type="text"]:focus,
        .form-container input[type="email"]:focus,
        .form-container textarea:focus,
        .form-container select:focus {
          border-color: #0078d4;
          outline: none;
        }
        .form-container input[type="checkbox"] {
          margin-right: 6px;
        }
        .form-container button[type="submit"] {
          background: #0078d4;
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .form-container button[type="submit"]:hover {
          background: #005fa3;
        }
        .form-result {
          background: #f7f7f7;
          padding: 12px;
          margin: 18px auto 0;
          border-radius: 6px;
          font-size: 0.95rem;
          color: #333;
          border: 1px solid #eee;
          max-width: 520px;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>

      {/* Render sanitized HTML (all controls are native + interactive) */}
      <div
        ref={containerRef}
        className="form-container"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      {data && (
        <pre className="form-result">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
