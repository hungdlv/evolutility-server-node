/*! *******************************************************
 * 
 * evolutility-server-node :: stats.js
 * Some data on the object like the min, max, average, and total for numeric fields.
 *
 * https://github.com/evoluteur/evolutility-server-node
 * (c) 2018 Olivier Giulieri
 ********************************************************* */

var dico = require('./utils/dico'),
    logger = require('./utils/logger'),
    query = require('./utils/query'),
    config = require('../config.js');

var schema = '"'+(config.schema || 'evolutility')+'"',
    defaultPageSize = config.pageSize || 50;

function minMax(fn, f, cast){
    const num = f.type==='money' ? '::numeric' : ''
    let tcast = '';

    if(fn!=='avg'){
        switch(f.type){
            case 'integer':
            case 'decimal':
            case 'money':
                tcast = '::'+f.type
                break
        }        
    }else{
        tcast = '::'+f.type
    }
    return ', '+fn+'('+f.column+num+')'+tcast+' AS '+f.id+'_'+fn
}

// - returns a summary on a single table
function numbers(req, res) {
    logger.logReq('GET STATS', req);

    var m = dico.getModel(req.params.entity)
    if(m){
        var sql = 'SELECT count(*)::integer AS count';
            
        m.fields.forEach(function(f){
            if(dico.fieldIsNumeric(f)){
                if(!dico.fieldIsDateOrTime(f)){
                    sql += minMax('avg', f)
                }
                if(f.type==='money' || f.type==='integer'){
                    sql += minMax('sum', f)
                }
                sql += minMax('min', f)
                sql += minMax('max', f)
            }
        })
        if(config.wTimestamp){
            sql += ', max(u_date) AS u_date_max'
        }
        if(config.wComments){
            sql += ', sum(nb_comments::int)::int AS nb_comments'
        }
        sql += ' FROM '+m.schemaTable;  
        query.runQuery(res, sql, [], true);
    }else{
        return res.json(logger.errorMsg('Invalid parameters.', 'stats numbers'));
    }
}

// --------------------------------------------------------------------------------------

module.exports = {

    numbers: numbers,

}
