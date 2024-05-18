import { LaunchedAxios } from '@modules/api/api';
import ErrorPage from '@modules/components/errorPage';
import FilterForm from '@modules/components/filterForm';
import Layout from '@modules/components/layout';
import { useAppDispatch, useAppSelector } from '@modules/reducers';
import { GroupEntity } from '@modules/reducers/groups.slice';
import { RejectedError, ReduxRejfullTools, LoadingStatus } from '@modules/reducers/main';
import { fetchPosts, PostEntity } from '@modules/reducers/posts.slice';
import { DoorBack } from '@mui/icons-material';
import { Accordion, AccordionSummary, Button, Grid, Pagination, Typography } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Relation {
    totalCount: number;
}

interface ISingleGroup {
    group: GroupEntity;
    relation: Relation;
}

const SingleGroup: React.FC = () => {
    const navigate = useNavigate();
    const { group_id } = useParams();
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [group, setGroup] = useState<ISingleGroup | null>(null);
    const [error, setError] = useState<RejectedError | null>(null);

    const dispatch = useAppDispatch();
    const posts = useAppSelector((state) => state.posts);
    const postsList = useAppSelector((state) => state.posts.entities);

    const handleChangePage = useCallback(
        (_event: React.ChangeEvent<unknown> | null, page: number) => {
            dispatch(fetchPosts({page, group_id}));
        },
        [dispatch, group_id]
    );

    useEffect(() => {
        handleChangePage(null, 1);
    }, [handleChangePage]);

    useEffect(() => {
        let isMounted = true;

        const fetchGroupData = async () => {
            try {
                const response = await LaunchedAxios.get(`/group/single/${group_id}`);

                if (response.data.ok && isMounted) {
                    setGroup(response.data.subdata);
                    setTotalCount(response.data.subdata.relation.totalCount);
                } else if (isMounted) {
                    setError(ReduxRejfullTools.standartReject());
                }
            } catch (err) {
                if (isMounted) setError(ReduxRejfullTools.standartAxiosReject(err));
            }
        };

        fetchGroupData();

        return () => {
            isMounted = false;
        };
    }, [group_id]);

    return (
        <Layout>
            {error ? (
                <ErrorPage status_code={error.status_code} initial_message={error.detail} />
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        {group && (
                            <div>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FilterForm
                            onAccept={() => {
                                handleChangePage(null, page);
                            }}
                        />
                        <div style={{ marginTop: '16px' }}>
                            {posts.loadingStatus === LoadingStatus.Loaded && (
                                <div>
                                    {Object.values(postsList).map((post: PostEntity) => (
                                        <Accordion key={post.id}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography variant="h3">
                                                    {post.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <div>
                                                <Typography>{post.content.slice(0, 200)}</Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => navigate(`/group/${group_id}/${post.id}`)}
                                                >
                                                    <DoorBack />
                                                    Go
                                                </Button>
                                            </div>
                                        </Accordion>
                                    ))}
                                </div>
                            )}
                            {totalCount && (
                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={Math.ceil(totalCount / 5)}
                                        variant="outlined"
                                        shape="rounded"
                                        disabled={posts.loadingStatus === LoadingStatus.Loading}
                                        onChange={(_event, page) => {
                                            setPage(page);
                                            handleChangePage(_event, page);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </Grid>
                </Grid>
            )}
        </Layout>
    );
};

export default SingleGroup;
