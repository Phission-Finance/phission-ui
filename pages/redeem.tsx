import type { NextPage } from 'next';
import styles from '../styles/redeem.module.css';
import Countdown from "../components/countdown";
import SwapInput from "../components/swapInput";
import {lps, lpw, phi, redeemPoS, treasury, uniswapRouter, weth, weths, wethSplitContract} from "../const/const";
import SwapValue from "../components/swapValue";
import {SetStateAction, useEffect, useState} from "react";
import {useAccount, useBalance, useContractWrite, usePrepareContractWrite} from "wagmi";
import {BigNumber, ethers} from "ethers";
import LoadingButton from "../components/loadingButton";
import Balance from "../components/balance";
import ApprovalButton from "../components/approvalButton";
import {swapExactTokensForTokens} from "../helpers/erc20";

const Redeem: NextPage = () => {
    const expectedRedeemDate = "2022-09-20T00:00:00Z"

    const {address, isConnecting, isDisconnected} = useAccount()

    const [redeemAsset, setRedeemAsset] = useState(weths)
    // @ts-ignore
    const [redeemData, setRedeemData] = useState(redeemPoS[weths.symbol])

    const [redeemAssetBalance, setRedeemAssetBalance] = useState(BigNumber.from(0))
    const [redeemAssetAmount, setRedeemAssetAmount] = useState(BigNumber.from(0))
    const [redeemButtonState, setRedeemButtonState] = useState({text: "Redeem for WETH", disabled: true})

    const [phiBalance, setPhiBalance] = useState(BigNumber.from(0))
    const [treasuryRedeemButtonState, setTreasuryRedeemButtonState] = useState({text: "Redeem", disabled: true})

    const [approvalNeeded, setApprovalNeeded] = useState(false)

    useEffect(() => {
        if (approvalNeeded) {
            if (!treasuryRedeemButtonState.disabled) {
                setTreasuryRedeemButtonState({
                    text: treasuryRedeemButtonState.text,
                    disabled: true
                })
            }
        } else {
            if (treasuryRedeemButtonState.disabled) {
                setTreasuryRedeemButtonState({
                    text: treasuryRedeemButtonState.text,
                    disabled: false
                })
            }
        }
    }, [approvalNeeded])

    useEffect(() => {
        if (phiBalance.gt(0)) {
            if (!approvalNeeded) {
                setTreasuryRedeemButtonState({
                    text: treasuryRedeemButtonState.text,
                    disabled: false
                })
            }
        }
    }, [phiBalance])


    useEffect(() => {
        setRedeemButtonState({// @ts-ignore
            text: `Redeem for ${redeemPoS[redeemAsset.symbol].redeemToken.symbol}`,
            disabled: redeemButtonState.disabled
        })
    }, [redeemAsset])


    useEffect(() => {
        // @ts-ignore
        setRedeemData(redeemPoS[redeemAsset.symbol])
    }, [redeemAsset])

    useEffect(() => {
        if (redeemAssetAmount.gt(0) && redeemAssetAmount.lte(redeemAssetBalance)) {
            if (redeemButtonState.disabled) {
                setRedeemButtonState({
                    text: redeemButtonState.text,
                    disabled: false
                })
            }
        } else {
            if (!redeemButtonState.disabled) {
                setRedeemButtonState({
                    text: redeemButtonState.text,
                    disabled: true
                })
            }
        }
    }, [redeemAssetAmount])


    const { config: redeemTokenConfig } = usePrepareContractWrite({
        addressOrName: redeemData.redeemContract.address,
        contractInterface: redeemData.redeemContract.abi,
        functionName: 'redeem',
        args: redeemAssetAmount
    })
    const { data: dataRedeemToken, isLoading: isLoadingRedeemToken, isSuccess: isSuccessRedeemToken, write: writeRedeemToken } = useContractWrite(redeemTokenConfig)



    const { config: redeemTreasuryConfig } = usePrepareContractWrite({
        addressOrName: treasury.address,
        contractInterface: treasury.abi,
        functionName: 'redeem',
        args: phiBalance
    })
    const { data: dataRedeemTreasury, isLoading: isLoadingRedeemTreasury, isSuccess: isSuccessRedeemTreasury, write: writeRedeemTreasury } = useContractWrite(redeemTreasuryConfig)


    function handlerOnChangeInput(val: string) {
        setRedeemAssetAmount(ethers.utils.parseUnits(val, redeemAsset.decimals))
    }


    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <Countdown text={"Time To Redeem"} endDate={expectedRedeemDate}/>
            </div>
            <div className={styles.main}>
                <h4>Redeem Tokens</h4>

                <SwapInput label={"Redeem Asset"}
                           values={Object.keys(redeemPoS)}
                           token={redeemAsset}
                           onChangeAsset={setRedeemAsset} onChangeInput={handlerOnChangeInput}
                           onChangeBalance={setRedeemAssetBalance}/>

                <LoadingButton text={redeemButtonState.text} action={async () => await writeRedeemToken?.()}
                               disabled={redeemButtonState.disabled || !writeRedeemToken} width={undefined}/>
            </div>
            <div className={styles.main}>
                <h4>Redeem from Treasury</h4>
                <Balance label={phi.symbol} token={phi} setParentBalance={(val: { value: SetStateAction<BigNumber>; }) => {
                        setPhiBalance(val.value)
                    }}/>
                    <ApprovalButton tokenIn={phi} tokenInAmount={phiBalance} spender={{
                        contract: treasury,
                        needsApproval: true
                    }} setApprovalNeeded={setApprovalNeeded} />
                    <LoadingButton text={treasuryRedeemButtonState.text} action={async () => await writeRedeemTreasury?.()} disabled={treasuryRedeemButtonState.disabled || !writeRedeemTreasury} width={undefined} />
                </div>
        </div>
    );
};

export default Redeem;
