/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex("user").insert({
    mail: "admin",
    pseudo: "admin",
    role: 2,
    passwordHash: "dpozadjzadjdfsq",
    passwordSalt: "oiazfnugtbgdjvwd",
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.raw("TRUNCATE TABLE user")
}
