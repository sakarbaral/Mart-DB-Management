const express=require('express');
const app=express();
const mysql=require('mysql');
let ejs = require('ejs');
const bodyParser=require('body-parser');
const { query } = require('express');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// ---------------------------------------For SQL CONNECTIONS-------------------------------------
const connections= mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'Mart'
});

connections.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected");
    }
});
// ---------------------------------------END For SQL CONNECTIONS------------------------------------



app.get('/', function(req,res){
        res.sendFile(__dirname+'/main.html');

});


// -------------------------- START SUPPLIERS-------------------------------------
// ------------------------for showing in suppliers--------------------------------

app.get('/suppliers',function(req,res){
    
    connections.query("select * from supplier",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let supplier_rows=rows;
            res.render('suppliers',{supplier_rows:supplier_rows});
        }
      });

   
});
// ------------------------END for showing in suppliers--------------------------------

// ------------------------for delete in suppliers--------------------------------
app.post('/suppliers',function(req,res){
    let item=req.body.updateid;
    connections.query("delete from supplier where sup_id='"+item+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
            res.redirect("/suppliers");

        };
        
    };
      });
      
});

// ------------------------ END for delete in suppliers--------------------------------

// ------------------------for insert in suppliers--------------------------------
app.post('/suppliersins',function(req,res){
    let id=req.body.insert_supp_id;
    let name=req.body.insert_supp_name;
    let add=req.body.insert_supp_add;
    let cno=req.body.insert_supp_cno;

    connections.query("insert into supplier values('" +id+ "' ,'" +name+ "','"+add+"',"+cno+");",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully inserted");
            res.redirect("/suppliers")

        }
      });
});


// ------------------------END for insert in suppliers--------------------------------

// ------------------------for update in suppliers--------------------------------
app.post('/suppliersupd',function(req,res){
    let{update_supp_id,update_supp_name,update_supp_add,update_supp_cno}=req.body;

    connections.query("update supplier set name=?,address=?,contact_no="+update_supp_cno+" where sup_id=?" ,[update_supp_name,update_supp_add,update_supp_id],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
            res.redirect("/suppliers")

        }
      });
});

// ------------------------END for update in suppliers--------------------------------

// ------------------------for search in suppliers--------------------------------
app.post('/suppsearch',function(req,res){
    let{search,consearch}=req.body;

    if(search){
    connections.query("select * from supplier where sup_id=? OR name=? OR  address=?;",[search,search,search],function (err,rows,fields) {
        if(err){
            console.log(error);
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("successful search");
            let supplier_rows=rows;
            if(supplier_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('suppliers',{supplier_rows:supplier_rows});
        }
    }
      });
    }
    else{
        connections.query("select * from supplier where contact_no="+consearch,function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                let supplier_rows=rows;
                if(supplier_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('suppliers',{supplier_rows:supplier_rows})
                };
            }
          });
        
    }
        
});

// ------------------------END for search in suppliers--------------------------------

// --------------------------------- ENDD SUPPLIERS------------------------------------------------------------



//-------------------------------------START ITEMS----------------------------------------------------------

//-------------------------------------for showing in items--------------------------------------------------
app.get('/items',function(req,res){
    
    connections.query("select * from items",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows in items");
            let item_rows=rows;
            res.render('items',{item_rows:item_rows});
        }
      });

   
});
// ------------------------END for showing in items--------------------------------

// ------------------------for delete in items--------------------------------
app.post('/items',function(req,res){
    let item=req.body.updateid;
    connections.query("delete from items where it_id='"+item+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            
            console.log(rows);

            if(rows.affectedRows==0){
            console.log(rows);
            res.send("Not found, couldn't delete");}
        
        else{
            console.log("Successfully Deleted")
        res.redirect("/items");
        }
    }
    
      });
      
});

// ------------------------ END for delete in items--------------------------------

// ------------------------for insert in items--------------------------------
app.post('/itemsins',function(req,res){
    let{insert_item_id,insert_item_name,insert_item_price,insert_item_supp}=req.body;

    connections.query("insert into items values('" +insert_item_id+ "' ,'" +insert_item_name+ "',"+insert_item_price+",'"+insert_item_supp+"');",function (err,rows,fields) {

    // connections.query("insert into items values(?,?,",[insert_item_id,insert_item_name],+insert_item_price+",'"+insert_item_supp+"');",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully inserted items");
           
        }
      });
      res.redirect("/items");
});


// ------------------------END for insert in items--------------------------------

// ------------------------for update in items--------------------------------
app.post('/itemsupd',function(req,res){
    let{update_item_id,update_item_name,update_item_price,update_item_supp}=req.body;

    connections.query("update items set it_name=?,sup_id=?,price='"+update_item_price+"' where it_id=?" ,[update_item_name,update_item_supp,update_item_id],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
         
        }
      });
      res.redirect("/items")
});

// ------------------------END for update in items--------------------------------

// ------------------------for search in items--------------------------------
app.post('/itemsearch',function(req,res){
    let{search}=req.body;

    if(search){
    connections.query("select * from items where it_id=? OR it_name=? OR  sup_id=?;",[search,search,search],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully searched ");        
            console.log(rows);
            let item_rows=rows;
            if(item_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('items',{item_rows:item_rows});
        }
    }
      });
    }
    
        
});

// ------------------------END for search in items------------------------------

//------------------------------END ITEMS------------------------------------

//---------------------START BRANCH-------------------------------
//-------------------------------------for showing in branches--------------------------------------------------
app.get('/branch',function(req,res){
    
    connections.query("select * from branch",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows in items");
            let branch_rows=rows;
            res.render('branches',{branch_rows:branch_rows});
        }
      });

   
});
// ------------------------END for showing in branches--------------------------------

// ------------------------for delete in branches--------------------------------
app.post('/branch',function(req,res){
    let branch=req.body.updateid;
    connections.query("delete from branch where br_id='"+branch+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            
            console.log(rows);

            if(rows.affectedRows==0){
            console.log(rows);
            res.send("Not found, couldn't delete");}
        
        else{
            console.log("Successfully Deleted")
        res.redirect("/branch");
        }
    }
    
      });
      
});

// ------------------------ END for delete in branches--------------------------------

// ------------------------for insert in branches--------------------------------
app.post('/branchins',function(req,res){
    let{insert_branch_id,insert_branch_aareacode,insert_branch_ppno,insert_branch_manager}=req.body;

    connections.query("insert into branch values('" +insert_branch_id+ "' ,'" +insert_branch_aareacode+ "',"+insert_branch_ppno+",'"+insert_branch_manager+"');",function (err,rows,fields) {

    // connections.query("insert into items values(?,?,",[insert_item_id,insert_item_name],+insert_item_price+",'"+insert_item_supp+"');",function (err,rows,fields) {
        if(err){
            console.log(err);
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully inserted items");
            res.redirect("/branch");

           
        }
      });
});


// ------------------------END for insert in branch--------------------------------

// ------------------------for update in branch--------------------------------
app.post('/branchupd',function(req,res){
    let{update_branch_id,update_branch_areacode,update_branch_pno,update_branch_manager}=req.body;

    connections.query("update branch set manager=?,area_code=?,phone_no='"+update_branch_pno+"' where br_id=?" ,[update_branch_manager,update_branch_areacode,update_branch_id],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
         
        }
      });
      res.redirect("/branch")
});

// ------------------------END for update in branch--------------------------------

// ------------------------for search in branch--------------------------------
app.post('/branchsearch',function(req,res){
    let{search,consearch}=req.body;

    if(search){
    connections.query("select * from branch where br_id=? OR area_code=? OR  manager=?;",[search,search,search],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully searched ");        
            console.log(rows);
            let branch_rows=rows;
            if(branch_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('branches',{branch_rows:branch_rows});
        }
    }
      });
    }
    else if(consearch){
        connections.query("select * from branch where phone_no="+consearch+";",function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("Successfully searched ");        
                console.log(rows);
                let branch_rows=rows;
                if(branch_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('branches',{branch_rows:branch_rows});
            }
        }
          });

    }
    
        
});

// ------------------------END for search in branch------------------------------

//------------------------END BRANCH----------------------------------------


//---------------------START Members-------------------------------
//-------------------------------------for showing in Members--------------------------------------------------
app.get('/members',function(req,res){
    
    connections.query("select * from members",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows in members");
            let members_rows=rows;
            res.render('members',{members_rows:members_rows});

            }

      });

   
});
// ------------------------END for showing in Members--------------------------------

// ------------------------for delete in Members--------------------------------
app.post('/members',function(req,res){
    let member=req.body.updateid;
    connections.query("delete from members where mem_id='"+member+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            
            console.log(rows);

            if(rows.affectedRows==0){
            console.log(rows);
            res.send("Not found, couldn't delete");}
        
        else{
            console.log("Successfully Deleted")
        res.redirect("/members");
        }
    }
    
      });
      
});

// ------------------------ END for delete in Members--------------------------------

// ------------------------for insert in Members--------------------------------
app.post('/membersins',function(req,res){
    let{insert_member_id,insert_name,insert_address,insert_pno,insert_dateofmembership}=req.body;

    connections.query("insert into members values('" +insert_member_id+ "','" +insert_name+ "','"+insert_address+"',"+insert_pno+",'"+insert_dateofmembership+"');",function (err,rows,fields) {

    // connections.query("insert into items values(?,?,",[insert_item_id,insert_item_name],+insert_item_price+",'"+insert_item_supp+"');",function (err,rows,fields) {
        if(err){
            console.log(err);
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully inserted items");
            res.redirect("/members");

           
        }
      });
});


// ------------------------END for insert in Members--------------------------------

// ------------------------for update in Members--------------------------------
app.post('/membersupd',function(req,res){
    let{upd_member_id,upd_name,upd_address,upd_pno}=req.body;

    connections.query("update members set name=?,address=?,ph_no="+upd_pno+" where mem_id=?" ,[upd_name,upd_address,upd_member_id],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
            res.redirect("/members")

        }
      });
});

// ------------------------END for update in Members--------------------------------

// ------------------------for search in Members--------------------------------
app.post('/memsearch',function(req,res){
    let{search,consearch,datesearch}=req.body;

    if(search){
    connections.query("select * from members where mem_id=? OR address=? OR  name=?;",[search,search,search],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully searched ");        
            console.log(rows);
            let members_rows=rows;
            if(members_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('members',{members_rows:members_rows});
        }
    }
      });
    }
    else if(consearch){
        connections.query("select * from members where ph_no="+consearch,function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                let members_rows=rows;
                if(members_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('members',{members_rows:members_rows})
                };
            }
          });
        
    }
    else{
        connections.query("select * from members where dateofmembership='"+datesearch+"';",function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                let members_rows=rows;
                if(members_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('members',{members_rows:members_rows})
                };
            }
          });

    }
    
        
});

// ------------------------END for search in Members------------------------------

//------------------------END MEMBERS----------------------------------------

//-----------------------START VEHICLES---------------------------------

//-------------------------------------for showing in vehicles--------------------------------------------------
app.get('/vehicles',function(req,res){
    
    connections.query("select * from vehicles",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows in items");
            let vehicles_rows=rows;
            res.render('vehicles',{vehicles_rows:vehicles_rows});
        }
      });

   
});
// ------------------------END for showing in vehicles--------------------------------

// ------------------------for delete in vehicles--------------------------------
app.post('/vehicles',function(req,res){
    let vid=req.body.updateid;
    connections.query("delete from vehicles where v_id='"+vid+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            
            console.log(rows);

            if(rows.affectedRows==0){
            console.log(rows);
            res.send("Not found, couldn't delete");}
        
        else{
            console.log("Successfully Deleted")
        res.redirect("/vehicles");
        }
    }
    
      });
      
});

// ------------------------ END for delete in vehicles--------------------------------

// ------------------------for insert in vehicles--------------------------------
app.post('/vehins',function(req,res){
    let{insert_v_id,insert_v_type,insert_vno_plate,insert_vbr_id,insert_vcolor}=req.body;

    connections.query("insert into vehicles values('" +insert_v_id+ "' ,'" +insert_v_type+ "','"+insert_vno_plate+"','"+insert_vbr_id+"','"+insert_vcolor+"');",function (err,rows,fields) {

    // connections.query("insert into items values(?,?,",[insert_item_id,insert_item_name],+insert_item_price+",'"+insert_item_supp+"');",function (err,rows,fields) {
        if(err){
            console.log(err);
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully inserted items");
            res.redirect("/vehicles");

           
        }
      });
});


// ------------------------END for insert in vehicles--------------------------------

// ------------------------for update in vehicles--------------------------------
app.post('/vehupd',function(req,res){
    
    let{update_v_id,update_v_type,update_vno_plate,update_vbr_id,update_vcolor}=req.body;

    connections.query("update vehicles set color=?,v_type=?,no_plate=?, br_id=? where v_id=?" ,[update_vcolor,update_v_type,update_vno_plate,update_vbr_id,update_v_id],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
         
        }
      });
      res.redirect("/vehicles")
});

// ------------------------END for update in vehicles--------------------------------

// ------------------------for search in vehicles--------------------------------
app.post('/vehsearch',function(req,res){
    let{search,consearch}=req.body;
    

    connections.query("select * from vehicles where v_id=? OR v_type=? OR no_plate=? or color=? or br_id=? ;",[search,search,search,search,search],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully searched ");        
            console.log(rows);
            let vehicles_rows=rows;
            if(vehicles_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('vehicles',{vehicles_rows:vehicles_rows});
        }
    }
      });
    
    
        
});

//--------------------------END search in VEHICLES------------

//--------------------------END VEHICLES--------------------------------------------------------------

//-----------------------------------START STOCKK-------------------------------
// ------------------------for showing in stock--------------------------------

app.get('/stock',function(req,res){
    
    connections.query("select * from stock",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let stock_rows=rows;
            res.render('stock',{stock_rows:stock_rows});
        }
      });

   
});
// ------------------------END for showing in stock--------------------------------

// ------------------------for delete in stock--------------------------------
app.post('/stock',function(req,res){
    let item=req.body.updateid;
    connections.query("delete from stock where it_id='"+item+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
        };
        res.redirect("/stock");
        
    };
      });
      
});

// ------------------------ END for delete in stock--------------------------------

// ------------------------for insert in stock--------------------------------
app.post('/stockins',function(req,res){
    let{insert_sit_id,insert_squan,insert_sexp,insert_spur}=req.body;


    connections.query("insert into stock values('" +insert_sit_id+ "' ," +insert_squan+ ",'"+insert_sexp+"','"+insert_spur+"');",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully inserted");
           
        }
      });
      res.redirect("/stock")
});


// ------------------------END for insert in stock--------------------------------

// ------------------------for update in stock--------------------------------
app.post('/stockupd',function(req,res){
    let{update_it_id,update_squantity}=req.body;

    connections.query("update stock set quantity=? where it_id=?" ,[update_squantity,update_it_id],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
         
        }
      });
      res.redirect("/stock")
});

// ------------------------END for update in stock--------------------------------

// ------------------------for search in stock--------------------------------
app.post('/stocksearch',function(req,res){
    let{search,searchde,searchdp}=req.body;

    if(search){
    connections.query("select * from stock where it_id=?",[search],function (err,rows,fields) {
        if(err){
            console.log(error);
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("successful search");
            let stock_rows=rows;
            if(stock_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('stock',{stock_rows:stock_rows});
        }
    }
      });
    }
    else if(searchde){
        connections.query("select * from stock where exp_date=?",[searchde],function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                console.log(rows);
                let stock_rows=rows;
                if(stock_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('stock',{stock_rows:stock_rows})
                };
            }
          });
        
    }

    else if(searchdp){
        connections.query("select * from stock where date_of_purchase=?",[searchdp],function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                console.log(rows);
                let stock_rows=rows;
                if(stock_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('stock',{stock_rows:stock_rows})
                };
            }
          });
        
    }
        
});

// ------------------------END for search in stock--------------------------------

// --------------------------------- ENDD STOCK---------------------------------------------------------

//-------------------------------------START STAFF----------------------------------------

// ------------------------for showing in staff--------------------------------

app.get('/staff',function(req,res){
    
    connections.query("select * from staff",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let staff_rows=rows;
            res.render('staff',{staff_rows:staff_rows});
        }
      });

   
});
// ------------------------END for showing in staff--------------------------------

// ------------------------for delete in staff--------------------------------
app.post('/staff',function(req,res){
    let staff=req.body.updateid;
    connections.query("delete from staff where STID='"+staff+"'",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
        };
        res.redirect("/staff");
        
    };
      });
      
});

// ------------------------ END for delete in staff--------------------------------

// ------------------------for insert in staff--------------------------------
app.post('/stins',function(req,res){
    let{insert_st_id,insert_name,insert_ph_no,insert_address,insert_br_id,insert_designation,insert_email,insert_accno,insert_gender}=req.body;

    connections.query("insert into staff  VALUES (?,?,"+insert_ph_no+",?,?,?,?,"+insert_accno+",?)",[insert_st_id,insert_name,insert_address,insert_br_id,insert_designation,insert_email,insert_gender],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);    
        }
        else{
            console.log(this.sql);
            console.log("Successfully inserted");
            res.redirect("/staff");

        }
      });
});


// ------------------------END for insert in staff--------------------------------

// ------------------------for update in staff--------------------------------
app.post('/staffupd',function(req,res){
    let{insert_st_id,insert_name,insert_ph_no,insert_address,insert_br_id,insert_designation,insert_email,insert_accno,insert_gender}=req.body;

    connections.query("update staff set name=?,address=?,br_id=?,ph_no="+insert_ph_no+",designation=?,email=?,gender=?,accno="+insert_accno+" where STID=?;",[insert_name,insert_address,insert_br_id,insert_designation,insert_email,insert_gender,insert_st_id],function (err,rows,fields) {
        if(err){
            console.log(this.sql);

            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log(this.sql);

            console.log("Successfully updated");
            res.redirect("/staff")
        }
      });
});

// ------------------------END for update in staff--------------------------------

// ------------------------for search in staff--------------------------------
app.post('/stsearch',function(req,res){
    let{search,searchnum}=req.body;

    if(search){
    connections.query("select * from staff where name=? or address=? or br_id=? or designation=? or email=? or gender=?or stid=?",[search,search,search,search,search,search,search],function (err,rows,fields) {
        if(err){
            console.log(err);
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("successful search");
            let staff_rows=rows;
            if(staff_rows.length==0){
                res.send("Not found");
            }
            else{
            res.render('staff',{staff_rows:staff_rows});
        }
    }
      });
    }
    else if(searchnum){
        connections.query("select * from staff where accno="+searchnum+" or ph_no="+searchnum+";",function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                console.log(rows);
                let staff_rows=rows;
                if(staff_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('staff',{staff_rows:staff_rows})
                };
            }
          });
        
    }

    else if(searchdp){
        connections.query("select * from stock where date_of_purchase=?",[searchdp],function (err,rows,fields) {
            if(err){
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                console.log(rows);
                let stock_rows=rows;
                if(stock_rows.length==0){
                    res.send("Data Not found");
                }
                else{
                    res.render('stock',{stock_rows:stock_rows})
                };
            }
          });
        
    }
        
});

// ------------------------END for search in staff--------------------------------

// --------------------------------- ENDD staff---------------------------------------------------------

//------------------------------START REVENUE----------------------------------------------

// ------------------------for showing in revenue--------------------------------

app.get('/revenue',function(req,res){
    
    connections.query("select * from revenue",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let rev_rows=rows;
            res.render('revenue',{rev_rows:rev_rows});
        }
      });

   
});
// ------------------------END for showing in revenue--------------------------------

// ------------------------for delete in revenue--------------------------------
app.post('/revenue',function(req,res){
    let{brid,revdate}=req.body;
    connections.query("delete from revenue where br_id=? and date1=?",[brid,revdate],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
        };
        res.redirect("/revenue");
        
    };
      });
      
});

// ------------------------ END for delete in revenue--------------------------------

// ------------------------for insert in revenue--------------------------------
app.post('/revins',function(req,res){
    let{insert_brid,insert_revdate,insert_revamount}=req.body;

    connections.query("insert into revenue VALUES(?,?,"+insert_revamount+");",[insert_brid,insert_revdate],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);    
        }
        else{
            console.log(this.sql);
            console.log("Successfully inserted");
            res.redirect("/revenue");

        }
      });
});


// ------------------------END for insert in revenue--------------------------------

// ------------------------for update in revenue--------------------------------
app.post('/revupd',function(req,res){
    let{update_br_id,update_date1,update_amount}=req.body;

    connections.query("update revenue set amount="+update_amount+" where br_id=? and date1=? " ,[update_br_id,update_date1],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
         
        }
      });
      res.redirect("/revenue")
});

// ------------------------END for update in revenue--------------------------------

// ------------------------for search in revenue--------------------------------
app.post('/revsearch',function(req,res){
    let{search,searchd}=req.body;

    if(searchd && search){
        connections.query("select * from revenue where br_id=? and date1=?",[search,searchd],function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                let rev_rows=rows;
                if(rev_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('revenue',{rev_rows:rev_rows});
            }
        }
          });
        }

    else{
        connections.query("select * from revenue where date1=?",[searchd],function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log("successful search");
                let rev_rows=rows;
                if(rev_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('revenue',{rev_rows:rev_rows});
            }
        }
          });
        }
  
        
});

// ------------------------END for search in revenue--------------------------------

//---------------------------END REVENUE-------------------------------------------

//---------------------START TRANSACTIONS-----------------------

// ------------------------for showing in TRANSACTIONS--------------------------------

app.get('/transactions',function(req,res){
    
    connections.query("select * from transactions",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let trans_rows=rows;
            res.render('transactions',{trans_rows:trans_rows});
        }
      });

   
});
// ------------------------END for showing in TRANSACTIONS--------------------------------

// ------------------------for delete in TRANSACTIONS--------------------------------
app.post('/transactions',function(req,res){
    let {tid}=req.body;
    connections.query("delete from transactions where t_id=?",[tid],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
            res.redirect("/transactions");
        };
        
        
    };
      });
      
});

// ------------------------ END for delete in TRANSACTIONS--------------------------------

// ------------------------for insert in TRANSACTIONS--------------------------------
app.post('/tranins',function(req,res){
    let{insert_trid,insert_sid,insert_desc,insert_bname,insert_staffid,insert_branchid}=req.body;

    connections.query("insert into transactions VALUES(?,?,?,?,?,?);",[insert_trid,insert_sid,insert_desc,insert_bname,insert_staffid,insert_branchid],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);    
        }
        else{
            console.log("Successfully inserted");
            res.redirect("/transactions");

        }
      });
});


// ------------------------END for insert in TRANSACTIONS--------------------------------


// ------------------------for search in TRANSACTIONS--------------------------------
app.post('/transearch',function(req,res){
    let{search}=req.body;
        connections.query("select * from transactions where t_id=? or sup_id=? or description=? or board_name=? or staff_id=? or branch_id=?",[search,search,search,search,search,search],function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log(this.sql);
                console.log("successful search");
                let trans_rows=rows;
                if(trans_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('transactions',{trans_rows:trans_rows});
            }
        }
          });

  
        
});

// ------------------------END for search in TRANSACTIONS-------------------------------------

//--------------------------END TRANSACTIONS------------------------------------

//------------------------START INVENTORY-------------------------------------------

// ------------------------for showing in INVENTORY--------------------------------

app.get('/inventory',function(req,res){
    
    connections.query("select * from inventory",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let inv_rows=rows;
            res.render('inventory',{inv_rows:inv_rows});
        }
      });

   
});
// ------------------------END for showing in INVENTORY--------------------------------

// ------------------------for delete in INVENTORY--------------------------------
app.post('/inventory',function(req,res){
    let {brid,name}=req.body;
    connections.query("delete from inventory where branch_id=? and name=?",[brid,name],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
            res.redirect("/inventory");
        };
        
        
    };
      });
      
});

// ------------------------ END for delete in INVENTORY--------------------------------

// ------------------------for insert in INVENTORY--------------------------------
app.post('/invins',function(req,res){
    let{insert_nam,insert_quan,insert_price,insert_cond,insert_brid}=req.body;

    connections.query("insert into inventory VALUES(?,"+insert_quan+","+insert_price+",?,?);",[insert_nam,insert_cond,insert_brid],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);    
        }
        else{
            console.log("Successfully inserted");
            res.redirect("/inventory");

        }
      });
});


// ------------------------END for insert in INVENTORY--------------------------------

//-------------------------FOR update in INVENTORY----------------------------------------

app.post('/invupd',function(req,res){
    let{update_cond,update_brid,update_name}=req.body;

    connections.query("update inventory set condition1=? where branch_id=? and name=? " ,[update_cond,update_brid,update_name],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
            res.redirect("/inventory")

        }
      });
});


// ------------------------END for UPDATE in INVENTORY--------------------------------


// ------------------------for search in INVENTORY--------------------------------
app.post('/invsearch',function(req,res){
    let{search}=req.body;
        connections.query("select * from inventory where name=? or branch_id=?",[search,search],function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log(this.sql);
                console.log("successful search");
                let inv_rows=rows;
                if(inv_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('inventory',{inv_rows:inv_rows});
            }
        }
          });

  
        
});

// ------------------------END for search in INVENTORY-------------------------------------

// --------------------------END INVENTORY----------------------------------

//---------------------------START BOARD MEMBERS----------------------
// ------------------------for showing in BOARD MEMBERS--------------------------------

app.get('/boardmem',function(req,res){
    
    connections.query("select * from board_members",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let board_rows=rows;
            res.render('boardmem',{board_rows:board_rows});
        }
      });

   
});
// ------------------------END for showing in BOARD MEMBERS--------------------------------

// ------------------------for delete in BOARD MEMBERS--------------------------------
app.post('/boardmem',function(req,res){
    let {name}=req.body;
    connections.query("delete from board_members where name=?",[name],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
            res.redirect("/boardmem");
        };
        
        
    };
      });
      
});

// ------------------------ END for delete in BOARD MEMBERS--------------------------------

// ------------------------for insert in BOARD MEMBERS--------------------------------
app.post('/boardins',function(req,res){
    let{insert_nam,insert_add,insert_cont,insert_email}=req.body;

    connections.query("insert into board_members VALUES(?,?,"+insert_cont+",?);",[insert_nam,insert_add,insert_email],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);    
        }
        else{
            console.log("Successfully inserted");
            res.redirect("/boardmem");

        }
      });
});


// ------------------------END for insert in BOARD MEMBERS--------------------------------

//-------------------------FOR update in BOARD MEMBERS----------------------------------------

app.post('/boardupd',function(req,res){
    let{update_add,update_cont,update_name,update_mail}=req.body;

    connections.query("update board_members set address=?, contact= "+update_cont+",email=? where name=?" ,[update_add,update_mail,update_name],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
            res.redirect("/boardmem")

        }
      });
});


// ------------------------END for UPDATE in BOARD MEMBERS--------------------------------


// ------------------------for search in BOARD MEMBERS--------------------------------
app.post('/boardsearch',function(req,res){
    let{search,consearch}=req.body;
        if(search)
        {connections.query("select * from board_members where name=? or address=? or email=?",[search,search,search],function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log(this.sql);
                console.log("successful search");
                let board_rows=rows;
                if(board_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('boardmem',{board_rows:board_rows});
            }
        }
          });
        }

          else if(consearch){
              connections.query("select * from board_members where contact="+consearch+";",function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log(this.sql);
                console.log("successful search");
                let board_rows=rows;
                if(board_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('boardmem',{board_rows:board_rows});
            }
        }
          });
        }

  
        
});

// ------------------------END for search in BOARD MEMBERS-------------------------------------

// --------------------------END BOARD MEMBERS----------------------------------


//----------------------------START BRANCH AVERAGE---------------------------------------------

// ------------------------for showing in BRANCH AVERAGE--------------------------------

app.get('/bravg',function(req,res){
    
    connections.query("select * from branch_avg",function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfuly displayed all rows");
            let bavg_rows=rows;
            res.render('branchavg',{bavg_rows:bavg_rows});
        }
      });

   
});
// ------------------------END for showing in BRANCH AVERAGE--------------------------------

// ------------------------for delete in BRANCH AVERAGE--------------------------------
app.post('/bravg',function(req,res){
    let {brid}=req.body;
    connections.query("delete from branch_avg where br_id=?",[brid],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            if(rows.affectedRows==0){
                res.send("Not found, couldn't delete");
            }
            else{
            console.log("Successfully Deleted");
            res.redirect("/bravg");
        };
        
        
    };
      });
      
});

// ------------------------ END for delete in BRANCH AVERAGE--------------------------------

// ------------------------for insert in BRANCH AVERAGE--------------------------------
app.post('/bravins',function(req,res){
    let{insert_brid,insert_avg}=req.body;

    connections.query("insert into branch_avg VALUES(?,"+insert_avg+");",[insert_brid],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);    
        }
        else{
            console.log("Successfully inserted");
            res.redirect("/bravg");

        }
      });
});


// ------------------------END for insert in BRANCH AVERAGE--------------------------------

//-------------------------FOR update in BRANCH AVERAGE----------------------------------------

app.post('/bravgupd',function(req,res){
    let{update_brid,update_avg}=req.body;

    connections.query("update branch_avg set avg="+update_avg+" where br_id=?;",[update_brid],function (err,rows,fields) {
        if(err){
            res.send("ERROR:"+  err.sqlMessage);
        }
        else{
            console.log("Successfully updated");
            res.redirect("/bravg")

        }
      });
});


// ------------------------END for UPDATE in BRANCH AVERAGE--------------------------------


// ------------------------for search in BRANCH AVERAGE--------------------------------
app.post('/bravgsearch',function(req,res){
    let{search}=req.body;
        connections.query("select * from branch_avg where br_id=?",[search],function (err,rows,fields) {
            if(err){
                console.log(err);
                res.send("ERROR:"+  err.sqlMessage);
            }
            else{
                console.log(this.sql);
                console.log("successful search");
                let bavg_rows=rows;
                if(bavg_rows.length==0){
                    res.send("Not found");
                }
                else{
                res.render('branchavg',{bavg_rows:bavg_rows});
            }
        }
          });
        
});

// ------------------------END for search in BRANCH AVERAGE-------------------------------------

//--------------------------END BRANCH AVERAGE---------------------------------------------------







app.listen(3000,function () {
    console.log("Server started on port 3000");
});