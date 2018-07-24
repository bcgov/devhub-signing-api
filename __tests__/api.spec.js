
//
// Code Signing
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Jason Leach on 2018-07-20.
//

import { default as request } from 'supertest'; // eslint-disable-line
import app from '../src';

jest.mock('../src/libs/db/models/job');

describe('Test monitoring routes', () => {
  test('The readiness probe should respond with 200 ', async () => {
    const response = await request(app).get('/api/v1/ehlo');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test job routes', () => {
  test('Test jobId must be present', async () => {
    const response = await request(app)
      .put('/api/v1/job')
      .send({});
    expect(response.statusCode).toBe(404); // Not Found
  });

  test('Test job object must be in the request body', async () => {
    const response = await request(app)
      .put('/api/v1/job/10');
    expect(response.statusCode).toBe(400); // Bad Request
  });

  test('Test job request body contains all required fields', async () => {
    const response = await request(app)
      .put('/api/v1/job/10')
      .set('content-type', 'application/json')
      .send({
        job: {
          name: 'moon',
          type: 'cake',
        },
      });
    expect(response.statusCode).toBe(400); // Bad Request
  });

  test('Test job request body fields are accepted', async () => {
    const response = await request(app)
      .put('/api/v1/job/10')
      .set('content-type', 'application/json')
      .send({
        job: {
          deliveryFileName: 'moon',
          deliveryFileEtag: 'cake',
        },
      });
    expect(response.statusCode).toBe(200); // Ok
  });
});

describe('Test signing routes', () => {
  test('Job 10 status should be 202 ', async () => {
    const response = await request(app).get('/api/v1/job/10/status');
    expect(response.statusCode).toBe(202);
    expect(response.body.status).toBe('Processing');
  });

  test('Job 20 status should be 200 ', async () => {
    const response = await request(app).get('/api/v1/job/20/status');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Completed');
  });

  test('Job 30 status should be 404 ', async () => {
    const response = await request(app).get('/api/v1/job/40/status');
    expect(response.statusCode).toBe(404);
  });
});