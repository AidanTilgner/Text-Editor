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
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

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
          openLinkModal: () => setIsLinkModalOpen(true),
          getEditorState: () => editorValue,
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
      <LinkModal
        open={isLinkModalOpen}
        close={(e) => {
          setIsLinkModalOpen(false);
        }}
        submit={(value) => {
          setIsLinkModalOpen(false);
          console.log("Value: ", value);
          CustomEditor.link.insert(editor, value);
        }}
      />
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
    link,
  },
  utils: { toHTML, openLinkModal, getEditorState },
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
          className={``}
          onClick={(e) => {
            e.preventDefault();
            // openLinkModal();
            const res = prompt("Enter a link");
            if (res) {
              CustomEditor.link.insert(editor, res);
            }
          }}
        >
          <i className="material-icons editor__toolbar__icon">link</i>
        </button>
      </div>
      <div className="section">
        <button
          onClick={(e) => {
            console.log("To HTML: ", toHTML());
          }}
        >
          To HTML
        </button>
        <button
          onClick={(e) => {
            console.log("Editor State: ", getEditorState());
          }}
        >
          Editor State
        </button>
      </div>
    </div>
  );
};

const LinkModal = ({ open, close, submit }) => {
  const [value, setValue] = useState("");
  return open ? (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.25)",
        display: "flex",
        justifyContent: "center",
      }}
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "500px",
          height: "fit-content",
          borderRadius: "7px",
          marginTop: "100px",
          boxShadow: "0 0 10px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2
          style={{
            margin: 0,
            padding: "14px 24px",
            marginBottom: "14px",
            borderBottom: "1px solid #eaeaea",
            fontWeight: "400",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Add Link{" "}
          <i
            className="material-icons"
            style={{ cursor: "pointer" }}
            title="Close modal"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            close
          </i>
        </h2>
        <input
          type="text"
          placeholder="Link URL"
          style={{
            margin: "14px 24px 36px 24px",
            padding: "8px 14px",
            boxSizing: "border-box",
            display: "block",
          }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            close(value);
            submit(value);
          }}
          style={{
            margin: "14px 24px",
            padding: "10px 24px",
            boxSizing: "border-box",
            display: "block",
            backgroundColor: "#2256f2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Add
        </button>
      </div>
    </div>
  ) : null;
};
