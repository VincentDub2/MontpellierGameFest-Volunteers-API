import prisma from "../prisma";


const userService = {
    getAllUsers: async () => {
        try {
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            throw new Error("Erreur lors de la recuperation des users");
        }
    },
    createUser: async () => {
        try {
            const user = await prisma.user.create({
                data: {
                    email:"test2",
                    name : "test2"
                },
            })
            return user;
        } catch (error) {
            console.log(error);
            throw new Error("Erreur lors de la creation du user"+error.message);
        }
    }
}

export default userService;