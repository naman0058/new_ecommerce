var express = require('express');
var router = express.Router();
var pool =  require('./pool');
var upload = require('./multer');


router.get('/get-category',(req,res)=>{
    pool.query(`select * from category order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })



   router.get('/get-style',(req,res)=>{
    pool.query(`select * from style order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })


   router.get('/get-images',(req,res)=>{
    pool.query(`select i.* , (select c.code from style c where c.id = i.categoryid) as categoryname from images i order by id`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })



   router.get('/get-agent',(req,res)=>{
    pool.query(`select * from agent order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })



   router.get('/get-client',(req,res)=>{
    pool.query(`select c.*  , 
    (select a.name from agent a where a.id = c.agentid) as agentname
     from client c order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })


   router.get('/get-product',(req,res)=>{
    pool.query(`select p.* , (select c.name from category c where c.id = p.categoryid) as categoryname from product p order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })


   router.post('/login',(req,res)=>{
    pool.query(`select * from agent where number  = '${req.body.number}' and password = '${req.body.password}'`,(err,result)=>{
        if(err) throw err;
        else if(result[0]){
            res.json({
                msg : 'success',
                data:result
            })
        }
        else {
            res.json({
                msg : 'invalid',
               
            })
        }
    })
   })



   router.post('/client-list',(req,res)=>{
    pool.query(`select * from client order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })


   router.post('/product-list',(req,res)=>{
    pool.query(`select p.* from product p where p.categoryid = '${req.body.categoryid}' order by name`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   
   })


   router.post('/add-to-cart',(req,res)=>{
    let body = req.body
    console.log(req.body)
    pool.query(`select * from product where id = '${req.body.bookingid}'`,(err,result)=>{
        if(err) throw err;
        else{
            let quantity = result[0].quantity;
            if(quantity >= req.body.quantity){
 
                pool.query(`select * from cart where bookingid = '${req.body.bookingid}' and agentid = '${req.body.agentid}' and clientid = '${req.body.clientid}'`,(err,result)=>{
                    if(err) throw err;
                    else if(result[0]){
                        pool.query(`update cart set quantity = ${req.body.quantity} , total_price = '${req.body.total_price}' where bookingid = '${req.body.bookingid}' and agentid = '${req.body.agentid}' and clientid = '${req.body.clientid}' `,(err,result)=>{
                            if(err) throw err;
                            else {
                                res.json({
                                    msg : 'success',
                                    description:'success'
                                })
                            }
                          })
                    }
                    else{


                        pool.query(`select * from cart where agentid = '${req.body.agentid}'`,(err,result)=>{
                            if(err) throw err;
                            else if(result[0]){
                                if(result[0].agentid != req.body.agentid){
                                    pool.query(`delete from cart where agentid = '${req.body.agentid}'`,(err,result)=>{
                                        if(err) throw err;
                                        else{
                                            pool.query(`insert into cart set ?`,body,(err,result)=>{
                                                if(err) throw err;
                                                else {
                                                    res.json({
                                                        msg : 'success',
                                                        description:'success'
                                                    })
                                                }
                                              })
                                        }
                                    })
                                }
                                else{
                                    pool.query(`insert into cart set ?`,body,(err,result)=>{
                                        if(err) throw err;
                                        else {
                                            res.json({
                                                msg : 'success',
                                                description:'success'
                                            })
                                        }
                                      })
                                }
                               
                            }
                            else{
                                pool.query(`insert into cart set ?`,body,(err,result)=>{
                                    if(err) throw err;
                                    else {
                                        res.json({
                                            msg : 'success',
                                            description:'success'
                                        })
                                    }
                                  })
                            }
                        })


                    
                    }
                })


             
            }
            else{
              res.json({
                msg : 'invalid',
                description : `Quantity Available : ${quantity}`
              })
            }
        }
    })
   })





   router.post('/mycart',(req,res)=>{
    pool.query(`select c.*,(select p.icon from product p where p.id = c.bookingid) as product_image,
    (select p.name from product p where p.id = c.bookingid) as product_name
        from cart c where c.agentid = '${req.body.agentid}'`,(err,result)=>{
        if(err) throw err;
        else {
            res.json(result)
        }
    })
   })



   router.post('/checkout',(req,res)=>{

    pool.query(`select c.clientid from cart c where c.agentid = '${req.body.agentid}'`,(err,result)=>{
        if(err) throw err;
        else {
           let clientid = result[0].clientid;
           var query1 = `select c.*,(select p.icon from product p where p.id = c.bookingid) as product_image,
           (select p.name from product p where p.id = c.bookingid) as product_name
            from cart c where c.agentid = '${req.body.agentid}';`
           var query2 = `select * from client where id = '${clientid}';`
           pool.query(query1+query2,(err,result)=>{
            if(err) throw err;
            else {
                res.json(result)
            }
           })
        }
    })
   })





   router.post('/order-now',(req,res)=>{
    let body = req.body;
  console.log('body',req.body)
    let cartData = req.body
  
  
  //  console.log('CardData',cartData)
  
     body['status'] = 'running'
      
  
    var today = new Date();
  var dd = today.getDate();
  
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
    dd='0'+dd;
  } 
  
  if(mm<10) 
  {
    mm='0'+mm;
  } 
  today = yyyy+'-'+mm+'-'+dd;
  
  
  body['date'] = today
  
  
  
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 12; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
   orderid = result;
  
   body['orderid'] = orderid
  
   
  
  
   pool.query(`select * from cart where clientid = '${req.body.clientid}' and agentid = '${req.body.agentid}'`,(err,result)=>{
       if(err) throw err;
       else {
  
       let data = result
  
       for(i=0;i<result.length;i++){
        data[i].name = req.body.name
        data[i].date = today
        data[i].orderid = orderid
        data[i].status = 'running'
        data[i].number = req.body.number
        data[i].address = req.body.address
        data[i].id = null
  
  
       }
  
  
  
  
  for(i=0;i<data.length;i++) {
   let j = i;
   pool.query(`insert into booking set ?`,data[i],(err,result)=>{
           if(err) throw err;
           else if(result){

            
  
  console.log('afyeri',data[j].quantity);
  
  
  pool.query(`update product set quantity = quantity - ${data[j].quantity} where id = '${data[j].bookingid}'`,(err,result)=>{
   if(err) throw err;
   else {
  console.log(data[j].quantity);
   }
  
  })
  
           }
      })
  }
  
  
    
  pool.query(`insert into final_booking set ?`,body,(err,result)=>{
    if(err) throw err;
    else{
        pool.query(`delete from cart where agentid = '${req.body.agentid}'`,(err,result)=>{
            if(err) throw err;
            else {
            
          
          
              res.json({
                msg : 'success'
            })
          
            }
          })
    }
  })
  
 
  
  
       }
   })
  
   
  })
  


  router.post('/dashboard',(req,res)=>{
    var query = `select count(id) as count from final_booking where date = CURDATE();`
    var query1 = `select sum(discountedPrice) as sum from final_booking where date = CURDATE();`
    var query2 = `SELECT COUNT(id) AS count FROM final_booking GROUP BY YEAR(date), MONTH(date) ORDER BY YEAR(date), MONTH(date);`
    var query3 = `SELECT sum(discountedPrice) AS count FROM final_booking GROUP BY YEAR(date), MONTH(date) ORDER BY YEAR(date), MONTH(date);`
    var query4 = `select count(id) as count from final_booking where status = 'running';`
    var query5 = `select count(id) as count from final_booking where status = 'completed';`

    pool.query(query+query1+query2+query3+query4+query5,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })


  })



  router.post('/get-orders',(req,res)=>{
    console.log(req.body)
    pool.query(`SELECT b.*,
    (SELECT COUNT(id) FROM booking bo WHERE bo.orderid = b.orderid) AS total_item,
    (SELECT sum(quantity) FROM booking bo WHERE bo.orderid = b.orderid) AS total_piece
  FROM final_booking b
  WHERE status = '${req.body.status}' AND agentid = '${req.body.agentid}';`,(err,result)=>{
        if(err) throw err;
        else {
            res.json(result)
        }
    })
  })



  router.post('/single-order-details',(req,res)=>{

    pool.query(`select c.clientid , c.discountedPrice from final_booking c where c.orderid = '${req.body.orderid}'`,(err,result)=>{
        if(err) throw err;
        else {
           let clientid = result[0].clientid;
           var query1 = `select b.*,
           (select p.icon from product p where p.id = b.bookingid) as product_image,
           (select p.name from product p where p.id = b.bookingid) as product_name,
           (select f.discountedPrice from final_booking f where f.orderid = b.orderid) as payable_amount,
           (select f.couponcode from final_booking f where f.orderid = b.orderid) as couponcode_applied


            from booking b where b.orderid = '${req.body.orderid}';`
           var query2 = `select * from client where id = '${clientid}';`
           pool.query(query1+query2,(err,result)=>{
            if(err) throw err;
            else {
                res.json(result)
            }
           })
        }
    })
   })



   router.post('/delete-cart',(req,res)=>{
    pool.query(`delete from cart where id = '${req.body.id}'`,(err,result)=>{
        if(err) throw err;
        else res.json({msg:'success'})
    })
   })


   router.post('/get-counter',(req,res)=>{
    console.log(req.body)
    pool.query(`select count(id) as counter from cart where agentid = '${req.body.agentid}'`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   })



   router.get('/get-coupon',(req,res)=>{
    console.log(req.body)
    pool.query(`select * from coupon`,(err,result)=>{
        if(err) throw err;
        else res.json(result)
    })
   })



   

module.exports = router;
