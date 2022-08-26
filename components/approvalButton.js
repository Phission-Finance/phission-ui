import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './approvalButton.module.css'
import {approve, checkAllowance} from "../helpers/erc20";
import {trades} from "../const/const";
import {BigNumber} from "ethers";
import {useAccount, useContractRead, useProvider, useSigner} from "wagmi";

function ApprovalButton({tokenIn, tokenInAmount, spender, setApprovalNeeded}) {

    const provider = useProvider()
    const { data: signer } = useSigner()

    const { address, isConnecting, isDisconnected } = useAccount()

    const [show, setShow] = useState(false);
    // const [allowance, setAllowance] = useState(BigNumber.from(0));
    const [buttonState, setButtonState] = useState({loading: false, text: "Approve"});



    const { data: allowance } = useContractRead({
        addressOrName: tokenIn.address,
        contractInterface: tokenIn.abi,
        functionName: 'allowance',
        args: [address, spender?.contract.address],
        watch: true,
        onSuccess(data) {
            console.log('Allowance Success', data)
        },
        onError(error) {
            console.log('Allowance Error', error)
        },
    })



    useEffect(() => {
        if (spender) {
            handleCheckAllowance()
        }
    })

    async function handleApprove() {
        setButtonState({loading: true, text: "Approving..."})
        await approve(provider, signer, tokenIn, spender.contract.address, tokenInAmount).then((approved) => {
            setButtonState({loading: false, text: "Approve"})
            if (approved) {
                setShow(false)
                setApprovalNeeded(false)
            }
        })
    }

    function handleCheckAllowance() {
                if (spender.needsApproval) {
                    console.log("Allowance", tokenIn.symbol, allowance.toString())

                    if (!tokenInAmount.isZero() && tokenInAmount.gt(allowance)) {
                        if (!show) {
                            setShow(true)
                        }
                        setApprovalNeeded(true)
                    } else {
                        // setButtonState({loading: false, text: "Approve", hidden: true})
                        if (show) {
                            setShow(false)
                        }
                    }
                } else {
                    if (show) {
                        setShow(false)
                    }
                }
    }

    return (
        <div>
            <Button
                variant="primary"
                disabled={buttonState.loading}
                hidden={!show}
                onClick={!buttonState.loading ? handleApprove : null}
                className={styles.button}
            >
                {buttonState.text}
            </Button>
        </div>

    );
}

export default ApprovalButton