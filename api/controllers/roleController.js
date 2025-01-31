const Controller = require('./Controller');
const RoleService = require('../services/roleService');
class RoleController extends Controller {
  constructor() {
    super(new RoleService());
  }
}

module.exports = RoleController;
