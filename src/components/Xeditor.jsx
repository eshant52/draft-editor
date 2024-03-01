import { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils,
  getDefaultKeyBinding,
  SelectionState,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Button from "./Button";

// if new block added at the end and scroll is true
//  
// if end block is selected and key is shift+enter

export default function Xeditor() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [saved, setSaved] = useState(false);
  const editorRef = useRef();

  // on initial load
  // if there's content in local storage, we will populate that content to editor.
  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  // custom functions
  function getBlockOnSelect(editorState) {
    const currentContent = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getAnchorKey();
    const block = currentContent.getBlockForKey(blockKey);
    return block;
  }

  function removeBlockText(key, editorState, start, end) {
    const currentContent = editorState.getCurrentContent();

    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: start,
      focusOffset: end,
      hasFocus: true
    });

    const newContent = Modifier.removeRange(
      currentContent,
      newSelection,
      "backward"
    );

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      "remove-range"
    );

    return newEditorState;
  }

  // editor functions
  function onSave() {
    const contentState = editorState.getCurrentContent();
    if (contentState.hasText()) {
      const contentJSON = convertToRaw(contentState);
      localStorage.setItem("editorContent", JSON.stringify(contentJSON));
    }
    setSaved(true);
  }

  function customBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    switch (type) {
      case "header-one":
        return "text-xl font-bold";
      case "red-line":
        return "text-red-500";
      case "under-line":
        return "underline";
      case "bold":
        return "font-bold";
      default:
        return "";
    }
  }

  function handleChange(_editorState) {
    if (_editorState.getCurrentContent() != editorState.getCurrentContent()) {
      setSaved(false);
    }
    console.log(_editorState.getLastChangeType());
    setEditorState(_editorState);
  }

  function handleBeforeInput(chars, editorState) {
    const block = getBlockOnSelect(editorState);
    const blockText = block.getText();
    const isHash = blockText.startsWith("#");
    const isAsterisk = blockText.startsWith("*");
    const isAsterisk2 = blockText.startsWith("**");
    const isAsterisk3 = blockText.startsWith("***");

    if (chars === " " && isHash) {
      let newEditorState = RichUtils.toggleBlockType(editorState, "header-one");
      newEditorState = removeBlockText(
        block.key,
        newEditorState,
        0,
        1
      );
      setEditorState(newEditorState);
      return "handled";
    } else if (chars === " " && isAsterisk3) {
      console.log("***");
      let newEditorState = RichUtils.toggleBlockType(
        editorState,
        "under-line"
      );
      newEditorState = removeBlockText(
        block.key,
        newEditorState,
        0,
        3
      );
      setEditorState(newEditorState);
      return "handled";
    } else if (chars === " " && isAsterisk2) {
      console.log("**");
      let newEditorState = RichUtils.toggleBlockType(editorState, "red-line");
      newEditorState = removeBlockText(
        block.key,
        newEditorState,
        0,
        2
      );
      setEditorState(newEditorState);
      return "handled";
    } else if (chars === " " && isAsterisk) {
      console.log("*");
      let newEditorState = RichUtils.toggleBlockType(editorState, "bold");
      newEditorState = removeBlockText(
        block.key,
        newEditorState,
        0,
        1
      );
      setEditorState(newEditorState);
      return "handled";
    }
    return "not-handled";
  }

  function myKeyBindingFn(e) {
    if (e.keyCode === 13 && e.shiftKey) {
      return "soft-new-line";
    }
    return getDefaultKeyBinding(e);
  }

  function handleKeyCommand(command, editorState) {
    let newState = editorState;

    switch (command) {
      case "soft-new-line":
        newState = RichUtils.insertSoftNewline(newState);
        break;
      default:
        newState = RichUtils.handleKeyCommand(newState, command);
        break;
    }

    if (newState) {
      console.log(command);
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  }

  function handleFocus(e) {
    e.stopPropagation();
    editorRef.current.focus();
  }

  function handleEndFocus(e) {
    e.stopPropagation();
    setEditorState(EditorState.moveFocusToEnd(editorState));
  }

  return (
    <div className="h-full space-y-2">
      <div className="flex justify- py-3 items-center">
        <div className="grow">
          <h1 className="text-xl font-semibold text-center">Demo editor by Eshant</h1>
        </div>
        <div>
          <Button onClick={onSave} disabled={saved}>
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
      <div
        className="border-2 border-gray-600 rounded p-2 h-4/5 cursor-text overflow-y-scroll"
        onClick={handleEndFocus}
      >
        <div onClick={handleFocus}>
          <div>
            <Editor
              ref={editorRef}
              editorState={editorState}
              onChange={handleChange}
              blockStyleFn={customBlockStyleFn}
              placeholder="Write your content ..."
              handleBeforeInput={handleBeforeInput}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={myKeyBindingFn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
