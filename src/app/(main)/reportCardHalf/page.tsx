'use client'
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { CloseRounded } from '@mui/icons-material';
import { useUI } from '@/context/UI';
import { Alert, IconButton, Table } from '@mui/joy';
import { performGet, performPost, performPut } from '@/services/Instance/fetch.service';
import ListItem from '@/components/common/List';
import { Forms } from '@/components/common/Forms/form';
import { FormInput, IsubQuery } from '@/components/common/Forms/main';
import { useUser } from '@/context/User';
import CoursePage from '../course/page';
import { useRouter } from 'next/navigation';

interface SignInFormElement extends HTMLFormElement { }

type FormInputKey = "CourseName" | "TeacherName" | "status" | 'exam_time' | 'Grade';

const FormInputs: Record<FormInputKey, FormInput> = {
  "CourseName": { name: "عنوان درس", type: "text", noInput: true },
  "TeacherName": { name: "استاد", type: "text", noInput: true },
  "exam_time": { name: "تاریخ امتحان", type: "text", noInput: true },
  "Grade": { name: "نمره", type: "text", noInput: true },
  "status": { name: "وضعیت", type: "text", noInput: true, check: "Grade", nexCheck: "isFinal" },
} as const;

// path uri
export const pathname = "/course-registration"
export const pageName = "انتخاب واحد"

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

export default function SelectUnitPage({ target = "", readOnly = false }) {
  const { showModal, showAlert, closeModal } = useUI();
  const { semester, student } = useUser();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
  const [change, setChange] = React.useState<Date>(new Date());
  const [res, setRes] = React.useState(null)
  const [editId, setEditId] = React.useState(0)
  const [data, setData] = React.useState<any[]>([])

  React.useEffect(() => {
    performGet("/course-registration/info/" + semester.id).then(res => {
      setData(res.responseData);
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
        {
          id === "course" ?
            <CoursePage target="RCOID" readOnly={true} filter={`FieldId=${student.FSID}`} />
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
          <div className='w-full md:w-2/3 m-auto border'>
            <Table borderAxis="both">
              <thead>
                <tr>
                  <th></th>
                  <th><div className='text-center'>اخذ شده</div></th>
                  <th><div className='text-center'>گذرانیده</div></th>
                  <th><div className='text-center'>معدل</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>نیم سال</td>
                  <td><div className='text-center'>{data[1]?.totallUnit_half_get}</div></td>
                  <td><div className='text-center'>{data[0]?.totallUnit_half_final}</div></td>
                  <td><div className='text-center'>{data[0]?.AvgGrade_half_final}</div></td>
                </tr>
                <tr>
                  <td>کل</td>
                  <td><div className='text-center'>{data[3]?.totallUnit}</div></td>
                  <td><div className='text-center'>{data[2]?.totallUnit}</div></td>
                  <td><div className='text-center'>{data[2]?.AvgGrade}</div></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <ListItem ActionBtn={({ }) => <></>} readOnly={readOnly} target={target} subQuery={subQuery} path={pathname} pageName={pageName} change={change} handleShowModalAdd={handleShowEdit} haedItem={FormInputs} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}