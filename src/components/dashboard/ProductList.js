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
    const [actionName, setActionName] = useState('');
    const [actionUrl, setActionUrl] = useState('');
    const [actionWeight, setActionWeight] = useState(0);
    const [expire, setExpire] = useState('');
    const [name, setName] = useLocalStorage('name', '');
    const [currentChain, setCurretChain] = useState(1);
    const [currentScript, setCurretcript] = useState(1);
    const [activechain, setActiveChain] = useState(1);
    const navigate = useNavigate()
    useEffect(() => {
        refreshToken(setToken, setName, setExpire, navigate)
    }, [])
    useEffect(() => {
        getChainList()
        getScriptList()
        getActionListByChainId(currentChain)
    }, [currentChain])

    const handleClick = () => {
        console.log(activechain);
        setActiveChain(activechain === 1 ? 0 : 1);
        updateActiveChain(currentChain, activechain)
    };
    
    const updateActiveChain = async (chain_id, isActive) => {
        const newIsActive = isActive == 0 ? 1 : 0;
        await axios.patch(`https://botwin-admin-backend.onrender.com/set_avtive_chain`, {
            chain_id: chain_id,
            isActive: newIsActive,
        }).then((response) => console.log(response.statusText))
        getChainList()
    }

    const setActiveAction = async (action_id, isActive) => {
        const newIsActive = isActive == 0 ? 0 : 1;
        await axios.patch(`https://botwin-admin-backend.onrender.com/set_avtive_action`, {
            action_id: action_id,
            isActive: newIsActive,
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
        console.log(response.data[currentChain - 1].chain_active)
        setActiveChain(response.data[currentChain - 1].chain_active)
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
                console.log(arrayids);
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
                        <button onClick={() => setCurretChain(chain.chain_id)} key={index} className="btn btn-primary mb-2 me-2 col-10">
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
                                className={`btn ${activechain ? 'btn-dark' : 'btn-success'} mb-2`}
                            >
                                {activechain ? 'Inactive' : 'Active'}
                            </button>
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
                                                data={product}
                                                edit={editClick}
                                                setProducts={setProducts}
                                                setActive={setActiveAction}
                                                products={products}
                                            />)
                                        }
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
            <BridgeList msg={msg} setMsg={setMsg} current_chain={currentChain} />
        </div >
    )
}
export default ProductList
