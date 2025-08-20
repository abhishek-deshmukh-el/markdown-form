import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const formSafeSchema = {
  ...defaultSchema,
  // avoid prefixing ids/names (optional)
  clobberPrefix: "",
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "form","input","label","select","option","textarea","button","fieldset","legend","br"
  ],
  attributes: {
    ...defaultSchema.attributes,
    form: ["action","method","name","id","autocomplete","novalidate","data-form","className"],
    input: [
      "type","name","placeholder","required","checked","min","max","step","pattern","id","className","defaultValue"
      // intentionally NOT whitelisting "value" to avoid read-only inputs from Markdown
    ],
    select: ["name","required","multiple","size","id","className","defaultValue"],
    option: ["value","selected","label"],
    textarea: ["name","rows","cols","placeholder","required","id","className","defaultValue"],
    button: ["type","name","value","id","className"]
  }
};

function FormWrapper(props) {
  const [data, setData] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj = Object.fromEntries(fd.entries());
    setData(obj);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} {...props} />
      {data && <pre className="form-result">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default function App() {
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

  return (
    <>
      <style>{`
        .form-container { border:1px solid #ddd; padding:24px; border-radius:12px; background:#fafbfc; max-width:420px; margin:32px auto; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
        .form-container form label { display:block; margin-bottom:16px; font-weight:500; color:#222; }
        .form-container input[type="text"], .form-container input[type="email"], .form-container textarea, .form-container select {
          width:100%; padding:8px 10px; margin-top:4px; border:1px solid #ccc; border-radius:6px; font-size:1rem; box-sizing:border-box; background:#fff; transition:border 0.2s;
        }
        .form-container input[type="text"]:focus, .form-container input[type="email"]:focus, .form-container textarea:focus, .form-container select:focus { border-color:#0078d4; outline:none; }
        .form-container input[type="checkbox"] { margin-right:6px; }
        .form-container button[type="submit"] { background:#0078d4; color:#fff; border:none; padding:10px 22px; border-radius:6px; font-size:1rem; cursor:pointer; margin-top:8px; transition:background 0.2s; }
        .form-container button[type="submit"]:hover { background:#005fa3; }
        .form-result { background:#f7f7f7; padding:12px; margin-top:18px; border-radius:6px; font-size:0.95rem; color:#333; border:1px solid #eee; }
      `}</style>

      <ReactMarkdown
        // 1) allow raw HTML to be rendered
        skipHtml={false}
        // 2) raw HTML -> hast first
        rehypePlugins={[
          rehypeRaw,
          // 3) then sanitize with our allowlist
          [rehypeSanitize, formSafeSchema]
        ]}
        remarkPlugins={[remarkGfm]}
        components={{
          // map <form> to a React component with onSubmit handler
          form: ({ node, ...props }) => <FormWrapper {...props} />
          // (inputs/selects/textarea/buttons are fine as native elements)
        }}
      >
        {markdown}
      </ReactMarkdown>
    </>
  );
}
