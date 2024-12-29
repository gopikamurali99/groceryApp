import User from '../models/customer.js'
import Item from '../models/grocery.js'
import Otp from '../models/otpSchema.js'
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



//sign-up using email and password
export const SignUp = async(req,res) => {
      
    const {name,email,password} = req.body;

    console.log(req.body.password); 


    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:'user already exist'});
        }

        const saltRound = 10
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
//controller to send otp
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
            console.log('Updating user verification:', user);
            user.verified = true;
            await user.save();
        }
        
        res.status(200).json({message:"otp verified successfully.User is now verified"})
    }
    catch(error){
        console.error('Error verifying OTP:', error);
        res.status(500).json({message:'Error verifying otp'})
    }
}
//google authentication
export const googleAuth = async(req,res) =>{
    const {email,name}  = req.body;

    try {
        const user = await User.findOne({ email });

        if(user){
            return res.status(200).json({message:'Login successful',user});
        }

        user = new User({
            name,
            email,
            password:null, // no password required for google users
            verified:true, //google user considered verified automatically
        })

        await user.save();
        return res.status(201).json({message:'user created successfully',user})

        
    } catch (error) {
        
        console.error("Eroor during Google authentication",error);

        res.status(500).json({error:"Something went wrong during google authentication"})
    }
}

//login via email and password

export const login = async (req,res) =>{
    const {email,password} = req.body;

    try {

        let user  = await User.findOne({email});

        //checking user is existing or not 

        if(!user){
            return res.status(403).json({error : 'user not found'});

        }
        // checking email is verified or not 
        if(!user.verified){
            return res.status(403).json({error:'email is not verified please verify before logging in.'})
        }
        //comparing user entered password and existing password
         const validPassword = await bcrypt.compare(password,user.password);

        if(!validPassword){
            return res.status(400).json({error:'invalid email or password'})
        }
       //Generating token using jwt
       const token = jwt.sign(
        {id:user._id, email: user.email},
        process.env.JWT_TOKEN,
        {expiresIn:'1h'}
       )
       res.cookie('token',token,{
        httpOnly: true,
        maxAge:3600000,
       })

       res.status(200).json({message:"Logged in successfully!"})
        
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: "Server error" });
        
    }
};
