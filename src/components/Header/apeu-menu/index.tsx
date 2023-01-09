import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../../hooks";
import { getAddresses, TOKEN_DECIMALS, Networks, SWAP_URL, ETH_ADDRESSES } from "../../../constants";
import CartIcon from "../../../assets/icons/cart.png";
import VenomIcon from "../../../assets/images/venom.png";
import ETHIcon from "../../../assets/icons/ethereum.png";
import { SvgIcon, Link, Box, Popper, Fade } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IReduxState } from "src/store/slices/state.interface";
import ConnectButton from "../connect-button";
import "./time-menu.scss";

function ApeuButton() {
    const { providerChainID, connected, web3 } = useWeb3Context();

    const [isConnected, setConnected] = useState(connected);

    const addresses = getAddresses(Networks.ETH);

    const venomBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(state.account.balances.venom)))}`;
    });

    const ethBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && `${new Intl.NumberFormat("en-US").format(Math.floor(parseInt(state.account.balances.eth)))}`;
    });

    const VENOM_ADDRESS = addresses.VENOM_ADDRESS;

    const isVerySmallScreen = useMediaQuery("(max-width: 500px)");

    const addToken = () => async () => {
        const host = window.location.origin;
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: VENOM_ADDRESS,
                            symbol: "VENOM",
                            decimals: TOKEN_DECIMALS,
                            image: `${host}/${VenomIcon}`,
                        },
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <>
            {providerChainID == Networks.ETH && isConnected && (
                <>
                    <div className="time-menu-root">
                        <Box component="div" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
                            <div className="time-menu-btn">
                                {
                                    !isVerySmallScreen ? 
                                        <div className="time-menu-wrap">
                                            <img alt="" width="30" src={VenomIcon} /><p>&nbsp;MENU</p>
                                        </div>
                                    :
                                        <img alt="" width="30" src={VenomIcon} />
                                }
                            </div>
                            <Popper className="time-menu-poper" open={open} anchorEl={anchorEl} transition>
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={200}>
                                        <div className="tooltip">
                                            <div className="tooltip-item-text">
                                                <img alt="" width="20" src={VenomIcon} /><p>{venomBalance}</p>
                                            </div>
                                            <div className="tooltip-item-text">
                                                <img alt="" width="20" src={ETHIcon} /><p>{ethBalance}</p>
                                            </div>
                                            <div className="tooltip-item-line">
                                            </div>
                                            <Link className="tooltip-item" href={`${SWAP_URL}outputCurrency=${ETH_ADDRESSES.VENOM_ADDRESS}`} target="_blank">
                                                <p>BUY VENOM</p>
                                            </Link>
                                            <div className="tooltip-item" onClick={addToken()}>
                                                <p>ADD TO METAMASK</p>
                                            </div>
                                            <ConnectButton />
                                        </div>
                                    </Fade>
                                )}
                            </Popper>
                        </Box>
                    </div>
                </>
            )}
            {(providerChainID != Networks.ETH || !isConnected) && <ConnectButton />}
        </>
    );
}

export default ApeuButton;
