import React, { useCallback, useEffect, useState } from "react";
import {
    Pagination,
    Accordion,
    AccordionSummary,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterForm from "@modules/components/filterForm";
import Layout from "@modules/components/layout";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { LoadingStatus } from "@modules/reducers/main";
import { fetchCount, fetchGroups, GroupEntity } from "@modules/reducers/groups.slice";
import ErrorPage from "@modules/components/errorPage";

const Groups: React.FC<{ isMine: boolean }> = ({ isMine }) => {
    const [page, setPage] = useState<number>(1);
    const dispatch = useAppDispatch();
    const groups = useAppSelector((state) => state.groups);
    const groupList = useAppSelector((state) => state.groups.entities);

    const handleChangePage = useCallback(
        (_event: React.ChangeEvent<unknown> | null, page: number) => {
            dispatch(fetchGroups({ isMine, page }));
        },
        [dispatch, isMine]
    );

    useEffect(() => {
        dispatch(fetchCount());
        handleChangePage(null, 1);
    }, [handleChangePage, dispatch]);

    return (
        <Layout>
            {!groups.error ? (
                <>
                    <FilterForm
                        onAccept={() => {
                            handleChangePage(null, page);
                        }}
                    />
                    <div style={{ marginTop: "16px" }}>
                        {groups.loadingStatus === LoadingStatus.Loaded && (
                            <div>
                                {Object.values(groupList).map(
                                    (group: GroupEntity) => (
                                        <Accordion key={group.id}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="h3">
                                                    {group.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <div>
                                                <Typography>
                                                    {group.content}
                                                </Typography>
                                            </div>
                                        </Accordion>
                                    )
                                )}
                            </div>
                        )}
                        {groups.totalCount && (
                            <div
                                style={{
                                    marginTop: "auto",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                {groups.totalCount && (
                                    <Pagination
                                        count={Math.ceil(groups.totalCount / 5)}
                                        variant="outlined"
                                        shape="rounded"
                                        disabled={
                                            groups.loadingStatus ===
                                            LoadingStatus.Loading
                                        }
                                        onChange={(_event, page) => {
                                            setPage(page);
                                            handleChangePage(_event, page);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <ErrorPage
                    status_code={groups.error.status_code}
                    initial_message={groups.error.detail}
                />
            )}
        </Layout>
    );
};

export default Groups;
