import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './approvalButton.module.css'
import {approve, checkAllowance, checkBalance} from "../helpers/erc20";
import {trades} from "../const/const";
import {BigNumber} from "ethers";

function ApprovalButton({tokenIn, tokenInAmount, spender, setApprovalNeeded}) {

    const [show, setShow] = useState(false);
    const [buttonState, setButtonState] = useState({loading: false, text: "Approve"});

    useEffect(() => {
        if (spender) {
            handleCheckAllowance()
        }
    })

    async function handleApprove() {
        setButtonState({loading: true, text: "Approving..."})
        await approve(tokenIn, spender.contract.address, tokenInAmount).then((approved) => {
            setButtonState({loading: false, text: "Approve"})
            if (approved) {
                setShow(false)
                setApprovalNeeded(false)
            }
        })
    }

    function handleCheckAllowance() {
                if (spender.needsApproval) {
                    checkAllowance(tokenIn, spender.contract).then((allowance) => {
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
                    })
                } else {
                    if (show) {
                        setShow(false)
                    }
                }
    }

    return (
        <Button
            variant="primary"
            disabled={buttonState.loading}
            hidden={!show}
            onClick={!buttonState.loading ? handleApprove : null}
            className={styles.button}
        >
            {buttonState.text}
        </Button>
    );
}

export default ApprovalButton