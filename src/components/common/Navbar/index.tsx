import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Avatar, Button, Checkbox, Dropdown, IconButton, Menu, MenuButton, MenuItem, Typography } from '@mui/joy';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useUser } from '@/context/User';
import { useUI } from '@/context/UI';
import { WarningRounded } from '@mui/icons-material';
import { findRoutes } from '@/routes/findRoutes';
import { usePathname } from 'next/navigation';
import { Routes } from '@/routes/main';

const LazyMenuRoundedIcon = lazy(() => import('@mui/icons-material/MenuRounded'));
const LazyMenuOpenRoundedIcon = lazy(() => import('@mui/icons-material/MenuOpenRounded'));

interface NavbarProps {
    handleOpenMunu: () => void;
    openSideBar: boolean;
}


const Navbar: React.FC<NavbarProps> = ({ handleOpenMunu, openSideBar }) => {
    const pathname = usePathname()
    const { showModal, closeModal } = useUI();
    const { user, logout, isLoadingLogout } = useUser();

    const [isItems, setIsItems] = useState(false);
    const [isHideBtnMuue, setIsHideBtnMuue] = useState(false);

    useEffect(() => {
        setIsHideBtnMuue(!window.matchMedia("(max-width: 1024px)").matches)
    }, [])

    const handleShowModalClose = () => {
        showModal({
            open: true,
            variant: "outlined",
            title: <p>خروج از حساب</p>,
            color:"danger",
            titleIcon: <WarningRounded />,
            content: <p>آیا میخواهید از حساب خود خارج شوید؟</p>,
            Actions: (
                <>
                    <Button loading={isLoadingLogout} variant="outlined" color="danger" onClick={logout} >
                        خارج شدن
                    </Button>
                    <Button variant="plain" color="neutral" onClick={closeModal} >
                        بیخیال
                    </Button>
                </>
            )
        });
    };

    return (
        <nav className="navbar-panel">
            <div className="container-panel flex justify-between items-center">
                
                {
                    isItems ?
                        <>
                            <div className='flex justify-center items-center'>
                                <IconButton className='text-[26px] mr-2'>
                                    <HomeOutlinedIcon />
                                </IconButton>
                            </div>
                            <div className='flex justify-center items-center'>
                                <IconButton onClick={() => setIsItems(false)} className='text-[26px] mr-2'>
                                    <CloseRoundedIcon />
                                </IconButton>
                            </div>
                        </>
                        :
                        <>
                            <div className='flex justify-center items-center'>
                                {
                                    isHideBtnMuue && <IconButton onClick={handleOpenMunu} className='text-[26px]'>
                                        <Suspense fallback={<LazyMenuRoundedIcon />}>
                                            {openSideBar ?
                                                <LazyMenuRoundedIcon fontSize='inherit' />
                                                :
                                                <LazyMenuOpenRoundedIcon fontSize='inherit' />
                                            }
                                        </Suspense>
                                    </IconButton>
                                }
                                <h4 className='mr-4 font-medium'>{findRoutes(Routes, pathname).reverse()[0].name}</h4>
                            </div>
                            <div className='flex justify-center items-center'>
                                <IconButton onClick={() => setIsItems(true)} className='text-[26px] mr-2 block lg:hidden'>
                                    <MoreVertRoundedIcon />
                                </IconButton>
                                <IconButton className='text-[26px] mr-2 hidden lg:block'>
                                    <HomeOutlinedIcon />
                                </IconButton>
                                <IconButton className='text-[26px] mr-2 relative'>
                                    <div className='w-[6px] h-[6px] rounded-sm bg-[#f7aa1d] absolute top-[2px] left-[2px]'></div>
                                    <NotificationsActiveOutlinedIcon />
                                </IconButton>
                                <Dropdown>
                                    <MenuButton
                                        variant="plain">
                                        <div className='flex items-center p-1'>
                                            <Avatar src='https://avatar.iran.liara.run/public' variant="outlined" size='md' />
                                            <div className='text-right hidden lg:block'>
                                                <h4 className='truncate w-[200px] mr-3 text-[14px]'>بدون نیم سال</h4>
                                                <small className='truncate w-[220px] mr-3'>{user?.firstName} {user?.lastName}</small>
                                            </div>
                                        </div>
                                    </MenuButton>
                                    <Menu>
                                        <Menu className='w-[250px]'>
                                            <MenuItem>
                                                <PersonRoundedIcon />
                                                <Typography>پروفایل</Typography>
                                            </MenuItem>
                                            <MenuItem>
                                                <SettingsRoundedIcon />
                                                <Typography>تنظیمات</Typography>
                                            </MenuItem>
                                            <MenuItem onClick={handleShowModalClose} variant="soft" color="danger">خارج شدن از حساب</MenuItem>
                                        </Menu>
                                    </Menu>
                                </Dropdown>

                            </div>
                        </>
                }
            </div>
        </nav>
    )
}

export default Navbar;
