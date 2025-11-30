// models/Sala.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Sala = sequelize.define('Sala', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('livre', 'ocupado'),
    defaultValue: 'livre'
  }
}, {
  tableName: 'Sala',
  timestamps: false
});



module.exports = Sala;
