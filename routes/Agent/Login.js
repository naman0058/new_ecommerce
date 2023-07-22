var express = require('express');
var router = express.Router();
var pool =  require('../pool');


var table = 'agent'


router.get('/',(req,res)=>{
  res.render('Agent/login',{msg : ''})

})



router.post('/verification',(req,res)=>{
    let body = req.body

    console.log(req.body)

pool.query(`select * from ${table} where number = '${req.body.number}' and password = '${req.body.password}' and role = 'Read & Update'`,(err,result)=>{
  if(err) throw err;
  else if(result[0]) {
      req.session.agentid = result[0].id
   res.redirect('/Agent/dashboard')
  }
  else {
    res.render('Agent/login',{msg : '* Invalid Credentials'})
  }
})
   })



   router.get('/logout',(req,res)=>{
     req.session.agentid = null;
     res.redirect('/agent')
   })


module.exports = router;