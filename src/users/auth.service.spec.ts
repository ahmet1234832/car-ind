import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entitiy';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of theusers service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('asdasd@asda.com', 'asdasd');
    expect(user.password).not.toEqual('asdasd');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws and error if user signs up with email that is in use', async () => {
    service.signUp('asdasd@asda.com', 'asdasd');
    try {
      await service.signUp('asdasd@asda.com', 'asdasd');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('it throws if signin is called within unused email', (done) => {
    service.signIn('asdasd@asda.com', '123123123123').catch((e) => done());
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('asdasd@asd.com', 'asdasd');
    try {
      await service.signIn('asdadasd@asdad.com', 'asdasd');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('returns a user if correct password is provided', async () => {
    await service.signUp('a', 'mypassword');

    // const user = await service.signin('a', 'a');
    const user = await service.signIn('a', 'mypassword');
    expect(user).toBeDefined();
  });
});
