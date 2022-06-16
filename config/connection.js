const MongoClient = require('mongodb').MongoClient

const state= {
    db:null
}

module.exports.connect=function(done){
    const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
    const dbname = "qalamart"

    MongoClient.connect(url,(err,data)=>{
        if(err){
        return done(err) }
        else{
        state.db=data.db(dbname)}
        done()
    })

    
}

module.exports.get=function(){
    return state.db
}