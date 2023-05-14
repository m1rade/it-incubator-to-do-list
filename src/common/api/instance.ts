import axios from "axios";

// settings for server requests
export const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "c2f95e37-50c6-42af-975e-1d3b28d3998b",
    },
});