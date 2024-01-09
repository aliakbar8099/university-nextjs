/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Checkbox from '@/components/common/Checkbox';
import moment from 'moment-jalaali';
import { Skeleton } from '@mui/joy';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

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

export default function OrderTable({ listItam = [], haedItem = [""], filterElements = <></>, loading = false }) {
    const [order, setOrder] = React.useState<Order>('desc');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [open, setOpen] = React.useState(false);
    const renderFilters = () => (
        <React.Fragment>
            {filterElements}
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{
                    display: { xs: 'flex', sm: 'none' },
                    my: 1,
                    gap: 1,
                }}
            >
                <Input
                    size="sm"
                    placeholder="جستجو"
                    startDecorator={<SearchIcon />}
                    sx={{ flexGrow: 1 }}
                />
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setOpen(true)}
                >
                    <FilterAltIcon />
                </IconButton>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                        <ModalClose />
                        <Typography id="filter-modal" level="h2">
                            فیلترها
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {renderFilters()}
                            <Button color="primary" onClick={() => setOpen(false)}>
                                ثبت
                            </Button>
                        </Sheet>
                    </ModalDialog>
                </Modal>
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: 'sm',
                    py: 2,
                    display: { xs: 'none', sm: 'flex' },
                    flexWrap: 'wrap',
                    gap: 1.5,
                    '& > *': {
                        minWidth: { xs: '120px', md: '160px' },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>جستجو برای سفارش</FormLabel>
                    <Input
                        size="sm"
                        placeholder="جستجو"
                        startDecorator={<SearchIcon />}
                    />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'none', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                    textAlign: "right"
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                                <Checkbox
                                    checked={selected.length === listItam.length}
                                    onChange={(event) => {
                                        setSelected(
                                            event.target.checked
                                                ? listItam.map((row: any) => row.id)
                                                : [],
                                        );
                                    }}
                                />
                            </th>
                            {
                                haedItem.map((head, n) => {
                                    if (n === 0) {
                                        return (
                                            <th style={{ width: 120, padding: '12px 6px' }}>
                                                <Link
                                                    style={{ display: "flex", justifyContent: "end" }}
                                                    underline="none"
                                                    color="primary"
                                                    component="button"
                                                    onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                                                    fontWeight="lg"
                                                    endDecorator={<ArrowDropDownIcon />}
                                                    sx={{
                                                        '& svg': {
                                                            transition: '0.2s',
                                                            transform:
                                                                order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                                        },
                                                    }}
                                                >
                                                    {head}
                                                </Link>
                                            </th>
                                        )
                                    }
                                    return <th style={{ width: 180, padding: '12px 6px', textAlign: "right" }}>{head}</th>
                                })
                            }
                            <th style={{ width: 140, padding: '12px 6px', textAlign: "right" }}> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loading ?
                                stableSort(listItam, getComparator(order, 'id')).map((row: any) => (
                                    <tr key={row.id} className={selected.includes(row.id) ? "active" : undefined}>
                                        <td style={{ textAlign: 'center', width: 120 }}>
                                            <Checkbox
                                                checked={selected.includes(row.id)}
                                                onChange={(event) => {
                                                    setSelected((ids) =>
                                                        event.target.checked
                                                            ? ids.concat(row.id)
                                                            : ids.filter((itemId) => itemId !== row.id),
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Typography level="body-xs">{row.name}</Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs">{moment(row.startDate.substring(0, 10)).format('jYYYY/jMM/jDD')}</Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs">{moment(row.endDate.substring(0, 10)).format('jYYYY/jMM/jDD')}</Typography>
                                        </td>
                                        {/* <td>
                                        <Chip
                                            variant="soft"
                                            size="sm"
                                            startDecorator={
                                                {
                                                    Paid: <CheckRoundedIcon />,
                                                    Refunded: <AutorenewRoundedIcon />,
                                                    Cancelled: <BlockIcon />,
                                                }[row.status]
                                            }
                                            color={
                                                {
                                                    Paid: 'success',
                                                    Refunded: 'neutral',
                                                    Cancelled: 'danger',
                                                }[row.status] as ColorPaletteProp
                                            }
                                        >
                                            {row.status}
                                        </Chip>
                                    </td> */}
                                        {/* <td>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar size="sm">{row?.customer?.initial}</Avatar>
                                            <div>
                                                <Typography level="body-xs">{row.customer?.name}</Typography>
                                                <Typography level="body-xs">{row.customer?.email}</Typography>
                                            </div>
                                        </Box>
                                    </td> */}
                                        <td>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: "end" }}>
                                                {/* <Link level="body-xs" component="button">
                                                دانلود
                                            </Link> */}
                                                <RowMenu />
                                            </Box>
                                        </td>
                                    </tr>
                                ))
                                :
                                [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12].map((row: any) => (
                                    <tr key={row}>
                                        <td style={{ textAlign: 'center', width: 40 }}>
                                            <div className='flex justify-center items-center'>
                                                <Skeleton animation="wave" width={18} height={18} />
                                            </div>
                                        </td>
                                        <td>
                                            <Typography level="body-xs"><Skeleton animation="wave" variant="text" /></Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs"><Skeleton animation="wave" variant="text" /></Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs"><Skeleton animation="wave" variant="text" /></Typography>
                                        </td>
                                        <td>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: "end" }}>
                                                <Skeleton animation="wave" width={38} height={10} />
                                            </Box>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </Table>
            </Sheet>
            <Box
                className="Pagination-laptopUp"
                sx={{
                    pt: 2,
                    gap: 1,
                    [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
                    display: {
                        xs: 'none',
                        md: 'flex',
                    },
                }}
            >

                <Button
                    dir='ltr'
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    endDecorator={<KeyboardArrowRightIcon />}
                >
                    قبلی
                </Button>

                <Box sx={{ flex: 1 }} />
                {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
                    <IconButton
                        key={page}
                        size="sm"
                        variant={Number(page) ? 'outlined' : 'plain'}
                        color="neutral"
                    >
                        {page}
                    </IconButton>
                ))}
                <Box sx={{ flex: 1 }} />
                <Button
                    dir='ltr'
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<KeyboardArrowLeftIcon />}
                >
                    بعدی
                </Button>
            </Box>
        </React.Fragment>
    );
}