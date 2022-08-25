import styles from './farm.module.css'
import {mint, trades} from "../const/const";

import LoadingButton from "./loadingButton";
import Input from "./input";
import {useState} from "react";
import {BigNumber, ethers} from "ethers";
import {approve, balanceOf, checkAllowance, checkBalance, earned} from "../helpers/erc20";
import ApprovalButton from "./approvalButton";
import {useEffect} from "react";
import Value from "./value";
import Balance from "./balance";


function Farm({farm}) {

    const [amountIn, setAmountIn] = useState(BigNumber.from(0))
    const [amountStaked, setAmountStaked] = useState(BigNumber.from(0))
    const [rewardsEarned, setRewardsEarned] = useState(BigNumber.from(0))
    const [apr, setApr] = useState(0)

    const [stakeButtonState, setStakeButtonState] = useState({text: 'Stake', disabled: false, action: stake})
    const [unstakeButtonState, setUnstakeButtonState] = useState({text: 'Unstake', disabled: false, action: unstake})
    const [claimButtonState, setClaimButtonState] = useState({text: 'Claim', disabled: false, action: claim})
    const [showApprovalButton, setShowApprovalButton] = useState(false)



    useEffect(() => {
        if (farm.contract) {
            handleCheckAllowance(amountIn, farm)
            handleCheckStakedBal()
            handleCheckRewardsBal()
            handleCheckAPR()
        }
    }, [amountIn, farm, handleCheckAllowance, showApprovalButton])

    async function stake() {
        console.log("stake", amountIn)
        await farm.stakeFunc(BigNumber.from(amountIn))
    }

    async function unstake() {
        await farm.unStakeFunc(BigNumber.from(amountIn))
    }

    async function claim() {
        await farm.claimFunc()
    }

    function handleCheckAPR() {
        farm.aprFunc().then((val) => {
            if (apr !== val) {
                setApr(val)
            }
        })
    }

    function handleCheckStakedBal() {
        checkBalance(farm.contract).then((bal) => {
            if (!amountStaked.eq(bal)) {
                setAmountStaked(bal)
            }
        }).catch((err) => console.log("handleCheckStakedBal Error", err))
    }

    function handleCheckRewardsBal() {
        earned(farm.contract).then((bal) => {
            if (!rewardsEarned.eq(bal)) {
                setRewardsEarned(bal)
            }
        }).catch((err) => console.log("handleCheckRewardsBal Error", err))
    }

    function handleCheckAllowance(amount, farm) {
        checkAllowance(farm.token, farm.contract).then((allowance) => {
            console.log("Allowance", farm.token.symbol, allowance.toString())

            if (!amount.isZero() && amount.gt(allowance)) {
                setShowApprovalButton(true)
            } else {
                setShowApprovalButton(false)
            }
        })
    }

    function handleChangeInput(val) {

        console.log("handleChangeInput", val, farm.token.symbol)

        let amtIn = ethers.utils.parseUnits(val, farm.token.decimals)

        setAmountIn(amtIn)
    }

    async function openInNewTab(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={styles.farm}>

            <div className={styles.inputContainer}>
                <Input  onChangeInput={handleChangeInput} value={amountIn} />
                <label >{farm.token.symbol}</label>
            </div>

            <div className={styles.stats}>
                <Value label={"Staked"} value={amountStaked} token={farm.token}/>
                <Value label={"Rewards"} value={rewardsEarned} token={farm.token}/>
                <Balance label={"LP"} token={farm.token}/>
                <Value label={"APR"} value={apr.toFixed(1).toString() + "%"}/>
            </div>

            <div>
                <LoadingButton text={"Deposit To Uniswap"} action={ async () => await openInNewTab(`https://app.uniswap.org/#/add/v2/${farm.poolTokenA.address}/${farm.poolTokenB.address}`)} disabled={false}/>

                <ApprovalButton show={showApprovalButton} token={farm.token} spender={farm.contract.address} amount={amountIn}></ApprovalButton>
                <LoadingButton text={stakeButtonState.text} action={stake} disabled={stakeButtonState.disabled}/>
                <LoadingButton text={unstakeButtonState.text} action={unstake} disabled={unstakeButtonState.disabled}/>
                <LoadingButton text={claimButtonState.text} action={claim} disabled={claimButtonState.disabled}/>
            </div>


        </div>
    )
}

export default Farm