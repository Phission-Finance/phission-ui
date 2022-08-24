import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {roundString} from "../helpers/erc20";
import {utils} from "ethers";


export default function SwapValue({label, value, token, values, dropdownValue, onChangeDropdown}) {
    const [query, setQuery] = useState("");

    return (
        <div className={styles.container}>
            <label>{label}</label>
            <h4>{roundString(utils.formatUnits(value.toString(), token.decimals))}</h4>

            <DropdownButton id="dropdown-basic-button" title={dropdownValue} onSelect={onChangeDropdown}>
                {values.map((op, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Dropdown.Item key={op} eventKey={op}>{op}</Dropdown.Item>
                ))}
            </DropdownButton>
        </div>
    )
}