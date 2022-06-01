import React, { useState, useCallback, useMemo } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { CustomEditor, getHTML } from "./Utils";
import "./RichTextEditor.css";

// * Custom Elements
import { CodeElement, Leaf } from "./CustomElements";

const RichTextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem("content")) || [
        {
          type: "paragraph",
          children: [
            {
              text: "",
            },
          ],
        },
      ],
    []
  );

  const [editorValue, setEditorValue] = useState(initialValue);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "paragraph":
        return <p {...props.attributes}>{props.children}</p>;
      case "code":
        return <CodeElement {...props} />;
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="editor">
      <Toolbar
        editor={editor}
        settings={{
          bold: {
            toggle: CustomEditor.toggleBoldMark,
            isActive: CustomEditor.isBoldMarkActive,
          },
          code: {
            toggle: CustomEditor.toggleCodeBlock,
            isActive: CustomEditor.isCodeBlockActive,
          },
        }}
        utils={{
          toHTML: () => {
            const html = getHTML(editorValue);
            console.log("HTML: ", html);
            return html;
          },
        }}
      />
      <div className="editor__content">
        <Slate
          editor={editor}
          value={initialValue}
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => "selt_selection" !== op.type
            );
            if (isAstChange) {
              // Save value to local storage
              const content = JSON.stringify(value);
              localStorage.setItem("content", content);
            }
            setEditorValue(value);
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              if (event.key === "&") {
                event.preventDefault();
                editor.insertText("and");
              }

              if (event.ctrlKey) {
                switch (event.key) {
                  case "`":
                    event.preventDefault();
                    CustomEditor.toggleCodeBlock(editor);
                    break;

                  case "b":
                    event.preventDefault();
                    CustomEditor.toggleBoldMark(editor);
                    break;

                  default:
                    break;
                }
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
};

export default RichTextEditor;

const Toolbar = ({ editor, settings: { bold, code }, utils: { toHTML } }) => {
  return (
    <div className="editor__toolbar">
      <button
        className={`editor__toolbar__button ${
          bold.isActive(editor) && "editor__toolbar__active"
        }`}
        onMouseDown={(e) => {
          e.preventDefault();
          bold.toggle(editor);
        }}
      >
        <i className="material-icons editor__toolbar__icon">format_bold</i>
      </button>
      <button
        className={`editor__toolbar__button ${
          code.isActive(editor) && "active"
        }`}
        onMouseDown={(e) => {
          e.preventDefault();
          code.toggle(editor);
        }}
      >
        <i className="material-icons editor__toolbar__icon">code</i>
      </button>
      <button style={{ justifySelf: "end" }} onClick={toHTML}>
        To HTML
      </button>
    </div>
  );
};
