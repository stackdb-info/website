import React from "react"
import { Link } from "react-router-dom";

const Field = props => {
    const { fields, name, val } = props
    console.log(fields, name, val)
    let dataType = fields.find(f => f.name == name).type
    if (dataType.kind == 'LIST') return val.map(val => <Link key={val.name} to={`/${val.__typename}/${val.name}`}>{val.name}</Link>)
    if (!dataType.ofType || dataType.ofType.name == 'String') return val
    return JSON.stringify(val)
}

export default Field