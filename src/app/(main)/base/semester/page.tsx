'use client'
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import OrderTable from '@/components/common/List/OrderTable';
import OrderList from '@/components/common/List/OrderList';
import { AddRounded } from '@mui/icons-material';
import { useUI } from '@/context/UI';
import { Alert, FormControl, FormLabel, Input } from '@mui/joy';
import { Stack } from '@mui/system';
import { DatePickerJalali } from '@/components/common/DatePickerJalali';
import { performPost } from '@/services/Instance/fetch.service';
import ListItem from '@/components/common/List';

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    startDate: HTMLInputElement;
    endDate: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

export default function Semester() {
    const { showModal, showAlert, closeModal } = useUI();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [change, setChange] = React.useState<Date>(new Date());

    function handleSubmit(event: React.FormEvent<SignInFormElement>) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        const formElements = event.currentTarget.elements;
        const serializedData: Record<string, any> = {};

        const formData = new FormData(form);

        formData.forEach((value, key) => {
            serializedData[key] = value;
        });


        if (!formElements.name.value) {
            formElements.name.focus()
            return showAlert('عنوان تحصیلی را وارد کنید', "danger");
        }
        if (!formElements.startDate.value) {
            return showAlert('تاریخ شروع تحصیلی را وارد کنید', "danger");
        }
        if (!formElements.endDate.value) {
            return showAlert('تاریخ پایان تحصیلی را وارد کنید', "danger");
        }
        // if (new Date(formElements.startDate.value.substring(0, 10)) >= new Date(formElements.endDate.value.substring(0, 10))) {
        //     formElements.endDate.focus()
        //     return showAlert('تاریخ پایان نمی تواند برابر یا کوچک تر از تاریخ شروع باشد', "danger");
        // }

        const data = {
            name: formElements.name.value,
            startDate: formElements.startDate.value,
            endDate: formElements.endDate.value,
        };

        setIsLoading(true)

        performPost("/semester", data).then(() => {
            setIsLoading(false)
            showAlert('با موفقیت ثبت شد', "success");
            setChange(new Date())
            closeModal()

        }).catch(err => {
            setIsLoading(false)
            showAlert(err.message, "danger");
        })
    }

    function handleShowModalAdd() {
        showModal({
            open: true,
            variant: "outlined",
            color: "primary",
            title: <h4>ثبت سال تحصیلی جدید</h4>,
            content: <div className='min-w-min md:min-w-[500px]'>
                <Alert {...{ title: 'Neutral', color: 'neutral' }} >اطلاعات نیم سال تحصیلی را وارد کنید.</Alert>
                <form
                    onSubmit={handleSubmit}
                >
                    <Stack spacing={2} mt={2}>
                        <FormControl>
                            <FormLabel>عنوان</FormLabel>
                            <Input autoFocus name="name" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>تاریخ شروع</FormLabel>
                            <DatePickerJalali name={"startDate"} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>تاریخ پایان</FormLabel>
                            <DatePickerJalali name={"endDate"} />
                        </FormControl>
                        <Button loading={isLoading} type="submit">ثبت اطلاعات</Button>
                    </Stack>
                </form>
            </div>,
            Actions: (
                <>

                </>
            )
        });
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
                            اطلاعات نیم سال تحصیلی
                        </Typography>
                        <div>
                            <Button
                                dir='ltr'
                                color="primary"
                                startDecorator={<AddRounded />}
                                size="sm"
                                onClick={handleShowModalAdd}
                            >
                                ثبت نیم سال
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
                    <ListItem path="/semester" change={change} haedItem={['عنوان', 'تاریخ شروع نیم سال', "تاریخ پایان نیم سال"]} />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}