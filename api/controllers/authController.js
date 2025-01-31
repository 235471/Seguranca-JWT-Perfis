const AuthService = require('../services/authService');

const authService = new AuthService();

class AuthController {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const login = await authService.login({ email, senha });

      res.status(200).send(login);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
