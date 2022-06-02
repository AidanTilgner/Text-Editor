import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { CustomEditor, getHTML, keyDetection, renderingOptions } from "./Utils";
import { Leaf } from "./CustomElements";

import "./RichTextEditor.css";

const RichTextEditor = () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [
        {
          text: "Some initial text so I don't have to keep typing.",
        },
      ],
    },
  ];

  const [editor] = useState(() => withReact(createEditor()));
  const [editorValue, setEditorValue] = useState(initialValue);

  const renderElement = useCallback((props) => renderingOptions(props), []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="editor">
      <Toolbar
        editor={editor}
        settings={CustomEditor}
        utils={{
          toHTML: () => getHTML(editorValue),
        }}
      />
      <div className="editor__content">
        <Slate
          editor={editor}
          value={initialValue}
          onChange={(value) => {
            setEditorValue(value);
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              keyDetection(event, editor);
            }}
          />
        </Slate>
      </div>
    </div>
  );
};

export default RichTextEditor;

const Toolbar = ({
  editor,
  settings: {
    bold,
    code,
    italic,
    underline,
    strikethrough,
    alignLeft,
    alignCenter,
    alignRight,
  },
  utils: { toHTML },
}) => {
  return (
    <div className="editor__toolbar">
      <div className="section">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            bold.toggle(editor);
          }}
        >
          <i className="material-icons">format_bold</i>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            italic.toggle(editor);
          }}
        >
          <i className="material-icons">format_italic</i>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            underline.toggle(editor);
          }}
        >
          <i className="material-icons">format_underline</i>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            strikethrough.toggle(editor);
          }}
        >
          <i className="material-icons">strikethrough_s</i>
        </button>
      </div>
      <div className="section">
        <button
          className={`${alignLeft.isActive(editor) && "active"}`}
          onMouseDown={(e) => {
            e.preventDefault();
            alignLeft.toggle(editor);
          }}
        >
          <i className="material-icons editor__toolbar__icon">
            format_align_left
          </i>
        </button>
        <button
          className={`${alignCenter.isActive(editor) && "active"}`}
          onMouseDown={(e) => {
            e.preventDefault();
            alignCenter.toggle(editor);
          }}
        >
          <i className="material-icons editor__toolbar__icon">
            format_align_center
          </i>
        </button>
        <button
          className={`${alignRight.isActive(editor) && "active"}`}
          onMouseDown={(e) => {
            e.preventDefault();
            alignRight.toggle(editor);
          }}
        >
          <i className="material-icons editor__toolbar__icon">
            format_align_right
          </i>
        </button>
      </div>
      <div className="section">
        <button
          className={`${code.isActive(editor) && "active"}`}
          onMouseDown={(e) => {
            e.preventDefault();
            code.toggle(editor);
          }}
        >
          <i className="material-icons editor__toolbar__icon">code</i>
        </button>
        <button
          onClick={(e) => {
            console.log("To HTML: ", toHTML());
          }}
        >
          To HTML
        </button>
      </div>
    </div>
  );
};
