import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const setActiveAction = async (action_id, isActive) => {
    const newIsActive = isActive === 0 ? 0 : 1;
    await axios.patch(`${BASE_URL}/set_avtive`, {
        action_id: action_id,
        isActive: newIsActive,
    });
};

export const getActionListByChainId = async (chain_id) => {
    const response = await axios.get(`${BASE_URL}/get_action_list/${chain_id}`);
    return response.data;
};

export const getChainList = async () => {
    const response = await axios.get(`${BASE_URL}/get_chain_list`);
    return response.data;
};

export const getScriptList = async () => {
    const response = await axios.get(`${BASE_URL}/get_script_list`);
    return response.data;
};

export const updateActionItem = async (action_id, action_name, action_url, action_weight) => {
    const response = await axios.patch(`${BASE_URL}/update_action_item/${action_id}`, {
        action_name: action_name,
        action_url: action_url,
        action_weight: action_weight,
    });
    return response.data.message;
};

export const deleteSelectedItems = async (arrayids) => {
    const response = await axios.delete(`${BASE_URL}/delete_selected_item/` + arrayids);
    return response.data.message;
};