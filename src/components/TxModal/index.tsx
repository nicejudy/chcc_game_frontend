import React, { useState } from "react";
import { ReactComponent as XIcon } from "src/assets/icons/x.svg";
import { Box, Modal, Paper, SvgIcon, IconButton, OutlinedInput, InputAdornment, InputLabel, MenuItem, FormControl, Select, FormGroup, FormControlLabel, Checkbox, Chip } from "@material-ui/core";
import "./txmodal.scss";
import { useTheme, makeStyles, RadioGroup, Radio, Input } from "@material-ui/core";
import ConnectMenu from "src/components/Header/connect-button";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "src/store/slices/state.interface";
import { AttackHive, StakeHive, ContributeItems } from "src/store/slices/nft-thunk";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/store/slices/pending-txns-slice";
import { loadInvaderInfoDetails, InvaderInterface } from "src/store/slices/search-slice";
import { useWeb3Context } from "src/hooks";
import { DEFAULD_NETWORK } from "src/constants";

interface ITxProps {
    open: boolean;
    handleClose: () => void;
    filter: string;
    hid: string;
}

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
//   function getStyles(name, hornetName, theme) {
//     return {
//       fontWeight:
//         hornetName.indexOf(name) === -1
//           ? theme.typography.fontWeightRegular
//           : theme.typography.fontWeightMedium,
//     };
//   }

function TxModal({ open, handleClose, filter, hid }: ITxProps) {
    const { provider, address, chainID, providerChainID, checkWrongNetwork } = useWeb3Context();
    const dispatch = useDispatch();

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const nfs = useSelector<IReduxState, number[]>(state => {
        return state.account.nfs;
    });

    const tfs = useSelector<IReduxState, number[]>(state => {
        return state.account.tfs;
    });

    const avps = useSelector<IReduxState, number[]>(state => {
        return state.account.avps;
    });

    const crs = useSelector<IReduxState, number[]>(state => {
        return state.account.crs;
    });

    const hornets = useSelector<IReduxState, number[]>(state => {
        return state.account.hornets;
    });

    const invaders = useSelector<IReduxState, number[]>(state => {
        return state.account.invaders;
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [invaderInfo, setInviderInfo] = useState<InvaderInterface[]>([]);
    const [invaderStatus, setInvaderStatus] = useState<number>(0);

    const loadInvaderInfo = async (ins: number) => {
        setLoading(true);
        const data = await loadInvaderInfoDetails({networkID: chainID, ids: [ins], provider});
        console.log(0)
        setInviderInfo(data.invaderInfos);
        const passed = Math.floor(Date.now() / 1000) - data.invaderInfos[0].lastProcessingTime;
        if (data.invaderInfos[0].status == 0) {
            setInvaderStatus(0);
        } else {
            setInvaderStatus(86400 - passed);
        }
        setLoading(false);
    };

    let hornetNames = [];

    for (let i = 0; i < hornets?.length; i++) {
        hornetNames.push(hornets[i].toString());
    }

    const classes = useStyles();

    const theme = useTheme();
    const [hornetName, setHornetName] = useState<string[]>([]);
    const [hornetIDs, setHornetIDs] = useState<string[]>([]);

    const handleChangeForInvaders = (event: React.ChangeEvent<{ value: unknown }>) => {
        // const { options } = event.target as HTMLSelectElement;
        // const value: string[] = [];
        // for (let i = 0, l = options.length; i < l; i += 1) {
        //     if (options[i].selected) {
        //         value.push(options[i].value);
        //     }
        // }
        setHornetName(event.target.value as string[]);
        setHornetIDs(event.target.value as string[]);
    };

    const [workOrGuard, setWorkOrGuard] = useState<string>("0");

    const handleChangeForWorkOrGuard = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWorkOrGuard(event.target.value);
    }

    const [invader, setInvader] = useState<number>(0);

    const handleChangeForInvader = (e: React.ChangeEvent<{ value: unknown }>) => {
        setInvader(parseInt(e.target.value as string));
        loadInvaderInfo(parseInt(e.target.value as string));
    }

    const [avp, setAVP] = useState<boolean>(false);
    const [nf, setNF] = useState<number>(0);
    const [tf, setTF] = useState<number>(0);
    const [cr, setCR] = useState<number>(0);
    const [nfArray, setNFArray] = useState<number[]>([]);
    const [tfArray, setTFArray] = useState<number[]>([]);
    const [crArray, setCRArray] = useState<number[]>([]);

    const handleChangeForNF = (e: React.ChangeEvent<HTMLInputElement>) => {
        let array = [];
        const n = e.target.value;
        for (let i = 0; i < parseInt(n); i++) {
            array.push(nfs[i]);
        }
        setNF(parseInt(n));
        setNFArray(array);
    }

    const handleChangeForTF = (e: React.ChangeEvent<HTMLInputElement>) => {
        let array = [];
        const n = e.target.value;
        for (let i = 0; i < parseInt(n); i++) {
            array.push(tfs[i]);
        }
        setTF(parseInt(n));
        setTFArray(array);
    }

    const handleChangeForCR = (e: React.ChangeEvent<HTMLInputElement>) => {
        let array = [];
        const n = e.target.value;
        for (let i = 0; i < parseInt(n); i++) {
            array.push(crs[i]);
        }
        setCR(parseInt(n));
        setCRArray(array);
    }

    let onMint = () => {};
    let text1 = "";
    let text2 = "";
    let titleText = "";
    let buttonText = "";

    if (filter == "attack") {
        text1 = "Input Name";
        text2 = "Judy's house";
        titleText = "Attack ";
        buttonText = "Attack";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(AttackHive({ hid: parseInt(hid), aid: invader, avps: avp? [avps[0]] : [], crs: crArray,  provider, networkID: chainID, handleClose }));
        };
    } else if (filter == "stake") {
        text1 = "Address";
        text2 = "Input Address to transfer";
        titleText = "Stake Hornets";
        buttonText = "Stake";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(StakeHive({ hid: parseInt(hid), hornets: hornetName, provider, tag: workOrGuard == "1"? true : false, networkID: chainID, handleClose }));
        };
    } else if (filter == "action") {
        text1 = "$CML";
        text2 = "Input New Name";
        titleText = "Harvest";
        buttonText = "Stake";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            // dispatch(ActionHive({ hid: parseInt(hid), quantity, provider, address, networkID: chainID, handleClose }));
        };
    } else if (filter == "contributenf") {
        text1 = "$CML";
        text2 = "Input New Name";
        titleText = "Contribute Nectar Farms";
        buttonText = "Stake";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(ContributeItems({ hid: parseInt(hid), items: nfArray, tag: true, provider, networkID: chainID, handleClose }));
        };
    } else if (filter == "contributetf") {
        text1 = "$CML";
        text2 = "Input New Name";
        titleText = "Contribute Toxic Force Fields";
        buttonText = "Stake";
        onMint = async () => {
            if (await checkWrongNetwork()) return;
            dispatch(ContributeItems({ hid: parseInt(hid), items: tfArray, tag: false, provider, networkID: chainID, handleClose }));
        };
    }

    const setMaxNumberForCR = () => {
        if (crs.length > 4) {
            setCR(4);
            let array = [];
            for (let i = 0; i < 4; i++) {
                array.push(crs[i]);
            }
            setCRArray(array);
        } else {
            setCR(crs.length);
            setCRArray(crs);
        }
    };

    const setMaxNumberForNF = () => {
        if (nfs.length > 5) {
            setNF(5);
            let array = [];
            for (let i = 0; i < 5; i++) {
                array.push(nfs[i]);
            }
            setNFArray(array);
        } else {
            setNF(nfs.length);
            setNFArray(nfs);
        }
    };

    const setMaxNumberForTF = () => {
        if (tfs.length > 20) {
            setTF(20);
            let array = [];
            for (let i = 0; i < 20; i++) {
                array.push(tfs[i]);
            }
            setTFArray(array);
        } else {
            setTF(tfs.length);
            setTFArray(tfs);
        }
    };

    if (pendingTransactions && pendingTransactions.length > 0) {
        buttonText = `${pendingTransactions.length} Pending `;
    }

    return (
        <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
            <div className="hades-container">
                <Paper className="ohm-card ohm-popover txmodal-poper">
                    <div className="cross-wrap">
                        <div className="txmodal-title">
                            <p>{titleText}</p>
                        </div>
                        <IconButton onClick={handleClose}>
                            <SvgIcon color="primary" component={XIcon} />
                        </IconButton>
                    </div>
                    {(!address || DEFAULD_NETWORK != providerChainID) && <div className="txmodal-wallet"><ConnectMenu /></div>}
                    {(address && DEFAULD_NETWORK == providerChainID) && <Box className="card-content">
                        <div className="txmodal-header">
                            <div className="txmodal-header-token-select-wrap">
                                {filter == "attack" && (
                                    <>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="demo-simple-select-label">Select Invader</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={invader.toString()}
                                                label="Invader"
                                                onChange={handleChangeForInvader}
                                            >
                                                {invaders.map(item => (
                                                    <MenuItem key={item*1} value={item*1}>Animus #{item*1}</MenuItem>
                                                ))}
                                            </Select>
                                            {invaderStatus > 0 && <p className="txmodal-invader-wait-text">You should wait {invaderStatus} seconds</p>}
                                        </FormControl>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox onChange={e => setAVP(e.target.checked)}/>} label="Use Anti-Venom Plating" />
                                        </FormGroup>
                                        <div className="txmodal-header-help-text">
                                            <p>Input number of Claw Reinforcements</p>
                                        </div>
                                        <OutlinedInput
                                            type="number"
                                            placeholder="0"
                                            className="txmodal-header-token-select-input"
                                            value={cr}
                                            onChange={handleChangeForCR}
                                            labelWidth={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className="txmodal-header-token-select-input-btn" onClick={setMaxNumberForCR}>
                                                        <p>Max</p>
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </>
                                )}
                                {filter == "stake" && (
                                    <>
                                        {/* <div className="txmodal-header-help-text">
                                            <p>Select Hornets</p>
                                        </div> */}
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-multiple-chip-label">Select Hornets</InputLabel>
                                            <Select
                                                labelId="demo-multiple-chip-label"
                                                id="demo-multiple-chip"
                                                multiple
                                                value={hornetName}
                                                onChange={handleChangeForInvaders}
                                                input={<Input id="select-multiple-chip" />}
                                                renderValue={(selected: unknown) => (
                                                    <div className={classes.chips}>
                                                        {(selected as string[]).map((value) => (
                                                            <Chip key={value} label={value} className={classes.chip} />
                                                        ))}
                                                    </div>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {hornetNames.map((name) => (
                                                    <MenuItem
                                                        key={name}
                                                        value={`${name}`}
                                                        // style={getStyles(name, hornetName, theme)}
                                                    >
                                                    Hornets #{name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {/* <FormControl component="fieldset"> */}
                                            {/* <FormLabel component="legend">Gender</FormLabel> */}
                                            <RadioGroup aria-label="gender" name="gender1" value={workOrGuard} onChange={handleChangeForWorkOrGuard}>
                                                <FormControlLabel value="1" control={<Radio />} label="Use for Working" />
                                                <FormControlLabel value="0" control={<Radio />} label="Use for Guarding" />
                                            </RadioGroup>
                                        {/* </FormControl> */}
                                    </>
                                )}
                                {filter == "action" && (
                                    <>
                                        <div className="txmodal-header-help-text">
                                            <p>
                                                Warning: <span className="txmodal-span">5%</span> of Locked $CML will be burned as fee.
                                            </p>
                                        </div>
                                    </>
                                )}
                                {filter == "contributenf" && (
                                    <>
                                        <div className="txmodal-header-help-text">
                                            <p>Contribute Nectar Farms</p>
                                        </div>
                                        <OutlinedInput
                                            type="text"
                                            placeholder={text2}
                                            className="txmodal-header-token-select-input"
                                            value={nf}
                                            onChange={handleChangeForNF}
                                            labelWidth={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className="txmodal-header-token-select-input-btn" onClick={setMaxNumberForNF}>
                                                        <p>Max</p>
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </>
                                )}
                                {filter == "contributetf" && (
                                    <>
                                        <div className="txmodal-header-help-text">
                                            <p>Contribute Toxic Force Fields</p>
                                        </div>
                                        <OutlinedInput
                                            type="text"
                                            placeholder={text2}
                                            className="txmodal-header-token-select-input"
                                            value={tf}
                                            onChange={handleChangeForTF}
                                            labelWidth={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className="txmodal-header-token-select-input-btn" onClick={setMaxNumberForTF}>
                                                        <p>Max</p>
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </>
                                )}
                                {invaderStatus == 0 && <div
                                    className="txmodal-header-token-select-btn"
                                    onClick={async () => {
                                        if (isPendingTxn(pendingTransactions, "pending...")) return;
                                        await onMint();
                                    }}
                                >
                                    <p>{txnButtonText(pendingTransactions, "", buttonText)}</p>
                                </div>}
                                {invaderStatus > 0 && <div
                                    className="txmodal-header-token-select-btn"
                                >
                                    <p>{buttonText}</p>
                                </div>}
                            </div>
                        </div>
                    </Box>}
                </Paper>
            </div>
        </Modal>
    );
}

export default TxModal;
