import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './swapInput.module.css'
import {useEffect, useState} from "react";
import {BigNumber, ethers} from "ethers";


export default function SwapInput({label, values, onChangeInput,  dropdownValue, onChangeDropdown}) {

        const [query, setQuery] = useState("");
        useEffect(() => {
                if (onChangeInput) {
                        const timeOutId = setTimeout(() => onChangeInput(query ? query : "0"), 500);
                        return () => clearTimeout(timeOutId);
                }
        }, [query]);

        return (
        <div className={styles.container}>
                <label>{label}</label>
                <input type="number" defaultValue={0} onChange={event => setQuery(event.target.value)}/>

                <DropdownButton id="dropdown-basic-button" title={dropdownValue} onSelect={onChangeDropdown}>
                        {values.map((op, index) => (
                            // eslint-disable-next-line react/jsx-key
                            <Dropdown.Item key={op} eventKey={op}>{op}</Dropdown.Item>
                        ))}
                </DropdownButton>
        </div>
    )
}