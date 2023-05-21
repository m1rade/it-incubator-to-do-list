import { ROUTES } from "app/Routes";

export const TITLES: HTMLTitleType = {
    [ROUTES.HOME]: "Todolist App",
    [ROUTES.LOGIN]: "Login",
} as const

type HTMLTitleType = {
    [key: string]: string
}