import { LaunchedAxios } from "@modules/api/api";
import ErrorPage from "@modules/components/errorPage";
import FilterForm from "@modules/components/filterForm";
import Layout from "@modules/components/layout";
import { useAppDispatch, useAppSelector } from "@modules/reducers";
import { GroupEntity } from "@modules/reducers/groups.slice";
import {
    RejectedError,
    ReduxRejfullTools,
    LoadingStatus,
} from "@modules/reducers/main";
import { fetchPosts, PostEntity } from "@modules/reducers/posts.slice";
import { DoorBack, Star, Telegram } from "@mui/icons-material";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Grid,
    Pagination,
    Typography,
    CardMedia,
    Box,
    Snackbar,
    IconButton,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IoCloseCircleOutline, IoLogoDiscord } from "react-icons/io5";
import LeaveJoinButton from "./components/leave-join";
import DeleteBtn from "@modules/components/deleteBtn";

interface Relation {
    totalCount: number;
    membership?: {
        user_id: string;
        group_id: string;
        access: number;
    } | null;
}

interface ISingleGroup {
    group: GroupEntity;
    relation: Relation;
}

const SingleGroup: React.FC = () => {
    const navigate = useNavigate();
    const { group_id } = useParams<{ group_id: string }>();
    const [page, setPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [group, setGroup] = useState<ISingleGroup | null>(null);
    const [error, setError] = useState<RejectedError | null>(null);
    const [joinError, setJoinError] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const posts = useAppSelector((state) => state.posts);
    const postsList = useAppSelector((state) => state.posts.entities);

    const handleChangePage = useCallback(
        (_event: React.ChangeEvent<unknown> | null, page: number) => {
            dispatch(fetchPosts({ page, group_id }));
        },
        [dispatch, group_id]
    );

    const handleGroupPage = useCallback(async () => {
        try {
            const response = await LaunchedAxios.get(`/group/single/${group_id}`);
            if (response.data.ok) {
                setGroup(response.data.subdata);
                setTotalCount(response.data.subdata.relation.totalCount);
            } else {
                setError(ReduxRejfullTools.standartReject());
            }
        } catch (err) {
            setError(ReduxRejfullTools.standartAxiosReject(err));
        }
    }, [group_id]);

    useEffect(() => {
        handleChangePage(null, 1);
    }, [handleChangePage]);

    useEffect(() => {
        handleGroupPage();
    }, [group_id, handleGroupPage]);

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setJoinError(false)}
        >
            <IoCloseCircleOutline fontSize="small" />
        </IconButton>
    );
    return (
        <Layout>
            <Snackbar
                open={joinError}
                autoHideDuration={6000}
                onClose={() => {
                    setJoinError(false);
                }}
                message="You cannot be a member more than 10 groups (Including your own)"
                action={action}
            />
            {error ? (
                <ErrorPage
                    status_code={error.status_code}
                    initial_message={error.detail}
                />
            ) : (
                <>
                    <LeaveJoinButton
                        group_id={group_id}
                        membership={group?.relation.membership}
                        setError={setJoinError}
                        callback={handleGroupPage}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            {group && (
                                <div className="group-header">
                                    <Typography variant="h4">
                                        {group.group.title}
                                    </Typography>
                                    <Typography variant="body1">
                                        {group.group.content}
                                    </Typography>
                                    {group.relation.membership?.access === 2 && (<DeleteBtn 
                                        label="Delete a group"
                                        url={`/group/single/${group.group.id}`}
                                        callback={() => {navigate(-1)}}
                                    />)}
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <FilterForm
                                withActivity={true}
                                onAccept={() => {
                                    handleChangePage(null, page);
                                }}
                            />
                            <div style={{ marginTop: "16px" }}>
                                {posts.loadingStatus ===
                                    LoadingStatus.Loaded && (
                                    <div>
                                        {Object.values(postsList).map(
                                            (post: PostEntity) => (
                                                <Accordion
                                                    key={post.id}
                                                    className="post-accordion"
                                                >
                                                    <AccordionSummary
                                                        expandIcon={
                                                            <ExpandMoreIcon />
                                                        }
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography
                                                            variant="h5"
                                                            className="post-title"
                                                        >
                                                            {post.title}
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {post.main && (
                                                            <CardMedia
                                                                component="img"
                                                                height="140"
                                                                image={`data:image/jpeg;base64,${post.main}`}
                                                                alt={post.title}
                                                                className="post-image"
                                                            />
                                                        )}
                                                        <Typography
                                                            variant="body1"
                                                            className="post-content"
                                                        >
                                                            {post.content.slice(
                                                                0,
                                                                200
                                                            )}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            display="flex"
                                                            margin={5}
                                                        >
                                                            <Box
                                                                display="flex"
                                                                gap={2}
                                                            >
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    gap={2}
                                                                >
                                                                    <Star />{" "}
                                                                    Rank:{" "}
                                                                    {post
                                                                        .post_props
                                                                        .rank ||
                                                                        "N/A"}
                                                                </Box>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    gap={2}
                                                                >
                                                                    <IoLogoDiscord />{" "}
                                                                    Discord:{" "}
                                                                    {post
                                                                        .post_props
                                                                        .discord_tag ||
                                                                        "N/A"}
                                                                </Box>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    gap={2}
                                                                >
                                                                    <Telegram />{" "}
                                                                    Telegram:{" "}
                                                                    {post
                                                                        .post_props
                                                                        .telegram_tag ||
                                                                        "N/A"}
                                                                </Box>
                                                            </Box>
                                                        </Typography>{" "}
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/group/${group_id}/${post.id}`
                                                                )
                                                            }
                                                        >
                                                            <DoorBack />
                                                            Go
                                                        </Button>
                                                    </AccordionDetails>
                                                </Accordion>
                                            )
                                        )}
                                    </div>
                                )}
                                {totalCount && (
                                    <div
                                        style={{
                                            marginTop: "auto",
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Pagination
                                            count={Math.ceil(totalCount / 5)}
                                            variant="outlined"
                                            shape="rounded"
                                            disabled={
                                                posts.loadingStatus ===
                                                LoadingStatus.Loading
                                            }
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
                </>
            )}
        </Layout>
    );
};

export default SingleGroup;
