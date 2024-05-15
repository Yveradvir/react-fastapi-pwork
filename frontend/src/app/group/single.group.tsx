import Layout from "@modules/components/layout";
import { Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

const SingleGroup: React.FC = () => {
    const { group_id } = useParams();
    const 

    React.useEffect(() => {
        console.log();        
    }, [])

    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <div></div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div></div>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default SingleGroup;