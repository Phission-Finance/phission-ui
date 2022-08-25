import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './approvalButton.module.css'
import {approve, checkAllowance, checkBalance} from "../helpers/erc20";
import {trades} from "../const/const";
import {BigNumber} from "ethers";

function ApprovalButton({tokenIn, tokenInAmount, spender, setApprovalNeeded}) {

    const [show, setShow] = useState(false);
    const [allowance, setAllowance] = useState(BigNumber.from(0));
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
                    checkAllowance(tokenIn, spender.contract).then((val) => {

                        if (!val.eq(allowance)) {
                            setAllowance(val)
                        }

                        console.log("Allowance", tokenIn.symbol, val.toString())

                        if (!tokenInAmount.isZero() && tokenInAmount.gt(val)) {
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