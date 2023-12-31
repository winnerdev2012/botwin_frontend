import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { refreshToken, useLocalStorage } from '../utils'

const AddProduct = ({ setMsg }) => {
    const [actionName, setActionName] = useState('')
    const [actionUrl, setActionUrl] = useState('')
    const [actionWeight, setActionWeight] = useState(1)
    const [action_type_int, setAction_type_int] = useState(0)
    const [chain_list, setChain_list] = useState([])
    const [currentChain, setCurretChain] = useState(1)
    const [formError, setFormError] = useState('');
    const [token, setToken] = useState('');
    const [name, setName] = useLocalStorage('name', '');
    const [expire, setExpire] = useState('');
    
    useEffect(() => {
        refreshToken(setToken, setName, setExpire, navigate)
        getChainList()
    }, [])
    const navigate = useNavigate()

    useEffect(() => {
        getChainList()
    }, [])

    const getChainList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list')
        setChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }

    const saveProduct = async (e) => {
        e.preventDefault()

        if (!actionName || !actionUrl || !currentChain) {
            alert('Please fill in all fields');
            return;
        }

        const substring = actionName.split("_")[0]
        if (substring === "TRADE") {
            setAction_type_int(1);
        } else if (substring === "LP") {
            setAction_type_int(2);
        } else if (substring === "STAKE") {
            setAction_type_int(3);
        } else if (substring === "LEND") {
            setAction_type_int(4);
        } else {
            setAction_type_int(0);
        }
        const response = await axios.post('https://botwin-admin-backend.onrender.com/add_action_item', {
            action_name: actionName,
            action_type: action_type_int,
            action_url: actionUrl,
            action_weight: actionWeight,
            chain_id: currentChain
        })
        setMsg(response.data.message)
        navigate("/products")
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-5">
                <div className="col-5">
                    <div>
                        <form onSubmit={saveProduct}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Action Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="text"
                                    value={actionName}
                                    onChange={(e) => setActionName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Action Url
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    value={actionUrl}
                                    onChange={(e) => setActionUrl(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleFormControlSelect1" className="form-label">
                                    Select a Chain
                                </label>
                                <select
                                    className="form-select"
                                    id="exampleFormControlSelect1"
                                    value={currentChain}
                                    onChange={(event) => setCurretChain(event.target.value)}
                                >
                                    {chain_list.map((chain, index) => (
                                        <option key={index} value={chain.chain_id} className="btn mb-2 me-2 col-10">
                                            {chain.chain_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Action Weight
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    value={actionWeight}
                                    onChange={(e) => setActionWeight(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct
