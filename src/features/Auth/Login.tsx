import React from "react";
import {FormikHelpers, useFormik} from "formik";
import {Navigate} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import {ROUTES} from "app/Pages";
import {selectCaptcha, selectIsLoggedIn} from "features/Auth/auth.selectors";
import {useActions, useAppSelector} from "common/hooks";
import {LoginParamsType} from "features/Auth/authAPI";
import {authThunks} from "features/Auth/auth-reducer";
import {ServerResponseType} from "common/types";


export const Login = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const captcha = useAppSelector(selectCaptcha);

    const {login} = useActions(authThunks)

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
            captcha,
        },
        validate: (values: LoginParamsType) => {
            const errors: Partial<Omit<LoginParamsType, "rememberMe" | "captcha">> = {}
            if (!values.email) {
                errors.email = "Required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address";
            }
            if (!values.password) {
                errors.password = "Required";
            } else if (values.password.length < 3) {
                errors.password = "Password must be 3 characters or more";
            }
            return errors;
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            login(values)
                .unwrap()
                .catch((reason: ServerResponseType) => {
                    reason.fieldsErrors.forEach(f => {
                        f.field && formikHelpers.setFieldError(f.field, f.error);
                    })
                })

        },
    });


    if (isLoggedIn) {
        return <Navigate to={ROUTES.TODOLIST}/>
    }

    return (
        <Grid container justifyContent={"center"}>
            <Grid item justifyContent={"center"}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>To log in get registered
                                <a href="https://social-network.samuraijs.com/"
                                   target="_blank" rel="noreferrer"> here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email"
                                       margin="normal"
                                       {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email &&
                                <div style={{color: "red"}}>{formik.errors.email}</div>}
                            <TextField type="password"
                                       label="Password"
                                       margin="normal"
                                       {...formik.getFieldProps("password")}
                            />
                            {formik.touched.password && formik.errors.password &&
                                <div style={{color: "red"}}>{formik.errors.password}</div>}
                            <FormControlLabel label={"Remember me"}
                                              control={<Checkbox {...formik.getFieldProps("rememberMe")}
                                                                 checked={formik.values.rememberMe}/>}
                            />
                            {captcha && <div>
                                <img src={captcha} alt="captcha"/>
                                <TextField type="text" {...formik.getFieldProps("captcha")} />
                                {formik.errors.captcha && <div style={{color: "red"}}>{formik.errors.captcha}</div>}
                            </div>}
                            <Button type={"submit"} variant={"contained"} color={"primary"}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    )
}