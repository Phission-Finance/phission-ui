import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import {eth, mint, tokenDictionary, trades, weth} from "../const/const";
import SwapInput from "../components/swapInput";
import {useEffect, useState} from "react";
import BN from "bn.js";
import {approve, checkAllowance, checkBalance, roundString, wethMint} from "../helpers/erc20";
import {BigNumber, ethers, utils} from "ethers";
import Dropdown from "react-bootstrap/Dropdown";
import LoadingButton from "../components/loadingButton";


const Mint: NextPage = () => {

    const [mintAsset, setMintAsset] = useState({token: weth, balance: BigNumber.from(0), initialCheck: false})
    const [amountIn, setAmountIn] = useState(BigNumber.from(0))
    // @ts-ignore
    const [mintOptions, setMintOptions] = useState(mint[weth.symbol])
    const [mintButtonState, setMintButtonState] = useState({text: 'Mint', disabled: true, action: {}})
    const [burnButtonState, setBurnButtonState] = useState({text: 'Burn', disabled: false, action: {}})

    useEffect(() => {
        if (!mintAsset.initialCheck) {
            handleAssetInChange(weth.symbol)
        }
    })

    function handleAssetInChange(symbol: string) {
        // @ts-ignore
        let token = tokenDictionary[symbol]

        // @ts-ignore
        let ops = mint[symbol]

        for (let i = 0; i < ops.tokens.length; i++) {
            checkBalance(ops.tokens[i].token).then((bal: BigNumber) => {
                console.log("Balance", ops.tokens[i].token.symbol, bal.toString())
                ops.tokens[i].balance = bal
            })
        }

        setMintOptions(ops)

        checkBalance(token).then((bal: BigNumber) => {
            console.log("Balance", symbol, bal.toString())
            setMintAsset({token: token, balance: bal, initialCheck: true})
        })
    }

    function handleAmountInChange(val: string) {
        console.log("Mint", val, mintAsset.token.symbol)

        let amtIn = ethers.utils.parseUnits(val, mintAsset.token.decimals)

        setAmountIn(amtIn)

        checkApprovalState(amtIn)
    }

    function checkApprovalState(amountIn: BigNumber) {

        let mintFunction = async () => await mintOptions.mintFunc(amountIn)
        let burnFunction = async () => await mintOptions.burnFunc(amountIn)

        setBurnButtonState({text: 'Burn', disabled: false, action: burnFunction})

        console.log("checkApprovalState", mintAsset.token.symbol, amountIn.toString())
        if (amountIn.isZero()) {
            setMintButtonState({text: 'Mint', disabled: true, action: mintFunction})
        } else if (!mintOptions.needsApproval) {
            setMintButtonState({text: 'Mint', disabled: false, action: mintFunction})
        } else {
            checkAllowance(mintAsset.token, mintOptions.contract).then((allowance: BigNumber) => {
                console.log("Allowance", mintAsset.token.symbol, allowance.toString())
                if (amountIn.gt(allowance)) {
                    setMintButtonState({text: 'Approve', disabled: false, action: async () => {
                            await approve(mintAsset.token, mintOptions.contract.address, amountIn).then(() => {
                                setMintButtonState({text: 'Mint', disabled: false, action: mintFunction})
                            })
                        } })
                } else  {
                    setMintButtonState({text: 'Mint', disabled: false, action: mintFunction})
                }
            })
        }
    }

    return (
        <div className={styles.container}>
                <main className={styles.main}>
                    <SwapInput label={"Asset In"} values={Object.keys(mint).sort()} onChangeInput={handleAmountInChange} dropdownValue={mintAsset.token.symbol} onChangeDropdown={handleAssetInChange}/>
                    <h4>Balance {
                        roundString(utils.formatUnits(mintAsset.balance.toString(), mintAsset.token.decimals))
                    }</h4>

                    <div className={styles.horizontalContainer}>
                        {mintOptions.tokens.map((op:any, index: number) => (
                            <h4 key={op.token.symbol}>{op.token.symbol} Balance: {roundString(utils.formatUnits(op.balance.toString(), op.token.decimals))}</h4>
                        ))}
                    </div>

                    <div className={styles.horizontalContainer}>
                        <LoadingButton text={mintButtonState.text} action={mintButtonState.action} disabled={mintButtonState.disabled} width={undefined}/>
                        <LoadingButton text={burnButtonState.text} action={burnButtonState.action} disabled={burnButtonState.disabled} width={undefined}/>
                    </div>

                </main>
        </div>
    );
};

export default Mint;
