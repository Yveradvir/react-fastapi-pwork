import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { PickerValidDate } from "@mui/x-date-pickers/models";
import { useField, useFormikContext } from "formik";
import React from "react";

interface FormikDatePickerProps extends DatePickerProps<PickerValidDate> {
    field_name: string;
}

const FormikDatePicker: React.FC<FormikDatePickerProps> = ({ field_name, ...rest }) => {
    const [field] = useField(field_name);
    const { setFieldValue } = useFormikContext();
  
    return (
        <DatePicker 
            {...rest}
            value={field.value ?? ""}
            onChange={(val) => setFieldValue(field_name, val)}
        />
    )
}

export default FormikDatePicker;
