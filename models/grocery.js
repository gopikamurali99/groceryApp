import mongoose from "mongoose";

const Grocery = new mongoose.Schema({
      itemName:{
        type:String,
        required:true,
      },
      quantity:{
        type:String,
        min:[1,'quantity must be at least 1'],
      },
      unit:{
        type:String,
        enum:['kg','liters','ml','pcs','pack'],
        default:'pcs',
      },
      purchased:{
        type:Boolean,
        default:false,

      },
})
//Grocerry List Schema

const GroceryListSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    title:{
        type:String,
        required:[true,'List title is required'],
        trim:true,
    } ,
    items:[Grocery] ,//Embedding grocery Items schema
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
          type:Date,
          default:Date.now,
    },
})

GroceryListSchema.pre('save',function(next){
    this.updatedAt = Date.now();
    next();
})


const GroceryList = mongoose.model('GroceryList',GroceryListSchema)

export default GroceryList