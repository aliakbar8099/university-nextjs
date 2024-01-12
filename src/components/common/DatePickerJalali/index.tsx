import * as React from 'react';
import { DatePicker } from 'zaman';
import "./custom.css"

export function DatePickerJalali({ name = "", defaultValue = "", onChange = (e = { target: { name: "", value: "" } }) => { } }) {
    const [value, setValue] = React.useState<Date | string>("");

    React.useMemo(() => {
        if (value) {
            onChange({ target: { name: name, value: value ? new Date(value).toISOString() : new Date().toISOString() } })
        }
    }, [value])

    return (
        <div id='calender_picker'>
            <DatePicker defaultValue={defaultValue ? new Date(defaultValue) : new Date()} onChange={(e) => setValue(typeof value === "string" ? new Date() : e.value)} className='z-[2000] modal_custom' />
            <input hidden value={value ? new Date(value).toISOString() : new Date().toISOString()} name={name} />
        </div>
    );
}