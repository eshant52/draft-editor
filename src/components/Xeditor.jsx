import { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Button from "./Button";

export default function Xeditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef();

  // on initial load
  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    const contentState = convertFromRaw(JSON.parse(savedContent));
    setEditorState(EditorState.createWithContent(contentState));
  }, []);

  // Save content to localStorage when editor state changes
  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    if (contentState.getPlainText() !== "") {
      const contentJSON = convertToRaw(contentState);
      localStorage.setItem("editorContent", JSON.stringify(contentJSON));
    }
  }, [editorState]);

  function myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === "blockquote") {
      return "superFancyBlockquote";
    }
  }

  function onSave(e) {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const inlineStyle = editorState.getCurrentInlineStyle();
    console.log();
  }

  function handleChange(editorState) {
    setEditorState(editorState);
  }

  return (
    <div className="h-full space-y-2">
      <div className="flex justify- py-3 items-center">
        <div className="grow">
          <h1 className="text-xl font-semibold text-center">Title</h1>
        </div>
        <div>
          <Button onClick={onSave}>Save</Button>
        </div>
      </div>
      <div
        className="border-2 border-gray-600 rounded p-2 h-4/5 cursor-text overflow-y-scroll"
        onClick={() => {
          editorRef.current.focus();
        }}
      >
        <div>
          <div>
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={handleChange}
              blockStyleFn={myBlockStyleFn}
              placeholder="Write your content ..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
