import React, { useEffect, useState } from 'react';
import styles from './countdown.module.css'
import Value from "./value";


function Countdown({endDate}) {
    const [init, setInit] = useState(false)
    const [timeToMerge, setTimeToMerge] = useState({days: 0, hours: 0, minutes: 0, seconds:0, secondsRemaining: 0, set: false})

    useEffect(() => {
        const interval = setInterval(function() { makeTimer( endDate) }, 1000)
        return () => clearInterval(interval);
    }, []);

    if (!init) {
        makeTimer( endDate)
        setInit(true)
    }

    function makeTimer(date) {
        let endTime = (Date.parse(date) / 1000);
        let now = Math.floor(Date.now() / 1000)
        let timeLeft = endTime - now;

        let days = Math.floor(timeLeft / 86400);
        let hours = Math.floor((timeLeft - (days * 86400)) / 3600);
        let minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
        let seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        setTimeToMerge({days: days, hours: hours, minutes: minutes, seconds: seconds, secondsRemaining: timeLeft, set: true})
    }

    return (
        <>
            {
                timeToMerge.set ?
                    <div>
                        <h3>Time To Merge</h3>

                        <div className={styles.clock}>
                            <Value label={"Days"} value={timeToMerge.days} token={undefined} updater={undefined}/>
                            <Value label={"Hours"} value={timeToMerge.hours} token={undefined} updater={undefined}/>
                            <Value label={"Min"} value={timeToMerge.minutes} token={undefined} updater={undefined}/>
                            <Value label={"Sec"} value={timeToMerge.seconds} token={undefined} updater={undefined}/>
                        </div>
                    </div> : ""
            }
        </>
    )

}

export default Countdown