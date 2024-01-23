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
import { Alert, FormControl, FormLabel, Input, Option, Select } from '@mui/joy';
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

type FormInputKey = 'FSName' | 'fk_CollegeID';

interface FormInput {
    name: string;
    type: string;
    value?: any;
    options?: never[];
    dataType?: string;
}

interface IsubQuery {
    name: string;
    title: string;
    option: {
        key: string;
        value: string;
    }[];
}[]

const FormInputs: Record<FormInputKey, FormInput> = {
    "FSName": { name: "نام رشته", type: "text" },
    "fk_CollegeID": {
        name: "دانشکده",
        type: "select",
        dataType: "integer",
        options: []
    },
} as const;

// path uri
const pathname = "/field"
const pageName = "رشته تحصیلی"

const subQuery: IsubQuery[] = [{
    name: "CollegeID",
    title: "دانشکده",
    option: []
}]

function Forms(data: any, res?: any) {
    return (
        Object.keys(data).map((key) => {
            const typedKey = key as FormInputKey;
            const { name, type, options, value } = data[typedKey];

            if (type === "date") {
                return (
                    <FormControl>
                        <FormLabel>{name}</FormLabel>
                        <DatePickerJalali name={key} defaultValue={res?.responseData[key] ?? ""} />
                    </FormControl>
                )
            }
            if (type === "select") {
                return (
                    <FormControl>
                        <FormLabel>{name}</FormLabel>
                        <Select
                            name={key}
                            placeholder={name + " را انتخاب کنید "}
                        >
                            {
                                options.map((i: any) => (
                                    <Option value={i.id}>{i.CollegeName}</Option>
                                ))
                            }
                        </Select>
                    </FormControl>
                )
            }
            return (
                <FormControl>
                    <FormLabel>{name}</FormLabel>
                    <Input autoFocus name={key} defaultValue={res?.responseData[key] ?? ""} />
                </FormControl>
            )
        })
    )
}

export default function FeildPage({ readOnly = false , target = "" }) {
    const { showModal, showAlert, closeModal } = useUI();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLoading2, setIsLoading2] = React.useState<boolean>(false);
    const [change, setChange] = React.useState<Date>(new Date());

    React.useEffect(() => {
        setIsLoading2(true)
        performGet("/College").then(res => {
            FormInputs.fk_CollegeID.options = res.responseData;
            subQuery[0].option = res.responseData.map((i: any) => ({ key: i.id, value: i.CollegeName }))
            setIsLoading2(false)
        })
    }, [])

    function handleSubmit(event: React.FormEvent<SignInFormElement>, id?: number) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        const formElements: any = event.currentTarget.elements;
        const serializedData: Record<string, any> = {};

        const formData = new FormData(form);

        formData.forEach((value, key) => {
            const formInputKey = key as FormInputKey;
            if (FormInputs[formInputKey]?.dataType === "integer") {
                serializedData[formInputKey] = parseInt(value.toString());
            } else {
                serializedData[formInputKey] = value;
            }
        });

        let isValid = true
        for (const key of Object.keys(FormInputs) as FormInputKey[]) {
            if (!serializedData[key]) {
                // formElements[key]?.focus()
                showAlert(`لطفا ${FormInputs[key].name} را وارد کنید!`, "danger");
                isValid = false;
                break;
            }
        }
        if (!isValid) {
            return;
        }

        setIsLoading(true)

        if (id) {
            performPut(`${pathname}/${id}`, serializedData).then(() => {
                setIsLoading(false)
                showAlert('با موفقیت ویرایش شد', "success");
                setChange(new Date())
                closeModal()

            }).catch(err => {
                setIsLoading(false)
                showAlert(err.message, "danger");
            })
        } else {
            performPost(pathname, serializedData).then(() => {
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
                        <Alert {...{ title: 'Neutral', color: 'warning' }} >{pageName} را بررسی و ویرایش کنید.</Alert>
                        <form
                            onSubmit={(e: React.FormEvent<SignInFormElement>) => handleSubmit(e, id)}
                        >
                            <Stack spacing={2} mt={2}>
                                {Forms(FormInputs, res)}
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
                            {Forms(FormInputs)}
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
                    {!readOnly && <Box
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
                                loading={isLoading2}
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
                    </Box>}
                    <ListItem readOnly={readOnly} target={target} subQuery={subQuery} path={pathname} pageName={pageName} change={change} handleShowModalAdd={handleShowModalAdd} haedItem={FormInputs} />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}