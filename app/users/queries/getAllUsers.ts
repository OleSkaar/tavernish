import db from "db"

export default async function getAllUsers() {
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  })

  return users
}
