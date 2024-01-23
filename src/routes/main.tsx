import BeenhereRoundedIcon from '@mui/icons-material/BeenhereRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import LocalLibrarySharpIcon from '@mui/icons-material/LocalLibrarySharp';
import SchoolIcon from '@mui/icons-material/School';
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';
import { HomeRounded } from '@mui/icons-material';

export const Routes = [
    {
        id: 100, name: "خانه", path: "/", icon: <HomeRounded />,
    },
    {
        id: 1, name: "مدیریت واحد ها", icon: <BeenhereRoundedIcon />,
        chids: [
            { name: "انتخاب واحد", path: "/invoice", },
            { name: "مشاهده واحد", path: "/" },
        ],
    },
    {
        id: 2, name: "مدیریت دروس", icon: <MenuBookOutlinedIcon />,
        chids: [
            { name: "ثبت درس", path: "/" },
            { name: "پیشنیاز ها", path: "/" },
        ],
    },
    {
        id: 3, name: "مدیریت دانشجو", icon: <LocalLibrarySharpIcon />,
        chids: [
            { name: "ثبت دانشجو", path: "/" },
        ],
    },
    {
        id: 4, name: "مدیریت استاد", icon: <SchoolIcon />,
        chids: [
            { name: "ثبت استاد", path: "/professor" },
        ],
    },
    {
        id: 6, name: "گزارشات", icon: <InsertChartRoundedIcon />,
        chids: [
            { name: "کارنامه کامل", path: "/" },
            { name: "کارنامه نیم سال", path: "/" },
        ],
    },
    {
        id: 7, name: "اطلاعات پایه", icon: <FeedRoundedIcon />,
        chids: [
            { name: "رشته تحصیلی", path: "/base/field" },
            { name: "دانشکده", path: "/base/college" },
            { name: "نیم سال", path: "/base/semester" },
            { name: "کاربران سیستم", path: "/base/users" },
        ],
    },
    {
        id: 5, name: "راهنما و مستندات", path: "/g", icon: <HelpOutlinedIcon />
    },
]