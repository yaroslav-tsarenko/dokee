const General = require('../models/general.model');

const initGeneral = async (req, res) => {
    let general = await General.findOne();
    if (!general) {
        general = new General();
        await general.save();
    }
    res.json(general);
};

const updateGeneral = async (req, res) => {
    let general = await General.findOne();
    if (!general) {
        general = new General();
    }
    Object.assign(general, req.body);
    await general.save();
    res.json(general);
};

module.exports = { initGeneral, updateGeneral };