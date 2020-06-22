'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
  it('not token to get', () => {
    return app.httpRequest()
      .get('/')
      .expect(200, {
        code: '-110',
        msg: 'Token已失效！',
        data: null,
      });

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('width token to get GET /', () => {
    return app.httpRequest()
      .get('/')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWU5N2EzZTYyNTMzNjFmNDQzZDY1NTQiLCJpYXQiOjE1OTI1Mjg3NjcsImV4cCI6MTU5NTEyMDc2N30.VYyTD-4LoD9X0DxheiMZsPMuV3bIr74xyYyfK91kMw8')
      .expect(200)
      .then(response => {
        assert(response.body, 'hello');
      });
  });
});
