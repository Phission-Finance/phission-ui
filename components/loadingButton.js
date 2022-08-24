import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from './loadingButton.module.css'


function LoadingButton({text, action, disabled, width}) {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            action().then(() => {
                setLoading(false);
            }).catch((error) => {
                console.error(error);
                setLoading(false)
            });
        }
    }, [isLoading]);

    const handleClick = () => setLoading(true);

    return (
        <Button
            variant="primary"
            disabled={isLoading || disabled}
            onClick={!isLoading ? handleClick : null}
            className={styles.button}
            width={width ? width : "200px"}
        >
            {isLoading ? 'Loading…' : text}
        </Button>
    );
}

export default LoadingButton