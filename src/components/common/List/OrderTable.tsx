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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Checkbox from '@/components/common/Checkbox';
import moment from 'moment-jalaali';
import { CircularProgress, Skeleton } from '@mui/joy';
import { useRouter, useSearchParams } from 'next/navigation';
import { DatePickerJalali } from '../DatePickerJalali';
import { useUI } from '@/context/UI';

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

interface IsubQuery {
    name: string;
    title: string;
    option: {
        key: string;
        value: string;
    }[];
}[]

interface ITableOrder {
    listItam: never[];
    loading: boolean;
    searchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filterElements?: React.JSX.Element | undefined;
    haedItem: any;
    setRoute(page?: string, search?: string, subSerach?: string): void;
    handelDelete: (id: number) => void;
    handleEditSubmit: () => void;
    loadingWithID: number;
    setIsEditWidthID: React.Dispatch<React.SetStateAction<number>>;
    isEditWidthID: number;
    pageName: string;
    handleShowModalAdd: (id?: number) => void;
    subQuery?: IsubQuery[];
    readOnly?: boolean;
    target?: string;
    handleGetValue: ((e?: {
        target: {
            name: string;
            value: string;
        };
    }) => void) | undefined
}

const OrderTable: React.FC<ITableOrder> = ({
    listItam,
    haedItem,
    loadingWithID,
    loading,
    searchHandler,
    setRoute,
    subQuery,
    pageName,
    handleShowModalAdd,
    target,
    readOnly,
    handelDelete }) => {
    const searchParams = useSearchParams()
    const { closeModal } = useUI()

    const [order, setOrder] = React.useState<Order>('desc');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [open, setOpen] = React.useState(false);

    function handleSelectRow(id: number) {
        let inputEl = document.getElementsByName(target ?? "")[0] as HTMLInputElement;
        inputEl.value = id.toString()
        closeModal()
    }

    const renderFilters = () => (
        <React.Fragment>
            {
                subQuery?.map(item => (
                    <FormControl size="sm">
                        <FormLabel sx={{ fontSize: "12px" }}>فیلتر بر اساس {item.title}</FormLabel>
                        <Select
                            size="sm"
                            name={item.name}
                            defaultValue={parseInt(searchParams.get(item.name) ?? "all")}
                            placeholder={item.title + " را انتخاب کنید "}
                            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                        >
                            <Option
                                onClick={() => setRoute("", "", "")}
                                value={"all"}
                            >همه</Option>
                            {
                                item.option.map((i: any) => (
                                    <Option
                                        onClick={() => setRoute("", "", `&${item.name}=${i.key}`)}
                                        value={i.key}
                                    >{i.value}</Option>
                                ))
                            }
                        </Select>
                    </FormControl>
                ))
            }
        </React.Fragment>
    );


    function RowMenu({ id }: { id: number }) {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleShowModalAdd(id)} >ویرایش</MenuItem>
                    <MenuItem>تغییر نام</MenuItem>
                    <MenuItem>انتقال</MenuItem>
                    <Divider />
                    <MenuItem color="danger" onClick={() => handelDelete(id)}>حذف</MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    return (
        <React.Fragment>
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
                    <FormLabel>جستجو برای عنوان {pageName}</FormLabel>
                    <Input
                        onChange={searchHandler}
                        size="sm"
                        defaultValue={searchParams.get("search") ?? ""}
                        placeholder="جستجو"
                        startDecorator={loading ? <CircularProgress size='sm' sx={{ "--CircularProgress-size": "20px" }} /> : <SearchIcon />}
                    />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'block', sm: 'block' },
                    height: "60vh",
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
                    stripe={"even"}
                    borderAxis="both"
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
                            {!readOnly && <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
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
                            </th>}
                            <th style={{ width: 48, textAlign: 'right', padding: '12px 6px' }}>
                                #
                            </th>
                            <th style={{ width: 48, padding: '12px 6px' }}>
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
                                    شناسه
                                </Link>
                            </th>
                            {
                                Object.values(haedItem).map((head: any, n) => {
                                    return !head.noTable && <th style={{ width: 180, padding: '12px 6px', textAlign: "right" }}>{head?.name}</th>
                                })
                            }
                            <th style={{ width: 140, padding: '12px 6px', textAlign: "right" }}> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loading ?
                                stableSort(listItam, getComparator(order, 'id')).map((row: any, n: number) => (
                                    <tr key={row.id} className={selected.includes(row.id) ? "active" : undefined}>
                                        {!readOnly && <td style={{ textAlign: 'center', width: 120 }}>
                                            {
                                                loadingWithID === row.id ?
                                                    <CircularProgress size='sm' sx={{ "--CircularProgress-size": "16px" }} />
                                                    :
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
                                            }
                                        </td>}
                                        <td>
                                            <Typography level="body-xs">{n + 1}</Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs">{row.id}</Typography>
                                        </td>
                                        {
                                            Object.values(haedItem).map((head: any, index) => {
                                                const key = Object.keys(haedItem)[index]


                                                if (head.type === "date") {
                                                    return (
                                                        !head.noTable &&
                                                        <td>
                                                            <Typography level="body-xs">
                                                                {moment(row[key].substring(0, 10)).format('jYYYY/jMM/jDD')}
                                                            </Typography>
                                                        </td>
                                                    )
                                                }

                                                return (
                                                    !head.noTable &&
                                                    <td>
                                                        <Typography level="body-xs">
                                                            {row[key]}
                                                        </Typography>
                                                    </td>
                                                )
                                            })

                                        }
                                        {/* <td>
                                            <Typography level="body-xs">
                                                {moment(row.startDate.substring(0, 10)).format('jYYYY/jMM/jDD')}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs">
                                                {moment(row.endDate.substring(0, 10)).format('jYYYY/jMM/jDD')}
                                            </Typography>
                                        </td> */}
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
                                                {
                                                    readOnly ?
                                                        <Button className='w-full' onClick={() => handleSelectRow(row.id)} >انتخاب</Button>
                                                        :
                                                        <RowMenu id={row.id} />
                                                }
                                            </Box>
                                        </td>
                                    </tr>
                                ))
                                :
                                [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16].map((row: any) => (
                                    <tr key={row}>
                                        <td style={{ textAlign: 'center', width: 40 }}>
                                            <div className='flex justify-center items-center'>
                                                <Skeleton animation="wave" width={18} height={18} />
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', width: 40 }}>
                                            <div className='flex justify-center items-center'>
                                                <Skeleton animation="wave" width={18} height={18} />
                                            </div>
                                        </td>
                                        {
                                            Object.values(haedItem).map((head, n) => (
                                                <td key={n}>
                                                    <Typography level="body-xs"><Skeleton animation="wave" variant="text" /></Typography>
                                                </td>
                                            ))
                                        }
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
                        xs: 'flex',
                        md: 'flex',
                    },
                }}
            >

                <Button
                    dir='ltr'
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={() => setRoute(JSON.stringify(((parseInt(searchParams.get("page") ?? "1") - 1) <= 1 && 1)), "")} endDecorator={<KeyboardArrowRightIcon />}
                >
                    قبلی
                </Button>

                <div className='flex lg:hidden w-full justify-center items-center'>
                    <Typography level="body-sm" mx="auto">
                        صفحه 1 از 10
                    </Typography>
                </div>

                <div className='hidden md:flex w-full justify-center items-center'>
                    <Box sx={{ flex: 1 }} />

                    {Array.from({ length: parseInt(`${(20 / 12) + 1}`) }, (value, index) => index).map((page) => (
                        <IconButton
                            key={page + 1}
                            size="sm"
                            sx={{ mx: 1 }}
                            onClick={() => setRoute(`${(page + 1)}`, "")}
                            variant={(parseInt(searchParams.get("page") ?? "1") === (page + 1) ? 'outlined' : 'soft')}
                            color="primary"
                        >
                            {page + 1}
                        </IconButton>
                    ))}
                    <Box sx={{ flex: 1 }} />
                </div>
                <Button
                    dir='ltr'
                    size="sm"
                    onClick={() => setRoute(`${((parseInt(searchParams.get("page") ?? "1") + 1) >= parseInt(`${(20 / 12) + 1}`) && parseInt(`${(20 / 12) + 1}`))}`, "")}
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

export default OrderTable;