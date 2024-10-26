import { UserResponseData, WSRequest, WSResponse } from '../interfaces';
import { TYPE_REG } from '../constants';
import { handleServerError } from '../controller';
import { regUser } from '../controllers/userController';

export const handleRequestUser = (request: WSRequest): WSResponse | undefined => {
  try {
    let userResponse: UserResponseData;

    if (request.type === TYPE_REG) {
      userResponse = regUser(JSON.parse(request.data));
    } else {
      // we cannot be here actually
      userResponse = {
        name: '',
        index: 0,
        error: true,
        errorText: 'Smth wrong with User registration happens'
      };
    }
    const response: WSResponse = {
      type: TYPE_REG,
      data: JSON.stringify(userResponse),
      id: 0,
    }

    return response;
  } catch (error) {
    handleServerError(request, error);
  }
};
