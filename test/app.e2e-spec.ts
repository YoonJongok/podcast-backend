import { async } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from '../src/users/entities/user.entities';
import { getRepositoryToken } from '@nestjs/typeorm';

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'test@gmail.com',
  password: '12345',
};
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });
  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  describe('Create user', () => {
    it('should create user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation {
              createUser(
                input: {
                  email: "${testUser.email}"
                  password: "${testUser.password}"
                  username: "jongok"
                  role: Host
                }
              ) {
                ok
                error
                id
              }
            }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            createUser: { ok, error },
          } = res.body.data;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail to create, if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation {
              createUser(
                input: {
                  email: "${testUser.email}"
                  password: "${testUser.password}"
                  username: "jongok"
                  role: Host
                }
              ) {
                ok
                error
                id
              }
            }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            createUser: { ok, error },
          } = res.body.data;
          expect(ok).toBe(false);
          expect(error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
            mutation {
              login(input: { email: "${testUser.email}", password: "${testUser.password}" }) {
                ok
                error
                token
              }
            }
            
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;

          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });
    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
              mutation {
                login(input:{
                  email:"${testUser.email}",
                  password:"xxx",
                }) {
                  ok
                  error
                  token
                }
              }
            `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong password');
          expect(login.token).toBe(null);
        });
    });
  });
  describe('seeProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });
    it("should see user's profile", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
          {
            seeProfile(userId: ${userId}) {
              ok
              error
              user {
                id
              }
            }
          }
        
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            ok,
            error,
            user: { id },
          } = res.body.data.seeProfile;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(id).toBe(userId);
        });
    });
    it("should fail to see user's profile", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
        {
          seeProfile(userId: 333) {
            ok
            error
            user {
              id
            }
          }
        }
      
      `,
        })
        .expect(200)
        .expect((res) => {
          const { ok, error, user } = res.body.data.seeProfile;
          expect(ok).toBe(false);
          expect(error).toBe('User not found.');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should show me', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
        {
          me {
            email
          }
        }
        
      `,
        })
        .expect(200)
        .expect((res) => {
          const { email } = res.body.data.me;
          expect(email).toBe(testUser.email);
        });
    });
    it('should not show me, if user is not authenticated', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)

        .send({
          query: `
      {
        me {
          email
        }
      }
      
    `,
        })
        .expect(200)
        .expect((res) => {
          const { errors } = res.body;
          const [message] = errors;
          const { message: errorMessage } = message;
          expect(errorMessage).toBe('Forbidden resource');
        });
    });
  });

  describe('editProfile', () => {
    const NEW_USERNAME = 'jojo';
    it('should change username', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
          mutation {
            editProfile(input: { username: "${NEW_USERNAME}" }) {
              ok
              error
            }
          }
          
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should have new email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('x-jwt', jwtToken)
        .send({
          query: `
          {
            me {
              username
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { username },
              },
            },
          } = res;
          expect(username).toBe(NEW_USERNAME);
        });
    });
  });
});
