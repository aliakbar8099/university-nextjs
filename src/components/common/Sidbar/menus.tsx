import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import { MouseEvent, useState } from 'react';
import { Routes } from '@/routes/main';
import Link from 'next/link';
import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import { findRoutes } from '@/routes/findRoutes';
import { usePathname } from 'next/navigation';

interface MenusProps {
    openSideBar: boolean;
}


const Menus: React.FC<MenusProps> = ({ openSideBar }) => {
    const pathname = usePathname();
    const [select, setSelect] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleMenu(id = 0) {
        setSelect(id)
    }

    return (
        <div className='menus w-full'>
            <div className='flex flex-col justify-center items-center w-full'>
                {
                    !openSideBar && Routes.map(item => (
                        item.path ?
                            item.path != "/" &&
                            <div
                                key={item.id}
                                className={`item-menu mb-6 ${findRoutes(Routes, pathname)[0].id === item.id ? "active" : ""}`}
                            >
                                <Link
                                    href="/"
                                    className='flex justify-between cursor-pointer link-hover'
                                >
                                    <div>
                                        {item.icon}
                                        <span className='mr-2 text-[14px] font-medium name_menu'>{item.name}</span>
                                    </div>
                                </Link>
                            </div>
                            :
                            <Dropdown key={item.id}>
                                <MenuButton variant="plain" className={`item-menu_hover mb-5 p-0 ${findRoutes(Routes, pathname)[0].id === item.id ? "active" : ""}`}>
                                    <Link
                                        href=""
                                        className='flex justify-between cursor-pointer link-hover'
                                    >
                                        <div>
                                            {item.icon}
                                        </div>
                                    </Link>
                                </MenuButton>
                                <Menu className='mr-5' sx={{ right: 1 }}>
                                    {
                                        item.chids && item.chids.map((i: any, n: number) => (
                                            <Link href={i.path}>
                                                <MenuItem key={n} className='flex items-center text-underMenu cursor-pointer mb-4'>
                                                    <KeyboardArrowLeftOutlinedIcon fontSize='inherit' />
                                                    <span className='mr-1 text-[13.2px]'>{i.name}</span>
                                                </MenuItem>
                                            </Link>
                                        ))
                                    }
                                </Menu>
                            </Dropdown>
                    ))
                }
            </div>
            {
                openSideBar && Routes.map(item => (
                    item.path ?
                        item.path != "/" &&
                        <div
                            key={item.id}
                            className={`item-menu mb-8`}
                        >
                            <Link
                                href="/"
                                className='flex justify-between cursor-pointer link-hover'
                            >
                                <div>
                                    {item.icon}
                                    <span className='mr-2 text-[14px] font-medium name_menu'>{item.name}</span>
                                </div>
                            </Link>
                        </div>
                        :
                        <div
                            key={item.id}
                            className={`item-menu ${select === item.id ? "mb-1" : "mb-6"} ${findRoutes(Routes, pathname)[0].id === item.id ? "active" : ""}`}
                        >
                            <div
                                onClick={(e) => !openSideBar ? handleClick(e) : (select === item.id ? handleMenu() : handleMenu(item.id))}
                                className='flex justify-between cursor-pointer'
                            >
                                <div>
                                    {item.icon}
                                    <span className='mr-2 text-[14px] font-medium name_menu'>{item.name}</span>
                                </div>
                                <KeyboardArrowDownRoundedIcon className={`arrow_menu ${select === item.id ? "open" : ""}`} />
                            </div>
                            <div className={`sub_item-menu ${select === item.id || findRoutes(Routes, pathname)[0].id == item.id ? "open" : ""}`}>
                                <ul className='p-4 pb-0'>
                                    {
                                        item.chids && item.chids.map((i: any, n: number) => (
                                            <Link
                                                href={i.path}
                                                className={findRoutes(Routes, pathname).find(item => item.path === pathname)?.id == i.path ? 'avtive' : ''}
                                            >
                                                <li key={n} className='flex items-center text-underMenu cursor-pointer mb-4'>
                                                    <KeyboardArrowLeftOutlinedIcon fontSize='inherit' />
                                                    <span className='mr-1 text-[13.2px]'>{i.name}</span>
                                                </li>
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                ))
            }
        </div>
    );
}

export default Menus;