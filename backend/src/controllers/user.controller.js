const prisma = require('../config/prisma');

const getUserById = async (req, res) => {
    try {
        const userId = req.currentUser;
        
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                data: null,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: user,
            message: "User retrieved successfully"
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

const deleteUserById = async (req, res) => {
    try {
        const userId = req.currentUser;
        
        const user = await prisma.user.delete({
            where: { id: parseInt(userId) }
        });
        
        if (!user) {
            return res.status(404).json({
                status: "fail",
                data: null,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: null,
            message: "User deleted successfully"
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
    getUserById,
    deleteUserById
}