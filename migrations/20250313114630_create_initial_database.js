export function up(knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.string('name', 255).notNullable();
            table.string('phone_number', 255).unique().notNullable();
            table.enu('role', ['Supervisor', 'AEE']).notNullable();
            table.string('substation_name', 255).notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('meterData', function (table) {
            table.string('substation_name', 255).notNullable();
            table.string('feeder_name', 255).notNullable();
            table.string('meter_no', 255).primary().notNullable();
            table.enu('meter_type', ['InputFeeder', 'OutputFeeder']).notNullable();
            table.enu('meter_make', ['Secure', 'LT']).notNullable();
            table.enu('meter_status', ['on', 'off', 'not functional']).notNullable();
            table.json('location').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('attachments', function (table) {
            table.increments('id').primary();
            table.string('meter_no', 255).notNullable();
            table.binary('image').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            // Foreign Key
            table.foreign('meter_no').references('meter_no').inTable('meterData').onDelete('CASCADE');
        })
        .createTable("user_meters", function (table) {
            table.integer("user_id").unsigned().notNullable();
            table.string("meter_no").notNullable();
            table.timestamps(true, true);

            table.primary(["user_id", "meter_no"]); // Composite primary key

            table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
            table.foreign("meter_no").references("meter_no").inTable("meterData").onDelete("CASCADE");
        })
        .createTable('test_result', function (table) {
            table.increments('id').primary();
            table.string('meter_no', 255).notNullable();
            table.enu('test_result', ['pass', 'fail']).notNullable();
            table.text('logdata').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            // Foreign Key
            table.foreign('meter_no').references('meter_no').inTable('meterData').onDelete('CASCADE');
        })
        .then(() => {
            return knex.schema
                .raw('CREATE UNIQUE INDEX meterData_index_0 ON meterData (substation_name, feeder_name, meter_no)')
                .raw('CREATE UNIQUE INDEX user_meters_index_1 ON user_meters (user_id, meter_no)');
        });
};

export function down(knex) {
    return knex.schema
        .dropTableIfExists('test_result')
        .dropTableIfExists('user_meters')
        .dropTableIfExists('users')
        .dropTableIfExists('attachments')
        .dropTableIfExists('meterData');
};
