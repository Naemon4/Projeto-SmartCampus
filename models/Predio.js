const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Sala = require('./Sala');
const Andar = require('./Andar');

const Predio = sequelize.define('Predio', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Predio',
  timestamps: false
});

// Relacionamentos
Predio.hasMany(Andar, { foreignKey: 'predioId' });
Andar.belongsTo(Predio, { foreignKey: 'predioId' });

module.exports = Predio