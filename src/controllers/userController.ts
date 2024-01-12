import User from "../models/User";
import UpstoxUser from "../models/UpstoxUser";


export async function createUser(name: string, email: string, password: string) : Promise<User> {
    try {
        const newUser = await User.create({
            name: name,
            email: email,
            password: password, // Make sure to hash the password first
        });
        console.log('User created:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = await User.findOne({
            where: { email: email },
        });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
    }
}

export async function findUserById(id: number) {
    try {
        const user: User = await User.findByPk(id);
        return user;
    } catch (error) {
        console.error('Error finding user by id: ', error);
    }

}

export async function updateUserEmail(userId: number, newEmail: string) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            user.email = newEmail;
            await user.save();
            console.log('User updated successfully');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

export async function deleteUser(userId: number) {
    try {
        await User.destroy({
            where: { id: userId },
        });
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

export async function getUserWithUpstoxUsers(userId: number) {
    try {
        const user = await User.findByPk(userId, {
            include: [{ model: UpstoxUser, as: 'upstoxUsers' }],
        });
        return user;
    } catch (error) {
        console.error('Error fetching user with Upstox users:', error);
    }
}

