import { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import ReadOnlyRows from './ReadOnlyRows'
import EditInline from './EditInline'
import BridgeList from './BridgeList'
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode'
import { refreshToken, useLocalStorage } from '../utils'
const ProductList = ({ msg, setMsg }) => {
    const [script_list, setScript_list] = useState([]);
    const [chain_list, setChain_list] = useState([]);
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [token, setToken] = useState('');
    const [name, setName] = useLocalStorage('name', '');
    const [expire, setExpire] = useState('');
    const [actionName, setActionName] = useState('');
    const [actionUrl, setActionUrl] = useState('');
    const [actionWeight, setActionWeight] = useState(0);
    const [currentChain, setCurretChain] = useState(1);
    const [currentChainIndex, setCurrentChainIndex] = useState(1);
    const [currentScript, setCurretcript] = useState(1);

    const [activechain, setActiveChain] = useState(1);
    const [oldActivechain, setOldActiveChain] = useState(1);

    const [maxCount, setMaxCount] = useState('');
    const [maxCount2, setMaxCount2] = useState('');
    const [oldMaxCount, setOldMaxCount] = useState(1);
    const [oldMaxCount2, setOldMaxCount2] = useState(1);

    const navigate = useNavigate()

    useEffect(() => {
        refreshToken(setToken, setName, setExpire, navigate)
    }, [])

    useEffect(() => {
        getChainList()
        getScriptList()
        getActionListByChainId(currentChain)
    }, [currentChain])

    useEffect(() => {
        getChainList()
        getActionListByChainId(currentChain)
    }, [currentScript])

    const handleClick = () => {
        setActiveChain(activechain === 1 ? 0 : 1);
        updateActiveChain(currentChain, activechain)
    };

    const handlePress = (e) => {
        if (e.key == "Enter") {
            updateMaxActionCount(currentChain, maxCount)
        }
    };

    const handlePress2 = (e) => {
        if (e.key == "Enter") {
            updateMaxChainCount(currentChain, maxCount2)
        }
    };

    const updateActiveChain = async (chain_id, isActive) => {
        const newIsActive = isActive == 0 ? 1 : 0;

        const values = oldActivechain.split(' ');
        values[currentScript - 1] = newIsActive.toString();

        await axios.patch(`https://botwin-admin-backend.onrender.com/update_active_chain`, {
            chain_id: chain_id,
            new_values: values.join(' '),
        }).then((response) => console.log(response.statusText))
        getChainList()
    }

    const updateMaxActionCount = async (chain_id, maxCount) => {

        const values = oldMaxCount.split(' ');
        values[currentScript - 1] = maxCount.toString();

        await axios.patch(`https://botwin-admin-backend.onrender.com/update_max_action_count`, {
            chain_id: chain_id,
            max_action_count: values.join(' '),
        }).then((response) => console.log(response.statusText))
        getChainList()
    }

    const updateMaxChainCount = async (chain_id, maxCount2) => {

        const values = oldMaxCount2.split(' ');
        values[currentScript - 1] = maxCount2.toString();

        await axios.patch(`https://botwin-admin-backend.onrender.com/update_max_chain_count`, {
            chain_id: chain_id,
            max_chain_count: values.join(' '),
        }).then((response) => console.log(response.statusText))
        getChainList()
    }

    const setActiveAction = async (action_id, isActive, index) => {

        const newIsActive = isActive == 0 ? 0 : 1;
        const values = products[index].active.split(' ');
        values[currentScript - 1] = newIsActive.toString();

        await axios.patch(`https://botwin-admin-backend.onrender.com/update_active_action`, {
            action_id: action_id,
            new_values: values.join(' '),
        }).then((response) => console.log(response))
        getActionListByChainId(currentChain)
    }
    
    const getActionListByChainId = async (chain_id, script_id) => {
        const response = await axios.get(`https://botwin-admin-backend.onrender.com/get_action_list/${chain_id}`)
        setProducts(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const getChainList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list')
        setChain_list(response.data)
        setOldActiveChain(response.data[currentChainIndex]?.chain_active)
        setActiveChain(parseInt(response.data[currentChainIndex]?.chain_active?.split(' ')[currentScript - 1]))
        setOldMaxCount(response.data[currentChainIndex]?.max_action_count)
        setMaxCount(parseInt(response.data[currentChainIndex].max_action_count.split(' ')[currentScript - 1]))
        setOldMaxCount2(response.data[currentChainIndex]?.max_chain_count)
        setMaxCount2(parseInt(response.data[currentChainIndex].max_chain_count.split(' ')[currentScript - 1]))
        setTimeout(() => setMsg(''), 7500)
    }
    const getScriptList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_script_list')
        setScript_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const editClick = (e, product) => {
        e.preventDefault()
        setEditProduct(product.action_id)
    }
    const updateProduct = async (e) => {
        e.preventDefault()
        await axios.patch(`https://botwin-admin-backend.onrender.com/update_action_item/${editProduct}`, {
            action_name: actionName,
            action_url: actionUrl,
            action_weight: actionWeight
        }).then((response) => setMsg(response.data.message))
        setEditProduct(null)
        getActionListByChainId(currentChain, currentChain)
    }
    const deleteChain = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Are you relly going to remove this chain?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('https://botwin-admin-backend.onrender.com/delete_chain/' + currentChain).then((response) => {
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    )
                })
            }

            setCurretChain(1)
        })
    }
    const deleteMulti = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Are you relly going to remove these actions?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let arrayids = [];
                products.forEach(d => {
                    if (d.select) {
                        arrayids.push(d.action_id);
                    }
                });
                await axios.delete('https://botwin-admin-backend.onrender.com/delete_selected_item/' + arrayids).then((response) => {
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    )
                })
            }

            getActionListByChainId(currentChain, currentChain)
        })
    }
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2 className='col-12 justify-content-center row mt-5 h2' style={{ alignItems: 'center' }} >Chains List for {
                    <div className="col-2 mt-2">
                        <select className="form-select" id="exampleFormControlSelect1" style={{ fontSize: '30px' }} onChange={(event) => setCurretcript(event.target.value)} >
                            {script_list.map((script, index) => (
                                <option key={index} value={script.script_id} style={{ fontSize: '20px' }} className="btn mb-2 me-2 col-5">
                                    {script.script_name}
                                </option>
                            ))}
                        </select>
                    </div>
                }</h2>
                <div className="col-2 mt-5">
                    {chain_list.map((chain, index) => (
                        <button onClick={() => { setCurretChain(chain.chain_id); setCurrentChainIndex(index);}} key={index} className="btn btn-primary mb-2 me-2 col-10">
                            {chain.chain_name}
                        </button>
                    ))}
                    <div className="col-1 mt-5" />
                </div>
                <div className="col-8 mt-5">
                    {(msg.length !== 0) ? <div className="alert alert-success fw-bold text-center" role="alert">{msg}</div> : null}
                    <div className='d-flex justify-content-between'>
                        <div />
                        <div>
                            <Link to='/addchain' className="btn btn-primary mb-2 me-2">Add New Chain</Link>
                            <button onClick={deleteChain} className="btn btn-danger me-2 mb-2">Delete This Chain</button>
                            <button
                                onClick={handleClick}
                                className={`btn ${!activechain ? 'btn-success' : 'btn-dark'} mb-2 me-2`}
                            >
                                {!activechain ? 'Active' : 'Inactive'}
                            </button>
                            <label className="form-label me-2">
                                {"Max action count :"}
                            </label>
                            <input
                                type="number"
                                name="maxCount"
                                style={{ width: '40px' }}
                                className="text-center py-1 pr-4 me-4"
                                value={maxCount}
                                onChange={(e) => setMaxCount(e.target.value)}
                                onKeyDown={(e) => handlePress(e)}
                            />

                            <label className="form-label me-2">
                                {"Interaction count per 5days :"}
                            </label>
                            <input
                                type="number"
                                name="maxCount2"
                                style={{ width: '40px' }}
                                className="text-center py-1 pr-4"
                                value={maxCount2}
                                onChange={(e) => setMaxCount2(e.target.value)}
                                onKeyDown={(e) => handlePress2(e)}
                            />
                        </div>
                    </div>
                    <h5 className='justify-content-center my-3'>Available Actions for {chain_list[currentChain - 1]?.chain_name}</h5>
                    <div>
                        <Link to='/addaction' className="btn btn-primary mb-2 me-2">Add New Action</Link>
                        <button onClick={deleteMulti} className="btn btn-danger mb-2">Delete Selected Actions</button>
                    </div>
                    <form onSubmit={updateProduct} style={{ overflow: 'auto', maxHeight: '400px' }} >
                        <table className="table table-striped table-bordered text-center mt-3 table-responsive">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={e => {
                                                let value = e.target.checked;
                                                setProducts(
                                                    products.map(d => {
                                                        d.select = value;
                                                        return d;
                                                    })
                                                );
                                            }}
                                        />
                                    </th>
                                    <th className="col-2">action_name</th>
                                    <th className="col-5">action_url</th>
                                    <th className="col-2">action_weight</th>
                                    <th className="col-1">active</th>
                                    <th className="col-2">edit</th>
                                </tr>
                            </thead>
                            <tbody >
                                {products.map((product, i) => (
                                    <Fragment key={i}>
                                        {editProduct === product.action_id ? (
                                            <EditInline
                                                i={product.action_id}
                                                editProduct={setEditProduct}
                                                id={editProduct}
                                                actionName={actionName}
                                                actionUrl={actionUrl}
                                                actionWeight={actionWeight}
                                                setActionName={setActionName}
                                                setActionUrl={setActionUrl}
                                                setActionWeight={setActionWeight}
                                            />) : (
                                            <ReadOnlyRows
                                                i={i}
                                                data={product}
                                                edit={editClick}
                                                setProducts={setProducts}
                                                setActive={setActiveAction}
                                                products={products}
                                                currentScript={currentScript}
                                            />)
                                        }
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
            {/* <div className='bridge_list'>
            <BridgeList msg={msg} setMsg={setMsg} current_chain={currentChain} />
            </div> */}
        </div >
    )
}
export default ProductList
