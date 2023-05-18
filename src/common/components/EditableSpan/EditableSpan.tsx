import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { TextField } from "@mui/material";

type PropsType = {
    value: string;
    onChange: (newValue: string) => void;
};

export const EditableSpan: FC<PropsType> = React.memo(({ value, onChange }) => {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(value);
    };
    const activateViewMode = () => {
        setEditMode(false);
        onChange(title);
    };
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value);

    const onKeyDownChangeTitle = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            activateViewMode();
        }
    };

    return editMode ? (
        <TextField value={title}
                   onChange={changeTitle}
                   autoFocus
                   onBlur={activateViewMode}
                   onKeyDown={onKeyDownChangeTitle} />
    ) : (
        <span onDoubleClick={activateEditMode}>{value}</span>
    );
});
