import User from "./User";
import UpstoxUser from "./UpstoxUser";
import Watchlist from "./Watchlist";

import { getSequelizeInstance } from '../sequelize'

const sequelize = getSequelizeInstance();

if(!sequelize){
    console.error('Sequelize instance is empty in watchlist.')
}

export const syncModels = async () => {
    try {
        await sequelize.authenticate();
        console.log('syncing models....');

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
