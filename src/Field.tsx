import React from "react"
import { Link } from "react-router-dom";

const Field = props => {
    const { fields, name, val } = props
    console.log(fields, name, val)
    let dataType = fields.find(f => f.name == name).type
    if (dataType.kind == 'LIST') {
        let lis = val.map(val => <li><Link key={val.name} to={`/${val.__typename.toLowerCase()}/${val.name}`}>{val.name}</Link></li>)
        return <ul>{lis}</ul>
    }
    if (!dataType.ofType || dataType.ofType.name == 'String') return val
    return JSON.stringify(val)
}

export default Field