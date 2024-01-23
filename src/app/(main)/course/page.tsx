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
import { Forms } from '@/components/common/Forms/form';
import { FormInput, IsubQuery } from '@/components/common/Forms/main';
import ProfessorPage from '../professor/page';
import FeildPage from '../base/field/page';

interface SignInFormElement extends HTMLFormElement { }

type FormInputKey = "CTEID" | 'CFSID' | 'CREDIT' | 'COTYPE' | 'COTITLE' | 'TETITLE' | 'FSName' | 'CollegeName';

const FormInputs: Record<FormInputKey, FormInput> = {
    "COTITLE": { name: "عنوان درس", type: "text" },
    "COTYPE": {
        name: "سطح درس",
        type: "select",
        options: [
            { key: "A", value: "تخصصی" },
            { key: "B", value: "اصلی" },
            { key: "C", value: "پایه" },
            { key: "D", value: "عمومی" },
        ]
    },
    "CREDIT": {
        name: "واحد درس",
        type: "select",
        dataType: "integer",
        options: [
            { key: 4, value: "چهار واحدی" },
            { key: 3, value: "سه واحدی" },
            { key: 2, value: "دو واحدی" },
            { key: 1, value: "یک واحدی" },
        ]
    },
    "CFSID": {
        name: "شناسه رشته تحصیلی",
        type: "number",
        leftButton: { id: "field", name: "جستجو رشته" },
        dataType: "integer",
        noTable: true
    },
    "CTEID": {
        name: "شناسه استاد",
        type: "number",
        leftButton: { id: "teacher", name: "جستجو استاد" },
        dataType: "integer",
        noTable: true
    },
    "TETITLE": { name: "عنوان استاد", type: "text", noInput: true },
    "FSName": { name: "رشته تحصیلی", type: "text", noInput: true },
    "CollegeName": { name: "دانشکده", type: "text", noInput: true },
} as const;

// path uri
export const pathname = "/coureses"
export const pageName = "درس"

export const subQuery: IsubQuery[] = [
    {
        name: "COTYPE",
        title: "سطح درس",
        option: [
            { key: "A", value: "تخصصی" },
            { key: "B", value: "اصلی" },
            { key: "C", value: "پایه" },
            { key: "D", value: "عمومی" },
        ]
    }
]

export default function CoursePage({ target = "", readOnly = false }) {
    const { showModal, showAlert, closeModal } = useUI();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
    const [change, setChange] = React.useState<Date>(new Date());
    const [res, setRes] = React.useState(null)
    const [editId, setEditId] = React.useState(0)

    function handleSubmit(event: React.FormEvent<SignInFormElement>) {
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

        if (editId) {
            performPut(`${pathname}/${editId}`, serializedData).then(() => {
                setIsLoading(false)
                showAlert('با موفقیت ویرایش شد', "success");
                setChange(new Date())
                const form = document.querySelector("form") as HTMLFormElement
                setEditId(0)
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
        setEditId(id ?? 0)
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
                    id === "teacher" ?
                        <ProfessorPage target="CTEID" readOnly={true} />
                        :
                        id === "field" ?
                            <FeildPage target="CFSID" readOnly={true} />
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
                    {!readOnly && <>
                        <Alert {...{ title: 'Neutral', color: 'primary' }}>اطلاعات {pageName} را وارد کنید.</Alert>
                        <form onSubmit={handleSubmit} className='flex items-start flex-col lg:flex-row'>
                            <div className=' w-full lg:w-5/6 grid grid-cols-1 lg:grid-cols-3 gap-3 my-2 border-2 p-4 rounded-lg'>
                                {Forms(FormInputs, handleSearchOpen, res, isLoadingData)}
                            </div>
                            <div className=' w-full lg:w-1/6 p-4 flex justify-center items-center flex-row lg:flex-col h-full'>
                                <Button
                                    loading={isLoading}
                                    className='w-full min-w-max'
                                    type="submit">
                                    {
                                        editId ?
                                            "ویرایش اطلاعات"
                                            :
                                            "ثبت اطلاعات"
                                    }
                                </Button>
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
                    </>}
                    <ListItem readOnly={readOnly} target={target} subQuery={subQuery} path={pathname} pageName={pageName} change={change} handleShowModalAdd={handleShowEdit} haedItem={FormInputs} />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}