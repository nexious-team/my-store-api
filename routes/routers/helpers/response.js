module.exports = {
  [200]: (message = "Success", payload = true) => {
    return {
      message,
      payload
    }
  },
  [400]: (error = "Bad request") => {
    return {
      error
    }
  },
  [401]: (error = "Unauthorized") => {
    return {
      error
    }
  },
  [403]: (error = "Forbidden") => {
    return {
      error
    }
  },
  [404]: (error = "Not found") => {
    return {
      error
    }
  }
}