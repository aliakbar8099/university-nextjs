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
        id: 1, name: "مدیریت واحد ها", icon: <BeenhereRoundedIcon />, hide: ["admin", "teacher"],
        chids: [
            { name: "انتخاب واحد", path: "/invoice", access: ['student'] },
            { name: "مشاهده واحد", path: "/", access: ['student'] },
        ],
    },
    {
        id: 32, name: "دانشجو", icon: <BeenhereRoundedIcon />, hide: ["admin", "student"],
        chids: [
            { name: "ثبت نمره", path: "/", access: ['teacher'] },
            { name: "لیست دانشجو ها", path: "/", access: ['teacher'] },
        ],
    },
    {
        id: 2, name: "مدیریت دروس", icon: <MenuBookOutlinedIcon />, hide: ['student', "teacher"],
        chids: [
            { name: "ثبت درس", path: "/course", access: ['admin'] },
            { name: "پیشنیاز ها", path: "/prereq", access: ['admin'] },
        ],
    },
    {
        id: 3, name: "مدیریت دانشجو", icon: <LocalLibrarySharpIcon />, hide: ['student', "teacher"],
        chids: [
            { name: "ثبت دانشجو", path: "/student", access: ['admin'] },
        ],
    },
    {
        id: 4, name: "مدیریت استاد", icon: <SchoolIcon />, hide: ['student', "teacher"],
        chids: [
            { name: "ثبت استاد", path: "/professor", access: ['admin'] },
        ],
    },
    {
        id: 6, name: "گزارشات", icon: <InsertChartRoundedIcon />, hide: ['admin', "teacher"],
        chids: [
            { name: "کارنامه کامل", path: "/", access: ['student'] },
            { name: "کارنامه نیم سال", path: "/", access: ['student'] },
        ],
    },
    {
        id: 7, name: "اطلاعات پایه", icon: <FeedRoundedIcon />, hide: ['student', "teacher"],
        chids: [
            { name: "رشته تحصیلی", path: "/base/field", access: ['admin'] },
            { name: "دانشکده", path: "/base/college", access: ['admin'] },
            { name: "نیم سال", path: "/base/semester", access: ['admin'] },
            { name: "کاربران سیستم", path: "/base/users", access: ['admin'] },
        ],
    },
    {
        id: 5, name: "راهنما و مستندات", path: "/g", icon: <HelpOutlinedIcon />
    },
]