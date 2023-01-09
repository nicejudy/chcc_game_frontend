import React, { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { Grid, Zoom, TextField, OutlinedInput } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { trim } from "src/helpers";
import { useQueryParam, StringParam } from "use-query-params";
import Cookies from "universal-cookie";
import "./hivepage.scss";
import { IReduxState } from "src/store/slices/state.interface";
import { IAppSlice } from "src/store/slices/app-slice";
import { loadHiveDayDetails, loadAttackInfoDetails } from "src/store/slices/search-slice";
import HiveCard from "src/components/HiveCard";
import TigerModal from "src/components/TigerModal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { DEFAULD_NETWORK, RPC_URL } from "src/constants";
import { range } from "lodash";
import HiveImage from "src/assets/images/hive.png";

function HivePage() {

    const [id, setId] = useQueryParam("id", StringParam);

    const cookies = new Cookies();

    if (id) {
        cookies.set("id", id);
    }

    // const [nfts, setNfts] = useState<IAttackInfoDetails[]>([]);

    return (
        <>
            <div className="hivepage">
                <Grid className="hivepage-container" container spacing={4}>
                    <Grid className="hivepage-left" item lg={6} md={6} sm={12} xs={12}>
                        <div className="hive-image-section">
                            <img src={HiveImage} width="300px" />
                            <h2 className="hexagon-number">{cookies.get("id")}</h2>
                        </div>
                        <div className="hive-attack-info"></div>
                    </Grid>
                    <Grid className="hivepage-right" item lg={6} md={6} sm={12} xs={12}>
                        <div className="hive-today-info"></div>
                        <div className="hive-action-info"></div>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default HivePage;