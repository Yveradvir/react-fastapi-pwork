import React, { useState, useEffect } from "react";
import { Field, Form, Formik, FormikErrors } from "formik";
import { Button, IconButton, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { ActiveTypes, filterActions, FilterEntity, FilterTypes } from "@modules/reducers/filter.slice";
import { useAppDispatch } from "@modules/reducers";
import * as Yup from "yup";
import AllIcon from '@mui/icons-material/AllInbox';
import ActiveIcon from '@mui/icons-material/CheckCircle';
import InactiveIcon from '@mui/icons-material/Cancel';

const validationSchema = Yup.object().shape({
    ft: Yup.string(),
    f: Yup.string().max(120, "Maximum 120 letters").optional(),
});

const FilterForm: React.FC<{ onAccept: () => void; withActivity?: boolean }> = ({ onAccept, withActivity = false }) => {
    const dispatch = useAppDispatch();
    const initialValues: FilterEntity = {
        ft: FilterTypes.new,
        f: "",
        active: ActiveTypes.all
    };

    const [activeState, setActiveState] = useState(ActiveTypes.all);

    useEffect(() => {
        dispatch(filterActions.reset());
    }, [dispatch]);

    const handleToggle = (setFieldValue: { (field: string, value: undefined, shouldValidate?: boolean): Promise<void | FormikErrors<FilterEntity>>; (arg0: string, arg1: ActiveTypes): void; }) => {
        const nextState = activeState === ActiveTypes.all ? ActiveTypes.active 
                        : activeState === ActiveTypes.active ? ActiveTypes.inactive 
                        : ActiveTypes.all;
        setActiveState(nextState);
        setFieldValue('active', nextState);
    };

    const getIcon = () => {
        switch (activeState) {
            case ActiveTypes.active:
                return <ActiveIcon color="success" />;
            case ActiveTypes.inactive:
                return <InactiveIcon color="error" />;
            default:
                return <AllIcon color="disabled" />;
        }
    };

    const getTooltipTitle = () => {
        switch (activeState) {
            case ActiveTypes.active:
                return "Active";
            case ActiveTypes.inactive:
                return "Inactive";
            default:
                return "All";
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                values.active = activeState;
                console.log(values);
                dispatch(filterActions.change(values));
                onAccept();
            }}
        >
            {({ values, handleChange, setFieldValue }) => (
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
                    {withActivity && (
                        <Tooltip title={getTooltipTitle()}>
                            <IconButton
                                onClick={() => handleToggle(setFieldValue)}
                                sx={{
                                    padding: '4px',
                                    marginRight: '8px',
                                    border: '1px solid',
                                    borderRadius: '50%',
                                    color: 'inherit',
                                }}
                            >
                                {getIcon()}
                            </IconButton>
                        </Tooltip>
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
