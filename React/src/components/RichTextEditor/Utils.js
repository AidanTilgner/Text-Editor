import { Editor, Transforms, Text } from "slate";
import escapeHTML from "escape-html";

export const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      mode: "all",
    });
    return !!match;
  },
  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      {
        match: (n) => Text.isText(n),
        split: true,
      }
    );
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });
    return !!match;
  },
  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(editor, { type: isActive ? "paragraph" : "code" });
  },
};

export const toHTML = (node) => {
  console.log("toHTML", node);
  if (Text.isText(node)) {
    let string = escapeHTML(node.text);
    if (node.bold) {
      string = `<b>${string}</b>`;
    }
    if (node.italic) {
      string = `<i>${string}</i>`;
    }
    return string;
  }

  const children = node.children?.map((n) => toHTML(n)).join("");

  switch (node.type) {
    case "paragraph":
      return `<p>${children}</p>`;
    case "code":
      return `<pre><code>${children}</code></pre>`;
    default:
      return children;
  }
};
