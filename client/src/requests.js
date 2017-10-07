const Requests = {
  get: request => handleRequest({ ...request }),
  post: request => handleRequest({ method: 'post', ...request }),
  put: request => handleRequest({ method: 'put', ...request }),
  delete: request => handleRequest({ method: 'delete', ...request }),
};

const handleRequest = async(request) => {
  const response = await buildRequest(request)();
  const json = await response.json();
  return json;
};

const buildRequest = ({ url, method = 'GET', ...request}) => {
  const headers = request.headers ? buildHeaders(request.headers) : null;
  const body = request.body ? buildBody(request.body) : null;
  const requestOptions = { method };
  if (headers) requestOptions.headers = headers;
  if (body) requestOptions.body = body;
  return function() {
    return fetch(url, requestOptions);
  }
};

const buildHeaders = (headers) => {
  const compiledHeaders = new Headers();
  for (const header of Object.keys(headers)) {
    compiledHeaders.append(header, headers[header]);
  }
  return compiledHeaders;
};

const buildBody = (body) => {
  const compiledBody = new FormData();
  for (const field of Object.keys(body)) {
    compiledBody.append(field, body[field]);
  }
  return compiledBody;
};

export default Requests;
