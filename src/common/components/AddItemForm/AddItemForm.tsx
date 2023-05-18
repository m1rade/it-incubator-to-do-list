import React, { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { AddBox } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { RejectedWithValueType } from "common/hooks";

type PropsType = {
    addItem: (title: string) => Promise<any>;
    disabled?: boolean;
};

export const AddItemForm: FC<PropsType> = React.memo(({ addItem, disabled = false }) => {
    let [title, setTitle] = useState("");
    let [error, setError] = useState<string | null>(null);

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title)
                .then(() => {
                    setTitle("");
                })
                .catch((e: RejectedWithValueType) => {
                    setError(e.data.messages.length ? "Title error" : "Some error");
                });
        } else {
            setError("Title is required");
        }
    };

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.key === "Enter") {
            addItemHandler();
        }
    };

    const onFocusHandler = () => {
        if (error !== null) setError(null);
    };

    return (
        <div>
            <TextField
                variant="outlined"
                disabled={disabled}
                error={!!error}
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                onFocus={onFocusHandler}
                label="Title"
                helperText={error}
            />
            <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
                <AddBox />
            </IconButton>
        </div>
    );
});
