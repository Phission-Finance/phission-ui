import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import SwapInput from '../components/swapInput'
import Input from '../components/input'
import SwapValue from '../components/swapValue'
import LoadingButton from '../components/loadingButton'
import ApprovalButton from '../components/approvalButton'
import {useEffect, useState} from "react";
import {
    tokenDictionary,
    trades,
    uniswapRouter,
    weth
} from "../const/const";
import {BigNumber, ethers, utils} from 'ethers'
import {useAccount, useBalance, useContractRead, useProvider, useSigner} from "wagmi";

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

    const { data: signer } = useSigner()

    const { address, isConnecting, isDisconnected } = useAccount()

    const [init, setInit] = useState(false)

    const [trade, setTrade] = useState(undefined)

    const [assetIn, setAssetIn] = useState(tokenDictionary["ETH"])
    const [assetInAmount, setAssetInAmount] = useState(BigNumber.from(0))
    const [assetInBalance, setAssetInBalance] = useState(BigNumber.from(0))

    const [assetOut, setAssetOut] = useState(tokenDictionary["WETH"])
    const [assetOutAmount, setAssetOutAmount] = useState(BigNumber.from(0))

    const [slippage, setSlippage] = useState("1")

    const [buttonState, setButtonState] = useState({text: 'Swap', disabled: true})
    const [approvalNeeded, setApprovalNeeded] = useState(false)

    const [staticCallError, setStaticCallError] = useState(false)



    useEffect(() => {
        if (assetInAmount.lte(assetInBalance)) {
            handleSetAssetOutAmount()
            handleSwapButtonState(true, trade)
        } else {
            handleSwapButtonState(false, trade)
        }
    }, [assetInAmount,assetInBalance, trade])

    useEffect(() => {
        // @ts-ignore
        if (trades[assetIn.symbol]) {
            // @ts-ignore
            if (trades[assetIn.symbol][assetOut.symbol]) {
                // @ts-ignore
                setTrade(trades[assetIn.symbol][assetOut.symbol])
            } else {
                setTrade(undefined)
            }
        } else  {
            setTrade(undefined)
        }
    }, [assetIn, assetOut])


    // const { data: calculatedAmountOut } = useContractRead({
    //     addressOrName: getTradeAddress(assetIn, assetOut),
    //     contractInterface: getTradeAbi(assetIn, assetOut),
    //     functionName: getTradeFunctionName(assetIn, assetOut),
    //     args: getTradeArgsFunction(assetIn, assetOut)(assetInAmount, BigNumber.from(0), address),
    //     overrides: getTradeOverrideFunction(assetIn, assetOut)(assetInAmount, BigNumber.from(0), address),
    //     watch: true,
    //     on
    // })

    function handleSetSlippage(val: string) {
        console.log("Set Slippage", val)
        setSlippage(val)
    }



    function handleAssetInValueChange(val: string) {
        console.log("Swap", val, assetIn, assetOut)

        let amountIn = ethers.utils.parseUnits(val, assetIn.decimals)

        setAssetInAmount(amountIn)
    }

    function handleSetAssetOutAmount() {

        if (trade) {

                if (!assetInAmount.isZero()) {
                    // @ts-ignore
                    trade.func(signer,assetInAmount,BigNumber.from(0), address,true).then((response: any) => {
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

                        if (staticCallError) {
                            setStaticCallError(false)
                        }
                    }).catch((err: any) => {
                        console.log("Static Call Error", err)
                        if (!assetOutAmount.isZero()) {
                            setAssetOutAmount(BigNumber.from(0))
                        }

                        if (!staticCallError) {
                            setStaticCallError(true)
                        }
                    })
                }

        }


    }

    function handleSwapButtonState(sufficientBalance: boolean, trade: trade|undefined) {
        console.log("handleSwapButtonState", sufficientBalance, staticCallError, approvalNeeded)
        if (!trade) {
            setButtonState({text: 'Trade not possible', disabled: true})
        } else if (!sufficientBalance) {
            if (buttonState.text != 'Insufficient Balance') {
                setButtonState({text: 'Insufficient Balance', disabled: true})
            }
        } else if (staticCallError) {
            if (buttonState.text != 'Error') {
                setButtonState({text: 'Error', disabled: true})
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
       if (trade){
                // @ts-ignore
           await trade.func(signer,assetInAmount, assetOutAmount.mul(BigNumber.from(1000-(parseFloat(slippage)*10))).div(BigNumber.from(1000)), address,false)
        }
    }

    // function getTrade() {
    //     // @ts-ignore
    //     if (trades[assetIn.symbol]) {
    //         // @ts-ignore
    //         if (trades[assetIn.symbol][assetOut.symbol]) {
    //             // @ts-ignore
    //             return trades[assetIn.symbol][assetOut.symbol]
    //         }
    //     }
    //     return {}
    // }


    return (
    <div className={styles.container}>

        <main className={styles.main}>
            <SwapInput label={"Asset In"} values={Object.keys(tokenDictionary).sort()}
                       token={assetIn}
                       onChangeInput={handleAssetInValueChange} onChangeAsset={setAssetIn}
                       onChangeBalance={setAssetInBalance}/>


            <SwapValue label={"Asset Out"} values={Object.keys(tokenDictionary).sort()}
                       onChangeAsset={setAssetOut} value={assetOutAmount} token={assetOut}/>


            <Input label={"Slippage"} value={slippage} onChangeInput={handleSetSlippage} unit={"%"} small={true}></Input>

            <ApprovalButton tokenIn={assetIn} spender={trade}
                            tokenInAmount={assetInAmount} setApprovalNeeded={setApprovalNeeded}></ApprovalButton>
            <LoadingButton text={buttonState.text} action={handleExecute} disabled={buttonState.disabled}
                           width={undefined}/>
        </main>
    </div>
  );
};

export default Zap;
