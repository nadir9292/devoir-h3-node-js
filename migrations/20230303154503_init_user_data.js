/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex("user").insert({
    mail: "admin",
    pseudo: "admin",
    role: 2,
    passwordHash: "admin",
    passwordSalt: "admin",
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex("user").truncate()
}
