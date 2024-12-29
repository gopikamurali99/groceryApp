import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
        itemName: {
            type:String,
            required:true,
            unique:true,
            trim:true,
        } ,
        price:{
            type:Number,
            required:true,
            min:[0,'price cannot be negative'],
        }
});

const CategorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true,
        enum:['Kitchen','beverages','fruits','other'],
    },
    items:[ItemSchema],
});

const Category = mongoose.model('Category',CategorySchema);

export default Category