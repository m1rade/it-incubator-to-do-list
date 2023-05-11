import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./app/App";
import {Provider} from "react-redux";
import {store} from "app/store";
import {BrowserRouter} from "react-router-dom";


const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>
);

