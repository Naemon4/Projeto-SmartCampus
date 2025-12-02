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

module.exports = Andar