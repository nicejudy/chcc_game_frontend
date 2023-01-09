import React, { useState } from "react";
import "./view-base.scss";
import Header from "../Header";
import { Hidden, makeStyles, useMediaQuery } from "@material-ui/core";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";
import MobileDrawer from "../Drawer/mobile-drawer";
import Drawer from "../Drawer";
import Messages from "../Messages";
import HomeImage from "src/assets/images/hornet_vs_anim_art.png";
import TitleImage from "src/assets/images/hornet_vs_anim.png";
import LogoImage from "src/assets/images/logo.png";

interface IViewBaseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: DRAWER_WIDTH,
            flexShrink: 0,
        },
    },
    content: {
        padding: theme.spacing(1),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        height: "100%",
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function ViewBase({ children }: IViewBaseProps) {
    const classes = useStyles();

    const [mobileOpen, setMobileOpen] = useState(false);

    const isSmallerScreen = useMediaQuery("(max-width: 960px)");
    const isSmallScreen = useMediaQuery("(max-width: 600px)");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className="view-base-root">
            <img src={LogoImage} alt="logo" style={{zIndex: 2}}/>
            <img src={TitleImage} alt="hornet_vs_anim" style={{zIndex: 2}}/>
            <img src={HomeImage} alt="hornet_vs_anim" style={{margin: "0 0", zIndex: 1}} />
            <Messages />
            <Header drawe={!isSmallerScreen} handleDrawerToggle={handleDrawerToggle} />
            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
                {children}
            </div>
        </div>
    );
}

export default ViewBase;
