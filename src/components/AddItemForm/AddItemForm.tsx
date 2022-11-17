import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

const AddItemForm = memo((props: AddItemFormPropsType) => {
    let [title, setTitle] = useState("");
    let [error, setError] = useState<boolean>(false);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    }

    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title.trim());
            setTitle("");
        } else {
            setError(true);
        }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        error && setError(false);
        if (e.key === "Enter") {
            addItem();
        }
    }

    return (
        <div>
            <TextField id="outlined-basic"
                       label={error ? "Title is required" : "Type a title"}
                       variant="outlined"
                       color="warning"
                       size="small"
                       value={title}
                       error={error}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyPressHandler}
            />
            <IconButton aria-label="add"
                        onClick={addItem}
                        color="warning"
                        disabled={props.disabled}
            >
                <AddIcon/>
            </IconButton>
        </div>
    );
});

export default AddItemForm;