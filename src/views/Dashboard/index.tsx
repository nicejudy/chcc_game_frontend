import React, { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { Grid, Zoom, TextField, OutlinedInput } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { trim } from "src/helpers";
import { useQueryParam, StringParam } from "use-query-params";
import "./dashboard.scss";
import { IReduxState } from "src/store/slices/state.interface";
import { IAppSlice } from "src/store/slices/app-slice";
// import { loadAccountDetails } from "src/store/slices/search-slice";
import HiveCard from "src/components/HiveCard";
import TxModal from "src/components/TxModal";
import TigerModal from "src/components/HiveModal";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { DEFAULD_NETWORK, RPC_URL } from "src/constants";
import { range } from "lodash";

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);

    const provider = new StaticJsonRpcProvider(RPC_URL);
    const chainID = DEFAULD_NETWORK;

    const [loading, setLoading] = useState<boolean>(false);

    let nftsall : string[] = [];
    // for (let i = 1; i <= 30; i++){
    //     if (i > app.nftMintedSupply) break;
    //     nftsall.push(i.toString());
    // }

    // const [name, setName] = useState<string[]>([]);
    // const [query, setQuery] = useState<string>("");

    // const [nfts, setNfts] = useState<string[]>(nftsall);

    // const LoadMore = () => {
    //     let moreNfts = nfts;
    //     const count = nfts.length;
    //     for (let i = 1; i <= 30; i++){
    //         if (i + count > app.nftMintedSupply) break;
    //         const item = i + count;
    //         moreNfts.push(item.toString());
    //     }
    //     setNfts(moreNfts);
    // }

    // const [loading, setLoading] = useState<boolean>(false);

    // const handleKey = (e: any) => {
    //     if (e.keyCode == 13) {
    //         if (ethers.utils.isAddress(name[0])) searchAddress(name[0]);
    //         else if (parseInt(name[0]) > 0 && parseInt(name[0]) <= app.nftMintedSupply * 1) searchID(name);
    //         else if (isNameArray(name[0])) return;
    //         else {
    //             setNfts(nftsall);
    //             setQuery("");
    //             setName([]);
    //             return;
    //         }
    //         setQuery("query");
    //         setName([]);
    //     }
    // };

    // const searchAddress = async (name: string) => {
    //     setLoading(true);
    //     const data = await loadAccountDetails({ networkID: chainID, provider, address: name });
    //     setNfts(data.nfts);
    //     setLoading(false);
    // };

    // const searchID = async (name: string[]) => {
    //     setLoading(true);
    //     for (let i = 0; i < name.length; i++) {
    //         if (parseInt(name[i]) > app.nftMintedSupply) {
    //             return;
    //         }
    //     }
    //     // const data = await loadIdDetails({ networkID: chainID, provider, id: name });
    //     setNfts(name);
    //     setLoading(false);
    // };

    // const isNameArray = (name: string) => {
    //     if (!name) return false;
    //     if (!name.startsWith("[")) return false;
    //     if (!name.endsWith("]")) return false;
    //     let content = name.substring(1, name.length - 1);
    //     content = content.replace(" ", "");
    //     const ids = content.split(",");
    //     for (let index = 0; index < ids.length; index++) {
    //         const id = ids[index];
    //         if (parseInt(id) <= 0 || parseInt(id) > app.nftMintedSupply * 1) return false;
    //     }
    //     searchID(ids);
    //     setQuery("query");
    //     setName([]);
    //     return true;
    // };

    const [open, setOpen] = useState(false);

    const [nftId, setNftId] = useState("")

    const handleOpen = (id: string) => {
        setNftId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <div className="dashboard-infos-nfts">
                    <Grid container spacing={1}>
                        {range(20).map(item => (
                            <Grid className="dashboard-infos-item" item xl={2} lg={3} md={3} sm={6} xs={12}>
                                <HiveCard hiveId={item} hiveInfo={app.hiveInfos[item]} hornetsInfo={app.allHornetInfos[item]} />
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </div>
            {/* <TigerModal open={open} handleClose={handleClose} nftId={nftId} /> */}
        </div>
    );
}

export default Dashboard;
