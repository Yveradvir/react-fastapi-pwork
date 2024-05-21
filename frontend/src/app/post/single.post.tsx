import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@modules/components/layout";
import ErrorPage from "@modules/components/errorPage";
import {
    Button,
    Typography,
    CardMedia,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Star, Telegram } from "@mui/icons-material";
import { IoLogoDiscord } from "react-icons/io5";
import Carousel from "react-material-ui-carousel";
import { PostImages, PostProps } from "@modules/validations/post.vd";
import { InitialMixin, RejectedError } from "@modules/reducers/main";
import { LaunchedAxios } from "@modules/api/api";
import { YvesFile } from "@modules/utils/const";
import DeleteBtn from "@modules/components/deleteBtn";

interface IPostProps extends PostProps, InitialMixin { id: string }
interface IPostImages extends PostImages, InitialMixin { id: string }
interface Post extends InitialMixin {
    id: string;
    active: boolean;
    title: string;
    content: string;
    group_id: string;
    author_id: string;
    postProps: IPostProps;
    postImages: IPostImages;
}

interface IPost {
    post: Post;
    am_author: boolean;
}

const SinglePost: React.FC = () => {
    const navigate = useNavigate();
    const { post_id } = useParams<{ post_id: string }>();
    const [post, setPost] = useState<IPost | null>(null);
    const [error, setError] = useState<RejectedError | null>(null);

    const fetchPost = useCallback(async () => {
        try {
            const response = await LaunchedAxios.get(`/post/single/${post_id}`);
            if (response.data.ok) {
                setPost(response.data.subdata);
            } else {
                setError({ status_code: 404, detail: "Post not found" });
            }
        } catch (error) {
            setError({ status_code: 500, detail: "Failed to fetch post" });
        }
    }, [post_id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const renderImages = (images: IPostImages) => {
        if (!images) return null;
        
        const getOnlyImages = (images: IPostImages): Record<string, YvesFile> => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {id, created_at, updated_at, ...only_images} = images;
            return only_images;
        } 

        const only_images = getOnlyImages(images);
        const order = ['main', 'second', 'third', 'fourth', 'fifth'];

        return (
            <>
                {order.map((key) => (
                    only_images[key] && (
                        <CardMedia key={key} component="img" image={`data:image/jpeg;base64,${only_images[key]}`} alt={`post-image-${key}`} />
                    )
                ))}
            </>
        );
    };

    return (
        <Layout>
            {error ? (
                <ErrorPage status_code={error.status_code} initial_message={error.detail} />
            ) : (
                post && (
                    <>
                        <Typography variant="h4">{post.post.title}</Typography>
                        <Typography variant="body1" gutterBottom>
                            {post.post.content}
                        </Typography>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h5">Images</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Carousel>
                                    {renderImages(post.post.postImages)}
                                </Carousel>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h5">Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Star /> Rank: {post.post.postProps.rank || "N/A"}
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <IoLogoDiscord /> Discord: {post.post.postProps.discord_tag || "N/A"}
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Telegram /> Telegram: {post.post.postProps.telegram_tag || "N/A"}
                                    </Box>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        {post.am_author && (
                            <>  
                                <DeleteBtn
                                    label="Delete post"
                                    url={`/post/single/${post_id}`}
                                    callback={() => {navigate(-1)}}
                                />
                                <Button
                                    variant="contained"
                                    color="warning"
                                    style={{ marginTop: "16px" }}
                                    onClick={() => {
                                        const _ = async () => {
                                            await LaunchedAxios.patch(
                                                `/post/single/${post_id}/toggle`
                                            );
                                            navigate(-1)
                                        };
                                        _();            
                                    }}
                                >
                                    Switch activity
                                </Button>
                            </>
                        )}
                    </>
                )
            )}
        </Layout>
    );
};

export default SinglePost;
