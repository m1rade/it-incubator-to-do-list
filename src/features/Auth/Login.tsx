import React from "react";
import { FormikHelpers, useFormik } from "formik";
import { Navigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { authThunks, LoginThunkReturnType } from "features/Auth/auth-reducer";
import { ROUTES } from "app/Pages";
import { RejectedWithValueType, useActions, useAppSelector } from "common/hooks";
import { selectCaptcha, selectIsLoggedIn } from "features/Auth/auth.selectors";
import { LoginParamsType } from "features/Auth/authAPI";

export const Login = () => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const captcha = useAppSelector(selectCaptcha);

    const { login } = useActions(authThunks);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
            captcha,
        },
        validate: (values: LoginParamsType) => {
            const errors: Partial<Omit<LoginParamsType, "rememberMe">> = {};
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
                .then((resp: LoginThunkReturnType) => {
                    if (resp.serverResp) {
                        resp.serverResp.fieldsErrors.forEach(f => {
                            f.field && formikHelpers.setFieldError(f.field, f.error);
                        });
                    }
                })
                .catch((reason: RejectedWithValueType) => {
                    reason.data.fieldsErrors.forEach(f => {
                        f.field && formikHelpers.setFieldError(f.field, f.error);
                    });
                });
        },
    });

    if (isLoggedIn) {
        return <Navigate to={ROUTES.TODOLIST} />;
    }

    return (
        <Grid container justifyContent="center">
            <Grid item justifyContent="center">
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered
                                <a href="https://social-network.samuraijs.com/" target="_blank" rel="noreferrer">
                                    {" "}
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                error={!!formik.touched.email && !!formik.errors.email}
                                helperText={formik.errors.email}
                                {...formik.getFieldProps("email")}
                                FormHelperTextProps={{
                                    style: {
                                        fontSize: "11pt",
                                    },
                                }}
                            />
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                error={!!formik.touched.password && !!formik.errors.email}
                                helperText={formik.errors.password}
                                FormHelperTextProps={{
                                    style: {
                                        fontSize: "11pt",
                                    },
                                }}
                                {...formik.getFieldProps("password")}
                            />
                            <FormControlLabel
                                label="Remember me"
                                control={
                                    <Checkbox
                                        {...formik.getFieldProps("rememberMe")}
                                        checked={formik.values.rememberMe}
                                    />
                                }
                            />
                            {captcha && (
                                <div>
                                    <img src={captcha} alt="captcha" />
                                    <TextField
                                        type="text"
                                        error={!!formik.touched.captcha && !!formik.errors.captcha}
                                        helperText={formik.touched.captcha && formik.errors.captcha && formik.errors.captcha}
                                        {...formik.getFieldProps("captcha")} />
                                </div>
                            )}
                            <Button type="submit" variant="contained" color="primary">
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
