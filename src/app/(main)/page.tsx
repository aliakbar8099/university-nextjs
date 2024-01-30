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
import UsersPage from './base/users/page';
import { Forms } from '@/components/common/Forms/form';
import FeildPage from './base/field/page';
import { FormInput, IsubQuery } from '@/components/common/Forms/main';
import { useUser } from '@/context/User';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

interface SignInFormElement extends HTMLFormElement { }

type FormInputKey = "fullname" | "CollegeID" | 'STLEV' | 'FSID' | 'userId' | 'semesterID' | "semesterName" | "FSName" | "CollegeName";
type TableKey = "CourseName" | "TeacherName" | "CourseID";

const FormInputs: Record<FormInputKey, FormInput> = {
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
    options: []
  },
  "FSID": {
    name: "رشته تحصیلی",
    type: "select",
    dataType: "integer",
    options: []
  },
  "semesterName": { name: "نیم سال تحصیلی", type: "text", disabled: true },
  "semesterID": { name: "شناسه نیم سال", type: "text", hidden: true, dataType: "integer" },
  "userId": { name: "نام و نام خانوادگی", type: "text", hidden: true, dataType: "integer" },
  "fullname": { name: "نام و نام خانوادگی", type: "text", disabled: true },
  "FSName": { name: "رشته تحصیلی", type: "text", noInput: true },
  "CollegeName": { name: "دانشکده", type: "text", noInput: true },
} as const;

const TableData: any = {
  "CourseName": { name: "عنوان درس", type: "text", noInput: true },
  "CourseID": { name: "کد درس", type: "text", noInput: true },
  "TeacherName": { name: "استاد", type: "text", noInput: true },
  "StudentID": { name: "شماره دانشجویی", type: "text", noInput: true },
  "Grade": { name: "نمره", type: "text", noInput: true },
  "status": { name: "وضعیت", type: "text", noInput: true, check: "Grade", nexCheck: "isFinal" },
} as const;

// path uri
export const pathname = "/students"
export const pageName = "تکمیل ثبت نام"

export const subQuery: IsubQuery[] = [{
  name: "CollegeID",
  title: "رشته تحصیلی",
  option: []
}]

export default function Home() {
  const { user, student, setChange, teacher, semester } = useUser()

  const { showModal, showAlert, closeModal } = useUI();
  const [isLoadingSubmit, setIsLoadingSumnit] = React.useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = React.useState<boolean>(false);
  const [isLoadingSelect, setIsLoadingSelect] = React.useState<boolean>(false);
  const [select, setSelect] = React.useState(0);
  const [res, setRes] = React.useState(null)

  React.useEffect(() => {
    setIsLoadingData(true)
    performGet("/semester").then(res => {
      FormInputs.semesterName.value = res.responseData.reverse()[0].name
      FormInputs.semesterID.value = res.responseData[0].id
      FormInputs.fullname.value = user?.firstName + " " + user?.lastName
      FormInputs.userId.value = user?.id
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
        serializedData[formInputKey] = parseInt(value.toString() ?? "0");
      } else {
        serializedData[formInputKey] = value;
      }
    });

    setIsLoadingSumnit(true)

    performPost(pathname, serializedData).then(() => {
      setIsLoadingSumnit(false)
      showAlert('با موفقیت ثبت شد', "success");
      const form = document.querySelector("form") as HTMLFormElement
      form.reset()
      setChange(new Date())

    }).catch(err => {
      setIsLoadingSumnit(false)
      showAlert(err.message, "danger");
    })
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
            id === "field" ?
              <FeildPage target="fieldStudyId" readOnly={true} />
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
        {
          (student?.term && (semester.id == student.semesterId)) || user?.role != "student" ?
            <Box
              sx={{
                width: '100%',
                position: 'relative',
                overflow: { xs: 'auto', sm: 'initial' },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  display: 'block',
                  width: '1px',
                  bgcolor: 'warning.300',
                  left: '500px',
                  top: '-24px',
                  bottom: '-24px',
                  '&::before': {
                    top: '4px',
                    content: '"vertical"',
                    display: 'block',
                    position: 'absolute',
                    right: '0.5rem',
                    color: 'text.tertiary',
                    fontSize: 'sm',
                    fontWeight: 'lg',
                  },
                  '&::after': {
                    top: '4px',
                    content: '"horizontal"',
                    display: 'block',
                    position: 'absolute',
                    left: '0.5rem',
                    color: 'text.tertiary',
                    fontSize: 'sm',
                    fontWeight: 'lg',
                  },
                }}
              />
              <Card
                orientation="horizontal"
                sx={{
                  width: '100%',
                  flexWrap: 'wrap',
                  [`& > *`]: {
                    '--stack-point': '500px',
                    minWidth:
                      'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
                  },
                  // make the card resizable for demo
                  overflow: 'auto',
                  resize: 'horizontal',
                }}
              >
                <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                  <img
                    src="https://avatar.iran.liara.run/public"
                    srcSet="https://avatar.iran.liara.run/public"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                <CardContent>
                  <Typography fontSize="xl" fontWeight="lg">
                    {(user?.firstName) + " " + user?.lastName}
                  </Typography>
                  <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                    {user?.role == "student" ? "دانشجو" : user?.role == "teacher" ? "استاد" : "مدیر سیستم"} {student?.STLEV} {user?.role == "student" && "-"} {student?.FSName}
                  </Typography>
                  {
                    teacher ?
                      <Sheet
                        sx={{
                          bgcolor: 'background.level1',
                          borderRadius: 'sm',
                          p: 1.5,
                          my: 1.5,
                          display: 'flex',
                          gap: 2,
                          '& > div': { flex: 1 },
                        }}
                      >
                        <div>
                          <Typography level="body-xs" fontWeight="lg">
                            سال فارق التحصیلی
                          </Typography>
                          <Typography fontWeight="lg">{teacher.graduationYear}</Typography>
                        </div>
                        <div>
                          <Typography level="body-xs" fontWeight="lg">
                            رشته
                          </Typography>
                          <Typography fontWeight="lg">{teacher.FSName}</Typography>
                        </div>
                        <div>
                          <Typography level="body-xs" fontWeight="lg">
                            دانشکده
                          </Typography>
                          <Typography fontWeight="lg">{teacher.CollegeName}</Typography>
                        </div>
                      </Sheet>
                      :
                      student ?
                        <Sheet
                          sx={{
                            bgcolor: 'background.level1',
                            borderRadius: 'sm',
                            p: 1.5,
                            my: 1.5,
                            display: 'flex',
                            gap: 2,
                            '& > div': { flex: 1 },
                          }}
                        >
                          <div>
                            <Typography level="body-xs" fontWeight="lg">
                              نیم سال جاری
                            </Typography>
                            <Typography fontWeight="lg">{student?.semesterName}(ترم  {student?.term})</Typography>
                          </div>
                          <div>
                            <Typography level="body-xs" fontWeight="lg">
                              معدل نیم سال
                            </Typography>
                            <Typography fontWeight="lg">نامشخص</Typography>
                          </div>
                          <div>
                            <Typography level="body-xs" fontWeight="lg">
                              معدل کل
                            </Typography>
                            <Typography fontWeight="lg">18.57</Typography>
                          </div>
                        </Sheet>
                        : <></>
                  }
                  <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                    <Button variant="outlined" color="neutral">
                      ویرایش مشخصات
                    </Button>
                    {
                      teacher ?
                        <Button variant="solid" color="primary">
                          لیست دانشجو ها
                        </Button>
                        :
                        <Button variant="solid" color="primary">
                          مشاهده واحد ها
                        </Button>
                    }
                  </Box>
                </CardContent>
              </Card>
              {
                student &&
                <ListItem ActionBtn={({ }) => <></>} subQuery={subQuery} path={"/course-registration"} pageName={"درس های اخز شده"} haedItem={TableData} />
              }
            </Box>
            :
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
              <form onSubmit={handleSubmit} className='flex items-start flex-col'>
                <div className=' w-full grid grid-cols-1 lg:grid-cols-2 gap-3 my-2 border-2 p-4 rounded-lg'>
                  {Forms(FormInputs, handleSearchOpen, res, isLoadingData, setSelect, "CollegeID")}
                </div>
                <div className='w-1/3 m-auto p-4 flex justify-center items-center'>
                  <Button
                    loading={isLoadingSubmit}
                    className='w-full min-w-max'
                    type="submit">ثبت نهایی</Button>
                </div>
              </form>
            </Box>
        }
      </Box>
    </CssVarsProvider>
  );
}