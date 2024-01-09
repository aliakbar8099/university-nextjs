import * as React from 'react';
import { DatePicker } from 'zaman';
import "./custom.css"

export function DatePickerJalali({ name = "" }) {
    const [value, setValue] = React.useState<Date | string>("");

    return (
        <div id='calender_picker'>
            <DatePicker defaultValue={new Date()} onChange={(e) => setValue(typeof value === "string" ? new Date() : e.value)} className='z-[2000] modal_custom' />
            <input hidden value={value ? new Date(value).toISOString() : new Date().toISOString()} name={name} />
        </div>
    );
}