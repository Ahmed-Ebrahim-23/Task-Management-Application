const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma')

const register = async (req,res) => {
    try {
        const {name , email, password} = req.body;

        // check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });
        
        if(existingUser){
            return  res.status(400).json({
                status: "fail",
                data: null,
                message: "User already exists",

            });
        }

        // hash password
        hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            status: "success",
            data: {
                userId: newUser.id,
                name: newUser.name,
                email: newUser.email
            },
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        console.error(error.message);
    }
}

const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        
        const user = await prisma.user.findUnique({
            where: {email}
        });
        if(!user){
            return res.status(400).json({
                status: "fail",
                data: null,
                message: "Invalid email or password"
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                status: "fail",
                data: null,
                message: "Invalid email or password"
            });
        }
        
        const token = jwt.sign(
            {userId: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.status(200).json({
            status: "success",
            data: {
                token
            },
            message: "Login successful"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            data: null,
            message: "Internal Server Error"
        });
        console.error(error.message);
    }
}

module.exports = {
    register,
    login
}