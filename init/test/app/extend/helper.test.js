'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/extend/helper.test.js', () => {
  it('get 6 random number', () => {
    const ctx = app.mockContext();
    assert(/^\d{6}$/.test(ctx.helper.randomNum(6)));
  });

  it('get need time format', () => {
    const ctx = app.mockContext();
    assert(/^(\d{4})\/(\d{2})\/(\d{2})$/.test(ctx.helper.dateFormat()));
  });
});
