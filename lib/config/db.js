const { default: mongoose } = require("mongoose")

export const ConnectDB = async ()=>{
    await mongoose.connect('mongodb+srv://blog12:9UaHglzsTgl05ILU@blogs.9owsnzc.mongodb.net/blog-app')
    console.log('Db Conksdf')
}
// "mongodb+srv://blog12:<db_password>@blogs.9owsnzc.mongodb.net/blog-app"
// mongodb+srv://blog12:9UaHglzsTgl05ILU@blogs.9owsnzc.mongodb.net/?retryWrites=true&w=majority&appName=Blogs