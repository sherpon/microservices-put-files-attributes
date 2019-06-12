// Get Development Env
require('./utilities/getEnv')();

const getToken = require('./utilities/getToken');
const getFirestore = require('./db/getFirestore');
const saveAttributes = require('./db/saveAttributes');
const getAuthorization = require('./services/getAuthorization');

let firestore;

const saveAttributesStep = async (req, res) => {
  try {
    const websiteId = req.query.websiteId;
    const fileId = req.body.id;
    const type = req.body.type;
    const filename = req.body.filename;
    /* page's attributes */
    const url = req.body.url;
    const title = req.body.title;
    const keywords = req.body.keywords;
    const description = req.body.description;
    const themeColor = req.body.themeColor;
    const meta = req.body.meta;
    const script = req.body.script;
    const style = req.body.style;
    firestore = getFirestore(firestore);
    await saveAttributes(
      firestore, 
      websiteId, 
      /* fielId */ fileId,
      /* fileType */ type, 
      /* filename */ filename, 
      url, 
      title,
      keywords,
      description,
      themeColor,
      meta,
      script,
      style
    );
    res.status(204);
    res.end();  // send no content
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getAuthorizationStep = async (req, res) => {
  try {
    const userId = req.query.userId;
    const websiteId = req.query.websiteId;
    const token = req.userToken;
    const response = await getAuthorization(token, userId, websiteId);
    if (response.status===202) {
      // authorized
      await saveAttributesStep(req, res);
    } else {
      // unauthorized
      console.log('the user ' + userId + ' is unauthorized');
      res.status(406);
      res.end();  // send no content
    }
  } catch (error) {
    console.error(error);
    res.status(401);
    res.end();  // send no content
  }
};

const getTokenStep = async (req, res) => {
  const myAuthentication = getToken(req.headers);
  if (myAuthentication===false) {
    // didn't find any token
    res.status(401);
    res.end();  // send no content
  } else {
    // populate it
    req.userToken = myAuthentication.token;
    await getAuthorizationStep(req, res);
    // saveAttributesStep(req, res); /** IMPORTANT */
  }
};

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.putFilesAttributes = async (req, res) => {
  // const token = req.userToken;
  // const userId = req.query.userId;
  // const websiteId = req.query.websiteId;
  // const type = req.body.type;
  // const filename = req.body.filename;
  /* page's attributes */
  // const url = req.body.url;
  // const title = req.body.title;
  // x const keywords = req.body.keywords;
  // x const description = req.body.description;
  // x const themeColor = req.body.themeColor;
  // x const metaData = req.body.metaData;
  // x const script = req.body.script;
  // x const style = req.body.style;

  // Set CORS headers for preflight requests
  res.set('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
  res.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204)
    res.end();
  } else {
    await getTokenStep(req, res);
  }
};