import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const Editor = ({ onChange, value, onBlur, readOnly }) => {
  const editor = useRef(null);

  const config = {
    readonly: readOnly || false, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={1}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};

export default Editor;
