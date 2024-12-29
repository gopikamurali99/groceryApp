import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },

    email:{
        type:String,
        unique:true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength:[8, 'Password must be at least 8 characters long'],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ],
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
       
    },
    verified: {
        type: Boolean,
        default: false,
    },
})

const User = mongoose.model('user',UserSchema)

export default User