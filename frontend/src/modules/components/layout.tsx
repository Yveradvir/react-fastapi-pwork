import React from 'react';
import { Container } from "react-bootstrap";
import Header from "./header";

interface Props {
    children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
    return (
        <div>
            <Header />
            <Container>
                {children}
            </Container>
        </div>
    );
} 

export default Layout;
