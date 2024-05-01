import {
    DatePicker,
    DatePickerProps,
    LocalizationProvider
} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickerValidDate } from "@mui/x-date-pickers/models";
import dayjs from "dayjs";
import { useField, useFormikContext } from "formik";
import React from "react";

interface FormikDatePickerProps extends DatePickerProps<PickerValidDate> {
    field_name: string;
}

const FormikDatePicker: React.FC<FormikDatePickerProps> = ({
    field_name,
    ...rest
}) => {
    const [field] = useField(field_name);
    const { setFieldValue } = useFormikContext();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                {...rest}
                defaultValue={dayjs.utc(new Date().toUTCString())}
                value={dayjs.utc(field.value) ?? undefined}
                onChange={(value: PickerValidDate | null) => {                    
                    if (dayjs.isDayjs(value)) {
                        console.log(value);
                        setFieldValue(field_name, value.toISOString())
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default FormikDatePicker;
