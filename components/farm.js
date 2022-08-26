import styles from './farm.module.css'
import LoadingButton from "./loadingButton";
import Input from "./input";
import {useState} from "react";
import {BigNumber, ethers, utils} from "ethers";
import ApprovalButton from "./approvalButton";
import {useEffect} from "react";
import Value from "./value";
import Balance from "./balance";
import aprCalc from "../helpers/apr";
import {useAccount, useContractRead} from "wagmi";


function Farm({tab, farm}) {

    const [amountIn, setAmountIn] = useState(BigNumber.from(0))
    const [inputValue, setInputValue] = useState("0")
    const [rewardsEarned, setRewardsEarned] = useState(BigNumber.from(0))
    const [apr, setApr] = useState(0)
    const [balance, setBalance] = useState(BigNumber.from(0));

    const [stakeButtonState, setStakeButtonState] = useState({text: 'Stake', disabled: false, action: stake})
    const [unstakeButtonState, setUnstakeButtonState] = useState({text: 'Unstake', disabled: false, action: unstake})
    const [claimButtonState, setClaimButtonState] = useState({text: 'Claim', disabled: false, action: claim})
    const [approvalNeeded, setApprovalNeeded] = useState(false)

    const { address, isConnecting, isDisconnected } = useAccount()
    const { data, isError, isLoading } = useContractRead({
        addressOrName: farm.contract.address,
        contractInterface: JSON.parse(farm.contract.abi),
        functionName: 'balanceOf',
        args: address,
        watch: true,
    })

    useContractRead({
        addressOrName: farm.contract.address,
        contractInterface: JSON.parse(farm.contract.abi),
        functionName: 'earned',
        args: address,
        watch: true,
        onSuccess(data) {
            console.log('Earned Success', data)
            setRewardsEarned(data)
        },
        onError(error) {
            console.log('Earned Error', error)
        },
    })



    useEffect(() => {
        if (farm.contract) {
            handleCheckAPR()
        }
    }, [amountIn, farm])

    async function stake() {
        console.log("stake", amountIn)
        await farm.stakeFunc(amountIn)
    }

    async function unstake() {
        await farm.unStakeFunc(amountIn)
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


    if (!aprCalc.init) {
        aprCalc.initialize().then(() => {
            handleCheckAPR()
        })
    }

    function handleChangeInput(val) {

        console.log("handleChangeInput", val, farm.token.symbol)

        let amtIn = ethers.utils.parseUnits(val, farm.token.decimals)
        setInputValue(val)
        setAmountIn(amtIn)
    }

    function handleSetMax() {
        handleChangeInput(utils.formatUnits(balance.toString(), farm.token.decimals))
    }

    function handleSetMaxStaked() {
        handleChangeInput(utils.formatUnits(data.toString(), farm.token.decimals))
    }

    async function openInNewTab(url) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className={styles.farm}>

            <div className={styles.inputContainer}>
                <label  className={styles.farmName}>{farm.token.symbol}</label>
                <div className={styles.input}>
                    <Input onChangeInput={handleChangeInput} value={inputValue} />
                    {
                        tab === "Stake" ? <button onClick={handleSetMax}>Set Max</button> : <button onClick={handleSetMaxStaked}>Set Max</button>
                    }
                </div>

            </div>

            <div className={styles.stats}>
                <Value label={"Staked"} value={data ? data : BigNumber.from(0)} token={farm.token}/>
                <Value label={"Rewards"} value={rewardsEarned} token={farm.token} updater={undefined}/>
                <Balance label={farm.token.symbol} token={farm.token} setParentBalance={setBalance}/>
                <Value label={"APR"} value={apr.toFixed(1).toString() + "%"} updater={undefined}/>
            </div>

            <div className={styles.buttonContainer}>
                <LoadingButton text={"Deposit To Uniswap"} action={ async () => await openInNewTab(`https://app.uniswap.org/#/add/v2/${farm.poolTokenA.address}/${farm.poolTokenB.address}`)} disabled={false}/>

                {
                    tab === "Stake" ? <div>
                        <ApprovalButton tokenIn={farm.token} spender={farm} tokenInAmount={amountIn} setApprovalNeeded={setApprovalNeeded}></ApprovalButton>
                        <LoadingButton text={stakeButtonState.text} action={stake} disabled={stakeButtonState.disabled}/>
                    </div> : <div>
                        <LoadingButton text={unstakeButtonState.text} action={unstake} disabled={unstakeButtonState.disabled}/>
                    </div>
                }

                <LoadingButton text={claimButtonState.text} action={claim} disabled={claimButtonState.disabled}/>
            </div>


        </div>
    )
}

export default Farm