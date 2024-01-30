'use client'
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded';
import { CheckRounded, CloseRounded, DeleteOutline, EditRoadOutlined, EditRoadRounded } from '@mui/icons-material';
import { useUI } from '@/context/UI';
import { Alert, FormControl, FormLabel, IconButton, Input, Tooltip } from '@mui/joy';
import { performGet, performPost, performPut } from '@/services/Instance/fetch.service';
import ListItem from '@/components/common/List';
import { Forms } from '@/components/common/Forms/form';
import { FormInput, IsubQuery } from '@/components/common/Forms/main';
import { useUser } from '@/context/User';
import { Stack } from '@mui/system';

interface SignInFormElement extends HTMLFormElement { }

type FormInputKey = "CourseName" | "fullName" | 'StudentID';

const FormInputs: Record<FormInputKey, FormInput> = {
    "CourseName": { name: "عنوان واحد", type: "text", noInput: true },
    "StudentID": { name: "شماره دانشجویی", type: "text", noInput: true },
    "fullName": { name: "نام و نام خانوادگی دانشجو", type: "text", noInput: true },
} as const;

// path uri
export const pathname = "/course-registration/teacher"
export const pageName = "نمرات دانشجو"

export const subQuery: IsubQuery[] = [
    {
        name: "courseId",
        title: "دروس",
        option: []
    }
]

export default function SelectUnitPage({ target = "", readOnly = false }) {
    const { showModal, showAlert, closeModal } = useUI();
    const { semester, student } = useUser();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
    const [change, setChange] = React.useState<Date>(new Date());
    const [res, setRes] = React.useState(null)
    const [editId, setEditId] = React.useState(0)

    React.useEffect(() => {
        performGet("/coureses/teacher").then(res => {
            subQuery[0].option = res.responseData.map((i: any) => ({ key: i.COID, value: i.COTITLE }))
        })
    }, [])

    function handleSubmit(event: React.FormEvent<SignInFormElement>) {
        event.preventDefault();

        const form = event.currentTarget as HTMLFormElement;
        let serializedData: Record<string, any> = {};

        serializedData = {
            semesterID: semester.id,
            RSTID: student.id
        }

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

            </div>,
        });
    }


    const ActionBtn = ({ data }: any) => {

        return <>
            {
                !data.isFinal &&
                <Tooltip title="ثبت نمره" variant="solid" color='warning'>
                    <IconButton onClick={() => handleGradeModal(data)}>
                        <EditRoundedIcon color='warning' />
                    </IconButton>
                </Tooltip>
            }
            {
                (typeof data.Grade === "string" || (typeof data.Grade === "number" && data.isFinal)) ?
                    <></>
                    :
                    <Tooltip title="ثبت نهایی" variant="solid" color='success'>
                        <IconButton onClick={() => handleGradeFinal(data)}>
                            <DoneOutlineRoundedIcon color='success' />
                        </IconButton>
                    </Tooltip>
            }
        </>
    }


    function handleGradeModal(data: any) {
        showModal({
            open: true,
            variant: "outlined",
            color: "primary",
            title: <h4>{data.fullName} - {data.CourseName}</h4>,
            content: <div className='min-w-min md:min-w-[500px]'>
                <Alert {...{ title: 'Neutral', color: 'warning' }} >نمره دانشجو را وارد کنید</Alert>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const form = e.currentTarget as HTMLFormElement;
                        let serializedData: Record<string, any> = {};

                        // serializedData = {
                        //     semesterID: semester.id,
                        //     RSTID: student.id
                        // }

                        const formData = new FormData(form);

                        formData.forEach((value, key: any) => {
                            const formInputKey = key as FormInputKey;
                            const Input: any = form[formInputKey]
                            if (Input.type === "number") {
                                serializedData[formInputKey] = Number(value.toString());
                            } else {
                                serializedData[formInputKey] = value;
                            }
                        });
                        setIsLoading(true)
                        performPost(`/course-registration/setGrade`, serializedData).then(() => {
                            setIsLoading(false)
                            showAlert('با موفقیت ثبت شد', "success");
                            setChange(new Date())
                            closeModal()
                        }).catch(err => {
                            setIsLoading(false)
                            showAlert(err.message, "danger");
                        })

                    }}
                >
                    <Stack spacing={2} mt={2}>
                        <FormControl>
                            <FormLabel>مقدار نمره</FormLabel>
                            <Input autoFocus name="value" type='number' defaultValue={20}
                                slotProps={{
                                    input: {
                                        min: 0,
                                        max: 20,
                                        step: 0.01,
                                    },
                                }} />
                            <Input autoFocus name="STID" sx={{ display: "none" }} type='number' value={data.StudentID} />
                            <Input autoFocus name="COID" sx={{ display: "none" }} type='number' value={data.CourseID} />
                        </FormControl>
                        <Button loading={isLoading} type="submit">ثبت موقت</Button>
                    </Stack>
                </form>
            </div>,
        });
    }

    function handleGradeFinal(data: any) {
        setIsLoading(true)
        const dataPost: any = {
            STID: data.StudentID,
            COID: data.CourseID,
        }

        performPost(`/course-registration/setGrade/final`, dataPost).then(() => {
            setIsLoading(false)
            showAlert('با موفقیت نهایی شد', "success");
            setChange(new Date())
            closeModal()
        }).catch(err => {
            setIsLoading(false)
            showAlert(err.message, "danger");
        })
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
                    <ListItem
                        readOnly={readOnly}
                        target={target}
                        subQuery={subQuery}
                        path={pathname}
                        pageName={pageName}
                        change={change}
                        handleShowModalAdd={handleShowEdit}
                        haedItem={FormInputs}
                        ActionBtn={ActionBtn} />
                </Box>
            </Box>
        </CssVarsProvider>
    );
}