<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Sala = require('./Sala');

const Andar = sequelize.define('Andar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Andar',
  timestamps: false
});

// Relacionamentos
Andar.hasMany(Sala, { foreignKey: 'andarId' });
Sala.belongsTo(Andar, { foreignKey: 'andarId' });

=======
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Sala = require('./Sala');

const Andar = sequelize.define('Andar', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Andar',
  timestamps: false
});

// Relacionamentos
Andar.hasMany(Sala, { foreignKey: 'andarId' });
Sala.belongsTo(Andar, { foreignKey: 'andarId' });

>>>>>>> 395612d4beef078f57c226633a07f533dcf18e47
module.exports = Andar