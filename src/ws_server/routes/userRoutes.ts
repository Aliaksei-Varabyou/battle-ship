import { UserResponseData, WSRequest } from '../interfaces';
import { TYPE_REG } from '../constants';
import { handleServerError } from '../controller';
import { regUser } from '../controllers/userController';

export const handleRequestUser = (request: WSRequest): unknown => {
  try {
    let response: UserResponseData;

    if (request.type === TYPE_REG) {
      response = regUser()
    } else {
      // ToDo: we cannot be here actually
      response = {
        name: '',
        index: 0,
        error: true,
        errorText: 'Error here'
      };
    }

    return response;
  } catch (error) {
    handleServerError(request, error);
  }
};
