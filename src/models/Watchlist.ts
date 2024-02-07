import {Model, DataTypes} from 'sequelize';
import { getSequelizeInstance } from '../sequelize'

const sequelize = getSequelizeInstance();

if(!sequelize){
    console.error('Sequelize instance is empty in watchlist.')
}


class Watchlist extends Model {
    public id!: number;
    public instrument_key!: string;
    public user_id!: number; // Foreign key reference to User
}

Watchlist.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    instrument_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // This should match the table name for User
            key: 'id',
        },
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Watchlist',
});

export default Watchlist;
