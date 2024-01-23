'use client'
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { CloseRounded } from '@mui/icons-material';
import { useUI } from '@/context/UI';
import { Alert, IconButton } from '@mui/joy';
import { performGet, performPost, performPut } from '@/services/Instance/fetch.service';
import ListItem from '@/components/common/List';
import UsersPage from '../base/users/page';
import { Forms } from '@/components/common/Forms/form';
import { FormInput, IsubQuery } from '@/components/common/Forms/main';

interface SignInFormElement extends HTMLFormElement { }

type FormInputKey = "firstName" | 'lastName' | 'STLEV' | 'FSName' | 'CollegeName' | 'CollegeID' | 'FSID' | 'semesterID' | 'userId' | 'semesterName';

const FormInputs: Record<FormInputKey, FormInput> = {
    "firstName": { name: "دانشکده", type: "text", noInput: true },
    "lastName": { name: "دانشکده", type: "text", noInput: true },
    "STLEV": {
        name: "سطح دانشجو",
        type: "select",
        options: [
            { key: "کارشناسی", value: "کارشناسی" },
            { key: "کارشناسی ارشد", value: "کارشناسی ارشد" },
            { key: "تحصیلات تکمیلی", value: "تحصیلات تکمیلی" },
        ]
    },
    "CollegeID": {
        name: "دانشکده",
        type: "select",
        dataType: "integer",
        noTable: true,
        options: []
    },
    "FSID": {
        name: "رشته تحصیلی",
        type: "select",
        dataType: "integer",
        noTable: true,
        options: []
    },
    "semesterID": {
        name: "نیم سال",
        type: "select",
        dataType: "integer",
        noTable: true,
        options: []
    },
    "semesterName": { name: "نیم سال", type: "text", noInput: true },
    "userId": {
        name: "شناسه کاربری",
        type: "number",
        leftButton: { id: "users", name: "جستجو کاربران" },
        dataType: "integer",
        noTable: true
    },
    "FSName": { name: "رشته تحصیلی", type: "text", noInput: true },
    "CollegeName": { name: "دانشکده", type: "text", noInput: true },
} as const;

// path uri
export const pathname = "/students"
export const pageName = "دانشجو"

export const subQuery: IsubQuery[] = [{
    name: "CollegeID",
    title: "رشته تحصیلی",
    option: []
}]

export default function Semester() {
    const { showModal, showAlert, closeModal } = useUI();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
    const [change, setChange] = React.useState<Date>(new Date());
    const [isLoadingSelect, setIsLoadingSelect] = React.useState<boolean>(false);
    const [res, setRes] = React.useState(null)
    const [select, setSelect] = React.useState(0);

    React.useEffect(() => {
        setIsLoadingData(true)
        performGet("/semester").then(res => {
            FormInputs.semesterID.options = res.responseData.map((i: any) => ({ key: i.id, value: i.name }));
            performGet("/College").then(res => {
                FormInputs.CollegeID.options = res.responseData.map((i: any) => ({ key: i.id, value: i.CollegeName }));
                setIsLoadingData(false)
            })
        })
    }, [])

    React.useEffect(() => {
        if (!!select) {
            setIsLoadingSelect(true)
            performGet(`/field?CollegeID=${select}`).then(res => {
                FormInputs.FSID.options = res.responseData.map((i: any) => ({ key: i.id, value: i.FSName }));
                setIsLoadingSelect(false)
            })
        }
    }, [select])

    function handleSubmit(event: React.FormEvent<SignInFormElement>, id?: number) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
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
            if (!serializedData[key] && !FormInputs[key].noInput) {
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
                const form = document.querySelector("form") as HTMLFormElement
                form.reset()

            }).catch(err => {
                setIsLoading(false)
                showAlert(err.message, "danger");
            })
        } else {
            performPost(pathname, serializedData).then(() => {
                setIsLoading(false)
                showAlert('با موفقیت ثبت شد', "success");
                setChange(new Date())
                const form = document.querySelector("form") as HTMLFormElement
                form.reset()

            }).catch(err => {
                setIsLoading(false)
                showAlert(err.message, "danger");
            })
        }
    }

    function handleShowEdit(id?: number) {
        performGet(`${pathname}/${id}`).then(res => {
            setRes(res)
        })
    }

    const handleSearchOpen = (id: string, name: string) => {
        showModal({
            open: true,
            variant: "outlined",
            color: "primary",
            title: <div className='flex justify-between items-center w-full'>
                <h4>{name}</h4>
                <IconButton onClick={closeModal}>
                    <CloseRounded />
                </IconButton>
            </div>,
            content: <div>
                {
                    id === "users" ?
                        <UsersPage target="userId" readOnly={true} />
                        :
                        <></>
                }
            </div>,
        });
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <Box
                    component="main"
                    className="MainContent pt-4"
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
                    {/* <Alert {...{ title: 'Neutral', color: 'warning' }} >{pageName} را بررسی و ویرایش کنید.</Alert> */}
                    <Alert {...{ title: 'Neutral', color: 'primary' }}>اطلاعات {pageName} را وارد کنید.</Alert>
                    <form onSubmit={handleSubmit} className='flex items-start flex-col lg:flex-row'>
                        <div className=' w-full lg:w-5/6 grid grid-cols-1 lg:grid-cols-3 gap-3 my-2 border-2 p-4 rounded-lg'>
                            {Forms(FormInputs, handleSearchOpen, res, isLoadingData, setSelect, "CollegeID")}
                        </div>
                        <div className=' w-full lg:w-1/6 p-4 flex justify-center items-center flex-row lg:flex-col h-full'>
                            <Button
                                loading={isLoading}
                                className='w-full min-w-max'
                                type="submit">ثبت اطلاعات</Button>
                            <Button
                                sx={{ mx: 1 }}
                                dir='ltr'
                                variant='outlined'
                                className='w-full mt-2 min-w-max'
                                color="success"
                                type='button'
                                startDecorator={<DownloadRoundedIcon />}
                                size="sm"
                            >
                                خروجی Excel
                            </Button>
                        </div>
                    </form>
                    <ListItem subQuery={subQuery} path={pathname} pageName={pageName} change={change} handleShowModalAdd={handleShowEdit} haedItem={FormInputs} />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}