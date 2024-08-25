import express from 'express';
import connectToDatabase from '../db_connection.js'; // Import the connection module

const getConnection = async () => {
    try {
        const pool = await connectToDatabase();
        return pool;
    } catch (err) {
        console.error('Failed to establish a database connection:', err);
        throw err;
    }
};



const fileImagePath = "Upload_Images/";


const Registration = async(request, response)=>{

    try{
        const conn = await getConnection();
        const query_req = await conn.request();

        const name = request.body.name;
        const id = request.body.userId;
        const pass = request.body.password;
        const HWKey = null;
        const photo = request.file.filename;      //filename property from fileUploader to extract original file name.


        const sql = `INSERT INTO ToDo_20240815_UserInfo (Name,UserId,Password,UserPhoto)` + 
                    `VALUES('${name}','${id}','${pass}','${photo}')`;
        query_req.query(sql, (err,result)=>{
            if(err){
                console.log("Error:- "+err);
                return response.json({
                    "code":500,
                    "message":err.name
                });
            }else{
                return response.json({
                    "code":200,
                    "message":"Registration Successful!"
                });
            }
        });
    }catch(err){
        console.log(err);
        response.json({
            "code":500,
            "message":err.message
        });
    }
}



const Login =async(request,response)=>{

    try{
        const conn = await getConnection();
        const query_req = await conn.request();

        const userId=request.body.userId;
        const password=request.body.password;

        const sql="SELECT * FROM ToDo_20240815_UserInfo WHERE UserId=@uid AND Password=@pass";
        query_req.input("uid",userId.trim());
        query_req.input("pass",password.trim());

        query_req.query(sql,(error,result)=>{
            if(error){
                console.log(error);
                return response.json({
                    "code":500,
                    "message":error.name
                });
            }else{
                if(result.recordset.length > 0){
                    const user = result.recordset[0];

                    return response.json({
                        "code":200,
                        "message":"Login Successful!",
                        "Name":user.Name,
                        "Id":user.Id,
                        "UserPhoto":user.UserPhoto,
                        "filePath":fileImagePath
                    });
                }else{
                    return response.json({
                        "code":400,
                        "message":"Wrong Credentials!"
                    });
                }
            }
        });

    }catch(err){
        console.log(err);
        response.json({
            "code":500,
            "message":err.message
        });
    }
}


const PostData = async(request,response)=>{
    try{
        const conn = await getConnection();
        const query_req = await conn.request();

        const taskName = request.body.taskName;
        const payable = request.body.payable;
        const consider = request.body.consider;
        const slot = request.body.slots;

        const sql = "INSERT INTO ToDo_20240815_Data (TaskName,PayStatus,Consider,Slots) " +
                    "VALUES (@name, @pay, @consider, @slot)";

        query_req.input("name",taskName.trim());
        query_req.input("pay",payable.trim());
        query_req.input("consider",consider.trim());
        query_req.input("slot",slot.trim());

        query_req.query(sql, (error,result)=>{
            if(error){
                console.log(error);
                return response.json({
                    "code":500,
                    "message":error.name
                });
            }else{
                return response.json({
                    "code":200,
                    "message":"Data Posted Successfully!"
                });
            }
        });

    }catch(Exception){
        console.error(Exception);
        return response.json({
            "code":300,
            "message":Exception.message
        });
    }
}


const fetchData = async(request,response)=>{
    try{
        const conn = await getConnection();
        const query_req = await conn.request();

        const sql="SELECT * FROM ToDo_20240815_Data";
        const result = await query_req.query(sql);

        const fetchedData = result.recordset.map((row)=>({
            id: row.ID,            
            name: row.TaskName,     
            status: row.PayStatus,  
            consider: row.Consider, 
            slots: row.Slots 
        }));

        return response.json({
            "code": 200,
            "message": "Data fetched successfully!",
            "data": fetchedData
        })

    }catch(exception){
        console.error(exception);
        return response.json({
            "code":300,
            "message":exception.message
        });
    }
}


const deleteData = async(request,response)=>{
    try{
        const conn = await getConnection();
        const query_req = await conn.request();

        const Id = request.body.id;

        const sql = "DELETE FROM ToDo_20240815_Data WHERE ID=@Id";

        query_req.input("Id",Id);

        query_req.query(sql, (error,result)=>{
            if(error){
                console.log(error);
                return response.json({
                    "code":500,
                    "message":error.name
                });
            }else{
                return response.json({
                    "code":200,
                    "message":"Data Deleted Successfully!"
                });
            }
        });

    }catch(Exception){
        console.error(Exception);
        return response.json({
            "code":300,
            "message":Exception.message
        });
    }
}





export { 
    Registration,
    Login,
    PostData,
    fetchData,
    deleteData,
    fileImagePath
};