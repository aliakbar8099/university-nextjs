'use client'
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { AddRounded } from '@mui/icons-material';
import { useUI } from '@/context/UI';
import { Alert, FormControl, FormLabel, Input } from '@mui/joy';
import { Stack } from '@mui/system';
import { DatePickerJalali } from '@/components/common/DatePickerJalali';
import { performGet, performPost, performPut } from '@/services/Instance/fetch.service';
import ListItem from '@/components/common/List';

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    startDate: HTMLInputElement;
    endDate: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

type FormInputKey = 'name' | 'startDate' | 'endDate';

interface FormInput {
    name: string;
    type: string;
    value?: any;
    options?: JSX.Element;
}

const FormInputs: Record<FormInputKey, FormInput> = {
    "name": { name: "عنوان", type: "text" },
    "startDate": { name: "تاریخ شروع نیم سال", type: "date" },
    "endDate": { name: "تاریخ پایان نیم سال", type: "date" },
} as const;

// path uri
const pathname = "/semester"
const pageName = "نیم سال تحصیلی"

export default function Semester() {
    const { showModal, showAlert, closeModal } = useUI();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [change, setChange] = React.useState<Date>(new Date());

    function handleSubmit(event: React.FormEvent<SignInFormElement>, id?: number) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        const formElements: any = event.currentTarget.elements;
        const serializedData: Record<string, any> = {};

        const formData = new FormData(form);

        formData.forEach((value, key) => {
            serializedData[key] = value;
        });

        let isValid = true
        for (const key of Object.keys(FormInputs) as FormInputKey[]) {
            if (!formElements[key].value) {
                formElements[key].focus()
                showAlert(`لطفا ${FormInputs[key].name} را وارد کنید!`, "danger");
                isValid = false;
                break;
            }
        }
        if (!isValid) {
            return;
        }

        const data = {
            name: formElements.name.value,
            startDate: formElements.startDate.value,
            endDate: formElements.endDate.value,
        };

        setIsLoading(true)

        if (id) {
            performPut(`${pathname}/${id}`, data).then(() => {
                setIsLoading(false)
                showAlert('با موفقیت ویرایش شد', "success");
                setChange(new Date())
                closeModal()

            }).catch(err => {
                setIsLoading(false)
                showAlert(err.message, "danger");
            })
        } else {
            performPost(pathname, data).then(() => {
                setIsLoading(false)
                showAlert('با موفقیت ثبت شد', "success");
                setChange(new Date())
                closeModal()

            }).catch(err => {
                setIsLoading(false)
                showAlert(err.message, "danger");
            })
        }
    }

    function handleShowModalAdd(id?: number) {
        if (id) {
            performGet(`${pathname}/${id}`).then(res => {
                showModal({
                    open: true,
                    variant: "outlined",
                    color: "primary",
                    title: <h4>ویرایش {pageName}</h4>,
                    content: <div className='min-w-min md:min-w-[500px]'>
                        <Alert {...{ title: 'Neutral', color: 'warning' }} >اطلاعات {pageName} را بررسی و ویرایش کنید.</Alert>
                        <form
                            onSubmit={(e: React.FormEvent<SignInFormElement>) => handleSubmit(e, id)}
                        >
                            <Stack spacing={2} mt={2}>
                                {
                                    Object.keys(FormInputs).map((key) => {
                                        const typedKey = key as FormInputKey;
                                        const { name, type, options, value } = FormInputs[typedKey];

                                        if (type === "date") {
                                            return (
                                                <FormControl>
                                                    <FormLabel>{name}</FormLabel>
                                                    <DatePickerJalali name={key} defaultValue={res.responseData[key]} />
                                                </FormControl>
                                            )
                                        }
                                        return (
                                            <FormControl>
                                                <FormLabel>{name}</FormLabel>
                                                <Input autoFocus name={key} defaultValue={res.responseData[key]} />
                                            </FormControl>
                                        )
                                    })
                                }
                                <Button loading={isLoading} type="submit">ثبت ویرایش</Button>
                            </Stack>
                        </form>
                    </div>,
                });
            })
        } else {
            showModal({
                open: true,
                variant: "outlined",
                color: "primary",
                title: <h4>ثبت {pageName}</h4>,
                content: <div className='min-w-min md:min-w-[500px]'>
                    <Alert {...{ title: 'Neutral', color: 'neutral' }} >اطلاعات {pageName} را وارد کنید.</Alert>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <Stack spacing={2} mt={2}>
                            {
                                Object.keys(FormInputs).map((key) => {
                                    const typedKey = key as FormInputKey;
                                    const { name, type, options, value } = FormInputs[typedKey];

                                    if (type === "date") {
                                        return (
                                            <FormControl>
                                                <FormLabel>{name}</FormLabel>
                                                <DatePickerJalali name={key} defaultValue={value} />
                                            </FormControl>
                                        )
                                    }
                                    return (
                                        <FormControl>
                                            <FormLabel>{name}</FormLabel>
                                            <Input autoFocus name={key} defaultValue={value} />
                                        </FormControl>
                                    )
                                })
                            }
                            <Button loading={isLoading} type="submit">ثبت اطلاعات</Button>
                        </Stack>
                    </form>
                </div>,
            });
        }

    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '85vh',
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            mb: 1,
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'start', sm: 'center' },
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography level="h2" component="h1">
                            اطلاعات {pageName}
                        </Typography>
                        <div>
                            <Button
                                dir='ltr'
                                color="primary"
                                startDecorator={<AddRounded />}
                                size="sm"
                                onClick={() => handleShowModalAdd()}
                            >
                                ثبت {pageName}
                            </Button>
                            <Button
                                sx={{ mx: 1 }}
                                dir='ltr'
                                variant='outlined'
                                color="success"
                                startDecorator={<DownloadRoundedIcon />}
                                size="sm"
                            >
                                خروجی Excel
                            </Button>
                        </div>
                    </Box>
                    <ListItem path={pathname} pageName={pageName} change={change} handleShowModalAdd={handleShowModalAdd} haedItem={FormInputs} />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}