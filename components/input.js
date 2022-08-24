import styles from './swapInput.module.css'
import {useEffect, useState} from "react";

export default function Input({label, value, onChangeInput}) {

        const [query, setQuery] = useState("");
        useEffect(() => {
                onChangeInput(query ? query : "0")
        }, [query]);

        return (
        <div className={styles.container}>
                <label>{label}</label>
                <input type="number" defaultValue={value} onChange={event => setQuery(event.target.value)} />
        </div>
    )
}