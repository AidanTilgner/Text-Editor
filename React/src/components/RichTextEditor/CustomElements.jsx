import { useFocused, useSelected, useSlateStatic } from "slate-react";
import { CustomEditor } from "./Utils";
import "./RichTextEditor.css";

export const CodeElement = (props) => {
  return (
    <p {...props.attributes}>
      <code>{props.children}</code>
    </p>
  );
};

export const Leaf = ({ leaf, attributes, children }) => {
  const styles = {
    fontWeight: leaf.bold ? "bold" : "normal",
    fontStyle: leaf.italic ? "italic" : "normal",
    textDecorationLine: (() => {
      let style = "";
      if (leaf.underline) {
        style += "underline ";
      }
      if (leaf.strikethrough) {
        style += "line-through ";
      }
      return style;
    })(),
    textAlign: leaf.align ? leaf.align : "left",
  };

  return (
    <span {...attributes} style={styles}>
      {children}
    </span>
  );
};

export const Link = ({ attributes, element, children }) => {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <span className="element-link">
      <a {...attributes} href={element.href}>
        {children}
      </a>
      {selected && focused && (
        <div className="popup" contentEditable={false}>
          <a href={element.href} rel="noreferrer" target="_blank" style={{textDecoration: "none"}}>
          <i className="material-icons">play_arrow</i>
            {element.href}
          </a>
          <button onClick={() => CustomEditor.link.remove(editor)}>
            <i className="material-icons">close</i>
          </button>
        </div>
      )}
    </span>
  );
};
