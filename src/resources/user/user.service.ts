import db from '../../localDB';

const userService = db.createService(db.COLLECTION_CONSTANTS.USERS);

export default userService;