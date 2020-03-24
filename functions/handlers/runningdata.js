const {db} = require('../util/admin.js')

exports.getAllRunningData = (req,res)=>{
    db.collection('runningData').get()
    .then(data =>{
        let runningData=[];
        data.forEach(doc => {
            runningData.push({
                dataId: doc.id,
                userName: doc.data().userName,
                DistanceKm:doc.data().DistanceKm,
                DateRecorded: new Date().toISOString(),
                Time:doc.data().Time
            });
        })
        return res.json(runningData);
    })
    .catch(err=>console.error(err));
}

exports.postRunningData = (req, res) => {
    const newRunningData={
        DistanceKm:req.body.DistanceKm,
        Time:req.body.Time,
        userName:req.user.userName,
        DateRecorded: new Date().toISOString()
    };
    
     db
     .collection('runningData')
     .add(newRunningData)
     .then((doc) =>{
         res.json({message:`document ${doc.id} created successfully`});
     })
     .catch(err=>{
         res.status(500).json({error:`Internal server error`});
         console.error(err);
     });
 }