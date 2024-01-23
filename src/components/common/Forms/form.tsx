import { Button, FormControl, FormLabel, Input, Option, Select } from "@mui/joy";
import { DatePickerJalali } from "@/components/common/DatePickerJalali";
import CircleLoading from "../Loading/circleLoading";

export function Forms(data: any, handleSearchOpen: any, res?: any, isLoadingData?: boolean, setSelect?: any, selectTarget?: any) {
    
    return (
        isLoadingData ?
            <CircleLoading />
            :
            Object.keys(data).map((key) => {
                const typedKey = key as any;
                const { name, type, options, value, min, max, width, leftButton, noInput, placeholder, disabled, hidden } = data[typedKey];

                if (type === "date") {
                    return (
                        !noInput &&
                        <FormControl>
                            <FormLabel>{name}</FormLabel>
                            <DatePickerJalali name={key} defaultValue={res?.responseData[key] ?? ""} />
                        </FormControl>
                    )
                }
                if (type === "number") {
                    return (
                        !noInput &&
                        <FormControl sx={{ display: hidden ? "none" : "initial" }}>
                            <FormLabel>{name}</FormLabel>
                            <div className='flex items-center'>
                                <Input
                                    name={key}
                                    type='number'
                                    sx={{ width }}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            min,
                                            max,
                                            step: 1,
                                        },
                                    }}
                                    defaultValue={res?.responseData[key] ?? value} />
                                {
                                    leftButton &&
                                    <Button onClick={() => handleSearchOpen(leftButton.id, leftButton.name)} variant='outlined' color='warning' className='whitespace-nowrap mx-2'>
                                        {leftButton.name}
                                    </Button>
                                }
                            </div>
                        </FormControl>
                    )
                }
                if (type === "select") {
                    return (
                        !noInput &&
                        <FormControl sx={{ display: hidden ? "none" : "initial" }}>
                            <FormLabel>{name}</FormLabel>
                            <Select
                                name={key}
                                placeholder={name + " را انتخاب کنید "}
                            >
                                {
                                    options.map((i: any) => (
                                        <Option onClick={() => selectTarget == key ? setSelect(i.id ?? i.key) : {}} value={i.id ?? i.key}>{i.CollegeName ?? i.value}</Option>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    )
                }
                return (
                    !noInput &&
                    <FormControl sx={{ display: hidden ? "none" : "initial" }}>
                        <FormLabel>{name}</FormLabel>
                        <Input placeholder={placeholder} name={key} disabled={disabled} defaultValue={res?.responseData[key] ?? value} />
                    </FormControl>
                )
            })
    )
}