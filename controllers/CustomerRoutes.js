import User from '../models/customer.js'
import Item from '../models/grocery.js'
import Otp from '../models/otpSchema.js'
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'

export const SignUp = async(req,res) => {
      
    const {name,email,password} = req.body;

    console.log(req.body.password); // Check if password is coming as expected


    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:'user already exist'});
        }

        const saltRound =10
        const hashedPassword = await bcrypt.hash(password,saltRound)
        console.log(hashedPassword)

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            verified:false,
        })
        await newUser.save()
        res.status(201).json({message:'User created successfully. Please verify your email'})
    }

    catch(error){
       res.status(500).json({error:'Error creating user'})
       console.log(error)
    }
}

export const sendOtp = async (req,res) =>{
    const {email} = req.body;

    try{
        const otp = Math.floor(10000+Math.random()*900000).toString()
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp,saltRounds);

        const expiresAt = new Date(Date.now()+5*60*1000);
        await Otp.create({email,otp:hashedOtp,expiresAt});
        console.log(otp)
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:'voguenestapp@gmail.com',
                pass:'ipsb vwja hyhw yrmp'
            },
        })
        const mailOptions = {
            from:'voguenestapp@gmail.com',
            to:email,
            subject:'Your OTP Code',
            text:`Your OTP is: ${otp}. Otp is valid for 5 minutes`

        }
        await transporter.sendMail(mailOptions);
        res.status(200).json({message:'OTP sent to email'});
    }
    catch(error){
           res.status(500).json({error:'Error sending OTP'});
           console.log(error)
    }
};

//controller to verify the otp enterd by the user

export const verifyOtp = async (req,res) => {
    const {email, otp} = req.body;

    try{
        const otpRecord = await Otp.findOne({email});
        if(!otpRecord){
            return res.status(400).json({error:'otp not found'});
        }
        if(otpRecord.expiresAt< Date.now()){
            await Otp.deleteOne({email});
            return res.status(400).json({error:'OTP expired'})
        }
        const isValidOtp = bcrypt.compareSync(otp, otpRecord.otp);
        if(!isValidOtp){
            return res.status(400).json({error:'invalid otp'});
        }

        
        const user = await User.findOne({email});
        if(user){
            user.verified = true;
            await user.save();
        }
        await Otp.deleteOne({email})
        res.status(200).json({message:"otp verified successfully.Use is now verified"})
    }
    catch(error){
        res.status(500).json({message:'Error verifying otp'})
    }
}
