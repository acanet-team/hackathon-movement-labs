import { setCookie } from "nookies";
import { BaseApiResponse } from "./model";
import { v4 as uuidV4 } from "uuid";
export interface IHttpOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: { [key: string]: unknown };
  contentType?: "json" | "multi-form";
  query?: { [key: string]: unknown };
  headers?: Headers;
  responseType?:
    | "json"
    | "text"
    | "formData"
    | "clone"
    | "blob"
    | "arrayBuffer";
  credentials?: "omit" | "same-origin" | "include";
  timeout?: number;
  retry?: number;
  returnRaw?: boolean;
  rawError?: boolean;
  autoQuery?: boolean;
}
class HttpClient {
  accessToken = "";
  setAuthorization = (token: string) => {
    this.accessToken = `Bearer ${token}`;
  };

  fetch = async <T>(config: IHttpOptions): Promise<T> => {
    const {
      method,
      body,
      contentType = "json",
      responseType = "json",
      headers: headersInit,
      url: originUrl,
      credentials = "same-origin",
      timeout = 0,
      retry = 0,
      rawError = true,
      /**
       * @deprecated This param has no effect on avoiding stateful service on SSR. Consumers need to explicitly pass their hostname and language
       */
      // eslint-disable-next-line
      autoQuery = false,
    } = config;
    const headers = !headersInit ? new Headers() : headersInit;
    headers.append("request-id", uuidV4());
    let url: string = "";
    if (originUrl.startsWith("/")) {
      url = process.env.NEXT_PUBLIC_API_URL + originUrl;
    } else {
      url = originUrl;
    }

    if (typeof config.query === "object") {
      let q = "";
      Object.entries(config.query).forEach(([key, value]) => {
        q = q ? q + `&${key}=${value}` : `?${key}=${value}`;
      });
      url += q;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formData =
      contentType === "multi-form" ? new FormData() : (null as any);
    if (contentType === "multi-form" && body) {
      // Object.keys(body).forEach((key) => {
      //   if (key === "images") {
      //     if (body[key] instanceof Array) {
      //       body[key].forEach((image: File) => {
      //         formData.append("images", image, image.name);
      //       });
      //     }
      //   } else {
      //     if (body[key] !== null) {
      //       formData.append(key, body[key]);
      //     }
      //   }
      // });
    } else {
      if (!headers.get("Accept")) {
        headers.append("Accept", "application/json");
      }
      if (!headers.get("Content-Type")) {
        headers.append("Content-Type", "application/json");
      }
    }

    if (this.accessToken) {
      headers.append("Authorization", `${this.accessToken}`);
    }
    const reqOptions: Pick<IHttpOptions, "method" | "headers"> & {
      body?: string | FormData;
    } = {
      method,
      headers,
    };
    if (contentType === "multi-form") {
      reqOptions.body = body as any;
    } else if (typeof body === "object") {
      reqOptions.body = JSON.stringify(body);
    }
    const requestTimeout = timeout
      ? timeout
      : Number(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
    return fetch(url, {
      ...reqOptions,
      credentials,
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 202) {
          return res;
        }
        if (res.status === 204) {
          return null;
        }
        if (rawError && res.status === 401) {
          return Promise.reject(res);
        }

        const result = await res[responseType]();
        if (res.ok) {
          return result;
        }
        if (retry > 0) {
          return this.fetch({ ...config, retry: retry - 1 });
        }
        if (rawError) {
          return Promise.reject({ ...result, statusCode: res.status });
        }
        // TODO handle error
        throw new Error(result.message || "Something went wrong", {});
      })
      .catch((error) => {
        // TODO handle error
        throw error;
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  };

  get = <T>(
    url: string,
    options?: Omit<IHttpOptions, "url" | "method" | "body" | "contentType">,
  ): BaseApiResponse<T> => {
    return this.fetch<T>({ ...options, method: "GET", url } as IHttpOptions);
  };

  post = <_U, T>(
    url: string,
    body: any,
    options?: Omit<IHttpOptions, "url" | "method" | "body">,
  ) => {
    return this.fetch<T>({
      ...options,
      method: "POST",
      url,
      body,
    } as IHttpOptions);
  };

  // get = <T>({ url, params, options }: GetRequestParams): BaseApiResponse<T> => {
  //   return this.fetch<T>({ ...options, method: "GET", url });
  // };

  // post = <T>({ url, body, options }: PostRequestParams): BaseApiResponse<T> => {
  //   return this.fetch<T>({ ...options, method: "POST", url, body });
  // };

  put = <U, T>(
    url: string,
    body: U,
    options?: Omit<IHttpOptions, "url" | "method" | "body">,
  ) => {
    return this.fetch<T>({
      ...options,
      method: "PUT",
      url,
      body,
    } as IHttpOptions);
  };

  patch = <U, T>(
    url: string,
    body: U,
    options?: Omit<IHttpOptions, "url" | "method" | "body">,
  ) => {
    return this.fetch<T>({
      ...options,
      method: "PATCH",
      url,
      body,
    } as IHttpOptions);
  };

  delete = <T>(url: string, options?: Omit<IHttpOptions, "method" | "url">) => {
    return this.fetch<T>({ ...options, method: "DELETE", url } as IHttpOptions);
  };
}

const httpClient = new HttpClient();
export default httpClient;
