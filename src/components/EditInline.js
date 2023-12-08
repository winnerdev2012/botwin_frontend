import { useEffect } from 'react'
import axios from 'axios'


const EditInline = ({ i, editProduct, id, actionName, setActionName, actionUrl, setActionUrl, actionWeight, setActionWeight }) => {
    useEffect(() => {
        const getProductById = async () => {
            await axios.get(`https://botwin-admin-backend.onrender.com/get_action_item/${id}`).then((response) => {
                setActionName(response.data[0].action_name)
                setActionUrl(response.data[0].action_url)
                setActionWeight(response.data[0].action_weight)
            })
        }
        getProductById()
    }, [id])
    return (
        <tr key={i}>
            <td>
                <input
                    type="checkbox"
                />
            </td>
            <td>
                <input
                    className="text-center col-10"
                    type="text"
                    required="required"
                    placeholder="action name..."
                    name="actionName"
                    value={actionName}
                    onChange={(e) => setActionName(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="text"
                    placeholder="action url..."
                    name="actionUrl"
                    className="text-center col-10"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                />
            </td>
            <td>
                <input
                    type="text"
                    placeholder="action weight..."
                    name="actionWeight"
                    className="text-center col-10"
                    value={actionWeight}
                    onChange={(e) => setActionWeight(e.target.value)}
                />
            </td>
            <td>
                <button type="submit" className="btn btn-success col-8">YES</button>
                <button onClick={() => editProduct(null)} className="btn btn-danger col-8">NO</button>
            </td>
        </tr>

    )
}

export default EditInline
