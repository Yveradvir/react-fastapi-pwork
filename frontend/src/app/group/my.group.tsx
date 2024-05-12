import React from "react";
import { Pagination } from "@mui/material";
import FilterForm from "@modules/components/filterForm";
import Layout from "@modules/components/layout";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { fetchGroups } from "@modules/reducers/groups.slice";

const MyGroups: React.FC = () => {
    const dispatch = useAppDispatch();
    const groups = useAppSelector(state => state.groups)
    
    const handleChangePage = (
        event: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
        const _ = async () => {
            dispatch(fetchGroups())
            console.log(groups.entities);
        }
        _();
        console.log(newPage);
    };

    return (
        <Layout>
            <FilterForm />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "16px",
                }}
            >
                <Pagination
                    count={10}
                    variant="outlined"
                    shape="rounded"
                    disabled={groups.loadingStatus === LoadingStatus.Loading}
                    onChange={handleChangePage}
                />
            </div>
        </Layout>
    );
};

export default MyGroups;
