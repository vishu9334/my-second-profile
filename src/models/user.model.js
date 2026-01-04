import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
const userSchema  = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['viewer','owner'],
        default:'viewer'
    }
},{timestamps:true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
        const saltRound =10
       this.password = await bcrypt.hash(this.password,saltRound)
    next()
})

export const User = mongoose.model("User",userSchema)