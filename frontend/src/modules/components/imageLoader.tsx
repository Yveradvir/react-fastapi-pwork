import React, { useState } from 'react';
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import { ErrorMessage, Field, FormikValues, useFormikContext } from 'formik';
import Danger from './danger';
import blobToBase64 from '@modules/utils/blob';
import ImageModal from '@modules/modals/image.modal';
import { CgClose, CgImage } from 'react-icons/cg';

interface ImageLoaderProps {
    field_name: string;
    label: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({ field_name, label }) => {
    const { setFieldValue } = useFormikContext<FormikValues>();
    const [imageUrl, setImageUrl] = useState<string>('');

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Form.Group controlId={field_name}>
                <Form.Label>{label}</Form.Label>
                <Row>
                    <Col lg={10}>
                        <Field 
                            type="file" 
                            name={field_name} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files && e.target.files[0];
                                if (file instanceof File) {
                                    setFieldValue(field_name, file)
                                    blobToBase64(new Blob([file], {type: file.type}))
                                        .then((b64) => {
                                            setImageUrl(b64);
                                        })
                                        .catch((error) => {
                                            console.error('Error converting file to Base64:', error);
                                        });
                                }
                            }} 
                            value={undefined}
                            as={Form.Control} 
                        />
                    </Col>
                    <Col>
                        <ButtonGroup>
                            <Button 
                                variant='outline-info'
                                onClick={() => {console.log(imageUrl); setIsModalOpen(true)}}
                            >
                                <CgImage />
                            </Button>
                            <Button 
                                variant='outline-danger'
                                onClick={() => {
                                    setFieldValue(field_name, undefined)
                                    setImageUrl("")
                                }}
                            >
                                <CgClose />
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <ErrorMessage name={field_name}>{(msg) => <Danger text={msg} />}</ErrorMessage>
            </Form.Group>
            
            <ImageModal
                show={isModalOpen}
                onClose={handleCloseModal}
                imageUrl={imageUrl}
            />
        </>
    );
};

export default ImageLoader;
