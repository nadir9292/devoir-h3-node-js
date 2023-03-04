/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable("user", function (table) {
    table.increments("id")
    table.string("mail").unique()
    table.string("pseudo").unique()
    table.integer("role")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.text("passwordHash")
    table.text("passwordSalt")
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTable("user")
}
