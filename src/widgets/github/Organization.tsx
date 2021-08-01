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
                    ? <>
                        <img width="100" src={orgDetails.avatar_url}></img>
                        <ul>
                            { orgDetails.description && <li><b>Description : </b> {orgDetails.description}</li>}
                            { orgDetails.public_repos && <li><b>Public repos : </b> {orgDetails.public_repos}</li>}
                            { orgDetails.location && <li><b>Location : </b> {orgDetails.location}</li>}
                            { orgDetails.email && <li><b>E-mail : </b> <a href="mailto:{orgDetails.email}">{orgDetails.email}</a></li>}
                            { orgDetails.blog && <li><b>Blog : </b> <a href="{orgDetails.blog}">{orgDetails.blog}</a></li>}
                        </ul>
                    </>
                    : <p>Loading Github data...</p>
            }
        </div >
    )

}