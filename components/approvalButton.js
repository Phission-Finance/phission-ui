import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './approvalButton.module.css'
import {approve, checkAllowance} from "../helpers/erc20";

function ApprovalButton({show, token, spender, amount}) {

    const [buttonState, setButtonState] = useState({loading: false, text: "Approve"});

    async function handleApprove() {
        setButtonState({loading: true, text: "Approving...", hidden: false})
        await approve(token, spender.contract.address, amount).then(() => {
            setButtonState({loading: false, text: "Approve", hidden: true})
        })
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