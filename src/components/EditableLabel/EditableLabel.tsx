import React, { useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import "./EditableLabel.css";

interface EditableLabelPropsProps {
  labelname: string;
  saveCanvasTitle: (name: string) => void;
}

const EditableLabel = ({
  labelname,
  saveCanvasTitle,
}: EditableLabelPropsProps) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(labelname);

  useEffect(() => {
    setInputValue(labelname);
  }, [labelname]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;
    setInputValue(name);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value.trim();
    if (e.target.value === "") {
      setInputValue(labelname);
    } else {
      saveCanvasTitle(name);
    }
    setEditable(false);
  };

  return (
    <div className="editable-label-main-div">
      {editable && (
        <input
          autoFocus
          value={inputValue || ""}
          onChange={(e) => {
            handleOnChange(e);
          }}
          onBlur={(e) => {
            handleOnBlur(e);
          }}
        />
      )}
      {!editable && (
        <div
          className="not-editable-label-div"
          onClick={() => setEditable(true)}
        >
          {inputValue}
          <ModeEditIcon className="editable-mode-edit-icon" />
        </div>
      )}
    </div>
  );
};

export default EditableLabel;
