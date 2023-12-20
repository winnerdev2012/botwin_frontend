import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { refreshToken, useLocalStorage } from '../utils'

const BridgeManagement = ({ setMsg }) => {
    const [bridgeName, setBridgeName] = useState('')
    const [bridgeUrl, setBridgeUrl] = useState('')
    const [bridgeWeight, setBridgeWeight] = useState(1)
    const [bridge_type_int, setBridge_type_int] = useState(0)
    const [chain_list, setChain_list] = useState([])
    const [allchain_list, setAllChain_list] = useState([])
    const [bridgelist, setBridgelist] = useState([])
    const [currentChain, setCurretChain] = useState(1)
    const [currentBridge, setCurretBridge] = useState(0)
    const [formError, setFormError] = useState('');
    const [token, setToken] = useState('');
    const [name, setName] = useLocalStorage('name', '');
    const [expire, setExpire] = useState('');

    useEffect(() => {
        refreshToken(setToken, setName, setExpire, navigate)
    }, [])

    const navigate = useNavigate()

    useEffect(() => {
        getBridgeList()
        getChainList()
    }, [])

    useEffect(() => {
        getChainListByBridge(currentBridge)
    }, [currentBridge])

    const getBridgeList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_bridge_list')
        setBridgelist(response.data)
        setTimeout(() => setMsg(''), 7500)
    }

    const edit_bridge = (id, name, url, weight) => {
        console.log(weight);
        setBridgeName(name)
        setBridgeUrl(url)
        setBridgeWeight(weight)
        setCurretBridge(id)
    }

    const getChainList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list')
        setAllChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }

    const getChainListByBridge = async (currentBridge) => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list_by_bridge/' + currentBridge)
        setChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }

    const addBridge = async (e) => {
        e.preventDefault()

        if (bridgeName == "" || bridgeUrl == "" || bridgeWeight == "") {
            alert('Please fill in all fields');
            return;
        }
        const response = await axios.post('https://botwin-admin-backend.onrender.com/add_bridge_item', {
            bridge_name: bridgeName,
            bridge_url: bridgeUrl,
            bridge_weight: bridgeWeight,
        })
        Swal.fire(
            'Updated!',
            response.data.message,
            'success'
        )
        setBridgeName("")
        setBridgeUrl("")
        setBridgeWeight(1)
        setCurretBridge("")
        getBridgeList();
    }

    const updateBridge = async () => {
        await axios.patch('https://botwin-admin-backend.onrender.com/update_Bridge', {
            bridge_id: currentBridge,
            bridge_name: bridgeName,
            bridge_url: bridgeUrl,
            bridge_weight: bridgeWeight,
        }).then((response) => Swal.fire(
            'Updated!',
            response,
            'success'
        ))
        setBridgeName("")
        setBridgeUrl("")
        setBridgeWeight(1)
        setCurretBridge("")
        getBridgeList()
    }

    const deleteBridge = (bridge_id) => {
        Swal.fire({
            title: 'Are you relly going to remove this bridge?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('https://botwin-admin-backend.onrender.com/delete_bridge/' + bridge_id).then((response) => {
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    )
                })
                getBridgeList()
            }
        })
    }

    const deleteChain = async (chain_id) => {
        await axios.delete('https://botwin-admin-backend.onrender.com/delete_chain_from_bridge', {
            data: {
                chain_id: chain_id,
                bridge_id: currentBridge,
            }
        }).then((response) => {
        })
        getChainListByBridge(currentBridge)
    }

    const addChain = async (chain_id) => {
        await axios.post(`https://botwin-admin-backend.onrender.com/add_bridge_join`, {
            chain_id: parseInt(chain_id),
            bridge_id: currentBridge,
        }).then((response) => getChainListByBridge(currentBridge))
    }


    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-5">
                <div className="col-6">
                    <div className='mb-5'>
                        <form onSubmit={addBridge}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Bridge Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputEmail1"
                                    aria-describedby="text"
                                    value={bridgeName}
                                    onChange={(e) => setBridgeName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Bridge Url
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    value={bridgeUrl}
                                    onChange={(e) => setBridgeUrl(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">
                                    Bridge Weight
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputPassword1"
                                    value={bridgeWeight}
                                    onChange={(e) => setBridgeWeight(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary me-2 col-3">Create</button>
                        </form>
                        <button onClick={() => updateBridge()} className="btn btn-success col-3 mt-2">Update</button>
                    </div>
                    <div className='row'>
                        <div className='mb-5 mt-2 col-5' />
                        <div className="mb-5 mt-4 col-5">
                            <select
                                className="form-select"
                                id="exampleFormControlSelect1"
                                value={currentChain}
                                onChange={(event) => setCurretChain(event.target.value)}
                            >
                                {allchain_list.map((chain, index) => (
                                    <option key={index} value={chain.chain_id} className="btn mb-2 me-2 col-10">
                                        {chain.chain_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-5 mt-2 col-2'>
                            <button
                                onClick={() => addChain(currentChain)}
                                className={`btn btn-secondary mb-2 me-2 col-12 mt-3`} >
                                add
                            </button>
                        </div>
                    </div>

                    <div className='row mb-5'>
                        <div className='col-6'>
                            {bridgelist.map((bridge, index) => (
                                <div key={index}>
                                    <button
                                        onClick={() => { setCurretBridge(bridge.bridge_id); edit_bridge(bridge.bridge_id, bridge.bridge_name, bridge.bridge_url, bridge.bridge_weight); }}
                                        className={`btn btn-primary mb-2 me-2 col-7 mt-3`} >
                                        {bridge.bridge_name}
                                    </button>
                                    <button
                                        onClick={() => deleteBridge(bridge.bridge_id)}
                                        className={`btn btn-danger mb-2 me-2 col-4 mt-3`} >
                                        remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className='col-1' />
                        <div className='col-5'>
                            {chain_list.map((chain, index) => (
                                <div key={index}>
                                    <button className={`btn btn-secondary mb-2 me-2 col-7 mt-3`} >
                                        {chain.chain_name}
                                    </button>
                                    <button
                                        onClick={() => deleteChain(chain.chain_id)}
                                        className={`btn btn-danger mb-2 me-2 col-4 mt-3`} >
                                        remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BridgeManagement
