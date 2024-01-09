'use client'
import { DatePickerJalali } from "@/components/common/DatePickerJalali";
import WithoutNameLogo from "@/components/common/Logo/WithoutNameLogo";
import { useUI } from "@/context/UI";
import { useUser } from "@/context/User";
import { performPost } from "@/services/Instance/fetch.service";
import { Box, Button, Checkbox, Divider, FormControl, Input, Option, Select, Stack, Typography } from "@mui/joy";
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Link from "next/link";
import { useEffect, useState } from "react";

type FormInputKey = 'firstName' | 'lastName' | 'nationalCode' | 'phoneNumber' | 'birthDate' | 'gender' | 'password' | "ConfrimPassword";

interface FormInput {
    name: string;
    type: string;
    options?: JSX.Element;
}

const FormInputs: Record<FormInputKey, FormInput> = {
    "firstName": { name: "نام", type: "text" },
    "lastName": { name: "نام خانوادگی", type: "text" },
    "nationalCode": { name: "شماره شناسنامه", type: "text" },
    "phoneNumber": { name: "شماره تماس", type: "text" },
    "birthDate": { name: "تاریخ تولد", type: "date" },
    "gender": {
        name: "جنسیت", type: "select",
        options:
            <>
                <Option value="male">مذکر</Option>
                <Option value="female">مونث</Option>
            </>
    },
    "password": { name: "کلمه عبور", type: "password" },
    "ConfrimPassword": { name: "تکرار کلمه عبور", type: "password" },
} as const;


interface FormElements extends HTMLFormControlsCollection {
    firstName: HTMLInputElement;
    lastName: HTMLInputElement;
    nationalCode: HTMLInputElement;
    phoneNumber: HTMLInputElement;
    birthDate: HTMLDataElement;
    gender: HTMLInputElement;
    password: HTMLInputElement;
    ConfrimPassword: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
    firstName: string
}

function register() {
    const { showAlert } = useUI();
    const { login } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<SignInFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        const formElements = form.elements as FormElements;
        const serializedData: Record<string, any> = {};
        let isValid = true;

        // validate input
        for (const key of Object.keys(FormInputs) as FormInputKey[]) {
            if (!formElements[key].value) {
                showAlert(`لطفا ${FormInputs[key].name} خود را وارد کنید!`, "danger");
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            return;
        }
        setIsLoading(true);

        const formData = new FormData(form);

        formData.forEach((value, key) => {
            serializedData[key] = value;
        });
        serializedData["role"] = "student";

        performPost("/auth/register", serializedData)
            .then(res => {
                localStorage.setItem("accessToken", res.responseData.accessToken);
                localStorage.setItem("refreshToken", res.responseData.refreshToken);
                login();
                setIsLoading(false);
            }).catch(err => {
                setIsLoading(false);
                showAlert(err.message, "danger");
            });
    };

    useEffect(() => {
        let inp = document.getElementsByName("gender")[0] as HTMLInputElement;
        if (inp) {
            inp.name = "";
        }
    }, []);




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
                    width: 600,
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
                        <Typography level="h3">ثبت نام دانشجو</Typography>
                        <Typography level="body-sm">
                            حساب کاربری داری؟{' '}
                            <Link href="/login" className="text-sm">
                                ورود به حساب
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
                        <div className="grid grid-cols-2 gap-4">
                            {
                                Object.keys(FormInputs).map((key) => {
                                    const typedKey = key as FormInputKey;
                                    const { name, type, options } = FormInputs[typedKey];

                                    return (
                                        type === "date" ?
                                            <FormControl>
                                                <FormLabel>{name}</FormLabel>
                                                <DatePickerJalali name={key} />
                                            </FormControl>
                                            :
                                            type === "select" ?
                                                <FormControl>
                                                    <FormLabel>{name}</FormLabel>
                                                    <Select
                                                        name={key}
                                                        placeholder={name + " را انتخاب کنید "}
                                                    >
                                                        {options}
                                                    </Select>
                                                </FormControl>
                                                :
                                                <FormControl>
                                                    <FormLabel>{name}</FormLabel>
                                                    <Input type={type} name={key} />
                                                </FormControl>
                                    )
                                })
                            }
                        </div>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Checkbox size="sm" label="قبول دارم" name="persistent" />
                                <div className="w-2">{" "}</div>
                                <Link className="text-sm" href="#replace-with-a-link">
                                    شرایط و ضوابط استفاده
                                </Link>
                            </Box>
                            <Button loading={isLoading} type="submit" className='hover:opacity-90' variant='solid' fullWidth>
                                ثبت نام
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </>
    )
        ;
}

export default register;