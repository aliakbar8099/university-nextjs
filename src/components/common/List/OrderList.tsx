/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const listItems: any = []

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>ویرایش</MenuItem>
                <MenuItem>تغییر نام</MenuItem>
                <MenuItem>انتقال</MenuItem>
                <Divider />
                <MenuItem color="danger">حذف</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function OrderList({ listItam = [], haedItem = [""] }) {

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {listItems.map((listItem: any) => (
                <List
                    key={listItem.id}
                    size="sm"
                    sx={{
                        '--ListItem-paddingX': 0,
                    }}
                >
                    <ListItem
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                            <ListItemDecorator>
                                <Avatar size="sm">{listItem.customer.initial}</Avatar>
                            </ListItemDecorator>
                            <div>
                                <Typography fontWeight={600} gutterBottom>
                                    {listItem.customer.name}
                                </Typography>
                                <Typography level="body-xs" gutterBottom>
                                    {listItem.customer.email}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 0.5,
                                        mb: 1,
                                    }}
                                >
                                    <Typography level="body-xs">{listItem.date}</Typography>
                                    <Typography level="body-xs">&bull;</Typography>
                                    <Typography level="body-xs">{listItem.id}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Link level="body-sm" component="button">
                                        دانلود
                                    </Link>
                                    <RowMenu />
                                </Box>
                            </div>
                        </ListItemContent>
                        {/* <Chip
                            variant="soft"
                            size="sm"
                            startDecorator={
                                {
                                    'پرداخت شده': <CheckRoundedIcon />,
                                    'برگشت داده شده': <AutorenewRoundedIcon />,
                                    'لغو شده': <BlockIcon />,
                                }[listItem.status]
                            }
                            color={
                                {
                                    'پرداخت شده': 'success',
                                    'برگشت داده شده': 'neutral',
                                    'لغو شده': 'danger',
                                }[listItem.status] as ColorPaletteProp
                            }
                        >
                            {listItem.status}
                        </Chip> */}
                    </ListItem>
                    <ListDivider />
                </List>
            ))}
            <Box
                className="Pagination-mobile"
                sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
            >
                <IconButton
                    aria-label="صفحه قبل"
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography level="body-sm" mx="auto">
                    صفحه 1 از 10
                </Typography>
                <IconButton
                    aria-label="صفحه بعد"
                    variant="outlined"
                    color="neutral"
                    size="sm"
                >
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Box>
        </Box>
    );
}