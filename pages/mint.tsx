import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import {eth, mint, mintDictionary, tokenDictionary, trades, weth} from "../const/const";
import SwapInput from "../components/swapInput";
import BurnInput from "../components/burnInput";
import {useEffect, useState} from "react";
import {approve, checkAllowance, roundString, wethMint} from "../helpers/erc20";
import {BigNumber, ethers, utils} from "ethers";
import Balance from "../components/balance";
import LoadingButton from "../components/loadingButton";
import ApprovalButton from "../components/approvalButton";
import {ButtonGroup, ToggleButton} from "react-bootstrap";
import {useProvider, useSigner} from "wagmi";

type token = {
    symbol: string
    decimals: number,
    address: string,
    abi: string,
    balance: BigNumber
}

const Mint: NextPage = () => {

    const { data: signer } = useSigner()

    const [mintAsset, setMintAsset] = useState( weth)
    const [amountIn, setAmountIn] = useState(BigNumber.from(0))
    // @ts-ignore
    const [mintOptions, setMintOptions] = useState(mint[weth.symbol])
    const [buttonState, setButtonState] = useState({disabled: true})

    const [approvalNeeded, setApprovalNeeded] = useState(false)

    const [radioValue, setRadioValue] = useState('Mint');
    const radios = [
        { name: 'Mint', value: 'Mint' },
        { name: 'Burn', value: 'Burn' },
    ];

    useEffect(() => {
        checkApprovalState()
    }, [approvalNeeded, amountIn])

    useEffect(() => {

    }, [radioValue])

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
            if (!buttonState.disabled) {
                setButtonState({disabled: true})
            }
        } else {
            if (buttonState.disabled) {
                setButtonState({disabled: false})
            }
        }
    }

    async function handleMint() {
        return await mintOptions.mintFunc(signer,amountIn)
    }

    async function handleBurn() {
        return await mintOptions.burnFunc(signer,amountIn)
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

                    {radioValue === "Mint" ?
                        <SwapInput label={"Asset In"}
                                   values={Object.keys(mintDictionary).sort()}
                                   onChangeInput={handleAmountInChange} token={mintAsset}
                                   onChangeAsset={handleAssetInChange} onChangeBalance={undefined}/> :
                        <BurnInput label={"Asset In"}
                                   values={Object.keys(mintDictionary).filter((item => !(item === "ETH" && radioValue === "Burn"))).sort()}
                                   onChangeInput={handleAmountInChange} token={mintAsset}
                                   onChangeAsset={handleAssetInChange}/>

                    }

                    {radioValue === "Mint" ?
                        <div className={styles.horizontalContainer}>
                            {mintOptions.tokens.map((op: any, index: number) => (
                                <Balance key={op.token.symbol} label={op.token.symbol} token={op.token}
                                         setParentBalance={undefined}/>
                            ))}
                        </div> :
                        <div className={styles.horizontalContainer}>
                                <Balance key={mintAsset.symbol} label={mintAsset.symbol} token={mintAsset}
                                         setParentBalance={undefined}/>
                        </div>
                    }

                    { radioValue === "Mint" ?
                        <ApprovalButton tokenIn={mintAsset} spender={mintOptions}
                                    tokenInAmount={amountIn} setApprovalNeeded={setApprovalNeeded}></ApprovalButton> : ""
                    }

                    <div className={styles.horizontalContainer}>
                        { radioValue === "Mint" ?
                            <LoadingButton text={"Mint"} action={handleMint} disabled={buttonState.disabled} width={undefined}/> :
                            <LoadingButton text={"Burn"} action={handleBurn} disabled={buttonState.disabled} width={undefined}/>
                        }
                    </div>

                </main>
        </div>
    );
};

export default Mint;
