import React, { useEffect } from "react";
import { useState } from "react";

export default function Organization(params) {

    const [orgDetails, setOrgDetails] = useState(null)
    const [maxRateExceed, setMaxRateExceed] = useState(false)

    useEffect(() => {
        fetch(`https://api.github.com/orgs/${params.organization}`)
            .then(res => res.json())
            .then(setOrgDetails)
            .catch(() => setMaxRateExceed(true))
    }, [])

    return (
        <div>
            <h2>Github Organization</h2>
            {maxRateExceed
                ? <p>Maximum Github request rate exceeded (60 per minute)</p>
                :
                orgDetails
                    ? <p>{JSON.stringify(orgDetails)}</p>
                    : <p>Loading Github data...</p>
            }
        </div >
    )

}