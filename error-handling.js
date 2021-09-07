class HttpException {
  constructor(message) {
    this.message = message;
  }
}

class HttpNotFoundException extends HttpException {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

class HttpForbiddenException extends HttpException {
  constructor(message) {
    super(message);
    this.code = 403;
  }
}

class HttpBadRequestException extends HttpException {
  constructor(message) {
    super(message);
    this.code = 400;
  }
}

module.exports = {
  HttpException,
  HttpNotFoundException,
  HttpForbiddenException,
  HttpBadRequestException
}

