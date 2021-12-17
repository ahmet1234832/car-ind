import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entitiy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asd@asd.com',
          password: 'asdasd',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '123123' } as User]);
      },
      // remove: (id: string) => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signUp: () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asd@asd.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asd@asd.com');
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with givne id is not found', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('SignIn updates session object and returns user', async () => {
    const session = { userId: -20 };
    const user = await controller.signIn(
      { email: 'asd@asd.com', password: 'asd' },
      { session },
    );
    expect(user).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
