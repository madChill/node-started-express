const Registration = require('./registrations.model');
const User = require('../users/user.model');
const { Op } = require('sequelize');

class RegistrationsRepository {
    async createBulk(data) {
        if (!data?.length) {
            throw new Error('Both student_ids and teacher_ids arrays are required');
        }
        return Registration.bulkCreate(data)
    }
    async findAll({ page = 1, limit = 10, status = null }) {
        const offset = (page - 1) * limit;
        const whereClause = status ? { status } : {};

        const { count, rows } = await Registration.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        return {
            data: rows,
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    /**
     * Find registration by ID
     * @param {number} id Registration ID
     * @returns {Promise<Object|null>} Registration or null if not found
     */
    async findById(id) {
        return Registration.findByPk(id, {
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
            ]
        });
    }

    // findExistingRegistrations
    async findExistingRegistrations(teacher_id, student_ids) {
        return Registration.findAll({
            where: {
                student_id: { [Op.in]: student_ids },
                teacher_id: teacher_id
            }
        });
    }
    async updateStatus(student, teacher, status) {
        return Registration.update({ status }, { where: { student_id: student, teacher_id: teacher } });
    }
}

module.exports = new RegistrationsRepository();