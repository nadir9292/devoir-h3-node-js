/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable("mockup", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.string("title").notNullable()
    table.string("artist").notNullable()
    table.string("state").notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema.dropTable("mockup")
}
