/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable("approval", (table) => {
    table.increments("id")
    table.integer("id_mockup").notNullable()
    table.integer("id_manager").notNullable()
    table.boolean("is_approved").notNullable()
    table.string("comments").notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTable("approval")
}
