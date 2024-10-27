export const TYPE_REG = 'reg';
export const TYPE_CREATE_ROOM = 'create_room';
export const TYPE_ADD_USER_2_ROOM = 'add_user_to_room';
export const TYPE_CREATE_GAME = 'create_game';
export const TYPE_START_GAME = 'start_game';
export const TYPE_TURN = 'turn';
export const TYPE_ATTACK = 'attack';
export const TYPE_FINISH = 'finish';
export const TYPE_UPD_WINNERS = 'update_winners';
export const TYPE_UPD_ROOM = 'update_room';

export const USER_TYPES = [TYPE_REG];
export const ROOM_TYPES = [TYPE_CREATE_ROOM, TYPE_ADD_USER_2_ROOM];
export const GAME_TYPES = [TYPE_CREATE_GAME, TYPE_START_GAME, TYPE_TURN, TYPE_ATTACK, TYPE_FINISH];
export const ALL_TYPES = [TYPE_UPD_ROOM, TYPE_UPD_WINNERS];
