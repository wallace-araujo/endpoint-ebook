import { Test, TestingModule } from '@nestjs/testing';
import { EbookService } from './ebook.service';
import { getModelToken } from '@nestjs/mongoose';
import { Ebook } from './ebook.schema';

describe('EbookService', () => {
  let service: EbookService;

  const ebookModelMock = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndRemove: jest.fn(),
    exec: jest.fn(),
    model: jest.fn(() => ebookModelMock),
  };

  const ebookMock: Ebook = {
    title: 'Test Ebook',
    description: 'Testing ebook creation',
    rented: false,
  } as Ebook;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EbookService,
        {
          provide: getModelToken('Ebook'),
          useValue: ebookModelMock,
        },
      ],
    }).compile();

    service = module.get<EbookService>(EbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an ebook', async () => {
    const createSpy = jest
      .spyOn(ebookModelMock, 'create')
      .mockResolvedValue({ ...ebookMock, _id: 'some-id' });

    const result = await service.create(ebookMock);

    expect(result).toEqual({ ...ebookMock, _id: 'some-id' });
    expect(createSpy).toHaveBeenCalledWith(ebookMock);
  });

  it('should find all ebooks', async () => {
    const findSpy = jest
      .spyOn(ebookModelMock, 'find')
      .mockResolvedValue([ebookMock]);

    const result = await service.findAll('');

    expect(result).toEqual([ebookMock]);
    expect(findSpy).toHaveBeenCalled();
  });

  it('should find an ebook by ID', async () => {
    const findByIdSpy = jest
      .spyOn(ebookModelMock, 'findById')
      .mockImplementation((id) => {
        return {
          exec: async () => {
            if (id === 'some-id') {
              return ebookMock;
            } else {
              return null;
            }
          },
        };
      });

    const result = await service.findOne('some-id');

    expect(result).toEqual(ebookMock);
    expect(findByIdSpy).toHaveBeenCalledWith('some-id');
  });

  it('should update an ebook', async () => {
    const findByIdSpy = jest
      .spyOn(ebookModelMock, 'findById')
      .mockResolvedValue({ ...ebookMock, _id: 'some-id' });
    const updateSpy = jest
      .spyOn(ebookModelMock, 'findByIdAndUpdate')
      .mockResolvedValue({ ...ebookMock, _id: 'some-id', ...ebookMock });

    const result = await service.update('some-id', ebookMock);

    expect(result).toEqual({ ...ebookMock, _id: 'some-id', ...ebookMock });
    expect(findByIdSpy).toHaveBeenCalledWith('some-id');
    expect(updateSpy).toHaveBeenCalledWith('some-id', ebookMock, { new: true });
  });

  it('should remove an ebook', async () => {
    const findByIdSpy = jest
      .spyOn(ebookModelMock, 'findById')
      .mockResolvedValue(ebookMock);
    const removeSpy = jest
      .spyOn(ebookModelMock, 'findByIdAndRemove')
      .mockResolvedValue({});

    await service.remove('some-id');

    expect(findByIdSpy).toHaveBeenCalledWith('some-id');
    expect(removeSpy).toHaveBeenCalledWith('some-id');
  });

  it('should check if an ebook is rented', async () => {
    const findByIdSpy = jest
      .spyOn(ebookModelMock, 'findById')
      .mockResolvedValue(ebookMock);

    const result = await service.isEbookRented('some-id');

    expect(result).toEqual(false);
    expect(findByIdSpy).toHaveBeenCalledWith('some-id');
  });
});
