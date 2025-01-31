class Controller {
  constructor(serviceEntity) {
    this.serviceEntity = serviceEntity;
  }

  async getAll(req, res, next) {
    try {
      const registerList = await this.serviceEntity.buscarTodos(req.query);
      return res.status(200).json(registerList);
    } catch (error) {
      next(error); // Passa o erro para o middleware de erro
    }
  }

  async getOneById(req, res, next) {
    const { id } = req.params;
    try {
      const register = await this.serviceEntity.buscarPorId(id);
      return res.status(200).json(register);
    } catch (error) {
      next(error);
    }
  }

  async getByQuery(req, res, next) {
    try {
      const register = await this.serviceEntity.getByQuery(req.query);
      return res.status(200).json(register);
    } catch (error) {
      next(error);
    }
  }

  async createRegister(req, res, next) {
    const createData = req.body;

    if (!createData || Object.keys(createData).length === 0) {
      return res.status(400).json({ message: 'O corpo da requisição não pode estar vazio.' });
    }

    try {
      const createdRegister = await this.serviceEntity.cadastrar(createData);
      return res.status(201).json(createdRegister);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    const { id } = req.params; // Supondo que o identificador principal seja `id`
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'O corpo da requisição não pode estar vazio.' });
    }

    try {
      const isUpdated = await this.serviceEntity.atualizar(updateData, id);
      if (!isUpdated) {
        return res.status(400).json({ message: 'Registro não foi atualizado.' });
      }
      return res.status(200).json({ message: 'Registro atualizado com sucesso.' });
    } catch (error) {
      next(error);
    }
  }

  async deleteRegister(req, res, next) {
    const { id } = req.params; // Supondo que o identificador principal seja `id`
    try {
      const wasDeleted = await this.serviceEntity.remover(id);
      if (wasDeleted) {
        return res.status(204).send();
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
