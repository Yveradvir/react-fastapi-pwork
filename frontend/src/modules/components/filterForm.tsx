import React from "react";
import { Field, Form, Formik } from "formik";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { filterActions, FilterEntity, FilterTypes } from "@modules/reducers/filter.slice";
import * as Yup from "yup";
import { useAppDispatch } from "@modules/reducers";

const validationSchema = Yup.object().shape({
    ft: Yup.string(),
    f: Yup.string().max(120, "Maximum 120 letters").optional(),
});

const FilterForm: React.FC<{onAccept: () => void}> = ({ onAccept }) => {
    const dispatch = useAppDispatch();
    const initialValues: FilterEntity = {
        ft: FilterTypes.new,
        f: "",
    };

    React.useEffect(() => {
        dispatch(filterActions.reset())
    }, [dispatch])

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log(values);
                dispatch(filterActions.change(values));
                onAccept();
            }}
        >
            {({ values, handleChange }) => (
                <Form style={{ display: "flex", alignItems: "center" }}>
                    <Field
                        name="ft"
                        as={Select}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ marginRight: "8px" }}
                    >
                        <MenuItem value={FilterTypes.new}>New</MenuItem>
                        <MenuItem value={FilterTypes.old}>Old</MenuItem>
                        <MenuItem value={FilterTypes.title}>Title</MenuItem>
                    </Field>
                    {values.ft === FilterTypes.title && (
                        <Field
                            name="f"
                            as={TextField}
                            variant="outlined"
                            label="Filter Value"
                            size="small"
                            fullWidth
                            sx={{ marginRight: "8px" }}
                        />
                    )}
                    <Button type="submit" variant="contained" color="primary" size="small">
                        Accept
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default FilterForm;
