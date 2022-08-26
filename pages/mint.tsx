import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import {eth, mint, mintDictionary, tokenDictionary, trades, weth} from "../const/const";
import SwapInput from "../components/swapInput";
import {useEffect, useState} from "react";
import {approve, checkAllowance, roundString, wethMint} from "../helpers/erc20";
import {BigNumber, ethers, utils} from "ethers";
import Balance from "../components/balance";
import LoadingButton from "../components/loadingButton";
import ApprovalButton from "../components/approvalButton";
import {ButtonGroup, ToggleButton} from "react-bootstrap";

type token = {
    symbol: string
    decimals: number,
    address: string,
    abi: string,
    balance: BigNumber
}

const Mint: NextPage = () => {

    const [mintAsset, setMintAsset] = useState( weth)
    const [amountIn, setAmountIn] = useState(BigNumber.from(0))
    // @ts-ignore
    const [mintOptions, setMintOptions] = useState(mint[weth.symbol])
    const [mintButtonState, setMintButtonState] = useState({text: 'Mint', disabled: true})
    const [burnButtonState, setBurnButtonState] = useState({text: 'Burn', disabled: false})

    const [approvalNeeded, setApprovalNeeded] = useState(false)

    const [radioValue, setRadioValue] = useState('Mint');
    const radios = [
        { name: 'Mint', value: 'Mint' },
        { name: 'Burn', value: 'Burn' },
    ];

    useEffect(() => {
        checkApprovalState()
    })

    function handleAssetInChange(token: token) {
        // @ts-ignore
        let ops = mint[token.symbol]

        setMintAsset(token)
        setMintOptions(ops)
    }

    function handleAmountInChange(val: string) {
        console.log("Mint", val, mintAsset.symbol)

        let amtIn = ethers.utils.parseUnits(val, mintAsset.decimals)

        setAmountIn(amtIn)
    }

    function checkApprovalState() {
        // setBurnButtonState({text: 'Burn', disabled: false})

        console.log("checkApprovalState", mintAsset.symbol, amountIn.toString())
        if (amountIn.isZero() || approvalNeeded) {
            if (!mintButtonState.disabled) {
                setMintButtonState({text: 'Mint', disabled: true})
            }
        } else {
            if (mintButtonState.disabled) {
                setMintButtonState({text: 'Mint', disabled: false})
            }
        }
    }

    async function handleMint() {
        return await mintOptions.mintFunc(amountIn)
    }

    async function handleBurn() {
        return await mintOptions.burnFunc(amountIn)
    }

    return (
        <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.buttonGroup}>
                        <ButtonGroup >
                            {radios.map((radio, idx) => (
                                <ToggleButton
                                    key={idx}
                                    id={`radio-${idx}`}
                                    type="radio"
                                    variant={'outline-primary'}
                                    name="radio"
                                    value={radio.value}
                                    checked={radioValue === radio.value}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                    </div>


                    <SwapInput label={"Asset In"} values={Object.keys(mintDictionary).sort()}
                               onChangeInput={handleAmountInChange} token={mintAsset}
                               onChangeAsset={handleAssetInChange} onChangeBalance={undefined}/>

                    <div className={styles.horizontalContainer}>
                        {mintOptions.tokens.map((op:any, index: number) => (
                            <Balance key={op.token.symbol} label={op.token.symbol} token={op.token}
                                     setParentBalance={undefined} />
                        ))}
                    </div>

                    { radioValue === "Mint" ?
                        <ApprovalButton tokenIn={mintAsset} spender={mintOptions}
                                    tokenInAmount={amountIn} setApprovalNeeded={setApprovalNeeded}></ApprovalButton> : ""
                    }

                    <div className={styles.horizontalContainer}>
                        { radioValue === "Mint" ?
                            <LoadingButton text={mintButtonState.text} action={handleMint} disabled={mintButtonState.disabled} width={undefined}/> :
                            <LoadingButton text={burnButtonState.text} action={handleBurn} disabled={burnButtonState.disabled} width={undefined}/>
                        }
                    </div>

                </main>
        </div>
    );
};

export default Mint;
