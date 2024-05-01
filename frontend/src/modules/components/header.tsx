import React from "react";
import { Container, Grid, ButtonGroup } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import AuthButton from "./authbutton";

interface NavItem {
    to: string;
    text: string;
}

const Header: React.FC = () => {
    const currUrl = useLocation();

    const navs: NavItem[] = [
        { to: "/home", text: "Home" },
        { to: "/groups", text: "Groups" },
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
                            <h1 className="text-primary mb-0">OcoolO</h1>
                        </div>
                        <nav>
                            <ul className="nav-pills ms-3">
                                {navs.map((nav, index) => (
                                    <li key={index}>
                                        <Link to={nav.to} className={currUrl.pathname === nav.to ? "active" : ""}>
                                            {nav.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Grid>
                    <Grid item xs={4} className="text-end">
                        <ButtonGroup className="ml-3 px-4">
                            <AuthButton text="Sign In" to="/auth/signin" currentPath={currUrl.pathname} variant="outlined" />
                            <AuthButton text="Sign Up" to="/auth/signup" currentPath={currUrl.pathname} variant="outlined" />
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </header>
        </Container>
    );
};

export default Header;
