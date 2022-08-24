import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import SwapInput from '../components/swapInput'
import Input from '../components/input'
import SwapValue from '../components/swapValue'
import LoadingButton from '../components/loadingButton'
import ApprovalButton from '../components/approvalButton'
import {useEffect, useState} from "react";
import {tokenDictionary, trades, uniswapRouter, weth} from "../const/const";
import {checkAllowance, checkBalance, approve, roundString} from '../helpers/erc20'
import {BigNumber, ethers, utils} from 'ethers'
import {spans} from "next/dist/build/webpack/plugins/profiling-plugin";

type token = {
    symbol: string
    decimals: number,
    address: string,
    abi: string,
    balance: BigNumber,
    initialCheck: boolean
}

type trade = {
    contract: token,
    func: (x: BigNumber, minAmountOut: BigNumber, callStatic: boolean) => Promise<any>,
    needsApproval:boolean
}


const Zap: NextPage = () => {


    const [assetIn, setAssetIn] = useState(tokenDictionary["ETH"])
    const [assetOut, setAssetOut] = useState(tokenDictionary["WETH"])
    const [assetInAmount, setAssetInAmount] = useState(BigNumber.from(0))
    const [assetOutAmount, setAssetOutAmount] = useState(BigNumber.from(0))
    const [minAmountOut, setMinAmountOut] = useState(BigNumber.from(0))
    const [slippage, setSlippage] = useState(BigNumber.from(5))
    const [selectedTrade, setSelectedTrade] = useState(trades["ETH"]["WETH"])
    const [buttonState, setButtonState] = useState({text: 'Swap', disabled: true, action: {}})
    const [dropDownAssets, setDropDownAssets] = useState(Array<trade>)
    const [showApprovalButton, setShowApprovalButton] = useState(false)
    const [sufficientLiquidity, setSufficientLiquidity] = useState(true)


    useEffect(() => {
        if (!assetIn.initialCheck) {
            handleAssetInChange("ETH")
        }
        if (!assetOut.initialCheck) {
            handleAssetOutChange("WETH", "ETH")
        }

        // @ts-ignore
        let trade = trades[assetIn.symbol][assetOut.symbol]

        if (trade) {
            console.log("setSelectedTrade",trade)
            setSelectedTrade(trade)

            handleCheckBalance(assetInAmount).then((ok) => {

                if (ok) {
                    handleCheckAllowance(assetInAmount, assetIn, trade)

                    handleSetAssetOutAmount(assetInAmount, slippage, trade)

                    //Set min Amount out
                    let minOut = assetOutAmount.mul(BigNumber.from(100).sub(slippage)).div(BigNumber.from(100))
                    if (!minOut.eq(minAmountOut)) {
                        setMinAmountOut(minOut)
                        console.log("minAmountOut", minOut.toString())
                    }
                }

                handleSwapButtonState(assetInAmount, minAmountOut, trade, showApprovalButton, ok)
            })

        }


    }, [assetIn, assetInAmount, assetOut, handleAssetInChange, handleCheckAllowance, showApprovalButton])

    function handleSetSlippage(val: number) {
        let slip = BigNumber.from(val)
        console.log("Set Slippage", slip.toString())
        setSlippage(slip)
    }

    async function handleCheckBalance(amountIn: BigNumber): Promise<boolean> {
        if (amountIn.gt(assetIn.balance)) {
            return false
        }else {
            return true
        }
    }

    function handleAssetInChange(symbol: string) {
        // @ts-ignore
        let token = tokenDictionary[symbol]
        // setTokenIn(token)

        setAssetIn(token)

        // @ts-ignore
        setDropDownAssets(trades[symbol])

        // @ts-ignore
        handleAssetOutChange(Object.keys(trades[symbol]).sort()[0], symbol)

        checkBalance(token).then((bal: BigNumber) => {
            console.log("Balance", symbol, bal.toString())

            // @ts-ignore
            tokenDictionary[symbol].balance = bal
            // @ts-ignore
            tokenDictionary[symbol].initialCheck = true

            // @ts-ignore
            setAssetIn(tokenDictionary[symbol])
        })
    }

    function handleAssetOutChange(outSymbol: string, inSymbol: string) {
        // @ts-ignore
        let token = tokenDictionary[outSymbol]

        console.log("handleAssetOutChange", inSymbol, outSymbol)

        setAssetOut(token)


        checkBalance(token).then((bal: BigNumber) => {
            console.log("Balance", outSymbol, bal.toString())

            // @ts-ignore
            tokenDictionary[outSymbol].balance = bal
            // @ts-ignore
            tokenDictionary[outSymbol].initialCheck = true

            // @ts-ignore
            setAssetOut(tokenDictionary[outSymbol])
        })
    }

    function handleAssetInValueChange(val: string) {
        console.log("Swap", val, assetIn, assetOut)

        // @ts-ignore
        let token = tokenDictionary[assetIn.symbol]

        let amountIn = ethers.utils.parseUnits(val, token.decimals)

        setAssetInAmount(amountIn)
    }

    function handleSetAssetOutAmount(amount: BigNumber, slippage: BigNumber, trade: trade) {
        if (!amount.isZero()) {
            trade.func(amount,BigNumber.from(0), true).then((response: any) => {
                console.log("Static Call", response)
                let amountOut: BigNumber
                if (trade.contract == uniswapRouter) {
                    amountOut = response[1]
                } else if (trade.contract == weth) {
                    amountOut = amount
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

    function handleSwapButtonState(amount: BigNumber, minAmountOut: BigNumber, trade: trade, approvalButton: boolean, sufficientBalance: boolean) {
        // @ts-ignore
        let executeFunction = async () => {
            console.log("Execute", amount, minAmountOut,false)
            return await trade.func(amount, minAmountOut,false)
        }

        if (!sufficientBalance) {
            if (buttonState.text != 'Insufficient Balance') {
                setButtonState({text: 'Insufficient Balance', disabled: true, action: executeFunction})
            }
        } else if (!sufficientLiquidity) {
            if (buttonState.text != 'Insufficient Liquidity') {
                setButtonState({text: 'Insufficient Liquidity', disabled: true, action: executeFunction})
            }
        } else if (amount.isZero() || approvalButton) {
            if (!buttonState.disabled || buttonState.text != 'Swap')  {
                setButtonState({text: 'Swap', disabled: true, action: executeFunction})
            }
        } else  {
            if (buttonState.disabled || buttonState.text != 'Swap') {
                setButtonState({text: 'Swap', disabled: false, action: executeFunction})
            }
        }
    }

    function handleCheckAllowance(amount: BigNumber, token: { symbol: any; }, spender: { needsApproval: any; contract: any; }) {
        if (spender.needsApproval) {
            checkAllowance(token, spender.contract).then((allowance) => {
                console.log("Allowance", token.symbol, allowance.toString())

                if (!amount.isZero() && amount.gt(allowance)) {
                    setShowApprovalButton(true)
                } else {
                    setShowApprovalButton(false)
                }
            })
        } else {
            setShowApprovalButton(false)
        }
    }


    return (
    <div className={styles.container}>
        <main className={styles.main}>

            <SwapInput label={"Asset In"} values={Object.keys(trades).sort()} onChangeInput={handleAssetInValueChange} dropdownValue={assetIn.symbol} onChangeDropdown={handleAssetInChange}/>
            <h4>In Balance {
                roundString(utils.formatUnits(assetIn.balance.toString(), assetIn.decimals))
            }</h4>


            <SwapValue label={"Asset Out"} token={assetOut} value={assetOutAmount} values={Object.keys(dropDownAssets).sort()} dropdownValue={assetOut.symbol} onChangeDropdown={(out: string) => handleAssetOutChange(out, assetIn.symbol)}/>
            <h4>Out Balance {
                roundString(utils.formatUnits(assetOut.balance.toString(), assetOut.decimals))
            }</h4>

            <Input label={"Slippage"} value={slippage} onChangeInput={handleSetSlippage}></Input>

            <ApprovalButton show={showApprovalButton} token={assetIn} spender={selectedTrade.contract}
                            amount={assetInAmount}></ApprovalButton>
            <LoadingButton text={buttonState.text} action={buttonState.action} disabled={buttonState.disabled}
                           width={undefined}/>
        </main>
    </div>
  );
};

export default Zap;
