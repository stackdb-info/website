import React, { useEffect } from "react";
import { useState } from "react";

export default function Repository(params) {

    const [repoDetails, setRepoDetails] = useState(null)
    const [maxRateExceed, setMaxRateExceed] = useState(false)

    useEffect(() => {
        fetch(`https://api.github.com/repos/${params.repository}`)
            .then(res => res.json())
            .then(setRepoDetails)
            .catch(() => setMaxRateExceed(true))
    }, [])

    return (
        <div>
            <h3>Github Repository</h3>
            {maxRateExceed
                ? <p>Maximum Github request rate exceeded (60 per minute)</p>
                :
                repoDetails
                    ? <p>{JSON.stringify(repoDetails)}</p>
                    : <p>Loading Github data...</p>
            }
        </div >
    )

}