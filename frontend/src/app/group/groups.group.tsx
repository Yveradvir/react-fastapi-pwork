import React from "react";
import { Pagination } from "@mui/material";
import FilterForm from "@modules/components/filterForm";
import Layout from "@modules/components/layout";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { fetchGroups } from "@modules/reducers/groups.slice";

const Groups: React.FC<{isMine: boolean}> = ({ isMine }) => {
    const dispatch = useAppDispatch();
    const groups = useAppSelector(state => state.groups)
    
    const handleChangePage = (
        _event: React.ChangeEvent<unknown>,
        page: number
    ) => {
        const _ = async () => {
            dispatch(fetchGroups({isMine, page}))
            console.log(groups.entities);
        }
        _();
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

export default Groups;
