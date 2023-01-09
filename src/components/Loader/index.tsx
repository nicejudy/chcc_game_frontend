import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
// import GifIcon from "src/assets/icons/nft_small.gif";
import "./loader.scss";

function Loader() {
    return (
        <div className="loader-wrap">
            {/* <img src={GifIcon} width="100" /> */}
            <CircularProgress size={120} color="inherit" />
        </div>
    );
}

export default Loader;
