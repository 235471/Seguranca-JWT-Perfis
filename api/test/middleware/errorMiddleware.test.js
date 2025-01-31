/* eslint-disable no-undef */
const errorMiddleware = require('../../middleware/errorMiddleware');
const BaseError = require('../../Error/BaseError');

describe('Error Middleware', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  it('Deve tratar BaseError corretamente', () => {
    const error = new BaseError('Erro teste', 400);

    errorMiddleware(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Erro teste',
      details: null,
    });
  });
});
