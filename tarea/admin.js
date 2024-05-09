const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

// Antes de guardar el admin en la base de datos, hasheamos la contraseña
adminSchema.pre('save', async function(next) {
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Método para verificar si la contraseña es correcta
adminSchema.methods.isCorrectPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;