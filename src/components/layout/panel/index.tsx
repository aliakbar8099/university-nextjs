'use client'
import CircleLoading from '@/components/common/Loading/circleLoading';
import { useUser } from '@/context/User';
import { ChevronLeftRounded, HomeRounded } from '@mui/icons-material';
import { Breadcrumbs, Typography } from '@mui/joy';
import { Box } from '@mui/system';
import Link from 'next/link';
import React, { lazy, Suspense, useEffect } from 'react';
import { useState } from 'react';
import { Routes } from '@/routes/main';
import { usePathname } from 'next/navigation';
import { findRoutes } from '@/routes/findRoutes';

const LazyNavbar = lazy(() => import('@/components/common/Navbar'));
const LazySidbar = lazy(() => import('@/components/common/Sidbar'));

function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname()
    const { isLoading } = useUser();
    const [openSideBar, setOpenSidbar] = useState<boolean>(true);

    function handleOpenMunu(): void {
        setOpenSidbar(!openSideBar);
    }

    return (
        isLoading ?
            <CircleLoading />
            :
            !localStorage ? <></> :
                <div className="flex items-start h-screen">
                    <div className={`sidbar ${!openSideBar ? "close" : ""}`}>
                        <LazySidbar openSideBar={openSideBar} />
                    </div>
                    <div className='total-content'>
                        <div className='sticky top-0 py-2 bg-[#f5f7fb]'>
                            <LazyNavbar handleOpenMunu={handleOpenMunu} openSideBar={openSideBar} />
                        </div>
                        <div className='content-root'>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Breadcrumbs
                                    size="sm"
                                    aria-label="breadcrumbs"
                                    separator={<ChevronLeftRounded />}
                                    sx={{ pl: 0 }}
                                >
                                    {
                                        findRoutes(Routes, pathname).map((i, n, list) => (
                                            n === list.length - 1 ?
                                                <Typography key={n} color="primary" fontWeight={500} fontSize={14}>
                                                    {i?.icon}
                                                    {" "}
                                                    {i?.name}
                                                </Typography>
                                                :
                                                <Link
                                                    key={n}
                                                    href={i?.path ?? ""}
                                                >
                                                    {i?.icon}
                                                    {" "}
                                                    {i?.name}
                                                </Link>
                                        ))
                                    }
                                </Breadcrumbs>
                            </Box>
                            {children}
                        </div>
                    </div>
                </div>
    );
}

export default PanelLayout;
