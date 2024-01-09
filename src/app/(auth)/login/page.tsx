'use client'
import WithoutNameLogo from "@/components/common/Logo/WithoutNameLogo";
import { performPost } from "@/services/Instance/fetch.service";
import { Box, Button, Checkbox, Divider, FormControl, Input, Stack, Typography } from "@mui/joy";
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Link from "next/link";
import { useUI } from "@/context/UI";
import { useUser } from "@/context/User";
import { useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
    nationalCode: HTMLInputElement;
    password: HTMLInputElement;
    persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

function Login() {
    const { showAlert } = useUI();
    const { login } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();

        const formElements = event.currentTarget.elements;

        if (!formElements.nationalCode.value) {
            formElements.nationalCode.focus()
            return showAlert('لطفا شماره شناسنامه خود را وارد کنید!', "danger");
        }
        if (!formElements.password.value) {
            formElements.password.focus()
            return showAlert('لطفا رمز عبور خود را وارد کنید', "danger");
        }
        const data = {
            nationalCode: formElements.nationalCode.value,
            password: formElements.password.value,
        };
        setIsLoading(true)

        performPost("/auth/login", data)
            .then(res => {
                localStorage.setItem("accessToken", res.responseData.accessToken)
                localStorage.setItem("refreshToken", res.responseData.refreshToken)
                login()
                setIsLoading(false)
            }).catch(err => {
                setIsLoading(false)
                showAlert(err.message, "danger");
            })
    }

    return (
        <>
            <Box
                component="main"
                sx={{
                    my: 'auto',
                    py: 2,
                    pb: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: 400,
                    maxWidth: '100%',
                    mx: 'auto',
                    borderRadius: 'sm',
                    '& form': {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    },
                    [`& .${formLabelClasses.asterisk}`]: {
                        visibility: 'hidden',
                    },
                }}
            >
                <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                    <WithoutNameLogo width={100} height={100} />
                </Box>
                <Stack gap={4} sx={{ mb: 2 }}>
                    <Stack gap={1}>
                        <Typography level="h3">ورود دانشجو</Typography>
                        <Typography level="body-sm">
                            تا حالا عضو نشدی؟{' '}
                            <Link href="/register" className="text-sm">
                                ثبت نام
                            </Link>
                        </Typography>
                    </Stack>
                </Stack>
                <Divider
                    sx={(theme) => ({
                        [theme.getColorSchemeSelector('light')]: {
                            color: { xs: '#FFF', md: 'text.tertiary' },
                            '--Divider-lineColor': {
                                xs: '#FFF',
                                md: 'var(--joy-palette-divider)',
                            },
                        },
                    })}
                >
                    یا
                </Divider>
                <Stack gap={4} sx={{ mt: 2 }}>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <FormControl>
                            <FormLabel>شماره شناسنامه</FormLabel>
                            <Input type="text" name="nationalCode" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>کلمه عبور</FormLabel>
                            <Input type="password" name="password" />
                        </FormControl>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Checkbox size="sm" label="مرا بخاطر سپردن" name="persistent" />
                                <Link className="text-sm" href="#replace-with-a-link">
                                    کلمه عبور خود را فراموش کردم
                                </Link>
                            </Box>
                            <Button loading={isLoading} type="submit" className='hover:opacity-90' variant='solid' fullWidth>
                                وارد شدن
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </>
    )
        ;
}

export default Login;