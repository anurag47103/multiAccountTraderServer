import sequelize from "../sequelize";
import User from "./User";
import UpstoxUser from "./UpstoxUser";
import Watchlist from "./Watchlist";

export const syncModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        User.hasMany(UpstoxUser, {foreignKey: 'user_id'});
        UpstoxUser.belongsTo(User, { foreignKey: 'user_id' });
        User.hasMany(Watchlist, { foreignKey: 'user_id' });
        Watchlist.belongsTo(User, { foreignKey: 'user_id' });

        await sequelize.sync({ force: false, alter: true });
        console.log('All tables were created or updated');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
