var express = require('express');
var router = express.Router();
var pool =  require('../pool');
var upload = require('../multer');
const readXlsxFile = require('read-excel-file/node');
const { file } = require('pdfkit');
const ExcelJS = require('exceljs');

// API endpoint for downloading category data as Excel
router.get('/download-style', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Categories');

  // Fetch category data from the database
  pool.query('SELECT * FROM style', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch data from the database' });
    }

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 10 },
      { header: 'Code', key: 'code', width: 20 },
    ];

    // Add data rows to the worksheet
    results.forEach((category) => {
      worksheet.addRow(category);
    });

    // Set the response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=styles.xlsx');

    // Save the workbook as a stream and send it as the API response
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate Excel file' });
      });
  });
});



router.get('/download-product', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Categories');

  // Fetch category data from the database
  pool.query('SELECT * FROM product', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch data from the database' });
    }

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: 'Product Code', key: 'product_code', width: 10 },
      { header: 'Style Code', key: 'style_code', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Category Code', key: 'categoryid', width: 20 },
      { header: 'Description', key: 'small_description', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 20 },
      { header: 'PRice', key: 'price', width: 20 },

    ];

    // Add data rows to the worksheet
    results.forEach((category) => {
      worksheet.addRow(category);
    });

    // Set the response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=product.xlsx');

    // Save the workbook as a stream and send it as the API response
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate Excel file' });
      });
  });
});



router.get('/download-client-prices', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Categories');

  // Fetch category data from the database
  pool.query('SELECT * FROM client_prices', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch data from the database' });
    }

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: 'Client Code', key: 'client_code', width: 10 },
      { header: 'Style Code', key: 'style_code', width: 20 },
      { header: 'Price', key: 'price', width: 20 },
     
    ];

    // Add data rows to the worksheet
    results.forEach((category) => {
      worksheet.addRow(category);
    });

    // Set the response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=client_prices.xlsx');

    // Save the workbook as a stream and send it as the API response
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate Excel file' });
      });
  });
});



router.get('/download-running-orders', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Categories');

  // Fetch category data from the database
  pool.query(`SELECT b.* , 
  (select p.product_code from product p where p.id = b.bookingid) as product_code,
  (select p.style_code from product p where p.id = b.bookingid) as style_code,
  (select a.name from agent a where a.id = b.agentid) as agent_name

   FROM booking b where status = 'running'`, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch data from the database' });
    }

    // Add column headers to the worksheet
    worksheet.columns = [
      { header: 'OrderID', key: 'orderid', width: 10 },
      { header: 'BookingID', key: 'bookingid', width: 10 },
      { header: 'Product Code', key: 'product_code', width: 10 },
      { header: 'Style Code', key: 'style_code', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Number', key: 'number', width: 20 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 20 },
      { header: 'Price', key: 'price', width: 20 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Agent', key: 'agent_name', width: 20 },
      { header: 'Last Update', key: 'updated_date', width: 20 },




     
    ];

    // Add data rows to the worksheet
    results.forEach((category) => {
      worksheet.addRow(category);
    });

    // Set the response headers for file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=running_orders.xlsx');

    // Save the workbook as a stream and send it as the API response
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate Excel file' });
      });
  });
});



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


else if(req.files.image){

    body['image'] = req.files.image[0].filename;
    // body['icon'] = req.files.icon[0].filename;
 console.log(req.body)
   pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
       err ? console.log(err) : res.json({msg : 'success'})
   })
}

else {
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

            res.redirect(`/Admin/dashboard/store-listing/${req.params.name}`)
        }
    })


})







// router.get('/orders/:type',(req,res)=>{
//     if(req.params.type == 'runnning'){
//        pool.query(`select b.* , 
//        (select c.code from client c where c.id = b.clientid) as clientcode,
//        (select a.name from agent a where a.id = b.agentid) as agentname,
//     (select sum(quantity) from booking bo where bo.orderid = b.orderid) as items

//        from final_booking b where b.status != 'completed' and b.status != 'cancelled'  order by id desc`,(err,result)=>{
//            err ? console.log(err) : res.render('Admin/order',{result, title:'Running Orders',msg:'running'})
//        })
//     }
//     else if(req.params.type=='completed'){
//        pool.query(`select b.* , 
//        (select c.code from client c where c.id = b.clientid) as clientcode,
//        (select a.name from agent a where a.id = b.agentid) as agentname,
//     (select sum(quantity) from booking bo where bo.orderid = b.orderid) as items

   
//        from final_booking b where b.status = 'completed'  order by id desc`,(err,result)=>{
//            err ? console.log(err) : res.render('Admin/order',{result, title:'Completed Orders',msg:'completed'})
//        })
//     }
//     else {
//        pool.query(`select b.* , 
//     (select c.code from client c where c.id = b.clientid) as clientcode,
//     (select a.name from agent a where a.id = b.agentid) as agentname,
//     (select sum(quantity) from booking bo where bo.orderid = b.orderid) as items
//     from final_booking b where b.status = 'cancelled'  order by id desc`,(err,result)=>{
//            err ? console.log(err) : res.render('Admin/order',{result, title:'Cancelled Orders',msg:'cancel'})
//        })
//     }
   
      
//    })




router.get('/orders/:type',(req,res)=>{
  if(req.params.type == 'runnning'){
     pool.query(`SELECT b.* , 
     (select p.product_code from product p where p.id = b.bookingid) as product_code,
     (select p.style_code from product p where p.id = b.bookingid) as style_code,
     (select a.name from agent a where a.id = b.agentid) as agent_name

     from booking b where b.status != 'completed' and b.status != 'cancelled'  order by id desc`,(err,result)=>{
         err ? console.log(err) : res.render('Admin/order',{result, title:'Running Orders',msg:'running'})
     })
  }
  else if(req.params.type=='completed'){
     pool.query(`SELECT b.* , 
     (select p.product_code from product p where p.id = b.bookingid) as product_code,
     (select p.style_code from product p where p.id = b.bookingid) as style_code,
     (select a.name from agent a where a.id = b.agentid) as agent_name

     from booking b where b.status = 'completed'  order by id desc`,(err,result)=>{
         err ? console.log(err) : res.render('Admin/order',{result, title:'Completed Orders',msg:'completed'})
     })
  }
  else {
     pool.query(`SELECT b.* , 
     (select p.product_code from product p where p.id = b.bookingid) as product_code,
     (select p.style_code from product p where p.id = b.bookingid) as style_code,
     (select a.name from agent a where a.id = b.agentid) as agent_name

     from booking b where b.status = 'cancelled'  order by id desc`,(err,result)=>{
         err ? console.log(err) : res.render('Admin/order',{result, title:'Cancelled Orders',msg:'cancel'})
     })
  }
 
    
 })



 router.get('/edit-oroder',(req,res)=>{
  pool.query(`select * from booking where id = '${req.query.orderid}'`,(err,result)=>{
    if(err) throw err;
    else {
      console.log(result)
      res.render('Admin/edit-order',{result})
    }
  })
 })


 router.post('/update/order/quantity',(req,res)=>{
  console.log(req.body)
  let total_price = (req.body.quantity) * (req.body.price)
  pool.query(`update booking set quantity = '${req.body.quantity}' , total_price = '${total_price}' where id = '${req.body.bookingid}'`,(err,result)=>{
    if(err) throw err;
    else {
      pool.query(`select sum(total_price) as newprice from booking where orderid = '${req.body.orderid}'`,(err,result)=>{
        if(err) throw err;
        else {
          let newprice = result[0].newprice
          console.log('new',newprice)
          pool.query(`update final_booking set price = '${newprice}' where orderid = '${req.body.orderid}'`,(err,result)=>{
            if(err) throw err;
            else{
              res.redirect('/admin/dashboard/orders/runnning')
            }
          })
        }
      })
    }
  })
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
    


    pool.query(`update booking set status = 'completed' , updated_date = '${today}'  where orderid = '${req.query.orderid}'`,(err,result)=>{
        if(err) throw err;
        else {
          pool.query(`update final_booking set status = 'completed' , updated_date = '${today}' where orderid = '${req.query.orderid}'`,(err,result)=>{
            if(err) throw err;
            else{
         res.redirect('/Admin/dashboard/orders/runnning')

            }
          })
        }
    })

   
})
 




router.get('/low-stock',(req,res)=>{
   
       pool.query(`select p.* , (select c.name from category c where c.id = p.categoryid) as categoryname
        from product p order by p.quantity asc`,(err,result)=>{
           err ? console.log(err) : res.render('Admin/low-stock',{result, title:'Running Orders',msg:'running'})
       })
    
      
   })




   router.get('/product-list',(req,res)=>{
   
    pool.query(`select s.* , (select i.image from images i where i.categoryid = s.code) as image from style s`,(err,result)=>{
        err ? console.log(err) : res.render('Admin/product-list',{result, title:'Product List',msg:'running'})
    })
 
   
})




router.get('/style/list',(req,res)=>{
   
  pool.query(`select * from style`,(err,result)=>{
      err ? console.log(err) : res.render('Admin/style-list',{result, title:'Style List',msg:'running'})
  })

})



router.get('/client/list',(req,res)=>{
   
    pool.query(`select * from client`,(err,result)=>{
        err ? console.log(err) : res.render('Admin/client-list',{result, title:'Client List',msg:'running'})
    })
 
   
})



router.get('/view-product',(req,res)=>{
   
    pool.query(`select p.* from product p where style_code = '${req.query.code}' order by p.quantity asc`,(err,result)=>{
        err ? console.log(err) : res.render('Admin/low-stock',{result, title:'Product List',msg:'running'})
    })
 
   
})



router.get('/view-client',(req,res)=>{
   
    pool.query(`select p.* from client_prices p where client_code = '${req.query.code}' order by id desc`,(err,result)=>{
        err ? console.log(err) : res.render('Admin/price-list',{result, title:'Client Price List',msg:'running'})
    })
 
   
})



   router.get('/reports',(req,res)=>{

if(req.query.client == 'all_client'){
  var query = `SELECT b.* , 
  (select p.product_code from product p where p.id = b.bookingid) as product_code,
  (select p.style_code from product p where p.id = b.bookingid) as style_code,
  (select a.name from agent a where a.id = b.agentid) as agent_name
   from booking b where date between '${req.query.from_date}' and '${req.query.to_date}';`
  
  pool.query(query,(err,result)=>{
      if(err) throw err;
   //    00else res.render('Admin/transaction-talent-hunt',{result})
else res.json(result)  
})

}
else{
  

  var query = `SELECT b.* , 
  (select p.product_code from product p where p.id = b.bookingid) as product_code,
  (select p.style_code from product p where p.id = b.bookingid) as style_code,
  (select a.name from agent a where a.id = b.agentid) as agent_name
   from booking b where clientid = '${req.query.client}' and date between '${req.query.from_date}' and '${req.query.to_date}';`
  console.log('run')
  pool.query(query,(err,result)=>{
      if(err) throw err;
   //    00else res.render('Admin/transaction-talent-hunt',{result})
else res.json(result)  
})


}

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

  
     res.redirect('/Admin/dashboard/store-listing/excel')

//  console.log(req.body)
//    pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
}


    
   
})



function importExcelData2MySQL(filePath) {
  // File path.
  console.log(filePath);
  readXlsxFile(filePath).then((rows) => {
    const data = rows.slice(1); // Exclude the header row

    const values = data.map((row) => [
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      row[6],
    ]);

    const query =
      'INSERT INTO product (product_code, style_code, name, categoryid, small_description, quantity, price) VALUES ?';

    pool.query(query, [values], (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(result);
      }
    });
  });
}






router.post('/client/excel/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]),(req,res)=>{
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

     importExcelData2MySQL1('public/images/' + req.files.image[0].filename);

  
     res.redirect('/Admin/dashboard/store-listing/client_excel')

//  console.log(req.body)
//    pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
}


    
   
})








function importExcelData2MySQL1(filePath) {
  let query = 'INSERT INTO client_prices (client_code, style_code, price) VALUES ?';

  readXlsxFile(filePath)
    .then((rows) => {
      console.log('rows', rows.length);

      for (let i = 1; i < rows.length; i++) {
        const clientCode = rows[i][0];
        const styleCode = rows[i][1];
        const price = rows[i][2];
        const action = rows[i][3];

        if(action == 'delete'){
       pool.query(`delete from client_prices where client_code = '${clientCode}' and style_code = '${styleCode}'`,(err,result)=>{
        if(err) console.log(err)
        else console.log('done')
       })
        }
        else{
          pool.query(
            `SELECT * FROM client_prices WHERE client_code = '${clientCode}' AND style_code = '${styleCode}'`,
            (err, result) => {
              if (err) {
                console.error(err);
              } else {
                if (result.length > 0) {
                  pool.query(
                    `UPDATE client_prices SET price = '${price}' WHERE client_code = '${clientCode}' AND style_code = '${styleCode}'`,
                    (err, result) => {
                      if (err) {
                        console.error(err);
                      } else {
                        console.log(result);
                      }
                    }
                  );
                } else {
                  pool.query(`INSERT INTO client_prices (client_code, style_code, price) VALUES ('${clientCode}' , '${styleCode}' , '${price}')`, (err, result) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(result);
                    }
                  });
                }
              }
            }
          );
        }

        
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
















  router.post('/inventory/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]),(req,res)=>{
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

     importExcelData2MySQL2('public/images/' + req.files.image[0].filename);

  
     res.redirect('/Admin/dashboard/store-listing/client_excel')

//  console.log(req.body)
//    pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
}


    
   
})




function importExcelData2MySQL2(filePath) {
  readXlsxFile(filePath)
    .then((rows) => {
      console.log('rows', rows.length);

      const updateQuery = 'UPDATE product SET quantity = quantity + ? WHERE product_code IN (?)';
      const deleteQuery = 'DELETE FROM product WHERE product_code IN (?)';

      const updatesBulkData = [];
      const deletesBulkData = [];

      for (let i = 1; i < rows.length; i++) {
        const productCode = rows[i][0];
        const quantity = rows[i][1];
        const action = rows[i][2];

        if (action == 'Add' || action == 'replace') {
          updatesBulkData.push([quantity, productCode]);
        } else if (action === 'reduce') {
          updatesBulkData.push([-quantity, productCode]);
        } else if (action === 'delete') {
          deletesBulkData.push(productCode);
        } else {
          console.log(`Invalid action: ${action}`);
        }
      }

      // Perform bulk updates
      if (updatesBulkData.length > 0) {
      
        updatesBulkData.forEach(([quantity, productCode]) => {
          pool.query(updateQuery, [quantity, productCode], (err, result) => {
            if (err) {
              console.error('Error in bulk updates:', err);
            } else {
              console.log('Bulk updates completed');
            }
          });
        });
      }

      // Perform bulk deletes
      if (deletesBulkData.length > 0) {
        pool.query(deleteQuery, [deletesBulkData], (err, result) => {
          if (err) {
            console.error('Error in bulk deletes:', err);
          } else {
            console.log('Bulk deletes completed');
          }
        });
      }
    })
    .catch((error) => {
      console.error('Error in reading Excel file:', error);
    });
}






  



  router.get('/view-order',(req,res)=>{

    pool.query(`select c.clientid , c.discountedPrice from final_booking c where c.orderid = '${req.query.orderid}'`,(err,result)=>{
        if(err) throw err;
        else {
           let clientid = result[0].clientid;
           var query1 = `select b.*,
           (select p.name from product p where p.id = b.bookingid) as product_name,
           (select f.discountedPrice from final_booking f where f.orderid = b.orderid) as payable_amount,
           (select f.price from final_booking f where f.orderid = b.orderid) as net_amount,
           (select f.couponcode from final_booking f where f.orderid = b.orderid) as couponcode_applied


            from booking b where b.orderid = '${req.query.orderid}';`
           var query2 = `select * from client where id = '${clientid}';`
           pool.query(query1+query2,(err,result)=>{
            if(err) throw err;
            else {
                res.render('Admin/invoice',{result})
                // res.json(result)
            }
           })
        }
    })
   })











   
router.post('/style/insert',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]),(req,res)=>{
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

   importExcelData2MySQLstyle('public/images/' + req.files.image[0].filename);


   res.redirect('/Admin/dashboard/store-listing/excel')

//  console.log(req.body)
//    pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
}


  
 
})



// function importExcelData2MySQLstyle(filePath) {
// // File path.
// console.log(filePath);
// readXlsxFile(filePath).then((rows) => {
//   const data = rows.slice(1); // Exclude the header row

//   const values = data.map((row) => [
//     row[0],
//     row[1],
  
//   ]);

//   const query =
//     'INSERT INTO style (name, code) VALUES ?';

//   pool.query(query, [values], (err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(result);
//     }
//   });
// });
// }




function importExcelData2MySQLstyle(filePath) {
  // File path.
  console.log(filePath);
  readXlsxFile(filePath).then((rows) => {
    const data = rows.slice(1); // Exclude the header row

    const values = data.map((row) => [
      row[0],
      row[1],
      row[2], // New column for action
    ]);

    const insertQuery =
      'INSERT INTO style (name, code) VALUES ?';
    const deleteQuery =
      'DELETE FROM style WHERE code IN (?)';

      const insertValues = values
      .filter((row) => row[2] === 'add')
      .map((row) => [row[0], row[1]]); // Only include the first two columns
    
      const deleteValues = values
      .filter((row) => row[2] === 'delete')
      .map((row) => row[1]);

    if (insertValues.length > 0) {
      pool.query(insertQuery, [insertValues], (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Insert query executed successfully.');
          console.log(result);
        }
      });
    }

    if (deleteValues.length > 0) {
      pool.query(deleteQuery, [deleteValues], (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Delete query executed successfully.');
          console.log(result);
        }
      });
    }
  });
}








router.post('/update/order',upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 8 } ,  { name: 'image1', maxCount: 8 }  ]),(req,res)=>{
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

   importExcelData2MySQLOrder('public/images/' + req.files.image[0].filename);


   res.redirect('/Admin/dashboard/store-listing/excel')

//  console.log(req.body)
//    pool.query(`insert into ${req.params.name} set ?`,body,(err,result)=>{
//        err ? console.log(err) : res.json({msg : 'success'})
//    })
}


  
 
})





function importExcelData2MySQLOrder(filePath) {
  let query = 'INSERT INTO client_prices (client_code, style_code, price) VALUES ?';

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

  readXlsxFile(filePath)
    .then((rows) => {
      console.log('rows', rows.length);

      for (let i = 1; i < rows.length; i++) {
        const orderid = rows[i][0];
        const bookingid = rows[i][1];
        const status = rows[i][2];

        pool.query(
          `Update booking set status = '${status}' , updated_date = '${today}' where orderid = '${orderid}' AND bookingid = '${bookingid}'`,
          (err, result) => {
            if (err) {
              console.error(err);
            } else {

              pool.query(`select * from booking where orderid = '${orderid}' and status = 'pending'`,(err,result)=>{
                if(err) throw err;
                else if(result[0]){
                  console.log(result)
                }
                else{
                  pool.query(`Update final_booking set status = '${status}' ,updated_date = '${today}' where orderid = '${orderid}'`,(err,result)=>{
                    if(err) console.log(err)
                    else {
                      console.log(result);
                    
                }
              })

            } 
              })


            }
          }
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
}



module.exports = router;
