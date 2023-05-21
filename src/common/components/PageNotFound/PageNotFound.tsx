import React from "react";
import error404 from "./400.svg";
import s from "./styles.module.css";
import { Link } from "react-router-dom";
import { ROUTES } from "app/Routes";

export const PageNotFound = () => {
    return (
        <div className={s.container}>
            <h1>Ooops, but the requested page is not found.</h1>
            <img src={error404} alt="page not found" />
            <div className={s.backLink}>
                <Link to={ROUTES.HOME}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};
