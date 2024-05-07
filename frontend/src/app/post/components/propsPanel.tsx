import React from "react";
import { Grid, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Field, ErrorMessage } from "formik";
import Danger from "@modules/components/danger";


const PropsPanel: React.FC = () => {
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
            >
                <h3>Post Properties</h3>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Field
                            name="postProps.discord_tag"
                            type="text"
                            as={TextField}
                            label="Discord Tag"
                            fullWidth
                        />
                        <ErrorMessage name="postProps.discord_tag">
                            {(msg) => <Danger text={msg} />}
                        </ErrorMessage>
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            name="postProps.telegram_tag"
                            type="text"
                            as={TextField}
                            label="Telegram Tag"
                            fullWidth
                        />
                        <ErrorMessage name="postProps.telegram_tag">
                            {(msg) => <Danger text={msg} />}
                        </ErrorMessage>
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            name="postProps.rank"
                            type="text"
                            as={TextField}
                            label="Rank"
                            fullWidth
                        />
                        <ErrorMessage name="postProps.rank">
                            {(msg) => <Danger text={msg} />}
                        </ErrorMessage>
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
};

export default PropsPanel;
