// Mongoose schema summary (also defined in backend models)

/*
Employee:
  - _id: ObjectId
  - name: String (required)

Task:
  - _id: ObjectId
  - title: String (required)
  - description: String
  - status: enum('pending','in-progress','completed')
  - employeeId: ObjectId -> Employee
  - createdAt: Date

Relationship: 1 Employee -> many Tasks (task.employeeId references employee._id)

Use `node ../backend/seed/seed.js` to populate sample data.
*/

module.exports = {};
