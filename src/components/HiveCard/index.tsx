import { useEffect, useState } from "react";
import { useWeb3Context } from "src/hooks";
// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import { IHiveInfo } from "src/store/slices/app-slice";
import { Link, makeStyles } from "@material-ui/core";
import { getAddresses, Networks, OPENSEA_ITEM_URL, INVITE_LINK } from "src/constants";
import TigerModal from "../TigerModal";
import TxModal from "../TxModal";
import "./hivecard.scss";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import CopyLinkIcon from "src/assets/icons/copylink.png";
import HiveImage from "src/assets/images/hive.png";
import JoinBtnImage from "src/assets/images/join-btn.png";
import AttackBtnImage from "src/assets/images/attack-btn.png";
import ProgressBarImage from "src/assets/images/progress-bar.png";
import DefendersBarImage from "src/assets/images/defenders.png";
import ContributeBarImage from "src/assets/images/contribute.png";
import ProgressBarEmptyImage from "src/assets/images/progress_bar_empty.png";
import ProgressBarGreenImage from "src/assets/images/progress_bar_green.png";
import ProgressBarRedImage from "src/assets/images/progress_bar_red.png";
import ProgressBarYellowImage from "src/assets/images/progress_bar_yellow.png";
import { range } from "lodash";
import { loadHornetsDetails, IHornet } from "src/store/slices/search-slice";

interface IHiveCardProps {
    hiveId: number;
    hiveInfo: IHiveInfo;
    hornetsInfo: IHornet[]
    // handleOpen: (a: string) => void;
}

const useStyles = (i: number) => makeStyles(theme => ({
    drawer: {
        left: i*13
    }
}));

function HiveCard({ hiveId, hiveInfo, hornetsInfo }: IHiveCardProps) {

    const { provider, address, chainID, providerChainID, checkWrongNetwork } = useWeb3Context();

    const health = hiveInfo.health;
    const nectars = hiveInfo.nectarFarms? hiveInfo.nectarFarms.length : 0;
    const toxics = hiveInfo.toxicForceFields? hiveInfo.toxicForceFields.length : 0;

    let workers = [];
    let guarders = [];

    for (let index = 0; index < hornetsInfo.length; index++) {
        if (hornetsInfo[index].status == 1) {workers.push(hornetsInfo[index]);}
        if (hornetsInfo[index].status == 2) {guarders.push(hornetsInfo[index]);}
    }

    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onTx = (param: string) => {
        setFilter(param);
        handleOpen();
    }

    const healthImage = health > 0? health > 400000? health > 800000? ProgressBarGreenImage : ProgressBarYellowImage : ProgressBarRedImage : ProgressBarEmptyImage;
    const nectarImage = nectars > 0? nectars > 2? nectars > 4? ProgressBarGreenImage : ProgressBarYellowImage : ProgressBarRedImage : ProgressBarEmptyImage;
    const toxicImage = toxics > 0? toxics > 8? toxics > 16? ProgressBarGreenImage : ProgressBarYellowImage : ProgressBarRedImage : ProgressBarEmptyImage;

    return (
        <>
            <div className="hive-card">
                <div className="card-top"><img width="150" src={HiveImage} /><h2 className="hexagon-number">{hiveId+1}</h2></div>
                <div className="card-info-1">
                    <div onClick={() => onTx("stake")}>
                        <img className="card-btn-join" src={JoinBtnImage} width="120px" />
                        <h3 className="card-btn-join-text">JOIN</h3>
                    </div>
                    <div onClick={() => onTx("attack")}>
                        <img className="card-btn-img" src={AttackBtnImage} width="160px" />
                        <h3 className="card-btn-attack-text">ATTACK</h3>
                    </div>
                    <h3 className="card-health-text">HEALTH</h3>
                    <img className="card-btn-img" src={ProgressBarImage} width="160px" />
                    <img className="card-btn-img" src={DefendersBarImage} width="240px" />
                    <h3 className="card-defenders-number-text">{guarders.length}</h3>
                    <h3 className="card-defenders-text">DEFENDERS</h3>
                    {range(health/100000).map(item => (
                        <img className={`${useStyles(item)().drawer} card-health-progress`} src={healthImage} width="11px" height="35px" />
                    ))}
                    {range(10-health/100000).map(item => (
                        <img className={`${useStyles(9-item)().drawer} card-health-progress`} src={ProgressBarEmptyImage} width="11px" height="35px" />
                    ))}
                </div>
                <div className="card-info-2">
                    <h3 className="card-nectar-text">NECTAR FARMS</h3>
                    <img className="card-btn-img" src={ProgressBarImage} width="160px" />
                    <div onClick={() => onTx("contributenf")}>
                        <img className="card-btn-contribute" src={ContributeBarImage} width="225px" />
                        <h3 className="card-contribute-nf-text">CONTRIBUTE</h3>
                    </div>
                    {range(nectars*2).map(item => (
                        <img className={`${useStyles(item)().drawer} card-nectar-progress`} src={nectarImage} width="11px" height="33px" />
                    ))}
                    {range(10-nectars*2).map(item => (
                        <img className={`${useStyles(9-item)().drawer} card-nectar-progress`} src={ProgressBarEmptyImage} width="11px" height="33px" />
                    ))}
                </div>
                <div className="card-info-2">
                    <h3 className="card-toxic-text">TOXIC</h3>
                    <h3 className="card-forcefield-text">FORCE FIELDS</h3>
                    <img className="card-btn-img" src={ProgressBarImage} width="160px" />
                    <div onClick={() => onTx("contributetf")}>
                        <img className="card-btn-contribute" src={ContributeBarImage} width="225px" />
                        <h3 className="card-contribute-tf-text">CONTRIBUTE</h3>
                    </div>
                    {range(toxics/2).map(item => (
                        <img className={`${useStyles(item)().drawer} card-toxic-progress`} src={toxicImage} width="11px" height="34px" />
                    ))}
                    {range(10-toxics/2).map(item => (
                        <img className={`${useStyles(9-item)().drawer} card-toxic-progress`} src={ProgressBarEmptyImage} width="11px" height="34px" />
                    ))}
                </div>
                <br />
                {/* <div className="card-name-wrap">
                    <p className="card-name-text" onClick={() => handleOpen(nftId)}>CTNC #{nftId}</p>
                </div> */}
                <br />
                {/* <Link className="card-opensea-link" href={`${OPENSEA_ITEM_URL}${addresses.NFT_MANAGER}/${nftId}`} target="_blank">
                    <p>See on OpenSea</p>
                </Link> */}
            </div>
            {/* <TigerModal open={open} handleClose={handleClose} nftId={nftId} /> */}
            <TxModal open={open} handleClose={handleClose} filter={filter} hid={hiveId.toString()} />
        </>
    );
}

export default HiveCard;
