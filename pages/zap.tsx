import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import SwapInput from '../components/swapInput'
import Input from '../components/input'
import SwapValue from '../components/swapValue'
import LoadingButton from '../components/loadingButton'
import ApprovalButton from '../components/approvalButton'
import {useEffect, useState} from "react";
import {eth, tokenDictionary, trades, uniswapRouter, weth} from "../const/const";
import {checkAllowance, checkBalance, approve, roundString} from '../helpers/erc20'
import {BigNumber, ethers, utils} from 'ethers'
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";

type token = {
    symbol: string
    decimals: number,
    address: string,
    abi: string,
    balance: BigNumber
}

type trade = {
    contract: token,
    func: (x: BigNumber, minAmountOut: BigNumber, callStatic: boolean) => Promise<any>,
    needsApproval:boolean
}


const Zap: NextPage = () => {


    const [init, setInit] = useState(false)

    const [assetIn, setAssetIn] = useState(tokenDictionary["ETH"])
    const [assetInAmount, setAssetInAmount] = useState(BigNumber.from(0))
    const [assetInBalance, setAssetInBalance] = useState(BigNumber.from(0))

    const [assetOut, setAssetOut] = useState(tokenDictionary["WETH"])
    const [assetOutAmount, setAssetOutAmount] = useState(BigNumber.from(0))

    const [slippage, setSlippage] = useState(1)

    const [buttonState, setButtonState] = useState({text: 'Swap', disabled: true})
    const [approvalNeeded, setApprovalNeeded] = useState(false)

    const [sufficientLiquidity, setSufficientLiquidity] = useState(true)
    const [invalidSwap, setInvalidSwap] = useState(false)



    useEffect(() => {

        const jsonTrades = JSON.parse(JSON.stringify(trades))
        if (!(assetIn.symbol in jsonTrades) || !(assetOut.symbol in jsonTrades[assetIn.symbol])) {
            setInvalidSwap(true)
        }else {
            setInvalidSwap(false)
            
        if (assetInAmount.lte(assetInBalance)) {
            handleSetAssetOutAmount()
            handleSwapButtonState(true)
        } else {
            handleSwapButtonState(false)
        }
    }




                // setButtonState({text: 'Invalid Swap', disabled: true, action: {}})







    }, [assetInAmount,assetInBalance, assetIn, assetOut])


    function handleSetSlippage(val: number) {
        console.log("Set Slippage", val)
        setSlippage(val)
    }



    function handleAssetInValueChange(val: string) {
        console.log("Swap", val, assetIn, assetOut)

        let amountIn = ethers.utils.parseUnits(val, assetIn.decimals)

        setAssetInAmount(amountIn)
    }

    function handleSetAssetOutAmount() {
        // @ts-ignore
        if (trades[assetIn.symbol]) {
            // @ts-ignore
            if (trades[assetIn.symbol][assetOut.symbol]) {
                if (!assetInAmount.isZero()) {
                    // @ts-ignore
                    trades[assetIn.symbol][assetOut.symbol].func(assetInAmount,BigNumber.from(0), true).then((response: any) => {
                        console.log("Static Call", response)
                        let amountOut: BigNumber
                        // @ts-ignore
                        if (trades[assetIn.symbol][assetOut.symbol].contract == uniswapRouter) {
                            amountOut = response[1]
                            // @ts-ignore
                        } else if (trades[assetIn.symbol][assetOut.symbol].contract == weth) {
                            amountOut = assetInAmount
                        } else {
                            amountOut = response
                        }

                        if (!amountOut.eq(assetOutAmount)) {
                            setAssetOutAmount(amountOut)
                        }

                        if (!sufficientLiquidity) {
                            setSufficientLiquidity(true)
                        }
                    }).catch((err: any) => {
                        if (!assetOutAmount.isZero()) {
                            setAssetOutAmount(BigNumber.from(0))
                        }

                        if (sufficientLiquidity) {
                            setSufficientLiquidity(false)
                        }
                    })
                }
            }
        }


    }

    function handleSwapButtonState(sufficientBalance: boolean) {
        console.log("handleSwapButtonState", sufficientBalance, sufficientLiquidity, approvalNeeded)
        if (!sufficientBalance) {
            if (buttonState.text != 'Insufficient Balance') {
                setButtonState({text: 'Insufficient Balance', disabled: true})
            }
        } else if (!sufficientLiquidity) {
            if (buttonState.text != 'Insufficient Liquidity') {
                setButtonState({text: 'Insufficient Liquidity', disabled: true})
            }
        } else if (assetInAmount.isZero() || approvalNeeded) {
            if (!buttonState.disabled || buttonState.text != 'Swap')  {
                setButtonState({text: 'Swap', disabled: true})
            }
        } else  {
            if (buttonState.disabled || buttonState.text != 'Swap') {
                setButtonState({text: 'Swap', disabled: false})
            }
        }
    }

    async function handleExecute() {
        // @ts-ignore
        if (trades[assetIn.symbol]) {
            // @ts-ignore
            if (trades[assetIn.symbol][assetOut.symbol]) {
                // @ts-ignore
                await trades[assetIn.symbol][assetOut.symbol].func(assetInAmount, assetOutAmount.mul(BigNumber.from(1000-(slippage*10))).div(BigNumber.from(1000)), false)
            }
        }
    }

    function getTrade() {
        // @ts-ignore
        if (trades[assetIn.symbol]) {
            // @ts-ignore
            if (trades[assetIn.symbol][assetOut.symbol]) {
                // @ts-ignore
                return trades[assetIn.symbol][assetOut.symbol]
            }
        }
        return {}
    }

    return (
    <div className={styles.container}>


        <main className={styles.main}>

            <SwapInput label={"Asset In"} values={Object.keys(tokenDictionary).sort()}
                       token={assetIn}
                       onChangeInput={handleAssetInValueChange} onChangeAsset={setAssetIn}
                       onChangeBalance={setAssetInBalance}/>


            <SwapValue label={"Asset Out"} values={Object.keys(tokenDictionary).sort()}
                       onChangeAsset={setAssetOut} value={assetOutAmount} token={assetOut}/>


        {invalidSwap ? <h1>Invalid Zap</h1> : null}

            <Input label={"Slippage"} value={slippage} onChangeInput={handleSetSlippage} unit={"%"} small={true}></Input>

            <ApprovalButton tokenIn={assetIn} spender={getTrade()}
                            tokenInAmount={assetInAmount} setApprovalNeeded={setApprovalNeeded}></ApprovalButton>
            <LoadingButton text={buttonState.text} action={handleExecute} disabled={buttonState.disabled}
                           width={undefined}/>
        </main>
    </div>
  );
};

export default Zap;
