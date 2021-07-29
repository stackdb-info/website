import React, { useEffect } from "react";
import { useState } from "react";
import Organization from "./Organization";
import Repository from "./Repository";

export default function Github(params) {

    if (Object.keys(params.items).includes("github_repository"))
        return <Repository repository={params.items.github_repository} />

    if (Object.keys(params.items).includes("github_organization"))
        return <Organization organization={params.items.github_organization} />

    return null

}