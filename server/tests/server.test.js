const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

const todos = [
  {
    _id: new ObjectID(),
    text: 'first todo'
  },
  {
    _id: new ObjectID(),
    text: 'second todo'
  }
]

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      Todo.insertMany(todos)
    })
    .then(() => done())
})

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'test todo text'

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(3)
            expect(todos[2].text).toBe(text)
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should not create a todo if not valid', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2)
            done()
          })
          .catch(e => done())
      })
  })
})

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo not found', done => {
    var hexId = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 for non-object id', done => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:id', () => {
  // it('should delete a todo doc', done => {
  //   var hexId = todos[0]._id.toHexString()
  //   request(app)
  //     .delete(`todos/${hexId}`)
  //     .expect(200)
  //     .expect(res => {
  //       expect(res.body.todo._id).toBe(hexId)
  //     })
  //     .end((err, res) => {
  //       if (err) {
  //         return done(err)
  //       }
  //       Todo.findById(hexId)
  //         .then(todo => {
  //           expect(todo).toNotExist()
  //           done()
  //         })
  //         .catch(e => done(e))
  //     })
  // })

  it('should remove a todo', done => {
    var hexId = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toNotExist()
            done()
          })
          .catch(e => done(e))
      })
  })

  it('should return 404 if toto not found', done => {
    var hexId = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })
  it('should return 404 for invalid object id', done => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done)
  })
})
