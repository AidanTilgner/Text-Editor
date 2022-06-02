import { Editor, Transforms, Text } from "slate";
import escapeHTML from "escape-html";
import { CodeElement } from "./CustomElements";

export const CustomEditor = {
  bold: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.bold === true,
        mode: "all",
      });
      return !!match;
    },
    toggle(editor) {
      const isActive = CustomEditor.bold.isActive(editor);
      Transforms.setNodes(
        editor,
        { bold: isActive ? null : true },
        {
          match: (n) => Text.isText(n),
          split: true,
        }
      );
    },
  },
  italic: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.italic === true,
        mode: "all",
      });
      return !!match;
    },
    toggle(editor) {
      const isActive = CustomEditor.italic.isActive(editor);
      Transforms.setNodes(
        editor,
        { italic: isActive ? null : true },
        {
          match: (n) => Text.isText(n),
          split: true,
        }
      );
    },
  },
  underline: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.underline === true,
        mode: "all",
      });
      return !!match;
    },
    toggle(editor) {
      const isActive = CustomEditor.underline.isActive(editor);
      Transforms.setNodes(
        editor,
        { underline: isActive ? null : true },
        {
          match: (n) => Text.isText(n),
          split: true,
        }
      );
    },
  },
  strikethrough: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.strikethrough === true,
        mode: "all",
      });
      return !!match;
    },
    toggle(editor) {
      const isActive = CustomEditor.strikethrough.isActive(editor);
      Transforms.setNodes(
        editor,
        { strikethrough: isActive ? null : true },
        {
          match: (n) => Text.isText(n),
          split: true,
        }
      );
    },
  },
  code: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "code",
      });
      return !!match;
    },
    toggle(editor) {
      const isActive = CustomEditor.code.isActive(editor);
      Transforms.setNodes(editor, { type: isActive ? "paragraph" : "code" });
    },
  },
  alignLeft: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "align-left",
      });
      return !!match;
    },
    toggle: (editor) => {
      const isActive = CustomEditor.alignLeft.isActive(editor);
      Transforms.setNodes(editor, { type: isActive ? null : "align-left" });
    },
  },
  alignCenter: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "align-center",
      });
      return !!match;
    },
    toggle: (editor) => {
      const isActive = CustomEditor.alignCenter.isActive(editor);
      Transforms.setNodes(editor, { type: isActive ? null : "align-center" });
    },
  },
  alignRight: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "align-right",
      });
      return !!match;
    },
    toggle: (editor) => {
      const isActive = CustomEditor.alignRight.isActive(editor);
      Transforms.setNodes(editor, { type: isActive ? null : "align-right" });
    },
  },
  blockquote: {
    isActive(editor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === "blockquote",
      });
      return !!match;
    },
    toggle: (editor) => {
      const isActive = CustomEditor.blockquote.isActive(editor);
      Transforms.setNodes(editor, { type: isActive ? null : "blockquote" });
    },
  },
};

export const keyDetection = (event, editor) => {
  if (event.key === "&") {
    event.preventDefault();
    editor.insertText("and");
  }

  if (event.ctrlKey) {
    switch (event.key) {
      case "`":
        event.preventDefault();
        CustomEditor.code.toggle(editor);
        break;

      case "b":
        event.preventDefault();
        CustomEditor.bold.toggle(editor);
        break;

      case "i":
        event.preventDefault();
        CustomEditor.italic.toggle(editor);
        break;

      case "u":
        event.preventDefault();
        CustomEditor.underline.toggle(editor);
        break;

      case "s":
        event.preventDefault();
        CustomEditor.strikethrough.toggle(editor);
        break;

      case "l":
        event.preventDefault();
        CustomEditor.alignLeft.toggle(editor);
        break;

      case "e":
        event.preventDefault();
        CustomEditor.alignCenter.toggle(editor);
        break;

      case "r":
        event.preventDefault();
        CustomEditor.alignRight.toggle(editor);
        break;

      default:
        break;
    }
  }
};

export const toHTML = (node) => {
  if (Text.isText(node)) {
    let string = escapeHTML(node.text);
    if (node.bold) {
      string = `<b>${string}</b>`;
    }
    if (node.italic) {
      string = `<i>${string}</i>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.strikethrough) {
      string = `<s>${string}</s>`;
    }
    return string;
  }

  const children = node.children?.map((n) => toHTML(n)).join("");

  switch (node.type) {
    case "paragraph":
      return `<p>${children}</p>`;
    case "code":
      return `<pre><code>${children}</code></pre>`;
    case "align-left":
      return `<p style="text-align: left">${children}</p>`;
    case "align-center":
      return `<p style="text-align: center">${children}</p>`;
    case "align-right":
      return `<p style="text-align: right">${children}</p>`;
    default:
      return children;
  }
};

export const getHTML = (value) => {
  let html = "";
  value.forEach((n) => {
    html += toHTML(n);
  });
  return html;
};

export const renderingOptions = (props) => {
  switch (props.element.type) {
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>;
    case "code":
      return <CodeElement {...props} />;
    case "align-left":
      return (
        <p {...props.attributes} style={{ textAlign: "left" }}>
          {props.children}
        </p>
      );
    case "align-center":
      return (
        <p {...props.attributes} style={{ textAlign: "center" }}>
          {props.children}
        </p>
      );
    case "align-right":
      return (
        <p {...props.attributes} style={{ textAlign: "right" }}>
          {props.children}
        </p>
      );
    default:
      return <p {...props.attributes}>{props.children}</p>;
  }
};
