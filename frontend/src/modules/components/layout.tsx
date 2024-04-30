import React from 'react';
import { Container } from "react-bootstrap";
import Header from "./header";
import DownProps from './downprops';

interface Props {
    children: React.ReactNode
    downprops?: boolean;
}

const Layout: React.FC<Props> = ({ children, downprops=true }) => {
    return (
        <div>
            <Header />
            <Container>
                {children}
            </Container>
            {downprops && <DownProps/>}
        </div>
    );
} 

export default Layout;
