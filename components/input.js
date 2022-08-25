import styles from './input.module.css'
import {useEffect, useState} from "react";

export default function Input({label, value, onChangeInput, unit, small}) {

        const [query, setQuery] = useState("");
        useEffect(() => {
                if (query) {
                        onChangeInput(query)
                }
        }, [query]);

        return (
        <div className={styles.container}>
                { label ? <label>{label}</label> : <></>}

                <input className={small ? styles.smallInput:styles.normalInput }  type="number" value={value} onChange={event => setQuery(event.target.value)} />
                {unit? <span className={styles.unit}>{unit}</span>:""}
        </div>
    )
}