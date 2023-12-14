import React from 'react'
// import { Link } from 'react-router-dom'

const ReadOnlyRows = (props) => {
    const product = props.data
    return (
        <tr key={product.action_id}>
            <td>
                <input type="checkbox"
                    checked={product.select}
                    onChange={e => {
                        let value = e.target.checked;
                        props.setProducts(
                            props.products.map((sd) => {
                                if (sd.action_id === product.action_id) {
                                    sd.select = value;
                                }
                                return sd;
                            })
                        );
                    }}
                />
            </td>
            <td className="text-truncate" style={{ maxWidth: '100px' }}>
                {product.action_name}
            </td>
            <td className="text-truncate" style={{ maxWidth: '100px' }}>
                {product.action_url}
            </td>
            <td className="text-truncate" style={{ maxWidth: '100px' }}>
                {product.action_weight}
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={parseInt(product.active?.split(' ')[props.currentScript - 1]) == 1}
                    onChange={e => {
                        const value = e.target.checked ? 1 : 0;
                        props.setActive(product.action_id, value, props.i);
                    }}
                />
            </td>
            <td>
                <button className="btn btn-primary mb-2 me-2 col-7" onClick={(e) => props.edit(e, product)}>Edit</button>
            </td>
        </tr>
    )
}

export default ReadOnlyRows
