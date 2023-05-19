import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { TodoListsPage } from "features/TodoListsPage/TodoListsPage";
import { Login } from "features/Auth/Login";
import { ROUTES } from "app/Routes";

export const Pages = () => {
    return (
        <div>
            <Routes>
                <Route path={"/"} element={<Navigate to={ROUTES.TODOLISTS} /> } />
                <Route path={ROUTES.TODOLISTS} element={<TodoListsPage />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.PAGE_NOT_FOUND} element={<h1>404: PAGE NOT FOUND</h1>} />
                <Route path={"*"} element={<Navigate to={ROUTES.PAGE_NOT_FOUND} />} />
            </Routes>
        </div>
    );
};
