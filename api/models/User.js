var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        username: { type: 'string', unique: true, required: true },
        email: { type: 'string' },
    }
};

module.exports = User;