import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import { useUser } from '@/context/User';
import CircleLoading from '@/components/common/Loading/circleLoading';

function AuthLeyoutTheme({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading } = useUser();

    return (
        isLoading ?
            <CircleLoading />
            :
            !localStorage ? <></> :
            <CssVarsProvider defaultMode="light" disableTransitionOnChange>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        ':root': {
                            '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
                            '--Cover-width': '50vw', // must be `vw` only
                            '--Form-maxWidth': '800px',
                            '--Transition-duration': '0.4s', // set to `none` to disable transition
                        },
                    }}
                />
                <Box
                    sx={(theme) => ({
                        width:
                            'clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)',
                        transition: 'width var(--Transition-duration)',
                        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                        position: 'relative',
                        zIndex: 0,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        backdropFilter: 'blur(12px)',
                        backgroundColor: 'rgba(255 255 255 / 0.2)',
                        [theme.getColorSchemeSelector('dark')]: {
                            backgroundColor: 'rgba(19 19 24 / 0.4)',
                        },
                    })}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100dvh',
                            width:
                                'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
                            maxWidth: '100%',
                            px: 2,
                        }}
                    >
                        <Box
                            component="header"
                            sx={{
                                py: 3,
                                display: 'flex',
                                alignItems: 'right',
                                justifyContent: 'space-between',
                            }}
                        >
                        </Box>
                        {children}
                        <Box component="footer" sx={{ py: 3 }}>
                            <Typography level="body-xs" textAlign="center">
                                © دانشگاه شمال {new Date().getFullYear()}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={(theme) => ({
                        height: '100%',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        right: 'clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))',
                        transition:
                            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                        backgroundColor: 'background.level1',
                        backgroundSize: 'cover',
                        backgroundPosition: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage:
                            'url(https://shomal.ac.ir/wp-content/uploads/2023/10/AX-nahaii-1024x548.jpg)',
                        [theme.getColorSchemeSelector('dark')]: {
                            backgroundImage:
                                'url(https://shomal.ac.ir/wp-content/uploads/2023/10/AX-nahaii-1024x548.jpg)',
                        },
                    })}
                />
            </CssVarsProvider>
    );
}

export default AuthLeyoutTheme;