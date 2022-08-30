/**
 * AncestryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const RestAPI = require("../../util/RestAPI");

const apiMap = {

    'height': '/block-height/',
    'block': '/block/'
};
const ancestryGen = {

};
module.exports = AncestryController = {
    /**
     * 
     * @param {block height} req 
     * @param {*} res 
     * find the height 
     * get the block details
     * get the txn_count from block
     * 
     */
    getblock: async function (height) {
        let url = apiMap.height + height;
        try{
            let hash = await RestAPI.get(url);
            let details = await RestAPI.get(apiMap.block + hash);
            return details;    
        }catch(err){
            throw err;
        }
    },
    getAnsister:async function(tx){
        if(ancestryGen[tx]) return ancestryGen[tx];
        let result = /tx/+tx
        let txDetails = await RestAPI.get(result);
        if(!txDetails.vin || !txDetails.vin.length || txDetails.vin[0].prevout === null){
            ancestryGen[tx] = 0;
            return ancestryGen[tx];
        }
        ancestryGen[tx] = 1+ await AncestryController.getAnsister(txDetails.vin[0]['txid'])
        return ancestryGen[tx]
    },
    find: async function (req, res) {

        try {
            let blockDetail = await AncestryController.getblock(req.params.height)
            let {id} = blockDetail;
            let data = await RestAPI.get('/block/'+id+'/txids');
            data = data.slice(0,2).map(d =>{
                return new Promise(async (resolve, reject) => {
                    try{
                        resolve(await AncestryController.getAnsister(d))
                    }catch(err){
                        reject(err);
                    }
                  });
            })
            // let result = await AncestryController.getAnsister(data[0])
            let result = await Promise.all(data);
            res.ok(result);

        } catch (err) {
            res.serverError(err);
        }
    }
};

