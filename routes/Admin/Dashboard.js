var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');
const readXlsxFile = require('read-excel-file/node');
const { file } = require('pdfkit');




var table = 'admin'


router.get('/',(req,res)=>{
    if(req.session.adminid){
        var query = `select count(id) as today_order from booking where date = curdate();`
        var query1 = `select count(id) as total_order from booking;`
        var query2 = `select sum(price) as today_revenue from booking where date = curdate();`
        var query3 = `select sum(price) as total_price from booking ;`
        var query4 = `select count(id) as pending_order from booking where status = 'running';`
        var query5 = `select count(id) as completed_order from booking where status = 'completed';`
        var query6 = `select count(id) as total_category from category;`
        var query7 = `select count(id) as total_agent from agent;`
        var query8 = `select count(id) as total_product from product;`
        var query9 = `select count(id) as low_stock_product from product where quantity < 100;`




        pool.query(query+query1+query2+query3+query4+query5+query6+query7+query8+query9,(err,result)=>{
            // res.render('Admin/Dashboard',{msg : '',result})
            if(err) throw err;
else res.render('Admin/Dashboard',{msg : '',result})
        })


   }
    else{
        res.render('Admin/login',{msg : '* Invalid Credentials'})

    }
})



router.get('/store-listing/:name',(req,res)=>{
    if(req.session.adminid){
    res.render('Admin/'+req.params.name)
    }
    else {
        res.render('Admin/login',{msg : '* Invalid Credentials'})

    }
})





router.post('/store-listing/:name/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]),(req,res)=>{
    let body = req.body
 console.log('s')
    console.log(req.body)

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

    body['created_date'] = today


    if(req.files.image1){
        body['image'] = req.files.image[0].filename;
        body['icon'] = req.files.icon[0].filename;
        body['image1'] = req.files.image1[0].filename;

     console.log(req.body)
       pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
           err ? console.log(err) : res.json({msg : 'success'})
       })
    }

else if(req.files.icon){

    

    body['image'] = req.files.image[0].filename;
    body['icon'] = req.files.icon[0].filename;

    console.log(req.files.image[0].filename)
    // importExcelData2MySQL('public/images/' + req.files.image[0].filename);

    // readXlsxFile(req.files.image[0].filename).then((rows) => {
    //     // `rows` is an array of rows
    //     // each row being an array of cells.     
    //     console.log(rows);

    // })

 console.log(req.body)
   pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })
}
else {
    body['image'] = req.files.image[0].filename;
    // body['icon'] = req.files.icon[0].filename;
 console.log(req.body)
   pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })
}


    
   
})













router.get('/store-listing/:name/delete', (req, res) => {
    let body = req.body
    pool.query(`delete from ${req.params.name} where id = ${req.query.id}`, (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully delete'
            })
        }
    })
})




router.post('/store-listing/:name/update', (req, res) => {
    let body = req.body
    pool.query(`update ${req.params.name} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            res.json({
                status:200,
                type : 'success',
                description:'successfully update'
            })

            
        }
    })
})





router.post('/store-listing/:name/update-image',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]), (req, res) => {
    let body = req.body;


    if(req.files.image){
        body['image'] = req.files.image[0].filename;
      
      }
      else {
        body['image'] = ''
      }

      

      if(req.files.icon){
        body['icon'] = req.files.icon[0].filename;
      
      }


      if(req.files.single_event_image){
        body['image1'] = req.files.image1[0].filename;
 
      }
      
      
  

    // pool.query(`select image from ${table} where id = '${req.body.id}'`,(err,result)=>{
    //     if(err) throw err;
    //     else {
    //         fs.unlinkSync(`public/images/${result[0].image}`); 


 pool.query(`update ${req.params.name} set ? where id = ?`, [req.body, req.body.id], (err, result) => {
        if(err) {
            res.json({
                status:500,
                type : 'error',
                description:err
            })
        }
        else {
            // res.json({
            //     status:200,
            //     type : 'success',
            //     description:'successfully update'
            // })

            res.redirect(`/admin/dashboard/store-listing/${req.params.name}`)
        }
    })


})







router.get('/orders/:type',(req,res)=>{
    if(req.params.type == 'runnning'){
       pool.query(`select b.* , 
       (select p.name from product p where p.id = b.bookingid) as bookingname,
       (select c.name from client c where c.id = b.clientid) as name,
       (select c.number from client c where c.id = b.clientid) as number,
       (select c.address from client c where c.id = b.clientid) as address,
       (select v.name from agent v where v.id = b.agentid) as agentname,
    (select p.image from product p where p.id = b.bookingid) as bookingimage

   
       from booking b where b.status != 'completed' and b.status != 'cancelled'  order by id desc`,(err,result)=>{
           err ? console.log(err) : res.render('Admin/order',{result, title:'Running Orders',msg:'running'})
       })
    }
    else if(req.params.type=='completed'){
       pool.query(`select b.* , 
       (select p.name from product p where p.id = b.bookingid) as bookingname,
       (select c.name from client c where c.id = b.clientid) as name,
       (select c.number from client c where c.id = b.clientid) as number,
       (select c.address from client c where c.id = b.clientid) as address,
       (select v.name from agent v where v.id = b.agentid) as agentname,
    (select p.image from product p where p.id = b.bookingid) as bookingimage
   
       from booking b where b.status = 'completed'  order by id desc`,(err,result)=>{
           err ? console.log(err) : res.render('Admin/order',{result, title:'Completed Orders',msg:'completed'})
       })
    }
    else {
       pool.query(`select b.* , 
       (select p.name from product p where p.id = b.bookingid) as bookingname,
       (select c.name from client c where c.id = b.clientid) as name,
       (select c.number from client c where c.id = b.clientid) as number,
       (select c.address from client c where c.id = b.clientid) as address,
       (select v.name from agent v where v.id = b.agentid) as agentname,
    (select p.image from product p where p.id = b.bookingid) as bookingimage

   
       from booking b where b.status = 'cancelled'  order by id desc`,(err,result)=>{
           err ? console.log(err) : res.render('Admin/order',{result, title:'Cancelled Orders',msg:'cancel'})
       })
    }
   
      
   })



   router.get('/update/booking-status',(req,res)=>{

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
    


    pool.query(`update booking set status = 'completed' , updated_date = '${today}'  where id = '${req.query.id}'`,(err,result)=>{
        if(err) throw err;
        else {
         res.redirect('/admin/dashboard/orders/runnning')
        }
    })

   
})
 




router.get('/low-stock',(req,res)=>{
   
       pool.query(`select p.* , (select c.name from category c where c.id = p.categoryid) as categoryname
        from product p order by p.quantity asc`,(err,result)=>{
           err ? console.log(err) : res.render('Admin/low-stock',{result, title:'Running Orders',msg:'running'})
       })
    
      
   })



   router.get('/reports',(req,res)=>{
    var query = `select b.* , 
    (select p.name from product p where p.id = b.bookingid) as bookingname,
    (select c.name from client c where c.id = b.clientid) as name,
    (select c.number from client c where c.id = b.clientid) as number,
    (select c.address from client c where c.id = b.clientid) as address,
    (select v.name from agent v where v.id = b.agentid) as agentname,
 (select p.image from product p where p.id = b.bookingid) as bookingimage from booking b where date between '${req.query.from_date}' and '${req.query.to_date}';`
    
    pool.query(query,(err,result)=>{
        if(err) throw err;
     //    00else res.render('Admin/transaction-talent-hunt',{result})
 else res.json(result)  
 })
})




router.post('/excel/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]),(req,res)=>{
    let body = req.body
 console.log('s')
    console.log(req.body)

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

    body['created_date'] = today


    if(req.files.image1){
        body['image'] = req.files.image[0].filename;
        body['icon'] = req.files.icon[0].filename;
        body['image1'] = req.files.image1[0].filename;

     console.log(req.body)
       pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
           err ? console.log(err) : res.json({msg : 'success'})
       })
    }

else if(req.files.icon){

    

    body['image'] = req.files.image[0].filename;
    body['icon'] = req.files.icon[0].filename;

    console.log(req.files.image[0].filename)
   

 console.log(req.body)
   pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })
}
else {
    body['image'] = req.files.image[0].filename;

     importExcelData2MySQL('public/images/' + req.files.image[0].filename);

  
     res.redirect('/admin/dashboard/store-listing/excel')

//  console.log(req.body)
//    pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
}


    
   
})




function importExcelData2MySQL(filePath){

    
    // File path.
    console.log(filePath)
    readXlsxFile(filePath).then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.     
    console.log('saahahs',rows);
let query = 'INSERT INTO product (name, categoryid, small_description, price, quantity, keyword) VALUES ?';

    pool.query(query,[rows],(err,result)=>{
        if(err) console.log(err)
        else console.log(result) 
    })

    })

}

module.exports = router;
