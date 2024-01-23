import { Button, FormControl, FormLabel, Input, Option, Select } from "@mui/joy";
import { DatePickerJalali } from "@/components/common/DatePickerJalali";

export function Forms(data: any, handleSearchOpen: any, res?: any) {
    return (
        Object.keys(data).map((key) => {
            const typedKey = key as any;
            const { name, type, options, value, min, max, width, leftButton, noInput, placeholder } = data[typedKey];

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
                    <FormControl>
                        <FormLabel>{name}</FormLabel>
                        <div className='flex items-center'>
                            <Input
                                name={key}
                                type='number'
                                sx={{ width }}
                                placeholder={placeholder}
                                fullWidth
                                slotProps={{
                                    input: {
                                        min,
                                        max,
                                        step: 1,
                                    },
                                }}
                                defaultValue={res?.responseData[key]} />
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
                    <FormControl>
                        <FormLabel>{name}</FormLabel>
                        <Select
                            name={key}
                            placeholder={name + " را انتخاب کنید "}
                        >
                            {
                                options.map((i: any) => (
                                    <Option value={i.id}>{i.CollegeName}</Option>
                                ))
                            }
                        </Select>
                    </FormControl>
                )
            }
            return (
                !noInput &&
                <FormControl>
                    <FormLabel>{name}</FormLabel>
                    <Input placeholder={placeholder} name={key} defaultValue={res?.responseData[key] ?? ""} />
                </FormControl>
            )
        })
    )
}