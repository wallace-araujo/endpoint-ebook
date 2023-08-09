import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';

describe('UserService', () => {
  let service: UserService;

  const userModelMock = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    exec: jest.fn(),
    model: jest.fn(() => userModelMock),
  };

  const userMock: User = {
    _id: '6189ba477252779e70d314e8',
    email: 'test@example.com',
    password: 'hashedPassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createSpy = jest
      .spyOn(userModelMock, 'create')
      .mockResolvedValue({ ...userMock, _id: 'some-id' });

    const result = await service.create(userMock);

    expect(result).toEqual({ ...userMock, _id: 'some-id' });
    expect(createSpy).toHaveBeenCalledWith(userMock);
  });

  it('should find all users', async () => {
    const findSpy = jest
      .spyOn(userModelMock, 'find')
      .mockResolvedValue([userMock]);

    const result = await service.findAll();

    expect(result).toEqual([userMock]);
    expect(findSpy).toHaveBeenCalled();
  });

  it('should find a user by ID', async () => {
    const findByIdSpy = jest
      .spyOn(userModelMock, 'findById')
      .mockResolvedValue(userMock);

    const result = await service.findById('some-id');

    expect(result).toEqual(userMock);
    expect(findByIdSpy).toHaveBeenCalledWith('some-id');
  });

  it('should remove a user', async () => {
    const findByIdSpy = jest
      .spyOn(userModelMock, 'findById')
      .mockResolvedValue(userMock);
    const removeSpy = jest
      .spyOn(userModelMock, 'findByIdAndRemove')
      .mockResolvedValue({});

    await service.remove('some-id');

    expect(findByIdSpy).toHaveBeenCalledWith('some-id');
    expect(removeSpy).toHaveBeenCalledWith('some-id');
  });
});
