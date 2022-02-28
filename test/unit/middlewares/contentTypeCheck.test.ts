// @ts-expect-error ts-migrate(6200) FIXME: Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const chai = require('chai')
const { expect } = chai
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const chaiHttp = require('chai-http')

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const app = require('../../../server')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const authService = require('../../../services/authService')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const addUser = require('../../utils/addUser')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const cleanDb = require('../../utils/cleanDb')
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const config = require('config')
const cookieName = config.get('userToken.cookieName')

chai.use(chaiHttp)

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('contentTypeCheck', function () {
  let jwt

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(async function () {
    const userId = await addUser()
    jwt = authService.generateAuthToken({ userId })
  })

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
  afterEach(async function () {
    await cleanDb()
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should return 415 error when content-type application/json is not passed', function (done) {
    chai
      .request(app)
      .post('/users')
      .set('content-type', 'application/xml')
      .send()
      .end((err, res) => {
        if (err) { return done(err) }

        expect(res).to.have.status(415)
        expect(res.body).to.be.a('object')
        expect(res.body).to.eql({
          statusCode: 415,
          error: 'Unsupported Media Type',
          message: 'Invalid content-type header: application/xml, expected: application/json or multipart/form-data'
        })

        return done()
      })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should process the request when no content-type is passed', function (done) {
    chai
      .request(app)
      .get('/healthcheck')
      .end((err, res) => {
        if (err) { return done(err) }

        expect(res).to.have.status(200)

        return done()
      })
  })

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('should process the request when content-type application/json is passed', function (done) {
    chai
      .request(app)
      .patch('/users/self')
      .set('cookie', `${cookieName}=${jwt}`)
      .send({
        first_name: 'Test first_name'
      })
      .end((err, res) => {
        if (err) { return done(err) }

        expect(res).to.have.status(204)

        return done()
      })
  })
})
