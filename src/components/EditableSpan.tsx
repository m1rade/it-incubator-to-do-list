import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

const EditableSpan = memo((props: EditableSpanPropsType) => {
    console.log("EditableSpan")
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState(props.title);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }


    const onEditMode = () => setEditMode(true);
    const offEditMode = () => {
        setEditMode(false);
        props.changeTitle(title);
    }

    const onKeyDownOffEditMode = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && offEditMode();
    }

    return (
        editMode
            ? <TextField
                id="outlined-basic"
                variant="outlined"
                color="warning"
                size="small"
                autoFocus
                onBlur={offEditMode}
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownOffEditMode}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
});

export default EditableSpan;