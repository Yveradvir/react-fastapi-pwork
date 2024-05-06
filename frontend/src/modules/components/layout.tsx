import React from 'react';
import Container from '@mui/material/Container';
import Header from './header';
import YvesFab from './fab';
import cookies from '@modules/utils/cookies';

interface Props {
    children: React.ReactNode;
    needToFab?: boolean
}

const Layout: React.FC<Props> = ({ children, needToFab=true }) => {
    return (
        <div>
            <Header />
            <Container>
                {children}
            </Container>
            {needToFab && !!cookies.get("refresh_csrf") && <YvesFab/>}
        </div>
    );
};

export default Layout;
