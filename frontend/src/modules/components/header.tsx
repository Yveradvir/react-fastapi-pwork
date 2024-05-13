// Header.jsx

import React from "react";
import { Container, Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
    to: string;
    text: string;
}

const Header: React.FC = () => {
    const currUrl = useLocation();

    const navs: NavItem[] = [
        { to: "/home", text: "Home" },
        { to: "/group", text: "Groups" },
        { to: "/pricing", text: "Pricing" },
        { to: "/faqs", text: "FAQs" },
        { to: "/about", text: "About" },
    ];

    return (
        <Container>
            <header className="py-4">
                <Grid container alignItems="center">
                    <Grid item xs={8} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <Typography variant="h4" component="h1" color="primary">
                                OcoolO
                            </Typography>
                        </div>
                        <nav>
                            <ul className="nav-pills ms-3" style={{ listStyleType: "none", padding: 0 }}>
                                {navs.map((nav, index) => (
                                    <li key={index} className="nav-item">
                                        <Link to={nav.to} className={`nav-link ${currUrl.pathname === nav.to ? "active" : ""}`}>
                                            {nav.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Grid>
                    <Grid item xs={4} className="text-end">
                        <ButtonGroup className="ml-3">
                            <Button component={Link} to="/auth/signin" variant="outlined" color="primary">
                                Sign In
                            </Button>
                            <Button component={Link} to="/auth/signup" variant="outlined" color="primary">
                                Sign Up
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </header>
        </Container>
    );
};

export default Header;
