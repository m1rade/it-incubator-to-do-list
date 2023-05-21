import React from "react";
import { Route, Routes } from "react-router-dom";
import { TodoListsPage } from "features/TodoListsPage/TodoListsPage";
import { Login } from "features/Auth/Login";
import { ROUTES } from "app/Routes";
import { PageNotFound } from "common/components";

export const Pages = () => {
    return (
        <div>
            <Routes>
                <Route path={ROUTES.HOME} element={<TodoListsPage />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={"*"} element={<PageNotFound />} />
            </Routes>
        </div>
    );
};
