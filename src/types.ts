/**
 * A RPC call is represented by sending a Request object to a Server.
 */
export type Request<T> = {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly
   * "2.0".
   */
  jsonrpc: "2.0";
  /**
   * An identifier established by the Client that MUST contain a String,
   * Number, or NULL value if included. If it is not included it is assumed to
   * be a notification. The value SHOULD normally not be Null [1] and Numbers
   * SHOULD NOT contain fractional parts
   */
  id: number | string | null;
  /**
   * A String containing the name of the method to be invoked. Method names
   * that begin with the word rpc followed by a period character (U+002E or
   * ASCII 46) are reserved for rpc-internal methods and extensions and MUST NOT
   * be used for anything else.
   */
  method: string;
  /**
   * A Structured value that holds the parameter values to be used during the
   * invocation of the method. This member MAY be omitted.
   */
  params: T;
};

export type Error<T> = {
  /**
   * A Number that indicates the error type that occurred. This MUST be an
   * integer.
   */
  code: number;
  /**
   * A String providing a short description of the error. The message SHOULD
   * be limited to a concise single sentence.
   */
  message: string;
  /**
   * A Primitive or Structured value that contains additional information
   * about the error. This may be omitted. The value of this member is
   * defined by the Server (e.g. detailed error information, nested errors
   * etc.).
   */
  data?: T;
};

/**
 * When a rpc call is made, the Server MUST reply with a Response, except for
 * in the case of Notifications.
 */
export type Response<T> = {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly
   * "2.0".
   */
  jsonrpc: "2.0";
  /**
   * An identifier established by the Client that MUST contain a String,
   * Number, or NULL value if included. If it is not included it is assumed to
   * be a notification. The value SHOULD normally not be Null [1] and Numbers
   * SHOULD NOT contain fractional parts
   */
  id: number | string;
  /**
   * This member is REQUIRED on success. This member MUST NOT exist if there
   * was an error invoking the method. The value of this member is determined
   * by the method invoked on the Server.
   */
  result?: T;
  /**
   * This member is REQUIRED on error. This member MUST NOT exist if there was
   * no error triggered during invocation. The value for this member MUST be an
   * Object as defined in section 5.1.
   */
  error?: Error<T>;
};

export type Noop = (...args: any[]) => any;

export type Responses<Methods extends Record<string, Noop>> = {
  [Method in keyof Methods]: Response<Awaited<ReturnType<Methods[Method]>>>;
};

export type Requests<Methods extends Record<string, Noop>> = {
  [Method in keyof Methods]: Parameters<Methods[Method]>;
};
